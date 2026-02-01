import { allAuras } from './data/auras.js';
import { gearDB, consumableDB, potionRecipes } from './data/items.js';
import { CRITTER_DB } from './data/mobs.js';
import { lerp, hexToRgb, distToSegment, drawStar } from './utils.js';
import { drawPlayer, drawOtherPlayer, drawGhost } from './graphics/playerRenderer.js';
import { GRAPHICS } from './settings.js'; 
import { 
    generateNature, 
    getCurrentSkyColors, 
    getGroundY, 
    renderLand, 
    renderTrees,  
    renderGrass,
    landscapes, trees, grassBlades, stars, clouds, ruins 
} from './graphics/background.js';
import { 
    ParticleSystem, 
    drawProjectile, 
    triggerEpicVFX, 
    triggerMeteorVFX, 
    triggerApocalypseVFX,
    drawMagicCircle 
} from './graphics/vfx.js';
// ★ [수정됨] ui.js에서 필요한 함수들을 '직접' 가져옵니다. (loadGame 에러 해결용)
import { 
    updateProfileUI as renderProfileUI, 
    renderInventory, 
    renderConsumableList, 
    renderAlchemyList, 
    renderCrafting, 
    renderEquipment, 
    renderQuickBar, 
    spawnItemLog, 
    setUIVisibility,
    // ▼ 아래 함수들이 없어서 에러가 났던 겁니다. 꼭 추가하세요!
    updateSkipThreshold,
    updateAutoThresholds,
    updateGraphicSetting
} from './ui.js';
import { 
    playSound, stopSound, bgmPlayer, weatherSfxPlayer, 
    smoothAudioTransition, fadeOutBGM, restoreBGM,
    COMBAT_SFX
} from './audioManager.js';
import { BiomeManager } from './logic/biomeManager.js'; // 1. 클래스 가져오기
import { drawCritter } from './graphics/mobRenderer.js'; // ★ 이거 추가!
import { updateMobAI, applyMobMovement } from './logic/mobBehavior.js';
import { BiomeVFXManager } from './logic/biomeVFX.js';

// 2. 객체 생성 (ReferenceError 해결의 핵심)
const biomeMgr = new BiomeManager();
const biomeVFX = new BiomeVFXManager();

// main.js 상단 전역 변수 수정
let W = window.innerWidth;
let H = window.innerHeight;

// 기준 해상도 (가로 1920을 기준으로 모든 크기를 계산해서 맵핵 방지)
const BASE_W = 1920;
let scaleRatio = 1;
let consumableInv = {};

const WORLD_WIDTH = 325000;

let targetCloudCount = 3; // 기본 구름 개수
let targetCloudColor = { r: 255, g: 255, b: 255, a: 0.8 }; // 기본 흰색

let fragments = 0; 
let inventory = []; 
let ownedGears = []; 
let equippedGears = [null, null, null];
let skipThreshold = 0; 
let autoScrapThreshold = 0; // 추가
let autoStopThreshold = 0;  // 추가
let isFakeOut = false;      // 전역으로 이동
let fakeTargetAura = null;  // 전역으로 이동
let isRolling = false; 
let currentResult = null;
let isAutoRolling = false;
let autoRollTimer = null;
let rewardShards = []; // 빨려 들어오는 조각들을 담을 배열
let iceSpikes = [];

// [신규] 플레이어 위치에 따른 바이옴 반환 함수
function getPlayerBiome(x) {
    if (x < 25000) return "SOUTH_EDGE";
    if (x < 50000) return "FROZEN_MOUNTAIN"; // 눈 지역
    if (x < 75000) return "CORRUPTED";
    if (x < 100000) return "ANCIENT_RUIN";
    if (x < 125000) return "CLIFFS";
    if (x < 175000) return "PLAINS";
    if (x < 200000) return "DESERT"; // 사막
    if (x < 225000) return "BEACH";
    if (x < 250000) return "MAGIC_FOREST";
    if (x < 275000) return "FORGOTTEN_CITY";
    if (x < 300000) return "FAR_LANDS";
    return "NORTH_EDGE";
}

