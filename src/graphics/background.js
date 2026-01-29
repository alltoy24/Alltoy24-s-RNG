import { lerp, hexToRgb } from '../utils.js';
import { GRAPHICS } from '../settings.js';

export let landscapes = [], trees = [], grassBlades = [], stars = [], clouds = [], ruins = []; // 배열 미리 선언

const skyKeyframes = [ 
    { h: 0, top: [2, 1, 17], bot: [25, 22, 84], sun: [255, 255, 255] }, 
    { h: 5, top: [32, 28, 41], bot: [61, 48, 86], sun: [255, 255, 255] }, 
    { h: 6, top: [75, 56, 76], bot: [253, 94, 83], sun: [255, 87, 34] }, 
    { h: 8, top: [135, 206, 235], bot: [224, 246, 255], sun: [255, 215, 0] }, 
    { h: 12, top: [0, 180, 219], bot: [0, 131, 176], sun: [255, 255, 204] }, 
    { h: 16, top: [135, 206, 235], bot: [224, 246, 255], sun: [255, 215, 0] }, 
    { h: 18, top: [253, 94, 83], bot: [75, 56, 76], sun: [255, 69, 0] }, 
    { h: 19, top: [32, 28, 41], bot: [61, 48, 86], sun: [255, 255, 255] }, 
    { h: 24, top: [2, 1, 17], bot: [25, 22, 84], sun: [255, 255, 255] } 
];

export function getCurrentSkyColors(preciseHour, currentWeather) { 
    // ★ [기믹 4] 글리치 날씨 전용 기괴한 하늘색
    if(currentWeather.id === "glitch") return { top: [0, 0, 0], bot: [139, 0, 139], sun: [255, 0, 255] };
    if(currentWeather.id === "eclipse") return { top: [15, 5, 10], bot: [40, 15, 20], sun: [255, 120, 50] };
    if(currentWeather.id === "blood-moon") return { top: [35, 0, 0], bot: [80, 10, 10], sun: [255, 0, 0] };
    if(currentWeather.id === "thunder") return { top: [17, 17, 21], bot: [27, 39, 53], sun: [255, 255, 255] };
    if(currentWeather.id === "cloudy" || currentWeather.id === "foggy") return { top: [84, 110, 122], bot: [176, 190, 197], sun: [255, 255, 255] };

    let prev = skyKeyframes[0], next = skyKeyframes[skyKeyframes.length - 1]; 
    for (let i = 0; i < skyKeyframes.length - 1; i++) { 
        if (preciseHour >= skyKeyframes[i].h && preciseHour <= skyKeyframes[i+1].h) { prev = skyKeyframes[i]; next = skyKeyframes[i+1]; break; } 
    } 
    let factor = (preciseHour - prev.h) / (next.h - prev.h); 
    
    let top = [Math.round(lerp(prev.top[0], next.top[0], factor)), Math.round(lerp(prev.top[1], next.top[1], factor)), Math.round(lerp(prev.top[2], next.top[2], factor))]; 
    let bot = [Math.round(lerp(prev.bot[0], next.bot[0], factor)), Math.round(lerp(prev.bot[1], next.bot[1], factor)), Math.round(lerp(prev.bot[2], next.bot[2], factor))]; 
    let sun = [Math.round(lerp(prev.sun[0], next.sun[0], factor)), Math.round(lerp(prev.sun[1], next.sun[1], factor)), Math.round(lerp(prev.sun[2], next.sun[2], factor))]; 
    return { top, bot, sun }; 
}

