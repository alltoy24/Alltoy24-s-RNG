import { hexToRgb, lerp } from '../utils.js';
import { GRAPHICS } from '../settings.js'; // ★ 이거 추가! 이제 에러 안 남
import { getAuraQuote } from '../data/quotes.js';

const TWO_PI = Math.PI * 2;
let vfxAnimationId; // 애니메이션 취소용 변수

// ★★★ [추가] 이 함수가 없어서 멈췄던 겁니다. drawMagicCircle 위에 붙여넣으세요.
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;
}

// ★ 마법진 그리기 (PlayerRenderer에서도 쓰고 여기서도 씀)
export function drawMagicCircle(ctx, x, y, radius, angle, color, alpha) { 
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); 
    ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 3; 
    ctx.shadowBlur = 20; ctx.shadowColor = color; 
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, TWO_PI); ctx.stroke(); 
    ctx.beginPath(); for(let i=0; i<6; i++) { let a = (TWO_PI/6)*i; ctx.moveTo(0,0); ctx.lineTo(Math.cos(a)*radius, Math.sin(a)*radius); } ctx.stroke(); 
    ctx.beginPath(); for(let i=0; i<6; i++) { let a = (TWO_PI/6)*i; ctx.moveTo(Math.cos(a)*radius, Math.sin(a)*radius); ctx.lineTo(Math.cos(a+TWO_PI/3)*radius, Math.sin(a+TWO_PI/3)*radius); } ctx.stroke(); 
    ctx.restore(); 
}

