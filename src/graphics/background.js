import { lerp, hexToRgb } from '../utils.js';
import { BIOME_DATA } from '../data/biomes.js';
import { calculateGroundY } from '../logic/geography.js';
import { consumableDB } from '../data/items.js';

// 기존 배열(로직용) + ★ 그리드 맵(렌더링용) 추가
export let landscapes = [], trees = [], grassBlades = [], stars = [], clouds = [], ruins = [], fences = [], activeSpawns = [];
let treeGrid = {}, grassGrid = {}, fenceGrid = {}; // 최적화용 공간 분할 맵
const GRID_SIZE = 2500; // 2500px 단위로 구역을 나눔

// [1] 환경 분석 (패럴랙스 보정)
function getBiomeAt(x, depth = 1.0) {
    const worldX = x / (depth || 0.001); 
    for (const key in BIOME_DATA) {
        const [start, end] = BIOME_DATA[key].range;
        if (worldX >= start && worldX < end) return key;
    }
    return "PLAINS";
}

function getLocalEnvironment(x, depth = 1.0) {
    const worldX = x / (depth || 0.001); 
    const blendDist = 2000;
    let r = 0, g = 0, b = 0;
    let desertFactor = 0;
    let totalWeight = 0;

    for (const key in BIOME_DATA) {
        const data = BIOME_DATA[key];
        const [start, end] = data.range;
        if (worldX >= start - blendDist && worldX <= end + blendDist) {
            let dist = 0;
            if (worldX < start) dist = start - worldX;
            else if (worldX > end) dist = worldX - end;
            let weight = 1.0 - (dist / blendDist);
            if (weight > 0) {
                weight = (1 - Math.cos(weight * Math.PI)) / 2;
                const c = hexToRgb(data.ground);
                r += c[0]*weight; g += c[1]*weight; b += c[2]*weight;
                if (key === "DESERT") desertFactor += weight;
                totalWeight += weight;
            }
        }
    }
    if (totalWeight > 0) { r/=totalWeight; g/=totalWeight; b/=totalWeight; }
    else { const d = hexToRgb(BIOME_DATA.PLAINS.ground); r=d[0]; g=d[1]; b=d[2]; }
    return { color: [r, g, b], desertFactor: Math.min(1, desertFactor) };
}

// [2] 하늘색
export function getCurrentSkyColors(h, w) {
    if (w.id === "glitch") return { top: [0,0,0], bot: [45,0,90], sun: [0,255,255] };
    if (w.id === "blood-moon") return { top: [20,0,0], bot: [100,0,0], sun: [255,0,0] };
    if (w.id === "thunder") return { top: [10,10,25], bot: [40,45,70], sun: [200,220,255] };
    if (w.id === "rain") return { top: [30,40,50], bot: [80,90,110], sun: [180,180,180] };
    const isNight = (h < 6 || h > 18);
    return isNight ? { top: [5,5,20], bot: [20,20,50], sun: [255,255,255] } : { top: [100,180,255], bot: [190,230,255], sun: [255,255,200] };
}

export function getGroundY(x, depth=1.0) { return calculateGroundY(x, window.innerHeight, depth); }

