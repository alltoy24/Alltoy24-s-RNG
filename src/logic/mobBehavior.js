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
        case "stationary_turret": aiStationaryTurret(mob, player); break;
        case "teleport_ambush":   aiTeleportAmbush(mob, player); break;
        case "flee_shooter":      aiFleeShooter(mob, player); break;
        case "slime_jump":        aiSlimeJump(mob, player); break;
        default:              aiWander(mob); break; 
    }
}

function aiSlimeJump(mob, player) {
    const dist = Math.abs(player.x - mob.x);
    const detectRange = 600; 

    if (!mob.state) mob.state = "idle";
    mob.debugText = `SLIME: ${mob.state}`;

    // 1. [대기] IDLE
    if (mob.state === "idle") {
        if (mob.isGrounded) mob.vx *= 0.8; // 땅에선 정지

        if (dist < detectRange) {
            mob.state = "prepare";
            mob.timer = 60; // 준비 시간 1초 (너무 길면 답답하니 약간 줄임)
            mob.vx = 0;
        } else {
            // 대기 중 콩콩 (빈도 줄임)
            if (mob.isGrounded && Math.random() < 0.001) {
                mob.vy = -3; 
                mob.y -= 2;
                mob.isGrounded = false;
            }
        }
    }
    // 2. [기모으기] PREPARE
    else if (mob.state === "prepare") {
        mob.timer--;
        mob.vx = 0; 
        mob.facingRight = (player.x > mob.x);
        mob.animTime += 0.1; // 부들부들 애니메이션

        if (mob.timer <= 0) {
            const dir = (player.x > mob.x) ? 1 : -1;
            
            // ★ [수정 1] 점프 높이 대폭 하향 (-13 -> -9)
            // 3분의 2 수준으로 낮춰서 안정적인 포물선을 그리게 함
            let jumpPowerY = -9; 
            
            // ★ [수정 2] 가로 범위 축소 (배율 6.0 -> 3.5)
            // 너무 멀리 날아가지 않게 조절
            let jumpPowerX = mob.typeData.speed * 3.5; 
            
            // 거리가 멀면 조금 더 힘줌 (최대치도 9.0 -> 5.5로 제한)
            if (dist > 300) jumpPowerX = mob.typeData.speed * 5.5;

            // 너무 가까우면 약하게
            if (dist < 100) {
                jumpPowerX *= 0.5;
                jumpPowerY = -7;
            }

            mob.vy = jumpPowerY;
            mob.vx = dir * jumpPowerX;
            
            mob.y -= 5; // 땅 떼기
            mob.isGrounded = false; 
            
            mob.state = "air"; 
        }
    }
    // 3. [공중] AIR
    else if (mob.state === "air") {
        if (mob.isGrounded) {
            mob.state = "land";
            // ★ [수정 3] 착지 후 휴식 시간 추가 (30 -> 90 프레임)
            // 점프 후 1.5초 동안은 멍하니 있습니다.
            mob.timer = 90; 
            mob.vx = 0;
        }
    }
    // 4. [착지/휴식] LAND
    else if (mob.state === "land") {
        mob.timer--;
        mob.vx *= 0.8; // 미끄러짐 방지
        
        // 휴식 시간이 끝나야 다시 대기(idle) -> 준비(prepare)로 넘어감
        if (mob.timer <= 0) {
            mob.state = "idle";
        }
    }
}

