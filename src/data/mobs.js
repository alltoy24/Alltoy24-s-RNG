export const CRITTER_DB = [
    // ==============================================================
    // [Tier 1] 뉴비 존 (HP: 200 ~ 1,500)
    // 설명: 갓 시작한 유저도 기본 오라나 나무 반지만으로 잡을 수 있음.
    // ==============================================================
    { 
        id: "squirrel", name: "햇살 다람쥐", color: "#FFCA28", drop: "nut_light", 
        size: 15, speed: 1.3, 
        hp: 200, damage: 8, xp: 50, // Lv.1 유저(HP 100)에게 12방 컷
        moveType: "hop", aiType: "flee_shooter", uiHeight: 5.5,
        spawnConditions: { biomes: ["PLAINS", "FOREST"], weathers: ["clear", "cloudy", "wind"] },
        spawnChance: 1.0 
    },
    { 
        id: "frog", name: "비구름 개구리", color: "#66BB6A", drop: "frog_skin", 
        size: 14, speed: 1.6, 
        hp: 500, damage: 15, xp: 120, // 조금 아픔
        moveType: "hop", aiType: "wander", uiHeight: 3.5, 
        spawnConditions: { biomes: ["PLAINS", "FOREST", "BEACH"], weathers: ["rain", "thunder"] },
        spawnChance: 0.8 
    },
    { 
        id: "slime_grass", name: "잔디 슬라임", color: "#76FF03", drop: "slime_gel", 
        size: 15, speed: 1.2, 
        hp: 1000, damage: 20, xp: 200, // 초반 샌드백
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["PLAINS"], weathers: ["ALL"] }, 
        spawnChance: 1.0 
    },

    // ==============================================================
    // [Tier 2] 중급자 진입 (HP: 20만 ~ 100만)
    // 설명: 여기서부터는 'Uncommon'이나 'Rare' 등급 이상의 오라가 필요함.
    // ==============================================================
    { 
        id: "slime_sand", name: "모래 슬라임", color: "#FFD700", drop: "slime_gel", 
        size: 16, speed: 1.3, 
        hp: 200000, damage: 150, xp: 5000, // Lv.20 이하는 스치면 사망 가능성
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["DESERT"], weathers: ["ALL"] }, 
        spawnChance: 1.0 
    },
    {
        id: "lizard", name: "전기 도마뱀", color: "#FBC02D", drop: "volt_scale",
        size: 16, speed: 4.5, // 매우 빠름
        hp: 350000, damage: 250, xp: 9000, 
        moveType: "walk", aiType: "ground_charge", uiHeight: 3.0,
        spawnConditions: { biomes: ["DESERT", "CLIFFS"], weathers: ["thunder", "clear"] },
        spawnChance: 0.7
    },
    {
        id: "tumbleweed", name: "가시 회전초", color: "#8D6E63", drop: "fiber",
        size: 18, speed: 3.5, 
        hp: 150000, damage: 180, xp: 4500, 
        moveType: "dash", aiType: "wander", uiHeight: 2.0,
        spawnConditions: { biomes: ["DESERT", "CLIFFS"], weathers: ["wind", "clear"] },
        spawnChance: 0.9
    },
    {
        id: "slime_ocean", name: "트로피칼 슬라임", color: "#00B0FF", drop: "slime_gel", 
        size: 16, speed: 1.4, 
        hp: 500000, damage: 300, xp: 12000, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["BEACH"], weathers: ["ALL"] }, 
        spawnChance: 1.0 
    },

    // ==============================================================
    // [Tier 3] 상급자 지역 (HP: 200만 ~ 800만)
    // 설명: 100만~1000만 단위 데미지를 주는 오라가 없으면 잡기 힘듦.
    // ==============================================================
    {
        id: "wind_spirit", name: "바람 정령", color: "#B2DFDB", drop: "spirit_wing",
        size: 18, speed: 2.5, 
        hp: 1500000, damage: 500, xp: 40000, 
        moveType: "float", aiType: "wander", uiHeight: 4.5,
        spawnConditions: { biomes: ["ALL"], weathers: ["wind"] },
        spawnChance: 0.5 
    },
    { 
        id: "slime_ice", name: "빙수 슬라임", color: "#80DEEA", drop: "slime_gel", 
        size: 18, speed: 1.0, 
        hp: 3000000, damage: 600, xp: 80000, // 튼튼함
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["FROZEN_MOUNTAIN"], weathers: ["ALL"] }, 
        spawnChance: 0.8 
    },
    {
        id: "snow_rabbit", name: "눈토끼", color: "#FFFFFF", drop: "rabbit_fur",
        size: 16, speed: 2.2, 
        hp: 2000000, damage: 450, xp: 55000, 
        moveType: "hop", aiType: "flee_shooter", uiHeight: 4.0,
        spawnConditions: { biomes: ["FROZEN_MOUNTAIN"], weathers: ["snow", "clear"] },
        spawnChance: 0.8
    },
    { 
        id: "slime_clay", name: "고대 토기 슬라임", color: "#795548", drop: "slime_gel", 
        size: 19, speed: 1.1, 
        hp: 5000000, damage: 800, xp: 120000, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["ANCIENT_RUIN"], weathers: ["ALL"] }, 
        spawnChance: 0.8 
    },
    {
        id: "ghost", name: "떠도는 망령", color: "#90A4AE", drop: "ectoplasm",
        size: 20, speed: 2.0, 
        hp: 4000000, damage: 1000, xp: 100000, // 방어력 무시급 데미지
        moveType: "float", aiType: "teleport_ambush", uiHeight: 4.5,
        spawnConditions: { biomes: ["RUINS", "FORGOTTEN_CITY"], weathers: ["ALL"] },
        spawnChance: 0.4
    },
    { 
        id: "slime_pudding", name: "푸딩 슬라임", color: "#F06292", drop: "slime_gel", 
        size: 17, speed: 1.6, 
        hp: 6000000, damage: 700, xp: 150000, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["MAGIC_FOREST"], weathers: ["ALL"] }, 
        spawnChance: 0.8 
    },
    {
        id: "fairy", name: "안개 요정", color: "#CFD8DC", drop: "fairy_dust",
        size: 12, speed: 1.5, 
        hp: 2500000, damage: 550, xp: 60000, 
        moveType: "float", aiType: "wander", uiHeight: 4.0,
        spawnConditions: { biomes: ["MAGIC_FOREST", "FOREST"], weathers: ["foggy"] },
        spawnChance: 0.6
    },

    // ==============================================================
    // [Tier 4] 고위험 지역 (HP: 1,000만 ~ 3,000만)
    // 설명: 여기서부터는 'Epic' 등급 이상의 오라나 파티 사냥 권장.
    // ==============================================================
    { 
        id: "slime_toxic", name: "방사능 슬라임", color: "#7B1FA2", drop: "slime_gel", 
        size: 20, speed: 1.8, 
        hp: 15000000, damage: 2500, xp: 500000, // 맞으면 거의 즉사
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["CORRUPTED"], weathers: ["ALL"] }, 
        spawnChance: 0.8 
    },
    { 
        id: "slime_oil", name: "폐유 슬라임", color: "#263238", drop: "ancient_gear", 
        size: 20, speed: 1.2, 
        hp: 20000000, damage: 3000, xp: 700000, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["FORGOTTEN_CITY"], weathers: ["ALL"] }, 
        spawnChance: 0.7 
    },
    { 
        id: "slime_magma", name: "용암 슬라임", color: "#FF3D00", drop: "stone_core", 
        size: 18, speed: 1.5, 
        hp: 25000000, damage: 4000, xp: 900000, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["DESERT"], weathers: ["heatwave"] }, 
        spawnChance: 0.3 
    },
    { 
        id: "slime_aurora", name: "오로라 슬라임", color: "#1DE9B6", drop: "spirit_wing", 
        size: 25, speed: 2.2, 
        hp: 30000000, damage: 5000, xp: 1200000, 
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.5,
        spawnConditions: { biomes: ["NORTH_EDGE"], weathers: ["ALL"] }, 
        spawnChance: 0.4 
    },

    // ==============================================================
    // [Tier 5] 필드 보스 (HP: 5,000만 ~ 8,000만)
    // 설명: 1억 데미지 오라가 없다면 장기전 각오. (최대 8천만)
    // ==============================================================
    {
        id: "ice_golem", name: "고대 설산 골렘", color: "#81D4FA", drop: "stone_core",
        size: 35, speed: 0.8, 
        hp: 50000000, damage: 8000, xp: 3000000, // 탱커형 보스
        moveType: "walk", aiType: "ice_golem", uiHeight: 6.0,
        spawnConditions: { biomes: ["FROZEN_MOUNTAIN"], weathers: ["ALL"] },
        spawnChance: 0.2 
    },
    {
        id: "crow", name: "재앙의 까마귀", color: "#1A1A1A", drop: "shadow_beak",
        size: 25, speed: 4.5, 
        hp: 60000000, damage: 9000, xp: 4000000, // 속도형 보스
        moveType: "float", aiType: "flying_ram", uiHeight: 5.0,
        spawnConditions: { biomes: ["ALL"], weathers: ["eclipse"] },
        spawnChance: 0.5
    },
    {
        id: "bat", name: "뱀파이어 로드", color: "#D32F2F", drop: "blood_fang",
        size: 22, speed: 5.0, 
        hp: 70000000, damage: 12000, xp: 5000000, // 초고속
        moveType: "float", aiType: "flying_ram", uiHeight: 4.5,
        spawnConditions: { biomes: ["ALL"], weathers: ["blood-moon"] },
        spawnChance: 0.5
    },
    { 
        id: "slime_void", name: "공허의 포식자", color: "#212121", drop: "shadow_beak", 
        size: 30, speed: 2.0, 
        hp: 75000000, damage: 15000, xp: 6000000, // 한방 컷 위험
        moveType: "hop", aiType: "slime_jump", uiHeight: 4.0,
        spawnConditions: { biomes: ["SOUTH_EDGE"], weathers: ["ALL"] }, 
        spawnChance: 0.4 
    },
    {
        id: "glitch_bug", 
        name: "E̷R̷R̷O̷R̷_4̷0̷4̷", 
        color: "#00E5FF", 
        drop: "core_glitch",
        size: 28, speed: 0, 
        hp: 80000000, // ★ 월드 1 최강 보스 (8천만)
        damage: 40404, // 즉사기 보유
        xp: 10000000, // 1000만 XP
        moveType: "float", aiType: "glitch_chaos", uiHeight: 6.0,
        spawnConditions: { biomes: ["ALL"], weathers: ["glitch"] },
        spawnChance: 0.3
    },
    
    // [Tier 6] 로또 (황금 슬라임) - 밸런스 외
    { 
        id: "slime_gold", name: "황금 슬라임", color: "#FFD700", drop: "gold_nugget", 
        size: 14, speed: 4.0, 
        hp: 10000000, // 천만 (오라 없으면 못 잡음)
        damage: 0, // 공격 안 함
        xp: 5000000, // 500만 XP
        moveType: "hop", aiType: "slime_jump", uiHeight: 3.0,
        spawnConditions: { biomes: ["ALL"], weathers: ["ALL"] }, 
        spawnChance: 0.005 // 0.5% 확률
    }
];