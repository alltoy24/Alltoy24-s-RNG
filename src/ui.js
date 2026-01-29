import { allAuras } from './data/auras.js';
import { gearDB, consumableDB, potionRecipes } from './data/items.js';
import { GRAPHICS } from './settings.js';

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// src/ui.js의 updateProfileUI 함수를 이걸로 교체하세요

export function updateProfileUI(currentLevel, totalExp, player, myNickname, myChatColor) {
    const pName = document.getElementById("profile-name");
    const pLv = document.getElementById("profile-lv");
    
    // 1. 닉네임 & 레벨 표시
    if(pName) { pName.innerText = myNickname || "Unknown"; pName.style.color = myChatColor; }
    if(pLv) pLv.innerText = `LV.${currentLevel}`;

    // 2. XP바 표시
    const xpFill = document.getElementById("xp-bar-fill");
    const xpText = document.getElementById("xp-text");
    if(xpFill && xpText) {
        let currentLevelBase = 250 * Math.pow(currentLevel - 1, 2);
        let nextLevelBase = 250 * Math.pow(currentLevel, 2);
        let requiredExp = nextLevelBase - currentLevelBase;
        let currentExp = totalExp - currentLevelBase;
        if (requiredExp <= 0) requiredExp = 1;
        
        let pct = Math.min(100, Math.max(0, (currentExp / requiredExp) * 100));
        xpFill.style.width = `${pct}%`;
        xpText.innerText = `${pct.toFixed(1)}% (${Math.floor(currentExp).toLocaleString()} / ${Math.floor(requiredExp).toLocaleString()})`;
    }

    // 3. HP바 표시 (★수정됨: 여기서 계산하지 않고 player 객체 값을 그대로 씁니다)
    const hpFill = document.getElementById("hp-bar-fill");
    const hpText = document.getElementById("hp-text");
    if(hpFill && hpText) {
        // 안전 장치: 값이 없으면 기본값 100
        let max = player.maxHp || 100;
        let cur = player.hp || 100;
        
        let hpPct = (cur / max) * 100;
        hpFill.style.width = `${Math.max(0, hpPct)}%`;
        hpText.innerText = `${Math.ceil(cur)}/${max}`;
    }
}

// 2. 인벤토리 그리기
export function renderInventory(inventory, equippedAuraName) { 
    const list = document.getElementById("inv-list"); 
    if(!list) return;
    list.innerHTML = ""; 
    const counts = {}; 
    inventory.forEach(a => counts[a.name] = (counts[a.name] || 0) + 1); 

    let sortedAuras = Object.keys(counts).map(name => {
        return { name: name, count: counts[name], auraData: allAuras.find(a => a.name === name) };
    }).filter(item => item.auraData).sort((a, b) => b.auraData.chanceX - a.auraData.chanceX); 

    sortedAuras.forEach(item => {
        let name = item.name; let count = item.count; let aura = item.auraData;
        let fragPerItem = Math.max(1, Math.ceil(aura.chanceX / 10));
        let isEquipped = (equippedAuraName === name);
        let equipText = isEquipped ? "장착 해제" : "오라 장착";
        let equipClass = isEquipped ? "btn-unequip" : "btn-equip";

        list.innerHTML += `
        <div class="inv-item-card" style="border-color: ${isEquipped ? '#FFD700' : aura.color}; box-shadow: ${isEquipped ? '0 0 15px rgba(255,215,0,0.3)' : 'none'};">
            <div class="inv-item-top">
                <span class="inv-name" style="color:${aura.color}; text-shadow:${aura.glow};">${isEquipped ? '✨ ' : ''}${name}</span>
                <span class="inv-odds">x${count}</span>
            </div>
            <div style="font-size:0.75rem; color:#888;">확률 1/${aura.chanceX.toLocaleString()}</div>
            <div style="margin-top: 10px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 5px;">
                    <span>분해: <span id="scrap-cnt-${name}">1</span>개</span>
                    <span style="color: #FFD700;">+<span id="scrap-frag-${name}">${fragPerItem.toLocaleString()}</span>✨</span>
                </div>
                <input type="range" id="scrap-slider-${name}" min="1" max="${count}" value="1" 
                    oninput="document.getElementById('scrap-cnt-${name}').innerText = this.value; document.getElementById('scrap-frag-${name}').innerText = (this.value * ${fragPerItem}).toLocaleString();" 
                    style="width: 100%; cursor: pointer; accent-color: #E53935;">
            </div>
            <div style="display:flex; gap:5px; margin-top:5px;">
                <button class="action-sm-btn btn-scrap" onclick="scrapAura('${name}', document.getElementById('scrap-slider-${name}').value)" style="pointer-events:auto; flex:1;">분해</button>
                <button class="action-sm-btn ${equipClass}" onclick="toggleEquipAura('${name}')" style="pointer-events:auto; flex:1;">${equipText}</button>
            </div>
        </div>`; 
    }); 
}