// ★ [최적화] 배경 생성 함수 (모바일은 개수 대폭 감소)
export function generateNature(canvas, vfxCanvas, W, H, WORLD_WIDTH) { 
    W = window.innerWidth; 
    H = window.innerHeight; 
    canvas.width = W; 
    canvas.height = H; 
    vfxCanvas.width = W; 
    vfxCanvas.height = H;
    
    landscapes = []; trees = []; grassBlades = []; stars = []; clouds = []; ruins = []; 
    const extW = WORLD_WIDTH + W;
    const offsetX = -W;

    // 1. 모바일 감지 및 밀도 설정
    // 모바일이면 0.3 (30%), PC면 1.0 (100%)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const density = isMobile ? 0.3 : 1.0; 

    // 2. 별 생성 (개수 조절: 600개 -> 모바일은 약 180개)
    for (let i = 0; i < 600 * density; i++) {
        stars.push({ 
            x: Math.random() * extW, 
            y: Math.random() * H, 
            size: Math.random() * 2, 
            alpha: Math.random() 
        }); 
    }

    // 3. 구름 생성 (개수 조절: 40개 -> 모바일은 약 12개)
    for(let i=0; i < 40 * density; i++) {
        clouds.push({
            x: Math.random() * extW, 
            y: Math.random() * H * 0.4, 
            size: Math.random() * 60 + 40, 
            speed: Math.random() * 0.5 + 0.1 
        });
    }

    // 4. 유적(Ruins) 생성 (개수 조절)
    // 원경 유적
    for(let i=0; i < 8 * density; i++) {
        ruins.push({ x: (Math.random() * extW) - (W * 0.5), y: H * 0.95, w: Math.random() * 50 + 70, h: Math.random() * 300 + 400, type: "pillar", depth: Math.random() * 0.05 + 0.1, tone: -30, isTall: Math.random() < 0.8 });
    }
    // 중경 유적
    for(let i=0; i < 12 * density; i++) {
        let isArch = Math.random() < 0.4;
        ruins.push({ x: (Math.random() * extW) - (W * 0.5), y: H * 1.05, w: isArch ? (Math.random() * 90 + 90) : (Math.random() * 50 + 50), h: Math.random() * 400 + 400, type: isArch ? "arch" : "pillar", depth: Math.random() * 0.1 + 0.25, tone: -10, isTall: Math.random() < 0.4 });
    }
    // 근경 유적
    for(let i=0; i < 10 * density; i++) {
        let isArch = Math.random() < 0.3;
        ruins.push({ x: (Math.random() * extW) - (W * 0.5), y: H * 1.15, w: isArch ? (Math.random() * 110 + 100) : (Math.random() * 70 + 60), h: Math.random() * 500 + 500, type: isArch ? "arch" : "pillar", depth: Math.random() * 0.2 + 0.5, tone: 10, isTall: Math.random() < 0.2 });
    }

    // 5. 지형 및 나무/풀 생성
    
    // (1) 먼 뒷산
    let mountainsBack = { color: [40, 45, 60], points: [], depth: 0.15, baseFog: 0.8 }; 
    for (let x = offsetX; x <= extW; x += 40) { 
        let y = H * 0.4 - Math.sin(x * 0.002) * 150 - Math.cos(x * 0.005) * 50; 
        mountainsBack.points.push({ x: x, y: y }); 
    } 
    landscapes.push(mountainsBack); 

    // (2) 앞산
    let mountainsFront = { color: [30, 35, 50], points: [], depth: 0.35, baseFog: 0.6 }; 
    for (let x = offsetX; x <= extW; x += 35) { 
        let y = H * 0.55 - Math.cos(x * 0.004) * 100 + Math.sin(x * 0.01) * 30; 
        mountainsFront.points.push({ x: x, y: y }); 
    } 
    landscapes.push(mountainsFront); 

    // (3) 언덕 및 나무
    let plains = { color: [25, 50, 30], points: [], depth: 0.7, baseFog: 0.3 }; 
    for (let x = offsetX; x <= extW; x += 30) { 
        let y = H * 0.7 + Math.sin(x * 0.003) * 50; 
        plains.points.push({ x: x, y: y }); 
        
        // ★ [나무 생성 확률 조절]
        // 기존 0.2(20%) -> 모바일은 0.06(6%)로 감소
        if (Math.random() < 0.2 * density) {
            trees.push({ id: trees.length, layer: 2, baseX: x, baseY: y, size: Math.random() * 0.6 + 0.9, type: Math.floor(Math.random()*3) }); 
        }
    } 
    landscapes.push(plains); 

    // (4) 바닥(플레이어 땅) 및 풀
    let hills = { color: [20, 40, 25], points: [], depth: 1.0, baseFog: 0.1 }; 
    for (let x = offsetX; x <= extW; x += 25) { 
        // 평탄화된 지형 공식
        let baseY = H * 0.82;
        let wave1 = Math.cos(x * 0.0007) * 12;
        let wave2 = Math.sin(x * 0.003) * 5;
        let wave3 = Math.cos(x * 0.01) * 2;
        let y = baseY + wave1 + wave2 + wave3;
        hills.points.push({ x: x, y: y }); 

        // ★ [풀 생성 확률 조절]
        // 기존 0.9(90%) -> 모바일은 0.27(27%)로 감소
        if (Math.random() < 0.9 * density) {
            // 한 번에 심는 개수도 8개에서 모바일은 줄임 (밀도 반영)
            let count = isMobile ? 3 : 8; 
            for (let g = 0; g < count; g++) {
                grassBlades.push({ 
                    id: grassBlades.length, 
                    baseX: x + Math.random() * 20, 
                    baseY: y + Math.random() * 10, 
                    h: Math.random() * 20 + 15, 
                    swayOffset: Math.random() * 100 
                });
            }
        }
    } 
    landscapes.push(hills); 
}

