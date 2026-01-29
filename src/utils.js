export function hexToRgb(hex) { let bigint = parseInt(hex.slice(1), 16); return [ (bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255 ]; }
export function lerp(start, end, t) { return start * (1 - t) + end * t; }
// 레이저(선분)와 몬스터(점) 사이의 거리를 계산하는 수학 함수
export function distToSegment(p, v, w) {
    let l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
    if (l2 == 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}
// [최적화] 전역으로 뺀 별 그리기 함수
export function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) { 
    let rot = Math.PI / 2 * 3; let x = cx; let y = cy; let step = Math.PI / spikes; 
    ctx.beginPath(); ctx.moveTo(cx, cy - outerRadius); 
    for (let i = 0; i < spikes; i++) { 
        x = cx + Math.cos(rot) * outerRadius; y = cy + Math.sin(rot) * outerRadius; ctx.lineTo(x, y); rot += step; 
        x = cx + Math.cos(rot) * innerRadius; y = cy + Math.sin(rot) * innerRadius; ctx.lineTo(x, y); rot += step; 
    } 
    ctx.lineTo(cx, cy - outerRadius); ctx.closePath(); 
    ctx.shadowBlur = 40; ctx.shadowColor = color; ctx.fillStyle = "rgba(255, 255, 255, 0.95)"; ctx.fill(); 
    ctx.lineWidth = 4; ctx.strokeStyle = color; ctx.stroke(); 
}