// ★★★ 여기서 canvas를 확실하게 찾아서 변수에 담습니다!
const canvas = document.querySelector("#game-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const vfxCanvas = document.querySelector("#vfx-canvas");
const vfxCtx = vfxCanvas ? vfxCanvas.getContext("2d") : null;

// (혹시 캔버스가 없으면 에러 로그 출력)
if (!canvas || !vfxCanvas) console.error("❌ 캔버스를 찾을 수 없습니다! HTML에 <canvas id='game-canvas'>가 있는지 확인하세요.");

// ★ [수정] 카메라가 플레이어(맵 중앙)를 비추며 시작
let cameraX = (WORLD_WIDTH / 2) - (W / 2);           
let targetCameraX = cameraX; // 타겟도 맞춰서 스르륵 이동 방지

let currentLevel = 1; 
let totalExp = 0; // ★ [신규] 누적 경험치 (돈을 써도 안 줄어듦)

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const TWO_PI = Math.PI * 2;

let gameTimeMinutes = 12 * 60; // 시간 변수 미리 선언
const myChatColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 70%)`; 

// ★ [멀티플레이] 서버 연결 및 데이터 관리
// ==========================================
const socket = io("https://rng-server.onrender.com");
let otherPlayers = {}; // 다른 유저 데이터를 담을 공간

const player = {
    x: 150000, 
    y: H * 0.85, 
    vx: 0, 
    vy: 0,              // 수직 속도 (추가)
    gravity: 0.8,       // 중력의 세기 (추가)
    jumpPower: -13,     // 점프 힘 (음수일수록 높게 점프, 추가)
    isGrounded: true,   // 땅에 닿아있는지 확인 (추가)
    isDashing: false,
    dashTimer: 0,        // 대쉬 지속 시간 (프레임 단위)
    dashCooldown: 0,     // 다음 대쉬까지 남은 시간
    dashSpeed: 35,       // 대쉬 순간 속도
    dashDuration: 4,    // 대쉬가 유지될 프레임 (약 0.2초)
    dashCooldownMax: 60,  // 대쉬 재사용 대기시간 (약 1초)
    dashGhosts: [], // ★ 잔상 위치를 저장할 배열
    
    // 기존 속성들...
    accel: 1.5, friction: 0.82, maxSpeed: 12, 
    width: 24, height: 100,
    facingRight: true, walkFrame: 0,
    scarfSegments: Array.from({ length: 6 }, () => ({ x: WORLD_WIDTH / 2, y: H * 0.85 })),
    hp: 100, maxHp: 100, invincibleTime: 0,
    noDamageTimer: 0, isDead: false, deathTimer: 0
};

// 인벤토리에 특정 오라가 몇 개 있는지 세는 함수
function countAura(name) {
    if (!inventory) return 0;
    return inventory.filter(a => a.name === name).length;
}

// [신규] 오디오 매니저 연결용 콜백 (방금 지운 자리에 붙여넣으세요)
const vfxCallbacks = {
    playSound: (type) => playSound(type), // 문자열 키로 재생
    shake: (amount) => { shakeIntensity = amount; applyScreenShake(); }
};

window.spawnIceSpikes = function(startX, startY, facingRight) {
    playSound('ice_crack'); // 효과음 재생
    shakeIntensity = 15; applyScreenShake(); // 화면 쾅!

    const dir = facingRight ? 1 : -1;
    const count = 15; // 가시 개수 증가
    
    // 가시가 파도처럼 퍼져나감
    for(let i=0; i<count; i++) {
        setTimeout(() => {
            iceSpikes.push({
                x: startX + (dir * (50 + i * 60)), // 간격
                y: startY, 
                life: 50, // 지속시간
                maxLife: 50,
                damage: 25, // 데미지
                width: 40,
                height: 0,
                maxHeight: 120 + Math.random() * 50, // 높이 불규칙
                alpha: 1.0
            });
            // 가시 솟을 때마다 진동
            if(i % 2 === 0) { shakeIntensity = 5; applyScreenShake(); }
        }, i * 80); // 0.08초 간격
    }
};


// 1. 모달 토글 (데이터를 챙겨서 ui.js에게 그림 요청)
function toggleModal(id, show) {
    playSound('click');
    const modal = document.getElementById(id);
    if (!modal) return;

    if (show) {
        modal.classList.add('active');
        // 각 모달에 맞는 데이터 전달하여 렌더링 요청
        if (id === 'inventory-modal') renderInventory(inventory, equippedAuraName);
        else if (id === 'consumable-modal') renderConsumableList(consumableInv);
        else if (id === 'alchemy-modal') renderAlchemyList(consumableInv, inventory, countAura);
        else if (id === 'crafting-modal') renderCrafting(fragments, ownedGears, inventory, countAura);
        else if (id === 'equipment-modal') renderEquipment(equippedGears, ownedGears);
    } else {
        modal.classList.remove('active');
    }
}

// 2. 기타 토글 함수들
function toggleQuickBar() {
    playSound('click');
    const bar = document.getElementById("quick-item-bar");
    const btn = document.getElementById("quick-item-toggle");
    bar.classList.toggle("open");
    btn.classList.toggle("open");
    btn.innerText = bar.classList.contains("open") ? "◀" : "▶";
}

function toggleChat() {
    playSound('click');
    const chat = document.getElementById("chat-container");
    const btn = document.getElementById("chat-toggle-btn");
    chat.classList.toggle("open");
    btn.classList.toggle("open");
    if (chat.classList.contains("open")) {
        btn.classList.remove("has-notification");
        btn.classList.remove("wiggle");
    }
    btn.innerText = chat.classList.contains("open") ? "◀ CLOSE" : "💬 CHAT";
}

function toggleRollBottom() {
    playSound('click');
    const bar = document.getElementById("roll-bottom-bar");
    const btn = document.getElementById("roll-bottom-toggle");
    bar.classList.toggle("open");
    btn.classList.toggle("open");
    btn.innerText = bar.classList.contains("open") ? "▼ CLOSE" : "▲ ROLL";
}

// 3. 행동 함수들 (소비, 제작, 장착, 분해)
function useConsumable(key) {
    if(consumableInv[key] > 0) {
        let item = consumableDB[key];
        let isPotion = item.isPotion ? "potion" : "gather";
        let applied = false;
        let finishTime = Date.now() + (item.duration * 1000);
        let buffData = { val: item.val, endTime: finishTime, name: item.name, color: item.color, desc: item.desc, duration: item.duration };

        if(item.type === "luck" || item.type === "both") {
            let slot = isPotion + "_luck";
            if(activeBuffs[slot] && activeBuffs[slot].endTime > Date.now() && item.type !== "both") { alert(`이미 행운 버프 적용 중!`); return; }
            activeBuffs[slot] = buffData; applied = true;
        }
        if(item.type === "speed" || item.type === "both") {
            let slot = isPotion + "_speed";
            if(activeBuffs[slot] && activeBuffs[slot].endTime > Date.now() && item.type !== "both") { alert(`이미 속도 버프 적용 중!`); return; }
            activeBuffs[slot] = buffData; applied = true;
        }

        if(applied) {
            playSound('equip');
            consumableInv[key]--;
            calcBuffs();
            renderConsumableList(consumableInv);
            renderQuickBar(consumableInv);
        }
    }
}

function craftPotion(resultId) {
    let recipe = potionRecipes.find(r => r.result === resultId);
    if (!recipe) return;
    for (const [rId, rCount] of Object.entries(recipe.reqItems)) consumableInv[rId] -= rCount;
    for (const [rName, rCount] of Object.entries(recipe.reqAuras)) {
        for (let i = 0; i < rCount; i++) {
            let idx = inventory.findIndex(item => item.name === rName);
            if (idx > -1) inventory.splice(idx, 1);
        }
    }
    consumableInv[resultId] = (consumableInv[resultId] || 0) + 1;
    playSound('success');
    updateAllUI();
}

function craftGear(id) {
    let gear = gearDB.find(g => g.id === id);
    if (!gear) return;
    Object.entries(gear.reqAuras).forEach(([rName, rCount]) => {
        for(let i=0; i<rCount; i++) {
            let idx = inventory.findIndex(a => a.name === rName);
            if (idx > -1) inventory.splice(idx, 1);
        }
    });
    fragments -= gear.cost;
    ownedGears.push(id);
    playSound('success');
    updateAllUI();
}

function toggleEquipAura(name) {
    playSound('equip');
    equippedAuraName = (equippedAuraName === name) ? null : name;
    renderInventory(inventory, equippedAuraName);
}

function scrapAura(name, amount) {
    playSound('click');
    amount = parseInt(amount);
    let auraData = allAuras.find(a => a.name === name);
    if (!auraData) return;
    let currentCount = countAura(name);
    if (amount > currentCount) amount = currentCount;
    let fragPerItem = Math.max(1, Math.ceil(auraData.chanceX / 10));
    fragments += (fragPerItem * amount);
    addExp(fragPerItem * amount * 0.2);
    for (let i = inventory.length - 1; i >= 0 && amount > 0; i--) {
        if (inventory[i].name === name) {
            inventory.splice(i, 1);
            amount--;
        }
    }
    document.getElementById("currency-display").textContent = `✨ Stella Fragment: ${fragments.toLocaleString()}`;
    renderInventory(inventory, equippedAuraName);
}

function toggleEquip(id) {
    playSound('equip');
    let idx = equippedGears.indexOf(id);
    if(idx > -1) equippedGears[idx] = null;
    else {
        let empty = equippedGears.indexOf(null);
        if(empty > -1) equippedGears[empty] = id;
        else alert("장착 슬롯이 꽉 찼습니다.");
    }
    renderEquipment(equippedGears, ownedGears);
    calcBuffs();
}

function unequipGear(idx) {
    if(equippedGears[idx] !== null) {
        equippedGears[idx] = null;
        playSound('click');
        calcBuffs();
        renderEquipment(equippedGears, ownedGears);
    }
}

// 이제 main.js 안에서 updateProfileUI()를 인자 없이 불러도 여기서 알아서 처리합니다.
function updateProfileUI() {
    // 1. 레벨 최신화
    if (typeof calcLevel === 'function') currentLevel = calcLevel();
    
    // 2. ui.js의 함수에게 재료(데이터)를 챙겨서 보냄
    renderProfileUI(currentLevel, totalExp, player, myNickname, myChatColor);
}

// 2. [수정] 레벨 계산 및 경험치 공식 (난이도 대폭 상향)
// 공식: 필요 경험치 = 250 * (레벨 - 1)^2
function calcLevel() {
    // 1. 레벨 계산 (공식: 250 * level^2)
    let lv = 1;
    if (totalExp > 0) {
        lv = Math.floor(Math.sqrt(totalExp / 250)) + 1;
    }
    
    // 2. ★ 핵심: 레벨에 따른 최대 체력 업데이트 (여기서 해야 함!)
    // 레벨 1 = 100, 레벨업당 +50
    player.maxHp = 100 + (lv - 1) * 50;
    
    // 현재 체력이 최대 체력보다 크면 보정
    if (player.hp > player.maxHp) player.hp = player.maxHp;

    return lv;
}

// ★ [누락된 함수 추가] 경험치 획득 및 레벨업 처리
function addExp(amount) {
    if (!amount || isNaN(amount)) return;
    
    let oldLv = calcLevel();
    totalExp += amount;
    let newLv = calcLevel();

    // 레벨업 체크
    if (newLv > oldLv) {
        playSound('levelup');
        player.hp = player.maxHp; // 레벨업 시 체력 완전 회복
        
        // 화면 중앙 레벨업 연출
        const overlay = document.getElementById("levelup-overlay");
        const desc = document.getElementById("levelup-desc");
        if (overlay && desc) {
            desc.innerText = `LV.${oldLv} ➤ LV.${newLv}`;
            overlay.style.opacity = 1; 
            overlay.style.transform = "scale(1)";
            setTimeout(() => { 
                overlay.style.opacity = 0; 
                overlay.style.transform = "scale(1.5)"; 
            }, 2500);
        }
        
        // 채팅창 알림
        const sysMsg = document.createElement("div");
        sysMsg.innerHTML = `<span style="color:#FFD700; font-weight:bold;">🎉 LEVEL UP! (LV.${newLv}) - HP 완전 회복!</span>`;
        if (document.getElementById("chat-history")) {
            document.getElementById("chat-history").appendChild(sysMsg);
        }
    }
    updateProfileUI(); // UI 갱신
}

// 1. 처음 접속했을 때 기존 유저 목록 받기
socket.on('currentPlayers', (players) => {
    otherPlayers = players;
    delete otherPlayers[socket.id]; // 내 정보는 제외
});

// 2. 다른 유저가 움직이거나 오라를 바꿨을 때
socket.on('playerMoved', (data) => {
    otherPlayers[data.id] = data; // 정보 갱신
});

// 3. 다른 유저가 나갔을 때
socket.on('playerLeft', (id) => {
    delete otherPlayers[id];
});
socket.on('otherPlayerAttack', (data) => {
    if (!GRAPHICS.showOtherAttacks) return;
    let { chance, color, angle, id, yOffset } = data; // yOffset을 받는다고 가정
    
    let attacker = otherPlayers[id]; 
    let startX, startY;

    if (attacker) {
        startX = attacker.x;
        // 내 화면의 지형 높이에 상대방의 오프셋을 적용하여 발사 위치 보정
        startY = getGroundY(attacker.x) + (attacker.yOffset || 0) - 65; 
    } else {
        startX = data.startX;
        startY = getGroundY(data.startX) + (data.yOffset || 0) - 65;
    }
    // 2. 각도 및 벡터 계산 (ReferenceError 해결)
    let finalAngle = (angle !== undefined) ? angle : 0;
    const spdX = Math.cos(finalAngle);
    const spdY = Math.sin(finalAngle);

    playSound('click'); 

    // [티어 1] 💫 유성탄
    if (chance < 1000) { 
        playSound('attack_1');
        projectiles.push({ type: 1, ownerId: data.id, x: startX, y: startY, vx: spdX * 12, vy: spdY * 12, angle, life: 1.0, color, size: 25, rarity: chance});
    }
    // [티어 2] ⚔️ 쌍검기
    else if (chance < 1000000) { 
        playSound('attack_2'); // 🎵 슉!
        for (let i of [-1, 1]) {
                let offsetX = Math.cos(angle + Math.PI/2) * (i * 15);
                let offsetY = Math.sin(angle + Math.PI/2) * (i * 15);
                projectiles.push({ type: 2, ownerId: data.id, x: startX + offsetX, y: startY + offsetY, vx: spdX * 16, vy: spdY * 16, angle, life: 1.0, color, size: 45, rarity: chance });
        }
    }
    // [티어 3] ⚡ 하이퍼 레이저
    else if (chance < 100000000) { 
        playSound('attack_3'); // 🎵 지이잉!
        projectiles.push({ type: 3, ownerId: data.id, x: startX, y: startY, vx: 0, vy: 0, angle, life: 1.0, color, width: 90, length: 1500, rarity: chance });
        shakeIntensity = 15; applyScreenShake();
    }
    // [티어 4] 🗡️ 성검 강림 (부채꼴 확산 5연발)
    else if (chance < 1000000000) { 
        // 기존 for문이나 playSound 다 지우고 이걸로 교체!
        for(let i=0; i<5; i++) {
            setTimeout(() => {
                // ★ 등 뒤에 있던 검 5개가 하나씩 날아가는 사운드!
                let soundClone = COMBAT_SFX.attack_4.cloneNode();
                soundClone.volume = 0.6;
                soundClone.play().catch(()=>{});

                let spread = (i - 2) * 0.12; 
                let sAngle = angle + spread;
                // 투사체 발사
                projectiles.push({ type: 4, ownerId: data.id, x: startX, y: startY, vx: Math.cos(sAngle) * 28, vy: Math.sin(sAngle) * 28, angle: sAngle, life: 1.5, color, size: 90, rarity: chance });
            }, i * 60); // 0.06초 간격으로 다다다닥!
        }
        shakeIntensity = 20; applyScreenShake();
    }
    // [티어 5] 🌀 아케인 차크람
    else if (chance < 2400000000) { 
        playSound('attack_5'); // 🎵 촤라락!
        projectiles.push({ 
            type: 5, ownerId: data.id, x: startX, y: startY, vx: spdX * 12, vy: spdY * 12, 
            angle, life: 4.5, color, size: 140, rarity: chance, hitMobiles: [] 
        });
        shakeIntensity = 35; applyScreenShake();
    }
    // [티어 6] 🌌 차원 절단
    else { 
        playSound('attack_6'); // 🎵 콰아앙!
        projectiles.push({ type: 6, ownerId: data.id, x: startX, y: startY, vx: 0, vy: 0, angle, life: 1.2, color: "#fff", width: 550, length: 3000, rarity: chance });
        shakeIntensity = 70; applyScreenShake();
    }
});


// ★ [월드 동기화] 1. 시간 동기화 (해/달 위치, 하늘색 자동 변화)
socket.on('timeSync', (serverTimeMinutes) => {
    // 서버 시간과 내 화면 시간의 오차가 크면 바로 맞춤 (부드러운 해의 움직임을 위해)
    gameTimeMinutes = serverTimeMinutes;
});

function applyNewWeather(newWeather) {
    currentWeather = newWeather;

    // 1. 캔버스 요소 가져오기
    const gameCanvas = document.getElementById("game-canvas");
    const vfxCanvas = document.getElementById("vfx-canvas");

    // ========================================================
    // ★ [수정됨] 여기가 핵심입니다! 클래스를 넣었다 뺐다 해야 함
    // ========================================================
    if (currentWeather.id === "heatwave") {
        // 폭염이면 클래스 추가 (필터 적용 ON)
        if (gameCanvas) gameCanvas.classList.add("heatwave-active");
        if (vfxCanvas) vfxCanvas.classList.add("heatwave-active");

        showSideNotification("⚠️ EXTREME HEAT", "지표면 온도가 상승합니다.", "#FF5722");
    } else {
        // 아니면 클래스 제거 (필터 적용 OFF)
        if (gameCanvas) gameCanvas.classList.remove("heatwave-active");
        if (vfxCanvas) vfxCanvas.classList.remove("heatwave-active");

        // (기존 알림 로직)
        if (currentWeather.id === "glitch") {
            showSideNotification("WEATHER ANOMALY", "<span class='glitch-text'>V̵O̵I̵D̵</span>", "#ff003c");
        } else {
            showSideNotification("WEATHER CHANGED", currentWeather.name, "#FFD700");
        }
    }

    // 2. 구름/배경 설정 (기존 코드 유지)
    switch (currentWeather.id) {
        case "clear":
            targetCloudCount = 3; targetCloudColor = { r: 255, g: 255, b: 255, a: 0.1 }; break;
        case "cloudy":
            targetCloudCount = 12; targetCloudColor = { r: 220, g: 220, b: 220, a: 0.3 }; break;
        case "rain":
            targetCloudCount = 24; targetCloudColor = { r: 150, g: 150, b: 145, a: 0.4 }; break;
        case "thunder":
            targetCloudCount = 24; targetCloudColor = { r: 80, g: 80, b: 90, a: 0.5 }; break;
        case "snow":
            targetCloudCount = 16; targetCloudColor = { r: 240, g: 240, b: 255, a: 0.3 }; break;
        case "foggy":
            targetCloudCount = 10; targetCloudColor = { r: 200, g: 200, b: 200, a: 0.2 }; break;
        case "glitch":
            targetCloudCount = 5; targetCloudColor = { r: 50, g: 0, b: 50, a: 0.25 }; break;
        case "heatwave":
            targetCloudCount = 0; targetCloudColor = { r: 255, g: 200, b: 150, a: 0.1 }; break; // 폭염은 구름 거의 없음
        default:
            targetCloudCount = 6; targetCloudColor = { r: 255, g: 255, b: 255, a: 0.2 }; break;
    }

    // 3. UI 텍스트 갱신
    const topWeatherDisplay = document.getElementById("weather-display");
    if (topWeatherDisplay) {
        if (currentWeather.id === "glitch") topWeatherDisplay.innerHTML = `<span class="glitch-text">V̵O̵I̵D̵</span>`;
        else topWeatherDisplay.innerText = currentWeather.name;
    }

    // 4. 오디오 전환
    smoothAudioTransition(currentWeather.music, currentWeather.sfx);
    if (currentWeather.sfx) {
        weatherSfxPlayer.src = currentWeather.sfx;
        weatherSfxPlayer.play().catch(e => {});
    } else {
        weatherSfxPlayer.pause();
        weatherSfxPlayer.currentTime = 0;
    }

    calcBuffs();

    // 5. 파티클 개수 설정
    targetFog = (currentWeather.id === "foggy") ? 1.0 : 0.0;
    targetSnow = (currentWeather.id === "snow") ? 1.0 : 0.0;

    const pCounts = { 
        "thunder": 1500, "rain": 800, "snow": 600, 
        "wind": 100, "foggy": 15, "glitch": 1000, 
        "heatwave": 0 // 폭염은 파티클 없이 왜곡 효과만 사용 (깔끔하게)
    };
    let baseCount = pCounts[currentWeather.id] || 0;
    let density = (typeof GRAPHICS !== 'undefined') ? GRAPHICS.weatherDensity : 1.0;
    targetParticleCount = baseCount * density;
}

// ★ [월드 동기화] 2. 날씨 동기화 (비, 눈, 브금 자동 변화)
socket.on('weatherChanged', (newWeatherId) => {
    // 이미 같은 날씨면 무시
    if (currentWeather.id === newWeatherId) return;

    // 서버가 준 ID에 맞는 날씨 데이터 찾기
    let nextWeather = weathers.find(w => w.id === newWeatherId);
    if (nextWeather) {
        // 기존의 날씨 변경 로직 실행 (매개변수 넘기기)
        applyNewWeather(nextWeather); 
    }
});

// ==========================================
// ★ [멀티플레이] 채팅 시스템 (랜덤 닉네임 + 송수신)
// ==========================================
const chatHistory = document.getElementById("chat-history");
const chatInput = document.getElementById("chat-input");

// [수정] 사망 페널티 및 10초 대기 적용 takeDamage
function takeDamage(amount) {
    // 이미 죽었거나 무적이면 무시
    if (player.invincibleTime > 0 || player.isDead) return;

    player.hp -= amount;
    player.invincibleTime = 60; 
    player.noDamageTimer = 0; 
    
    playSound('hit_normal'); 
    shakeIntensity = 15; applyScreenShake(); 
    
    spawnDamageText(player.x - cameraX, player.y - currentParallaxY*50 - 80, `-${Math.round(amount)}`, true, "#FF416C");

    // ★ 사망 처리 로직
    if (player.hp <= 0) {
        player.hp = 0;
        player.isDead = true; // 죽음 상태 플래그
        player.deathTimer = 10.0; // 10초 카운트다운

        // 1. 경험치 페널티 (10% 소실)
        let lostExp = Math.floor(totalExp * 0.1);
        totalExp = Math.max(0, totalExp - lostExp);

        // 2. 재화 페널티 (20% 소실)
        let lostFrags = Math.floor(fragments * 0.2);
        fragments = Math.max(0, fragments - lostFrags);

        // UI 갱신
        updateProfileUI();
        document.getElementById("currency-display").textContent = `✨ Stella Fragment: ${fragments.toLocaleString()}`;

        // 사망 화면 표시
        const dOverlay = document.getElementById("death-overlay");
        const dTimer = document.getElementById("respawn-timer");
        const dMsg = document.getElementById("death-penalty-msg");

        dOverlay.style.display = "flex";
        dTimer.innerText = "10.0";
        dMsg.innerHTML = `
            <p style="color: #FF5252;">경험치 소실: -${lostExp.toLocaleString()} XP</p>
            <p style="color: #FFD700;">별의 파편 소실: -${lostFrags.toLocaleString()}✨</p>
        `;
        
        // 사이드바 알림도 띄움
        showSideNotification("FATAL ERROR", "생체 신호 소실...", "#FF0000");
    }
    updateProfileUI(); 
}

/************************************************************************
 * DATA 영역 (여기에 기존의 거대한 데이터들을 그대로 붙여넣어 주세요!)
 ************************************************************************/
// 💡 [복구] 4개의 독립된 버프 슬롯 (채집_행운, 채집_속도, 물약_행운, 물약_속도)
let activeBuffs = {
    gather_luck: null, gather_speed: null,
    potion_luck: null, potion_speed: null
};
let globalLuckMultiplier = 1.0; let globalSpeedMultiplier = 1.0;
let hours = 12, minutes = 0;

// ★ [기믹 1] 콤보 및 피버 타임 시스템 변수
let comboCount = 0;
let comboTimeLeft = 0; // 프레임 단위 (예: 300 = 5초)
let isFeverTime = false;
let feverTimeLeft = 0; 
// ★ [신규] 장착 중인 오라 이름을 저장할 변수
let equippedAuraName = null;

// ★ [신규] 공격 시스템 변수
let projectiles = []; // 발사체 저장 배열
let lastAttackTime = 0; // 쿨타임 계산용

let targetParallaxX = 0, targetParallaxY = 0; let currentParallaxX = 0, currentParallaxY = 0; 
let windTime = 0, globalRenderTime = 0;
// ★ [신규] 델타 타임 관련 변수
let lastFrameTime = performance.now(); // 마지막 프레임 시간
let dt = 0;         // 델타 타임 (초 단위)
let dtFactor = 1;   // 60FPS 기준 보정 배율 (1.0 = 60FPS)
let networkTimer = 0; // 서버 전송 타이머 (프레임 독립적)

// ★ [기믹 2] 별똥별 시스템 변수
let shootingStars = [];

let lightningBolts = [];

let targetFog = 0, currentFog = 0;              
let targetSnow = 0, currentSnow = 0;            
let targetParticleCount = 0, currentParticleCount = 0; 
let oldWeatherId = "clear";    

// [최적화 1] DOM 요소 캐싱 (변수 미리 선언)
const DOM = {
    time: document.getElementById("time-display"),
    comboBar: document.getElementById("combo-bar"),
    comboDisplay: document.getElementById("combo-display"),
    fogOverlay: document.getElementById("fog-overlay"),
    body: document.body
};

// ★ [신규] 데미지 폰트 시스템
let damageLabels = []; // 데미지 숫자들 저장소

// 1. [핵심] 전역 변수 최우선 선언 (에러 방지)
let myNickname = null; 
let myUserId = localStorage.getItem('ultimate_rng_user_id');

// ID가 없으면 새로 생성
if (!myUserId) {
    myUserId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('ultimate_rng_user_id', myUserId);
}

// 2. 닉네임 변경/입력 함수 "먼저" 정의 (호출보다 위에 있어야 함)
window.openNicknameEdit = function(isForced = false) {
    playSound('click');
    const modal = document.getElementById("nickname-modal");
    const input = document.getElementById("nickname-input");
    
    input.value = myNickname || ""; 
    modal.classList.add("active");
    
    // 강제 입력 모드일 때 (처음 접속 시)
    if (isForced) {
        // 닫기 버튼 숨기기 같은 로직이 필요하다면 여기에 추가
    }
    
    setTimeout(() => input.focus(), 100); // 포커스 딜레이
};

window.confirmNickname = function() {
    const input = document.getElementById("nickname-input");
    const newName = input.value.trim();

    if (newName.length < 1) {
        alert("이름을 한 글자 이상 입력해주세요!");
        return;
    }

    playSound('success');
    myNickname = newName;
    localStorage.setItem('ultimate_rng_nickname', myNickname);
    
    // UI 갱신
    updateProfileUI(); 
    
    // 모달 닫기
    document.getElementById("nickname-modal").classList.remove("active");
    
    // 채팅창에 알림
    const sysMsg = document.createElement("div");
    sysMsg.innerHTML = `<span style="color:#81C784;">[SYSTEM] 신분 증명서가 갱신되었습니다: <b>${myNickname}</b></span>`;
    if(document.getElementById("chat-history")) {
        document.getElementById("chat-history").appendChild(sysMsg);
    }

    // (선택) 소켓이 이미 연결되어 있다면 닉네임 변경 알리기
    // socket.emit('updateNickname', myNickname); 
};

// 3. 저장된 닉네임 불러오기 및 초기화 로직
let savedNick = localStorage.getItem('ultimate_rng_nickname');
    
if (!savedNick || savedNick === "null") {
    // 저장된 게 없으면 -> 변수는 null로 두고, 입력창 띄우기
    myNickname = null;
    // 페이지 로딩 후 안전하게 띄우기 위해 setTimeout 사용
    setTimeout(() => { openNicknameEdit(true); }, 500);
} else {
    // 저장된 게 있으면 -> 변수에 할당하고 UI 갱신
    myNickname = savedNick;
    // updateProfileUI 함수가 아직 정의 안 됐을 수 있으므로 안전장치
    if (typeof updateProfileUI === 'function') updateProfileUI();
}

// 4. 서버에 입장 정보 전송 (이제 myNickname 변수가 확실히 존재함)
// 닉네임이 없으면 일단 "Unknown"으로 접속하고 나중에 갱신
socket.emit('joinGame', {
    userId: myUserId,
    nickname: myNickname || "Unknown",
    aura: equippedAuraName || "COMMON"
});

// 5. 중복 접속 방지
socket.on('kickDuplicate', () => {
    alert("⚠️ 다른 탭에서 이미 게임이 실행 중입니다! (중복 접속 방지)");
    window.location.href = "about:blank"; 
});

// [수정] 데미지 텍스트 생성 (숫자/문자열 모두 호환되도록 수정됨)
function spawnDamageText(x, y, value, isCrit, customColor) {
    let textToShow = value;
    
    // 만약 입력값이 숫자라면 소수점 1자리로 포맷팅
    if (typeof value === 'number') {
        textToShow = value.toFixed(1);
    }
    
    damageLabels.push({
        x: x, 
        y: y - 20, 
        text: textToShow, // 변환된 텍스트 사용
        life: 1.5, 
        vy: -2, 
        scale: isCrit ? 1.5 : 1.0,
        isCrit: isCrit, 
        customColor: customColor // 색상 지정 지원
    });
}

// ==========================================
// ★ [최종 기믹] 날씨별 몬스터 (Critters) DB
// ==========================================
let critters = []; // 화면에 돌아다니는 몹 배열

//몬스터.. 여기서 잠들다

// ==========================================
// ★ [설정] 몹 스폰 거리 (원하는 대로 수정하세요!)
// ==========================================
// 플레이어 기준 최대 몇 픽셀까지 멀리서 태어날지 (기본 2000)
const CRITTER_MAX_SPAWN_DIST = 2000; 
// 플레이어 기준 최소 몇 픽셀 떨어져서 태어날지 (기본 1200: 너무 가까이서 안 생기게)
const CRITTER_MIN_SPAWN_DIST = 1200;

// 4. 서버에 입장 정보 전송 (아이디 + 닉네임 + 현재 오라)
socket.emit('joinGame', {
    userId: myUserId,
    nickname: myNickname,
    aura: equippedAuraName || "COMMON"
});

// 5. 중복 접속(새 탭) 시 현재 페이지 쫓아내기
socket.on('kickDuplicate', () => {
    alert("⚠️ 다른 탭에서 이미 게임이 실행 중입니다! (중복 접속 방지)");
    window.location.href = "about:blank"; 
});
// [수정] 채팅 전송 함수
function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // [변경] nickname 대신 sender라는 이름으로 보냅니다.
    socket.emit('sendMessage', { 
        sender: myNickname, // nickname -> sender
        text: text, 
        color: myChatColor 
    });
    chatInput.value = ""; 
}

chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });
document.getElementById('chat-send-btn').addEventListener('click', sendChatMessage);

// [수정] 서버에서 온 채팅 받기
socket.on('receiveMessage', (data) => {
    const msgDiv = document.createElement("div");
    
    // 데이터 검증: sender가 없으면 '익명의 유저'로 표시
    const displayName = data.sender || "익명의 유저";
    const displayColor = data.color || "#FFF";

    msgDiv.innerHTML = `<b style="color:${displayColor};">[${displayName}]</b> ${data.text}`;
    chatHistory.appendChild(msgDiv);

    // ★ [여기 추가] 채팅창이 닫혀있으면 알림 띄우기!
    const chatContainer = document.getElementById("chat-container");
    const btn = document.getElementById("chat-toggle-btn");

    if (!chatContainer.classList.contains("open")) {
        // 1. 빨간 점 켜기
        btn.classList.add("has-notification");
        
        // 2. 씰룩 애니메이션 (재생을 위해 클래스 뺐다 다시 넣기 트릭)
        btn.classList.remove("wiggle");
        void btn.offsetWidth; // 강제 리플로우 (애니메이션 리셋용)
        btn.classList.add("wiggle");
        
        // 3. 띵~ 소리 (선택사항, 클릭음 재활용)
        playSound('chat_ping');
    }
    
    // 자동 스크롤 및 개수 제한
    if (chatHistory.children.length > 50) chatHistory.removeChild(chatHistory.firstChild);
    chatHistory.scrollTop = chatHistory.scrollHeight; 
});

socket.on('systemMessage', (data) => {
    playSound('success'); 
    const msgDiv = document.createElement("div");
    msgDiv.style.background = "rgba(0, 0, 0, 0.4)";
    msgDiv.style.borderLeft = `4px solid ${data.color}`;
    msgDiv.style.padding = "8px";
    msgDiv.style.marginTop = "5px";
    msgDiv.style.borderRadius = "4px";
    msgDiv.style.animation = "modalFadeIn 0.3s forwards";

    msgDiv.innerHTML = `🌟 <b style="color:#FFF;">${data.nickname}</b>님이 ` +
                    `<span style="color:${data.color}; text-shadow:${data.glow}; font-family:'Cinzel', serif; font-size:1.1em; font-weight:bold;">[ ${data.auraName} ]</span>` +
                    ` <span style="color:#aaa; font-size:0.8em;">(1 / ${data.chanceX.toLocaleString()})</span> 을(를) 획득했습니다! 🎉`;
    
    chatHistory.appendChild(msgDiv);
    if (chatHistory.children.length > 50) chatHistory.removeChild(chatHistory.firstChild);
    chatHistory.scrollTop = chatHistory.scrollHeight; 
});

// 시작할 때 시스템 안내 메시지
window.addEventListener('load', () => {
    setTimeout(() => {
        const sysMsg = document.createElement("div");
        sysMsg.innerHTML = `<span style="color:#FFD700;">[SYSTEM] 당신의 닉네임은 '${myNickname}' 입니다. 서버에 연결되었습니다!</span>`;
        chatHistory.appendChild(sysMsg);
    }, 500);
});

function saveGame() { 
    try { 
        const data = { 
            fragments, 
            inventory, 
            totalExp, // ★ 추가
            ownedGears, 
            equippedGears, 
            consumableInv, 
            equippedAuraName, 
            graphicsSettings: GRAPHICS, 
            // ▼ 여기가 오타 났던 부분 수정됨
            skipThreshold: document.getElementById("skip-slider").value, 
            autoScrapVal: document.getElementById("auto-scrap-slider").value, 
            autoStopVal: document.getElementById("auto-stop-slider").value 
        }; 
        localStorage.setItem('ultimate_rng_save_v5', JSON.stringify(data)); 
        updateAllUI(); 
    } catch(e) { } 
}

// 1. 스킵 설정 래퍼
function handleUpdateSkip(val) {
    // ui.js 함수 호출 후 결과값 받기
    let calculatedValue = updateSkipThreshold(val);
    // 내 변수에 저장
    skipThreshold = calculatedValue;
}

// main.js
function handleUpdateAuto() {
    let results = updateAutoThresholds(); // ui.js에서 {scrap, stop} 받아옴
    if (results) {
        autoScrapThreshold = results.scrap;
        autoStopThreshold = results.stop;
        console.log("⚙️ 설정 변경 - 분해:", autoScrapThreshold, "정지:", autoStopThreshold);
    }
}

// 3. 전역 연결 (HTML 슬라이더가 이 함수들을 부르게 됨)
window.updateSkipThreshold = handleUpdateSkip;
window.updateAutoThresholds = handleUpdateAuto;

// 닉네임 변경 창 열기 (isForced가 true면 닫기 버튼 없음/배경 클릭 불가)
window.openNicknameEdit = function(isForced = false) {
    playSound('click');
    const modal = document.getElementById("nickname-modal");
    const input = document.getElementById("nickname-input");
    
    input.value = myNickname || ""; // 기존 이름 채워넣기
    modal.classList.add("active");
    
    // 처음 접속이면 강제로 입력해야 함 (X 버튼이나 배경 클릭으로 못 닫게 제어 필요하지만 간단히 생략)
    input.focus();
};

// 닉네임 확정 및 저장
window.confirmNickname = function() {
    const input = document.getElementById("nickname-input");
    const newName = input.value.trim();

    if (newName.length < 1) {
        alert("이름을 한 글자 이상 입력해주세요!");
        return;
    }

    playSound('success');
    myNickname = newName;
    localStorage.setItem('ultimate_rng_nickname', myNickname);
    
    // 서버에 변경된 이름 전송 (다음 이동 패킷부터 적용되지만 즉시 반영 요청)
    // (socket.emit 코드가 있다면 여기서 호출 가능)
    
    updateProfileUI(); // 상단 프로필 카드 갱신
    document.getElementById("nickname-modal").classList.remove("active");
    
    // 시스템 메시지 (채팅창에)
    const sysMsg = document.createElement("div");
    sysMsg.innerHTML = `<span style="color:#81C784;">[SYSTEM] 신분 증명서가 갱신되었습니다: <b>${myNickname}</b></span>`;
    document.getElementById("chat-history").appendChild(sysMsg);
};

// main.js 파일 내부의 loadGame 함수

function loadGame() {
    try {
        const saved = localStorage.getItem('ultimate_rng_save_v5');
        if (saved) {
            const data = JSON.parse(saved);

            // 1. 기본 자원 및 아이템 복구
            fragments = Number(data.fragments) || 0;
            totalExp = Number(data.totalExp) || 0; 
            inventory = data.inventory || [];
            ownedGears = data.ownedGears || [];
            equippedGears = data.equippedGears || [null, null, null];
            consumableInv = data.consumableInv || {};
            
            if (data.equippedAuraName) equippedAuraName = data.equippedAuraName;

            // 2. 슬라이더 설정값 복구 
            // ★ [수정됨] 여기가 핵심입니다!
            if (data.skipThreshold !== undefined) {
                const skipSlider = document.getElementById("skip-slider");
                if (skipSlider) skipSlider.value = data.skipThreshold;
                
                // [변경] 여기서 handleUpdateSkip 래퍼 함수를 부릅니다.
                if (typeof handleUpdateSkip === 'function') {
                    handleUpdateSkip(data.skipThreshold);
                }
            }

            if (data.autoScrapVal !== undefined) {
                const scrapSlider = document.getElementById("auto-scrap-slider");
                if (scrapSlider) scrapSlider.value = data.autoScrapVal;
            }

            if (data.autoStopVal !== undefined) {
                const stopSlider = document.getElementById("auto-stop-slider");
                if (stopSlider) stopSlider.value = data.autoStopVal;
            }
            
            // [변경] 여기서 handleUpdateAuto 래퍼 함수를 부릅니다.
            if (typeof handleUpdateAuto === 'function') {
                handleUpdateAuto();
            }

            if (data.graphicsSettings) {
                Object.assign(GRAPHICS, data.graphicsSettings);
                
                const setCheck = (id, val) => {
                    const el = document.getElementById(id);
                    if(el) el.checked = val;
                };

                // [기존] 풀, 구름, 타인 공격
                setCheck('chk-grass', GRAPHICS.showGrass);
                setCheck('chk-clouds', GRAPHICS.showClouds);
                setCheck('chk-others', GRAPHICS.showOtherAttacks);
                
                // ★ [신규 추가] 나무 렌더링 (데이터 없으면 기본값 true)
                if (GRAPHICS.showTrees === undefined) GRAPHICS.showTrees = true;
                setCheck('chk-trees', GRAPHICS.showTrees);

                // ★ [신규 추가] 바이옴 이펙트, 배경 반짝이, 별 (데이터 없으면 기본값 true)
                if (GRAPHICS.showBiomeVFX === undefined) GRAPHICS.showBiomeVFX = true;
                setCheck('chk-biome-vfx', GRAPHICS.showBiomeVFX);

                if (GRAPHICS.showAmbientParticles === undefined) GRAPHICS.showAmbientParticles = true;
                setCheck('chk-ambient', GRAPHICS.showAmbientParticles);

                if (GRAPHICS.showStars === undefined) GRAPHICS.showStars = true;
                setCheck('chk-stars', GRAPHICS.showStars);
                
                // [기존] 간소화 및 기타 설정
                setCheck('chk-proj', GRAPHICS.simpleProjectiles);
                setCheck('chk-aura', GRAPHICS.simpleAuras);
                setCheck('chk-mob', GRAPHICS.simpleMobs);
                
                setCheck('chk-fireflies', GRAPHICS.showFireflies);
                setCheck('chk-fancy', GRAPHICS.fancyGraphics); 

                // 날씨 밀도 슬라이더 복구
                const weatherSlider = document.querySelector('input[type="range"][oninput*="weatherDensity"]');
                if (weatherSlider) {
                    weatherSlider.value = GRAPHICS.weatherDensity * 10;
                    const label = document.getElementById('weather-val-label');
                    if (label) label.innerText = Math.round(GRAPHICS.weatherDensity * 100) + "%";
                }
            }

            console.log("🎮 세이브 데이터를 성공적으로 불러왔습니다.");
            
            // 4. UI 전체 갱신
            updateAllUI();
        }
    } catch (e) {
        console.error("❌ 데이터를 불러오는 중 오류 발생:", e);
    }
}

function updateAllUI() {
    // 1. 레벨 최신화 (이게 없어서 프로필이 안 바뀌었던 겁니다!)
    currentLevel = calcLevel();

    // 2. 상단 UI 갱신
    const currencyEl = document.getElementById("currency-display");
    if (currencyEl) currencyEl.textContent = `✨ Stella Fragment: ${fragments.toLocaleString()}`;
    
    // ui.js의 함수에 '최신 데이터'를 넘겨줍니다.
    if(typeof renderProfileUI === 'function') {
        renderProfileUI(currentLevel, totalExp, player, myNickname, myChatColor);
    }
    
    if(typeof calcBuffs === 'function') calcBuffs();
    if(typeof renderInventory === 'function') renderInventory(inventory, equippedAuraName);
    if(typeof renderConsumableList === 'function') renderConsumableList(consumableInv);
    
    // 제작/연금술 (countAura 함수 전달)
    if(typeof renderAlchemyList === 'function') renderAlchemyList(consumableInv, inventory, countAura);
    if(typeof renderCrafting === 'function') renderCrafting(fragments, ownedGears, inventory, countAura);
    
    // 장비/퀵바
    if(typeof renderEquipment === 'function') renderEquipment(equippedGears, ownedGears);
    if(typeof renderQuickBar === 'function') renderQuickBar(consumableInv);
}

export function calcBuffs(currentWeather, isFeverTime, feverTimeLeft, equippedGears) { 
    let gearLuck = 0, gearSpeed = 0; 
    
    // 장비 스탯 합산 (equippedGears가 넘어왔을 때만)
    if (equippedGears) {
        equippedGears.forEach(gearId => { 
            if (gearId !== null) { 
                let gear = gearDB.find(g => g.id === gearId); 
                if (gear) { gearLuck += gear.luck; gearSpeed += gear.speed; } 
            } 
        }); 
    }
    
    // 데이터 안전장치 (undefined 방지)
    let weatherLuck = (currentWeather && currentWeather.buff) ? currentWeather.buff.luck : 0;
    let weatherSpeed = (currentWeather && currentWeather.buff) ? currentWeather.buff.speed : 0;
    let feverLuck = isFeverTime ? 1.0 : 0;
    let feverSpeed = isFeverTime ? 1.0 : 0;

    let consumableLuck = 0, consumableSpeed = 0;
    let buffText = ""; 
    let now = Date.now(); 

    let displayedNames = [];

    // 활성화된 버프 루프
    for (let key in activeBuffs) { // activeBuffs는 ui.js 상단에 선언되어 있어야 함
        let buff = activeBuffs[key];
        if (buff) {
            let remaining = (buff.endTime - now) / 1000;

            if (remaining > 0) {
                if (key.includes("luck")) consumableLuck += buff.val;
                if (key.includes("speed")) consumableSpeed += buff.val;
                
                if (!displayedNames.includes(buff.name)) {
                    let effectText = buff.desc.split("간 ")[1] || buff.desc;
                    // ★ 여기가 핵심: 매 프레임 남은 시간을 다시 그립니다.
                    buffText += `<div style="color:${buff.color}; font-weight:700; text-shadow: 0 0 5px ${buff.color}; text-align:right;">
                        ⏳ ${buff.name} (${Math.ceil(remaining)}s)
                    </div>`; 
                    displayedNames.push(buff.name);
                }
            } else {
                activeBuffs[key] = null; // 시간 다 되면 삭제
            }
        }
    }

    if (isFeverTime) {
        buffText += `<div style="color:#FFD700; font-weight:900; animation: glitch 0.5s infinite; text-align:right;">
            🔥 FEVER TIME! (${Math.ceil(feverTimeLeft/60)}s)
        </div>`;
    }

    if (currentWeather && (weatherLuck !== 0 || weatherSpeed !== 0)) {
        let effectColor = (weatherLuck > 0 || weatherSpeed > 0) ? "#81C784" : "#E57373"; 
        let details = [];
        if (weatherLuck !== 0) details.push(`LUCK ${weatherLuck > 0 ? '+' : ''}${Math.round(weatherLuck * 100)}%`);
        if (weatherSpeed !== 0) details.push(`SPD ${weatherSpeed > 0 ? '+' : ''}${Math.round(weatherSpeed * 100)}%`);
        let weatherName = currentWeather.id === "glitch" ? `<span class="glitch-text">${currentWeather.name}</span>` : currentWeather.name;
        
        buffText += `<div style="color:${effectColor}; font-weight:700; text-align:right;">
            🌤️ [${weatherName}] ${details.join(", ")}
        </div>`;
    }

    let totalLuck = 1.0 + gearLuck + consumableLuck + weatherLuck + feverLuck; 
    let totalSpeed = 1.0 + gearSpeed + consumableSpeed + weatherSpeed + feverSpeed; 
    if(totalSpeed < 0.2) totalSpeed = 0.2;

    const buffDisplay = document.getElementById("buff-display");
    if (buffDisplay) {
        buffDisplay.innerHTML = buffText + `
            <div style="margin-top:5px; border-top:1px solid rgba(255,255,255,0.2); padding-top:5px;">
                <span id="buff-luck" style="display:block; color:#FFD700;">🍀 LUCK: x${totalLuck.toFixed(2)}</span>
                <span id="buff-speed" style="display:block; color:#00E5FF;">⚡ SPEED: x${totalSpeed.toFixed(2)}</span>
            </div>`; 
    }

    // ★ 계산된 배율을 main.js로 반환해줍니다.
    return { luck: totalLuck, speed: totalSpeed };
}

// [수정] 창을 열 때(Show=true)만 해당 목록을 새로고침하는 최적화 함수
window.toggleModal = function(id, show) { 
    playSound('click'); 
    const modal = document.getElementById(id); 
    
    if (show) { 
        modal.style.zIndex = 9999; 
        modal.classList.add('active'); 
        
        // ★ 핵심: 창을 열 때만 데이터를 새로 그립니다! (렉 제거의 1등 공신)
        if (id === 'inventory-modal') renderInventory(inventory, equippedAuraName);
        else if (id === 'consumable-modal') renderConsumableList(consumableInv);
        else if (id === 'alchemy-modal') renderAlchemyList(consumableInv, inventory, countAura);
        else if (id === 'crafting-modal') renderCrafting(fragments, ownedGears, inventory, countAura);
        else if (id === 'equipment-modal') renderEquipment();
        
    } else { 
        modal.classList.remove('active'); 
    } 
};

// [수정] 오라 장착/해제 (UI 즉시 갱신)
window.toggleEquipAura = function(name) {
    playSound('equip');
    
    // 토글 로직
    if (equippedAuraName === name) {
        equippedAuraName = null; 
    } else {
        equippedAuraName = name; 
    }
    
    renderInventory(inventory, equippedAuraName); // 인벤토리 버튼 상태 갱신
    // 플레이어 모습도 갱신하려면 필요하지만 render() 루프가 돌고 있어서 생략 가능
};

window.scrapAura = function(name, amount) { 
    playSound('click'); 
    amount = parseInt(amount);
    let auraData = allAuras.find(a => a.name === name);
    if (!auraData) return;

    let currentCount = countAura(name);
    if (amount > currentCount) amount = currentCount;

    let fragPerItem = Math.max(1, Math.ceil(auraData.chanceX / 10));
    fragments += (fragPerItem * amount); 

    // ★ [추가] 분해 경험치 획득 (조각 양의 50%만큼 추가 경험치)
    addExp(fragPerItem * amount * 0.2);

    // 인벤토리에서 제거
    for (let i = inventory.length - 1; i >= 0 && amount > 0; i--) {
        if (inventory[i].name === name) {
            inventory.splice(i, 1);
            amount--;
        }
    }

    // ★ 돈 표시 갱신
    document.getElementById("currency-display").textContent = `✨ Stella Fragment: ${fragments.toLocaleString()}`;
    
    // ★ 중요: 분해는 '인벤토리 창' 안에서 일어나는 일이므로
    // 여기서는 예외적으로 리스트를 다시 그려줘야 버튼 누른 티가 납니다.
    renderInventory(inventory, equippedAuraName); 
};

window.useConsumable = function(key) { 
    if(consumableInv[key] > 0) { 
        let item = consumableDB[key]; 
        let isPotion = item.isPotion ? "potion" : "gather"; 
        let applied = false;

        // ★ 핵심: 현재 시간 + 지속 시간(초) * 1000 = 끝나는 절대 시간
        let finishTime = Date.now() + (item.duration * 1000);
        
        let buffData = { 
            val: item.val, 
            endTime: finishTime, // ★ timeLeft 대신 endTime을 저장합니다.
            name: item.name, 
            color: item.color, 
            desc: item.desc,
            duration: item.duration
        };

        if(item.type === "luck" || item.type === "both") {
            let slot = isPotion + "_luck";
            // 이미 버프가 있고, 아직 안 끝났다면 막기
            if(activeBuffs[slot] && activeBuffs[slot].endTime > Date.now()) { 
                if(item.type !== "both") { alert(`이미 동일한 유형의 행운 버프가 적용 중입니다!`); return; }
            } else {
                activeBuffs[slot] = buffData; applied = true;
            }
        }
        if(item.type === "speed" || item.type === "both") {
            let slot = isPotion + "_speed";
            if(activeBuffs[slot] && activeBuffs[slot].endTime > Date.now()) {
                if(item.type !== "both" || !applied) { alert(`이미 동일한 유형의 속도 버프가 적용 중입니다!`); return; }
            } else {
                activeBuffs[slot] = buffData; applied = true;
            }
        }

        if(applied) {
            playSound('equip'); 
            consumableInv[key]--; 
            
            // ★ 핵심: 저장 대신 화면 갱신 함수들 호출
            calcBuffs(); 
            renderConsumableList(); // 소모품 창 갱신
            renderQuickBar();       // 퀵바 갱신
        }
    } 
};
// 💡 [복구] 퀵 바 열기/닫기 토글
window.toggleQuickBar = function() {
    playSound('click');
    const bar = document.getElementById("quick-item-bar");
    const btn = document.getElementById("quick-item-toggle");
    bar.classList.toggle("open");
    btn.classList.toggle("open");
    btn.innerText = bar.classList.contains("open") ? "◀" : "▶";
};

window.craftPotion = function(resultId) { 
    let recipe = potionRecipes.find(r => r.result === resultId);
    if (!recipe) return;

    // 1. 재료 차감 (아이템)
    for (const [rId, rCount] of Object.entries(recipe.reqItems)) {
        consumableInv[rId] -= rCount;
    }
    // 2. 재료 차감 (오라)
    for (const [rName, rCount] of Object.entries(recipe.reqAuras)) { 
        for (let i = 0; i < rCount; i++) {
            let idx = inventory.findIndex(item => item.name === rName);
            if (idx > -1) inventory.splice(idx, 1);
        }
    } 
    
    // 3. 결과물 지급
    consumableInv[resultId] = (consumableInv[resultId] || 0) + 1; 
    playSound('success'); 
    
    // ★ 핵심: saveGame()을 지우고 UI 갱신 함수를 직접 호출!
    // saveGame(); <--- 삭제 (렉 유발)
    
    updateAllUI(); // 재료가 줄고 결과가 늘어난 것을 화면에 반영
};

// [수정] 장비 제작 함수 (렉 제거 + 즉시 갱신)
window.craftGear = function(id) { 
    let gear = gearDB.find(g => g.id === id); 
    if (!gear) return;

    // 1. 재료 차감 (오라)
    Object.entries(gear.reqAuras).forEach(([rName, rCount]) => { 
        for(let i=0; i<rCount; i++) {
            let idx = inventory.findIndex(a => a.name === rName);
            if (idx > -1) inventory.splice(idx, 1);
        }
    }); 
    
    // 2. 재료 차감 (조각) 및 장비 지급
    fragments -= gear.cost; 
    ownedGears.push(id); 
    playSound('success'); 
    
    // ★ 핵심: saveGame()을 지우고 UI 갱신 함수를 직접 호출!
    // saveGame(); <--- 삭제 (렉 유발)

    updateAllUI(); // 조각 줄어듦 + 버튼 '보유중'으로 변경 반영
};

window.toggleEquip = function(id) { playSound('equip'); let idx = equippedGears.indexOf(id); if(idx > -1) equippedGears[idx] = null; else { let empty = equippedGears.indexOf(null); if(empty > -1) equippedGears[empty] = id; else alert("장착 슬롯이 꽉 찼습니다."); } };
window.unequipGear = function(idx) { if(equippedGears[idx] !== null) { equippedGears[idx] = null; playSound('click'); calcBuffs(); renderEquipment(); } };

const vfxParticles = new ParticleSystem();

// ★ 신규 추가: 머플러 물리 설정값
const scarfConfig = {
    segmentLength: 8, // 마디 사이의 고정 거리 (빳빳함 결정)
    gravity: 0.5,      // 밑으로 처지는 힘
    windForce: 0       // 바람이 부는 정도
};

const keys = { left: false, right: false };

window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.code === 'Space') {
        if (document.activeElement !== chatInput) e.preventDefault(); // 스페이스 기본동작 차단
    }

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    
    // 점프
    if ((e.key === ' ' || e.key === 'w' || e.key === 'W') && player.isGrounded && !player.isDead) {
        if (document.activeElement === chatInput) return;
        player.vy = player.jumpPower;
        player.isGrounded = false;
        document.activeElement.blur(); 
        playSound('click'); 
    }

    // ✅ 대쉬 발동 (Shift 키)
    if (e.key === 'Shift') {
        if (!player.isDead && !player.isDashing && player.dashCooldown <= 0) {
            if (document.activeElement === chatInput) return;
            player.isDashing = true;
            player.dashTimer = player.dashDuration;
            player.dashCooldown = player.dashCooldownMax;
            player.invincibleTime = 20; // 대쉬 중 짧은 무적
            playSound('attack_2');
            shakeIntensity = 8; applyScreenShake();
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
});

// 💡 [그래픽 개선] 환경 입자 배열 생성 (코드 아래줄에 추가)
window.ambientParticles = [];
for(let i=0; i<40; i++) {
    ambientParticles.push({
        x: Math.random() * W, y: Math.random() * H,
        size: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1
    });
}

let weatherParticles = []; 
let snowAccumulation = 0, mountainSnowLevel = 0.5, wetLevel = 0, fogIntensity = 0;
let shakeIntensity = 0;

// 💡 [개선] 흔들림 감쇠율 조정 (잔진동 제거, 묵직하고 짧은 타격감)
function applyScreenShake() { 
    if(shakeIntensity <= 0.5) { 
        canvas.style.transform = "translate(0px,0px)"; 
        vfxCanvas.style.transform = "translate(0px,0px)"; 
        shakeIntensity = 0; 
        return; 
    } 
    let dx = (Math.random()-0.5) * shakeIntensity; 
    let dy = (Math.random()-0.5) * shakeIntensity; 
    canvas.style.transform = `translate(${dx}px, ${dy}px)`; 
    vfxCanvas.style.transform = `translate(${dx}px, ${dy}px)`; 
    
    // ★ 핵심: 0.85 -> 0.7로 변경 (진동이 엄청나게 빨리 사그라듦)
    shakeIntensity *= 0.70; 
    requestAnimationFrame(applyScreenShake); 
}

// [최적화] 전역으로 뺀 운석 그리기 함수 (이제 모든 운석 연출이 이걸 공유함)
function drawSharedMeteor(ctx, x, y, angle, size, color, isMain, progress) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    
    // 거친 화염 꼬리
    let tailLen = size * (isMain ? 15 : 10);
    for(let i=0; i<3; i++) {
        let tLen = tailLen * (1 - i*0.2);
        let tWidth = size * (1.5 - i*0.3);
        let tailGrad = ctx.createLinearGradient(0, 0, -tLen, 0);
        tailGrad.addColorStop(0, isMain && progress > 0.35 ? '#fff' : color);
        tailGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = tailGrad;
        ctx.beginPath();
        ctx.moveTo(size*0.5, 0);
        ctx.lineTo(-tLen, -tWidth);
        ctx.lineTo(-tLen*0.8, 0);
        ctx.lineTo(-tLen, tWidth);
        ctx.fill();
    }
    
    // 운석 본체
    ctx.fillStyle = isMain && progress > 0.35 ? "#ffffff" : color;
    ctx.shadowBlur = size * 3; ctx.shadowColor = color;
    ctx.beginPath();
    let points = 7;
    for(let i=0; i<points; i++) {
        let rad = size * (0.8 + Math.random() * 0.4); // 지글거림 효과
        let a = (Math.PI * 2 / points) * i;
        if(i===0) ctx.moveTo(Math.cos(a)*rad, Math.sin(a)*rad);
        else ctx.lineTo(Math.cos(a)*rad, Math.sin(a)*rad);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
}

function forceResize() {
    W = window.innerWidth;
    H = window.innerHeight;

    // 가로 1920 대비 현재 창이 얼마나 큰지 비율 계산
    scaleRatio = W / BASE_W;

    if (canvas && vfxCanvas) {
        // 캔버스 크기를 브라우저 창 크기와 1:1로 맞춤 (블랙바 제거)
        canvas.width = W;
        canvas.height = H;
        vfxCanvas.width = W;
        vfxCanvas.height = H;

        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        vfxCanvas.style.width = W + "px";
        vfxCanvas.style.height = H + "px";

        // 배경 재생성 (바뀐 H값 적용)
        if(typeof generateNature === 'function') {
            generateNature(canvas, vfxCanvas, W, H, WORLD_WIDTH);
            clouds.length = 0;
        }
    }

    // ★ 창 크기 변경 시 기존 몹들의 위치 강제 보정
    critters.forEach(c => {
        // 공중에 떠 있는 몹이 아니라면 땅 위치 재계산
        if (c.typeData.moveType !== "float") {
            c.y = getGroundY(c.x); 
        }
    });
}

// 전역 연결 (HTML 버튼에서도 쓰게)
window.forceResize = forceResize;

// ★ [복구] 사이드바 알림 함수 (이게 없어서 날씨가 멈췄던 것임)
let notifTimer = null;
function showSideNotification(label, text, color = "#FFD700") {
    const bar = document.getElementById("notification-bar");
    const labelEl = document.getElementById("notif-label");
    const contentEl = document.getElementById("notif-content");

    if (!bar || !labelEl || !contentEl) return;

    // 내용 업데이트
    labelEl.innerText = label;
    contentEl.innerHTML = text; 
    contentEl.style.color = "white";
    contentEl.style.textShadow = `0 0 15px ${color}`;
    bar.style.borderRight = `5px solid ${color}`; // 테두리 색상 변경

    // 애니메이션 재실행 트릭
    bar.classList.remove("show");
    void bar.offsetWidth; // 강제 리플로우 (애니메이션 초기화)
    bar.classList.add("show");

    // 4초 뒤 자동 숨김
    if (notifTimer) clearTimeout(notifTimer);
    notifTimer = setTimeout(() => {
        bar.classList.remove("show");
    }, 4000);
}

// ★ [기믹 4] 숨겨진 글리치 날씨가 추가되었습니다. (2.5% 확률)
const weathers = [ 
    { id: "clear", name: "맑음", chance: 30, condition: "ALL", music: "bgms/clear.mp3", sfx: "weathers/clear.mp3", buff: { luck: 0.1, speed: 0.1 } }, 
    { id: "rain", name: "비", chance: 10, condition: "ALL", music: "bgms/rain.mp3", sfx: "weathers/rain.mp3", buff: { luck: 0.2, speed: -0.1 } }, 
    { id: "snow", name: "눈", chance: 8.5, condition: "ALL", music: "bgms/snow.mp3", sfx: "weathers/snow.mp3", buff: { luck: 0.3, speed: -0.2 } }, 
    { id: "wind", name: "강풍", chance: 15, condition: "ALL", music: "bgms/wind.mp3", sfx: "weathers/wind.mp3", buff: { luck: 0, speed: 1.0 } }, 
    { id: "thunder", name: "뇌우", chance: 8.5, condition: "ALL", music: "bgms/thunder.mp3", sfx: "weathers/thunder.mp3", buff: { luck: 0.5, speed: 0.5 } }, 
    { id: "cloudy", name: "흐림", chance: 10, condition: "ALL", music: "bgms/cloudy.mp3", sfx: "weathers/cloudy.mp3", buff: { luck: -0.1, speed: -0.1 } }, 
    { id: "foggy", name: "안개", chance: 10, condition: "ALL", music: "bgms/foggy.mp3", sfx: "weathers/foggy.mp3", buff: { luck: 0, speed: 0.3 } },
    { id: "heatwave", name: "폭염", chance: 5, condition: "DAY", music: "bgms/heatwave.mp3", sfx: "weathers/heat_haze.mp3", buff: { luck: 0.2, speed: -0.3 } },
    // 일식, 월식 (상향된 버프 유지)
    { id: "eclipse", name: "일식", chance: 3, condition: "DAY", music: "bgms/eclipse.mp3", sfx: "weathers/eerie_hum.mp3", buff: { luck: 10.0, speed: 0 } }, 
    { id: "blood-moon", name: "월식", chance: 3, condition: "NIGHT", music: "bgms/blood_moon.mp3", sfx: "weathers/wolf_howl.mp3", buff: { luck: 5.0, speed: 5.0 } },
    // ★ [기믹 4] 히든 날씨 (초희귀, 엄청난 버프)
    { id: "glitch", name: "차원 붕괴", chance: 2, condition: "ALL", music: "bgms/glitch_void.mp3", sfx: "weathers/glitch_ambience.mp3", buff: { luck: 25.0, speed: 10.0 } }
];
let currentWeather = weathers[0];

let mouseParallaxY = 0;

window.addEventListener("mousemove", (e) => { 
    // 마우스 패럴랙스 효과도 배율 보정
    let rect = canvas.getBoundingClientRect();
    // 캔버스 밖이면 0 처리 하거나 보정
    let localY = (e.clientY - rect.top) / scaleRatio;
    
    mouseParallaxY = (localY - H / 2) / (H / 2); 
});

// ★ [기믹 2] 별똥별 스폰 로직 ★
function spawnShootingStar() {
    // 밤 시간(18~06)에만 생성. 월식/글리치일 때는 색상 변화
    let isNight = (hours >= 18 || hours < 6);
    if (!isNight) return;

    let color = "#ffffff";
    if (currentWeather.id === "blood-moon") color = "#ff416c";
    if (currentWeather.id === "glitch") color = "#00ffff";

    shootingStars.push({
        x: Math.random() * W * 0.5, // 화면 왼쪽에서 시작
        y: Math.random() * H * 0.3, // 화면 위쪽에서 시작
        vx: 15 + Math.random() * 10,
        vy: 5 + Math.random() * 5,
        size: 4,
        color: color,
        tail: []
    });
}

function renderShootingStars(ctx) {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        let s = shootingStars[i];
        s.tail.push({x: s.x, y: s.y, life: 1.0});
        s.x += s.vx; s.y += s.vy;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10; ctx.shadowColor = s.color;
        ctx.strokeStyle = s.color;
        s.tail.forEach((t, idx) => {
            t.life -= 0.05;
            if(idx === 0) ctx.moveTo(t.x, t.y); else ctx.lineTo(t.x, t.y);
        });
        ctx.stroke(); ctx.shadowBlur = 0;
        s.tail = s.tail.filter(t => t.life > 0);

        if (s.x > W || s.y > H) shootingStars.splice(i, 1);
    }
}

// 💡 [기능 복구] 역동적인 푸른빛 가지 번개(Forked Lightning) 생성
function triggerLightning() {
    playSound('lightning'); // 문자열 키값으로 변경
    shakeIntensity = 25; applyScreenShake(); // 천둥 충격

    // 화면 전체 번쩍임 (화이트 플래시)
    let flash = document.getElementById("lightning-flash");
    flash.style.opacity = 0.8;
    setTimeout(() => { flash.style.opacity = 0; }, 80);

    let startX = Math.random() * W;
    let bolts = [];
    
    // [메인 번개]
    let curX = startX, curY = 0;
    let points = [{x: curX, y: curY}];
    while(curY < H) {
        curX += (Math.random() - 0.5) * 200; // 좌우로 크게 꺾임
        curY += Math.random() * 80 + 30;
        points.push({x: curX, y: curY});
    }
    bolts.push({points: points, width: 4, alpha: 1.0});

    // [서브 가지 번개] 3~4개 생성
    let branches = Math.floor(Math.random() * 2) + 2;
    for(let i=0; i<branches; i++) {
        let splitIdx = Math.floor(Math.random() * (points.length - 2)) + 1;
        let subX = points[splitIdx].x;
        let subY = points[splitIdx].y;
        let subPoints = [{x: subX, y: subY}];
        for(let j=0; j<6; j++) {
            subX += (Math.random() - 0.5) * 150;
            subY += Math.random() * 70 + 20;
            subPoints.push({x: subX, y: subY});
        }
        bolts.push({points: subPoints, width: 1.5, alpha: 0.7});
    }

    lightningBolts.push({ group: bolts, life: 1.0 });
}

// 💡 [기능 복구] 번개 렌더링 (일렉트릭 블루 글로우 효과)
function renderLightning(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // 번개끼리 겹치면 더 밝아짐

    for(let i = lightningBolts.length - 1; i >= 0; i--) {
        let boltObj = lightningBolts[i];
        
        boltObj.group.forEach(bolt => {
            ctx.beginPath();
            ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
            for(let j=1; j<bolt.points.length; j++) {
                ctx.lineTo(bolt.points[j].x, bolt.points[j].y);
            }
            ctx.strokeStyle = `rgba(220, 240, 255, ${boltObj.life * bolt.alpha})`;
            ctx.lineWidth = bolt.width;
            ctx.shadowBlur = 40;
            ctx.shadowColor = "#00e5ff"; // 푸른색 광원
            ctx.stroke();
        });

        boltObj.life -= 0.05; // 0.3초 만에 빠르게 사라짐
        if(boltObj.life <= 0) lightningBolts.splice(i, 1);
    }
    ctx.restore();
}

// main.js 내부 적절한 곳에 추가
function resetBrowserZoom() {
    // 1. CSS zoom 속성을 이용해 강제로 100% 설정 (대부분의 모던 브라우저)
    document.body.style.zoom = "1.0";

    // 2. 혹시 모를 배율 꼬임 방지를 위해 뷰포트 메타 태그 재설정
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
}

function spawnWeatherParticle() {
    let z = Math.random() * 0.9 + 0.1; 
    let startX = Math.random() * W;
    let startY = -50; 
    
    // 현재 플레이어의 바이옴 확인
    const currentBiome = getPlayerBiome(player.x);
    let type = currentWeather.id; // 기본은 현재 날씨 따름

    // ★ [조건 1] 사막/설산 강제 효과 및 날씨 차단
    if (currentBiome === "DESERT") {
        if (type === "rain" || type === "snow" || type === "thunder") return; // 사막에선 비/눈/천둥 파티클 생성 안 함
    }
    if (currentBiome === "FROZEN_MOUNTAIN") {
        if (type === "heatwave") return; // 설산에선 폭염 파티클 생성 안 함
        
        // 설산은 맑은 날에도 눈이 조금씩 내림
        if (type === "clear" || type === "cloudy") {
            if (Math.random() < 0.3) type = "snow"; 
        }
    }

    let vx = (Math.random() - 0.5) * 3; 
    let vy = (type === "thunder") ? (35 * z) : (type === "rain") ? (25 * z) : (type === "snow" ? (4 * z) : 1); 
    let size = 2 * z;
    let char = ""; // 글리치용

    // 폭염 파티클 (아지랑이)
    if (type === "heatwave") {
        startY = H + 50; 
        vy = -(Math.random() * 2 + 1); 
        vx = (Math.random() - 0.5) * 0.5; 
        size = Math.random() * 40 + 20; 
    }

    // 글리치 파티클
    if (type === "glitch") {
        vy = 10 + Math.random() * 20; 
        size = Math.random() * 15 + 10; 
        char = Math.random() < 0.5 ? "0" : "1"; 
    }

    if (type === "snow") { size = (4 * z) + 3; }
    if (type === "wind") { 
        startX = -50; startY = Math.random() * H; 
        vx = 25 + Math.random() * 20; vy = (Math.random() - 0.5) * 4; 
        size = Math.random() * 40 + 20; 
    } 
    if (type === "foggy") { 
        vx = Math.random() * 0.4 - 0.2; vy = Math.random() * 0.5; 
        size = Math.random() * 40 + 20; 
    } 

    // 파티클 등록 (weatherType을 보정된 type으로 저장)
    weatherParticles.push({ 
        x: startX, y: startY, z: z, vx: vx, vy: vy, 
        size: size, weatherType: type, // 수정된 타입 사용
        opacity: type === "foggy" ? Math.random() * 0.02 : 0.3 + (0.5 * z), 
        char: char 
    }); 
}

function renderWeatherLayer(minZ, maxZ) { 
    ctx.lineWidth = 2; 
    const currentBiome = getPlayerBiome(player.x);
    for (let i = weatherParticles.length - 1; i >= 0; i--) {
        let p = weatherParticles[i];
        if (currentBiome === "DESERT" && (p.weatherType === "rain" || p.weatherType === "snow")) continue;
        if (currentBiome === "FROZEN_MOUNTAIN" && p.weatherType === "heatwave") continue;
        if (p.z >= minZ && p.z < maxZ) { 
            let px = p.x - currentParallaxX * 100 * p.z; let py = p.y - currentParallaxY * 50 * p.z; 
            
            if (p.weatherType === "snow") { ctx.fillStyle = `rgba(255,255,255,${p.opacity})`; ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2); ctx.fill(); } 
            else if (p.weatherType === "rain" || p.weatherType === "thunder") { ctx.strokeStyle = `rgba(173, 216, 230, ${p.opacity})`; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + p.vx, py + p.vy); ctx.stroke(); } 
            else if (p.weatherType === "wind") { 
                // 사막이면 모래색 선, 아니면 흰색 반투명 선
                if (currentBiome === "DESERT") {
                    // 모래색 (Sand)
                    ctx.strokeStyle = `rgba(194, 178, 128, ${p.opacity * 0.8})`; 
                    ctx.lineWidth = 4; // 모래바람은 좀 더 두껍고 거칠게
                } else {
                    // 일반 바람 (White)
                    ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.5})`; 
                    ctx.lineWidth = 3;
                }
                
                ctx.beginPath(); 
                ctx.moveTo(px, py); 
                ctx.lineTo(px + p.size, py); // 가로로 긋기
                ctx.stroke(); 
            }
            else if (p.weatherType === "foggy") { let grad = ctx.createRadialGradient(px, py, 0, px, py, p.size); grad.addColorStop(0, `rgba(255,255,255, ${p.opacity})`); grad.addColorStop(1, `rgba(255,255,255, 0)`); ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2); ctx.fill(); } 
            
            else if (p.weatherType === "heatwave") {
                let grad = ctx.createRadialGradient(px, py, 0, px, py, p.size);
                // 주황빛 열기
                grad.addColorStop(0, `rgba(255, 100, 0, ${p.opacity * 0.2})`); 
                grad.addColorStop(1, `rgba(255, 200, 0, 0)`);
                ctx.fillStyle = grad;
                
                // 물결치며 올라가는 효과
                let wave = Math.sin(globalRenderTime * 0.1 + p.y * 0.05) * 5;
                ctx.beginPath(); 
                ctx.arc(px + wave, py, p.size, 0, Math.PI * 2); 
                ctx.fill();
            }

            // 💡 [핵심] 글리치 데이터(0, 1) 매트릭스 렌더링
            else if (p.weatherType === "glitch") {
                ctx.font = `bold ${p.size}px monospace`;
                // 10% 확률로 색상이 빨강/파랑으로 깜빡임
                let r = Math.random();
                ctx.fillStyle = r < 0.05 ? "#ff003c" : r < 0.1 ? "#00ffff" : `rgba(0, 255, 100, ${p.opacity})`;
                ctx.shadowBlur = 10; ctx.shadowColor = ctx.fillStyle;
                ctx.fillText(p.char, px, py);
                ctx.shadowBlur = 0;
                // 5% 확률로 떨어지면서 숫자가 바뀜
                if (Math.random() < 0.05) p.char = Math.random() < 0.5 ? "0" : "1";
            }
            
            p.x += p.vx; p.y += p.vy; 
            
            if (p.y > H + 50 || p.x > W + p.size || p.x < -50 || p.y < -50) { 
                weatherParticles.splice(i, 1);
            } 
        } 
    }
}