// 💡 [수정] 마우스 원근감이 아닌, 실제 '월드 X 좌표'에 따른 지형 높이 반환
export function getGroundY(worldX) {
    if (!landscapes || !landscapes[3] || !landscapes[3].points) {
        return 500; 
    }
    let layer = landscapes[3]; // 메인 언덕 레이어
    let p1 = layer.points[0];
    let p2 = layer.points[1];

    for (let i = 0; i < layer.points.length - 1; i++) {
        if (layer.points[i].x <= worldX && layer.points[i+1].x >= worldX) {
            p1 = layer.points[i];
            p2 = layer.points[i+1];
            break;
        }
    }
    // 선형 보간으로 정확한 높이 계산
    let t = (worldX - p1.x) / (p2.x - p1.x);
    return lerp(p1.y, p2.y, t);
}

// ★ [최종 수정판 5] 줄무늬 고정 (Texture Locking) 패치
export function renderRuins(ctx, cameraX, currentParallaxY, currentFog, fogRgb, minD, maxD, W, H) {
    ctx.save();
    let layerRuins = ruins.filter(r => r.depth >= minD && r.depth < maxD);
    layerRuins.sort((a, b) => a.depth - b.depth);

    for(let rObj of layerRuins) {
        let px = rObj.x - cameraX * rObj.depth; 
        let py = rObj.y - (currentParallaxY * 40 * rObj.depth); 
        
        let topY = rObj.isTall ? -5000 : (py - rObj.h);

        if (px < -rObj.w * 1.5 || px > W + rObj.w * 1.5) continue;

        let haze = Math.max(0, 1 - rObj.depth * 1.2); haze = Math.min(1, haze + currentFog * 0.7);
        
        let baseTone = 160 + rObj.tone;
        let baseColor = [baseTone, baseTone - 5, baseTone - 10];

        let r = lerp(baseColor[0], fogRgb[0], haze);
        let g = lerp(baseColor[1], fogRgb[1], haze);
        let b = lerp(baseColor[2], fogRgb[2], haze);
        
        let shadowColor = `rgb(${r*0.5}, ${g*0.5}, ${b*0.5})`;
        let midColor = `rgb(${r*0.8}, ${g*0.8}, ${b*0.8})`;
        let highlightColor = `rgb(${r*1.05}, ${g*1.05}, ${b*1.05})`;
        let deepCrackColor = `rgba(0,0,0, ${0.3 * rObj.depth})`;

        function drawMonolith(x, yBottom, yTop, w) {
            let height = yBottom - yTop;

            // 1. 기둥 몸통
            let grad = ctx.createLinearGradient(x, 0, x + w, 0);
            grad.addColorStop(0, shadowColor);
            grad.addColorStop(0.3, midColor);
            grad.addColorStop(0.7, highlightColor);
            grad.addColorStop(1, shadowColor);
            ctx.fillStyle = grad;
            ctx.fillRect(x, yTop, w, height);

            // 2. 지층 무늬 (★ 핵심 수정: 기둥 위치에 고정시킴)
            ctx.fillStyle = deepCrackColor;
            
            // 화면에 보이는 영역 계산
            let drawStart = Math.max(topY, -100);
            let drawEnd = Math.min(py, H + 100);

            // ★ [패치] 무늬가 시작되는 기준점을 기둥의 바닥(py)에 맞춰서 계산 (Texture Locking)
            // 이렇게 하면 cy 루프가 항상 기둥의 특정 지점에서 시작되므로 무늬가 따라다님
            let step = 15; // 무늬 간격
            let offset = py % step; 
            // drawStart보다 크거나 같은 첫 번째 '고정된' 좌표 찾기
            let loopY = drawStart - (drawStart % step) + offset;
            if(loopY < drawStart) loopY += step;

            for(let cy = loopY; cy < drawEnd; cy += step) {
                // ★ [패치] sin 함수 안에 들어가는 값도 (cy - py)로 상대 좌표 사용
                // 이제 카메라가 움직여도 (cy - py) 값은 일정하므로 무늬가 안 움직임
                let relY = cy - py; 
                let thickness = Math.sin(relY * 0.02 + rObj.x*0.01) * 4 + 5; 
                
                if (thickness > 6) { 
                        ctx.fillRect(x, cy, w, thickness * 0.4);
                }
            }
        }

        if (rObj.type === "pillar") {
            let pX = px - rObj.w/2;
            drawMonolith(pX, py, topY, rObj.w);

            if (!rObj.isTall) {
                ctx.fillStyle = shadowColor;
                ctx.beginPath();
                ctx.moveTo(pX, topY);
                ctx.lineTo(pX + rObj.w * 0.3, topY - rObj.w*0.05);
                ctx.lineTo(pX + rObj.w * 0.7, topY + rObj.w*0.02);
                ctx.lineTo(pX + rObj.w, topY);
                ctx.lineTo(pX + rObj.w, topY + rObj.depth*10); 
                ctx.lineTo(pX, topY + rObj.depth*10);
                ctx.closePath();
                ctx.fill();
            }

        } else {
            let colW = rObj.w * 0.25; 
            let leftColX = px - rObj.w/2;
            let rightColX = px + rObj.w/2 - colW;
            let archBaseY = py - rObj.h;
            let archThickness = colW; 

            drawMonolith(leftColX, py, rObj.isTall ? -5000 : archBaseY, colW);
            drawMonolith(rightColX, py, rObj.isTall ? -5000 : archBaseY, colW);

            if (!rObj.isTall) {
                ctx.fillStyle = midColor;
                ctx.fillRect(leftColX - colW*0.2, archBaseY - archThickness, rObj.w + colW*0.4, archThickness);
                ctx.fillStyle = shadowColor;
                ctx.fillRect(leftColX - colW*0.2, archBaseY - archThickness*0.2, rObj.w + colW*0.4, archThickness*0.2);
            }
        }
    }
    ctx.restore();
}