// ==========================================================================================
// [GENERATION] 월드 생성 (그리드 등록 최적화)
// ==========================================================================================
export function generateNature(canvas, vfxCanvas, W, H, WORLD_WIDTH) { 
    W = window.innerWidth; H = window.innerHeight; 
    canvas.width = W; canvas.height = H; vfxCanvas.width = W; vfxCanvas.height = H;
    
    // 데이터 초기화
    landscapes=[]; trees=[]; grassBlades=[]; stars=[]; clouds=[]; ruins=[]; fences=[]; activeSpawns=[];
    // ★ 그리드 초기화
    treeGrid = {}; grassGrid = {}; fenceGrid = {};

    const density = (/Android|iPhone/i.test(navigator.userAgent)) ? 0.4 : 1.2; 

    // 하늘
    for (let i=0; i<2000; i++) stars.push({x:Math.random()*WORLD_WIDTH, y:Math.random()*H*0.8, size:Math.random()*2+0.5, alpha:Math.random()});
    for (let i=0; i<150; i++) clouds.push({x:Math.random()*WORLD_WIDTH, y:Math.random()*H*0.4, size:Math.random()*120+80, speed:Math.random()*0.6+0.2});

    const layers = [
        { color: [40,45,60], depth: 0.15, step: 250, treeProb: 0.04 },
        { color: [30,35,50], depth: 0.35, step: 180, treeProb: 0.10 },
        { color: [25,50,40], depth: 0.70, step: 100, treeProb: 0.15 },
        { color: [20,40,25], depth: 1.0,  step: 60,  treeProb: 0.20 } 
    ];

    layers.forEach(l => {
        let pts=[]; for(let x=-W; x<=WORLD_WIDTH+W; x+=l.step) pts.push({x, y:calculateGroundY(x, H, l.depth)});
        landscapes.push({color:l.color, points:pts, depth:l.depth});

        const spawnStep = 60; 
        for(let x=0; x<WORLD_WIDTH; x+=spawnStep/density) {
            
            const env = getLocalEnvironment(x, l.depth);
            const biome = getBiomeAt(x, l.depth);

            // 유적
            if (l.depth < 0.8 && Math.random() < 0.01) {
                ruins.push({x, y:0, w:Math.random()*60+80, h:Math.random()*400+600, type:Math.random()<0.4?"arch":"pillar", depth:l.depth, tone:Math.random()*30-15, isTall:Math.random()<0.7});
            }

            // 울타리
            if (l.depth === 1.0 && biome === "PLAINS" && Math.random() < 0.02) {
                const count = 3 + Math.floor(Math.random() * 3);
                for (let k=0; k<count; k++) {
                    const fence = {x: x + k*40, depth: l.depth, seed: Math.random()};
                    fences.push(fence);
                    // ★ 그리드 등록
                    const gridKey = Math.floor(fence.x / GRID_SIZE);
                    if(!fenceGrid[gridKey]) fenceGrid[gridKey] = [];
                    fenceGrid[gridKey].push(fence);
                }
                x += count * 40; continue; 
            }

            // 나무
            let chance = l.treeProb * (1.0 - env.desertFactor);
            if(biome==="MAGIC_FOREST") chance*=1.2;
            let isCactus = false, isGiant = false;

            if(env.desertFactor > 0.6) { chance = 0.04 * env.desertFactor; isCactus = true; } 
            else { if(l.depth >= 0.7 && Math.random() < 0.003) { isGiant = true; chance = 1.0; } }

            if(Math.random() < chance) {
                let sizeMult = (Math.random()*0.5 + 0.8);
                if (isGiant) sizeMult = 3.5 + Math.random();

                const t = {
                    id: trees.length, baseX: x + (Math.random()-0.5)*40,
                    size: sizeMult * (l.depth*0.6+0.4), 
                    biome: biome, layerDepth: l.depth, 
                    seed: Math.random()*99999,
                    isCactus: isCactus, isGiant: isGiant
                };
                trees.push(t);
                if(isGiant) x += 400; 

                // ★ 그리드 등록 (baseX 기준)
                const gridKey = Math.floor(t.baseX / GRID_SIZE);
                if(!treeGrid[gridKey]) treeGrid[gridKey] = [];
                treeGrid[gridKey].push(t);
            }

            // 풀
            if(l.depth>=0.7 && env.desertFactor < 0.8) {
                const dens = (biome==="PLAINS"||biome==="MAGIC_FOREST") ? 10 : 3;
                const adjDens = dens * (1.0 - env.desertFactor);
                for(let j=0; j<adjDens*density; j++) {
                    const g = {
                        id:grassBlades.length, baseX:x+Math.random()*spawnStep,
                        h:Math.random()*15+10, w:Math.random()*2+1.5,
                        swayOffset:Math.random()*Math.PI*2, layerDepth:l.depth,
                        isFlower: (biome==="PLAINS"||biome==="MAGIC_FOREST") && Math.random()<0.10,
                        flowerColor: Math.random()
                    };
                    grassBlades.push(g);
                    
                    // ★ 그리드 등록 (가장 중요: 개체수가 많으므로 필수)
                    const gridKey = Math.floor(g.baseX / GRID_SIZE);
                    if(!grassGrid[gridKey]) grassGrid[gridKey] = [];
                    grassGrid[gridKey].push(g);
                }
            }
            
            // 회전초 (회전초는 움직이므로 그리드 제외하고 그냥 리스트 순회 - 개체수가 적음)
            if(env.desertFactor > 0.7 && l.depth===1.0 && Math.random()<0.02) {
                grassBlades.push({
                    id:grassBlades.length, baseX:x, h:30, w:30, 
                    swayOffset:0, layerDepth:l.depth, isTumbleweed:true,
                    speed: (Math.random() + 0.8) * 2, seed: Math.random()
                });
            }
        }
    });
}