// ==========================================
// ★ [멀티플레이] 채팅창 열고 닫기 함수
// ==========================================
window.toggleChat = function() {
    playSound('click');
    const chat = document.getElementById("chat-container");
    const btn = document.getElementById("chat-toggle-btn");
    
    chat.classList.toggle("open");
    btn.classList.toggle("open");

    // ★ [여기 추가] 열었으니까 알림(빨간 점, 흔들림) 끄기
    if (chat.classList.contains("open")) {
        btn.classList.remove("has-notification");
        btn.classList.remove("wiggle");
    }
    
    // 버튼 텍스트 변경
    btn.innerText = chat.classList.contains("open") ? "◀ CLOSE" : "💬 CHAT";
};

let activeSpawns = [];
setInterval(() => {
    // 1. 아이템 데이터 가져오기
    let itemData = consumableDB[currentWeather.id] || consumableDB["clear"];
    if (!itemData) return;

    // 2. 화면 내 아이템 개수 확인 (화면 밖 아이템은 카운트 제외)
    let visibleCount = activeSpawns.filter(p => p.screenX >= -200 && p.screenX <= W + 200).length;

    // 3. 희소성 유지 (최대 3개) + 50% 확률
    if (visibleCount < 3) {
        if (Math.random() > 0.5) return;

        // ★ [핵심 변경] 호스트에 따라 목표 깊이(Depth) 설정
        // 나무 아이템 -> 0.7 (배경, 근경)
        // 풀 아이템 -> 1.0 (플레이어 발 밑)
        const targetDepth = (itemData.host === "tree") ? 0.7 : 1.0;
        
        // 대상 배열 선택
        let hostArray = (itemData.host === "tree") ? trees : grassBlades;
        if (hostArray.length === 0) return;

        // ★ [필터링] 지정된 깊이(targetDepth)에 있고, 화면 안에 있는 호스트만 찾음
        let candidates = hostArray.filter(h => {
            // (1) 깊이 일치 여부 확인
            // (부동소수점 오차 고려하여 아주 작은 차이는 허용)
            if (Math.abs(h.layerDepth - targetDepth) > 0.01) return false;

            // (2) 화면 내 존재 여부 (Parallax 적용된 화면 좌표 기준)
            let screenX = h.baseX - (cameraX * h.layerDepth);
            
            // 화면 좌우 여유분 200px 포함
            return screenX > -200 && screenX < W + 200;
        });
        
        if (candidates.length > 0) {
            // 후보 중 하나 랜덤 선택
            let targetHost = candidates[Math.floor(Math.random() * candidates.length)];
            
            // 중복 스폰 방지
            let isOccupied = activeSpawns.some(s => s.hostId === targetHost.id);
            
            if (!isOccupied) {
                let spawnY = targetHost.y || getGroundY(targetHost.baseX, targetHost.layerDepth);
                let yOffset = (itemData.host === "tree") ? 150 : 20;
                
                // 초기 Y값 계산 (Parallax Y 적용)
                let initialScreenY = spawnY - yOffset - (currentParallaxY * 50 * targetHost.layerDepth);

                activeSpawns.push({ 
                    type: itemData.id || currentWeather.id, 
                    hostType: itemData.host, 
                    hostId: targetHost.id, 
                    life: 2400, // 수명 40초 (조금 더 길게)
                    floatY: Math.random() * Math.PI * 2, 
                    
                    // 초기 화면 좌표 (깜빡임 방지용)
                    screenX: targetHost.baseX - (cameraX * targetHost.layerDepth), 
                    screenY: initialScreenY
                });
            }
        }
    }
}, 1000);

