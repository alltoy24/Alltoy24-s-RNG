export const BIOME_DATA = {
    // 1. [세계의 끝 (남쪽)] : 0 ~ 25,000 (5배)
    SOUTH_EDGE: {
        name: "세계의 끝 (남쪽)",
        range: [0, 25000], 
        sky: { top: "#000814", bot: "#003566" },
        ground: "#001d3d", // 짙은 남색
        color: "#003566",  // 미니맵용
        physics: { gravity: 0.3, jumpPower: -22, friction: 0.95 },
        stats: { luck: 2.0, spawnRate: 0.5 },
        vfx: "star_dust"
    },
    // 2. [얼어붙은 산지] : 25,000 ~ 50,000
    FROZEN_MOUNTAIN: {
        name: "얼어붙은 산지",
        range: [25000, 50000],
        sky: { top: "#caf0f8", bot: "#90e0ef" },
        ground: "#ffffff", // 흰색
        color: "#E0F7FA", // 미니맵용
        physics: { gravity: 0.8, jumpPower: -15, friction: 0.99 },
        stats: { luck: 1.2, spawnRate: 1.2 },
        vfx: "snow"
    },
    // 3. [오염된 지대] : 50,000 ~ 75,000
    CORRUPTED: {
        name: "오염된 지대",
        range: [50000, 75000],
        sky: { top: "#240046", bot: "#5a189a" },
        ground: "#10002b", // 검보라색
        color: "#D32F2F", // 미니맵용 (붉은색 경고)
        physics: { gravity: 0.8, jumpPower: -15, friction: 0.82 },
        stats: { luck: 0.8, spawnRate: 2.0 },
        vfx: "purple_fog"
    },
    // 4. [고대 유적지] : 75,000 ~ 100,000
    ANCIENT_RUIN: {
        name: "고대 유적지",
        range: [75000, 100000],
        sky: { top: "#333d29", bot: "#7f4f24" },
        ground: "#582f0e", // 고동색
        color: "#9E9E9E", // 미니맵용 (회색)
        physics: { gravity: 0.9, jumpPower: -14, friction: 0.8 },
        stats: { luck: 3.0, spawnRate: 0.7 },
        vfx: "floating_runes"
    },
    // 5. [절벽 지대] : 100,000 ~ 125,000
    CLIFFS: {
        name: "절벽 지대",
        range: [100000, 125000],
        sky: { top: "#4895ef", bot: "#4cc9f0" },
        ground: "#432818", // 짙은 갈색
        color: "#795548", // 미니맵용
        physics: { gravity: 1.1, jumpPower: -13, friction: 0.75 },
        stats: { luck: 1.0, spawnRate: 1.0 },
        vfx: "wind_line"
    },
    // 6. [평원 지대] (시작 지점) : 125,000 ~ 175,000 (중앙에 넓게 배치)
    PLAINS: {
        name: "평원 지대",
        range: [125000, 175000], 
        sky: { top: "#87CEEB", bot: "#F0FFF0" },
        ground: "#2E7D32", // 초록색
        color: "#8BC34A", // 미니맵용
        physics: { gravity: 0.8, jumpPower: -15, friction: 0.82 },
        stats: { luck: 1.0, spawnRate: 1.0 },
        vfx: "leaf_petal"
    },
    // 7. [사막 지대] : 175,000 ~ 200,000
    DESERT: {
        name: "사막 지대",
        range: [175000, 200000],
        sky: { top: "#ffb703", bot: "#fb8500" },
        ground: "#e9c46a", // 모래색
        color: "#FFEB3B", // 미니맵용
        physics: { gravity: 0.8, jumpPower: -16, friction: 0.9 },
        stats: { luck: 1.5, spawnRate: 0.8 },
        vfx: "sand_storm"
    },
    // 8. [해변 지대] : 200,000 ~ 225,000
    BEACH: {
        name: "해변 지대",
        range: [200000, 225000],
        sky: { top: "#00b4d8", bot: "#90e0ef" },
        ground: "#f1f1f1", // 밝은 모래
        color: "#03A9F4", // 미니맵용
        physics: { gravity: 0.8, jumpPower: -15, friction: 0.85 },
        stats: { luck: 1.3, spawnRate: 1.2 },
        vfx: "bubbles"
    },
    // 9. [마법의 숲] : 225,000 ~ 250,000
    MAGIC_FOREST: {
        name: "마법의 숲",
        range: [225000, 250000],
        sky: { top: "#7209b7", bot: "#f72585" },
        ground: "#3c096c", // 보라색 땅
        color: "#BA68C8", // 미니맵용
        physics: { gravity: 0.6, jumpPower: -18, friction: 0.82 },
        stats: { luck: 4.0, spawnRate: 1.5 },
        vfx: "sparkles"
    },
    // 10. [잊혀진 도시] : 250,000 ~ 275,000
    FORGOTTEN_CITY: {
        name: "잊혀진 도시",
        range: [250000, 275000],
        sky: { top: "#212529", bot: "#495057" },
        ground: "#343a40", // 아스팔트색
        color: "#607D8B", // 미니맵용
        physics: { gravity: 0.8, jumpPower: -15, friction: 0.82 },
        stats: { luck: 2.5, spawnRate: 1.3 },
        vfx: "digital_glitch"
    },
    // 11. [머나먼 지대] : 275,000 ~ 300,000
    FAR_LANDS: {
        name: "머나먼 지대",
        range: [275000, 300000],
        sky: { top: "#adb5bd", bot: "#dee2e6" },
        ground: "#212529", // 짙은 회색
        color: "#424242", // 미니맵용
        physics: { gravity: 0.8, jumpPower: -15, friction: 0.82 },
        stats: { luck: 1.0, spawnRate: 3.0 },
        vfx: "dust_particle"
    },
    // 12. [세계의 끝 (북쪽)] : 300,000 ~ 325,000
    NORTH_EDGE: {
        name: "세계의 끝 (북쪽)",
        range: [300000, 325000],
        sky: { top: "#000000", bot: "#1a1a1a" },
        ground: "#000000", // 완전 검정
        color: "#000000", // 미니맵용
        physics: { gravity: 0.2, jumpPower: -25, friction: 0.98 },
        stats: { luck: 10.0, spawnRate: 0.2 },
        vfx: "aurora"
    }
};