export function triggerEpicVFX(vfxCtx, W, H, aura, callbacks) { 
    cancelAnimationFrame(vfxAnimationId); 
    let startTime = performance.now(); 
    let duration = aura.chanceX >= 1000000 ? 4000 : 3000; 
    let rgb = hexToRgb(aura.color); 

    function animate(time) { 
        let elapsed = time - startTime; 
        let progress = elapsed / duration; 
        if (progress > 1) { vfxCtx.clearRect(0, 0, W, H); return; } 
        vfxCtx.clearRect(0, 0, W, H); 
        
        // [공통] 암전 효과
        let darkAlpha = progress < 0.8 ? 0.95 : 0.95 * (1 - progress)*5; 
        vfxCtx.fillStyle = `rgba(0,0,0,${Math.max(0, darkAlpha)})`; 
        vfxCtx.fillRect(0, 0, W, H); 

        // 💡 [1단계: 1,000분의 1 이상] 은은한 오라색 발광
        if(progress < 0.6) { 
            let glowAlpha = Math.sin(progress * Math.PI) * 0.4; 
            let grad = vfxCtx.createRadialGradient(W/2, H/2 - 100, 0, W/2, H/2 - 100, W/1.5); 
            grad.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${glowAlpha})`); 
            grad.addColorStop(1, 'transparent'); 
            vfxCtx.fillStyle = grad; 
            vfxCtx.fillRect(0, 0, W, H); 
        } 

        // 💡 [2단계~4단계: 1만, 10만, 100만] 도형 연출 분기
        if (progress < 0.6 && aura.chanceX >= 10000) { 
            let geoProgress = progress / 0.6; 
            let scale = 0.3 + geoProgress * 1.5; 
            let rot = geoProgress * Math.PI * 2; 
            let alpha = Math.sin(geoProgress * Math.PI); 

            vfxCtx.save(); 
            vfxCtx.translate(W/2, H/2 - 100); 
            vfxCtx.scale(scale, scale); 
            vfxCtx.rotate(rot); 
            vfxCtx.globalAlpha = Math.max(0, alpha); 

            // 10만 이상 = 8각별 / 1만 이상 = 4각별
            let spikes = aura.chanceX >= 100000 ? 8 : 4; 
            if (aura.chanceX >= 1000000) spikes = 12; // 100만 이상은 12각별로 간지 폭발
            
            drawStar(vfxCtx, 0, 0, spikes, 100, 40, aura.color); 

            // 💡 [4단계: 100만분의 1 이상] 역회전 마법진 추가
            if (aura.chanceX >= 1000000) { 
                vfxCtx.rotate(-rot * 2); 
                drawMagicCircle(vfxCtx, 0, 0, 160, 0, "#ffffff", alpha * 0.8); 
            } 
            vfxCtx.restore(); 
        } 

        // [공통] 섬광 폭발
        let flashAlpha = 0; 
        if (progress > 0.5 && progress < 0.7) { flashAlpha = 1 - Math.abs(progress - 0.6) * 10; } 
        if (flashAlpha > 0) { 
            vfxCtx.fillStyle = `rgba(255,255,255,${flashAlpha})`; 
            vfxCtx.fillRect(0, 0, W, H); 
        } 
        vfxAnimationId = requestAnimationFrame(animate); 
    } 
    vfxAnimationId = requestAnimationFrame(animate); 
}

// 💡 [수정됨] 초월급 시네마틱 운석 연출 (ReferenceError 해결판)
export function triggerMeteorVFX(vfxCtx, W, H, aura, callbacks, onComplete) {
    cancelAnimationFrame(vfxAnimationId);
    
    // ❌ [기존 오류 코드] playSound는 여기서 알 수 없는 함수임
    // playSound(sfxMeteorFall); 
    
    // ✅ [수정] main.js에서 넘겨준 callbacks를 사용해야 함
    if (callbacks && callbacks.playSound) {
        callbacks.playSound("meteor_fall");
    }
    
    let startTime = performance.now();
    let duration = 5000; 
    let quote = getAuraQuote(aura.name);
    let [r, g, b] = hexToRgb(aura.color);

    // 잔해 파편 및 이동하는 속도선 데이터
    let trailParticles = [];
    let speedLines = Array.from({length: 60}, () => ({
        x: Math.random() * W, y: Math.random() * H, 
        len: Math.random() * 150 + 50, speed: Math.random() * 40 + 20
    }));
    
    // 충격파 링 효과용 변수
    let shockwaveRadius = 0;
    let shockwaveAlpha = 1;

    // 중복 실행 방지 플래그 (중요)
    let impactHandled = false;

    function animate(time) {
        let elapsed = time - startTime;
        let progress = Math.min(elapsed / duration, 1.0); // 0 to 1

        if (progress >= 1.0) {
            vfxCtx.clearRect(0, 0, W, H);
            if(onComplete) onComplete();
            return;
        }

        vfxCtx.clearRect(0, 0, W, H);
        vfxCtx.save();

        // 1. 카메라 다이나믹 패닝
        let cameraY = 0; 
        if (progress < 0.2) cameraY = lerp(0, H, progress / 0.2); 
        else if (progress > 0.7 && progress < 0.85) cameraY = lerp(H, 0, (progress - 0.7) / 0.15); 
        else cameraY = H;

        vfxCtx.translate(0, cameraY - H); 

        // 2. 우주 배경 & 워프 스피드라인
        let spaceAlpha = (cameraY / H); 
        if (spaceAlpha > 0.01) {
            vfxCtx.fillStyle = `rgba(5, 5, 12, ${spaceAlpha})`; 
            vfxCtx.fillRect(0, 0, W, H);

            vfxCtx.globalCompositeOperation = 'screen'; 
            vfxCtx.lineWidth = 1.5;
            speedLines.forEach(line => {
                line.y -= line.speed; 
                if (line.y < -line.len) { line.y = H + line.len; line.x = Math.random() * W; } 
                
                let grad = vfxCtx.createLinearGradient(line.x, line.y, line.x - line.len/4, line.y + line.len);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${spaceAlpha * 0.5})`);
                grad.addColorStop(1, 'transparent');
                
                vfxCtx.strokeStyle = grad;
                vfxCtx.beginPath();
                vfxCtx.moveTo(line.x, line.y); 
                vfxCtx.lineTo(line.x - line.len/4, line.y + line.len); 
                vfxCtx.stroke();
            });
            vfxCtx.globalCompositeOperation = 'source-over';
        }

        // [공통] 운석 위치 및 각도 계산
        let fallProgress = 0;
        let startX = W * 0.85; let startY = H * 0.1;
        let endX = W * 0.5;    let endY = H;
        let dx = endX - startX; let dy = endY - startY;
        let angle = Math.atan2(dy, dx);
        let mX = startX, mY = startY;

        // 3. ✨ 웅장한 운석 본체 & 플라즈마 꼬리 ✨
        if (progress > 0.15 && progress < 0.75) {
            let t = (progress - 0.15) / 0.60;
            fallProgress = t * t * t; 
            
            mX = lerp(startX, endX, fallProgress);
            mY = lerp(startY, endY, fallProgress);

            vfxCtx.save();
            vfxCtx.translate(mX, mY);
            vfxCtx.rotate(angle); 

            vfxCtx.globalCompositeOperation = 'lighter'; 

            // [디테일 1] 다중 플라즈마 꼬리
            let tailLen = 600 + fallProgress * 1500; 
            let tailGrad = vfxCtx.createLinearGradient(0, 0, -tailLen, 0);
            tailGrad.addColorStop(0, '#ffffff');
            tailGrad.addColorStop(0.1, `rgba(${r}, ${g}, ${b}, 1)`);
            tailGrad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.5)`);
            tailGrad.addColorStop(1, 'transparent');

            vfxCtx.fillStyle = tailGrad;
            vfxCtx.beginPath();
            vfxCtx.moveTo(30, 0); 
            vfxCtx.bezierCurveTo(-100, -80, -300, -30, -tailLen, 0);
            vfxCtx.bezierCurveTo(-300, 30, -100, 80, 30, 0);
            vfxCtx.fill();

            // [디테일 2] 대기 마찰열
            vfxCtx.beginPath();
            vfxCtx.arc(20, 0, 50, -Math.PI/2, Math.PI/2);
            vfxCtx.lineWidth = 10;
            vfxCtx.strokeStyle = `rgba(255, 255, 255, 0.7)`;
            vfxCtx.shadowBlur = 30; vfxCtx.shadowColor = aura.color;
            vfxCtx.stroke();

            // [디테일 3] 코어
            vfxCtx.fillStyle = "#fff";
            vfxCtx.shadowBlur = 150; vfxCtx.shadowColor = aura.color;
            vfxCtx.beginPath(); vfxCtx.ellipse(0, 0, 50, 30, 0, 0, Math.PI * 2); vfxCtx.fill();
            vfxCtx.beginPath(); vfxCtx.ellipse(10, 0, 30, 15, 0, 0, Math.PI * 2); vfxCtx.fill();

            // [디테일 4] 스파크 잔해 지속 생성
            if (Math.random() < 0.8) {
                trailParticles.push({
                    x: mX, y: mY, 
                    vx: Math.cos(angle + Math.PI)* (Math.random()*15 + 10) + (Math.random()-0.5)*10, 
                    vy: Math.sin(angle + Math.PI)* (Math.random()*15 + 10) + (Math.random()-0.5)*10,
                    life: 1.0, size: Math.random() * 12 + 5,
                    decay: Math.random() * 0.02 + 0.01
                });
            }
            vfxCtx.restore();
        }

        // [디테일 5] 스파크 잔해 렌더링
        vfxCtx.globalCompositeOperation = 'lighter';
        for(let i=trailParticles.length-1; i>=0; i--) {
            let tp = trailParticles[i];
            tp.x += tp.vx; tp.y += tp.vy; tp.life -= tp.decay;
            if(tp.life <= 0) { trailParticles.splice(i, 1); continue; }
            vfxCtx.fillStyle = `rgba(${r},${g},${b},${tp.life})`;
            vfxCtx.shadowBlur = 10; vfxCtx.shadowColor = aura.color;
            vfxCtx.beginPath(); vfxCtx.arc(tp.x, tp.y, tp.size * tp.life, 0, Math.PI * 2); vfxCtx.fill();
        }
        vfxCtx.globalCompositeOperation = 'source-over'; 

        // 4. 명언 텍스트 연출
        if (progress > 0.25 && progress < 0.7) {
            let textAlpha = progress < 0.35 ? (progress - 0.25)/0.1 : (progress > 0.6 ? (0.7 - progress)/0.1 : 1);
            vfxCtx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
            vfxCtx.font = "italic 700 2.5rem 'Cinzel', 'Noto Sans KR', sans-serif";
            vfxCtx.textAlign = "center";
            vfxCtx.shadowBlur = 40; vfxCtx.shadowColor = aura.color;
            vfxCtx.fillText(quote.split('').join(' '), W/2, H * 0.75); 
            vfxCtx.shadowBlur = 0;
        }

        vfxCtx.restore(); 

        // 5. ✨ IMPACT (충돌 및 거대 충격파) ✨
        if (progress >= 0.75) {
            // 딱 닿는 순간
            if (progress <= 0.76 && !impactHandled) { 
                impactHandled = true; // ★ 중복 실행 방지
                
                // ✅ [수정] main.js의 callbacks를 통해 사운드 재생
                if(callbacks) {
                    if(callbacks.playSound) { 
                        callbacks.playSound("meteor_impact"); 
                        callbacks.playSound("flashbang_ring"); 
                    }
                    if(callbacks.shake) callbacks.shake(150); 
                }
                
                if (typeof vfxParticles !== 'undefined') {
                    vfxParticles.spawnExplosion(W/2, H, aura.color, 200, 50); 
                    vfxParticles.spawnExplosion(W/2, H, "#ffffff", 100, 60); 
                }
            }

            shockwaveRadius += 40;
            shockwaveAlpha -= 0.03; 
            
            if(shockwaveAlpha > 0) {
                vfxCtx.save();
                vfxCtx.globalCompositeOperation = 'lighter';
                vfxCtx.beginPath();
                vfxCtx.arc(W/2, H, shockwaveRadius, 0, Math.PI*2);
                vfxCtx.lineWidth = 40 * shockwaveAlpha;
                vfxCtx.strokeStyle = `rgba(${r},${g},${b}, ${shockwaveAlpha})`;
                vfxCtx.stroke();
                
                vfxCtx.beginPath();
                vfxCtx.arc(W/2, H, shockwaveRadius * 0.9, 0, Math.PI*2);
                vfxCtx.lineWidth = 15 * shockwaveAlpha;
                vfxCtx.strokeStyle = `rgba(255, 255, 255, ${shockwaveAlpha})`;
                vfxCtx.stroke();
                vfxCtx.restore();
            }

            // 섬광(화이트아웃) 효과
            let flashAlpha = 1 - ((progress - 0.75) / 0.25);
            vfxCtx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`; 
            vfxCtx.fillRect(0, 0, W, H);
            
            vfxCtx.globalCompositeOperation = 'lighter';
            vfxCtx.fillStyle = `rgba(${r},${g},${b}, ${flashAlpha * 0.5})`; 
            vfxCtx.fillRect(0, 0, W, H);
            vfxCtx.globalCompositeOperation = 'source-over';
        }

        vfxAnimationId = requestAnimationFrame(animate);
    }
    vfxAnimationId = requestAnimationFrame(animate);
}

