export const CRITTER_DB = {
    // [평화] 멍청한 AI ("wander")
    // ----------------------------------------------------
    "clear": { 
        name: "햇살 다람쥐", color: "#FFCA28", drop: "nut_light", 
        size: 15, speed: 1.3, hp: 1000, damage: 5, 
        moveType: "hop", aiType: "wander", uiHeight: 5.5 
    }, 
    "rain": { 
        name: "비구름 개구리", color: "#66BB6A", drop: "frog_skin", 
        size: 14, speed: 1.6, hp: 2400, damage: 8, 
        moveType: "hop", aiType: "wander", uiHeight: 3.5 
    },
    "snow": { 
        name: "눈토끼", color: "#FFFFFF", drop: "rabbit_fur", 
        size: 16, speed: 1.8, hp: 3000, damage: 10, 
        moveType: "hop", aiType: "wander", uiHeight: 4.0 
    },
    "wind": { 
        name: "바람 정령", color: "#B2DFDB", drop: "spirit_wing", 
        size: 18, speed: 1.9, hp: 5000, damage: 15, 
        moveType: "float", aiType: "wander", uiHeight: 4.5 
    },
    "foggy": { 
        name: "안개 요정", color: "#CFD8DC", drop: "fairy_dust", 
        size: 12, speed: 1.2, hp: 4600, damage: 12, 
        moveType: "float", aiType: "wander", uiHeight: 4.0 
    },

    // [공격] 지상 돌진 AI ("ground_charge")
    // ----------------------------------------------------
    "thunder": { 
        name: "전기 도마뱀", color: "#FBC02D", drop: "volt_scale", 
        size: 14, speed: 4.0, hp: 5400, damage: 20, 
        moveType: "dash", aiType: "ground_charge", uiHeight: 3.0 
    },

    // [공격] 공중 추적 AI ("flying_ram")
    // ----------------------------------------------------
    "eclipse": { 
        name: "그림자 까마귀", color: "#1A1A1A", drop: "shadow_beak", 
        size: 18, speed: 3.5, hp: 24000, damage: 50, 
        moveType: "float", aiType: "flying_ram", uiHeight: 4.5 
    },
    "blood-moon": { 
        name: "핏빛 박쥐", color: "#D32F2F", drop: "blood_fang", 
        size: 15, speed: 4.0, hp: 24000, damage: 60, 
        moveType: "float", aiType: "flying_ram", uiHeight: 4.0 
    },
    "glitch": { 
        name: "V̵O̵I̵D̵_B̴U̷G̸", color: "#00E5FF", drop: "core_glitch", 
        size: 20, speed: 5.0, hp: 100000, damage: 999, 
        moveType: "glitch", aiType: "flying_ram", uiHeight: 5.5 
    }
};