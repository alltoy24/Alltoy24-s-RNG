import { lerp, hexToRgb } from '../utils.js'; // 아까 만든 utils 활용
import { allAuras } from '../data/auras.js';

// 컬러 팔레트 (상수로 정의)
const C = {
    skin: "#FFCCBC", hair: "#ECEFF1",
    coatDark: "#1A2327", coatMid: "#263238", coatLight: "#37474F",
    pants: "#102027", limbDark: "#0D1316", metal: "#B0BEC5"
};

const TWO_PI = Math.PI * 2;

function drawMagicCircle(ctx, x, y, radius, angle, color, alpha) { ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.shadowBlur = 20; ctx.shadowColor = color; ctx.beginPath(); ctx.arc(0, 0, radius, 0, TWO_PI); ctx.stroke(); ctx.beginPath(); for(let i=0; i<6; i++) { let a = (TWO_PI/6)*i; ctx.moveTo(0,0); ctx.lineTo(Math.cos(a)*radius, Math.sin(a)*radius); } ctx.stroke(); ctx.beginPath(); for(let i=0; i<6; i++) { let a = (TWO_PI/6)*i; ctx.moveTo(Math.cos(a)*radius, Math.sin(a)*radius); ctx.lineTo(Math.cos(a+TWO_PI/3)*radius, Math.sin(a+TWO_PI/3)*radius); } ctx.stroke(); ctx.restore(); }

export function drawGhost(ctx, ghost, auraColor) {
    ctx.save();
    
    // 1. 위치로 이동
    ctx.translate(ghost.x, ghost.y);
    ctx.globalAlpha = ghost.opacity;
    ctx.globalCompositeOperation = 'lighter'; // 빛을 겹치게 해서 부드럽게 연결

    // 2. ★ 파격적으로 늘리기 (가로는 3배 늘리고 세로는 0.4배로 압축)
    // 이렇게 하면 잔상끼리 서로 겹쳐서 '울타리' 느낌이 사라집니다.
    if (!ghost.facingRight) ctx.scale(-1, 1);
    ctx.scale(3.0, 0.4); 

    // 3. ★ 그라데이션 실루엣 (꼬리 부분은 투명하게)
    // x축 -20부터 20까지 뒤로 갈수록 사라지는 효과
    let grad = ctx.createLinearGradient(15, 0, -30, 0);
    grad.addColorStop(0, auraColor);      // 앞부분은 선명
    grad.addColorStop(1, "transparent"); // 뒷부분은 흐릿

    ctx.fillStyle = grad;
    ctx.shadowBlur = 15;
    ctx.shadowColor = auraColor;

    // 4. 형태 그리기 (더 유선형으로)
    ctx.beginPath();
    // 둥근 캡슐 형태로 그려서 에너지 탄환 같은 느낌을 줍니다.
    ctx.roundRect(-10, -50, 40, 100, 50); 
    ctx.fill();

    ctx.restore();
}

