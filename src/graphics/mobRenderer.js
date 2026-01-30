import { GRAPHICS } from '../settings.js'; // (settings.js가 없다면 경로 확인 필요)

// ========================================================
// [1] 개별 몹 렌더링 로직 (여기에 계속 추가하면 됩니다)
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

const drawDefault = (ctx, size, color, time, fastTime, getColor) => {
    ctx.fillStyle = getColor(color);
    ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI*2); ctx.fill();
};

// ========================================================
// [2] 몹 레지스트리 (여기에 ID와 함수를 연결하세요)
// ========================================================
export const MOB_RENDERERS = {
    "nut_light": drawSquirrel,
    "frog_skin": drawFrog,
    "rabbit_fur": drawRabbit,
    "spirit_wing": drawWindSpirit,
    "volt_scale": drawLizard,
    "fairy_dust": drawFairy,
    "shadow_beak": drawCrow,
    "blood_fang": drawBat,
    "core_glitch": drawGlitchBug
};

// ========================================================
// [3] 메인 그리기 함수 (Main Export)
// ========================================================
export function drawCritter(ctx, c, globalRenderTime) {
    const size = c.typeData.size || 15;
    const isHit = c.hitTime > 0;
    const baseColor = c.typeData.color;
    const id = c.typeData.drop; // ★ ID 기준으로 렌더러 선택
    const time = globalRenderTime * 0.05;
    const fastTime = globalRenderTime * 0.2;

    const isSimple = (typeof GRAPHICS !== 'undefined' && GRAPHICS.simpleMobs);

    ctx.save();
    ctx.translate(0, -size);

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
    ctx.shadowBlur = isHit ? 0 : 15;
    ctx.shadowColor = baseColor;

    // 색상 변환 헬퍼 (피격 시 흰색, 아니면 원래 색)
    const getColor = (normalColor) => isHit ? "#FFFFFF" : normalColor;

    // ★ 레지스트리에서 그리기 함수 조회
    const renderFn = MOB_RENDERERS[id] || drawDefault;
    renderFn(ctx, size, baseColor, time, fastTime, getColor);

    ctx.restore();
}