// ★ [수정] 지형 렌더링 (화려한 그래픽 옵션 적용)
export function renderLand(ctx, layer, index, fogRgb, cameraX, currentParallaxY, currentSnow, currentFog, W, H, hours, WORLD_WIDTH) { 
    if (!layer) return;
    let offsetX = -cameraX * layer.depth; 
    let offsetY = -currentParallaxY * 50 * layer.depth; 
    ctx.beginPath(); ctx.moveTo(offsetX - W, H + 500); 
    for (let i = 0; i < layer.points.length - 1; i++) {
        let p1 = layer.points[i], p2 = layer.points[i+1]; let cpX = (p1.x + p2.x) / 2, cpY = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x + offsetX, p1.y + offsetY, cpX + offsetX, cpY + offsetY);
    }
    ctx.lineTo(WORLD_WIDTH + offsetX + W, H); ctx.closePath();
    
    let [r, g, b] = layer.color; 
    let isNight = (hours < 6 || hours > 18); 
    let darkFactor = isNight ? 0.25 : 1.0; 
    r *= darkFactor; g *= darkFactor; b *= darkFactor; 
    
    if (index < 2) { let s = 0.5 + (currentSnow * 0.5); r = lerp(r, 255, s); g = lerp(g, 255, s); b = lerp(b, 255, s); } 
    else { r = lerp(r, 255, currentSnow); g = lerp(g, 255, currentSnow); b = lerp(b, 255, currentSnow); } 
    
    let haze = Math.min(1.0, layer.baseFog + (currentFog * 0.8)); 
    r = lerp(r, fogRgb[0], haze); g = lerp(g, fogRgb[1], haze); b = lerp(b, fogRgb[2], haze); 
    
    // ★ [핵심] 화려한 그래픽이 켜져 있을 때만 그라데이션 사용
    if (GRAPHICS.fancyGraphics) {
        let grad = ctx.createLinearGradient(0, H * 0.4, 0, H);
        grad.addColorStop(0, `rgb(${r},${g},${b})`);
        grad.addColorStop(1, `rgb(${r * 0.5},${g * 0.5},${b * 0.5})`);
        ctx.fillStyle = grad; 
    } else {
        // 꺼져 있으면 그냥 단색 (성능 UP)
        ctx.fillStyle = `rgb(${r},${g},${b})`;
    }
    ctx.fill(); 
}

