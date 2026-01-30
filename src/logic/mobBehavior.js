// ★ 파일이 진짜 로드됐는지 확인하는 로그 (콘솔에 이게 안 뜨면 파일 적용 안 된 거임)
console.log("✅ [mobBehavior.js] V2.0 로드됨 (제동 장치 장착 완료)");

import { calculateGroundY } from './geography.js';
const VIRTUAL_H = 1080;

const getGroundY = (x) => calculateGroundY(x, VIRTUAL_H, 1.0);

// ========================================================
// 1. [두뇌] AI 업데이트
// ========================================================
export function updateMobAI(mob, player, realH) {
    if (player.isDead) return;
    // ★ 핵심: 플레이어의 물리 y값에 해상도 오프셋을 더해 '진짜 시각적 위치'를 구함

    // 초기화
    if (!mob.state) mob.state = "idle";
    if (!mob.timer) mob.timer = 0;
    if (!mob.debugText) mob.debugText = "";

    // 스폰 후 1초간 안정화 (바로 돌진하는거 방지)
    if (!mob.spawnTimer) mob.spawnTimer = 0;
    if (mob.spawnTimer < 60) {
        mob.spawnTimer++;
        mob.vx = 0;
        mob.debugText = "SPAWNING...";
        return;
    }

    switch (mob.typeData.aiType) {
        case "ground_charge": aiGroundCharge(mob, player, realH); break; // realH 전달
        case "flying_ram":    aiFlyingRam(mob, player, realH); break;    // realH 전달
        default:              aiWander(mob); break; 
    }
}

// [AI 1] 지상 돌진형 (도마뱀)
function aiGroundCharge(mob, player) {
    const dist = Math.abs(player.x - mob.x);
    
    // ★ [감지 범위] 
    // 여기가 0이면 절대 반응 안해야 정상입니다. 테스트 후 600으로 복구하세요.
    const detectRange = 600; 

    // 디버그 텍스트 (머리 위에 뜸)
    mob.debugText = `${mob.state} (${Math.round(dist)})`;

    // 1. [배회] IDLE
    if (mob.state === "idle") {
        if (Math.random() < 0.02) mob.targetVx = (Math.random() - 0.5) * 2;
        
        // 발견 조건: 거리 가깝고 + 땅에 있고 + y축 차이 적음
        if (dist < detectRange && mob.isGrounded && Math.abs(player.y - mob.y) < 150) {
            mob.state = "prep";
            mob.timer = 60; // 0.6초간 경고
            mob.targetVx = 0;
            mob.vx = 0; 
            
            // 방향 저장
            mob.chargeDir = (player.x > mob.x) ? 1 : -1;
        }
    } 
    // 2. [준비] PREP
    else if (mob.state === "prep") {
        mob.timer--;
        mob.vx = 0; // 강제 정지
        mob.x += (Math.random() - 0.5) * 5; // 떨림

        if (mob.timer <= 0) {
            mob.state = "charge";
            mob.timer = 60; // 최대 돌진 시간 (1초)
            
            // ★ 여기서 방향 결정 (저장된 방향으로)
            const dir = mob.chargeDir || ((player.x > mob.x) ? 1 : -1);
            mob.vx = dir * mob.typeData.speed * 2.5; 
            mob.vy = -8; 
        }
    }
    // 3. [돌진] CHARGE
    else if (mob.state === "charge") {
        mob.timer--;

        // ★ [핵심] 플레이어를 지나쳤는지 확인 (지나쳤으면 바로 브레이크)
        let passed = false;
        if (mob.vx > 0 && player.x < mob.x) passed = true; // 오른쪽으로 가는데 플레이어가 왼쪽에 있음
        if (mob.vx < 0 && player.x > mob.x) passed = true; // 왼쪽으로 가는데 플레이어가 오른쪽에 있음

        if (passed || mob.timer <= 0) {
            mob.state = "braking"; // 즉시 브레이크
        }
    }
    // 4. [급제동] BRAKING
    else if (mob.state === "braking") {
        // 물리 엔진에서 마찰력 0.6 적용됨 -> 순식간에 멈춤
        if (Math.abs(mob.vx) < 0.5) {
            mob.vx = 0;
            mob.state = "cooldown";
            mob.timer = 90; // 1.5초 쿨타임
        }
    }
    // 5. [쿨타임] COOLDOWN
    else if (mob.state === "cooldown") {
        mob.vx = 0;
        mob.timer--;
        if (mob.timer <= 0) mob.state = "idle";
    }
}

