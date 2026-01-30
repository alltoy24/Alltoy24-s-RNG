import { BIOME_DATA } from '../data/biomes.js';

/**
 * [TERRAIN ENGINE V12 - STABLE EDGES & BALANCED LAYERS]
 * - x좌표 0 미만에서 발생하는 노이즈 반전(튀는 현상) 수정
 * - 원경 레이어 높이를 화면 50% 수준으로 하향 조정
 * - 절벽 바이옴 4번 레이어 디자인 개선 (솟았다 꺼지는 산맥)
 */

function fbm(x, octaves = 4) {
    // ★ [핵심 수정] 음수 좌표에서 모양이 뒤집히는걸 막기 위해 오프셋 추가
    // x가 0보다 작아져도 노이즈는 계속 자연스럽게 이어짐
    let nx = x + 500000; 
    
    let v = 0;
    let a = 0.5;
    let f = 1.0;
    for (let i = 0; i < octaves; i++) {
        v += a * Math.sin(nx * f);
        f *= 2.0; 
        a *= 0.5;
    }
    return v;
}

// 바이옴별 형태 정의
const TerrainBase = {
    // [평원]
    PLAINS: (x, baseY, H, depth) => {
        // 높이 하향: 최대 300 -> 200
        const parallaxHeight = (1.0 - depth) * 200; 
        const hills = Math.sin(x * 0.0005) * (40 + (1-depth)*80);
        return baseY - parallaxHeight + hills + fbm(x * 0.01, 2) * 10;
    },

    // [사막]
    DESERT: (x, baseY, H, depth) => {
        const parallaxHeight = (1.0 - depth) * 150; // 높이 하향
        const duneHeight = 140 + (1.0 - depth) * 150;
        const dune = (1.0 - Math.abs(Math.sin(x * 0.0008))) * duneHeight;
        return baseY - parallaxHeight + 50 - dune;
    },

    // [설산]
    FROZEN_MOUNTAIN: (x, baseY, H, depth) => {
        // 높이 하향: 최대 500 -> 350
        const parallaxHeight = (1.0 - depth) * 350;
        const peakScale = 180 + (1.0 - depth) * 200; 
        const bigPeak = fbm(x * 0.0015, 5) * peakScale;
        return baseY - parallaxHeight + bigPeak - 50;
    },

    // [유적]
    ANCIENT_RUIN: (x, baseY, H, depth) => {
        const layerOffset = (1.0 - depth) * 250;
        const steps = Math.floor(x / 400) * (Math.sin(x * 0.0002) * 40);
        return baseY - layerOffset + steps + fbm(x * 0.1, 2) * 5;
    },

    // ★ [절벽 수정] 요청사항 반영
    CLIFFS: (x, baseY, H, depth) => {
        const noise = fbm(x * 0.02, 2) * 20;

        // [4번 레이어] (맨 뒤) - 하늘 50% 가림 + 솟았다 꺼짐
        if (depth < 0.25) {
            // baseY(0.82) - H*0.35 = 0.47 (화면 절반 정도 높이)
            const skyBlocker = H * 0.35; 
            
            // 거대한 파동을 줘서 산맥이 솟았다가 내려가게 만듦
            // sin값이 -1 ~ 1 이므로, 0 ~ 200 범위로 움직임
            const flow = Math.sin(x * 0.0005) * 150; 
            const jagged = fbm(x * 0.002, 4) * 100; // 거친 암벽

            return baseY - skyBlocker + flow + jagged;
        } 
        
        // [1, 2, 3번 레이어] - 플레이어와 평행하되 아주 완만한 계단식
        else {
            // 높이 차이를 줄임 (400 -> 150)
            // 2번 레이어가 갑자기 튀어오르는 현상 방지
            const risingStep = (1.0 - depth) * 150; 
            return baseY - risingStep + noise + Math.sin(x * 0.001) * 20;
        }
    },

    // [해변]
    BEACH: (x, baseY, H, depth) => {
        const parallaxHeight = (1.0 - depth) * 50; // 거의 차이 없게
        return baseY - parallaxHeight + 80 + Math.sin(x * 0.001) * 20;
    },

    // [마법 숲]
    MAGIC_FOREST: (x, baseY, H, depth) => {
        const parallaxHeight = (1.0 - depth) * 250;
        const floaty = Math.sin(x * 0.003) * 80 + Math.cos(x * 0.007) * 40;
        return baseY - parallaxHeight - 30 + floaty;
    },

    // [오염지대]
    CORRUPTED: (x, baseY, H, depth) => {
        const parallaxHeight = (1.0 - depth) * 200;
        const spikes = Math.sin(x * 0.005) * 60 + Math.abs(Math.sin(x * 0.012)) * 40;
        return baseY - parallaxHeight + spikes + fbm(x * 0.05, 2) * 15;
    },

    // [도시]
    FORGOTTEN_CITY: (x, baseY, H, depth) => {
        const parallaxHeight = (1.0 - depth) * 150;
        const blockFreq = 0.001 + (1-depth) * 0.002;
        const structure = Math.sin(x * blockFreq) > 0.5 ? 100 + (1-depth)*100 : 0;
        return baseY - parallaxHeight + structure + fbm(x * 0.2, 1) * 2;
    },

    // [먼 곳]
    FAR_LANDS: (x, baseY, H, depth) => {
        const parallaxHeight = (1.0 - depth) * 300;
        return baseY - parallaxHeight + Math.sin(x * 0.002) * Math.tan(x * 0.0005) * 50;
    },

    NORTH_EDGE: (x, baseY) => baseY 
};