function renderSpawns(ctx) {
    activeSpawns.forEach(p => {
        p.life--; 
        p.floatY += 0.05;
        
        let itemData = consumableDB[p.type];
        if (!itemData) return;

        let hostArray = p.hostType === "tree" ? trees : grassBlades;
        let host = hostArray.find(h => h.id === p.hostId);
        
        if (!host) { p.life = 0; return; }

        // --- 위치 계산 (기존 물리 로직 유지) ---
        let rootX = host.baseX - (cameraX * host.layerDepth);
        let rootY = getGroundY(host.baseX, host.layerDepth) - (currentParallaxY * 50 * host.layerDepth);
        let finalX = rootX, finalY = rootY;

        if (p.hostType === "tree") {
            // 나무: 회전 물리
            let baseH = host.isCactus ? 80 : 140; 
            let offsetX = ((host.seed % 40) - 20); 
            let offsetY = baseH + (host.seed % 20);
            
            let localX = offsetX * host.size;
            let localY = -offsetY * host.size;

            let swayAngle = Math.sin(globalRenderTime * 0.015 + host.seed) * 0.08;
            if (host.isCactus) swayAngle *= 0.2;

            let rotatedX = localX * Math.cos(swayAngle) - localY * Math.sin(swayAngle);
            let rotatedY = localX * Math.sin(swayAngle) + localY * Math.cos(swayAngle);

            finalX = rootX + rotatedX;
            finalY = rootY + rotatedY;
            finalY += Math.sin(p.floatY) * 1.5;

        } else {
            // 풀: 스큐 이동
            let sway = Math.sin(windTime + host.swayOffset) * 6;
            finalX = rootX + (sway * 1.5); 
            finalY = rootY - host.h;
            finalY += Math.sin(p.floatY) * 3; 
        }

        // 화면 좌표 저장
        p.screenX = finalX; 
        p.screenY = finalY;

        // --- 그리기 ---
        ctx.save(); 
        ctx.translate(finalX, finalY);
        
        // ★ [추가] 배경(0.7)에 있는 아이템은 80% 크기로 작게 그림 (원근감)
        if (host.layerDepth < 1.0) {
            ctx.scale(0.8, 0.8);
        }

        ctx.globalAlpha = Math.min(1, p.life / 50);
        
        if (GRAPHICS.fancyGraphics) {
            ctx.shadowBlur = 10; 
            ctx.shadowColor = itemData.color; 
            ctx.fillStyle = itemData.color; 
        } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = itemData.color; 
        }
        
        ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "white"; ctx.lineWidth = 1.5; ctx.stroke();
        
        ctx.restore();
    });
    
    activeSpawns = activeSpawns.filter(p => p.life > 0);
}

canvas.addEventListener('pointerdown', (e) => {
    let rect = canvas.getBoundingClientRect(); 
    // 모바일/PC 배율 보정 없이 직접 좌표 추출 (렌더링 로직과 통일)
    let clickX = (e.clientX - rect.left);
    let clickY = (e.clientY - rect.top);

    // 1. 별똥별 캐치 (기존 코드 유지)
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        let s = shootingStars[i];
        if (Math.hypot(clickX - s.x, clickY - s.y) < 80) { 
            playSound('star'); 
            vfxParticles.spawnExplosion(s.x, s.y, s.color, 30, 10);
            fragments += 250; 
            addExp(100);
            updateAllUI();
            shootingStars.splice(i, 1); return; 
        }
    }

    // 2. ★ [수정됨] 아이템 채집 판정
    for (let i = activeSpawns.length - 1; i >= 0; i--) {
        let p = activeSpawns[i];
        
        // 아직 화면 좌표가 계산 안 된 아이템은 패스
        if (!p.screenX || !p.screenY) continue;
        
        // 거리 60px 이내 클릭 시 획득
        if (Math.hypot(clickX - p.screenX, clickY - p.screenY) < 60) { 
            playSound('success'); // 1. 소리 재생
            
            // ★ [핵심 수정] 변수 선언을 사용보다 먼저 해야 합니다!
            let itemKey = p.type; 
            
            // 2. 로그 띄우기 (이제 itemKey가 있어서 에러 안 남)
            if (typeof spawnItemLog === 'function') spawnItemLog(itemKey);
            
            // 3. 인벤토리에 추가
            consumableInv[itemKey] = (consumableInv[itemKey] || 0) + 1;
            
            // 4. 이펙트 생성
            if (vfxParticles) {
                vfxParticles.spawnExplosion(p.screenX, p.screenY, consumableDB[itemKey]?.color || "#FFF", 20, 8); 
            }

            // 5. 화면에서 아이템 제거
            activeSpawns.splice(i, 1); 

            // ★ [추가] UI 즉시 갱신 (숫자 올라가는 거 바로 보이게)
            if (typeof renderConsumableList === 'function') renderConsumableList(consumableInv);
            if (typeof renderQuickBar === 'function') renderQuickBar(consumableInv);

            return; // 획득했으면 공격 모션 안 나가게 종료
        }
    }

    // 3. 공격 발동 (아이템 클릭 아닐 때만)
    triggerAttack(clickX, clickY);
});

// 8. MAIN RENDER LOOP & WEATHER TRANSITIONS
let lastDisplayMin = -1;
let lastWeatherHour = 12; // 시작 시 중복 실행 방지
let frameCount = 0; 

let currentSkyTop = [0, 0, 0], currentSkyBot = [0, 0, 0];
let isSkyInitialized = false;
let targetSkyAlpha = 1, currentSkyAlpha = 1; 

// 콤보 리셋 함수
function resetCombo() {
    comboCount = 0;
    comboTimeLeft = 0;
    document.getElementById("combo-display").style.display = "none";
}

// 피버 타임 발동 함수
function triggerFeverTime() {
    isFeverTime = true;
    feverTimeLeft = 600; // 10초
    document.body.classList.add("fever-active");
    document.getElementById("combo-message").innerText = "FEVER TIME! X2 LUCK & SPEED";
    document.getElementById("combo-message").style.color = "#FFD700";
    calcBuffs();
}

// ★ [신규 기능] 진짜 천 같은 물리 엔진
function updateScarfPhysics() {
    // 1. 머플러의 시작점(목 부분)을 플레이어의 현재 월드 좌표에 고정
    let isMoving = Math.abs(player.vx) > 0.1;
    let animTime = player.walkFrame * 0.1;
    let bounce = isMoving ? Math.abs(Math.sin(animTime)) * 4 : Math.sin(globalRenderTime * 0.04) * 2;
    let neckY = player.y - 75 + bounce; // 키(h=100) 고려한 목 위치

    player.scarfSegments[0].x = player.x;
    player.scarfSegments[0].y = neckY;

    // 바람의 힘: 플레이어 이동 반대 방향 + 약간의 난수
    // 왼쪽(-)으로 가면 vx가 음수이므로 windForce는 양수(+)가 되어 오른쪽으로 휨
    scarfConfig.windForce = -player.vx * 1.5 + Math.sin(globalRenderTime * 0.1) * 0.5;

    // 2. 나머지 마디들 계산 (Constraint 해결)
    for (let i = 1; i < player.scarfSegments.length; i++) {
        let current = player.scarfSegments[i];
        let prev = player.scarfSegments[i - 1];

        // (A) 외력 적용 (중력 + 바람)
        current.y += scarfConfig.gravity;
        current.x += scarfConfig.windForce;

        // (B) 거리 제약 조건 (Distance Constraint) - 여기가 핵심!
        // 현재 마디가 이전 마디로부터 너무 멀어지거나 가까워지면 강제로 잡아당김
        let dx = current.x - prev.x;
        let dy = current.y - prev.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // 거리가 0이면 계산 오류 나므로 안전장치
        if (distance === 0) distance = 0.01;

        // 목표 거리와의 비율 계산
        let difference = (scarfConfig.segmentLength - distance) / distance;
        
        // 이전 마디 쪽으로 당겨짐 (늘어나지 않는 천 효과)
        let translateX = dx * difference * 0.5;
        let translateY = dy * difference * 0.5;
        
        current.x += translateX;
        current.y += translateY;
            // (이전 마디도 살짝 당겨오면 더 리얼하지만 계산 단순화를 위해 생략)
    }
}

