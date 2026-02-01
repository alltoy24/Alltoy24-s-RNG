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

const drawIceGolem = (ctx, size, color, time, fastTime, getColor, state) => {
    // drawCritter에서 state를 넘겨받아야 합니다 (아래 drawCritter 수정 필수)
    const s = size * 1.8;
    
    // ★ [애니메이션 분기]
    // 기본 걷기 (느림)
    let legSpeed = 0.4;
    let armAngle = 0;
    
    // 1. 돌진 중일 때: 다리 엄청 빨리 움직임
    if (state === "charge") {
        legSpeed = 2.0; // 5배 배속 (다다다다)
    }
    // 2. 내려치기 준비 (팔을 번쩍 듦)
    else if (state === "prep_smash") {
        armAngle = -Math.PI * 0.8; // 만세 자세 (위로 140도)
    }
    // 3. 내려치기 (팔을 바닥으로)
    else if (state === "smash") {
        armAngle = Math.PI * 0.3; // 아래로 찍음
    }

    const walk = Math.sin(time * legSpeed) * 0.2; 

    ctx.translate(0, -s * 0.6);

    // --- 다리 (Legs) ---
    ctx.fillStyle = getColor(color);
    ctx.save(); ctx.translate(-s * 0.4, s * 0.5); ctx.rotate(walk); ctx.fillRect(-s * 0.25, 0, s * 0.5, s * 0.7); ctx.restore();
    ctx.save(); ctx.translate(s * 0.4, s * 0.5); ctx.rotate(-walk); ctx.fillRect(-s * 0.25, 0, s * 0.5, s * 0.7); ctx.restore();

    // --- 몸통 ---
    let iceGrad = ctx.createLinearGradient(-s, -s*2, s, s);
    iceGrad.addColorStop(0, "#E1F5FE"); 
    iceGrad.addColorStop(0.5, color);   
    iceGrad.addColorStop(1, "#01579B"); 
    ctx.fillStyle = getColor(iceGrad);
    
    ctx.beginPath();
    ctx.moveTo(-s * 1.2, -s * 1.6); ctx.lineTo(s * 1.2, -s * 1.6);
    ctx.lineTo(s * 0.7, s * 0.6); ctx.lineTo(-s * 0.7, s * 0.6);
    ctx.closePath(); ctx.fill();

    // 어깨 얼음 뿔
    ctx.fillStyle = getColor("#B3E5FC");
    ctx.beginPath(); ctx.moveTo(-s*1.2, -s*1.6); ctx.lineTo(-s*1.6, -s*2.2); ctx.lineTo(-s*0.8, -s*1.6); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s*1.2, -s*1.6); ctx.lineTo(s*1.6, -s*2.2); ctx.lineTo(s*0.8, -s*1.6); ctx.fill();

    // --- 팔 (Arms) : 상태에 따라 각도 변화 ---
    ctx.fillStyle = getColor(color);
    
    // 왼쪽 팔
    ctx.save();
    ctx.translate(-s * 1.3, -s * 1.2); 
    ctx.rotate(armAngle - walk * 1.5); // 기본 흔들림 + 공격 각도
    ctx.beginPath();
    ctx.moveTo(0,0); ctx.lineTo(-s*0.3, s*1.5); ctx.lineTo(s*0.5, s*1.5); ctx.lineTo(s*0.2, 0); ctx.fill();
    ctx.translate(0, s*1.5); ctx.beginPath(); for(let i=0; i<6; i++) { let a = i*Math.PI/3; ctx.lineTo(Math.cos(a)*s*0.4, Math.sin(a)*s*0.4); } ctx.fill();
    ctx.restore();

    // 오른쪽 팔
    ctx.save();
    ctx.translate(s * 1.3, -s * 1.2);
    ctx.rotate(armAngle + walk * 1.5); // 오른쪽도 같은 각도로 (양손 찍기) 혹은 반대
    // 스매시일 땐 양손을 같이 듬
    if (state === "prep_smash" || state === "smash") {
         // 양손 동기화
         ctx.rotate(- (armAngle + walk * 1.5) + (armAngle + walk * 1.5)); // 회전 초기화 트릭 대신 그냥 값 대입
         // 다시 회전 설정: 양팔 벌려 만세
         ctx.rotate(-armAngle + walk * 1.5); 
    }

    ctx.beginPath();
    ctx.moveTo(0,0); ctx.lineTo(-s*0.2, s*1.5); ctx.lineTo(s*0.6, s*1.5); ctx.lineTo(s*0.3, 0); ctx.fill();
    ctx.translate(0.2*s, s*1.5); ctx.beginPath(); for(let i=0; i<6; i++) { let a = i*Math.PI/3; ctx.lineTo(Math.cos(a)*s*0.4, Math.sin(a)*s*0.4); } ctx.fill();
    ctx.restore();

    // --- 코어 ---
    // 돌진 준비/내려치기 준비 중일 때 붉게 빛남 (경고)
    let coreColor = (state === "prep_charge" || state === "prep_smash") ? "#FF5252" : "#00E5FF";
    
    ctx.shadowBlur = 10; ctx.shadowColor = coreColor; 
    ctx.fillStyle = getColor("#E0F7FA");
    ctx.beginPath(); ctx.moveTo(0, -s * 1.0); ctx.lineTo(s * 0.25, -s * 0.7); ctx.lineTo(0, -s * 0.4); ctx.lineTo(-s * 0.25, -s * 0.7); ctx.closePath(); ctx.fill();
    
    ctx.fillStyle = getColor(coreColor); 
    ctx.beginPath(); ctx.arc(0, -s*0.7, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
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
    ctx.translate(0, 10);
    
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
    let bounce = 0;
    if (c.typeData.aiType !== "slime_jump") {
        if (c.typeData.moveType === "hop") bounce = Math.abs(Math.sin(c.animTime)) * size * 0.3;
        if (c.typeData.moveType === "float") bounce = Math.sin(c.animTime * 0.5) * size * 0.2;
    }
    
    ctx.translate(0, 0); 

    // 2. 슬라임 젤리 변형 (스쿼시 앤 스트레치)
    let scaleX = 1.0;
    let scaleY = 1.0;

    if (c.typeData.aiType === "slime_jump") {
        if (c.state === "prepare") {
            let progress = (90 - c.timer) / 90; 
            let squash = progress * 0.4; 
            let shake = Math.sin(globalRenderTime * 2.5) * 0.05;
            scaleX = 1.0 + squash + shake;
            scaleY = 1.0 - squash - shake;
        } 
        else if (c.state === "air") {
            let stretch = Math.min(0.5, Math.abs(c.vy) * 0.03);
            scaleX = 0.9 - stretch;
            scaleY = 1.1 + stretch;
        } 
        else if (c.state === "land") {
            let recovery = c.timer / 30; 
            scaleX = 1.0 + (recovery * 0.3);
            scaleY = 1.0 - (recovery * 0.3);
        }
    }

    ctx.translate(0, -bounce);
    ctx.scale(scaleX, scaleY);
    ctx.translate(0, -size); // 발 밑을 기준점으로

    // 3. 그리기 실행 (간소화 모드)
    if (isSimple) {
        ctx.fillStyle = isHit ? "#FFFFFF" : baseColor;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
        return;
    }

    // 일반 모드 설정
    ctx.shadowBlur = isHit ? 0 : 10;
    ctx.shadowColor = baseColor;
    const getColor = (normalColor) => isHit ? "#FFFFFF" : normalColor;

    // 4. 슬라임 전용 좌우 반전 (준비 동작 중엔 타겟 바라봄)
    if (c.state === "prepare") {
        if (!c.facingRight) ctx.scale(-1, 1);
    } else {
        if (c.vx < -0.1) ctx.scale(-1, 1);
    }

    // [얼음 골렘 스매시 준비 이펙트] (몸이 부들부들 떨림)
    if (c.typeData.aiType === "ice_golem" && c.state === "prep_smash") {
        ctx.translate((Math.random()-0.5)*3, (Math.random()-0.5)*3);
    }

    // ========================================================
    // ★ [중요] 방향 전환 로직 (AI 우선권)
    // 이 코드가 실행된 후에는 X축 양수(+) 방향이 무조건 몹의 '앞'입니다.
    // ========================================================
    let shouldFlip = false;
    if (typeof c.facingRight !== 'undefined') {
        if (!c.facingRight) shouldFlip = true; // 왼쪽을 보면 뒤집음
    } else {
        if (c.vx < -0.1) shouldFlip = true;
    }
    
    // ★ 여기서 컨텍스트를 뒤집습니다!
    if (shouldFlip) ctx.scale(-1, 1);


    // ============================================================
    // ★ [수정됨] 얼음 골렘 돌진 예고장 (<<< 또는 >>>)
    // 스케일링(반전) 이후에 그리므로, 항상 오른쪽(>>>)으로 그리면
    // 몹이 왼쪽을 볼 때는 자동으로 왼쪽(<<<)으로 뒤집혀서 나옵니다.
    // ============================================================
    if (c.typeData.aiType === "ice_golem" && c.state === "prep_charge") {
        ctx.save();
        
        // 1. 위치 잡기 (몹의 '앞'쪽으로 이동)
        // size * 2 만큼 X축 이동 -> 몹의 전방
        // -size * 0.5 만큼 Y축 이동 -> 몹의 허리~가슴 높이
        ctx.translate(size * 2.5, -size * 0.5); 

        // 2. 스타일 설정 (크고 붉은 경고)
        ctx.strokeStyle = "#FF0000"; // 완전 빨강
        ctx.lineWidth = 6;           // 두껍게
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "#FF0000"; // 붉은 빛 번짐
        ctx.shadowBlur = 20;         // 강하게 번짐

        const chevronSize = 15;   // 화살표 크기 (큼직하게)
        const spacing = 20;       // 화살표 간격
        const count = 3;          // 개수

        // 3. 흐르는 애니메이션 (몹 쪽에서 바깥으로 나가는 방향)
        let flowAnim = (globalRenderTime * 0.5) % spacing;

        // 4. 그리기 (항상 >>> 모양으로 그린다. 반전은 ctx.scale이 해줌)
        for (let i = 0; i < count; i++) {
            // 위치 계산
            let tipX = (i * spacing) + flowAnim;
            
            // 투명도 (멀어질수록 흐려지게 or 깜빡임)
            // 전체적으로 10프레임마다 깜빡임 추가
            let blink = (Math.floor(globalRenderTime / 5) % 2 === 0) ? 1.0 : 0.5;
            ctx.globalAlpha = blink;

            ctx.beginPath();
            // > 모양 그리기
            ctx.moveTo(tipX - chevronSize, -chevronSize); 
            ctx.lineTo(tipX, 0);                             
            ctx.lineTo(tipX - chevronSize, chevronSize); 
            ctx.stroke();
        }
        
        ctx.restore();
    }
    // ============================================================


    // 5. 렌더러 실행
    // 여기서 state를 넘겨줘야 애니메이션(만세, 달리기)이 작동함
    const renderFn = MOB_RENDERERS[rendererKey] || MOB_RENDERERS[c.typeData.drop] || drawDefault;
    renderFn(ctx, size, baseColor, time, fastTime, getColor, c.state); 


    // 6. 시스템 크래시 UI (글리치 몹 전용)
    if (c.typeData.aiType === "glitch_chaos" && c.state === "system_crash" && c.targetX !== undefined) {
        // 이 UI는 절대 좌표계가 필요하므로 flip을 잠시 원상복구 해야 함
        ctx.save();
        if (shouldFlip) ctx.scale(-1, 1); // 다시 뒤집어서 원래대로

        let relX = c.targetX - c.x;
        let relY = c.targetY - c.y;
        
        ctx.translate(relX, relY); 
        let opacity = Math.abs(Math.sin(globalRenderTime * 0.5)) * 0.5 + 0.2;
        ctx.fillStyle = `rgba(255, 0, 60, ${opacity})`; 
        ctx.strokeStyle = "#FF003C"; ctx.lineWidth = 2;
        ctx.fillRect(-40, -40, 80, 80); ctx.strokeRect(-40, -40, 80, 80);
        ctx.fillStyle = "#FFF"; ctx.font = "bold 12px monospace"; ctx.textAlign = "center";
        ctx.fillText("⚠ SYSTEM CRASH", 0, -50);
        ctx.beginPath(); ctx.moveTo(-20, -20); ctx.lineTo(20, 20); ctx.moveTo(20, -20); ctx.lineTo(-20, 20); ctx.stroke();
        ctx.restore();
    }

    ctx.restore();
}