// 3. 소모품 그리기
export function renderConsumableList(consumableInv) { 
    const list = document.getElementById("consumable-list"); 
    if(!list) return;
    list.innerHTML = ""; 
    Object.entries(consumableInv).forEach(([key, count]) => { 
        if(count <= 0) return; 
        let item = consumableDB[key]; 
        if(!item) return; 
        list.innerHTML += `<div class="item-card"><div><div class="item-name" style="color:${item.color}">${item.name} <span style="float:right;">x${count}</span></div><div class="item-desc">${item.desc}</div></div><button class="action-sm-btn btn-alchemy" onclick="useConsumable('${key}')" style="pointer-events:auto;">사용하기</button></div>`; 
    }); 
}

// 4. 연금술 목록 그리기
export function renderAlchemyList(consumableInv, inventory, countAura) { 
    const list = document.getElementById("alchemy-list"); 
    if(!list) return;
    list.innerHTML = ""; 
    potionRecipes.forEach(recipe => { 
        let resultItem = consumableDB[recipe.result]; 
        if(!resultItem) return; 
        let hasAll = true; 
        let reqHtml = ""; 
        for (const [rId, rCount] of Object.entries(recipe.reqItems)) { 
            let have = consumableInv[rId] || 0; 
            if (have < rCount) hasAll = false; 
            let itemInfo = consumableDB[rId]; 
            if(itemInfo) reqHtml += `<span class='req-tag' style="color:${have >= rCount ? '#81C784' : '#E53935'}">${itemInfo.name} (${have}/${rCount})</span>`; 
        } 
        for (const [rName, rCount] of Object.entries(recipe.reqAuras)) { 
            let have = countAura(rName); 
            if (have < rCount) hasAll = false; 
            reqHtml += `<span class='req-tag' style="color:${have >= rCount ? '#81C784' : '#E53935'}">${rName} (${have}/${rCount})</span>`; 
        } 
        list.innerHTML += `<div class="item-card"><div><div class="item-name" style="color:${resultItem.color}">${resultItem.name}</div><div class="item-desc">${resultItem.desc}</div><div class="req-auras">${reqHtml}</div></div><button class="action-sm-btn btn-alchemy ${!hasAll ? 'disabled-btn' : ''}" onclick="craftPotion('${recipe.result}')" ${!hasAll ? 'disabled' : ''} style="pointer-events:auto;">연성하기</button></div>`; 
    }); 
}

// 5. 제작 목록 그리기
export function renderCrafting(fragments, ownedGears, inventory, countAura) { 
    const list = document.getElementById("craft-list"); 
    if(!list) return;
    list.innerHTML = ""; 
    gearDB.forEach(gear => { 
        let reqHtml = ""; 
        let canCraft = true; 
        Object.entries(gear.reqAuras).forEach(([rName, rCount]) => { 
            let has = countAura(rName); 
            if(has < rCount) canCraft = false; 
            reqHtml += `<span class="req-tag" style="color:${has>=rCount ? '#81C784' : '#E57373'}">${rName} ${has}/${rCount}</span>`; 
        }); 
        if(fragments < gear.cost || ownedGears.includes(gear.id)) canCraft = false; 
        list.innerHTML += `<div class="item-card"><div><div class="item-name" style="color:${gear.color}">${gear.name}</div><div class="item-desc">${gear.desc}</div><div class="req-auras">${reqHtml}</div><div class="item-cost">비용: ${gear.cost}✨</div></div><button class="action-sm-btn btn-craft ${!canCraft ? 'disabled-btn' : ''}" onclick="craftGear(${gear.id})" ${!canCraft ? 'disabled' : ''} style="pointer-events:auto;">${ownedGears.includes(gear.id) ? "보유중" : "제작"}</button></div>`; 
    }); 
}

// 6. 장비창 그리기
export function renderEquipment(equippedGears, ownedGears) { 
    for (let i = 0; i < 3; i++) { 
        let slot = document.getElementById(`slot-${i}`); 
        let gearId = equippedGears[i]; 
        if (gearId !== null) { 
            let gear = gearDB.find(g => g.id === gearId); 
            if(gear) { 
                slot.className = "equip-slot filled"; 
                slot.style.borderColor = gear.color; 
                slot.innerHTML = `<span style="color:${gear.color}; text-shadow:0 0 10px ${gear.color}">★</span><div class="slot-name">${gear.name}</div>`; 
            } 
        } else { 
            slot.className = "equip-slot"; 
            slot.style.borderColor = ""; 
            slot.innerHTML = "+"; 
        } 
    } 
    const list = document.getElementById("gear-list"); 
    if(list) {
        list.innerHTML = ""; 
        ownedGears.forEach(id => { 
            let gear = gearDB.find(g => g.id === id); 
            if(!gear) return; 
            let isEq = equippedGears.includes(id); 
            list.innerHTML += `<div class="item-card"><div class="item-name" style="color:${gear.color}">${gear.name}</div><div class="item-desc">${gear.desc}</div><button class="action-sm-btn ${isEq ? 'btn-unequip' : 'btn-equip'}" onclick="toggleEquip(${id})" style="pointer-events:auto;">${isEq ? "해제" : "장착"}</button></div>`; 
        }); 
    }
}

