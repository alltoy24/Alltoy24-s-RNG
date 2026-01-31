export const CRITTER_DB = [
    // [1] 평원 & 숲
    { 
        id: "squirrel", name: "햇살 다람쥐", color: "#FFCA28", drop: "nut_light", 
        size: 15, speed: 1.3, hp: 1000, damage: 5, 
        moveType: "hop", aiType: "flee_shooter", uiHeight: 5.5,
        spawnConditions: { biomes: ["PLAINS", "FOREST"], weathers: ["clear", "cloudy", "wind"] },
        spawnChance: 1.0 // 매우 흔함
    },
    { 
        id: "frog", name: "비구름 개구리", color: "#66BB6A", drop: "frog_skin", 
        size: 14, speed: 1.6, hp: 2400, damage: 8, 
        moveType: "hop", aiType: "wander", uiHeight: 3.5,
        spawnConditions: { biomes: ["PLAINS", "FOREST", "BEACH"], weathers: ["rain", "thunder"] },
        spawnChance: 0.8 // 비오면 흔함
    },
    {
        id: "wind_spirit", name: "바람 정령", color: "#B2DFDB", drop: "spirit_wing",
        size: 18, speed: 1.9, hp: 5000, damage: 15,
        moveType: "float", aiType: "wander", uiHeight: 4.5,
        spawnConditions: { biomes: ["ALL"], weathers: ["wind"] },
        spawnChance: 0.5 // 보통
    },
    {
        id: "fairy", name: "안개 요정", color: "#CFD8DC", drop: "fairy_dust",
        size: 12, speed: 1.2, hp: 4600, damage: 12,
        moveType: "float", aiType: "wander", uiHeight: 4.0,
        spawnConditions: { biomes: ["MAGIC_FOREST", "FOREST"], weathers: ["foggy"] },
        spawnChance: 0.6
    },

    // [2] 사막 & 절벽
    {
        id: "lizard", name: "전기 도마뱀", color: "#FBC02D", drop: "volt_scale",
        size: 16, speed: 4.0, hp: 5400, damage: 20,
        moveType: "walk", aiType: "ground_charge", uiHeight: 3.0,
        spawnConditions: { biomes: ["DESERT", "CLIFFS"], weathers: ["thunder", "clear"] },
        spawnChance: 0.7
    },
    {
        id: "tumbleweed", name: "살아있는 회전초", color: "#8D6E63", drop: "fiber",
        size: 18, speed: 3.0, hp: 1500, damage: 10,
        moveType: "dash", aiType: "wander", uiHeight: 2.0,
        spawnConditions: { biomes: ["DESERT", "CLIFFS"], weathers: ["wind", "clear"] },
        spawnChance: 0.9
    },

    // [3] 설산
    {
        id: "snow_rabbit", name: "눈토끼", color: "#FFFFFF", drop: "rabbit_fur",
        size: 16, speed: 1.8, hp: 3000, damage: 10,
        moveType: "hop", aiType: "flee_shooter", uiHeight: 4.0,
        spawnConditions: { biomes: ["FROZEN_MOUNTAIN"], weathers: ["snow", "clear"] },
        spawnChance: 0.8
    },
    {
        id: "ice_golem", name: "얼음 골렘", color: "#81D4FA", drop: "stone_core",
        size: 25, speed: 0.5, hp: 8000, damage: 40,
        moveType: "walk", aiType: "stationary_turret", uiHeight: 5.0,
        spawnConditions: { biomes: ["FROZEN_MOUNTAIN"], weathers: ["ALL"] },
        spawnChance: 0.3 // 조금 희귀
    },

    // [4] 특수 / 이벤트
    {
        id: "crow", name: "그림자 까마귀", color: "#1A1A1A", drop: "shadow_beak",
        size: 18, speed: 3.5, hp: 24000, damage: 50,
        moveType: "float", aiType: "flying_ram", uiHeight: 4.5,
        spawnConditions: { biomes: ["ALL"], weathers: ["eclipse"] },
        spawnChance: 0.5
    },
    {
        id: "bat", name: "핏빛 박쥐", color: "#D32F2F", drop: "blood_fang",
        size: 15, speed: 4.0, hp: 24000, damage: 60,
        moveType: "float", aiType: "flying_ram", uiHeight: 4.0,
        spawnConditions: { biomes: ["ALL"], weathers: ["blood-moon"] },
        spawnChance: 0.5
    },
    {
        id: "glitch_bug", name: "V̵O̵I̵D̵_B̴U̷G̸", color: "#00E5FF", drop: "core_glitch",
        size: 20, speed: 5.0, hp: 100000, damage: 999,
        moveType: "glitch", aiType: "teleport_ambush", uiHeight: 5.5,
        spawnConditions: { biomes: ["ALL"], weathers: ["glitch"] },
        spawnChance: 0.4
    },
    {
        id: "ghost", name: "떠도는 망령", color: "#90A4AE", drop: "ectoplasm",
        size: 20, speed: 1.5, hp: 3000, damage: 20,
        moveType: "float", aiType: "teleport_ambush", uiHeight: 4.5,
        spawnConditions: { biomes: ["RUINS", "FORGOTTEN_CITY"], weathers: ["ALL"] },
        spawnChance: 0.4
    },

    // ==============================================================
    // [★ 슬라임 군단] spawnChance 적용 + 드랍템 수정
    // ==============================================================
    // 대부분 진액(slime_gel)을 주지만, 몇몇은 특수템을 줍니다.
    
    { id: "slime_grass", name: "잔디 슬라임", color: "#76FF03", drop: "slime_gel", 
      size: 15, hp: 1000, speed: 1.2, damage: 10, moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
      spawnConditions: { biomes: ["PLAINS"], weathers: ["ALL"] }, spawnChance: 1.0 },

    { id: "slime_sand", name: "모래 슬라임", color: "#FFD700", drop: "slime_gel", 
      size: 16, hp: 1500, speed: 1.3, damage: 15, moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
      spawnConditions: { biomes: ["DESERT"], weathers: ["ALL"] }, spawnChance: 1.0 },

    { id: "slime_ice", name: "빙수 슬라임", color: "#80DEEA", drop: "slime_gel", 
      size: 18, hp: 2000, speed: 1.0, damage: 20, moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
      spawnConditions: { biomes: ["FROZEN_MOUNTAIN"], weathers: ["ALL"] }, spawnChance: 0.8 },

    { id: "slime_toxic", name: "폐기물 슬라임", color: "#7B1FA2", drop: "slime_gel", 
      size: 20, hp: 3000, speed: 1.5, damage: 25, moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
      spawnConditions: { biomes: ["CORRUPTED"], weathers: ["ALL"] }, spawnChance: 0.8 },

    { id: "slime_clay", name: "토기 슬라임", color: "#795548", drop: "slime_gel", 
      size: 19, hp: 2500, speed: 1.1, damage: 20, moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
      spawnConditions: { biomes: ["ANCIENT_RUIN"], weathers: ["ALL"] }, spawnChance: 0.8 },

    { id: "slime_void", name: "다크매터 슬라임", color: "#212121", drop: "shadow_beak", 
      size: 22, hp: 5000, speed: 1.8, damage: 40, moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
      spawnConditions: { biomes: ["SOUTH_EDGE"], weathers: ["ALL"] }, spawnChance: 0.5 },

    { id: "slime_ocean", name: "트로피칼 슬라임", color: "#00B0FF", drop: "slime_gel", 
      size: 16, hp: 1200, speed: 1.4, damage: 12, moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
      spawnConditions: { biomes: ["BEACH"], weathers: ["ALL"] }, spawnChance: 1.0 },

    { id: "slime_pudding", name: "푸딩 슬라임", color: "#F06292", drop: "slime_gel", 
      size: 17, hp: 1800, speed: 1.6, damage: 18, moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
      spawnConditions: { biomes: ["MAGIC_FOREST"], weathers: ["ALL"] }, spawnChance: 0.8 },

    { id: "slime_oil", name: "오일 슬라임", color: "#263238", drop: "ancient_gear", 
      size: 20, hp: 4000, speed: 1.0, damage: 30, moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
      spawnConditions: { biomes: ["FORGOTTEN_CITY"], weathers: ["ALL"] }, spawnChance: 0.7 },

    { id: "slime_aurora", name: "오로라 슬라임", color: "#1DE9B6", drop: "spirit_wing", 
      size: 25, hp: 6000, speed: 2.0, damage: 50, moveType: "hop", aiType: "slime_jump", uiHeight: 3.5,
      spawnConditions: { biomes: ["NORTH_EDGE"], weathers: ["ALL"] }, spawnChance: 0.4 },

    { id: "slime_magma", name: "마그마 슬라임", color: "#FF3D00", drop: "stone_core", 
      size: 18, hp: 3500, speed: 1.5, damage: 35, moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
      spawnConditions: { biomes: ["DESERT"], weathers: ["heatwave"] }, spawnChance: 0.3 },

    // ★ [황금 슬라임] 극악의 확률
    { 
        id: "slime_gold", name: "황금 슬라임", color: "#FFD700", drop: "gold_nugget", 
        size: 14, hp: 20000, speed: 3.5, damage: 10, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["ALL"], weathers: ["ALL"] }, 
        spawnChance: 0.005 // 0.5% 확률 (다른 슬라임이 1.0일 때)
    }
];