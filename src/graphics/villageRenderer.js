import { getGroundY } from './background.js';
import { getAsset } from '../managers/assetManager.js';

// 마을 데이터 정의
const VILLAGE_DATA = [
    {

        // [배치 팁]
        // depth: -1 (집보다 뒤에 있는 배경 오브젝트)
        // depth: 0  (기본값, 집 등)
        // depth: 1  (집보다 앞에 있는 가로등)
        // depth: 2  (가장 앞에 있는 빛 효과)

        id: "plains_spawn",
        biome: "PLAINS",
        x: 150000, 
        buildings: [  
            { type: "light", xOffset: 200, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: 1200, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: 2200, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: 3200, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: 4200, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: 5200, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: 6200, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: 7200, scale: 0.5, depth: 1 },  
            { type: "light", xOffset: -800, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: -1800, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: -2800, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: -3800, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: -4800, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: -5800, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: -6800, scale: 0.5, depth: 1 }, 
            { type: "light", xOffset: -7800, scale: 0.5, depth: 1 }, 
            
            { type: "construct_sign", xOffset: -200, scale: 0.1, depth: 0 }, 
            {
                type: "light_source", 
                xOffset: -450, yOffset: -50,
                radius: 120, 
                color: "rgba(255, 150, 50, 0.6)", 
                effect: "flicker", depth: 2
            }
        ]
    }
];

export function renderVillages(ctx, cameraX, parallaxY, W, H) {
    VILLAGE_DATA.forEach(village => {
        // 화면 밖 최적화
        if (village.x < cameraX - 4000 || village.x > cameraX + W + 4000) return;

        const renderX = village.x - cameraX;
        const groundY = getGroundY(village.x);
        
        // 땅(Ground) 레이어와 동기화 (바닥에 고정)
        const renderY = groundY - (parallaxY * 50); 

        ctx.save();
        ctx.translate(renderX, renderY);

        // ★ [핵심] Depth 정렬 로직
        // 원본 배열을 건드리지 않기 위해 복사본([...])을 만들어서 정렬합니다.
        // 오름차순 정렬: 작은 수(-1) -> 큰 수(1) 순서로 그림
        const sortedBuildings = [...village.buildings].sort((a, b) => {
            const depthA = a.depth || 0; // depth가 없으면 0으로 취급
            const depthB = b.depth || 0;
            return depthA - depthB;
        });

        // 정렬된 순서대로 그리기
        sortedBuildings.forEach(b => {
            ctx.save();
            // yOffset 적용
            ctx.translate(b.xOffset, b.yOffset || 0); 
            
            // 조명 그리기
            if (b.type === "light_source") {
                drawLightSource(ctx, b);
            } 
            // 건물/이미지 그리기
            else {
                const img = getAsset(b.type);
                if (img) {
                    const w = img.width * b.scale;
                    const h = img.height * b.scale;
                    // 이미지 바닥 중앙 기준
                    ctx.drawImage(img, -w/2, -h, w, h);
                } else {
                    // Fallback (이미지 없을 때)
                    if (b.type === "world_tree") {
                        ctx.scale(b.scale, b.scale); 
                        drawNaturalWorldTree(ctx); // (이 함수는 기존 코드에 유지되어 있어야 함)
                    }
                    else if (b.type === "spawn_flag") drawSpawnArch(ctx);
                    else if (b.type === "house_basic") drawSimpleHouse(ctx);
                    else if (b.type === "shop_tent") drawTent(ctx);
                }
            }

            ctx.restore();
        });

        ctx.restore();
    });
}

// ========================================================
// ★ [신규] 조명 렌더링 함수 (Light Renderer)
// ========================================================
function drawLightSource(ctx, light) {
    const time = Date.now() * 0.001;
    let radius = light.radius;
    let alpha = 1.0;

    // 1. 효과 적용 (애니메이션)
    if (light.effect === "flicker") {
        // 불꽃처럼 파르르 떠는 효과 (랜덤성)
        const noise = Math.random() * 0.1;
        radius = light.radius * (0.95 + noise); 
        alpha = 0.9 + noise;
    } 
    else if (light.effect === "pulse") {
        // 숨쉬듯이 천천히 커졌다 작아졌다
        const pulse = Math.sin(time * 2) * 0.1;
        radius = light.radius * (1.0 + pulse);
        alpha = 0.8 + pulse;
    }

    // 2. 블렌딩 모드 설정 (가장 중요!)
    // 'lighter'는 빛이 겹칠수록 밝아지게 만들어 진짜 빛처럼 보이게 함
    ctx.globalCompositeOperation = 'lighter';

    // 3. 그라데이션 생성 (중심은 밝고 외곽은 투명)
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    
    // 색상 파싱 (rgba 문자열을 다루기 쉽게 변환하는 간단한 트릭은 생략하고, 
    // 입력받은 color가 rgba(r,g,b, a) 형태라고 가정하고 a값만 조절하지 않고 
    // 그라데이션의 alpha stop을 이용함)
    
    grad.addColorStop(0, light.color); // 중심부 색상
    grad.addColorStop(1, "rgba(0,0,0,0)"); // 외곽은 투명

    ctx.fillStyle = grad;
    ctx.globalAlpha = alpha; // 깜빡임 효과 적용
    
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // 4. 원래 블렌딩 모드로 복구
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
}

// ========================================================
// ★ [누락되었던 부분] 이미지가 없을 때 그려질 기본 도형 함수들
// ========================================================

// [건물 1] 스폰 지점 (돌 아치)
function drawSpawnArch(ctx) {
    ctx.fillStyle = "#795548"; // 돌기둥 색
    ctx.fillRect(-60, -200, 40, 200); // 왼쪽 기둥
    ctx.fillRect(20, -200, 40, 200);  // 오른쪽 기둥
    ctx.fillRect(-70, -220, 140, 40); // 지붕

    // 깃발
    ctx.fillStyle = "#FF5252";
    ctx.beginPath();
    ctx.moveTo(0, -220); ctx.lineTo(0, -280); ctx.lineTo(60, -250); ctx.lineTo(0, -220);
    ctx.fill();
    ctx.strokeStyle = "#5D4037"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, -220); ctx.lineTo(0, -300); ctx.stroke();
    
    // 텍스트
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.shadowBlur = 4; ctx.shadowColor = "black";
    ctx.fillText("RESPAWN POINT", 0, -150);
    ctx.shadowBlur = 0;
}

// [건물 2] 심플한 집
function drawSimpleHouse(ctx) {
    // 벽
    ctx.fillStyle = "#F5F5DC";
    ctx.fillRect(-100, -150, 200, 150);
    
    // 지붕
    ctx.fillStyle = "#8D6E63";
    ctx.beginPath();
    ctx.moveTo(-120, -150); ctx.lineTo(0, -250); ctx.lineTo(120, -150);
    ctx.fill();

    // 문
    ctx.fillStyle = "#5D4037";
    ctx.fillRect(-30, -100, 60, 100);
}

// [건물 3] 상점 텐트
function drawTent(ctx) {
    // 천막
    ctx.fillStyle = "#FF9800";
    ctx.beginPath();
    ctx.moveTo(-80, 0); ctx.lineTo(0, -140); ctx.lineTo(80, 0);
    ctx.fill();

    // 무늬
    ctx.strokeStyle = "#F57C00"; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(0, -140); ctx.lineTo(0, 0); ctx.stroke();
}