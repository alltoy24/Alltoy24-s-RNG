import { GRAPHICS } from '../settings.js';

// ========================================================
// [1] 개별 몹 렌더링 로직 (눈 관련 코드 전면 삭제)
// ========================================================

const drawSquirrel = (ctx, size, color, time, fastTime, getColor) => {
    ctx.save();
    ctx.rotate(Math.sin(time) * 0.15);
    
    // 꼬리
    let tailGrad = ctx.createLinearGradient(-size*2, 0, 0, -size*3);
    tailGrad.addColorStop(0, "#E65100"); tailGrad.addColorStop(1, "#FFB300");
    ctx.fillStyle = getColor(tailGrad);
    
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.bezierCurveTo(-size * 5, size * 0.5, -size * 4, -size * 5, 0, -size * 4);
    ctx.bezierCurveTo(size * 1.5, -size * 3, size * 2.5, size, 0, size * 0.5);
    ctx.fill();
    ctx.restore();

    // 몸통 & 머리
    ctx.fillStyle = getColor(color);
    ctx.beginPath(); ctx.ellipse(0, 0, size * 1.1, size * 1.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(size*0.3, -size * 1.3, size * 0.8, 0, Math.PI*2); ctx.fill();
    
    // 귀
    for(let s of [-1, 1]) {
        ctx.save(); ctx.translate(s*size*0.3 + size*0.3, -size*1.8);
        ctx.beginPath(); ctx.ellipse(0, 0, size*0.25, size*0.6, s*0.2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle=getColor("#FFAB91"); 
        ctx.beginPath(); ctx.ellipse(0, 0, size*0.1, size*0.4, s*0.2, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }
};

const drawFrog = (ctx, size, color, time, fastTime, getColor) => {
    let frogGrad = ctx.createRadialGradient(0, -size*0.5, size*0.2, 0, 0, size*1.5);
    frogGrad.addColorStop(0, color); frogGrad.addColorStop(1, "#1B5E20");
    
    ctx.fillStyle = getColor(frogGrad);
    ctx.beginPath(); ctx.ellipse(0, 0, size*1.5, size*0.8, 0, 0, Math.PI*2); ctx.fill();
    
    ctx.lineWidth = 5; ctx.strokeStyle = getColor(color);
    for(let i=0; i<2; i++) {
        let side = i === 0 ? -1 : 1;
        ctx.beginPath(); ctx.arc(side*size*0.8, size*0.2, size*0.6, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(side*size, size*0.5); ctx.lineTo(side*size*1.5, size*0.8); ctx.stroke();
    }
    for(let s of [-1, 1]) {
        ctx.save(); ctx.translate(s*size*0.7, -size*0.8);
        ctx.beginPath(); ctx.arc(0, 0, size*0.6, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }
};

const drawRabbit = (ctx, size, color, time, fastTime, getColor) => {
    ctx.fillStyle = getColor(color);
    for(let i=0; i<5; i++) {
        let ang = (i / 5) * Math.PI * 2;
        ctx.beginPath(); ctx.arc(Math.cos(ang)*size*0.3 - size, Math.sin(ang)*size*0.3 + size*0.5, size*0.45, 0, Math.PI*2); ctx.fill();
    }
    let bunnyGrad = ctx.createRadialGradient(-size*0.3, -size*0.3, size*0.2, 0, 0, size*1.8);
    bunnyGrad.addColorStop(0, "#FFFFFF"); bunnyGrad.addColorStop(1, "#CFD8DC");
    
    ctx.fillStyle = getColor(bunnyGrad);
    ctx.beginPath(); ctx.moveTo(-size, size); ctx.bezierCurveTo(-size*1.8, -size*2, size*1.8, -size*2, size, size); ctx.fill();
    for(let s of [-1, 1]) {
        ctx.save(); ctx.translate(s*size*0.4, -size*1.2); ctx.rotate(s*0.2 + Math.sin(time)*0.1); 
        ctx.beginPath(); ctx.ellipse(0, -size*0.6, size*0.3, size*1.1, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle=getColor("#F8BBD0"); 
        ctx.beginPath(); ctx.ellipse(0, -size*0.6, size*0.15, size*0.8, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }
    ctx.fillStyle=getColor("#F06292"); ctx.beginPath(); ctx.arc(size*0.6, -size*0.3, 3, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle=getColor("rgba(0,0,0,0.1)"); ctx.lineWidth=1;
    for(let i=-1; i<=1; i++) { ctx.beginPath(); ctx.moveTo(size*0.6, -size*0.3); ctx.lineTo(size*1.2, -size*0.3 + i*5); ctx.stroke(); }
};

const drawWindSpirit = (ctx, size, color, time, fastTime, getColor) => {
    ctx.save();
    for(let i=0; i<4; i++) {
        ctx.rotate(time * (i%2?1:-1) + i); 
        ctx.strokeStyle = getColor(color); 
        ctx.lineWidth = 2; 
        ctx.globalAlpha = 0.4; // 피격시 처리는 상위 getColor에서 색상 변경으로 대체됨, 투명도는 유지
        ctx.beginPath(); ctx.ellipse(0, 0, size*(1.5+i*0.2), size*(0.5+i*0.1), 0, 0, Math.PI*2); ctx.stroke();
    }
    ctx.restore();
    let coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size); 
    coreGrad.addColorStop(0, "#FFF"); coreGrad.addColorStop(1, "transparent");
    ctx.fillStyle = getColor(coreGrad);
    ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI*2); ctx.fill();
};

const drawLizard = (ctx, size, color, time, fastTime, getColor) => {
    ctx.fillStyle = getColor(color);
    ctx.beginPath(); ctx.moveTo(-size, 0); ctx.quadraticCurveTo(0, -size*1.5, size*2, 0); ctx.quadraticCurveTo(0, size, -size, 0); ctx.fill();
    ctx.strokeStyle=getColor("rgba(0,0,0,0.2)"); ctx.lineWidth=1; 
    for(let x=-size; x<size; x+=5) { ctx.beginPath(); ctx.moveTo(x, -size*0.5); ctx.lineTo(x+5, size*0.5); ctx.stroke(); }
    
    ctx.lineWidth = 6; ctx.lineJoin = "round";
    ctx.strokeStyle = getColor(color);
    ctx.beginPath(); ctx.moveTo(-size*0.8, 0); ctx.lineTo(-size*2, -size); ctx.lineTo(-size*2.5, 0); ctx.lineTo(-size*4, -size*1.5); ctx.stroke();
};

const drawFairy = (ctx, size, color, time, fastTime, getColor) => {
    let flap = Math.sin(fastTime) * 0.5;
    ctx.save(); 
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = getColor(color);
    for(let s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(s*size*3, -size*3*flap, s*size*3, size*2, 0, 0); ctx.fill(); }
    ctx.restore();
    ctx.fillStyle = getColor(color);
    ctx.beginPath(); ctx.arc(0, 0, size*0.5, 0, Math.PI*2); ctx.fill();
};

const drawCrow = (ctx, size, color, time, fastTime, getColor) => {
    let flap = Math.sin(fastTime) * size;
    ctx.fillStyle = getColor(color);
    for(let s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, -size*0.5); ctx.quadraticCurveTo(s*size*3, -size*2 + flap, s*size*1.5, size); ctx.lineTo(0, 0); ctx.fill(); }
    ctx.beginPath(); ctx.arc(0, -size*1.2, size*0.8, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, size*0.8, size*1.3, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle=getColor("#FF9100"); 
    ctx.beginPath(); ctx.moveTo(size*0.6, -size*1.3); ctx.lineTo(size*1.8, -size*1.1); ctx.lineTo(size*0.6, -size*0.9); ctx.fill();
};

const drawBat = (ctx, size, color, time, fastTime, getColor) => {
    let flap = Math.abs(Math.sin(fastTime)) * size * 1.5;
    ctx.fillStyle = getColor(color);
    ctx.beginPath(); ctx.moveTo(0, -size);
    for(let s of [1, -1]) { ctx.bezierCurveTo(s*size*2, -size*2.5 + flap, s*size*4, size*flap*0.1, s*size, size); ctx.lineTo(0, 0); }
    ctx.fill(); ctx.beginPath(); ctx.arc(0, -size*0.5, size*0.7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle=getColor("#FFF"); 
    ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-1, 5); ctx.lineTo(1, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(3, 0); ctx.lineTo(1, 5); ctx.lineTo(-1, 0); ctx.fill();
};

const drawGlitchBug = (ctx, size, color, time, fastTime, getColor) => {
    for(let i=0; i<12; i++) {
        ctx.fillStyle = getColor(Math.random() < 0.5 ? "#FF003C" : "#00FFFF");
        let w = Math.random()*size*4, h = 2 + Math.random()*5;
        ctx.fillRect((Math.random()-0.5)*size*5, (Math.random()-0.5)*size*5, w, h);
    }
    ctx.fillStyle = getColor("#FFF"); 
    ctx.font = "bold 20px monospace"; ctx.fillText(Math.random().toString(16).slice(2, 4), -10, 0);
};

// 6. 회전초
const drawTumbleweed = (ctx, size, color, time, fastTime, getColor) => {
    ctx.save();
    ctx.rotate(fastTime * 2); 
    ctx.strokeStyle = getColor(color);
    ctx.lineWidth = 2;
    for(let i=0; i<8; i++) {
        ctx.save();
        ctx.rotate((i / 8) * Math.PI * 2);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(size*0.5, size*0.5, size, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(size*0.7, size*0.2); ctx.lineTo(size*0.9, size*0.5); ctx.stroke();
        ctx.restore();
    }
    ctx.restore();
};

// 11. 얼음 골렘 (눈 삭제)
const drawIceGolem = (ctx, size, color, time, fastTime, getColor) => {
    const walk = Math.sin(time * 0.5) * size * 0.3;
    ctx.fillStyle = getColor(color); 
    ctx.fillRect(-size*0.8, size*0.5 + walk, size*0.6, size);
    ctx.fillRect(size*0.2, size*0.5 - walk, size*0.6, size);

    // 육각형 몸통
    ctx.beginPath();
    ctx.moveTo(-size, -size); ctx.lineTo(size, -size);
    ctx.lineTo(size*1.2, 0); ctx.lineTo(size, size);
    ctx.lineTo(-size, size); ctx.lineTo(-size*1.2, 0);
    ctx.fill();
};

// 12. 유적 파수꾼 (눈 삭제 -> 고대 문양만)
const drawGolemSentry = (ctx, size, color, time, fastTime, getColor) => {
    const float = Math.sin(time) * 5;
    ctx.fillStyle = getColor(color); 
    ctx.fillRect(-size*1.8, -size*1.5 + float, size*0.8, size*0.8);
    ctx.fillRect(size*1.0, -size*1.5 + float, size*0.8, size*0.8);
    ctx.fillRect(-size, -size, size*2, size*2.5);

    ctx.strokeStyle = getColor("#FFD700"); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-size*0.5, -size*0.5); ctx.lineTo(size*0.5, 0); ctx.lineTo(-size*0.5, size*0.5); ctx.stroke();
};

// 13. 유령 (눈 삭제 -> 흐물거리는 실루엣만)
const drawGhost = (ctx, size, color, time, fastTime, getColor) => {
    ctx.fillStyle = getColor(color);
    ctx.globalAlpha = 0.7; 
    ctx.beginPath(); ctx.arc(0, -size*0.5, size, Math.PI, 0); 
    const wave = Math.sin(time * 0.3) * 5;
    ctx.lineTo(size, size + wave); ctx.lineTo(0, size - wave); ctx.lineTo(-size, size + wave); ctx.lineTo(-size, 0);
    ctx.fill();
    ctx.globalAlpha = 1.0;
};

const drawDefault = (ctx, size, color, time, fastTime, getColor) => {
    ctx.fillStyle = getColor(color);
    ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI*2); ctx.fill();
};

const drawSimpleSlime = (ctx, size, color, time, fastTime, getColor) => {
    // 1. 본체 (젤리 질감)
    ctx.fillStyle = getColor(color);
    
    // 약간 투명하게 (슬라임 느낌)
    if (color !== "#212121" && color !== "#263238") { // 다크매터/오일은 불투명
        ctx.globalAlpha = 0.8;
    }

    ctx.beginPath();
    // 위는 둥글고 아래는 약간 퍼진 형태
    ctx.arc(0, 0, size, Math.PI, 0); 
    ctx.bezierCurveTo(size, size*0.6, -size, size*0.6, -size, 0); 
    ctx.fill();
    ctx.globalAlpha = 1.0; // 투명도 복구

    // 2. 내부 핵 (Core) - 생명력 느낌
    // 몸통보다 조금 진하거나 밝은 색으로 작은 원 하나
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    // 젤리 안에 떠있는 느낌으로 살짝 위쪽에 그림
    ctx.beginPath(); 
    ctx.ellipse(0, -size*0.2, size*0.4, size*0.25, 0, 0, Math.PI*2); 
    ctx.fill();

    // 3. 하이라이트 (광택)
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.ellipse(-size*0.4, -size*0.5, size*0.2, size*0.1, -0.5, 0, Math.PI*2);
    ctx.fill();
};

// ========================================================
// [2] 몹 레지스트리 (ID 연결)
// ========================================================
export const MOB_RENDERERS = {
    "nut_light": drawSquirrel,
    "frog_skin": drawFrog,
    "rabbit_fur": drawRabbit,
    "spirit_wing": drawWindSpirit,
    "volt_scale": drawLizard,
    "fairy_dust": drawFairy,
    "fiber": drawTumbleweed,    
    "shadow_beak": drawCrow,
    "blood_fang": drawBat,
    "core_glitch": drawGlitchBug,
    "stone_core": drawIceGolem,
    "ectoplasm": drawGhost, 
    "ancient_gear": drawGolemSentry,
    "slime_grass": drawSimpleSlime,
    "slime_sand": drawSimpleSlime,
    "slime_ice": drawSimpleSlime,
    "slime_toxic": drawSimpleSlime,
    "slime_clay": drawSimpleSlime,
    "slime_void": drawSimpleSlime,
    "slime_ocean": drawSimpleSlime,
    "slime_pudding": drawSimpleSlime,
    "slime_oil": drawSimpleSlime,
    "slime_alien": drawSimpleSlime,
    "slime_aurora": drawSimpleSlime,
    "slime_magma": drawSimpleSlime,
    "slime_gold": drawSimpleSlime
};

// ========================================================
// [3] 메인 그리기 함수
// ========================================================
export function drawCritter(ctx, c, globalRenderTime) {
    const size = c.typeData.size || 15;
    const isHit = c.hitTime > 0;
    const baseColor = c.typeData.color;
    
    // 렌더러 찾기
    let rendererKey = c.typeData.id; 
    if (!MOB_RENDERERS[rendererKey]) rendererKey = c.typeData.drop;

    const time = globalRenderTime * 0.05;
    const fastTime = globalRenderTime * 0.2;
    const isSimple = (typeof GRAPHICS !== 'undefined' && GRAPHICS.simpleMobs);

    ctx.save();

    // 1. 기본 위치 잡기 (바닥 기준)
    // ----------------------------------------------------
    // 슬라임이 아닌 일반 몹들의 바운스 (다람쥐, 토끼 등)
    let bounce = 0;
    if (c.typeData.aiType !== "slime_jump") {
        if (c.typeData.moveType === "hop") bounce = Math.abs(Math.sin(c.animTime)) * size * 0.3;
        if (c.typeData.moveType === "float") bounce = Math.sin(c.animTime * 0.5) * size * 0.2;
    }
    
    // 일단 바닥(0)에서 몬스터 크기만큼 위로 올리고(-size), 바운스 적용
    // 나중에 scale을 먹일 때 바닥을 기준으로 하기 위해 좌표계를 바닥에 둡니다.
    ctx.translate(0, 0); 

    // 2. ★ [핵심] 슬라임 전용 젤리 변형 (Squash & Stretch)
    // ----------------------------------------------------
    let scaleX = 1.0;
    let scaleY = 1.0;

    if (c.typeData.aiType === "slime_jump") {
        // (1) 준비 동작: 납작해짐 (찐빵)
        if (c.state === "prepare") {
            // 타이머(90 -> 0)가 줄어들수록 더 납작해짐 (최대 0.6배)
            let progress = (90 - c.timer) / 90; 
            let squash = progress * 0.4; 
            // 부들부들 떨림 효과
            let shake = Math.sin(globalRenderTime * 2.5) * 0.05;
            
            scaleX = 1.0 + squash + shake;
            scaleY = 1.0 - squash - shake;
        } 
        // (2) 공중: 길쭉해짐 (속도감)
        else if (c.state === "air") {
            // 위로 솟구칠 때 더 길어짐
            let stretch = Math.min(0.5, Math.abs(c.vy) * 0.03);
            scaleX = 0.9 - stretch;
            scaleY = 1.1 + stretch;
        } 
        // (3) 착지: 띠용~ 하고 젤리처럼 출렁임
        else if (c.state === "land") {
            let recovery = c.timer / 30; // 1.0 -> 0.0
            scaleX = 1.0 + (recovery * 0.3);
            scaleY = 1.0 - (recovery * 0.3);
        }
    }

    // ★ 변형 적용 순서가 중요합니다!
    // 1. 위로 살짝 띄움 (기본 바운스)
    ctx.translate(0, -bounce);
    // 2. 스케일 적용 (찌그러트리기)
    ctx.scale(scaleX, scaleY);
    // 3. 원래 크기만큼 위로 올려서 그림 (발이 바닥에 붙어있게)
    ctx.translate(0, -size);


    // 3. 그리기 실행
    // ----------------------------------------------------
    
    // [간소화 모드]
    if (isSimple) {
        ctx.fillStyle = isHit ? "#FFFFFF" : baseColor;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
        return;
    }

    // [일반 모드]
    ctx.shadowBlur = isHit ? 0 : 10;
    ctx.shadowColor = baseColor;

    const getColor = (normalColor) => isHit ? "#FFFFFF" : normalColor;

    // 좌우 반전 (속도 기준)
    // 슬라임은 준비 동작 중에는 타겟(플레이어)을 바라봄
    if (c.state === "prepare") {
        if (!c.facingRight) ctx.scale(-1, 1);
    } else {
        if (c.vx < -0.1) ctx.scale(-1, 1);
    }

    // ========================================================
    // ★ [FIX] 방향 전환 로직 (AI 우선권 부여)
    // ========================================================
    let shouldFlip = false;

    // 1. AI가 facingRight 값을 명시적으로 가지고 있다면 그걸 따름
    // (전기도마뱀, 슬라임 등 AI가 방향을 제어하는 경우)
    if (typeof c.facingRight !== 'undefined') {
        if (!c.facingRight) shouldFlip = true;
    } 
    // 2. AI가 방향을 안 주면 속도(vx)를 보고 결정
    else {
        if (c.vx < -0.1) shouldFlip = true;
    }

    // 반전 적용
    if (shouldFlip) {
        ctx.scale(-1, 1);
    }

    // 렌더링 함수 호출
    const renderFn = MOB_RENDERERS[rendererKey] || MOB_RENDERERS[c.typeData.drop] || drawDefault;
    renderFn(ctx, size, baseColor, time, fastTime, getColor);

    if (c.typeData.aiType === "glitch_chaos" && c.state === "system_crash" && c.targetX !== undefined) {
        
        // 현재 몬스터 위치(0,0) 기준으로 타겟 위치와의 거리 계산
        // (drawCritter는 이미 translate가 되어 있으므로 상대 좌표를 써야 함)
        let relX = c.targetX - c.x;
        let relY = c.targetY - c.y;

        ctx.save();
        ctx.translate(relX, relY); // 타겟 위치로 이동

        // 1. 경고 박스 (깜빡임)
        let opacity = Math.abs(Math.sin(globalRenderTime * 0.5)) * 0.5 + 0.2;
        ctx.fillStyle = `rgba(255, 0, 60, ${opacity})`; // 붉은색
        ctx.strokeStyle = "#FF003C";
        ctx.lineWidth = 2;

        // 크기 80x80 영역 표시
        ctx.fillRect(-40, -40, 80, 80);
        ctx.strokeRect(-40, -40, 80, 80);

        // 2. 텍스트 표시
        ctx.fillStyle = "#FFF";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("⚠ SYSTEM CRASH", 0, -50);
        
        // 3. X 표시 (타겟 지점)
        ctx.beginPath();
        ctx.moveTo(-20, -20); ctx.lineTo(20, 20);
        ctx.moveTo(20, -20); ctx.lineTo(-20, 20);
        ctx.stroke();

        ctx.restore();
    }

    ctx.restore();
}