// ==========================================================================================
// [RENDERING] 렌더링 최적화 (그리드 기반 조회)
// ==========================================================================================

export function renderTrees(ctx, layerIndex, fogRgb, cameraX, currentParallaxY, currentFog, currentSnow, hours, globalRenderTime, currentWeather) {
    const layer = landscapes[layerIndex];
    if (!layer) return;

    const offsetX = -cameraX * layer.depth;
    const offsetY = -currentParallaxY * 50 * layer.depth;
    const distanceFog = (1 - layer.depth) * 0.9;
    const haze = Math.min(1.0, distanceFog + (currentFog * 0.8));
    
    const adjustColor = (r, g, b, a = 1) => {
        return `rgba(${Math.round(lerp(r, fogRgb[0], haze))},${Math.round(lerp(g, fogRgb[1], haze))},${Math.round(lerp(b, fogRgb[2], haze))},${a})`;
    };

    // ★ [최적화] 현재 화면에 보이는 그리드 인덱스 계산
    // Parallax 좌표계 역산: 화면의 왼쪽(0)과 오른쪽(W)이 월드 좌표상 어디인지?
    // 보이는 WorldX = ScreenX / depth + cameraX (대략적)
    // 실제로는 baseX가 월드 좌표이므로, 화면에 들어오는지 검사해야 함.
    // 화면 범위: 0 ~ ctx.canvas.width
    // 물체 화면 X = baseX - cameraX * depth
    // 0 < baseX - cameraX * depth < Width
    // cameraX * depth < baseX < Width + cameraX * depth
    // baseX 범위 = [cameraX * depth, (cameraX + Width) * depth] 가 아니라
    // Parallax 식: ScreenX = (WorldX - CameraX) * Depth  (이게 일반적) -> 우리 코드: ScreenX = WorldX - CameraX * Depth
    // 즉, WorldX = ScreenX + CameraX * Depth
    
    const startWorldX = cameraX * layer.depth - 200; // 여유분 200
    const endWorldX = startWorldX + ctx.canvas.width + 400; // 화면 너비만큼 + 여유분

    const startKey = Math.floor(startWorldX / GRID_SIZE);
    const endKey = Math.floor(endWorldX / GRID_SIZE);

    // 1. 울타리 렌더링 (그리드 조회)
    for(let k = startKey; k <= endKey; k++) {
        if(!fenceGrid[k]) continue;
        fenceGrid[k].forEach(f => {
            if(f.depth !== layer.depth) return;
            const wy = calculateGroundY(f.x, ctx.canvas.height, layer.depth);
            const fx = f.x + offsetX; const fy = wy + offsetY;
            renderFence(ctx, fx, fy, adjustColor, f.seed);
        });
    }

    // 2. 나무 렌더링 (그리드 조회)
    for(let k = startKey; k <= endKey; k++) {
        if(!treeGrid[k]) continue;
        treeGrid[k].forEach(t => {
            if(t.layerDepth !== layer.depth) return;

            const wy = calculateGroundY(t.baseX, ctx.canvas.height, layer.depth);
            t.x = t.baseX + offsetX; 
            t.y = wy + offsetY;

            ctx.save();
            ctx.translate(t.x, t.y);
            
            const heightType = Math.floor(t.seed % 3); 
            let heightMult = t.isGiant ? 1.0 : (heightType === 0 ? 0.75 : heightType === 1 ? 1.0 : 1.35);
            const flip = (Math.floor(t.seed / 10) % 2 === 0) ? 1 : -1;
            ctx.scale(t.size * heightMult * flip, t.size * heightMult);

            const time = globalRenderTime; 

            if (t.isCactus) {
                renderSaguaro(ctx, adjustColor, t.seed);
            } else {
                // 1. 현재 나무 위치의 환경 색상(풀 색상)을 가져옵니다.
                // (풀이 사용하는 로직과 동일)
                const env = getLocalEnvironment(t.baseX, layer.depth); 
                
                // 2. 나무 기둥 색상 (기존 유지)
                let trunkTheme;
                const tSeed = Math.floor(t.seed % 4);
                if (tSeed === 0) trunkTheme = [90, 70, 50]; 
                else if (tSeed === 1) trunkTheme = [70, 50, 40]; 
                else if (tSeed === 2) trunkTheme = [100, 80, 60]; 
                else trunkTheme = [80, 70, 60]; 

                // 3. ★ 나뭇잎 색상 결정 (여기가 핵심!)
                let leafTheme;

                if (t.biome === "MAGIC_FOREST") {
                    // 마법 숲: 고정 색상 (형광/핑크)
                    leafTheme = (t.seed % 2 === 0) ? [100, 220, 255] : [255, 130, 200]; 
                } 
                else if (t.biome === "FROZEN_MOUNTAIN") {
                    // 눈 지형: 고정 색상 (흰색)
                    leafTheme = [220, 240, 255]; 
                } 
                else {
                    // ★ 나머지(평원, 사막, 폐허, 오염 등): "지형 색상(env.color)"을 따라갑니다!
                    // env.color는 [r, g, b] 형태입니다.
                    // 나무마다 약간의 랜덤성(v)을 섞어 줍니다.
                    const v = (t.seed % 40) - 20; // -20 ~ +20 변동

                    // 지형 색상을 베이스로 잡고, 약간 더 어둡거나 진하게 조정
                    // (풀보다는 나무가 보통 조금 더 진하므로 0.8~0.9 곱해줌)
                    leafTheme = [
                        Math.max(0, env.color[0] + v), 
                        Math.max(0, env.color[1] + v), 
                        Math.max(0, env.color[2] + v)
                    ];
                }

                // 4. 그리기 함수 호출
                switch(t.biome) {
                    case "FROZEN_MOUNTAIN":
                        if (t.seed % 10 < 4) renderLeaflessTree(ctx, adjustColor, time, t.seed);
                        else renderSpruceTree(ctx, adjustColor, currentSnow, t.seed);
                        break;
                    case "MAGIC_FOREST":
                        renderStructuralTree(ctx, adjustColor, time, t.seed, "MAGIC", leafTheme, trunkTheme);
                        break;
                    case "CORRUPTED":
                        // 오염 지형은 텐타클 나무지만, 혹시 일반 나무가 섞여 나와도 색이 맞게 됨
                        renderTentacleTree(ctx, adjustColor, time, t.seed);
                        break;
                    default:
                        // RUINS, PLAINS, DESERT 등 모든 일반 지형
                        if (t.seed % 10 === 0) renderBirchTree(ctx, adjustColor, time, t.seed);
                        else renderStructuralTree(ctx, adjustColor, time, t.seed, t.isGiant ? "GIANT" : "NORMAL", leafTheme, trunkTheme);
                }
            }
            ctx.restore();
        });
    }
}