// 💡 [수정] 아포칼립스 연출 (버그 픽스: 소리/진동 복구 + 무한반복 해결)
export function triggerApocalypseVFX(vfxCtx, W, H, aura, callbacks, onComplete) {
    // 1. 기존 애니메이션 즉시 살해 (중복 방지 최우선)
    if (vfxAnimationId) cancelAnimationFrame(vfxAnimationId);
    
    // 2. 초기 사운드 (떨어지는 소리)
    if(callbacks && callbacks.playSound) {
        callbacks.playSound("meteor_fall"); 
        callbacks.playSound("magic_circle"); 
    }

    let startTime = performance.now();
    let duration = 12000; // 12초 고정

    // 마찰음 예약
    let frictionTimer = setTimeout(() => { 
        if(callbacks && callbacks.playSound) callbacks.playSound("meteor_friction"); 
    }, 3500);

    let quote = getAuraQuote(aura.name);
    let [r, g, b] = hexToRgb(aura.color);

    // 좌표 설정
    let startX = W * 0.8; let startY = -H * 0.2;
    let endX = W * 0.5;    let endY = H * 0.95;
    let mainAngle = Math.atan2(endY - startY, endX - startX);
    let pathLength = Math.sqrt(Math.pow(endX-startX, 2) + Math.pow(endY-startY, 2));

    // 서브 유성우
    let subMeteors = Array.from({length: 15}, () => ({
        offsetPerp: (Math.random() - 0.5) * W * 0.8, 
        offsetPara: (Math.random() - 0.5) * pathLength * 0.3, 
        speedMulti: Math.random() * 0.4 + 0.8,
        size: Math.random() * 15 + 8
    }));

    let trailParticles = [];
    let shockwaveRadius = 0;
    let impactTimeRatio = 0.45; // 45% 시점 충돌

    // ★ [핵심 수정] 상태 관리 플래그 (이게 있어야 중복/누락 방지됨)
    let impactHandled = false; 
    let typingStarted = false;
    let typeStartTime = 0;
    let typeDelay = 100; 
    let probabilityText = `1 IN ${aura.chanceX.toLocaleString()}`;

    // 운석 그리기 헬퍼 함수
    function drawRockMeteor(ctx, x, y, angle, size, isMain) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        
        // 꼬리
        let tailLen = size * (isMain ? 15 : 10);
        for(let i=0; i<3; i++) {
            let tLen = tailLen * (1 - i*0.2);
            let tWidth = size * (1.5 - i*0.3);
            let tailGrad = ctx.createLinearGradient(0, 0, -tLen, 0);
            tailGrad.addColorStop(0, isMain ? '#ffffff' : aura.color);
            tailGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = tailGrad;
            ctx.beginPath();
            ctx.moveTo(size*0.5, 0);
            ctx.lineTo(-tLen, -tWidth);
            ctx.lineTo(-tLen*0.8, 0); 
            ctx.lineTo(-tLen, tWidth);
            ctx.fill();
        }
        
        // 본체
        ctx.fillStyle = isMain ? "#ffffff" : aura.color;
        ctx.shadowBlur = size * 3; ctx.shadowColor = aura.color;
        ctx.beginPath();
        let points = 7;
        for(let i=0; i<points; i++) {
            let rad = size * (0.8 + Math.random() * 0.4);
            let a = (Math.PI * 2 / points) * i;
            if(i===0) ctx.moveTo(Math.cos(a)*rad, Math.sin(a)*rad);
            else ctx.lineTo(Math.cos(a)*rad, Math.sin(a)*rad);
        }
        ctx.closePath(); ctx.fill();
        ctx.restore();
    }

    function animate(time) {
        let elapsed = time - startTime;
        let progress = elapsed / duration;

        // [종료 조건] 100% 도달 시 깔끔하게 종료
        if (progress >= 1.0) {
            vfxCtx.clearRect(0, 0, W, H);
            clearTimeout(frictionTimer);
            cancelAnimationFrame(vfxAnimationId); // 루프 끊기
            
            if(onComplete) onComplete(); // UI 복구
            return; // 함수 탈출
        }

        vfxCtx.clearRect(0, 0, W, H);

        // ============================================
        // PHASE 1: 낙하 (0% ~ 45%)
        // ============================================
        if (progress < impactTimeRatio) {
            vfxCtx.save();
            let cameraY = lerp(0, H*0.4, progress/impactTimeRatio);
            vfxCtx.translate(0, cameraY - H*0.4);
            
            // 배경
            let spaceAlpha = (cameraY / (H*0.4));
            if (spaceAlpha > 0.01) {
                vfxCtx.fillStyle = `rgba(3, 1, 8, ${spaceAlpha})`; 
                vfxCtx.fillRect(0, 0, W, H + H*0.5);
            }

            // 마법진
            vfxCtx.save();
            vfxCtx.translate(startX, startY);
            let magicProg = progress / impactTimeRatio;
            let magicScale = 1.0 + magicProg * 1.5;
            vfxCtx.scale(magicScale, magicScale);
            // drawMagicCircle이 vfx.js 상단에 export되어 있어야 함
            drawMagicCircle(vfxCtx, 0, 0, 300, progress * 4, aura.color, (1-magicProg));
            vfxCtx.restore();

            // 명언
            if (progress > 0.1 && progress < impactTimeRatio - 0.05) {
                let quoteProg = (progress - 0.1) / (impactTimeRatio - 0.15);
                let textAlpha = quoteProg < 0.2 ? quoteProg/0.2 : (quoteProg > 0.8 ? (1-quoteProg)/0.2 : 1);
                vfxCtx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
                vfxCtx.font = "italic 700 2.8rem 'Cinzel', sans-serif";
                vfxCtx.textAlign = "center";
                vfxCtx.shadowBlur = 40; vfxCtx.shadowColor = aura.color;
                vfxCtx.fillText(quote, W/2, H * 0.75 + H*0.4 - cameraY); 
                vfxCtx.shadowBlur = 0;
            }

            // 운석들
            vfxCtx.globalCompositeOperation = 'lighter';
            let fallProgress = (progress - 0.1) / (impactTimeRatio - 0.1);
            if (fallProgress > 0) {
                fallProgress = Math.pow(fallProgress, 3);
                let mX = lerp(startX, endX, fallProgress);
                let mY = lerp(startY, endY, fallProgress);
                
                // 메인 운석
                drawRockMeteor(vfxCtx, mX, mY, mainAngle, 60 + fallProgress * 50, true);
                
                // 파티클
                for(let k=0; k<5; k++) {
                    trailParticles.push({
                        x: mX + (Math.random()-0.5)*100, y: mY + (Math.random()-0.5)*100, 
                        vx: (Math.random()-0.5)*50, vy: (Math.random()-0.5)*50,
                        life: 1.0, color: aura.color, size: Math.random()*10+5
                    });
                }
            }

            // 서브 유성우
            let meteorProg = Math.max(0, (progress - 0.05) / (impactTimeRatio - 0.1));
            subMeteors.forEach(sub => {
                let currentDist = (pathLength * meteorProg * sub.speedMulti) + sub.offsetPara;
                if (currentDist > -100 && currentDist < pathLength * 1.1) {
                    let mx = startX + Math.cos(mainAngle) * currentDist;
                    let my = startY + Math.sin(mainAngle) * currentDist;
                    let finalX = mx + Math.cos(mainAngle - Math.PI/2) * sub.offsetPerp;
                    let finalY = my + Math.sin(mainAngle - Math.PI/2) * sub.offsetPerp;
                    drawRockMeteor(vfxCtx, finalX, finalY, mainAngle, sub.size, false);
                }
            });

            // 잔해 렌더링
            for(let i=trailParticles.length-1; i>=0; i--) {
                let p = trailParticles[i]; p.x+=p.vx; p.y+=p.vy; p.life-=0.03;
                if(p.life<=0) { trailParticles.splice(i,1); continue; }
                vfxCtx.fillStyle = p.color; vfxCtx.globalAlpha = p.life;
                vfxCtx.beginPath(); vfxCtx.arc(p.x, p.y, p.size, 0, Math.PI*2); vfxCtx.fill();
            }
            vfxCtx.restore();
        } 
        
        // ============================================
        // PHASE 2: 충돌 및 화이트아웃 (45% ~ 100%)
        // ============================================
        else {
            // ★ [버그 해결] 충돌 처리를 플래그로 관리 (절대 씹히지 않음)
            if (!impactHandled) { 
                if(callbacks) {
                    if(callbacks.playSound) { 
                        callbacks.playSound("meteor_impact"); 
                        callbacks.playSound("flashbang_ring"); // 삐이잉 소리
                    }
                    if(callbacks.shake) callbacks.shake(150); // 강한 진동
                }
                impactHandled = true; // 중복 실행 방지
            }

            shockwaveRadius += 40;
            
            // 화이트아웃 계산
            let fadeOutStart = 0.85; 
            let whiteOpacity = 1.0;
            if (progress < impactTimeRatio + 0.02) whiteOpacity = (progress - impactTimeRatio) / 0.02; 
            else if (progress > fadeOutStart) whiteOpacity = 1 - ((progress - fadeOutStart) / (1 - fadeOutStart));

            if (whiteOpacity > 0) {
                vfxCtx.fillStyle = `rgba(255, 255, 255, ${whiteOpacity})`;
                vfxCtx.fillRect(0, 0, W, H);
            }
            
            // 링 이펙트
            if(shockwaveRadius < W * 1.5) {
                vfxCtx.save(); vfxCtx.globalCompositeOperation = 'lighter'; vfxCtx.beginPath();
                vfxCtx.arc(W/2, H, shockwaveRadius, 0, Math.PI*2);
                vfxCtx.lineWidth = 50 * (1 - shockwaveRadius/(W*1.5)); 
                vfxCtx.strokeStyle = `rgba(${r},${g},${b}, 0.5)`; vfxCtx.stroke();
                vfxCtx.restore();
            }

            // [여기서부터 수정하세요] 타이핑 연출 부분
            let textEndRatio = fadeOutStart - 0.05;
            if (progress < textEndRatio) {
                if (!typingStarted) { typingStarted = true; typeStartTime = time + 500; }
                if (time > typeStartTime) {
                    let charsToShow = Math.floor((time - typeStartTime) / typeDelay);
                    let typeIndex = Math.min(charsToShow, aura.name.length);
                    let currentTypedText = aura.name.substring(0, typeIndex);
                    
                    vfxCtx.save();
                    vfxCtx.font = "400 8rem 'Great Vibes', cursive"; 
                    
                    // ▼▼▼▼▼ [수정된 부분] ▼▼▼▼▼
                    // 기존: vfxCtx.fillStyle = `black`; 
                    
                    // ★ 오라 색상 적용 및 빛나는 효과 추가
                    vfxCtx.fillStyle = aura.color;       // 글자색을 오라색으로
                    vfxCtx.shadowColor = aura.color;     // 그림자(광원) 색도 오라색으로
                    vfxCtx.shadowBlur = 40;              // 은은하게 빛나도록 블러 설정
                    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

                    vfxCtx.textAlign = "center"; vfxCtx.textBaseline = "middle";
                    vfxCtx.fillText(currentTypedText, W/2, H/2 - 40);
                    
                    if (typeIndex === aura.name.length) {
                        vfxCtx.font = "700 1.8rem 'Rajdhani', sans-serif";
                        // 확률 텍스트도 같은 색과 광원을 공유하게 됩니다.
                        vfxCtx.fillText(probabilityText, W/2, H/2 + 60);
                    }
                    vfxCtx.restore();
                }
            }
        }
        
        vfxAnimationId = requestAnimationFrame(animate);
    }
    
    // 애니메이션 시작
    vfxAnimationId = requestAnimationFrame(animate);
}