function aiGroundCharge(mob, player) {
    const dist = Math.abs(player.x - mob.x);
    const detectRange = 600; 

    mob.debugText = `${mob.state} (${Math.round(dist)})`;

    // 1. [배회] IDLE
    if (mob.state === "idle") {
        if (Math.random() < 0.02) {
            mob.targetVx = (Math.random() - 0.5) * 2;
            // ★ 이동 방향에 따라 바라보는 방향 설정
            if (Math.abs(mob.targetVx) > 0.1) mob.facingRight = mob.targetVx > 0;
        }
        
        if (dist < detectRange && mob.isGrounded && Math.abs(player.y - mob.y) < 150) {
            mob.state = "prep";
            mob.timer = 60;
            mob.targetVx = 0;
            mob.vx = 0; 
            
            // ★ 플레이어 위치에 따라 바라보는 방향 설정
            mob.facingRight = (player.x > mob.x);
            mob.chargeDir = mob.facingRight ? 1 : -1;
        }
    } 
    // 2. [준비] PREP
    else if (mob.state === "prep") {
        mob.timer--;
        mob.vx = 0; 
        mob.x += (Math.random() - 0.5) * 5; 
        // ★ 준비 중에도 플레이어 쪽을 계속 바라봄
        mob.facingRight = (player.x > mob.x);

        if (mob.timer <= 0) {
            mob.state = "charge";
            mob.timer = 60;
            const dir = mob.chargeDir || ((player.x > mob.x) ? 1 : -1);
            mob.vx = dir * mob.typeData.speed * 2.5; 
            mob.vy = -8; 
            mob.facingRight = dir > 0; // ★ 돌진 방향 고정
        }
    }
    // 3. [돌진] CHARGE
    else if (mob.state === "charge") {
        mob.timer--;
        mob.facingRight = mob.vx > 0; // ★ 돌진 중 방향 유지

        let passed = false;
        if (mob.vx > 0 && player.x < mob.x) passed = true; 
        if (mob.vx < 0 && player.x > mob.x) passed = true; 

        if (passed || mob.timer <= 0) mob.state = "braking";
    }
    // 4. [급제동] BRAKING
    else if (mob.state === "braking") {
        if (Math.abs(mob.vx) < 0.5) {
            mob.vx = 0;
            mob.state = "cooldown";
            mob.timer = 90; 
        }
    }
    // 5. [쿨타임] COOLDOWN
    else if (mob.state === "cooldown") {
        mob.vx = 0;
        mob.timer--;
        // ★ 쉴 때도 플레이어를 째려봄
        mob.facingRight = (player.x > mob.x);
        if (mob.timer <= 0) mob.state = "idle";
    }
}