// ★ [최종판] 360도 전방향 조준 및 하이엔드 스킬 시스템
function triggerAttack(mouseX, mouseY) {
    if (!equippedAuraName) return; 
    let now = performance.now();

    // 1. 현재 장착된 오라 정보 및 색상 추출 (에러 해결 핵심)
    let aura = allAuras.find(a => a.name === equippedAuraName);
    if (!aura) return;
    
    let chance = aura.chanceX;
    let color = aura.color || "#FFF"; // 여기서 color 변수를 확실히 정의합니다.

    // 2. 티어별 쿨타임 설정
    let cooldown = (chance >= 2400000000) ? 3000 : (chance >= 100000000) ? 2000 : (chance >= 1000000) ? 1500 : 500;
    if (now - lastAttackTime < cooldown) return;
    lastAttackTime = now;

    playSound('click'); 

    // 3. 마우스 조준 각도(Angle) 및 벡터 계산
    let pScreenX = player.x - cameraX;
    let pScreenY = player.y - currentParallaxY * 50 - 65;
    let dx = mouseX - pScreenX;
    let dy = mouseY - pScreenY;
    let angle = Math.atan2(dy, dx); 

    player.facingRight = dx > 0; // 클릭 방향으로 캐릭터 시선 전환

    // 내 캐릭터의 실시간 반동 계산
    let isMoving = Math.abs(player.vx) > 0.1;
    let animTime = player.walkFrame * 0.1;
    let breathing = Math.sin(globalRenderTime * 0.04) * 2;
    let bounce = isMoving ? Math.abs(Math.sin(animTime)) * 4 : breathing;
    
    let startX = player.x;
    let startY = player.y - 65 - bounce;
    const spdX = Math.cos(angle);
    const spdY = Math.sin(angle);

    // ★ 서버로 보낼 때 내 socket.id를 포함해서 보냅니다.
    socket.emit('playerAttack', { 
        id: socket.id, // 내 ID 추가
        chance, color, startX, startY, angle 
    });

    // ==========================================
    // ★ [티어별 고퀄리티 공격 생성] ★
    // ==========================================

    // [티어 1] 💫 유성탄
    if (chance < 1000) { 
        playSound('attack_1'); // 🎵 푝!
        projectiles.push({ type: 1, ownerId: socket.id, x: startX, y: startY, vx: spdX * 12, vy: spdY * 12, angle, life: 1.0, color, size: 25, rarity: chance});
    }
    // [티어 2] ⚔️ 쌍검기
    else if (chance < 1000000) { 
        playSound('attack_2'); // 🎵 슉!
        for (let i of [-1, 1]) {
                let offsetX = Math.cos(angle + Math.PI/2) * (i * 15);
                let offsetY = Math.sin(angle + Math.PI/2) * (i * 15);
                projectiles.push({ type: 2, ownerId: socket.id, x: startX + offsetX, y: startY + offsetY, vx: spdX * 16, vy: spdY * 16, angle, life: 1.0, color, size: 45, rarity: chance });
        }
    }
    // [티어 3] ⚡ 하이퍼 레이저
    else if (chance < 100000000) { 
        playSound('attack_3'); // 🎵 지이잉!
        projectiles.push({ type: 3, ownerId: socket.id, x: startX, y: startY, vx: 0, vy: 0, angle, life: 1.0, color, width: 90, length: 1500, rarity: chance });
        shakeIntensity = 15; applyScreenShake();
    }
    // [티어 4] 🗡️ 성검 강림 (부채꼴 확산 5연발)
    else if (chance < 1000000000) { 
        // 기존 for문이나 playSound 다 지우고 이걸로 교체!
        for(let i=0; i<5; i++) {
            setTimeout(() => {
                // ★ 등 뒤에 있던 검 5개가 하나씩 날아가는 사운드!
                let soundClone = COMBAT_SFX.attack_4.cloneNode();
                soundClone.volume = 0.6;
                soundClone.play().catch(()=>{});

                let spread = (i - 2) * 0.12; 
                let sAngle = angle + spread;
                // 투사체 발사
                projectiles.push({ type: 4, ownerId: socket.id, x: startX, y: startY, vx: Math.cos(sAngle) * 28, vy: Math.sin(sAngle) * 28, angle: sAngle, life: 1.5, color, size: 90, rarity: chance });
            }, i * 60); // 0.06초 간격으로 다다다닥!
        }
        shakeIntensity = 20; applyScreenShake();
    }
    // [티어 5] 🌀 아케인 차크람
    else if (chance < 2400000000) { 
        playSound('attack_5'); // 🎵 촤라락!
        projectiles.push({ 
            type: 5, ownerId: socket.id, x: startX, y: startY, vx: spdX * 12, vy: spdY * 12, 
            angle, life: 4.5, color, size: 140, rarity: chance, hitMobiles: [] 
        });
        shakeIntensity = 35; applyScreenShake();
    }
    // [티어 6] 🌌 차원 절단
    else { 
        playSound('attack_6'); // 🎵 콰아앙!
        projectiles.push({ type: 6, ownerId: socket.id, x: startX, y: startY, vx: 0, vy: 0, angle, life: 1.2, color: "#fff", width: 550, length: 3000, rarity: chance });
        shakeIntensity = 70; applyScreenShake();
    }
}