// [6] 풀 & 꽃 렌더링 (그리드 조회 최적화)
export function renderGrass(ctx, fogRgb, cameraX, currentParallaxY, currentFog, currentSnow, windTime, currentWeather, hours, W, globalRenderTime, biomeMgr, targetDepth) {
    let removeIndices = [];

    // 1. 회전초는 움직이므로 기존 배열 사용 (수량 적음)
    grassBlades.forEach((g, index) => {
        if (!g.isTumbleweed) return; // 회전초만 처리
        if (g.layerDepth !== targetDepth) return;

        g.baseX += g.speed; 
        const groundY = calculateGroundY(g.baseX, ctx.canvas.height, g.layerDepth);
        g.x = g.baseX - cameraX * g.layerDepth;
        g.y = groundY - currentParallaxY * 50 * g.layerDepth;

        if (g.x > W + 200 || g.x < -200) { removeIndices.push(index); return; }

        const roll = (g.baseX * 0.05); 
        const bounce = Math.abs(Math.sin(g.baseX * 0.03)) * 8; 

        ctx.save(); ctx.translate(g.x, g.y - 12 - bounce); ctx.rotate(roll);
        ctx.strokeStyle = `rgb(110, 90, 60)`; ctx.lineWidth = 1.2;
        for(let k=0; k<5; k++) { ctx.beginPath(); ctx.ellipse(0, 0, 12, 8, k * (Math.PI/2.5), 0, Math.PI*2); ctx.stroke(); }
        ctx.restore();
    });
    for (let i = removeIndices.length - 1; i >= 0; i--) grassBlades.splice(removeIndices[i], 1);

    // 2. ★ 일반 풀은 그리드 조회 (수량 엄청 많음 -> 최적화 핵심)
    const startWorldX = cameraX * targetDepth - 100;
    const endWorldX = startWorldX + W + 200;
    const startKey = Math.floor(startWorldX / GRID_SIZE);
    const endKey = Math.floor(endWorldX / GRID_SIZE);

    for(let k = startKey; k <= endKey; k++) {
        if(!grassGrid[k]) continue;
        
        // forEach 대신 for문 사용 (조금 더 빠름)
        const chunk = grassGrid[k];
        for(let i=0; i<chunk.length; i++) {
            const g = chunk[i];
            if (g.layerDepth !== targetDepth) continue;

            const groundY = calculateGroundY(g.baseX, ctx.canvas.height, g.layerDepth);
            g.x = g.baseX - cameraX * g.layerDepth;
            g.y = groundY - currentParallaxY * 50 * g.layerDepth;

            // 화면 밖이면 그리기 스킵 (이중 체크)
            if (g.x < -50 || g.x > W + 50) continue;

            const env = getLocalEnvironment(g.baseX, g.layerDepth);
            let r = env.color[0]; let gr = env.color[1]; let b = env.color[2];

            const lFog = (1 - g.layerDepth) * 0.5 + currentFog;
            const finalR = lerp(r, fogRgb[0], lFog);
            const finalG = lerp(gr, fogRgb[1], lFog);
            const finalB = lerp(b, fogRgb[2], lFog);

            ctx.fillStyle = `rgb(${Math.round(finalR)},${Math.round(finalG)},${Math.round(finalB)})`;

            const sway = Math.sin(windTime + g.swayOffset) * 6;
            
            if (g.isFlower) {
                ctx.beginPath(); ctx.moveTo(g.x, g.y + 3); 
                ctx.lineTo(g.x + sway, g.y - g.h);
                ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 2; ctx.stroke();
                ctx.fillStyle = g.flowerColor > 0.5 ? "#FFD700" : "#E0B0FF"; 
                ctx.beginPath(); ctx.arc(g.x + sway, g.y - g.h, 3, 0, Math.PI*2); ctx.fill();
            } else {
                ctx.beginPath();
                ctx.moveTo(g.x - 2, g.y + 5); 
                ctx.lineTo(g.x + 2, g.y + 5);
                ctx.quadraticCurveTo(g.x + sway, g.y - g.h * 0.7, g.x + sway * 1.5, g.y - g.h);
                ctx.fill(); 
            }
        }
    }
}