export function drawProjectile(ctx, p, finalAlpha) {
    let size = p.size || 30; 
    let color = p.color || "#FFF";
    
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle || 0);
    ctx.globalAlpha = finalAlpha;

    // -----------------------------------------------------------
    // [티어별 렌더링 로직 (기존 코드 유지)]
    // -----------------------------------------------------------
    
    // [티어 1] 💫 스타 더스트
    if (p.type === 1) {
        // 간소화 모드가 아닐 때만 그라데이션 사용
        if (!GRAPHICS.simpleAuras) {
            let grad = ctx.createLinearGradient(0, 0, -size * 4, 0);
            grad.addColorStop(0, color); grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = color; // 단색
        }
        
        ctx.beginPath();
        ctx.moveTo(size, 0); ctx.lineTo(-size * 4, -size * 0.3); ctx.lineTo(-size * 4, size * 0.3);
        ctx.fill();
        
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2); ctx.fill();
    }

    // [티어 2] ⚔️ 문라이트 슬래시
    else if (p.type === 2) {
        // 간소화 아닐 때만 잔상 그리기
        if (!GRAPHICS.simpleAuras) {
            let trailGrad = ctx.createLinearGradient(-size * 1.5, 0, size, 0);
            trailGrad.addColorStop(0, "transparent"); trailGrad.addColorStop(1, color);
            ctx.fillStyle = trailGrad;
            ctx.globalAlpha = finalAlpha * 0.4;
            ctx.beginPath();
            ctx.moveTo(-size * 1.5, size * 0.2);
            ctx.quadraticCurveTo(0, -size * 1.8, size, 0);
            ctx.quadraticCurveTo(0, size * 1.8, -size * 1.5, -size * 0.2);
            ctx.fill();
            // 다시 알파값 복구
            ctx.globalAlpha = finalAlpha;
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = finalAlpha * 0.8;
        ctx.beginPath();
        ctx.moveTo(-size, size * 0.5);
        ctx.bezierCurveTo(-size * 0.5, -size * 1.2, size * 0.5, -size * 1.2, size, 0);
        ctx.bezierCurveTo(size * 0.5, -size * 0.6, -size * 0.5, -size * 0.6, -size, size * 0.5);
        ctx.fill();

        // 코어 (흰색)
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = finalAlpha * 1.0;
        ctx.beginPath();
        ctx.moveTo(-size * 0.6, size * 0.2);
        ctx.bezierCurveTo(-size * 0.2, -size * 0.9, size * 0.2, -size * 0.9, size * 0.7, -size * 0.1);
        ctx.bezierCurveTo(size * 0.2, -size * 0.7, -size * 0.2, -size * 0.7, -size * 0.6, size * 0.2);
        ctx.fill();
    }

    // [티어 3] ⚡ 하이퍼 레이저 (지지직거리는 연출 추가)
    else if (p.type === 3) { 
        let len = p.length || 1500; 
        
        // 수명에 따라 굵기가 진동함 (파지직 효과)
        let jitter = Math.random() * 10;
        let w = (p.width || 90) * p.life + jitter; 

        // 1. 외곽 글로우 (레이저 색)
        if (!GRAPHICS.simpleProjectiles) {
            ctx.globalAlpha = finalAlpha * 0.3; 
            ctx.fillStyle = color;
            ctx.fillRect(0, -w/1.2, len, w * 1.6);
        }

        // 2. 메인 빔 (조금 더 진함)
        ctx.globalAlpha = finalAlpha * 0.6; 
        ctx.fillStyle = color;
        ctx.fillRect(0, -w/2, len, w);
        
        // 3. 코어 (흰색, 파지직거리며 얇아짐)
        let coreW = (w / 3) + Math.sin(globalRenderTime * 2) * 5;
        ctx.globalAlpha = finalAlpha * 1.0; 
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, -coreW/2, len, coreW);
    }

    // [티어 4] 🗡️ 발키리의 성검
    else if (p.type === 4) {
        ctx.fillStyle = color; ctx.globalAlpha = finalAlpha * 0.5;
        ctx.beginPath(); ctx.moveTo(size*2, 0); ctx.lineTo(-size*0.5, -size*0.5); ctx.lineTo(-size*0.5, size*0.5); ctx.fill();
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-size, 0); ctx.lineTo(size*2.5, 0); ctx.stroke(); 
        ctx.beginPath(); ctx.moveTo(size*0.5, -size); ctx.lineTo(size*0.5, size); ctx.stroke(); 
        
        ctx.fillStyle = "#fff"; ctx.beginPath();
        ctx.moveTo(size*1.8, 0); ctx.lineTo(0, -size*0.2); ctx.lineTo(0, size*0.2); ctx.fill();
    }

    // [티어 5] 🌀 아케인 차크람
    else if (p.type === 5) {
        ctx.save();
        // 간소화 모드면 회전도 멈추게 할 수 있지만, 회전은 유지하는 게 보기 좋음
        ctx.rotate(angle + globalRenderTime * 0.15); 
        
        let outerRad = size * 1.4; 
        let innerRad = size * 0.7; 

        // 날개
        ctx.globalAlpha = finalAlpha * 0.9;
        ctx.lineWidth = 6; ctx.strokeStyle = color;
        for(let j=0; j<4; j++) {
            ctx.beginPath();
            let startAngle = (Math.PI * 2 / 4) * j + 0.3; 
            let endAngle = (Math.PI * 2 / 4) * (j+1) - 0.3;
            ctx.arc(0, 0, outerRad, startAngle, endAngle); ctx.stroke();
            
            ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = "#fff";
            ctx.beginPath(); ctx.arc(0, 0, outerRad + 4, startAngle -0.1, endAngle + 0.1); ctx.stroke();
            ctx.restore();
        }

        // 내부 링
        ctx.beginPath(); ctx.arc(0, 0, innerRad, 0, TWO_PI);
        ctx.lineWidth = 8; ctx.strokeStyle = color; ctx.stroke();
        ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke();

        // 십자 & 코어
        ctx.lineWidth = 3; ctx.strokeStyle = "#ffffffaa";
        ctx.beginPath(); ctx.moveTo(-innerRad, 0); ctx.lineTo(innerRad, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -innerRad); ctx.lineTo(0, innerRad); ctx.stroke();

        ctx.beginPath(); ctx.arc(0,0, size*0.4, 0, TWO_PI);
        ctx.fillStyle = "#fff"; ctx.fill();

        ctx.restore();
    }

    // [티어 6] 🌌 차원 절단 (공간을 찢고 검은 균열이 남는 연출)
    else if (p.type === 6) { 
        let len = p.length || 3000; 
        // 수명이 줄어들수록 균열이 얇아짐
        let w = (p.width || 550) * Math.min(1, p.life * 1.5); 
        
        if (!GRAPHICS.simpleProjectiles) {
            // 공간 왜곡 (반전 효과)
            ctx.globalCompositeOperation = 'difference'; 
            ctx.fillStyle = "#fff"; 
            ctx.fillRect(0, -w/2, len, w);
            
            // 주변 전기 스파크
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = color; 
            ctx.lineWidth = 4;
            ctx.beginPath();
            // 랜덤 스파크 3줄
            for(let k=0; k<3; k++) {
                let yOff = (Math.random()-0.5) * w;
                ctx.moveTo(0, yOff);
                ctx.lineTo(len, yOff + (Math.random()-0.5)*100);
            }
            ctx.stroke();
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = "#eee"; ctx.fillRect(0, -w/2, len, w);
        }
        
        // 중심부 블랙홀 균열 (가장 늦게 사라짐)
        let coreW = w * 0.2 * Math.max(0, p.life);
        ctx.fillStyle = "#000"; 
        ctx.fillRect(0, -coreW/2, len, coreW);
    }

    ctx.restore();
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    spawnExplosion(x, y, color, count, maxSpeed) {
        // [최적화] 화면 전체 파티클이 이미 많으면(400개 이상) 생성을 아예 막음
        if (this.particles.length > 400) return;
        
        // [최적화] 옵션에 따른 수량 대폭 조절
        let finalCount = count;
        if (GRAPHICS.simpleProjectiles) {
            finalCount = Math.ceil(count / 5); // 간소화 시 1/5로 축소
        }

        for (let i = 0; i < finalCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * maxSpeed;
            this.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1, // 사이즈도 줄여서 렌더링 부하 감소
                color: color,
                life: 1.0,
                decay: Math.random() * 0.05 + 0.03 // 더 빨리 사라지게 함
            });
        }
    }

    // 2. 반딧불이 생성 함수 (최적화 적용)
    spawnFirefly(x, y, color) {
        // ★ [핵심] 반딧불이 옵션이 꺼져있으면 생성 중단 (return)
        if (typeof GRAPHICS !== 'undefined' && !GRAPHICS.showFireflies) return;

        // 간소화 모드일 때도 끄고 싶다면 아래 주석 해제 (선택 사항)
        // if (typeof GRAPHICS !== 'undefined' && GRAPHICS.simpleAttacks) return;

        // 너무 많으면 생성 중단 (개수 제한)
        if (this.particles.length > 800) return;

        this.particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1 - 0.5,
            size: Math.random() * 3 + 1,
            color: color,
            life: 1.0,
            decay: Math.random() * 0.005 + 0.002,
            floatPhase: Math.random() * Math.PI * 2
        });
    }

    // 3. 업데이트 및 그리기 (Swap-and-Pop 적용)
    updateAndDraw(ctx) {
        const isSimple = (typeof GRAPHICS !== 'undefined' && GRAPHICS.simpleProjectiles);
        const TWO_PI = Math.PI * 2; // 매번 계산하지 않게 상수 사용

        // ★ 뒤에서부터 도는 건 그대로 유지
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.floatPhase !== undefined) {
                p.vx += Math.sin(globalRenderTime * 0.05 + p.floatPhase) * 0.05;
            }

            // [최적화] 수명 다한 파티클 제거 로직 변경 (Swap and Pop)
            if (p.life <= 0) {
                // 현재 자리에 '배열의 맨 마지막 녀석'을 덮어씌움
                this.particles[i] = this.particles[this.particles.length - 1];
                // 맨 마지막 칸을 삭제함 (이건 연산 비용 0에 가까움)
                this.particles.pop();
                continue;
            }

            // (그리기 코드는 그대로 유지...)
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;

            if (!isSimple) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
            } else {
                ctx.shadowBlur = 0; 
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, TWO_PI); // 상수 사용
            ctx.fill();
            ctx.restore();
        }
    }
}