function getWeights(x) {
    const blendRange = 2500;
    let weights = [];
    for (const key in BIOME_DATA) {
        const [start, end] = BIOME_DATA[key].range;
        if (x >= start - blendRange && x <= end + blendRange) {
            let dist = 0;
            if (x < start) dist = start - x; else if (x > end) dist = x - end;
            let val = 1.0 - (dist / blendRange);
            if (val > 0) weights.push({ key, weight: (1 - Math.cos(val * Math.PI)) / 2 });
        }
    }
    const total = weights.reduce((a, b) => a + b.weight, 0);
    return weights.map(i => ({ key: i.key, weight: i.weight / (total || 1) }));
}

/**
 * [최종 지형 계산]
 */
export function calculateGroundY(x, H, depth = 1.0) {
    const baseY = H * 0.82; 
    const weights = getWeights(x);
    
    let biomeY = 0;
    weights.forEach(b => {
        const shapeFunc = TerrainBase[b.key] || TerrainBase.PLAINS;
        const rawY = shapeFunc(x, baseY, H, depth);
        
        // 거칠기 조정 (배경은 더 부드럽게)
        let ruggedness = 1.0;
        if (depth >= 0.99) ruggedness = 0.3;
        else if (depth >= 0.6) ruggedness = 0.5; // 근경 부드럽게
        else ruggedness = 1.0;

        if (b.key === "PLAINS") ruggedness *= 0.5;

        const diff = (rawY - baseY) * ruggedness;
        biomeY += (baseY + diff) * b.weight;
    });

    // 기본 레이어 오프셋도 하향 조정 (너무 높게 뜨지 않도록)
    let layerOffset = 0;
    if (depth < 0.99) {
        if (depth >= 0.6) layerOffset = -H * 0.02; // 아주 살짝만 위로
        else if (depth >= 0.3) layerOffset = -H * 0.08;
        else layerOffset = -H * 0.15;
    }

    let finalY = biomeY + layerOffset;

    // =========================================================
    // ★ [THE VOID] 세상의 끝 처리 (325000 기준)
    // =========================================================
    const EDGE_BUFFER = 5000; 
    const WORLD_WIDTH = 325000;

    // 왼쪽 나락 (노이즈 안정화 적용됨)
    if (x < EDGE_BUFFER) {
        const dist = EDGE_BUFFER - x;
        const drop = Math.pow(dist * 0.025, 2.2); 
        const noise = fbm(x * 0.05, 3) * (dist * 0.2);
        finalY += drop + noise;
    }
    // 오른쪽 나락 (Parallax Depth 보정 적용)
    else {
        const layerEnd = WORLD_WIDTH * depth; 
        if (x > layerEnd - EDGE_BUFFER) {
            const dist = x - (layerEnd - EDGE_BUFFER);
            const drop = Math.pow(dist * 0.025, 2.2);
            const noise = fbm(x * 0.05, 3) * (dist * 0.2);
            finalY += drop + noise;
        }
    }

    return finalY;
}