function render() { 
    globalRenderTime++;
    // ★★★ [누락되었던 핵심 코드 추가] ★★★
    // 이 코드가 없으면 시간(dt)이 0이라서 회복 타이머가 안 올라갑니다.
    const now = performance.now();
    dt = (now - lastFrameTime) / 1000; 
    lastFrameTime = now;


    
    // 렉 걸렸을 때 순간이동 방지 (최대 0.1초까지만 인정)
    if (dt > 0.1) dt = 0.1; 
    dtFactor = dt * 60; // 60FPS 기준 보정값 (움직임 부드럽게)
    // ★★★★★★★★★★★★★★★★★★★★★★★

    let preciseHour = gameTimeMinutes / 60; 
    hours = Math.floor(preciseHour);
    minutes = Math.floor(gameTimeMinutes % 60);

    // 0. (안전장치) 타이머 변수가 없으면 초기화
    if (typeof player.noDamageTimer === 'undefined') player.noDamageTimer = 5.0;

    // 1. 무적 시간 감소
    if (player.invincibleTime > 0) {
        player.invincibleTime -= 1 * dtFactor;
        if (player.invincibleTime <= 0) {
                player.invincibleTime = 0;
                player.opacity = 1;
        }
    }

    // 2. [수정됨] 전투 이탈 회복 시스템 (틱 방식)
    player.noDamageTimer += dt; // 피해 입지 않은 시간 측정

    // 틱 타이머 변수 초기화 (없으면 생성)
    if (typeof player.regenTimer === 'undefined') player.regenTimer = 0;

    // 조건: "5초 이상 피해 없고" && "체력이 깎여있고" && "살아있음"
    if (player.noDamageTimer > 5.0 && player.hp > 0 && player.hp < player.maxHp) {
        
        player.regenTimer += dt; // 회복 쿨타임 누적

        // ★ 4초(4.0)마다 한 번씩 회복 (틱 발생)
        if (player.regenTimer >= 4.0) {
            
            // 회복량 계산: 최대 체력의 5% (최소 1)
            let healAmount = Math.ceil(player.maxHp * 0.02);
            
            player.hp += healAmount;
            if(player.hp > player.maxHp) player.hp = player.maxHp;

            updateProfileUI(); // UI 갱신

            // ★ 핵심: 회복된 양을 텍스트로 띄움 (예: +15)
            spawnDamageText(
                player.x - cameraX, 
                player.y - currentParallaxY * 50 - 60, 
                "+" + healAmount, 
                false, 
                "#69F0AE" // 밝은 초록색
            );
            
            player.regenTimer = 0; // 틱 타이머 리셋 (다시 1초 셈)
        }
    } else {
        player.regenTimer = 0; // 조건 만족 안 하면 틱 초기화
    }

    if (minutes !== lastDisplayMin) {
        DOM.time.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        lastDisplayMin = minutes;
    }

    // 콤보 게이지 감소 및 피버 타임 체크
    if (comboTimeLeft > 0) {
        let decayRate = 1 + Math.min(4, comboCount / 50); 
        comboTimeLeft -= decayRate;
        let widthPercent = Math.max(0, (comboTimeLeft / 300) * 100);
        DOM.comboBar.style.width = widthPercent + "%";
        if (comboTimeLeft <= 0) resetCombo();
    }

    if (isFeverTime) {
        feverTimeLeft--;
        if (feverTimeLeft <= 0) {
            isFeverTime = false;
            document.body.classList.remove("fever-active");
            calcBuffs();
        }
    }

    // 별똥별 스폰 (밤 한정)
    if (Math.random() < 0.002) spawnShootingStar(); 

    // 뇌우 날씨 번개 스폰
    if (currentWeather.id === "thunder" && Math.random() < 0.002) {
        triggerLightning();
    }

    // 날씨 보간 적용
    currentFog += (targetFog - currentFog) * 0.005;     
    currentSnow += (targetSnow - currentSnow) * 0.002;  
    currentParticleCount += (targetParticleCount - currentParticleCount) * 0.01; 

    if (weatherParticles.length < currentParticleCount) {
        let spawnAmount = Math.min(5, Math.floor(currentParticleCount - weatherParticles.length));
        for(let i=0; i<spawnAmount; i++) spawnWeatherParticle();
    }

    globalRenderTime += 1; currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05; currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05; windTime += 0.05; 
    ctx.clearRect(0, 0, W, H); 

    updateScarfPhysics();

    if (typeof calcBuffs === 'function') {
        // ui.js의 함수를 호출하면서 현재 상태(날씨, 피버, 장비)를 전달합니다.
        const buffs = calcBuffs(currentWeather, isFeverTime, feverTimeLeft, equippedGears);
        
        // ui.js가 계산해준 최신 배율을 게임에 적용합니다.
        if (buffs) {
            globalLuckMultiplier = buffs.luck;
            globalSpeedMultiplier = buffs.speed;
        }
    }
    
    // 1. 순수 날씨 기반 색상 가져오기
    const targetSky = getCurrentSkyColors(preciseHour, currentWeather);
    
    // 2. 부드러운 전환을 위해 기존 변수에 색상 주입
    for(let i=0; i<3; i++) {
        currentSkyTop[i] = lerp(currentSkyTop[i], targetSky.top[i], 0.05);
        currentSkyBot[i] = lerp(currentSkyBot[i], targetSky.bot[i], 0.05);
    }

    // 3. 하늘 그라데이션 그리기
    let grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `rgb(${Math.round(currentSkyTop[0])},${Math.round(currentSkyTop[1])},${Math.round(currentSkyTop[2])})`);
    grad.addColorStop(1, `rgb(${Math.round(currentSkyBot[0])},${Math.round(currentSkyBot[1])},${Math.round(currentSkyBot[2])})`);
    ctx.fillStyle = grad; 
    ctx.fillRect(0, 0, W, H);

    // 4. VOID 날씨 전용 노이즈 효과
    if (currentWeather.id === "glitch") {
        ctx.fillStyle = `rgba(255, 0, 255, ${Math.random() * 0.02})`;
        ctx.fillRect(0, 0, W, H);
    }

    let shouldHideSky = (currentWeather.id === "cloudy" || currentWeather.id === "foggy" || currentWeather.id === "thunder" || currentWeather.id === "glitch");
    targetSkyAlpha = shouldHideSky ? 0 : 1;
    currentSkyAlpha += (targetSkyAlpha - currentSkyAlpha) * 0.02;

    let fogRgb = [200, 210, 220]; 
    let starOpacity = (hours < 5 || hours > 19 ? 1 : (hours >= 18 ? (hours-18) : (5-hours))) * currentSkyAlpha; 


    if (GRAPHICS.showStars) {
        if (starOpacity > 0.05) { 
            stars.forEach(s => { 
                ctx.fillStyle = `rgba(255,255,255,${s.alpha * starOpacity})`; 
                ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill(); 
                s.alpha += (Math.random() - 0.5) * 0.05; 
                if (s.alpha < 0) s.alpha = 0; if (s.alpha > 1) s.alpha = 1; 
            }); 
        } 
    }

    if (currentSkyAlpha > 0.05) { 
        let dayAngle = ((preciseHour - 6) / 24) * Math.PI * 2; 
        // [낮 시간 태양 렌더링]
        if (currentSkyAlpha > 0.05) { 
        let dayAngle = ((preciseHour - 6) / 24) * Math.PI * 2; 
        let sunX = W/2 - Math.cos(dayAngle) * W * 0.4; 
        let sunY = H * 0.45 - Math.sin(dayAngle) * H * 0.35;
        let moonAngle = ((preciseHour + 6) / 24) * Math.PI * 2; 
        let moonX = W/2 - Math.cos(moonAngle) * W * 0.4; 
        let moonY = H * 0.45 - Math.sin(moonAngle) * H * 0.35;

        // [기믹] 차원 붕괴(글리치) 날씨
        if (currentWeather.id === "glitch") {
            ctx.save();
            ctx.translate(W/2, H * 0.25);
            ctx.rotate(globalRenderTime * 0.05); 
            ctx.scale(1.0 + Math.sin(globalRenderTime * 0.1) * 0.2, 1.0 + Math.cos(globalRenderTime * 0.1) * 0.2); 
            drawStar(ctx, 0, 0, 8, 120, 60, "#ff003c"); 
            ctx.rotate(-globalRenderTime * 0.1); 
            drawMagicCircle(ctx, 0, 0, 80, 0, "#00ffff", 0.8); 
            ctx.restore();
        } 
        else if (preciseHour >= 6 && preciseHour <= 18) { 
            // ★ [수정] 일식(Eclipse): 사우론의 눈 컨셉
            if (currentWeather.id === "eclipse") {
                ctx.save();
                ctx.translate(sunX, sunY);

                // 1. 불타는 코로나 (주변부 발광)
                let pulse = 1 + Math.sin(globalRenderTime * 0.05) * 0.1;
                let coronaGrad = ctx.createRadialGradient(0, 0, 65, 0, 0, 200 * pulse);
                coronaGrad.addColorStop(0, "rgba(255, 100, 0, 0.8)"); // Fiery orange
                coronaGrad.addColorStop(0.5, "rgba(255, 50, 0, 0.4)"); // Red-orange
                coronaGrad.addColorStop(1, "transparent");
                ctx.fillStyle = coronaGrad;
                ctx.beginPath(); ctx.arc(0, 0, 200 * pulse, 0, Math.PI * 2); ctx.fill();

                // 2. 검은 본체 (가려진 태양)
                ctx.shadowBlur = 50 * currentSkyAlpha; ctx.shadowColor = "#ff2200";
                ctx.fillStyle = "#080000"; 
                ctx.beginPath(); ctx.arc(0, 0, 68, 0, Math.PI * 2); ctx.fill();

                // 3. 사우론의 눈동자 (가운데 찢어진 눈)
                ctx.shadowBlur = 30; ctx.shadowColor = "#ffff00";
                ctx.fillStyle = "#ff8c00"; // 빛나는 오렌지색 홍채
                ctx.beginPath(); ctx.ellipse(0, 0, 20, 55, 0, 0, TWO_PI); ctx.fill();
                ctx.fillStyle = "#ffffcc"; // 중심부 흰색 동공
                ctx.beginPath(); ctx.ellipse(0, 0, 6, 45, 0, 0, TWO_PI); ctx.fill();
                
                ctx.restore();
            } else {
                // (기존 맑은 날 태양 코드 유지)
                let sunGrad = ctx.createRadialGradient(sunX, sunY, 50, sunX, sunY, 300);
                sunGrad.addColorStop(0, `rgba(${targetSky.sun[0]}, ${targetSky.sun[1]}, ${targetSky.sun[2]}, ${currentSkyAlpha * 0.4})`);
                sunGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = sunGrad;
                ctx.beginPath(); ctx.arc(sunX, sunY, 300, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 50 * currentSkyAlpha; 
                ctx.shadowColor = `rgb(${targetSky.sun[0]},${targetSky.sun[1]},${targetSky.sun[2]})`; 
                ctx.fillStyle = `rgba(255, 255, 255, ${currentSkyAlpha})`; 
                ctx.beginPath(); ctx.arc(sunX, sunY, 55, 0, Math.PI * 2); ctx.fill(); 
                ctx.shadowBlur = 0; 
            }
        }
        // [밤 시간 달 렌더링]
        if (preciseHour < 6 || preciseHour > 18) { 
            let moonX = W/2 - Math.cos(moonAngle) * W * 0.4; let moonY = H * 0.45 - Math.sin(moonAngle) * H * 0.35;
            
            // ★ [수정] 블러드 문: 테라리아 스타일 '눈알 덩어리'
            if (currentWeather.id === "blood-moon") {
                ctx.save();
                ctx.translate(moonX, moonY);
                // 천천히 회전시켜서 기괴함 증가
                ctx.rotate(globalRenderTime * 0.001);

                // 1. 본체 (붉고 육덕진 덩어리)
                let bodyGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 150);
                bodyGrad.addColorStop(0, "#ff4d4d"); // 중심부 밝은 붉은색
                bodyGrad.addColorStop(0.7, "#a10000"); // 핏빛 어두운 붉은색
                bodyGrad.addColorStop(1, "#3d0000"); // 외곽 검붉은색
                ctx.fillStyle = bodyGrad;
                ctx.beginPath(); ctx.arc(0, 0, 150, 0, Math.PI * 2); ctx.fill();

                // 2. 박혀있는 작은 눈알들 그리기 함수
                function drawEmbeddedEye(ex, ey, eSize, angle) {
                    ctx.save();
                    ctx.translate(ex, ey); ctx.rotate(angle);
                    // 흰자위 (충혈됨)
                    ctx.fillStyle = "#ffcccc"; ctx.beginPath(); ctx.arc(0,0, eSize, 0, TWO_PI); ctx.fill();
                    // 홍채 (빨간색)
                    ctx.fillStyle = "#ff0000"; ctx.beginPath(); ctx.arc(0,0, eSize*0.6, 0, TWO_PI); ctx.fill();
                    // 동공 (검은색 찢어진 형태)
                    ctx.fillStyle = "#000000"; ctx.beginPath(); ctx.ellipse(0,0, eSize*0.2, eSize*0.5, 0, 0, TWO_PI); ctx.fill();
                    ctx.restore();
                }

                // 여러 위치에 눈알 배치
                drawEmbeddedEye(0, 0, 40, 0); // 중앙 큰 눈
                drawEmbeddedEye(70, 50, 25, 0.5);
                drawEmbeddedEye(-60, 80, 30, -0.8);
                drawEmbeddedEye(90, -40, 20, 1.2);
                drawEmbeddedEye(-80, -70, 28, 2.5);
                drawEmbeddedEye(40, -100, 22, -1.5);

                // 3. 외곽선 핏빛 발광
                ctx.shadowBlur = 60 * currentSkyAlpha; ctx.shadowColor = "#ff0000";
                ctx.strokeStyle = "rgba(255, 50, 50, 0.3)"; ctx.lineWidth = 8;
                ctx.beginPath(); ctx.arc(0, 0, 148, 0, TWO_PI); ctx.stroke();
                
                ctx.restore();

            } else {
                // (기존 맑은 날 달 코드 유지)
                let moonColor = [240, 240, 255];
                let moonGrad = ctx.createRadialGradient(moonX, moonY, 40, moonX, moonY, 150);
                moonGrad.addColorStop(0, `rgba(${moonColor[0]}, ${moonColor[1]}, ${moonColor[2]}, ${currentSkyAlpha * 0.3})`);
                moonGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = moonGrad;
                ctx.beginPath(); ctx.arc(moonX, moonY, 150, 0, Math.PI * 2); ctx.fill();

                ctx.shadowBlur = 30 * currentSkyAlpha; ctx.shadowColor = `rgb(${moonColor.join(',')})`; 
                ctx.fillStyle = `rgba(${moonColor.join(',')}, ${currentSkyAlpha})`; 
                ctx.beginPath(); ctx.arc(moonX, moonY, 40, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; 
            }
        }
    }
        
        let moonAngle = ((preciseHour + 6) / 24) * Math.PI * 2; 
        // [밤 시간 달 렌더링]
        if (preciseHour < 6 || preciseHour > 18) { 
            let moonX = W/2 - Math.cos(moonAngle) * W * 0.4; let moonY = H * 0.45 - Math.sin(moonAngle) * H * 0.35;
            let moonColor = currentWeather.id === "blood-moon" ? [255, 50, 50] : [240, 240, 255];
            let moonGrad = ctx.createRadialGradient(moonX, moonY, 40, moonX, moonY, 150);
            moonGrad.addColorStop(0, `rgba(${moonColor[0]}, ${moonColor[1]}, ${moonColor[2]}, ${currentSkyAlpha * 0.3})`);
            moonGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = moonGrad;
            ctx.beginPath(); ctx.arc(moonX, moonY, 150, 0, Math.PI * 2); ctx.fill();

            ctx.shadowBlur = 30 * currentSkyAlpha; ctx.shadowColor = `rgb(${moonColor.join(',')})`; 
            ctx.fillStyle = `rgba(${moonColor.join(',')}, ${currentSkyAlpha})`; 
            ctx.beginPath(); ctx.arc(moonX, moonY, 40, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; 
        } 
    }
    
    // --- 구름 로직 시작 ---
    if (GRAPHICS.showClouds) {
        // 1. 구름 개수 부드럽게 조절 (Lerp 비슷한 효과)
        if (clouds.length < targetCloudCount) {
            if (Math.random() < 0.1) { // 천천히 추가
                clouds.push({
                    x: Math.random() * WORLD_WIDTH, // 월드 전체에 랜덤 배치
                    y: Math.random() * H * 0.4,     // 하늘 위쪽에만
                    size: Math.random() * 80 + 50,
                    speed: Math.random() * 0.6 + 0.2
                });
            }
        } else if (clouds.length > targetCloudCount) {
            if (Math.random() < 0.1) clouds.pop(); // 천천히 제거
        }

        // 2. 구름 그리기
        const cc = targetCloudColor; 
        // 색상 적용 (부드러운 전환 없이 바로 적용해도 자연스러움)
        ctx.fillStyle = `rgba(${cc.r}, ${cc.g}, ${cc.b}, ${cc.a})`;

        for (let i = 0; i < clouds.length; i++) {
            let c = clouds[i];
            
            let renderX = c.x
            
            // 화면 밖 무한 루프 로직 (기존 유지)
            let modX = ((renderX % (W * 1.5)) + (W * 1.5)) % (W * 1.5) - 200;

            ctx.beginPath();
            ctx.arc(modX, c.y, c.size, 0, TWO_PI);
            ctx.arc(modX + c.size*0.7, c.y - c.size*0.3, c.size*0.8, 0, TWO_PI);
            ctx.arc(modX + c.size*1.4, c.y, c.size, 0, TWO_PI);
            ctx.fill();

            // 구름 이동 (바람 불면 더 빠르게)
            let windSpeed = (currentWeather.id === "wind" || currentWeather.id === "thunder") ? 3 : 1;
            c.x += c.speed * windSpeed;
        }
    }

    // =======================================================
    // ★ [수정됨] 배경 렌더링 (background.js 함수 호출)
    // =======================================================

    // 1. [아주 먼 배경] 맨 뒷산 뒤의 거대 기둥 (Depth: 0.1 ~ 0.16)
    
    // 2. [원경] 맨 뒷산 (Depth: 0.15)
    // 인자: ctx, layer, index, fogRgb, cameraX, currentParallaxY, currentSnow, currentFog, W, H, hours
    renderLand(ctx, landscapes[0], 0, fogRgb, cameraX, currentParallaxY, currentFog, W, H, biomeMgr);
    renderWeatherLayer(0.1, 0.2); 

    // 4. [중경 2] 앞산 (Depth: 0.35)
    renderLand(ctx, landscapes[1], 1, fogRgb, cameraX, currentParallaxY, currentFog, W, H, biomeMgr);
    renderWeatherLayer(0.2, 0.4); 

    // [나무 렌더링]
    if (GRAPHICS.showTrees) {
        renderTrees(ctx, 2, fogRgb, cameraX, currentParallaxY, currentFog, currentSnow, hours, globalRenderTime, currentWeather);
    }
    // 1. 근경 풀 (0.7) - 땅보다 먼저 그려서 뒤로 숨김 (심어진 느낌)
    if (GRAPHICS.showGrass) {
        // 맨 뒤에 0.7을 넣어서 근경 풀만 그립니다.
        renderGrass(ctx, fogRgb, cameraX, currentParallaxY, currentFog, currentSnow, windTime, currentWeather, hours, W, globalRenderTime, biomeMgr, 0.7);
    }

    // 6. [근경 2] 언덕 (Depth: 0.7)
    renderLand(ctx, landscapes[2], 2, fogRgb, cameraX, currentParallaxY, currentFog, W, H, biomeMgr);
    renderWeatherLayer(0.4, 0.7); 

    // 3. 플레이어 레이어 풀 (1.0) - 땅보다 먼저 그려서 뒤로 숨김
    if (GRAPHICS.showGrass) {
        // 맨 뒤에 1.0을 넣어서 플레이어 풀만 그립니다.
        renderGrass(ctx, fogRgb, cameraX, currentParallaxY, currentFog, currentSnow, windTime, currentWeather, hours, W, globalRenderTime, biomeMgr, 1.0);
    }

    if (globalRenderTime % 360 === 0) {
        
        // ★ [수정] 하드코딩 삭제! items.js의 consumableDB를 직접 사용합니다.
        // 현재 날씨 ID(heatwave 등)로 데이터를 찾고, 없으면 clear(태양의 열매)를 씁니다.
        let itemData = consumableDB[currentWeather.id] || consumableDB["clear"];
        
        // 화면 범위
        const viewLeft = cameraX - 100;
        const viewRight = cameraX + W + 100;
        
        // 아이템 개수 체크
        let visibleItems = activeSpawns.filter(p => p.x > viewLeft && p.x < viewRight).length;

        if (itemData && visibleItems < 2) {
            // 호스트 결정
            let hostArray = itemData.host === "tree" ? trees : grassBlades;
            
            // 화면 내 & 같은 깊이(1.0)의 호스트 찾기
            let candidates = hostArray.filter(h => {
                return h.layerDepth === 1.0 && h.baseX > viewLeft && h.baseX < viewRight;
            });

            if (candidates.length > 0) {
                let target = candidates[Math.floor(Math.random() * candidates.length)];
                
                if (!activeSpawns.some(s => s.hostId === target.id)) {
                    // 높이 계산
                    let spawnY = target.y || getGroundY(target.baseX);
                    let yOffset = (itemData.host === "tree") ? 150 : 20;

                    activeSpawns.push({
                        type: itemData.id, // 이제 items.js의 ID가 들어갑니다
                        hostId: target.id,
                        x: target.baseX, 
                        y: spawnY - yOffset, 
                        life: 2400, 
                        floatY: Math.random() * Math.PI,
                        color: itemData.color // items.js의 색상 사용
                    });
                }
            }
        }
    }

    // 2. 렌더링 로직 (기존과 동일, 유지)
    for (let i = activeSpawns.length - 1; i >= 0; i--) {
        // ... (이 부분은 아까와 동일하니 그대로 두셔도 됩니다) ...
        let p = activeSpawns[i];
        p.life--;
        p.floatY += 0.05;

        if (p.life <= 0 || p.x < cameraX - 1000 || p.x > cameraX + W + 1000) {
            activeSpawns.splice(i, 1);
            continue;
        }

        let renderY = p.y + Math.sin(p.floatY) * 5;
        
        ctx.save();
        ctx.translate(p.x, renderY);
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
        
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
        
        p.screenX = p.x - cameraX;
        p.screenY = renderY - currentParallaxY * 50;
    }

    // 8. [바닥] 플레이어가 밟는 땅 (Depth: 1.0)
    renderLand(ctx, landscapes[3], 3, fogRgb, cameraX, currentParallaxY, currentFog, W, H, biomeMgr);

    renderWeatherLayer(0.7, 1.0);
    
    // -------------------------------------------------------------------
    // ★ [수정됨] 플레이어 물리 (사망 시 조작 불가 + 부활 카운트)
    // -------------------------------------------------------------------
    
    // render() 함수 내의 플레이어 물리 로직 부분

    if (!player.isDead) {
        // --- [1단계: 잔상 수명 관리 (항상 실행)] ---
        // 대쉬가 끝난 후에도 잔상은 남아있어야 하므로 이동 로직 밖에서 처리합니다.
        for (let i = player.dashGhosts.length - 1; i >= 0; i--) {
            player.dashGhosts[i].opacity -= 0.02 * dtFactor; // 서서히 투명해짐
            if (player.dashGhosts[i].opacity <= 0) {
                player.dashGhosts.splice(i, 1); // 투명도가 0이면 삭제
            }
        }

        if (player.dashCooldown > 0) player.dashCooldown -= 1 * dtFactor;

        if (player.isDashing) {
            // --- [대쉬 중 상태] ---
            player.vx = player.facingRight ? player.dashSpeed : -player.dashSpeed;
            player.vy = 0;
            player.dashTimer -= 1 * dtFactor;

            // 2프레임마다 현재 위치를 배열에 저장 (이게 없으면 배열이 비어서 안 그려짐!)
            player.dashGhosts.push({
                x: player.x,
                y: player.y,
                facingRight: player.facingRight,
                opacity: 0.6
            });

            if (globalRenderTime % 2 === 0) {
                vfxParticles.spawnExplosion(player.x - cameraX, player.y - currentParallaxY * 50 - 50, "#fff", 3, 2);
            }

            if (player.dashTimer <= 0) {
                player.isDashing = false;
                player.vx *= 0.3;
            }
        } else {
            // --- [일반 모드: 걷기/점프] ---
            if (keys.left) { 
                player.vx -= player.accel * dtFactor; 
                player.facingRight = false; 
                if(player.isGrounded) player.walkFrame += 1 * dtFactor; 
            }
            if (keys.right) { 
                player.vx += player.accel * dtFactor; 
                player.facingRight = true; 
                if(player.isGrounded) player.walkFrame += 1 * dtFactor; 
            }
            if ((!keys.left && !keys.right) || !player.isGrounded) { player.walkFrame = 4; }

            player.vx = Math.max(-player.maxSpeed, Math.min(player.vx, player.maxSpeed));
            player.vx *= Math.pow(player.friction, dtFactor);
            player.vy += (player.gravity || 0.8) * dtFactor;
        }

        // 실제 위치 업데이트
        player.x += player.vx * dtFactor;
        player.y += player.vy * dtFactor;

        // ★ [수정됨] 이동 제한 구역 (절벽 앞에서 멈춤)
        // geography.js의 EDGE_BUFFER(3500) 값과 맞춰야 함
        const EDGE_LIMIT = 5000; 
        
        if (player.x < EDGE_LIMIT) {
            player.x = EDGE_LIMIT; 
            player.vx = 0; // 벽에 박으면 속도 0
        }
        if (player.x > WORLD_WIDTH - EDGE_LIMIT) {
            player.x = WORLD_WIDTH - EDGE_LIMIT;
            player.vx = 0;
        }

        // 지형 판정 (기존 유지)
        // 지형 판정 (Snap to Ground 적용)
        const currentGroundY = getGroundY(player.x);
        
        // [수정] 내리막길 판정 완화 (Sticky Ground Logic)
        // 땅과의 거리가 15px 이내라면, 점프 중이 아닐 때 강제로 땅에 붙임
        const SNAP_MARGIN = 15; 

        // 조건 1: 플레이어가 땅보다 아래에 있거나 (기존 로직)
        // 조건 2: 플레이어가 땅보다 살짝 위에 있지만(내리막길 등), 범위 안이고 && 위로 점프 중이 아닐 때(vy >= 0)
        if (player.y >= currentGroundY - SNAP_MARGIN && player.vy >= 0) {
            player.y = currentGroundY;  // 위치를 땅으로 고정
            player.vy = 0;              // 수직 속도 초기화
            player.isGrounded = true;   // 땅에 있음 판정
        } else { 
            player.isGrounded = false; 
        }

    } else {
        // --- [4. 사망 및 부활 로직: 기존 코드 그대로 유지] ---
        player.vx = 0; 
        player.walkFrame = 0;
        player.deathTimer -= dt;
        
        const dTimer = document.getElementById("respawn-timer");
        if (dTimer) dTimer.innerText = Math.max(0, player.deathTimer).toFixed(1);

        if (player.deathTimer <= 0) {
            player.isDead = false;
            player.hp = 100;
            player.x = WORLD_WIDTH / 2;
            player.y = getGroundY(player.x);
            player.vy = 0; // 부활 시 속도 초기화 추가
            player.invincibleTime = 180;
            player.noDamageTimer = -5;
            
            document.getElementById("death-overlay").style.display = "none";
            showSideNotification("SYSTEM REBOOT", "생체 신호 복구 완료.", "#69F0AE");
            updateProfileUI();
        }
    }

    // 카메라 스크롤 제어
    targetCameraX = Math.max(0, Math.min(player.x - W / 2, WORLD_WIDTH - W));
    cameraX += (targetCameraX - cameraX) * 0.1;
    let playerSlopeY = (player.y - H * 0.85) / 50; 
    targetParallaxY = mouseParallaxY + playerSlopeY;

    // -------------------------------------------------------------------
    // ★ [여기서부터 월드 좌표 적용] 모든 오브젝트가 카메라에 맞춰집니다.
    // -------------------------------------------------------------------
    ctx.save();
    ctx.translate(-cameraX, -currentParallaxY * 50); 

    // [★ 하이엔드 비주얼 업데이트] 투사체 렌더링 시스템
    ctx.save();
    let screenLeft = cameraX;
    let screenRight = cameraX + W;
    let fadeWidth = 150;

    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        
        // 레이저는 훨씬 더 짧게! (0.15초 내외로 사라짐)
        p.life -= (p.type === 3 || p.type === 6) ? 0.01 : 0.025; 
        
        p.x += p.vx || 0; 
        p.y += p.vy || 0;

        // ★ 핵심 3: 수명이 다하면 '렌더링'조차 하지 않고 즉시 배열에서 제거
        if (p.life <= 0) {
            projectiles.splice(i, 1);
            continue; // 삭제했으므로 아래 그리기 코드를 타지 않음
        }

        let px = isNaN(p.x) ? 0 : p.x;
        let py = isNaN(p.y) ? 0 : p.y;
        let size = isNaN(p.size) ? 30 : p.size;
        let color = p.color || "#FFF";
        let angle = p.angle || 0;
        
        // 화면 끝 페이드 아웃 계산
        let edgeAlpha = 1.0;
        if (px < screenLeft + fadeWidth) edgeAlpha = (px - screenLeft) / fadeWidth;
        else if (px > screenRight - fadeWidth) edgeAlpha = (screenRight - px) / fadeWidth;
        edgeAlpha = Math.max(0, Math.min(1, edgeAlpha));
        let finalAlpha = Math.max(0, p.life) * edgeAlpha;

        if (finalAlpha <= 0) {
            if (Math.abs(px - player.x) > W) projectiles.splice(i, 1);
            continue;
        }

        // ============================================================
        // ★ [여기가 핵심!] 그래픽 간소화 옵션 적용 구간
        // ============================================================
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.globalAlpha = finalAlpha;

        // 1. 간소화 모드가 아닐 때 (화려함 ON)
        if (!GRAPHICS.simpleProjectiles) {
            ctx.globalCompositeOperation = 'lighter'; // 눈부심 효과 켜기
            
            // 차원 베기(6)는 그림자 없으면 너무 밋밋하므로 예외
            // 그 외에는 그림자 켬
            if (p.type !== 6) { 
                ctx.shadowBlur = 15; 
                ctx.shadowColor = color;
            }
        } 
        // 2. 간소화 모드일 때 (성능 우선)
        else {
            ctx.globalCompositeOperation = 'source-over'; // 기본 덮어쓰기 (빠름)
            ctx.shadowBlur = 0; // 그림자 끄기 (매우 빠름)
        }

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

        ctx.restore(); // 투사체 그리기 끝

        // 제거 로직 (화면 밖 500px 이상 나가면 삭제)
        if (p.life <= 0 || px < screenLeft - 500 || px > screenRight + 500) {
            projectiles.splice(i, 1);
        }
    }
    ctx.restore();
    ctx.globalAlpha = 1.0; ctx.shadowBlur = 0;

    for (let i = iceSpikes.length - 1; i >= 0; i--) {
        let s = iceSpikes[i];
        
        // 1. 상태 업데이트 (크기 변화 및 투명도)
        s.life--;
        // 솟아오르는 애니메이션 (처음 10프레임)
        if (s.life > s.maxLife - 10) {
            s.height += s.maxHeight / 10;
        }
        // 사라지는 애니메이션 (마지막 10프레임)
        if (s.life < 10) {
            s.alpha = s.life / 10;
        } else {
            s.alpha = 1.0;
        }

        // 지형 높이 보정 (항상 땅 위에 붙어있게)
        let gY = getGroundY(s.x);
        
        // 2. 그리기 (뾰족한 얼음 결정)
        ctx.save();
        ctx.translate(s.x, gY);
        ctx.globalAlpha = s.alpha;
        
        // 얼음 색상 그라데이션
        let grad = ctx.createLinearGradient(0, 0, 0, -s.height);
        grad.addColorStop(0, "#ffffff"); // 뿌리
        grad.addColorStop(0.5, "#81D4FA"); // 중간
        grad.addColorStop(1, "#0288D1"); // 끝
        ctx.fillStyle = grad;
        
        ctx.beginPath();
        ctx.moveTo(-s.width/2, 0);
        ctx.lineTo(0, -s.height); // 뾰족한 끝
        ctx.lineTo(s.width/2, 0);
        ctx.fill();
        
        // 외곽선 (선명하게)
        ctx.strokeStyle = "#E1F5FE";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();

        // 3. 플레이어 충돌 판정 (데미지 & 넉백)
        if (!player.isDead && player.invincibleTime <= 0) {
            // 플레이어와의 거리 체크 (가시 범위: x ± width/2, y ~ y-height)
            // 가시가 플레이어 발 밑에서 솟아오르거나 닿았는지 확인
            if (Math.abs(player.x - s.x) < s.width && player.y > gY - s.height) {
                takeDamage(s.damage); // 데미지 입힘
                
                // 넉백 (가시 중심 기준으로 밀려남)
                player.vx = (player.x < s.x) ? -15 : 15;
                player.vy = -10;
            }
        }

        // 4. 수명 다하면 삭제
        if (s.life <= 0) {
            iceSpikes.splice(i, 1);
        }
    }

    for (const [id, pData] of Object.entries(otherPlayers)) {
        if (pData.x > cameraX - 100 && pData.x < cameraX + W + 100) {
            ctx.save();
            
            // ★ 내 화면에서의 이 유저 위치의 바닥 좌표를 계산
            const localGroundY = getGroundY(pData.x);
            // ★ 내 바닥 좌표 + 상대방이 보내준 높이 오프셋
            const renderY = localGroundY + (pData.yOffset || 0);

            ctx.translate(pData.x, renderY);

            if (pData.isGrounded === false) {
                ctx.scale(0.9, 1.1);
            }

            drawOtherPlayer(
                ctx, 
                pData, 
                globalRenderTime, 
                GRAPHICS,
                getGroundY 
            );
            
            ctx.restore();
        }
    }

    // =======================================================
    // ★ [수정] 머플러를 먼저 그려서 플레이어 '뒤'로 보냅니다.
    // =======================================================
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.shadowBlur = 5; ctx.shadowColor = "#ff416c";
    for(let j=0; j<2; j++) {
        ctx.lineWidth = j === 0 ? 10 : 5;
        ctx.strokeStyle = j === 0 ? "#8e0000" : "#ff416c";
        ctx.beginPath(); ctx.moveTo(player.scarfSegments[0].x, player.scarfSegments[0].y);
        for (let i = 1; i < player.scarfSegments.length; i++) ctx.lineTo(player.scarfSegments[i].x, player.scarfSegments[i].y);
        ctx.stroke();
    }

    // ==========================================
    // ★ [여기 수정] 잔상 그리기 (내 플레이어 뒤에 위치)
    // ==========================================
    const currentAura = allAuras.find(a => a.name === equippedAuraName);
    const auraColor = currentAura ? currentAura.color : "#ffffff";

    player.dashGhosts.forEach(g => {
        ctx.save();
        drawGhost(ctx, g, auraColor); // Renderer.js에 있는 drawGhost 호출
        ctx.restore();
    });

    // 4. 내 플레이어 

    // 2. 실제 내 플레이어 그리기 (이제 찌부시키는 scale 코드는 지우셔도 됩니다!)
    ctx.save();
    ctx.translate(player.x, player.y);

    // ★★★ [수정] 이렇게 변수들을 순서대로 넘겨줍니다!
    drawPlayer(
        ctx, 
        player, 
        globalRenderTime, 
        equippedAuraName, 
        myNickname, 
        GRAPHICS
    ); 
    
    ctx.restore();

    if (globalRenderTime % 60 === 0) {
        
        const getBiomeSimple = (x) => {
            if (x < 25000) return "SOUTH_EDGE";
            if (x < 50000) return "FROZEN_MOUNTAIN";
            if (x < 75000) return "CORRUPTED";
            if (x < 100000) return "ANCIENT_RUIN";
            if (x < 125000) return "CLIFFS";
            if (x < 175000) return "PLAINS";
            if (x < 200000) return "DESERT";
            if (x < 225000) return "BEACH";
            if (x < 250000) return "MAGIC_FOREST";
            if (x < 275000) return "FORGOTTEN_CITY";
            if (x < 300000) return "FAR_LANDS";
            return "NORTH_EDGE";
        };
        
        let currentBiome = getBiomeSimple(player.x);
        let currentWeatherId = currentWeather.id;

        // 1. 조건에 맞는 후보군 필터링
        let candidates = CRITTER_DB.filter(mob => {
            const cond = mob.spawnConditions;
            const biomeMatch = cond.biomes.includes("ALL") || cond.biomes.includes(currentBiome);
            const weatherMatch = cond.weathers.includes("ALL") || cond.weathers.includes(currentWeatherId);
            return biomeMatch && weatherMatch;
        });

        // 2. ★ 가중치 기반 랜덤 뽑기 (Weighted Random)
        if (candidates.length > 0 && critters.length < 6 && Math.random() < 0.25) {
            
            // 전체 가중치 합 계산 (spawnChance가 없으면 기본값 1.0)
            let totalWeight = candidates.reduce((sum, c) => sum + (c.spawnChance || 1.0), 0);
            let randomValue = Math.random() * totalWeight;
            let selectedMobData = null;

            for (let mob of candidates) {
                let weight = mob.spawnChance || 1.0;
                if (randomValue < weight) {
                    selectedMobData = mob;
                    break;
                }
                randomValue -= weight;
            }
            
            // 안전장치
            if (!selectedMobData) selectedMobData = candidates[0];

            let dir = Math.random() < 0.5 ? 1 : -1;
            let startX = player.x + (dir * (1200 + Math.random() * 600));
            startX = Math.max(1000, Math.min(startX, WORLD_WIDTH - 1000));

            const newMob = {
                id: Date.now() + Math.random(),
                x: startX, 
                y: getGroundY(startX),
                vx: 0, vy: 0, targetVx: 0,
                typeData: selectedMobData,
                hp: selectedMobData.hp,
                maxHp: selectedMobData.hp,
                hitTime: 0, life: 3600,
                animTime: Math.random() * 100,
                state: "idle", spawnTimer: 0
            };

            critters.push(newMob);
        }
    }

    for (let i = critters.length - 1; i >= 0; i--) {
        let c = critters[i];
        
        // 1. 기본 상태 업데이트 (수명, 애니메이션 시간, 무적 시간)
        c.life--; 
        c.animTime += 0.1;
        if (c.hitTime > 0) c.hitTime--;

        // ========================================================
        // ★ [핵심 변경] AI 판단 -> 물리 적용 (Logic 분리 완료)
        // ========================================================
        
        // ★ 이제 AI 업데이트 시에도 H를 던져줍니다.
        updateMobAI(c, player, H);  
        applyMobMovement(c, dt, H);
        // ★ 여기 추가: 플레이어 피격 판정 (몸박)
        if (!player.isDead && player.invincibleTime <= 0 && c.hp > 0) {
            let dist = Math.abs(player.x - c.x);
            let distY = Math.abs((player.y - 50) - c.y); // 플레이어 가슴 위치 기준
            
            // 거리가 가로 35, 세로 65 이내면 충돌
            if (dist < 35 && distY < 65) {
                let dmg = c.typeData.damage || 10;
                takeDamage(dmg); 

                // 충돌 시 플레이어를 넉백(뒤로 밀치기) 시킴
                player.vx = (player.x < c.x) ? -10 : 10;
                player.vy = -4; // 살짝 위로 띄움
            }
        }

        // 그리기 로직
        if (c.x > cameraX - 200 && c.x < cameraX + W + 200) { // 화면 근처에 있을 때만
            ctx.save();
            ctx.translate(-cameraX, -currentParallaxY * 50);
            const groundOffset = H - 1080;
            let bounce = (c.typeData.moveType === "hop") ? Math.abs(Math.sin(c.animTime)) * 10 : 0;
            ctx.translate(c.x, c.y + groundOffset - bounce);

            if (c.vx < 0) ctx.scale(-1, 1);
            drawCritter(ctx, c, globalRenderTime); // 그리기 실행
            ctx.restore();
        }

        // (3) 둥둥 떠다니는 몹(float)을 위한 시각적 바운스 추가
        // 물리 엔진은 위치만 잡아주므로, 둥실거리는 느낌은 여기서 살짝 더해줍니다.
        if (c.typeData.moveType === "float") {
             c.y += Math.sin(c.animTime) * 0.5;
        }
        // ========================================================

        // 2. 플레이어와 몬스터 충돌 (몸박) 감지
        if (player.invincibleTime <= 0 && c.hp > 0) {
            // x축 거리와 y축 거리(플레이어 키 고려) 계산
            let dist = Math.abs(player.x - c.x);
            let distY = Math.abs((player.y - 50) - c.y); 
            
            // 거리가 가까우면 피격 (가로 30, 세로 60 거리 내)
            if (dist < 30 && distY < 60) {
                // DB에 설정된 damage가 있으면 쓰고, 없으면 기본 10
                let dmg = c.typeData.damage || 10;
                takeDamage(dmg); 

                // 넉백 (플레이어가 몬스터보다 왼쪽에 있으면 왼쪽으로 튕김)
                player.vx = (player.x < c.x) ? -10 : 10;
            }
        }

        // 3. 수명이 다하면 제거 (화면 밖으로 너무 멀어져도 제거하는 로직은 applyMobMovement 내부나 여기서 추가 가능)
        if (c.life <= 0) { 
            critters.splice(i, 1); 
            continue; 
        }

        // [관통 시스템 적용] 투사체 충돌 판정 및 처리 루프
    for (let j = projectiles.length - 1; j >= 0; j--) {
        let p = projectiles[j];

        // 1. 유효성 검사 (수명, 화면 밖)
        if (p.life <= 0.1) continue;
        // 레이저(3, 6)는 길어서 화면 밖 시작점도 허용, 나머지는 화면 밖이면 연산 제외
        if (p.type !== 3 && p.type !== 6) {
                if (p.x < screenLeft || p.x > screenRight) continue;
        }

        // 2. 몬스터와의 충돌 체크
        for (let k = 0; k < critters.length; k++) {
            let c = critters[k];

            // [최적화] 화면 밖 몬스터는 연산 제외
            if (c.x < screenLeft - 100 || c.x > screenRight + 100) continue;

            // [꼼수 방지] 플레이어로부터 너무 먼 적(1300px 이상)은 절대 맞지 않음
            if (Math.abs(c.x - player.x) > 1300) continue;

            // 피격 무적 상태면 패스
            if (c.hitTime > 0) continue;

            // [관통 체크] 티어 5이고, 이미 맞은 적이면 패스
            if (p.type === 5 && p.hitMobiles && p.hitMobiles.includes(c.id)) continue;

            let isHit = false;
            const cSize = Number(c.typeData.size) || 15;

            // A. 레이저/차원베기 충돌 판정 (선분)
            if (p.type === 3 || p.type === 6) {
                let x2 = p.x + Math.cos(p.angle) * (p.length || 1000);
                let y2 = p.y + Math.sin(p.angle) * (p.length || 1000);
                let dist = distToSegment({x: c.x, y: c.y}, {x: p.x, y: p.y}, {x: x2, y: y2});
                if (dist < (p.width || 100) / 2 + cSize) isHit = true;
            } 
            // B. 일반 투사체 및 차크람 충돌 판정 (원형)
            else {
                let distSq = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
                let radiusSum = cSize + (p.size || 20);
                if (distSq < radiusSum * radiusSum) isHit = true;
            }

            if (isHit) {
                // 1. [에러 해결] 현재 장착 중인 오라 정보 가져오기
                const aura = allAuras.find(a => a.name === equippedAuraName);
                // 1. 데미지 계산을 '먼저' 해야 합니다! (ReferenceError 방지)
                let baseDamage = (p.rarity || 1) / 10;
                if(p.type === 1) baseDamage *= 0.5;
                if(p.type === 2) baseDamage *= 0.4;
                if(p.type === 3) baseDamage *= 0.4;
                if(p.type === 4) baseDamage *= 0.25;
                if(p.type === 5) baseDamage *= 0.5;
                if(p.type === 6) baseDamage *= 1;

                let variance = 0.8 + Math.random() * 0.4; 
                let finalDamage = baseDamage * variance; // ✅ 이제 사용 준비 완료
                let isCrit = variance > 1.1;

                // 2. 이후에 몬스터 HP 감소 및 텍스트 출력
                c.hp -= finalDamage; 
                c.hitTime = 10; 
                c.x += Math.cos(p.angle || 0) * 5;

                if (isCrit) playSound('hit_crit');
                else playSound('hit_normal');

                spawnDamageText(c.x - cameraX, c.y - currentParallaxY * 50 - 40, finalDamage, isCrit);

                if (c.hp <= 0 && !c.alreadyDead) {
                    c.alreadyDead = true; 

                    // 공격의 주인(ownerId)이 나(socket.id)인 경우에만 보상 지급
                    if (p.ownerId === socket.id) {
                        playSound('star');
                        let drop = c.typeData.drop;
                        consumableInv[drop] = (consumableInv[drop] || 0) + 1;
                        spawnItemLog(drop);

                        let xpGain = c.typeData.xp || 10;
                        
                        addExp(xpGain);

                        damageLabels.push({
                            x: c.x - cameraX, 
                            y: c.y - currentParallaxY * 50 - 140,
                            text: `+${xpGain.toLocaleString()} XP`, // 텍스트
                            life: 2.5, vy: -0.5, scale: 1.3,
                            customColor: "#00E5FF"
                        });
                    }
                    const shardColor = aura ? aura.color : "#FFD700"; 
                    spawnRewardShards(c.x, c.y, shardColor, 10);
                    c.shouldRemove = true; 
                }

                // 4. 투사체 소멸 처리
                if (p.type === 5) {
                    if (!p.hitMobiles) p.hitMobiles = [];
                    p.hitMobiles.push(c.id);
                } else if (p.type !== 3 && p.type !== 6) {
                    p.life = 0; 
                }
                
                break; 
            }
        } // 몬스터 루프 끝
    }

        // [수정] 몬스터 사망 처리 (비선형 경험치 적용 + XP 텍스트 최적화)
        if (c.hp <= 0) {

                if (!GRAPHICS.simpleProjectiles) vfxParticles.spawnExplosion(c.x - cameraX, c.y - currentParallaxY * 50, c.typeData.color, 5, 8);
                critters.splice(i, 1); continue;
        }
        if (c.x > cameraX - 50 && c.x < cameraX + W + 50) {
            let bounce = (c.typeData.moveType === "hop") ? Math.abs(Math.sin(c.animTime)) * 10 : 0;
            
            // UI 높이 계산
            let hRatio = c.typeData.uiHeight || 3.0;
            let uiY = -(c.typeData.size * hRatio); 
            
            ctx.save();
            ctx.translate(c.x, c.y - bounce);

            // 1. 이름표 그리기: 삭제됨 (요청사항 반영)
            // 데이터(c.typeData.name)는 남아있지만 화면엔 안 그림

            // 2. HP 바 (체력이 깎였을 때만 표시)
            if (c.hp < c.maxHp) {
                let hpPct = Math.max(0, c.hp / c.maxHp);
                
                // 배경 (반투명 검정)
                ctx.fillStyle = "rgba(0,0,0,0.6)"; 
                ctx.fillRect(-15, uiY, 30, 4); 

                // 체력 (초록 -> 빨강)
                ctx.fillStyle = hpPct > 0.4 ? "#38ef7d" : "#ff416c"; 
                ctx.fillRect(-15, uiY, 30 * hpPct, 4); 
            }

            // 3. 몬스터 본체 그리기
            if (c.vx < 0) ctx.scale(-1, 1);
            drawCritter(ctx, c, globalRenderTime);
            
            ctx.restore();
            
            c.screenX = c.x - cameraX; 
            c.screenY = c.y - bounce - currentParallaxY * 50; 
        }
    }

    ctx.restore(); // 월드 좌표계 끝!
    // -------------------------------------------------------------------

    renderShootingStars(ctx);
    renderLightning(ctx);
    renderSpawns(ctx);
    vfxParticles.updateAndDraw(ctx); 

    if (GRAPHICS.showBiomeVFX) {
        biomeVFX.update(player.x, W, H, currentWeather.id); 
        
        biomeVFX.draw(ctx, W, H);
    }

    // ==========================================
    // ★ 조각 연출 업데이트 및 렌더링
    // ==========================================
    ctx.save();
    // 월드 좌표계 적용 (카메라 보정)
    ctx.translate(-cameraX, -currentParallaxY * 50);

    for (let i = rewardShards.length - 1; i >= 0; i--) {
        let s = rewardShards[i];

        // 1. 유도탄 로직: 캐릭터 방향 벡터 계산
        let dx = player.x - s.x;
        let dy = (player.y - 50) - s.y; // 캐릭터 가슴팍으로 유도
        let dist = Math.hypot(dx, dy);

        // 2. 물리 엔진: 처음엔 폭발했다가 점점 캐릭터에게 가속
        if (dist > 20) {
            s.vx += (dx / dist) * 1.5; // 캐릭터 방향 가속도
            s.vy += (dy / dist) * 1.5;
            s.vx *= 0.92; // 마찰력 (부드러운 커브)
            s.vy *= 0.92;
        }

        s.x += s.vx;
        s.y += s.vy;

        // 3. 조각 그리기 (빛나는 다이아몬드 형태)
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - 4);
        ctx.lineTo(s.x + 4, s.y);
        ctx.lineTo(s.x, s.y + 4);
        ctx.lineTo(s.x - 4, s.y);
        ctx.fill();

        // 4. 캐릭터와 충돌 시 제거 (흡수 완료)
        if (dist < 30) {
            rewardShards.splice(i, 1);
            // 여기서 짤랑! 하는 사운드 하나 넣어주면 최고입니다.
            // playSound('collect'); 
        }
    }
    ctx.restore();

    // ★ [신규] 데미지 텍스트 렌더링 (메이플 스타일)
    for (let i = damageLabels.length - 1; i >= 0; i--) {
        let d = damageLabels[i];
        d.life -= 0.02 * dtFactor; // 서서히 사라짐
        d.y += d.vy * dtFactor;    // 위로 둥실 떠오름
        d.vy += 0.1 * dtFactor;    // 중력 적용 (살짝 느려짐)

        if (d.life <= 0) { damageLabels.splice(i, 1); continue; }

        ctx.save();
        ctx.translate(d.x, d.y);
        
        // 크리티컬이면 팝업 효과 (커졌다 작아짐)
        let scale = d.scale;
        if (d.isCrit && d.life > 0.8) scale *= 1.2; 
        ctx.scale(scale, scale);

        ctx.globalAlpha = Math.min(1, d.life * 2); // 끝에 가서 투명해짐
        
        // 폰트 설정 (메이플 느낌 나는 굵은 폰트)
        ctx.font = "900 24px 'Rajdhani', sans-serif";
        ctx.textAlign = "center";
        
        // 외곽선 (가독성 UP)
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.strokeText(d.text, 0, 0);

        // [수정] 글자 색상 (커스텀 색상(XP) 지원 추가)
        // d.customColor가 있으면 그걸 쓰고, 없으면 크리티컬/일반 색상 사용
        ctx.fillStyle = d.customColor ? d.customColor : (d.isCrit ? "#FF5252" : "#FFF176");
        
        ctx.fillText(d.text, 0, 0);
        
        // (선택사항) 'CRITICAL!' 텍스트 추가
        if (d.isCrit) {
            ctx.font = "bold 12px sans-serif";
            ctx.fillStyle = "#FFD700";
            ctx.fillText("CRITICAL!", 0, -20);
        }

        ctx.restore();
    }

    let fogAlpha = currentWeather.id === "foggy" ? Math.min(0.5, currentFog) : (currentFog * 0.3);
    DOM.fogOverlay.style.background = `rgba(${fogRgb[0]}, ${fogRgb[1]}, ${fogRgb[2]}, ${fogAlpha})`; 
    
    if (GRAPHICS.showAmbientParticles) {
        let ambientColor = (hours < 6 || hours > 18) ? "#b3e5fc" : (currentWeather.id === "clear" ? "#FFD700" : "#ffffff");
        ctx.fillStyle = ambientColor;
        window.ambientParticles.forEach(p => {
            p.x += p.vx + (currentWeather.id === "wind" ? 2 : 0); 
            p.y += p.vy;
            if(p.x < 0) p.x = W; if(p.x > W) p.x = 0; if(p.y < 0) p.y = H; if(p.y > H) p.y = 0;
            ctx.globalAlpha = p.alpha * (0.3 + Math.sin(globalRenderTime * 0.02 + p.x) * 0.2);
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
    }
    ctx.globalAlpha = 1.0;

    // 내 현재 바닥 위치와의 차이를 계산 (공중에 있으면 음수, 바닥이면 0)
    const yOffset = player.y - getGroundY(player.x);

    socket.emit('playerMove', { 
        x: player.x, 
        yOffset: yOffset,
        isDashing: player.isDashing, // ★ 추가
        vx: player.vx, 
        facingRight: player.facingRight, 
        isGrounded: player.isGrounded,
        aura: equippedAuraName || "COMMON", 
        nickname: myNickname 
    });

    if (globalRenderTime % 10 === 0) {
        biomeMgr.update(player.x); 
    }

    biomeMgr.update(player.x); 

    const currentBiome = getPlayerBiome(player.x);
    const turbulence = document.getElementById("heat-turbulence");
    const displacement = document.querySelector("#heatwave-filter feDisplacementMap"); // 왜곡 강도 조절용
    const gameCanvas = document.getElementById("game-canvas");
    const vfxCanvas = document.getElementById("vfx-canvas");

    // 1. 아지랑이 (Heat Haze) 로직
    // 기본적으로 끔
    let heatScale = 0; 
    let heatBaseFreqY = 0.006;
    let isHeatActive = false;

    // (A) 사막 지역: 기본적으로 약한 아지랑이 (scale 3)
    if (currentBiome === "DESERT") {
        heatScale = 3;
        isHeatActive = true;
        
        // 사막 + 폭염 날씨면 강도 2배 (기본 6 -> 12)
        if (currentWeather.id === "heatwave") {
            heatScale = 12; // 매우 강력함
        }
    } 
    // (B) 그 외 지역: 폭염 날씨일 때만 작동 (scale 6)
    else if (currentWeather.id === "heatwave") {
        // 설산에선 폭염 효과 무효화
        if (currentBiome !== "FROZEN_MOUNTAIN") {
            heatScale = 6;
            isHeatActive = true;
        }
    }

    // 필터 적용 로직
    if (isHeatActive && turbulence && displacement) {
        // 클래스 켜기
        gameCanvas.classList.add("heatwave-active");
        if(vfxCanvas) vfxCanvas.classList.add("heatwave-active");

        // 왜곡 강도 실시간 적용
        displacement.setAttribute("scale", heatScale);

        // 아지랑이 애니메이션
        let shift = Math.sin(globalRenderTime * 0.005) * 0.002; 
        turbulence.setAttribute("baseFrequency", `0.015 ${0.02 + shift}`);
    } else {
        // 끄기
        gameCanvas.classList.remove("heatwave-active");
        if(vfxCanvas) vfxCanvas.classList.remove("heatwave-active");
    }

    // 2. 폭풍 및 안개 (Storm Fog) 로직
    // 기본 안개 색
    let targetFogRgb = [200, 210, 220]; 
    let stormIntensity = 0;

    if (currentBiome === "DESERT") {
        if (currentWeather.id === "wind") {
            targetFogRgb = [180, 160, 120]; // 칙칙한 모래색 (너무 쨍한 노랑 X)
            
            // ★ 개선: 단순히 0.6으로 덮는 게 아니라, 바람 강약에 따라 0.2 ~ 0.4로 출렁임
            // 이러면 시야가 보였다 안 보였다 하면서 "모래가 휩쓸고 지나가는" 느낌이 남
            stormIntensity = 0.25 + Math.sin(globalRenderTime * 0.05) * 0.15;
        }
        // 폭염이나 맑음일 때는 필터 없음 (깨끗하게 아지랑이만)
    }
    
    // (B) 설산 눈보라 (Blizzard)
    else if (currentBiome === "FROZEN_MOUNTAIN") {
        // 눈이나 바람일 때 화이트아웃 현상
        if (currentWeather.id === "snow" || currentWeather.id === "wind") {
            targetFogRgb = [230, 240, 255]; // 차가운 흰색
            // 눈보라는 좀 더 진하게 (0.4 ~ 0.6)
            stormIntensity = 0.5 + Math.sin(globalRenderTime * 0.02) * 0.1;
        }
    }
    
    // (C) 일반 안개 (Foggy)
    else if (currentWeather.id === "foggy") {
        stormIntensity = 0.5;
    }

    // 안개 적용 (DOM 요소 스타일 변경)
    DOM.fogOverlay.style.background = `rgba(${targetFogRgb[0]}, ${targetFogRgb[1]}, ${targetFogRgb[2]}, ${stormIntensity})`;

    requestAnimationFrame(render); 
}
render();

// 💡 [신규] 자동 롤 기능 토글
window.toggleAutoRoll = function() {
    playSound('click');
    isAutoRolling = !isAutoRolling;
    const btn = document.getElementById("auto-roll-btn");
    
    if (isAutoRolling) {
        btn.classList.add("active");
        btn.innerText = "🤖 AUTO ROLL: ON";
        console.log("♻️ 자동 롤 시작!");
        if (!isRolling) document.getElementById("roll-btn").click(); // 바로 시작
    } else {
        btn.classList.remove("active");
        btn.innerText = "🤖 AUTO ROLL: OFF";
        clearTimeout(autoRollTimer);
        console.log("🛑 자동 롤 중지.");
    }
};

// 💡 [신규] 설정값 업데이트 함수
window.updateAutoThresholds = function() {
    const thresholds = [0, 100, 1000, 10000, 100000, 1000000, 10000000];
    const labels = ["OFF", "100", "1,000", "10,000", "100,000", "1,000,000", "10,000,000"];
    
    let scrapIdx = document.getElementById("auto-scrap-slider").value;
    let stopIdx = document.getElementById("auto-stop-slider").value;

    autoScrapThreshold = thresholds[scrapIdx];
    autoStopThreshold = thresholds[stopIdx];

    document.getElementById("auto-scrap-label").innerText = `자동 분해: ${scrapIdx == 0 ? "OFF" : labels[scrapIdx] + " 미만 분해"}`;
    document.getElementById("auto-stop-label").innerText = `자동 정지: ${stopIdx == 0 ? "OFF" : labels[stopIdx] + " 이상 정지"}`;
};

function getRollResult() {
    // ★ [기믹 4] 글리치 날씨일 때는 글리치 조건부 오라도 포함
    let available = allAuras.filter(a => a.condition === "all" || a.condition === currentWeather.id);
    available.sort((a, b) => b.chanceX - a.chanceX);
    for (let aura of available) {
        let adjustedChance = Math.max(1, aura.chanceX / globalLuckMultiplier);
        if (Math.random() * adjustedChance < 1) return aura;
    }
    return allAuras.find(a => a.name === "COMMON") || available[available.length - 1];
}

function applyAuraStyle(aura) {
    if(!aura) return;
    document.getElementById("aura-text").textContent = aura.name;
    document.getElementById("aura-text").style.color = aura.color;
    document.getElementById("aura-text").style.textShadow = aura.glow;
    document.getElementById("odds-text").textContent = `1 in ${aura.chanceX.toLocaleString()}`;
}

function spawnRewardShards(startX, startY, color, count = 10) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // 🔹 속도 하향: 5~15에서 2~7 정도로 조절
        const speed = 2 + Math.random(1, 2) * 3; 
        
        rewardShards.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed, // 위로 튀는 힘도 살짝 하향
            color: color,
            // 🔹 크기 추가: 6~10픽셀 사이의 랜덤한 크기
            size: 6 + Math.random() * 4, 
            life: 1.0,
            target: player
        });
    }
}