// [수정] 플레이어 그리기 (좌표 꼬임 버그 수정됨)
export function drawPlayer(ctx, player, globalRenderTime, equippedAuraName, myNickname, GRAPHICS) {
    // 1. 그래픽 상태 초기화
    ctx.save();
    ctx.fillStyle = "black"; 
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 2. 방향 전환
    if (!player.facingRight) ctx.scale(-1, 1);
    if (player.invincibleTime > 0) ctx.globalAlpha = 0.6;

    const isMoving = Math.abs(player.vx) > 0.1;

    // ============================================================
    // [⚙️ 애니메이션 엔진]
    // ============================================================
    
    // 1. 모션 블렌딩
    if (typeof player.runWeight === 'undefined') player.runWeight = 0;
    const targetWeight = Math.abs(player.vx) > 0.1 ? 1.0 : 0.0;
    player.runWeight += (targetWeight - player.runWeight) * 0.15; 

    // 2. 애니메이션 타이머
    const cycle = player.walkFrame * 0.25; 
    const idleBreath = Math.sin(globalRenderTime * 0.05);

    // 3. 자세 제어 변수
    const tiltAngle = lerp(0, 0.4, player.runWeight); 
    const bounceY = lerp(idleBreath * 1.5, Math.abs(Math.sin(cycle)) * 4, player.runWeight);
    
    // 4. 좌표 기준점
    const hipX = 0;
    const hipY = -45 + bounceY; 
    const shoulderY = hipY - 30; // ★ 어깨 높이 변수 (에러 방지)

    // [컬러 팔레트]
    const C = {
        skin: "#FFCCBC", hair: "#ECEFF1",
        coatDark: "#1A2327", coatMid: "#263238", coatLight: "#37474F",
        pants: "#102027", limbDark: "#0D1316", metal: "#B0BEC5"
    };

    // --- 0. 장착된 오라 이펙트 ---
    if (equippedAuraName) {
        let aura = allAuras.find(a => a.name === equippedAuraName);
        if (aura) {
            if (typeof GRAPHICS !== 'undefined' && GRAPHICS.simpleAuras) {
                ctx.save(); ctx.translate(0, -50); 
                ctx.globalAlpha = (player.invincibleTime > 0) ? 0.1 : 0.2; 
                ctx.fillStyle = aura.color; 
                ctx.beginPath(); ctx.arc(0, 0, 45, 0, TWO_PI); ctx.fill();
                ctx.globalAlpha = (player.invincibleTime > 0) ? 0.4 : 0.8;
                ctx.strokeStyle = aura.color; ctx.lineWidth = 2; ctx.stroke();
                ctx.restore();
            } else {
                // ★ [화려한 오라 모드]
                
                // 1. 바닥 광원 (별도 저장/복원 사용)
                ctx.save();
                ctx.globalCompositeOperation = 'lighter'; 
                let [r, g, b] = hexToRgb(aura.color);
                ctx.scale(1, 0.35);
                let baseGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
                baseGlow.addColorStop(0, `rgba(${r},${g},${b}, 0.4)`);
                baseGlow.addColorStop(1, "transparent");
                ctx.fillStyle = baseGlow; 
                ctx.beginPath(); ctx.arc(0, 0, 60, 0, TWO_PI); ctx.fill();
                ctx.restore(); 

                // 2. 등급별 오라 이펙트 (현재 좌표계 유지)
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                let chance = aura.chanceX;
                let time = globalRenderTime * 0.015;
                const applyGroundPerspective = () => ctx.scale(1, 0.35);

                // [티어 1] Common ~ Rare
                if (chance < 1000) {
                    ctx.fillStyle = aura.color;
                    for(let i=0; i<3; i++) {
                        let pTime = (time + i * 2) % 6;
                        ctx.globalAlpha = Math.max(0, 1 - (pTime / 6));
                        ctx.beginPath(); ctx.arc(Math.sin(time + i) * 15, -pTime * 15, 2, 0, TWO_PI); ctx.fill();
                    }
                }
                // [티어 2] Epic ~ Legend
                else if (chance < 1000000) {
                    ctx.save(); applyGroundPerspective();
                    drawMagicCircle(ctx, 0, 0, 50, time, aura.color, 0.5);
                    ctx.restore();
                    
                    ctx.lineWidth = 2;
                    for(let i=0; i<3; i++) {
                        let angle = time * 2 + (TWO_PI/3)*i;
                        let px = Math.cos(angle) * 35; let py = -40 + Math.sin(angle) * 15;
                        ctx.strokeStyle = `rgba(${r},${g},${b}, 0.3)`; 
                        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(Math.cos(angle-0.2)*35, -40 + Math.sin(angle-0.2)*15); ctx.stroke();
                        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, TWO_PI); ctx.fill();
                        ctx.fillStyle = `rgba(${r},${g},${b}, 0.5)`; ctx.beginPath(); ctx.arc(px, py, 6, 0, TWO_PI); ctx.fill();
                    }
                }
                // [티어 3] Mythic ~ God
                else if (chance < 100000000) {
                    ctx.save(); applyGroundPerspective(); 
                    drawMagicCircle(ctx, 0, 0, 75, time, aura.color, 0.6);
                    drawMagicCircle(ctx, 0, 0, 110, -time*1.5, "#fff", 0.4);
                    
                    let pulse = Math.sin(time*3)*15;
                    ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`; ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.arc(0, 0, 130 + pulse, 0, TWO_PI); ctx.stroke();
                    ctx.restore();

                    ctx.save(); ctx.translate(0, -60); ctx.rotate(time * 0.5);
                    for(let i=0; i<16; i++) {
                        ctx.rotate(TWO_PI/16);
                        let grad = ctx.createLinearGradient(0, 0, 0, -110);
                        grad.addColorStop(0, `rgba(${r},${g},${b}, 0.8)`); grad.addColorStop(1, "transparent");
                        ctx.fillStyle = grad;
                        ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.lineTo(0, -110); ctx.fill();
                    }
                    ctx.restore();

                    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
                    for(let i=0; i<6; i++) {
                        let angle = time + (TWO_PI/6)*i;
                        let px = Math.cos(angle) * (50 + Math.sin(time*2+i)*10);
                        let py = -60 + Math.sin(angle) * 30 + Math.cos(time*1.5+i)*20;
                        ctx.save(); ctx.translate(px, py); ctx.rotate(time*2 + i);
                        ctx.strokeRect(-5, -5, 10, 10); ctx.restore();
                    }
                }
                // [티어 4] Transcendent
                else if (chance < 1000000000) {
                    ctx.save(); applyGroundPerspective(); ctx.rotate(time*0.2);
                    ctx.strokeStyle = `rgba(${r},${g},${b}, 0.6)`; ctx.lineWidth = 2;
                    for(let i=0; i<6; i++) { ctx.rotate(Math.PI/3); ctx.beginPath(); ctx.moveTo(80,0); ctx.lineTo(150, 0); ctx.lineTo(120, 60); ctx.closePath(); ctx.stroke(); }
                    drawMagicCircle(ctx, 0, 0, 100, -time, "#fff", 0.6);
                    ctx.restore();

                    ctx.save(); ctx.translate(0, -70);
                    for(let i=0; i<5; i++) {
                        let angle = time + (TWO_PI/5)*i;
                        let sx = Math.cos(angle) * 90; let sy = Math.sin(angle) * 20 + Math.sin(time*2+i)*10;
                        ctx.save(); ctx.translate(sx, sy); ctx.rotate(angle + Math.PI/2);
                        let swordGrad = ctx.createLinearGradient(0, -30, 0, 30);
                        swordGrad.addColorStop(0, "#fff"); swordGrad.addColorStop(1, aura.color);
                        ctx.fillStyle = swordGrad;
                        ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(5, 0); ctx.lineTo(0, 40); ctx.lineTo(-5, 0); ctx.fill();
                        ctx.globalAlpha = 0.3; ctx.fillStyle = aura.color; 
                        ctx.beginPath(); ctx.arc(0, 0, 15, 0, TWO_PI); ctx.fill();
                        ctx.restore();
                    }
                    ctx.restore();

                    let flow = Math.sin(time * 1.5);
                    for(let side of [-1, 1]) {
                        for(let j=0; j<3; j++) {
                            let spread = 0.2 + j*0.15; let len = 120 + j*30; let alpha = 0.6 - j*0.15;
                            ctx.save(); ctx.translate(0, -60); 
                            let plumeGrad = ctx.createLinearGradient(0, 0, side*100, -150);
                            plumeGrad.addColorStop(0, `rgba(${r},${g},${b}, ${alpha})`); 
                            plumeGrad.addColorStop(0.7, `rgba(${r},${g},${b}, ${alpha*0.5})`); 
                            plumeGrad.addColorStop(1, "transparent");
                            ctx.fillStyle = plumeGrad;
                            ctx.beginPath(); ctx.moveTo(0, 0);
                            let cp1x = side * 50 + flow*20; let cp1y = -len * 0.5;
                            let cp2x = side * (150 + spread*100) + flow*30; let cp2y = -len * 0.8;
                            let endx = side * (180 + spread*120); let endy = -len - flow*20;
                            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endx, endy);
                            ctx.bezierCurveTo(endx - side*40, endy+30, cp2x - side*30, cp2y+40, 0, 10);
                            ctx.fill(); ctx.restore();
                        }
                    }
                }
                // [티어 5] Cosmic/Creation
                else if (chance < 2400000000) {
                    ctx.save(); applyGroundPerspective();
                    let abyssGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 180);
                    abyssGrad.addColorStop(0, "#000"); abyssGrad.addColorStop(0.5, aura.color); abyssGrad.addColorStop(1, "transparent");
                    ctx.fillStyle = abyssGrad; ctx.beginPath(); ctx.arc(0, 0, 180, 0, TWO_PI); ctx.fill(); 
                    ctx.restore();

                    ctx.save(); ctx.translate(0, -65); ctx.rotate(time * 0.2);
                    for(let i=0; i<2; i++) {
                        ctx.rotate(Math.PI);
                        let nebulaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 250);
                        nebulaGrad.addColorStop(0, `rgba(${r},${g},${b}, 0.2)`); nebulaGrad.addColorStop(1, "transparent");
                        ctx.fillStyle = nebulaGrad; ctx.beginPath(); ctx.ellipse(100, 0, 200, 60, 0, 0, TWO_PI); ctx.fill();
                    }
                    ctx.restore();

                    ctx.save(); ctx.translate(0, -65);
                    for(let i=0; i<6; i++) {
                        let angle = time * (1.5 - i*0.1) + (Math.PI/3)*i; let radius = 80 + Math.sin(time+i)*30; 
                        let px = Math.cos(angle) * radius; let py = Math.sin(angle) * radius * 0.3; 
                        ctx.beginPath(); ctx.moveTo(px, py); let tailAng = angle - 0.3;
                        ctx.lineTo(Math.cos(tailAng)*radius, Math.sin(tailAng)*radius*0.3);
                        ctx.strokeStyle = `rgba(${r},${g},${b}, 0.5)`; ctx.lineWidth = 3; ctx.stroke();
                        
                        ctx.fillStyle = "#fff"; 
                        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, TWO_PI); ctx.fill();
                        ctx.fillStyle = `rgba(${r},${g},${b}, 0.3)`; 
                        ctx.beginPath(); ctx.arc(px, py, 8, 0, TWO_PI); ctx.fill();
                    }
                    ctx.restore();
                    
                    let holeGlow = ctx.createRadialGradient(0, -65, 10, 0, -65, 50);
                    holeGlow.addColorStop(0, "#fff"); holeGlow.addColorStop(1, `rgba(${r},${g},${b},0)`);
                    ctx.fillStyle = holeGlow; ctx.beginPath(); ctx.arc(0, -65, 50, 0, TWO_PI); ctx.fill();
                    
                    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, -65, 15, 0, TWO_PI); ctx.fill();
                }
                // [티어 6] Final
                else {
                    ctx.save(); applyGroundPerspective();
                    let groundGrad = ctx.createRadialGradient(0, 0, 50, 0, 0, 400);
                    groundGrad.addColorStop(0, "#fff"); groundGrad.addColorStop(1, "transparent");
                    ctx.fillStyle = groundGrad; ctx.beginPath(); ctx.arc(0, 0, 400, 0, TWO_PI); ctx.fill(); ctx.restore();

                    ctx.save(); ctx.translate(0, -100);
                    ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,0.4)";
                    for(let i=1; i<=3; i++) { let ringR = 100 + i*50; ctx.beginPath(); ctx.ellipse(0, 0, ringR, ringR * 0.8, time*(0.1*i), 0, TWO_PI); ctx.stroke(); }

                    let breath = Math.sin(time);
                    for(let i=0; i<6; i++) {
                        let angle = (TWO_PI / 6) * i + (time * 0.1); let len = 300 + breath * 50;
                        let gx = Math.cos(angle) * len; let gy = Math.sin(angle) * len;
                        let rayGrad = ctx.createLinearGradient(0, 0, gx, gy);
                        rayGrad.addColorStop(0, "rgba(255,255,255,0.8)"); rayGrad.addColorStop(1, "transparent");
                        ctx.fillStyle = rayGrad; ctx.beginPath(); ctx.moveTo(0,0);
                        ctx.lineTo(gx - Math.cos(angle+Math.PI/2)*5, gy - Math.sin(angle+Math.PI/2)*5);
                        ctx.lineTo(gx + Math.cos(angle+Math.PI/2)*5, gy + Math.sin(angle+Math.PI/2)*5); ctx.fill();
                    }
                    ctx.restore();

                    let eyeY = -350 + Math.sin(time)*10;
                    let eyeOpen = Math.abs(Math.sin(time*1.5)); 
                    
                    let eyeGlow = ctx.createRadialGradient(0, eyeY, 50, 0, eyeY, 200);
                    eyeGlow.addColorStop(0, "rgba(255,255,255,0.8)"); eyeGlow.addColorStop(1, "transparent");
                    ctx.fillStyle = eyeGlow; ctx.beginPath(); ctx.arc(0, eyeY, 200, 0, TWO_PI); ctx.fill();

                    ctx.fillStyle = "#fff"; 
                    ctx.beginPath(); ctx.ellipse(0, eyeY, 120, 20 * eyeOpen, 0, 0, TWO_PI); ctx.fill();
                    ctx.fillStyle = `rgba(255,255,255, ${0.5 * eyeOpen})`; ctx.fillRect(-2, eyeY - 200, 4, 400);

                    ctx.fillStyle = "#fff"; 
                    for(let i=0; i<10; i++) {
                        let px = (Math.random()-0.5) * 400; let py = -400 + ((time*30 + i*50) % 500);
                        ctx.beginPath(); ctx.arc(px, py, Math.random()*4, 0, TWO_PI); ctx.fill();
                    }
                }
                ctx.restore();
                // ★ [수정됨] 이전에 여기에 있던 불필요한 ctx.restore() 제거됨
            }
        }
    }

    // ========================================================
    // 2. [하체] 골반 기준 그리기
    // ========================================================
    
    // 그림자
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath(); ctx.ellipse(0, 0, 20, 5, 0, 0, Math.PI*2); ctx.fill();

    // [뒷다리]
    let rHipRot = lerp(0, Math.sin(cycle + Math.PI) * 0.9, player.runWeight);
    let rKneeRot = lerp(0, Math.max(0, Math.sin(cycle + Math.PI - 0.5) * 1.8), player.runWeight);
    drawLeg(ctx, hipX, hipY + 10, rHipRot, rKneeRot, C.limbDark);


    // ========================================================
    // 3. [상체] 몸통 회전 적용
    // ========================================================
    ctx.save();
    ctx.translate(hipX, hipY + 5); 
    ctx.rotate(tiltAngle);         
    ctx.translate(-hipX, -(hipY + 5));

    // 3-1. 뒷망토
    ctx.fillStyle = "#1A1A1A";
    ctx.beginPath();
    ctx.moveTo(hipX - 5, shoulderY);
    let capeTip = -20 + (player.runWeight * -15);
    ctx.quadraticCurveTo(hipX + capeTip, hipY + 20, hipX + capeTip - 5, hipY + 60 + Math.sin(cycle)*5);
    ctx.lineTo(hipX + 8, hipY + 10);
    ctx.fill();

    /// 3-2. 뒷팔 (Right Arm)
    // 어깨: 달릴 때 앞뒤로 시원하게 흔듦 (-1.0 ~ 1.0 라디안)
    let rArmRot = lerp(idleBreath * 0.05, Math.sin(cycle) * 0.8, player.runWeight);
    
    // 팔꿈치: 달릴 땐 90도('ㄴ'자)로 고정, 멈추면 펴짐
    // ★ 핵심: sine파를 쓰지 않고 runWeight로만 제어해서 덜렁거림 방지
    let rElbowBend = lerp(0.1, 1.5, player.runWeight); 

    // 디테일: 팔이 뒤로 갈 때(Math.sin > 0) 아주 살짝만 더 펴줌 (자연스러움)
    if (isMoving && Math.sin(cycle) > 0) rElbowBend *= 0.8;

    drawArm(ctx, hipX, shoulderY, rArmRot, -rElbowBend, C.limbDark);

    // 3-3. 등 뒤 무기
    ctx.save();
    ctx.translate(hipX - 5, shoulderY + 10); ctx.rotate(-0.5);
    ctx.fillStyle = "#455A64"; ctx.fillRect(-2, -10, 5, 50); 
    ctx.fillStyle = C.metal; ctx.fillRect(-1, -20, 3, 10); 
    ctx.restore();

    // 3-5. 머리 (Head) - [얼굴 노출 극대화 + 가닥 위주 스트레이트 장발]
    ctx.save();
    ctx.translate(hipX, shoulderY - 5); 
    ctx.rotate(-tiltAngle * 0.7); // 고개 들기

    // ========================================================
    // ★ [스카프 물리] 정지 시 정적 + 이동 시 다이나믹 휘날림
    // ========================================================
    ctx.save();
    const hStartX = hipX;
    const hStartY = shoulderY + 60; 

    // 1. 상태 기반 물리 수치 (rW가 0이면 움직임도 0에 수렴)
    let rW = player.runWeight; 
    let t = globalRenderTime;

    // [움직임 제어] 가만히 있을 땐 아주 미세한 숨쉬기만, 달릴 때만 발동
    let idleSway = Math.sin(t * 0.05) * 2;             // 정지 시 최소한의 흔들림
    let runLean = rW * -45;                            // ★ 스카프처럼 뒤로 쫙 펴지는 힘 (강도 높임)
    let runFlutter = Math.sin(t * 0.25) * (3 * rW);    // 달릴 때 파들거리는 효과
    let runBounce = Math.abs(Math.sin(cycle)) * 12 * rW; // 뛸 때 위아래 탄력

    const drawScarfHair = (offX, offY, len, width, alpha, phase) => {
        let sx = hStartX + offX;
        let sy = hStartY + offY;

        // --- [채찍/스카프 곡선 계산] ---
        // 뿌리(cp1)는 고정, 끝(ex)으로 갈수록 rW(속도)의 영향을 받음
        let cp1x = sx + (runLean * 0.2); 
        let cp1y = sy + (len * 0.3);
        
        let cp2x = sx + (runLean * 0.6) + (runFlutter * 0.5);
        let cp2y = sy + (len * 0.7) - (runBounce * 0.2); // 달릴 때 살짝 위로 뜸

        // 끝점: 가만히 있으면 수직(sx + idleSway), 달리면 뒤로(sx + runLean)
        let ex = sx + (rW * runLean) + (rW * runFlutter) + ((1 - rW) * idleSway);
        let ey = sy + len + runBounce;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, ex, ey);
        
        // 베이스 그림자 가닥 (볼륨감)
        ctx.lineWidth = width + 4;
        ctx.strokeStyle = `rgba(180, 190, 200, ${alpha * 0.3})`;
        ctx.stroke();

        // 메인 가닥
        ctx.lineWidth = width;
        ctx.strokeStyle = `rgba(236, 239, 241, ${alpha})`;
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    // 2. 가닥 배치 (중앙에서 바깥으로 풍성하게)
    drawScarfHair(0, 0, 75, 12, 0.9, 0);       // 메인 긴 가닥
    drawScarfHair(-4, 1, 65, 9, 0.85, 1.2);    // 왼쪽
    drawScarfHair(4, 1, 60, 8, 0.85, 2.4);     // 오른쪽
    drawScarfHair(-8, 3, 50, 5, 0.8, 3.6);    // 왼쪽 짧은 가닥
    drawScarfHair(8, 2, 45, 4, 0.8, 4.8);     // 오른쪽 짧은 가닥

    // [하이라이트 선]
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    drawScarfHair(2, -2, 60, 2, 0.9, 0.5);
    ctx.restore();

    ctx.restore();

    // --- [STEP 2: 목 & 얼굴 (중간)] ---
    // 목
    ctx.fillStyle = C.skin; 
    ctx.fillRect(-3, -2, 6, 12);
    
    // 얼굴 (주변보다 살짝 앞에 위치)
    ctx.save();
    ctx.translate(3, -12); 
    ctx.fillStyle = C.skin;
    ctx.beginPath();
    // 얼굴형을 좀 더 달걀형으로 깎아서 노출
    ctx.ellipse(0, 0, 8.5, 10.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore(); // 머리 끝

    // 3-4. 몸통 (코트)
    ctx.fillStyle = C.coatMid;
    ctx.beginPath();
    ctx.moveTo(hipX - 7, shoulderY - 5); 
    ctx.lineTo(hipX + 7, shoulderY - 5);
    ctx.lineTo(hipX + 6, hipY + 5); 
    let coatFlow = player.runWeight * 8;
    ctx.lineTo(hipX + 8 + coatFlow, hipY + 25);
    ctx.lineTo(hipX - 8 + coatFlow, hipY + 25);
    ctx.lineTo(hipX - 6, hipY + 5);
    ctx.fill();
    
    // ★ [수정됨] 코트 깃 (High Collar) - 더 높고 넓게 그려서 빈틈 삭제
    ctx.fillStyle = C.coatLight;
    ctx.beginPath(); 
    ctx.moveTo(hipX - 8, shoulderY);       // 어깨 시작점
    ctx.lineTo(hipX - 10, shoulderY - 12); // 깃 꼭대기 (높게!)
    ctx.lineTo(hipX + 8, shoulderY - 10);  // 반대쪽 깃
    ctx.lineTo(hipX + 8, shoulderY);       // 반대쪽 어깨
    ctx.fill();

    // ========================================================
    // ★ [앞/옆머리] 물리 수정 (정전기 제거, 중력 적용, 길이 단축)
    // ========================================================
    ctx.save();

    let fRW = player.runWeight; 
    let fT = globalRenderTime;

    // fLean: 달릴 때 뒤로 밀리는 힘 (관성). 너무 세지 않게 조절.
    let fLean = fRW * -35; 
    // fBounce: 달릴 때 통통 튀는 상하 반동 (절대값). 중력 역할.
    let fBounce = Math.abs(Math.sin(cycle)) * 5 * fRW;

    const fRootX = hipX + 4; 
    const fRootY = shoulderY - 28.5;

    // phase: 가닥별 흔들림 박자 차이
    const drawFrontSpread = (offX, offY, len, width, alpha, phase) => {
        let sx = fRootX + offX;
        let sy = fRootY + offY;

        // flutter: 옆으로 살랑거리는 미세한 바람
        let flutter = Math.sin(fT * 0.25 + phase) * (3 * fRW);
        
        // tipLag: 끝부분이 한 박자 늦게 따라오는 느낌 (무게감)
        // phase 뒤에 -0.5를 줘서 뿌리보다 늦게 움직이게 함
        let tipLag = Math.cos(fT * 0.25 + phase - 0.5) * (4 * fRW);

        // --- [베지에 곡선 제어점 배치 (중력 중심)] ---
        
        // cp1: 뿌리 근처. 거의 움직임 없음 (단단히 고정)
        let cp1x = sx + (fLean * 0.05); 
        let cp1y = sy + (len * 0.2); // 아래로만 살짝 내려옴
        
        // cp2: 중간 부분. 뒤로 밀리지만 아래로 처짐.
        // *중요*: 예전 코드에서 y값을 빼던걸 없애서 위로 뜨지 않게 함
        let cp2x = sx + (fLean * 0.4) + flutter;
        let cp2y = sy + (len * 0.5) + (fBounce * 0.3); 

        // ex, ey: 머리카락 끝. 가장 무겁게 아래로 떨어짐.
        let ex = sx + (fLean * 0.8) + tipLag;
        // *핵심*: 기본 길이(len)에 반동(fBounce)을 더하고, 달릴 때 추가 중력(+ fRW*3)을 줌
        let ey = sy + len + fBounce + (fRW * 3); 

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        // 자연스럽게 아래로 드레이프지는 곡선 유도
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, ex, ey);
        
        ctx.lineWidth = width;
        ctx.strokeStyle = `rgba(245, 245, 245, ${alpha})`; 
        ctx.lineCap = 'round';
        ctx.stroke();
    };
    drawFrontSpread(-8, 4, 40, 11, 0.7, 1);      // 메인 옆머리 (짧아짐)
    drawFrontSpread(-1, 1, 12, 3, 1.0, -1);      // 메인 옆머리 (짧아짐)

    drawFrontSpread(-4, 0, 25, 3, 1.0, 3);      // 메인 옆머리 (짧아짐)
    drawFrontSpread(-7, 1, 30, 5, 1.0, 2);      // 메인 옆머리 (짧아짐)
    drawFrontSpread(-12.5, 7.5, 37, 7, 1.0, 1.5);      // 메인 옆머리 (짧아짐)

    // [앞머리 뱅] 너무 높게 뜨지 않도록 제어점 높이 조절
    ctx.beginPath();
    ctx.moveTo(fRootX, fRootY);
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = `rgba(245, 245, 245, 0.9)`;
    ctx.stroke();

    ctx.restore();


    // 3-6. 앞팔 (Left Arm)
    // 어깨: 뒷팔과 반대 위상 (Math.PI 추가)
    let lArmRot = lerp(-0.1, Math.sin(cycle + Math.PI) * 0.8, player.runWeight);
    
    // 팔꿈치: 똑같이 달릴 땐 굽힘
    let lElbowBend = lerp(0.1, 1.5, player.runWeight);
    
    // 디테일: 팔이 뒤로 갈 때 살짝 펴줌
    if (isMoving && Math.sin(cycle + Math.PI) > 0) lElbowBend *= 0.8;

    drawArm(ctx, hipX, shoulderY, lArmRot, -lElbowBend, C.coatMid);
    
    ctx.restore(); // 상체 회전 끝


    // ========================================================
    // 4. [하체] 앞다리 (Left Leg)
    // ========================================================
    let lHipRot = lerp(0, Math.sin(cycle) * 0.9, player.runWeight);
    let lKneeRot = lerp(0, Math.max(0, Math.sin(cycle - 0.5) * 1.8), player.runWeight);
    drawLeg(ctx, hipX, hipY + 10, lHipRot, lKneeRot, C.pants);


    // ========================================================
    // 5. UI 텍스트
    // ========================================================
    if (!player.facingRight) ctx.scale(-1, 1); 
    
    ctx.shadowColor = "black"; ctx.shadowBlur = 3;
    ctx.fillStyle = "white"; 
    ctx.font = "bold 12px Noto Sans KR"; ctx.textAlign = "center";
    ctx.fillText(myNickname || "Unknown", 0, hipY - 80); 

    let activeAura = allAuras.find(a => a.name === equippedAuraName);
    if (activeAura) {
        ctx.fillStyle = activeAura.color;
        ctx.font = "bold 13px Cinzel";
        ctx.shadowColor = activeAura.color;
        ctx.fillText(equippedAuraName, 0, hipY - 65); 
    }
    ctx.shadowBlur = 0;

    ctx.restore();
}

// [🛠️ 헬퍼 함수] 관절 다리 그리기
export function drawLeg(ctx, x, y, hipAngle, kneeAngle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(hipAngle);

    ctx.fillStyle = color;
    // 허벅지
    ctx.beginPath(); ctx.roundRect(-4, 0, 8, 16, 4); ctx.fill();

    // 종아리
    ctx.translate(0, 14); 
    ctx.rotate(kneeAngle); 
    ctx.beginPath(); ctx.roundRect(-3, 0, 6, 16, 3); ctx.fill();

    // 발
    ctx.translate(0, 16);
    ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.lineTo(5, 5); ctx.lineTo(-3, 5); ctx.fill();

    ctx.restore();
}

// [수정] 팔 그리기 (길이 연장 + 관절 디테일 추가)
export function drawArm(ctx, x, y, shoulderAngle, elbowAngle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(shoulderAngle); // 어깨 회전
    
    ctx.fillStyle = color;
    
    // 1. 상박 (Upper Arm) - 길이를 16으로 늘림
    ctx.beginPath(); 
    // 위는 굵고(6), 아래는 약간 얇아짐(5)
    ctx.moveTo(-3, 0); ctx.lineTo(3, 0); 
    ctx.lineTo(2.5, 16); ctx.lineTo(-2.5, 16);
    ctx.fill();

    // 2. 팔꿈치 관절 (Elbow)
    ctx.translate(0, 16); // 상박 길이만큼 이동
    ctx.rotate(elbowAngle); // ★ 팔꿈치 꺾기

    // 3. 하박 (Forearm) - 길이를 14로 설정
    ctx.beginPath(); 
    ctx.moveTo(-2.5, 0); ctx.lineTo(2.5, 0);
    ctx.lineTo(2, 14); ctx.lineTo(-2, 14);
    ctx.fill();
    
    // 4. 손 (Hand)
    ctx.translate(0, 14); // 하박 길이만큼 이동
    ctx.fillStyle = "#FFCCBC"; // 살구색
    ctx.beginPath(); ctx.arc(0, 2, 3.5, 0, Math.PI*2); ctx.fill();
    
    ctx.restore();
}

// ========================================================
// ★ [멀티플레이] 다른 유저를 그리는 함수 (머플러 제외, 최적화 버전)
// ========================================================
export function drawOtherPlayer(ctx, pData, globalRenderTime, GRAPHICS, getGroundY) {
    ctx.save();

    // 1. 다른 유저의 이동 방향 및 걷기 애니메이션 계산
    if (pData.prevX === undefined) pData.prevX = pData.x;
    if (pData.facingRight === undefined) pData.facingRight = true;
    if (pData.walkFrame === undefined) pData.walkFrame = 0;

    let dx = pData.x - pData.prevX;
    let isMoving = Math.abs(dx) > 0.5;

    if (isMoving) {
        pData.facingRight = dx > 0;
        pData.walkFrame++;
    } else {
        pData.walkFrame = 0;
    }
    pData.prevX = pData.x;

    // 좌우 반전
    if (!pData.facingRight) ctx.scale(-1, 1);

    // 애니메이션 변수
    let animTime = pData.walkFrame * 0.1; 
    let breathing = Math.sin(globalRenderTime * 0.04) * 2;
    let bounce = isMoving ? Math.abs(Math.sin(animTime)) * 4 : breathing;

    const h = 100; const w = 24;
    let time = globalRenderTime * 0.015;

    // ========================================================
    // --- 0. ★ [티어 1~6] 장착된 오라 이펙트 (최적화 + 디자인 유지) ---
    // ========================================================
    let aura = allAuras.find(a => a.name === pData.aura);
    if (aura) {
        // ★ [간소화 모드 ON] - 성능 최적화 (기존 동일)
        if (typeof GRAPHICS !== 'undefined' && GRAPHICS.simpleAuras) {
            ctx.save();
            ctx.translate(0, -50); 
            
            ctx.globalAlpha = 0.2; ctx.fillStyle = aura.color; 
            ctx.beginPath(); ctx.arc(0, 0, 45, 0, TWO_PI); ctx.fill();

            ctx.globalAlpha = 0.8; ctx.strokeStyle = aura.color; ctx.lineWidth = 2; 
            ctx.stroke();

            if (aura.chanceX >= 1000000) {
                ctx.fillStyle = "#FFF"; ctx.font = "20px serif"; 
                ctx.textAlign = "center"; ctx.fillText("👑", 0, -55);
            }
            ctx.restore();
        } 
        // ★ [간소화 모드 OFF] - 화려함 유지 + 렉 제거 버전
        else {
            ctx.save();
            // [핵심 최적화] 그림자 대신 빛 혼합 모드 사용 (훨씬 빠름)
            ctx.globalCompositeOperation = 'lighter'; 
            
            let chance = aura.chanceX;
            let [r, g, b] = hexToRgb(aura.color);
            let time = globalRenderTime * 0.015;
            const applyGroundPerspective = () => ctx.scale(1, 0.35);

            // 공통 바닥 발광 (ShadowBlur 대체용 가짜 광원)
            ctx.save(); applyGroundPerspective();
            let baseGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
            baseGlow.addColorStop(0, `rgba(${r},${g},${b}, 0.4)`); // 중심부 빛
            baseGlow.addColorStop(1, "transparent");
            ctx.fillStyle = baseGlow; 
            ctx.beginPath(); ctx.arc(0, 0, 60, 0, TWO_PI); ctx.fill();
            ctx.restore();

            // [티어 1] Common ~ Rare
            if (chance < 1000) {
                ctx.fillStyle = aura.color; 
                // 그림자 제거 -> 대신 투명도 조절로 느낌 유지
                for(let i=0; i<3; i++) {
                    let pTime = (time + i * 2) % 6; 
                    ctx.globalAlpha = Math.max(0, 1 - (pTime / 6));
                    ctx.beginPath(); ctx.arc(Math.sin(time + i) * 15, -pTime * 15, 2, 0, TWO_PI); ctx.fill();
                }
            }
            // [티어 2] Epic ~ Legend
            else if (chance < 1000000) {
                ctx.save(); applyGroundPerspective();
                // 쉐도우 블러 제거, 라인 두께 조절로 발광 느낌
                drawMagicCircle(ctx, 0, 0, 50, time, aura.color, 0.5);
                ctx.restore();
                
                ctx.lineWidth = 2;
                for(let i=0; i<3; i++) {
                    let angle = time * 2 + (TWO_PI/3)*i;
                    let px = Math.cos(angle) * 35; let py = -40 + Math.sin(angle) * 15;
                    
                    // 잔상 (그림자 대신 옅은 선)
                    ctx.strokeStyle = `rgba(${r},${g},${b}, 0.3)`; 
                    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(Math.cos(angle-0.2)*35, -40 + Math.sin(angle-0.2)*15); ctx.stroke();
                    
                    // 별
                    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, TWO_PI); ctx.fill();
                    // 별 주변 가짜 광원
                    ctx.fillStyle = `rgba(${r},${g},${b}, 0.5)`; ctx.beginPath(); ctx.arc(px, py, 6, 0, TWO_PI); ctx.fill();
                }
            }
            // [티어 3] Mythic ~ God
            else if (chance < 100000000) {
                ctx.save(); applyGroundPerspective(); 
                drawMagicCircle(ctx, 0, 0, 75, time, aura.color, 0.6);
                drawMagicCircle(ctx, 0, 0, 110, -time*1.5, "#fff", 0.4);
                
                let pulse = Math.sin(time*3)*15;
                ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(0, 0, 130 + pulse, 0, TWO_PI); ctx.stroke();
                ctx.restore();

                ctx.save(); ctx.translate(0, -60); ctx.rotate(time * 0.5);
                // 그라데이션 콘 (이건 원래 빨라서 유지)
                for(let i=0; i<16; i++) {
                    ctx.rotate(TWO_PI/16);
                    let grad = ctx.createLinearGradient(0, 0, 0, -110);
                    grad.addColorStop(0, `rgba(${r},${g},${b}, 0.8)`); grad.addColorStop(1, "transparent");
                    ctx.fillStyle = grad;
                    ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.lineTo(0, -110); ctx.fill();
                }
                ctx.restore();

                // 회전하는 사각형들
                ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
                for(let i=0; i<6; i++) {
                    let angle = time + (TWO_PI/6)*i;
                    let px = Math.cos(angle) * (50 + Math.sin(time*2+i)*10);
                    let py = -60 + Math.sin(angle) * 30 + Math.cos(time*1.5+i)*20;
                    ctx.save(); ctx.translate(px, py); ctx.rotate(time*2 + i);
                    ctx.strokeRect(-5, -5, 10, 10); ctx.restore();
                }
            }
            // [티어 4] Transcendent
            else if (chance < 1000000000) {
                // 바닥진
                ctx.save(); applyGroundPerspective(); ctx.rotate(time*0.2);
                ctx.strokeStyle = `rgba(${r},${g},${b}, 0.6)`; ctx.lineWidth = 2;
                for(let i=0; i<6; i++) { ctx.rotate(Math.PI/3); ctx.beginPath(); ctx.moveTo(80,0); ctx.lineTo(150, 0); ctx.lineTo(120, 60); ctx.closePath(); ctx.stroke(); }
                drawMagicCircle(ctx, 0, 0, 100, -time, "#fff", 0.6);
                ctx.restore();

                // 회전하는 검 (그라데이션 유지)
                ctx.save(); ctx.translate(0, -70);
                for(let i=0; i<5; i++) {
                    let angle = time + (TWO_PI/5)*i;
                    let sx = Math.cos(angle) * 90; let sy = Math.sin(angle) * 20 + Math.sin(time*2+i)*10;
                    ctx.save(); ctx.translate(sx, sy); ctx.rotate(angle + Math.PI/2);
                    let swordGrad = ctx.createLinearGradient(0, -30, 0, 30);
                    swordGrad.addColorStop(0, "#fff"); swordGrad.addColorStop(1, aura.color);
                    ctx.fillStyle = swordGrad;
                    ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(5, 0); ctx.lineTo(0, 40); ctx.lineTo(-5, 0); ctx.fill();
                    
                    // 검 주변 빛 (그림자 대신 원 그리기)
                    ctx.globalAlpha = 0.3; ctx.fillStyle = aura.color; 
                    ctx.beginPath(); ctx.arc(0, 0, 15, 0, TWO_PI); ctx.fill();
                    ctx.restore();
                }
                ctx.restore();

                // 날개 (그라데이션 자체가 예뻐서 그림자 없어도 됨)
                let flow = Math.sin(time * 1.5);
                for(let side of [-1, 1]) {
                    for(let j=0; j<3; j++) {
                        let spread = 0.2 + j*0.15; let len = 120 + j*30; let alpha = 0.6 - j*0.15;
                        ctx.save(); ctx.translate(0, -60); 
                        let plumeGrad = ctx.createLinearGradient(0, 0, side*100, -150);
                        plumeGrad.addColorStop(0, `rgba(${r},${g},${b}, ${alpha})`); 
                        plumeGrad.addColorStop(0.7, `rgba(${r},${g},${b}, ${alpha*0.5})`); 
                        plumeGrad.addColorStop(1, "transparent");
                        ctx.fillStyle = plumeGrad;
                        ctx.beginPath(); ctx.moveTo(0, 0);
                        let cp1x = side * 50 + flow*20; let cp1y = -len * 0.5;
                        let cp2x = side * (150 + spread*100) + flow*30; let cp2y = -len * 0.8;
                        let endx = side * (180 + spread*120); let endy = -len - flow*20;
                        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endx, endy);
                        ctx.bezierCurveTo(endx - side*40, endy+30, cp2x - side*30, cp2y+40, 0, 10);
                        ctx.fill(); ctx.restore();
                    }
                }
            }
            // [티어 5] Cosmic/Creation
            else if (chance < 2400000000) {
                ctx.save(); applyGroundPerspective();
                let abyssGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 180);
                abyssGrad.addColorStop(0, "#000"); abyssGrad.addColorStop(0.5, aura.color); abyssGrad.addColorStop(1, "transparent");
                ctx.fillStyle = abyssGrad; ctx.beginPath(); ctx.arc(0, 0, 180, 0, TWO_PI); ctx.fill(); 
                ctx.restore();

                ctx.save(); ctx.translate(0, -65); ctx.rotate(time * 0.2);
                for(let i=0; i<2; i++) {
                    ctx.rotate(Math.PI);
                    let nebulaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 250);
                    nebulaGrad.addColorStop(0, `rgba(${r},${g},${b}, 0.2)`); nebulaGrad.addColorStop(1, "transparent");
                    ctx.fillStyle = nebulaGrad; ctx.beginPath(); ctx.ellipse(100, 0, 200, 60, 0, 0, TWO_PI); ctx.fill();
                }
                ctx.restore();

                ctx.save(); ctx.translate(0, -65);
                for(let i=0; i<6; i++) {
                    let angle = time * (1.5 - i*0.1) + (Math.PI/3)*i; let radius = 80 + Math.sin(time+i)*30; 
                    let px = Math.cos(angle) * radius; let py = Math.sin(angle) * radius * 0.3; 
                    ctx.beginPath(); ctx.moveTo(px, py); let tailAng = angle - 0.3;
                    ctx.lineTo(Math.cos(tailAng)*radius, Math.sin(tailAng)*radius*0.3);
                    ctx.strokeStyle = `rgba(${r},${g},${b}, 0.5)`; ctx.lineWidth = 3; ctx.stroke();
                    
                    // 별 (그림자 제거, 대신 겹쳐 그리기)
                    ctx.fillStyle = "#fff"; 
                    ctx.beginPath(); ctx.arc(px, py, 2.5, 0, TWO_PI); ctx.fill();
                    ctx.fillStyle = `rgba(${r},${g},${b}, 0.3)`; 
                    ctx.beginPath(); ctx.arc(px, py, 8, 0, TWO_PI); ctx.fill();
                }
                ctx.restore();
                
                // 중앙 블랙홀 (그림자 대신 큰 그라데이션)
                let holeGlow = ctx.createRadialGradient(0, -65, 10, 0, -65, 50);
                holeGlow.addColorStop(0, "#fff"); holeGlow.addColorStop(1, `rgba(${r},${g},${b},0)`);
                ctx.fillStyle = holeGlow; ctx.beginPath(); ctx.arc(0, -65, 50, 0, TWO_PI); ctx.fill();
                
                ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, -65, 15, 0, TWO_PI); ctx.fill();
            }
            // [티어 6] "The Away From The World"
            else {
                ctx.save(); applyGroundPerspective();
                let groundGrad = ctx.createRadialGradient(0, 0, 50, 0, 0, 400);
                groundGrad.addColorStop(0, "#fff"); groundGrad.addColorStop(1, "transparent");
                ctx.fillStyle = groundGrad; ctx.beginPath(); ctx.arc(0, 0, 400, 0, TWO_PI); ctx.fill(); ctx.restore();

                ctx.save(); ctx.translate(0, -100);
                ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,0.4)";
                for(let i=1; i<=3; i++) { let ringR = 100 + i*50; ctx.beginPath(); ctx.ellipse(0, 0, ringR, ringR * 0.8, time*(0.1*i), 0, TWO_PI); ctx.stroke(); }

                let breath = Math.sin(time);
                for(let i=0; i<6; i++) {
                    let angle = (TWO_PI / 6) * i + (time * 0.1); let len = 300 + breath * 50;
                    let gx = Math.cos(angle) * len; let gy = Math.sin(angle) * len;
                    let rayGrad = ctx.createLinearGradient(0, 0, gx, gy);
                    rayGrad.addColorStop(0, "rgba(255,255,255,0.8)"); rayGrad.addColorStop(1, "transparent");
                    ctx.fillStyle = rayGrad; ctx.beginPath(); ctx.moveTo(0,0);
                    ctx.lineTo(gx - Math.cos(angle+Math.PI/2)*5, gy - Math.sin(angle+Math.PI/2)*5);
                    ctx.lineTo(gx + Math.cos(angle+Math.PI/2)*5, gy + Math.sin(angle+Math.PI/2)*5); ctx.fill();
                }
                ctx.restore();

                let eyeY = -350 + Math.sin(time)*10;
                let eyeOpen = Math.abs(Math.sin(time*1.5)); 
                
                // 눈 후광 (그림자 대체)
                let eyeGlow = ctx.createRadialGradient(0, eyeY, 50, 0, eyeY, 200);
                eyeGlow.addColorStop(0, "rgba(255,255,255,0.8)"); eyeGlow.addColorStop(1, "transparent");
                ctx.fillStyle = eyeGlow; ctx.beginPath(); ctx.arc(0, eyeY, 200, 0, TWO_PI); ctx.fill();

                ctx.fillStyle = "#fff"; 
                ctx.beginPath(); ctx.ellipse(0, eyeY, 120, 20 * eyeOpen, 0, 0, TWO_PI); ctx.fill();
                ctx.fillStyle = `rgba(255,255,255, ${0.5 * eyeOpen})`; ctx.fillRect(-2, eyeY - 200, 4, 400);

                ctx.fillStyle = "#fff"; 
                for(let i=0; i<10; i++) {
                    let px = (Math.random()-0.5) * 400; let py = -400 + ((time*30 + i*50) % 500);
                    ctx.beginPath(); ctx.arc(px, py, Math.random()*4, 0, TWO_PI); ctx.fill();
                }
            }
            ctx.restore(); // 화려한 모드 끝
        }
    }

    // ========================================================
    // --- 1. 발밑 그림자 ---
    // ========================================================
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0, 229, 255, 0.15)";
    ctx.beginPath(); ctx.ellipse(0, 5, 30, 8, 0, 0, TWO_PI); ctx.fill();

    // --- 3. 슬림핏 롱 코트 ---
    let coatGrad = ctx.createLinearGradient(0, -h, 0, 0);
    coatGrad.addColorStop(0, "#1a1a1a"); coatGrad.addColorStop(1, "#000000");
    ctx.fillStyle = coatGrad;
    ctx.beginPath();
    ctx.moveTo(0, -h + 20 - bounce);
    ctx.bezierCurveTo(-w, -h + 25 - bounce, -w * 0.8, -h * 0.4, -w * 1.1 + (isMoving ? -5 : 0), 0);
    ctx.lineTo(w * 0.7, 0);
    ctx.bezierCurveTo(w * 0.5, -h * 0.4, w * 0.8, -h + 25 - bounce, 0, -h + 20 - bounce);
    ctx.fill();

    // --- 4. 휘날리는 은발 ---
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    let hairSway = isMoving ? -dx * 2 : Math.sin(globalRenderTime * 0.03) * 1.5;
    ctx.moveTo(-10, -h + 5 - bounce);
    ctx.quadraticCurveTo(hairSway, -h - 20 - bounce, 12 + hairSway, -h + 5 - bounce);
    ctx.lineTo(8 + hairSway, -h + 25 - bounce); 
    ctx.quadraticCurveTo(0, -h + 12 - bounce, -10, -h + 8 - bounce);
    ctx.fill();

    // --- 5. 푸른 안광 ---
    ctx.fillStyle = "#00ffff"; ctx.shadowBlur = 8; ctx.shadowColor = "#00ffff";
    ctx.beginPath(); ctx.arc(4, -h + 18 - bounce, 1.2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

    // --- 6. 다리 움직임 ---
    ctx.strokeStyle = "#000"; ctx.lineWidth = 5;
    let legMovement = isMoving ? Math.sin(animTime) * 10 : 0;
    let lift = isMoving ? Math.abs(Math.cos(animTime)) * 5 : 0;
    ctx.beginPath(); ctx.moveTo(2, -h * 0.2); ctx.lineTo(2 + legMovement, 4 - lift); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-2, -h * 0.2); ctx.lineTo(-2 - legMovement, 4 - (isMoving ? Math.abs(Math.sin(animTime)) * 5 : 0)); ctx.stroke();

    // ========================================================
    // ★ 이름표 2줄 (닉네임 + 오라 이름)
    // ========================================================
    if (!pData.facingRight) ctx.scale(-1, 1); // 텍스트 뒤집힘 방지

    // 1. 유저 닉네임 (흰색 고정)
    ctx.fillStyle = "white";
    ctx.shadowBlur = 3; ctx.shadowColor = "black";
    ctx.font = "bold 11px Noto Sans KR";
    ctx.textAlign = "center";
    ctx.fillText(pData.nickname || "익명의 유저", 0, -h - 45 - bounce); 

    // 2. 장착한 오라 이름 (오라 고유 색상 및 이펙트)
    ctx.fillStyle = aura ? aura.color : "white";
    ctx.shadowBlur = 5; ctx.shadowColor = aura ? aura.color : "black";
    ctx.font = "bold 13px Cinzel"; // 멋진 영문 폰트
    ctx.fillText(pData.aura, 0, -h - 30 - bounce); 
    ctx.shadowBlur = 0;

    ctx.restore();
}