export function renderTrees(ctx, layerIndex, fogRgb, cameraX, currentParallaxY, currentFog, currentSnow, hours, globalRenderTime, currentWeather) { 
    let layer = landscapes[layerIndex]; 
    if (!layer) return;

    let offsetX = -cameraX * layer.depth; 
    let offsetY = -currentParallaxY * 50 * layer.depth + 2; 
    let haze = Math.min(1.0, layer.baseFog + (currentFog * 0.8)); 
    let isNight = (hours < 6 || hours > 18); 
    
    // ★★★ [수정] 이 줄을 꼭 추가하세요! (ctx한테 W값을 물어봐서 가져옴)
    let W = ctx.canvas.width; 

    trees.forEach(t => { 
        t.x = t.baseX + offsetX; 
        t.y = t.baseY + offsetY; 

        // 이제 W를 아니까 에러가 안 납니다!
        if (t.x < -100 || t.x > W + 100) return;

        let scale = t.size; let trunkH = 50 * scale, trunkW = 12 * scale; let foliageR = 30 * scale; 
        let tr=50, tg=30, tb=20; tr = lerp(tr, fogRgb[0], haze); tg = lerp(tg, fogRgb[1], haze); tb = lerp(tb, fogRgb[2], haze); 
        
        ctx.fillStyle = `rgb(${tr},${tg},${tb})`; ctx.fillRect(t.x - trunkW/2, t.y - trunkH, trunkW, trunkH); 
        
        let lr=isNight?10:46, lg=isNight?30:122, lb=isNight?10:50; 
        lr = lerp(lr, fogRgb[0], haze); lg = lerp(lg, fogRgb[1], haze); lb = lerp(lb, fogRgb[2], haze); 
        ctx.fillStyle = `rgb(${lr},${lg},${lb})`; 
        
        ctx.beginPath(); ctx.moveTo(t.x, t.y - trunkH - foliageR); ctx.arc(t.x, t.y - trunkH - foliageR*0.7, foliageR, 0, Math.PI * 2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(t.x - foliageR*0.6, t.y - trunkH, foliageR*0.7, 0, Math.PI * 2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(t.x + foliageR*0.6, t.y - trunkH, foliageR*0.7, 0, Math.PI * 2); ctx.fill(); 
        
        if (currentSnow > 0.1) { ctx.fillStyle = `rgba(255,255,255,${currentSnow * (1 - haze)})`; ctx.beginPath(); ctx.arc(t.x, t.y - trunkH - foliageR*0.7, foliageR*0.8, Math.PI, 0); ctx.fill(); } 

        if (isNight && currentWeather.id !== "rain" && currentWeather.id !== "snow" && GRAPHICS.showFireflies) {
            ctx.save();
            ctx.fillStyle = "#b3e5fc";
            if (!GRAPHICS.simpleProjectiles) {
                ctx.shadowBlur = 10; ctx.shadowColor = "#b3e5fc";
            }
            for(let f=0; f<3; f++) {
                let flyTime = globalRenderTime * 0.02 + t.id + f * 5;
                let fx = t.x + Math.sin(flyTime * 1.3) * (40 * scale);
                let fy = t.y - trunkH - (20 * scale) + Math.cos(flyTime * 0.8) * (30 * scale);
                ctx.globalAlpha = Math.max(0, (Math.sin(flyTime * 3) + 1) / 2); 
                ctx.beginPath();
                ctx.arc(fx, fy, 1.5 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }); 
}


// [최적화] 풀 렌더링 (LOD: Level of Detail 적용)
export function renderGrass(ctx, fogRgb, cameraX, currentParallaxY, currentFog, currentSnow, windTime, currentWeather, hours, W) { 
    let layer = landscapes[3]; 
    if (!landscapes[3]) return;
    let offsetX = -cameraX * layer.depth; 
    let offsetY = -currentParallaxY * 50 * layer.depth; 
    
    // 간소화 모드인지 미리 체크
    const isSimple = (typeof GRAPHICS !== 'undefined' && GRAPHICS.simpleProjectiles); // 공격 간소화 옵션 재활용하거나 새로 파도 됨

    let haze = 0;
    if (GRAPHICS.showGrass) {
        haze = Math.min(1.0, layer.baseFog + (currentFog * 0.8)); 
        ctx.lineWidth = 1.5; 
        ctx.lineCap = "round";
    }

    grassBlades.forEach(g => { 
        g.x = g.baseX + offsetX; 
        g.y = g.baseY + offsetY; 

        if (!GRAPHICS.showGrass) return;
        // 화면 밖 Culling (여유 범위 50px)
        if (g.x < -50 || g.x > W + 50) return;

        // 흔들림 계산
        g.sway = Math.sin(windTime + g.swayOffset) * (currentWeather.id === "wind" ? 12 : 4); 
        
        // 색상 계산 (기존 코드와 동일)
        let r = 20, gr = 80, b = 40; 
        let darkFactor = (hours < 6 || hours > 18) ? 0.25 : 1.0; 
        r *= darkFactor; gr *= darkFactor; b *= darkFactor; 
        r = lerp(r, 255, currentSnow); gr = lerp(gr, 255, currentSnow); b = lerp(b, 255, currentSnow); 
        r = lerp(r, fogRgb[0], haze); gr = lerp(gr, fogRgb[1], haze); b = lerp(b, fogRgb[2], haze); 
        
        ctx.strokeStyle = `rgb(${r},${gr},${b})`; 
        ctx.beginPath(); 
        ctx.moveTo(g.x, g.y); 
        
        // ★ [최적화 핵심] 간소화 모드거나 풀이 아주 작으면 '곡선' 대신 '직선'으로 그림
        if (isSimple || currentSnow > 0.8) { 
            // 눈 많이 오거나 간소화면 직선 (빠름)
            ctx.lineTo(g.x + g.sway, g.y - g.h); 
        } else {
            // 평소엔 곡선 (예쁨)
            ctx.quadraticCurveTo(g.x + g.sway / 2, g.y - g.h / 1.5, g.x + g.sway, g.y - g.h); 
        }
        ctx.stroke(); 
    }); 
}