// ========================================================
// ★ [수정됨] spin 함수: 연출 실행 로직을 싹 비우고, 결과창 함수로 토스만 합니다.
// ========================================================
function spin() { 
    // 회전 속도 조절 (점점 느려지게)
    let spinTime = 0; 
    let currentDelay = 15; 
    const MAX_SPIN_TIME = 2000; 
    
    // 내부 루프 함수
    function loop() {
        if (spinTime >= MAX_SPIN_TIME / globalSpeedMultiplier) { 
            sfxSpin.pause(); 
            sfxSpin.currentTime = 0; 

            // ★ [핵심 변경] 여기서 if(chance > ...) 로 연출을 직접 부르지 않습니다.
            // 무조건 showFinalResult로 넘기고, 거기서 판단하게 합니다.
            // false를 넘겨서 "스킵 안 함(연출 보여줘)" 신호를 보냅니다.
            
            // 단, 사용자가 설정한 '스킵 기준'보다 낮으면 바로 스킵 모드(true)로 보냅니다.
            let shouldSkip = (currentResult.chanceX < skipThreshold);
            showFinalResult(shouldSkip);
            return; 
        } 

        // 룰렛 돌아가는 동안 텍스트 랜덤 변경
        if (currentDelay > 30 || globalRenderTime % 2 === 0) {
            let dummyAura = allAuras[Math.floor(Math.random() * allAuras.length)];
            applyAuraStyle(dummyAura);
        }
        
        spinTime += currentDelay; 
        currentDelay *= 1.15; 
        setTimeout(loop, currentDelay); 
    }
    loop(); 
}