// -----------------------------------------------------------
// [아래 상세 함수들은 변경 없음 - 그대로 유지]
// -----------------------------------------------------------

function renderFence(ctx, x, y, col, seed) {
    const wood = col(100, 80, 60); ctx.fillStyle = wood;
    ctx.fillRect(x-5, y-35, 10, 35);
    if(seed > 0.3) ctx.fillRect(x-20, y-25, 45, 5);
    if(seed < 0.7) ctx.fillRect(x-20, y-12, 45, 5);
}

// ★ [개선됨] 구조적 나무 (높이/비율 다양화 + 색상 적용 + 플랫 디자인)
function renderStructuralTree(ctx, col, time, seed, type="NORMAL", leafRgb=[50,120,50], trunkRgb=[85,65,45]) {
    const isGiant = type === "GIANT";
    
    // 줄기 색 (단색)
    const trunkColor = col(trunkRgb[0], trunkRgb[1], trunkRgb[2]);
    // 잎 색 (단색)
    const leafColor = col(leafRgb[0], leafRgb[1], leafRgb[2]);

    const rng = (offset) => Math.sin(seed * 999 + offset) * 12345 % 1;
    
    // 나무 비율 다양화 (키가 작으면 퍼지고, 크면 좁게)
    const heightType = Math.floor(seed % 3);
    const spreadFactor = (heightType === 0) ? 1.3 : (heightType === 2) ? 0.7 : 1.0;

    function drawBranch(len, width, angle, depth) {
        ctx.save();
        const sway = Math.sin(time * 0.015 + depth + seed) * (0.01 + depth * 0.005);
        ctx.rotate(angle + sway);

        // 플랫 디자인 줄기 (그라데이션 제거)
        ctx.fillStyle = trunkColor;
        ctx.beginPath();
        ctx.moveTo(-width/2, 0); 
        ctx.lineTo(width/2, 0);
        ctx.lineTo(width * 0.4, -len);
        ctx.lineTo(-width * 0.4, -len);
        ctx.fill();

        ctx.translate(0, -len);

        if (depth > 0) {
            const branchCount = 2 + (Math.abs(rng(depth)) > 0.7 ? 1 : 0);
            for (let i = 0; i < branchCount; i++) {
                const dir = (i / (branchCount - 1)) - 0.5;
                const spread = (1.0 + rng(depth * 10) * 0.3) * spreadFactor;
                const nextAngle = dir * spread; 
                const nextLen = len * (0.7 + rng(depth * 20) * 0.2);
                const nextWidth = width * 0.65;
                drawBranch(nextLen, nextWidth, nextAngle, depth - 1);
            }
        } else {
            // 잎 (단색, 그림자 제거)
            if (type === "MAGIC") {
                ctx.shadowBlur = 15; 
                ctx.shadowColor = `rgba(${leafRgb[0]}, ${leafRgb[1]}, ${leafRgb[2]}, 0.8)`;
            }
            ctx.fillStyle = leafColor;
            
            for(let k=0; k<4; k++) {
                const lx = rng(k)*25; const ly = rng(k+1)*20;
                ctx.beginPath();
                ctx.arc(lx, ly - 5, 20 + rng(k+2)*10, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
        }
        ctx.restore();
    }

    const startLen = isGiant ? 110 : (70 + Math.abs(rng(0))*30);
    const startWidth = isGiant ? 35 : 15;
    const startDepth = isGiant ? 5 : 3;
    drawBranch(startLen, startWidth, 0, startDepth);
}

function renderBirchTree(ctx, col, time, seed) {
    const trunk = col(230, 230, 220); const black = col(40, 40, 40); const leaf = col(160, 220, 80);
    const sway = Math.sin(time * 0.02 + seed) * 0.05; ctx.rotate(sway);
    ctx.fillStyle = trunk; ctx.beginPath(); ctx.moveTo(-6,0); ctx.lineTo(6,0); ctx.lineTo(3,-140); ctx.lineTo(-3,-140); ctx.fill();
    ctx.strokeStyle = black; ctx.lineWidth = 1.5; for(let y=10; y<130; y+=10 + (seed%10)) { ctx.beginPath(); ctx.moveTo(-4, -y); ctx.lineTo(4, -y); ctx.stroke(); }
    ctx.translate(0, -140); ctx.fillStyle = leaf; ctx.beginPath(); ctx.ellipse(0, 0, 35, 60, 0, 0, Math.PI*2); ctx.fill();
}
function renderLeaflessTree(ctx, col, time, seed) {
    const trunkColor = col(70, 70, 80); const rng = (o) => Math.sin(seed*77+o)*123%1;
    function draw(len, w, ang, d) {
        ctx.save(); ctx.rotate(ang); ctx.fillStyle = trunkColor;
        ctx.beginPath(); ctx.moveTo(-w/2,0); ctx.lineTo(w/2,0); ctx.lineTo(w*0.3,-len); ctx.lineTo(-w*0.3,-len); ctx.fill();
        ctx.translate(0,-len);
        if(d>0) { const cnt = 2 + (rng(d)>0.5?1:0); for(let i=0; i<cnt; i++) draw(len*0.7, w*0.6, ((i/(cnt-1))-0.5)*1.2, d-1); }
        ctx.restore();
    }
    draw(70, 12, 0, 3);
}
function renderSpruceTree(ctx,col,snow,seed) {
    ctx.fillStyle = col(50,40,30); ctx.fillRect(-6,-160,12,160); const needle = col(30,60,45); const sn = col(240,250,255,0.9);
    for(let i=0; i<8; i++) { const y=-20-i*20, w=70-i*8; ctx.fillStyle=needle; ctx.beginPath(); ctx.moveTo(0,y-30); ctx.lineTo(w,y); ctx.lineTo(-w,y); ctx.fill(); if(snow>0.2){ ctx.fillStyle=sn; ctx.beginPath(); ctx.moveTo(0,y-30); ctx.lineTo(w*0.6,y-10); ctx.lineTo(-w*0.6,y-10); ctx.fill(); } }
}
function renderSaguaro(ctx,col,seed) { const c = col(60,120,60); ctx.fillStyle=c; ctx.strokeStyle=c; ctx.lineWidth=22; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-110); ctx.stroke(); if(seed%2>0.5) { ctx.beginPath(); ctx.moveTo(0,-50); ctx.lineTo(-35,-50); ctx.lineTo(-35,-80); ctx.stroke(); } if(seed%3>1) { ctx.beginPath(); ctx.moveTo(0,-70); ctx.lineTo(35,-70); ctx.lineTo(35,-100); ctx.stroke(); } }
function renderTentacleTree(ctx,col,time,seed) { const c=col(50,0,70); ctx.fillStyle=c; const s=Math.sin(time*0.04)*15; ctx.beginPath(); ctx.moveTo(-10,0); ctx.quadraticCurveTo(-20,-60,s,-140); ctx.quadraticCurveTo(20,-60,10,0); ctx.fill(); }

// [8] 랜드 렌더링
export function renderLand(ctx, layer, index, fogRgb, cameraX, currentParallaxY, currentFog, W, H, biomeMgr) { 
    if (!layer || layer.points.length < 2) return;
    let offsetX = -cameraX * layer.depth; let offsetY = -currentParallaxY * 50 * layer.depth; 
    
    ctx.beginPath();
    ctx.moveTo(layer.points[0].x + offsetX, H + 500);
    layer.points.forEach(p => ctx.lineTo(p.x + offsetX, p.y + offsetY));
    ctx.lineTo(layer.points[layer.points.length-1].x + offsetX, H + 500); ctx.closePath();
    
    // ★ 3-Point Gradient Sampling with Parallax Correction
    // ScreenX를 WorldX로 역산할 때 depth를 적용해야 함
    // WorldX = ScreenX / Depth + CameraX (가 아니라 반대임)
    // Parallax Equation: ScreenX = (WorldX - CameraX) * Depth
    // WorldX = ScreenX / Depth + CameraX
    
    // 왼쪽 끝 화면 좌표(0)에 해당하는 월드 좌표
    const startWorldX = (0 / layer.depth) + cameraX;
    // 중간 화면 좌표(W/2)에 해당하는 월드 좌표
    const midWorldX = ((W / 2) / layer.depth) + cameraX;
    // 오른쪽 끝 화면 좌표(W)에 해당하는 월드 좌표
    const endWorldX = (W / layer.depth) + cameraX;

    // getLocalEnvironment는 이미 x / depth 보정을 내장하고 있지 않으므로
    // 여기서 보정된 worldX를 넘기되, 함수 내부에서 또 보정하지 않도록 depth=1.0으로 호출해야 함.
    // 하지만 위에서 getLocalEnvironment(x, depth)를 만들었으므로
    // 차라리 "화면 좌표 기준 X"를 넘기고 함수 안에서 depth로 나누게 하는 게 일관성 있음.
    // 따라서, 여기서는 역산하지 않고 "생성시 좌표값 기준"으로 호출함.
    
    // landscapes에 저장된 points는 생성 시점의 x좌표를 가지고 있음.
    // 하지만 그라데이션은 화면 전체에 칠해야 하므로, 현재 카메라가 보고 있는 '월드 범위'를 알아야 함.
    // 위 식 (WorldX = ScreenX / Depth + CameraX)가 맞음.
    // 그리고 getLocalEnvironment는 (x, depth)를 받아서 x / depth를 수행함.
    // 즉, 여기에 ScreenX + CameraX * Depth를 넘기면?? -> 복잡해짐.
    
    // 간소화: getLocalEnvironment를 "월드 절대 좌표"를 받는 녀석으로 정의했음 (x / depth 수행함)
    // 따라서 여기서는 '보정 전의 값'을 넘겨야 함.
    // 생성 루프에서 x는 절대 좌표였음.
    // 렌더링 시에는 카메라가 이동함.
    
    // 올바른 호출:
    // depth가 0.7인 레이어의 화면 왼쪽 끝(0)은 월드 좌표상 어디인가?
    // ScreenX = (WorldX - CameraX) * Depth
    // 0 = (WorldX - CameraX) * Depth -> WorldX = CameraX
    // W = (WorldX - CameraX) * Depth -> WorldX = CameraX + W / Depth
    
    // 즉, 레이어가 깊을수록(0.1) 더 넓은 월드 범위를 보여줌.
    // getLocalEnvironment는 x / depth를 수행하므로, 우리는 그냥 (CameraX + ScreenX) * Depth를 넘겨야...
    // 아님. 함수 내부 로직: x / depth.
    // 우리가 원하는 건 WorldX.
    // 입력값 V를 줬을 때 V / depth = WorldX가 되어야 함.
    // V = WorldX * depth.
    
    // WorldX(Left) = CameraX
    // Input(Left) = CameraX * depth
    
    const c1 = getLocalEnvironment(cameraX * layer.depth, layer.depth).color;
    const c2 = getLocalEnvironment((cameraX + W/2) * layer.depth, layer.depth).color;
    const c3 = getLocalEnvironment((cameraX + W) * layer.depth, layer.depth).color;
    
    const haze = Math.min(1.0, (1.0 - layer.depth) * 0.8 + (currentFog * 0.8));
    const applyFog = (c) => `rgb(${Math.round(lerp(c[0], fogRgb[0], haze))},${Math.round(lerp(c[1], fogRgb[1], haze))},${Math.round(lerp(c[2], fogRgb[2], haze))})`;

    let grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, applyFog(c1));
    grad.addColorStop(0.5, applyFog(c2));
    grad.addColorStop(1, applyFog(c3));
    
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.globalCompositeOperation = 'multiply';
    let vGrad = ctx.createLinearGradient(0, 0, 0, H);
    vGrad.addColorStop(0, "rgba(255,255,255,1)");
    vGrad.addColorStop(0.5, "rgba(200,200,200,1)");
    vGrad.addColorStop(1, "rgba(100,100,100,1)");
    ctx.fillStyle = vGrad;
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
}