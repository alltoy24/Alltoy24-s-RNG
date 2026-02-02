// src/managers/assetManager.js

// 1. 사용할 이미지 목록 (키: 경로)
// ★ 중요: index.html이 있는 위치를 기준으로 경로를 적어야 합니다.
const ASSET_MANIFEST = {
    // 마을 건물
    'house1': 'assets/buildings/house1.png',
    'house2': 'assets/buildings/house2.png',
    'house3': 'assets/buildings/house3.png',
    'light': 'assets/buildings/light.png',
    'light2': 'assets/buildings/light2.png',
    'light3': 'assets/buildings/light3.png',
    'light4': 'assets/buildings/light4.png',
    'light5': 'assets/buildings/light5.png',
    'light6': 'assets/buildings/light6.png',
    'construct_sign': 'assets/buildings/construct_sign.png',
    'shop': 'assets/buildings/shop.png',
    'forge': 'assets/buildings/forge.png',
    'bighouse': 'assets/buildings/bighouse.png',
    'bighouse2': 'assets/buildings/bighouse.png', // 파일명이 같다면 경로도 같게
    
    // 이전에 쓰던 것들도 혹시 모르니 유지
    'spawn_flag': 'assets/buildings/spawn_flag.png',
    'world_tree': 'assets/buildings/world_tree.png' // 세계수 이미지도 있다면
};

const images = {}; 
let loadedCount = 0;
let totalCount = 0;

export function loadAssets(onComplete) {
    const keys = Object.keys(ASSET_MANIFEST);
    totalCount = keys.length;
    
    if (totalCount === 0) {
        onComplete();
        return;
    }

    console.log("📦 리소스 로딩 시작...");

    keys.forEach(key => {
        const img = new Image();
        img.src = ASSET_MANIFEST[key];
        
        img.onload = () => {
            images[key] = img;
            loadedCount++;
            if (loadedCount === totalCount) {
                console.log("✅ 모든 리소스 로딩 완료!");
                onComplete();
            }
        };

        img.onerror = () => {
            console.error(`❌ 이미지 로드 실패: ${ASSET_MANIFEST[key]}`);
            loadedCount++;
            if (loadedCount === totalCount) onComplete();
        };
    });
}

export function getAsset(key) {
    return images[key];
}