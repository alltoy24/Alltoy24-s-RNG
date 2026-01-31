export const CRITTER_DB = [
    // ==============================================================
    // [Tier 1] 초심자 사냥터 (HP: 30 ~ 200)
    // ==============================================================
    { 
        id: "squirrel", name: "햇살 다람쥐", color: "#FFCA28", drop: "nut_light", 
        size: 15, speed: 1.3, hp: 30, damage: 5, xp: 15, // XP 상향
        moveType: "hop", aiType: "flee_shooter", uiHeight: 5.5,
        spawnConditions: { biomes: ["PLAINS", "FOREST"], weathers: ["clear", "cloudy", "wind"] },
        spawnChance: 1.0 
    },
    { 
        id: "frog", name: "비구름 개구리", color: "#66BB6A", drop: "frog_skin", 
        size: 14, speed: 1.6, hp: 80, damage: 10, xp: 35, 
        moveType: "hop", aiType: "wander", uiHeight: 3.5, 
        spawnConditions: { biomes: ["PLAINS", "FOREST", "BEACH"], weathers: ["rain", "thunder"] },
        spawnChance: 0.8 
    },
    { 
        id: "slime_grass", name: "잔디 슬라임", color: "#76FF03", drop: "slime_gel", 
        size: 15, hp: 100, speed: 1.2, damage: 12, xp: 45, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["PLAINS"], weathers: ["ALL"] }, 
        spawnChance: 1.0 
    },

    // ==============================================================
    // [Tier 2] 중급자 사냥터 (HP: 500 ~ 2,000)
    // ==============================================================
    { 
        id: "slime_sand", name: "모래 슬라임", color: "#FFD700", drop: "slime_gel", 
        size: 16, hp: 600, speed: 1.3, damage: 25, xp: 200, // HP 낮추고 XP 효율 증가
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["DESERT"], weathers: ["ALL"] }, 
        spawnChance: 1.0 
    },
    {
        id: "lizard", name: "전기 도마뱀", color: "#FBC02D", drop: "volt_scale",
        size: 16, speed: 4.0, hp: 800, damage: 40, xp: 350, 
        moveType: "walk", aiType: "ground_charge", uiHeight: 3.0,
        spawnConditions: { biomes: ["DESERT", "CLIFFS"], weathers: ["thunder", "clear"] },
        spawnChance: 0.7
    },
    {
        id: "tumbleweed", name: "살아있는 회전초", color: "#8D6E63", drop: "fiber",
        size: 18, speed: 3.0, hp: 500, damage: 30, xp: 180, 
        moveType: "dash", aiType: "wander", uiHeight: 2.0,
        spawnConditions: { biomes: ["DESERT", "CLIFFS"], weathers: ["wind", "clear"] },
        spawnChance: 0.9
    },
    {
        id: "slime_ocean", name: "트로피칼 슬라임", color: "#00B0FF", drop: "slime_gel", 
        size: 16, hp: 1200, speed: 1.4, damage: 35, xp: 450, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["BEACH"], weathers: ["ALL"] }, 
        spawnChance: 1.0 
    },

    // ==============================================================
    // [Tier 3] 상급자 사냥터 (HP: 3,000 ~ 10,000)
    // ==============================================================
    {
        id: "wind_spirit", name: "바람 정령", color: "#B2DFDB", drop: "spirit_wing",
        size: 18, speed: 1.9, hp: 3000, damage: 50, xp: 1200, 
        moveType: "float", aiType: "wander", uiHeight: 4.5,
        spawnConditions: { biomes: ["ALL"], weathers: ["wind"] },
        spawnChance: 0.5 
    },
    { 
        id: "slime_ice", name: "빙수 슬라임", color: "#80DEEA", drop: "slime_gel", 
        size: 18, hp: 5000, speed: 1.0, damage: 60, xp: 2200, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["FROZEN_MOUNTAIN"], weathers: ["ALL"] }, 
        spawnChance: 0.8 
    },
    {
        id: "snow_rabbit", name: "눈토끼", color: "#FFFFFF", drop: "rabbit_fur",
        size: 16, speed: 1.8, hp: 3500, damage: 55, xp: 1500, // 데미지 정상화 (8 -> 55)
        moveType: "hop", aiType: "flee_shooter", uiHeight: 4.0,
        spawnConditions: { biomes: ["FROZEN_MOUNTAIN"], weathers: ["snow", "clear"] },
        spawnChance: 0.8
    },
    {
        id: "ice_golem", name: "얼음 골렘", color: "#81D4FA", drop: "stone_core",
        size: 25, speed: 0.5, hp: 12000, damage: 100, xp: 5000, // 탱커형
        moveType: "walk", aiType: "stationary_turret", uiHeight: 5.0,
        spawnConditions: { biomes: ["FROZEN_MOUNTAIN"], weathers: ["ALL"] },
        spawnChance: 0.3 
    },
    { 
        id: "slime_clay", name: "토기 슬라임", color: "#795548", drop: "slime_gel", 
        size: 19, hp: 6000, speed: 1.1, damage: 70, xp: 2500, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["ANCIENT_RUIN"], weathers: ["ALL"] }, 
        spawnChance: 0.8 
    },
    {
        id: "ghost", name: "떠도는 망령", color: "#90A4AE", drop: "ectoplasm",
        size: 20, speed: 1.5, hp: 4500, damage: 120, xp: 2000, 
        moveType: "float", aiType: "teleport_ambush", uiHeight: 4.5,
        spawnConditions: { biomes: ["RUINS", "FORGOTTEN_CITY"], weathers: ["ALL"] },
        spawnChance: 0.4
    },
    { 
        id: "slime_pudding", name: "푸딩 슬라임", color: "#F06292", drop: "slime_gel", 
        size: 17, hp: 8000, speed: 1.6, damage: 65, xp: 3200, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["MAGIC_FOREST"], weathers: ["ALL"] }, 
        spawnChance: 0.8 
    },
    {
        id: "fairy", name: "안개 요정", color: "#CFD8DC", drop: "fairy_dust",
        size: 12, speed: 1.2, hp: 2500, damage: 45, xp: 1100, 
        moveType: "float", aiType: "wander", uiHeight: 4.0,
        spawnConditions: { biomes: ["MAGIC_FOREST", "FOREST"], weathers: ["foggy"] },
        spawnChance: 0.6
    },

    // ==============================================================
    // [Tier 4] 하드코어 지역 (HP: 20,000 ~ 80,000)
    // ==============================================================
    { 
        id: "slime_toxic", name: "폐기물 슬라임", color: "#7B1FA2", drop: "slime_gel", 
        size: 20, hp: 25000, speed: 1.5, damage: 150, xp: 8500, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["CORRUPTED"], weathers: ["ALL"] }, 
        spawnChance: 0.8 
    },
    { 
        id: "slime_oil", name: "오일 슬라임", color: "#263238", drop: "ancient_gear", 
        size: 20, hp: 30000, speed: 1.0, damage: 180, xp: 10000, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["FORGOTTEN_CITY"], weathers: ["ALL"] }, 
        spawnChance: 0.7 
    },
    { 
        id: "slime_magma", name: "마그마 슬라임", color: "#FF3D00", drop: "stone_core", 
        size: 18, hp: 35000, speed: 1.5, damage: 250, xp: 12500, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["DESERT"], weathers: ["heatwave"] }, 
        spawnChance: 0.3 
    },
    { 
        id: "slime_aurora", name: "오로라 슬라임", color: "#1DE9B6", drop: "spirit_wing", 
        size: 25, hp: 50000, speed: 2.0, damage: 300, xp: 20000, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.5,
        spawnConditions: { biomes: ["NORTH_EDGE"], weathers: ["ALL"] }, 
        spawnChance: 0.4 
    },

    // ==============================================================
    // [Tier 5] 보스 & 이벤트 (HP: 10만 ~ 50만)
    // ==============================================================
    {
        id: "crow", name: "그림자 까마귀", color: "#1A1A1A", drop: "shadow_beak",
        size: 18, speed: 3.5, hp: 80000, damage: 450, xp: 35000, // HP 낮추고 XP 현실화
        moveType: "float", aiType: "flying_ram", uiHeight: 4.5,
        spawnConditions: { biomes: ["ALL"], weathers: ["eclipse"] },
        spawnChance: 0.5
    },
    {
        id: "bat", name: "핏빛 박쥐", color: "#D32F2F", drop: "blood_fang",
        size: 15, speed: 4.0, hp: 100000, damage: 550, xp: 45000, 
        moveType: "float", aiType: "flying_ram", uiHeight: 4.0,
        spawnConditions: { biomes: ["ALL"], weathers: ["blood-moon"] },
        spawnChance: 0.5
    },
    { 
        id: "slime_void", name: "다크매터 슬라임", color: "#212121", drop: "shadow_beak", 
        size: 22, hp: 150000, speed: 1.8, damage: 700, xp: 70000, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["SOUTH_EDGE"], weathers: ["ALL"] }, 
        spawnChance: 0.5 
    },
    {
        id: "glitch_bug", 
        name: "V̵O̵I̵D̵_B̴U̷G̸", 
        color: "#00E5FF", 
        drop: "core_glitch",
        size: 20, 
        speed: 0, 
        hp: 500000, // 100만 -> 50만 (현실적으로 잡을만하게)
        damage: 1500, // 4004 -> 1500 (즉사 방지)
        xp: 250000, // XP 대폭 상향 (잡을 맛 나게)
        moveType: "float",
        aiType: "glitch_chaos", 
        uiHeight: 5.5,
        spawnConditions: { biomes: ["ALL"], weathers: ["glitch"] },
        spawnChance: 0.4
    },
    
    // [Tier 6] 로또 (황금 슬라임)
    { 
        id: "slime_gold", name: "황금 슬라임", color: "#FFD700", drop: "gold_nugget", 
        size: 14, 
        hp: 30000, // 잘 안 죽지만 때릴 수는 있게
        speed: 3.5, 
        damage: 0, // 공격 안 함 (도망만 다님)
        xp: 100000, // 대박 경험치
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["ALL"], weathers: ["ALL"] }, 
        spawnChance: 0.005 
    }
];