// 7. 퀵바 그리기
export function renderQuickBar(consumableInv) {
    const list = document.getElementById("quick-list");
    if(!list) return;
    list.innerHTML = "";
    let hasItems = false;
    Object.entries(consumableInv).forEach(([key, count]) => {
        if(count <= 0) return;
        let item = consumableDB[key];
        if(!item) return;
        hasItems = true;
        let bgStyle = item.color;
        if (item.type === "luck") bgStyle = "linear-gradient(45deg, #43A047, #81C784)";
        else if (item.type === "speed") bgStyle = "linear-gradient(45deg, #1E88E5, #64B5F6)";
        else if (item.type === "both") bgStyle = "linear-gradient(45deg, #FBC02D, #FFEB3B)";
        
        list.innerHTML += `<div class="quick-item" onclick="useConsumable('${key}')"><div class="quick-dot" style="background: ${bgStyle}; box-shadow: 0 0 5px ${item.color};"></div><div class="quick-info" style="color: ${item.color}">${item.name}</div><div class="quick-count">x${count}</div></div>`;
    });
    if (!hasItems) list.innerHTML = `<div style="text-align:center; font-size:0.8rem; color:#666; margin-top:20px;">보유한 아이템이 없습니다.</div>`;
}

// 8. 아이템 로그
export function spawnItemLog(itemKey) {
    const container = document.getElementById("item-log-container");
    const itemData = consumableDB[itemKey];
    if (!container || !itemData) return;
    const div = document.createElement("div");
    div.className = "item-log";
    div.innerHTML = `<span style="color:#aaa; margin-right:4px;">(+</span><span style="color:${itemData.color};">${itemData.name}</span><span style="color:#aaa;">)</span>`;
    container.appendChild(div);
    if (container.children.length > 10) container.removeChild(container.firstChild);
    setTimeout(() => { div.classList.add("fade-out"); setTimeout(() => { if(div.parentElement) div.remove(); }, 500); }, 2000);
}

// 9. UI 가시성
export function setUIVisibility(visible) {
    const uiElements = ['top-ui', 'quick-item-toggle', 'quick-item-bar', 'combo-display', 'buff-display', 'roll-bottom-bar', 'roll-bottom-toggle', 'chat-container', 'chat-toggle-btn', 'mobile-controls'];
    uiElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === 'mobile-controls' && !IS_MOBILE) return;
            if (visible) {
                el.classList.remove('ui-hidden');
                el.style.visibility = "visible";
                el.style.opacity = "1";
                el.style.pointerEvents = "auto";
                if (id === 'roll-bottom-bar' || id === 'roll-bottom-toggle') el.style.bottom = "";
            } else {
                el.classList.add('ui-hidden');
            }
        }
    });
}

// 10. 스킵 설정 (값 반환)
export function updateSkipThreshold(val) {
    const thresholds = [0, 1000, 10000, 100000, 1000000, 10000000];
    const labels = ["OFF", "1K", "10K", "100K", "1M", "10M"];
    const label = document.getElementById("skip-label");
    if(label) label.innerText = `연출 스킵: ${labels[val]}`;
    return thresholds[val]; 
}

// 11. 자동 설정 (값 반환)
export function updateAutoThresholds() {
    const thresholds = [0, 100, 1000, 10000, 100000, 1000000, 10000000];
    const labels = ["OFF", "100", "1K", "10K", "100K", "1M", "10M"];
    const scrapSlider = document.getElementById("auto-scrap-slider");
    const stopSlider = document.getElementById("auto-stop-slider");
    if (!scrapSlider || !stopSlider) return null;
    document.getElementById("auto-scrap-label").innerText = `자동 분해: ${scrapSlider.value == 0 ? "OFF" : labels[scrapSlider.value] + " 미만"}`;
    document.getElementById("auto-stop-label").innerText = `자동 정지: ${stopSlider.value == 0 ? "OFF" : labels[stopSlider.value] + " 이상"}`;
    return { scrap: thresholds[scrapSlider.value], stop: thresholds[stopSlider.value] };
}

// 12. 그래픽 설정
export function updateGraphicSetting(key, value) {
    if (typeof GRAPHICS !== 'undefined') GRAPHICS[key] = value;
    if (key === 'weatherDensity') {
        const label = document.getElementById('weather-val-label');
        if (label) label.innerText = Math.round(value * 100) + "%";
    }
}