// [AI 2] 공중 추적형
function aiFlyingRam(mob, player, realH) {
    const groundOffset = realH - 1080;
    const targetY = player.y - 50;

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
// [AI 3] 고정형 포탑 (stationary_turret)
// - 제자리에서 플레이어를 조준하고 투사체를 발사함
// ========================================================
function aiStationaryTurret(mob, player) {
    const dist = Math.abs(player.x - mob.x);
    const range = 800; // 사거리

    // 상태 초기화
    if (!mob.state) mob.state = "scan"; 
    
    mob.vx = 0; // 움직이지 않음
    mob.debugText = `TURRET: ${mob.state}`;

    if (mob.state === "scan") {
        // 사거리 안에 들어오면 조준 시작
        if (dist < range) {
            mob.state = "aim";
            mob.timer = 60; // 1초간 조준 (텔레그래프)
        }
    } 
    else if (mob.state === "aim") {
        mob.timer--;
        // 플레이어 방향 바라보기
        mob.facingRight = (player.x > mob.x);
        
        // 발사 직전 떨림 효과
        if (mob.timer < 20) mob.x += (Math.random() - 0.5) * 2;

        if (mob.timer <= 0) {
            // ★ 발사 로직 (여기서는 가상의 발사 함수 호출)
            // 실제 구현 시 projectiles 배열에 bullet을 추가해야 함
            // fireEnemyProjectile(mob, player); 
            console.log("Bang!"); // 임시 확인용
            
            mob.state = "cooldown";
            mob.timer = 90; // 1.5초 쿨타임
        }
    }
    else if (mob.state === "cooldown") {
        mob.timer--;
        if (mob.timer <= 0) mob.state = "scan";
    }
}

// ========================================================
// [AI 4] 순간이동 기습 (teleport_ambush)
// - 플레이어를 쫓다가 사라진 뒤 등 뒤에서 나타남 (유령/암살자 타입)
// ========================================================
function aiTeleportAmbush(mob, player) {
    const dist = Math.abs(player.x - mob.x);
    const range = 500;

    mob.debugText = `GHOST: ${mob.state}`;

    if (mob.state === "idle" || mob.state === "chase") {
        // 플레이어 추적 (둥둥 떠다님)
        const dir = (player.x > mob.x) ? 1 : -1;
        mob.vx += (dir * mob.typeData.speed - mob.vx) * 0.05;
        mob.vy = Math.sin(Date.now() * 0.005) * 1; // 부유

        // 공격 범위 진입 시 텔레포트 준비
        if (dist < 200) {
            mob.state = "vanish";
            mob.timer = 40; // 0.6초 뒤 사라짐
            mob.vx = 0;
        }
    }
    else if (mob.state === "vanish") {
        mob.timer--;
        mob.opacity = mob.timer / 40; // 점점 투명해짐 (렌더러에서 처리 필요)
        
        if (mob.timer <= 0) {
            // ★ 순간이동: 플레이어 등 뒤 150px 지점
            const backDir = player.facingRight ? -1 : 1; 
            mob.x = player.x + (backDir * 150);
            mob.y = player.y - 50; // 약간 공중
            
            mob.state = "appear";
            mob.timer = 30; // 0.5초간 등장 딜레이
            mob.opacity = 0;
        }
    }
    else if (mob.state === "appear") {
        mob.timer--;
        mob.opacity = 1.0 - (mob.timer / 30); // 점점 나타남
        
        if (mob.timer <= 0) {
            mob.state = "attack";
            mob.timer = 20; // 공격 지속 시간
            // 플레이어 쪽으로 급발진
            const dir = (player.x > mob.x) ? 1 : -1;
            mob.vx = dir * 15; 
        }
    }
    else if (mob.state === "attack") {
        mob.timer--;
        if (mob.timer <= 0) {
            mob.state = "cooldown";
            mob.timer = 120; // 2초간 멍때림
            mob.vx *= 0.1;
        }
    }
    else if (mob.state === "cooldown") {
        mob.timer--;
        if (mob.timer <= 0) mob.state = "chase";
    }
}

// ========================================================
// [AI 5] 도망치며 사격 (flee_shooter)
// - 플레이어가 다가오면 거리를 벌리고, 멀면 공격함 (원거리 몹)
// ========================================================
function aiFleeShooter(mob, player) {
    const dist = Math.abs(player.x - mob.x);
    const safeDist = 450; // 안전 거리 (이보다 가까우면 도망 시작)
    const stopDist = 700; // 도망 멈추는 거리 (이만큼 멀어져야 안심)

    mob.debugText = `KITE: ${mob.state}`;

    // 1. 도망 상태 진입 조건
    // (이미 도망 중이거나 공격 중이 아닐 때 + 플레이어가 너무 가까울 때)
    if (mob.state !== "flee" && mob.state !== "shoot" && mob.state !== "reload" && dist < safeDist) {
        mob.state = "flee";
        mob.timer = 120; // ★ 2초간 강제 도주 (무조건 도망감)
    }

    // 2. 상태별 행동 로직
    if (mob.state === "flee") {
        mob.timer--;
        
        // 플레이어 반대 방향으로 전력 질주
        const fleeDir = (player.x > mob.x) ? -1 : 1;
        mob.targetVx = fleeDir * mob.typeData.speed * 1.8; // 평소보다 1.8배 빠름
        
        // 도망칠 땐 플레이어를 안 쳐다봄 (등 돌리고 뜀)
        mob.facingRight = (fleeDir > 0);

        // ★ 도주 중 점프 로직 강화 (장애물/언덕 극복)
        if (mob.isGrounded) {
            // 20% 확률로 점프 (꽤 자주 뜀)
            if (Math.random() < 0.2) {
                mob.vy = -12; // 높게 점프
            }
        }

        // 도주 종료 조건: 시간이 다 됐거나, 너무 멀리 도망갔을 때
        if (mob.timer <= 0 || dist > stopDist) {
            mob.state = "cooldown"; // 바로 쏘지 않고 잠깐 숨 고르기
            mob.timer = 30; // 0.5초 대기
            mob.targetVx = 0; // 정지
        }
    }
    else if (mob.state === "cooldown") {
        mob.timer--;
        mob.vx *= 0.9; // 미끄러지듯 정지
        if (mob.timer <= 0) {
            // 거리가 충분하면 사격 준비, 아니면 다시 도망
            if (dist < safeDist) mob.state = "flee"; // 아직도 가까우면 다시 도망
            else mob.state = "shoot"; // 멀면 반격
            mob.timer = 40; // 조준 시간
        }
    }
    else if (mob.state === "shoot") {
        mob.timer--;
        mob.targetVx = 0; // 사격 중엔 정지
        mob.facingRight = (player.x > mob.x); // 플레이어 조준

        if (mob.timer <= 0) {
            console.log("Pew!"); // 투사체 발사 (나중에 구현)
            // fireEnemyProjectile(mob, player); 
            
            mob.state = "reload";
            mob.timer = 90; // 1.5초 재장전
        }
    }
    else if (mob.state === "reload") {
        mob.timer--;
        // 재장전 중에는 살금살금 거리 조절 (눈치 보기)
        if (dist < safeDist * 0.8) {
             mob.targetVx = (player.x > mob.x ? -1 : 1) * mob.typeData.speed * 0.5;
        } else {
             mob.targetVx = 0;
        }

        if (mob.timer <= 0) mob.state = "idle";
    }
    else {
        // IDLE / WANDER (평화 상태)
        // 플레이어가 감지 범위(safeDist * 1.5) 밖이면 그냥 배회
        if (dist > safeDist * 1.5) {
            aiWander(mob);
        } else {
            // 감지 범위 안이면 눈치 보기 시작
            mob.targetVx = 0;
            mob.facingRight = (player.x > mob.x);
        }
    }
}

export function applyMobMovement(mob, dt, realH) {
    const mType = mob.typeData.moveType || "walk";
    
    // AI 속도 적용 (슬라임 제외)
    if (mob.typeData.aiType !== "slime_jump" && mob.state !== "charge" && mob.state !== "braking" && mob.state !== "prep") {
        if (mob.targetVx !== undefined) {
            mob.vx += (mob.targetVx - mob.vx) * 0.1;
        }
    }

    // 중력 적용
    if (mob.typeData.aiType !== "flying_ram" && mType !== "float") {
        mob.vy += 0.6; // ★ 중력을 살짝 낮춰서(0.8 -> 0.6) 더 멀리 날아가게 함
        
        const groundY = calculateGroundY(mob.x, realH, 1.0);
        
        if (mob.y >= groundY) {
            mob.y = groundY;
            mob.vy = 0;
            mob.isGrounded = true;
            
            // 땅 마찰력
            if (mob.state === "charge") mob.vx *= 0.97;
            else if (mob.state === "braking") mob.vx *= 0.9;
            else if (mob.state === "prepare" || mob.state === "land") mob.vx = 0;
            else if (mob.typeData.aiType === "slime_jump" && mob.state === "air") {
                mob.vx *= 0.8; // 착지 순간 감속
            }
            else {
                mob.vx *= 0.92; 
            }

        } else {
            mob.isGrounded = false;
            
            // ★ [핵심] 슬라임은 공중 저항을 거의 받지 않음 (관성 유지)
            if (mob.typeData.aiType === "slime_jump") {
                mob.vx *= 0.998; // 저항 거의 0 -> 멀리 날아감
            } else {
                mob.vx *= 0.98; 
            }
        }
    } else {
        // 비행 몹
        mob.vx *= 0.98;
        mob.vy *= 0.98;
        const gY = calculateGroundY(mob.x, realH, 1.0);
        if (mob.y > gY - 50) mob.vy -= 0.5; 
    }

    mob.x += mob.vx;
    mob.y += mob.vy;

    if (mob.x < 100) { mob.x = 100; mob.vx *= -1; }
    if (mob.x > 324900) { mob.x = 324900; mob.vx *= -1; }
}