function showFinalResult(skipVfx = false) { 
    // 1. 가짜 연출(Fake Out) 체크 - 이제 전역 변수라 작동함
    if (!skipVfx && isFakeOut && fakeTargetAura) {
        setUIVisibility(false);
        fadeOutBGM();
        playSound('glitch');
        shakeIntensity = 50; applyScreenShake();
        
        const gOverlay = document.getElementById("glitch-overlay");
        const aText = document.getElementById("aura-text");
        if(gOverlay) gOverlay.style.opacity = 1;
        if(aText) aText.classList.add("glitch-text");

        setTimeout(() => {
            if(gOverlay) gOverlay.style.opacity = 0;
            if(aText) aText.classList.remove("glitch-text");
            currentResult = fakeTargetAura; 
            isFakeOut = false; 
            fakeTargetAura = null;
            showFinalResult(false); // 가짜 연출 후 진짜 결과 보여주기
        }, 800);
        return;
    }

    // 2. 스킵 여부 결정 
    // (자동 롤 중이어도 설정한 skipThreshold보다 높은 등급이면 연출을 보여줌)
    if (skipVfx) {
        setUIVisibility(true);
        const stage = document.getElementById("stage");
        if(stage) stage.style.opacity = 1;
        
        restoreBGM(); 
        applyResultLogic();
        return;
    }

    // 3. 연출 실행 (고등급 아이템)
    setUIVisibility(false);
    fadeOutBGM();
    const stage = document.getElementById("stage");
    if(stage) stage.style.opacity = 0; 

    const onFinish = () => showFinalResult(true);

    if (currentResult.chanceX >= 100000000) { // 1억 이상
        triggerApocalypseVFX(vfxCtx, W, H, currentResult, vfxCallbacks, onFinish);
    } else if (currentResult.chanceX >= 10000000) { // 1천만 이상
        triggerMeteorVFX(vfxCtx, W, H, currentResult, vfxCallbacks, onFinish);
    } else if (currentResult.chanceX >= 1000) { // 1천 이상 (에픽)
        playSound('reveal');
        triggerEpicVFX(vfxCtx, W, H, currentResult, vfxCallbacks);
        setTimeout(() => { 
            shakeIntensity = 20; applyScreenShake(); 
            if(typeof vfxParticles !== 'undefined') vfxParticles.spawnExplosion(W/2, H/2-100, currentResult.color, 50, 15); 
            onFinish(); 
        }, 1500); 
    } else {
        onFinish();
    }
}

function applyResultLogic() {
    if (!currentResult) return;

    // 1. 텍스트/스타일 적용 (main.js에 이 함수가 있어야 함, 없으면 아래 4번 참고)
    applyAuraStyle(currentResult); 
    const oddsText = document.getElementById("odds-text");
    if(oddsText) oddsText.style.display = "block";

    // 2. 경험치 지급
    let xpGain = 10 + Math.ceil(Math.sqrt(currentResult.chanceX));
    addExp(xpGain);

    // 3. 자동 모드 로직
    if (isAutoRolling) {
        // 자동 정지 조건
        if (autoStopThreshold > 0 && currentResult.chanceX >= autoStopThreshold) {
            toggleAutoRoll();
            alert(`🎉 [자동 정지] 목표 등급 이상(${currentResult.name})을 획득했습니다!`);
            document.getElementById("btn-keep").style.display = "block"; 
            document.getElementById("btn-discard").style.display = "block"; 
            return; 
        }

        // 자동 분해 조건
        if (autoScrapThreshold > 0 && currentResult.chanceX < autoScrapThreshold) {
            let frags = Math.max(1, Math.ceil(currentResult.chanceX / 10));
            fragments += frags; 
            addExp(frags * 0.5); // 분해 경험치
            document.getElementById("currency-display").textContent = `✨ Stella Fragment: ${fragments.toLocaleString()}`;
        } else {
            inventory.push(currentResult);
        }

        isRolling = false; 
        autoRollTimer = setTimeout(() => {
            if(isAutoRolling) document.getElementById("roll-btn").click();
        }, 500); 
    } 
    // 4. 수동 모드: 버튼 표시
    else {
        const btnKeep = document.getElementById("btn-keep");
        const btnDiscard = document.getElementById("btn-discard");
        if(btnKeep) btnKeep.style.display = "block";
        if(btnDiscard) btnDiscard.style.display = "block";
    }
}

// ========================================================
// 2. 버튼 누른 후 초기화 함수 (이게 없으면 다음 롤이 안 돌아감)
// ========================================================
function resetRollState() { 
    isRolling = false; // ★ 핵심: 구르는 상태 해제
    document.getElementById("btn-keep").style.display = "none"; 
    document.getElementById("btn-discard").style.display = "none"; 
    document.getElementById("roll-btn").style.display = "block"; 
    document.getElementById("odds-text").style.display = "none"; 
    document.getElementById("aura-text").textContent = "Press Button To Roll..."; 
    document.getElementById("aura-text").style.color = "white"; 
    document.getElementById("aura-text").style.textShadow = "none"; 
}

// [수정] 저장 버튼 (데이터만 넣고 끝! 화면 갱신 안 함 -> 엄청 빠름)
document.getElementById("btn-keep").addEventListener("click", () => { 
    if (!currentResult) return;
    playSound('success'); 
    
    // 데이터만 쏙 넣음
    inventory.push(currentResult); 
    
    // 알림만 띄워줌 (사용자 피드백)
    spawnItemLog(currentResult.name); // (이 함수가 없다면 생략 가능)
    
    resetRollState(); 
});

// [수정] 분해 버튼 (돈만 올리고 끝!)
document.getElementById("btn-discard").addEventListener("click", () => { 
    if (!currentResult) return;
    playSound('click'); 
    
    // 돈 계산 및 추가
    let frags = Math.max(1, Math.ceil(currentResult.chanceX / 10));
    fragments += frags; 

    // ★ [추가] 즉시 분해 경험치
    addExp(frags * 0.5);
    
    // ★ 상단 돈(Fragments) 표시는 항상 보여야 하니까 이것만 갱신
    document.getElementById("currency-display").textContent = `✨ Stella Fragment: ${fragments.toLocaleString()}`;
    
    resetRollState(); 
});

// main.js 내의 startRoll 함수를 찾아서 교체하세요.
function startRoll() {
    if (isRolling) return; 
    isRolling = true; 

    comboCount++;
    comboTimeLeft = 300; 
    document.getElementById("combo-display").style.display = "block";
    document.getElementById("combo-count").innerText = `${comboCount} COMBO!`;
    document.getElementById("combo-message").innerText = `Keep Rolling!`;
    if (comboCount === 50 && !isFeverTime) triggerFeverTime();

    document.getElementById("roll-btn").style.display = "none"; 
    document.getElementById("odds-text").style.display = "none"; 
    
    // 사운드 로드 오류 방지를 위한 안전 장치
    try { playSound('roll'); } catch(e) {}
    try { playSound('spin'); } catch(e) {}

    currentResult = getRollResult(); 
    
    // ★ 전역 변수 초기화 (중요)
    isFakeOut = false; 
    fakeTargetAura = null;
    
    // ★ [오류 해결 포인트] fakeChance 변수를 여기서 다시 정의해줍니다.
    let fakeChance = isFeverTime ? 0.001 : 0.0002; 

    // 가짜 연출 로직 (1/1000 확률 정도로 글리치 발생)
    if (currentResult.chanceX <= 25 && Math.random() < fakeChance) {
        isFakeOut = true;
        let glitchLuckMultiplier = globalLuckMultiplier * 10000; 
        let available = allAuras.filter(a => a.condition === "all" || a.condition === currentWeather.id);
        available.sort((a, b) => b.chanceX - a.chanceX);
        for (let aura of available) {
            let adjustedChance = Math.max(1, aura.chanceX / glitchLuckMultiplier);
            if (Math.random() * adjustedChance < 1) { 
                fakeTargetAura = aura; 
                break; 
            }
        }
        if (!fakeTargetAura) fakeTargetAura = available[0];
    }

    let spinTime = 0, currentDelay = 15; const MAX_SPIN_TIME = 2000; 
    function loop() {
        if (spinTime >= MAX_SPIN_TIME / globalSpeedMultiplier) { 
            stopSound('spin'); 
            // 사용자가 설정한 스킵 기준보다 낮으면 바로 결과창으로
            let shouldSkip = (currentResult.chanceX < skipThreshold);
            showFinalResult(shouldSkip);
            return; 
        } 
        if (currentDelay > 30 || globalRenderTime % 2 === 0) {
            let dummyAura = allAuras[Math.floor(Math.random() * allAuras.length)];
            applyAuraStyle(dummyAura);
        }
        spinTime += currentDelay; 
        currentDelay *= 1.15; 
        setTimeout(loop, currentDelay); 
    }
    loop(); 
}

window.onload = () => {
    resetBrowserZoom(); // ★ 일단 100%로 맞추고 시작

    // 1. 스타트 버튼 연결 (가장 중요)
    const startBtn = document.getElementById("start-btn");
    const startScreen = document.getElementById("start-screen");

    if (startBtn) {
        // 기존 리스너 날리고 새로 생성 (중복 방지)
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);

        newBtn.addEventListener("click", () => {

            // (1) 오디오 재생
            try {
                if (bgmPlayer && bgmPlayer.paused) { 
                    bgmPlayer.play().catch(() => {});
                    if(weatherSfxPlayer) weatherSfxPlayer.play().catch(() => {});
                }
            } catch(e) {}
            
            // (2) 전체화면
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) docEl.requestFullscreen().catch(()=>{});
            else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen(); 

            // (3) 화면 제거
            if (startScreen) {
                startScreen.style.opacity = 0;
                setTimeout(() => { startScreen.style.display = "none"; }, 500);
            }
            
            // (4) 리사이즈
            setTimeout(() => { if(typeof forceResize === 'function') forceResize(); }, 100);
        });
    } else {
        console.error("❌ start-btn을 찾을 수 없습니다.");
    }

    // 2. 모바일 환경 설정
    if (IS_MOBILE) {
        GRAPHICS.weatherDensity = 0.2;      
        GRAPHICS.showGrass = false;        
        GRAPHICS.showClouds = false;       
        GRAPHICS.showOtherAttacks = false; 
        GRAPHICS.showFireflies = false;    
        GRAPHICS.fancyGraphics = false;    
        GRAPHICS.simpleProjectiles = true; 
        GRAPHICS.simpleAuras = true;        
        GRAPHICS.simpleMobs = true;        
        
        const mControls = document.getElementById("mobile-controls");
        if (mControls) {
            mControls.style.display = "flex"; 
            mControls.classList.remove("ui-hidden");
        }

        if (typeof initMobileControls === 'function') {
            initMobileControls();
        }
    }

    // 3. 게임 데이터 로드
    loadGame(); 
    
    window.addEventListener('refreshInventory', () => {
        if (typeof renderConsumableList === 'function') {
            renderConsumableList(consumableInv); // 최신 데이터로 다시 그리기
        }
    });

    // 초기 구름 생성
    for(let i=0; i<5; i++) { // 개수는 5개 정도가 적당
        clouds.push({
            x: Math.random() * W, 
            y: Math.random() * H * 0.3, 
            
            // ★ [수정] 여기도 똑같이 키움
            size: Math.random() * 50 + 60,
            
            speed: Math.random() * 0.4 + 0.1
        });
    }

    // 4. 초기 날씨 설정
    currentWeather = weathers.find(w => w.id === "clear");
    if(document.getElementById("weather-display")) document.getElementById("weather-display").innerText = currentWeather.name;
    if(bgmPlayer) bgmPlayer.src = currentWeather.music;
    if(weatherSfxPlayer) weatherSfxPlayer.src = currentWeather.sfx;
    
    targetFog = 0; targetSnow = 0; targetParticleCount = 0;
    
    if(typeof calcBuffs === 'function') calcBuffs();
    if(typeof forceResize === 'function') forceResize();

    // 5. 리사이즈 이벤트 연결
    window.addEventListener('resize', forceResize);
    window.addEventListener('orientationchange', () => { setTimeout(forceResize, 200); });
};

// ==========================================
// ★ [필수] 데이터 증발 방지 안전장치
// ==========================================

// 1. PC: 창을 닫거나 새로고침(F5) 할 때
window.addEventListener("beforeunload", () => {
    saveGame();
});

// 2. 모바일: 홈 화면으로 나가거나 다른 앱으로 전환할 때 (가장 중요!)
// 모바일 브라우저는 beforeunload가 안 먹힐 때가 많아서 이게 필수입니다.
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden') {
        saveGame();
    }
});

// ===============================================================
// [최종] 전역 연결 (HTML onclick이 찾을 수 있게)
// ===============================================================

// 1. main.js에서 정의한 함수들 연결
window.toggleModal = toggleModal;
window.toggleQuickBar = toggleQuickBar;
window.toggleChat = toggleChat;
window.toggleRollBottom = toggleRollBottom;
window.useConsumable = useConsumable;
window.craftPotion = craftPotion;
window.craftGear = craftGear;
window.toggleEquipAura = toggleEquipAura;
window.scrapAura = scrapAura;
window.toggleEquip = toggleEquip;
window.unequipGear = unequipGear;

window.startRoll = startRoll;
window.toggleAutoRoll = toggleAutoRoll;
window.confirmNickname = confirmNickname;
window.openNicknameEdit = openNicknameEdit;

// 2. ui.js에서 가져온 설정 함수들 연결 (래퍼 함수)
window.updateSkipThreshold = handleUpdateSkip;
window.updateAutoThresholds = handleUpdateAuto;
window.updateGraphicSetting = updateGraphicSetting;

// ========================================================
// ★ [줌 차단] 브라우저 기본 확대/축소 막기
// ========================================================

// 1. [Ctrl + 휠] 차단
window.addEventListener('wheel', function(e) {
    if (e.ctrlKey) {
        e.preventDefault(); // 줌 동작 취소
    }
}, { passive: false }); // passive: false가 있어야 preventDefault가 먹힘

// 2. [Ctrl + +/-] 키보드 단축키 차단
window.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (
        e.key === '+' || 
        e.key === '-' || 
        e.key === '=' || 
        e.key === '_' || 
        e.key === '0'
    )) {
        e.preventDefault();
    }
});

// 3. [모바일] 핀치 줌(손가락 두개로 확대) 차단
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

function initHeatwaveFilter() {
    // 이미 필터가 있으면 삭제하고 다시 생성 (수치 적용을 위해)
    const existing = document.getElementById("heatwave-svg-filter");
    if (existing) existing.remove();

    // ★ [수정 포인트]
    // 1. baseFrequency="0.015 0.02": 파동을 조금 더 자잘하게 (너무 꿀렁거리지 않게)
    // 2. scale="6": 왜곡 강도를 30 -> 6으로 대폭 하향 (살짝만 휨)
    const svgContent = `
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" id="heatwave-svg-filter">
        <defs>
            <filter id="heatwave-filter">
                <feTurbulence type="turbulence" baseFrequency="0.015 0.02" numOctaves="2" result="noise" id="heat-turbulence" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
            </filter>
        </defs>
    </svg>
    <style>
        .heatwave-active {
            filter: url(#heatwave-filter);
        }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', svgContent);
}

// 즉시 실행
initHeatwaveFilter();

// [디버그용] 콘솔에 setWeather("thunder") 입력하면 즉시 날씨 변경
window.setWeather = function(weatherId) {
    // weathers 배열에서 ID가 일치하는 날씨 데이터 찾기
    const targetWeather = weathers.find(w => w.id === weatherId);

    if (targetWeather) {
        // 기존에 만들어둔 날씨 적용 함수 호출
        applyNewWeather(targetWeather);
        console.log(`☁️ 날씨가 [${targetWeather.name}]으로 강제 변경되었습니다.`);
    } else {
        console.error(`❌ 존재하지 않는 날씨 ID입니다: ${weatherId}`);
        console.log("사용 가능한 ID 목록:", weathers.map(w => w.id).join(", "));
    }
};

// ========================================================
// [개발자 치트키] 몬스터 소환
// 사용법: F12 콘솔창에 spawnMob("id", 마리수) 입력
// 예시: spawnMob("ice_golem", 1)  /  spawnMob("squirrel", 5)
// ========================================================
window.spawnMob = function(mobId, count = 1) {
    // 1. ID로 몬스터 데이터 찾기
    const mobData = CRITTER_DB.find(m => m.id === mobId);
    
    if (!mobData) {
        console.error(`❌ [오류] "${mobId}" 라는 몹은 없습니다.`);
        console.log("📜 소환 가능한 몹 ID 목록:", CRITTER_DB.map(m => m.id).join(", "));
        return;
    }

    console.log(`✨ [DEV] ${mobData.name} (ID: ${mobId}) ${count}마리 소환!`);

    for (let i = 0; i < count; i++) {
        // 플레이어 근처 (앞쪽 200~600px)에 소환
        let spawnX = player.x + 200 + (Math.random() * 400); 
        
        // 월드 밖으로 안 나가게 보정
        if (spawnX > WORLD_WIDTH - 500) spawnX = player.x - 200;

        const newMob = {
            id: Date.now() + Math.random(),
            x: spawnX, 
            y: getGroundY(spawnX), // 땅 높이 자동 계산
            vx: 0,
            vy: 0,
            targetVx: 0,
            typeData: mobData, 
            hp: mobData.hp,
            maxHp: mobData.hp,
            hitTime: 0, 
            life: 99999, // 테스트용이라 수명 길게
            animTime: Math.random() * 100,
            state: "idle",
            spawnTimer: 60 // 1초 뒤 행동 시작
        };

        critters.push(newMob);
    }
};

// 모든 종류의 몬스터를 1마리씩 다 소환 (박물관 모드)
window.spawnAllMobs = function() {
    console.log("🦁 모든 몬스터 소환!");
    CRITTER_DB.forEach((mob, index) => {
        // 100px 간격으로 줄세우기
        const spawnX = player.x + 200 + (index * 100);
        
        const newMob = {
            id: Date.now() + Math.random(),
            x: spawnX, 
            y: getGroundY(spawnX),
            vx: 0, vy: 0, targetVx: 0,
            typeData: mob, 
            hp: mob.hp, maxHp: mob.hp,
            hitTime: 0, life: 99999,
            animTime: 0,
            state: "idle", spawnTimer: 60
        };
        critters.push(newMob);
    });
};

// 현재 몹 다 지우기 (렉 걸릴 때)
window.killAllMobs = function() {
    critters.length = 0;
    console.log("💀 모든 몬스터 제거 완료.");
};

// 1. 바이옴 좌표 데이터
const BIOME_COORDS = {
    "south": 10000,    // 남쪽 끝
    "snow": 37500,     // 설산 (FROZEN_MOUNTAIN)
    "corrupt": 62500,  // 오염된 땅 (CORRUPTED)
    "ruin": 87500,     // 고대 유적 (ANCIENT_RUIN)
    "cliff": 112500,   // 절벽 (CLIFFS)
    "plains": 150000,  // 평원 (스폰 지점)
    "desert": 187500,  // 사막 (DESERT)
    "beach": 212500,   // 해변 (BEACH)
    "forest": 237500,  // 마법 숲 (MAGIC_FOREST)
    "city": 262500,    // 잊혀진 도시 (FORGOTTEN_CITY)
    "far": 287500,     // 머나먼 땅 (FAR_LANDS)
    "north": 315000    // 북쪽 끝
};

// 2. 텔레포트 함수: window.tp("desert")
window.tp = function(key) {
    // 키가 없거나 잘못 입력했을 때 목록 보여주기
    if (!key || !BIOME_COORDS[key]) {
        console.warn("❌ 잘못된 지역 이름입니다. 아래 목록 중 하나를 쓰세요:");
        console.table(Object.keys(BIOME_COORDS));
        return;
    }

    const targetX = BIOME_COORDS[key];

    // 1. 플레이어 위치 이동
    player.x = targetX;
    
    // 2. 높이 재설정 (하늘에서 떨어지지 않게 바닥에 착지)
    // (getGroundY 함수가 main.js에 import 되어 있어야 합니다)
    if (typeof getGroundY === 'function') {
        player.y = getGroundY(player.x);
    } else {
        player.y = H * 0.5; // 함수 없으면 그냥 중간 높이
    }

    player.vx = 0;
    player.vy = 0;

    // 3. 카메라 즉시 이동 (부드러운 이동 X, 팍! 이동)
    cameraX = targetX - (W / 2);
    targetCameraX = cameraX;

    // 4. 주변 환경 강제 리셋 (바이옴 변경 즉시 반영)
    if (typeof biomeMgr !== 'undefined') biomeMgr.update(player.x);
    
    // 5. 알림
    console.log(`🚀 [TELEPORT] ${key.toUpperCase()} 지역으로 이동했습니다. (X: ${targetX})`);
    
    // (선택) 화면에 알림 띄우기
    if (typeof showSideNotification === 'function') {
        showSideNotification("CHEAT ACTIVATED", `Warp to ${key.toUpperCase()}`, "#00E5FF");
    }
};

// 3. 갓 모드 함수: window.god()
window.god = function() {
    // 1. 체력 뻥튀기
    player.maxHp = 9999999;
    player.hp = 9999999;
    
    // 2. UI 갱신
    if (typeof updateProfileUI === 'function') updateProfileUI();

    // 3. 효과음 및 알림
    if (typeof playSound === 'function') playSound('levelup');
    console.log("💪 [GOD MODE] 체력이 무한대가 되었습니다.");

    if (typeof showSideNotification === 'function') {
        showSideNotification("GOD MODE", "체력 무제한 적용됨", "#FFD700");
    }
};

// 사용법 안내 로그
console.log("%c[개발자 치트] 사용법:", "color: #00E5FF; font-weight: bold; font-size: 14px;");
console.log("👉 window.tp('desert') : 사막으로 이동 ('snow', 'ruin' 등 가능)");
console.log("👉 window.god() : 체력 완전 회복 및 최대치 증가");