// [AI 2] 공중 추적형
function aiFlyingRam(mob, player, realH) {
    const groundOffset = realH - 1080;
    const targetY = (player.y + groundOffset) - 50; // 보정된 Y축 기준 가슴팍

    const dist = Math.hypot(player.x - mob.x, targetY - mob.y);
    const detectRange = 800; 
    
    mob.debugText = `FLY (${Math.round(dist)})`;

    if (dist < detectRange) {
        const dx = player.x - mob.x;
        const dy = targetY - mob.y; // 보정된 targetY 사용
        const angle = Math.atan2(dy, dx);
        const accel = 0.4;
        
        mob.vx += Math.cos(angle) * accel;
        mob.vy += Math.sin(angle) * accel;

        const maxSpd = mob.typeData.speed * 2;
        const currSpd = Math.hypot(mob.vx, mob.vy);
        if (currSpd > maxSpd) {
            mob.vx = (mob.vx / currSpd) * maxSpd;
            mob.vy = (mob.vy / currSpd) * maxSpd;
        }
    } else {
        mob.vx *= 0.95;
        mob.vy += Math.sin(Date.now() * 0.005) * 0.05;
    }
}

function aiWander(mob) {
    if (Math.random() < 0.01) {
        mob.targetVx = (Math.random() - 0.5) * mob.typeData.speed;
    }
    if (mob.isGrounded && Math.random() < 0.005) mob.vy = -8;
}

// ========================================================
// 2. [몸] 물리 엔진
// ========================================================
export function applyMobMovement(mob, dt, realH) {
    const mType = mob.typeData.moveType || "walk";
    
    // AI 속도 적용 (돌진/브레이크 아닐 때만)
    if (mob.state !== "charge" && mob.state !== "braking" && mob.state !== "prep" && mob.state !== "cooldown") {
        if (mob.targetVx !== undefined) {
            mob.vx += (mob.targetVx - mob.vx) * 0.1;
        }
    }

    if (mType === "hop") {
        if (mob.isGrounded && Math.abs(mob.vx) > 0.5) { mob.vy = -4; mob.isGrounded = false; }
        if (!mob.isGrounded) mob.vx *= 0.99;
    } 
    else if (mType === "glitch") {
        if (Math.random() < 0.05) { mob.x += (Math.random() - 0.5) * 100; mob.y += (Math.random() - 0.5) * 100; }
    }

    if (mob.typeData.aiType !== "flying_ram" && mType !== "float" && mType !== "glitch") {
        mob.vy += 0.5; // Gravity
        const groundY = calculateGroundY(mob.x, realH, 1.0);
        
        if (mob.y >= groundY) {
            mob.y = groundY;
            mob.vy = 0;
            mob.isGrounded = true;
            
            // ★ 상태별 마찰력
            if (mob.state === "charge") {
                mob.vx *= 0.97; 
            } 
            else if (mob.state === "braking") {
                mob.vx *= 0.9; // ★ 강력 브레이크
            }
            else if (mob.state === "prep" || mob.state === "cooldown") {
                mob.vx = 0; 
            }
            else {
                if (mType === "hop") mob.vx *= 0.85; else mob.vx *= 0.92;
            }
        } else {
            mob.isGrounded = false;
        }
    } else {
        mob.vx *= 0.98;
        mob.vy *= 0.98;
        const gY = getGroundY(mob.x);
        if (mob.y > gY - 50) mob.vy -= 0.5; 
    }

    mob.x += mob.vx;
    mob.y += mob.vy;

    if (mob.x < 100) { mob.x = 100; mob.vx *= -1; }
    if (mob.x > 324900) { mob.x = 324900; mob.vx *= -1; }
}