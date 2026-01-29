export const gearDB = [
    // [Lv.1 극초반: 비용 10 ~ 100 구간]
    { id: 1, name: "나무 반지", desc: "행운 +5%", cost: 15, luck: 0.05, speed: 0, color: "#8D6E63", reqAuras: { "COMMON": 10 } },
    { id: 2, name: "돌멩이 부적", desc: "속도 +5%", cost: 15, luck: 0, speed: 0.05, color: "#9E9E9E", reqAuras: { "COMMON": 10 } },
    { id: 3, name: "아침 이슬 반지", desc: "행운 +7%", cost: 20, luck: 0.07, speed: 0, color: "#B3E5FC", reqAuras: { "DEW": 3 } },
    { id: 4, name: "새싹의 귀걸이", desc: "행운 +5%, 속도 +5%", cost: 25, luck: 0.05, speed: 0.05, color: "#81C784", reqAuras: { "UNCOMMON": 5 } },
    { id: 5, name: "서리꽃 펜던트", desc: "속도 +8%", cost: 25, luck: 0, speed: 0.08, color: "#E0F7FA", reqAuras: { "FROST": 3 } },
    { id: 6, name: "잉걸불 장갑", desc: "행운 +8%", cost: 30, luck: 0.08, speed: 0, color: "#FF5722", reqAuras: { "EMBER": 3 } },
    { id: 7, name: "미풍의 스카프", desc: "속도 +10%", cost: 35, luck: 0, speed: 0.10, color: "#B0BEC5", reqAuras: { "BREEZE": 3 } },
    { id: 8, name: "이슬방울 펜던트", desc: "행운 +10%", cost: 35, luck: 0.10, speed: 0, color: "#90CAF9", reqAuras: { "DROPLET": 3 } },
    { id: 9, name: "도깨비불 랜턴", desc: "행운 +10%, 속도 +5%", cost: 40, luck: 0.10, speed: 0.05, color: "#69F0AE", reqAuras: { "GHOST_LIGHT": 3 } },
    { id: 10, name: "노을빛 브로치", desc: "행운 +12%", cost: 45, luck: 0.12, speed: 0, color: "#FFAB40", reqAuras: { "AFTERGLOW": 2, "SUNSHINE": 1 } },
    { id: 11, name: "안개 장화", desc: "속도 +15%", cost: 50, luck: 0, speed: 0.15, color: "#B0BEC5", reqAuras: { "MIST": 3 } },
    { id: 12, name: "눈꽃 브로치", desc: "행운 +15%", cost: 50, luck: 0.15, speed: 0, color: "#E3F2FD", reqAuras: { "SNOWFLAKE": 3 } },
    { id: 13, name: "흩날리는 눈발", desc: "속도 +15%", cost: 50, luck: 0, speed: 0.15, color: "#B0BEC5", reqAuras: { "FLURRY": 3 } },
    { id: 14, name: "신기루의 망토", desc: "행운 +20%, 속도 -5%", cost: 60, luck: 0.20, speed: -0.05, color: "#BA68C8", reqAuras: { "MIRAGE": 2 } },
    { id: 15, name: "작은 불꽃 반지", desc: "행운 +10%, 속도 +10%", cost: 65, luck: 0.10, speed: 0.10, color: "#FFCA28", reqAuras: { "SPARK": 3, "COMMON": 5 } },
    { id: 16, name: "빛무리 귀걸이", desc: "행운 +22%", cost: 70, luck: 0.22, speed: 0, color: "#FFF9C4", reqAuras: { "HALO": 2 } },
    { id: 17, name: "햇살의 장갑", desc: "행운 +25%", cost: 80, luck: 0.25, speed: 0, color: "#FFEB3B", reqAuras: { "SUNSHINE": 4 } },
    { id: 18, name: "가랑비 망토", desc: "속도 +25%", cost: 80, luck: 0, speed: 0.25, color: "#64B5F6", reqAuras: { "DRIZZLE": 2, "DROPLET": 5 } },
    { id: 19, name: "스콜의 우산", desc: "속도 +30%", cost: 90, luck: 0, speed: 0.30, color: "#4FC3F7", reqAuras: { "SQUALL": 2 } },
    { id: 20, name: "회오리 부메랑", desc: "속도 +35%", cost: 100, luck: 0, speed: 0.35, color: "#90A4AE", reqAuras: { "WHIRLWIND": 2 } },

    // [Lv.2 초중반: 비용 120 ~ 500 구간]
    { id: 21, name: "먹구름 방패", desc: "행운 +30%, 속도 +5%", cost: 120, luck: 0.30, speed: 0.05, color: "#78909C", reqAuras: { "OVERCAST": 2 } },
    { id: 22, name: "강철 반지", desc: "행운 +35%", cost: 150, luck: 0.35, speed: 0, color: "#B0BEC5", reqAuras: { "RARE": 5 } },
    { id: 23, name: "바람 걸음 신발", desc: "속도 +35%", cost: 150, luck: 0, speed: 0.35, color: "#CFD8DC", reqAuras: { "GALE": 1, "BREEZE": 5 } },
    { id: 24, name: "햇살 줄기 지팡이", desc: "행운 +40%", cost: 150, luck: 0.40, speed: 0, color: "#FFCA28", reqAuras: { "SUNBEAM": 2 } },
    { id: 25, name: "잿빛 로브", desc: "속도 +40%", cost: 160, luck: 0, speed: 0.40, color: "#9E9E9E", reqAuras: { "ASHEN": 2 } },
    { id: 26, name: "번개구름 부적", desc: "행운 +40%, 속도 -10%", cost: 180, luck: 0.40, speed: -0.10, color: "#FFEE58", reqAuras: { "STATIC": 2, "SPARK": 5 } },
    { id: 27, name: "북극성 나침반", desc: "행운 +45%", cost: 190, luck: 0.45, speed: 0, color: "#E1F5FE", reqAuras: { "POLARIS": 1, "SUNBEAM": 1 } },
    { id: 28, name: "달빛 대검", desc: "행운 +30%, 속도 +20%", cost: 200, luck: 0.30, speed: 0.20, color: "#D1C4E9", reqAuras: { "MOONLIGHT": 2 } },
    { id: 29, name: "우박의 투구", desc: "행운 +50%", cost: 250, luck: 0.50, speed: 0, color: "#BBDEFB", reqAuras: { "HAILSTONE": 3 } },
    { id: 30, name: "장마철 장화", desc: "속도 +50%", cost: 250, luck: 0, speed: 0.50, color: "#1976D2", reqAuras: { "MONSOON": 3 } },
    { id: 31, name: "혜성의 꼬리", desc: "속도 +55%", cost: 260, luck: 0, speed: 0.55, color: "#80DEEA", reqAuras: { "COMET": 2 } },
    { id: 32, name: "황혼의 장막", desc: "행운 +55%", cost: 280, luck: 0.55, speed: 0, color: "#5E35B1", reqAuras: { "DUSK": 2 } },
    { id: 33, name: "돌풍의 망토", desc: "속도 +60%", cost: 300, luck: 0, speed: 0.60, color: "#90A4AE", reqAuras: { "GALE": 2 } },
    { id: 34, name: "흑점의 오브", desc: "행운 +60%", cost: 300, luck: 0.60, speed: 0, color: "#FF5722", reqAuras: { "SUNSPOT": 1, "DAYLIGHT": 3 } },
    { id: 35, name: "새벽의 여명검", desc: "행운 +35%, 속도 +35%", cost: 320, luck: 0.35, speed: 0.35, color: "#F06292", reqAuras: { "DAWN": 2 } },
    { id: 36, name: "오로라 실드", desc: "행운 +65%", cost: 350, luck: 0.65, speed: 0, color: "#1DE9B6", reqAuras: { "AURORA": 2 } },
    { id: 37, name: "마력의 반지", desc: "행운 +80%", cost: 400, luck: 0.80, speed: 0, color: "#BA68C8", reqAuras: { "EPIC": 3 } },
    { id: 38, name: "마력의 장화", desc: "속도 +80%", cost: 400, luck: 0, speed: 0.80, color: "#BA68C8", reqAuras: { "EPIC": 3 } },
    { id: 39, name: "소용돌이 구슬", desc: "속도 +85%", cost: 420, luck: 0, speed: 0.85, color: "#5C6BC0", reqAuras: { "VORTEX": 2 } },
    { id: 40, name: "툰드라 가죽갑옷", desc: "행운 +90%", cost: 450, luck: 0.90, speed: 0, color: "#81D4FA", reqAuras: { "TUNDRA": 2 } },
    { id: 41, name: "아지랑이 단검", desc: "행운 +50%, 속도 +50%", cost: 500, luck: 0.50, speed: 0.50, color: "#FF5722", reqAuras: { "HEAT_HAZE": 2 } },

    // [Lv.3 중반: 비용 500 ~ 1,500 구간]
    { id: 42, name: "벼락의 투구", desc: "속도 +100%", cost: 550, luck: 0, speed: 1.00, color: "#FBC02D", reqAuras: { "THUNDERBOLT": 2 } },
    { id: 43, name: "슈퍼셀 코어", desc: "행운 +100%", cost: 600, luck: 1.00, speed: 0, color: "#455A64", reqAuras: { "SUPERCELL": 2 } },
    { id: 44, name: "유성우 화살", desc: "속도 +110%", cost: 650, luck: 0, speed: 1.10, color: "#FF8A65", reqAuras: { "METEOR": 2 } },
    { id: 45, name: "천상의 시작", desc: "행운 +100%, 속도 +50%", cost: 700, luck: 1.00, speed: 0.50, color: "#00E5FF", reqAuras: { "CELESTIAL": 2, "EPIC": 5 } },
    { id: 46, name: "삭풍의 피리", desc: "행운 +110%", cost: 720, luck: 1.10, speed: 0, color: "#B0BEC5", reqAuras: { "CHILL_WIND": 2 } },
    { id: 47, name: "안개 장벽 방패", desc: "행운 +115%", cost: 750, luck: 1.15, speed: 0, color: "#CFD8DC", reqAuras: { "FOG_BANK": 2 } },
    { id: 48, name: "태양풍 반지", desc: "속도 +100%", cost: 800, luck: 0, speed: 1.00, color: "#FF9800", reqAuras: { "DAYLIGHT": 5, "SUNSPOT": 1 } },
    { id: 49, name: "산성비 플라스크", desc: "속도 +120%", cost: 820, luck: 0, speed: 1.20, color: "#8BC34A", reqAuras: { "ACID_RAIN": 2 } },
    { id: 50, name: "들불의 횃불", desc: "행운 +125%", cost: 880, luck: 1.25, speed: 0, color: "#D84315", reqAuras: { "WILDFIRE": 2 } },
    { id: 51, name: "태풍의 눈 마안", desc: "행운 +65%, 속도 +65%", cost: 900, luck: 0.65, speed: 0.65, color: "#ECEFF1", reqAuras: { "EYE_OF_STORM": 2 } },
    { id: 52, name: "만년설 방패", desc: "행운 +120%, 속도 -20%", cost: 950, luck: 1.20, speed: -0.20, color: "#81D4FA", reqAuras: { "HAILSTONE": 5, "CHILL_WIND": 1 } },
    { id: 53, name: "뇌우의 검", desc: "속도 +120%, 행운 +80%", cost: 1200, luck: 0.80, speed: 1.20, color: "#FBC02D", reqAuras: { "THUNDERBOLT": 2, "SPARK": 10 } },
    { id: 54, name: "토네이도 부츠", desc: "속도 +150%", cost: 1300, luck: 0, speed: 1.50, color: "#78909C", reqAuras: { "WHIRLWIND": 5 } },
    { id: 55, name: "심해의 비늘", desc: "행운 +200%", cost: 1500, luck: 2.00, speed: 0, color: "#00BCD4", reqAuras: { "MONSOON": 5 } },

    // 👉 [신규 확장 1] 소원 및 자연현상 테마 (비용 1,550 ~ 2,900 구간)
    { id: 56, name: "소원의 별조각", desc: "행운 +210%", cost: 1550, luck: 2.10, speed: 0, color: "#FFF59D", reqAuras: { "WISHING_STAR": 2 } },
    { id: 57, name: "서풍의 부채", desc: "속도 +210%", cost: 1600, luck: 0, speed: 2.10, color: "#A5D6A7", reqAuras: { "ZEPHYR": 2 } },
    { id: 58, name: "붉은 달의 펜던트", desc: "행운 +150%, 속도 +100%", cost: 1650, luck: 1.50, speed: 1.00, color: "#D32F2F", reqAuras: { "BLOOD_MOON": 2 } },
    { id: 59, name: "별빛 망토", desc: "속도 +220%", cost: 1700, luck: 0, speed: 2.20, color: "#FFF9C4", reqAuras: { "WISHING_STAR": 1, "DAYLIGHT": 2 } },
    { id: 60, name: "핏빛 성배", desc: "행운 +230%", cost: 1750, luck: 2.30, speed: 0, color: "#B71C1C", reqAuras: { "BLOOD_MOON": 1, "MONSOON": 1 } },

    // [기존 Lv.4 초입] 비용 1,800 ~ 2,000 구간 
    { id: 61, name: "사일런트 대검", desc: "행운 +150%, 속도 +150%", cost: 1800, luck: 1.50, speed: 1.50, color: "#546E7A", reqAuras: { "FOG_BANK": 3 } },
    { id: 62, name: "폭염의 지팡이", desc: "행운 +220%", cost: 1900, luck: 2.20, speed: 0, color: "#D84315", reqAuras: { "HEATWAVE": 3 } },
    { id: 63, name: "환영의 날개", desc: "속도 +250%", cost: 2000, luck: 0, speed: 2.50, color: "#607D8B", reqAuras: { "MIRAGE": 5 } },

    // 👉 [신규 확장 2] 타짜 & 재해 테마 (비용 2,100 ~ 2,900 구간)
    { id: 64, name: "플러시 트럼프 카드", desc: "행운 +250%", cost: 2100, luck: 2.50, speed: 0, color: "#FFB74D", reqAuras: { "STRAIGHT_FLUSH": 2 } },
    { id: 65, name: "용암 방패", desc: "행운 +260%", cost: 2200, luck: 2.60, speed: 0, color: "#FF3D00", reqAuras: { "VOLCANO": 2 } },
    { id: 66, name: "모래 폭풍의 망토", desc: "속도 +260%", cost: 2300, luck: 0, speed: 2.60, color: "#D7CCC8", reqAuras: { "SANDSTORM": 2 } },
    { id: 67, name: "조커 카드", desc: "행운 +270%", cost: 2400, luck: 2.70, speed: 0, color: "#FFCA28", reqAuras: { "STRAIGHT_FLUSH": 1, "SPARK": 5 } },
    { id: 68, name: "타오르는 심장", desc: "행운 +280%", cost: 2500, luck: 2.80, speed: 0, color: "#FF5722", reqAuras: { "VOLCANO": 1, "WILDFIRE": 2 } },
    { id: 69, name: "삼위일체의 성물", desc: "행운 +180%, 속도 +180%", cost: 2600, luck: 1.80, speed: 1.80, color: "#B39DDB", reqAuras: { "TRINITY": 2 } },
    { id: 70, name: "얼음꽃 왕관", desc: "속도 +280%", cost: 2700, luck: 0, speed: 2.80, color: "#81D4FA", reqAuras: { "BLIZZARD": 2 } },
    { id: 71, name: "망령의 로브", desc: "행운 +280%", cost: 2800, luck: 2.80, speed: 0, color: "#9E9E9E", reqAuras: { "PHANTOM": 2 } },
    { id: 72, name: "해일의 서핑보드", desc: "속도 +290%", cost: 2900, luck: 0, speed: 2.90, color: "#1565C0", reqAuras: { "TSUNAMI": 2 } },

    // [기존 Lv.4 중반 타로/숫자] 비용 3,000 ~ 7,500 구간
    { id: 73, name: "바보의 보따리", desc: "행운 +300%, 속도 -100%", cost: 3000, luck: 3.00, speed: -1.00, color: "#FF7043", reqAuras: { "THE_FOOL": 1 } },
    { id: 74, name: "마법사의 지팡이", desc: "행운 +150%, 속도 +150%", cost: 3500, luck: 1.50, speed: 1.50, color: "#AB47BC", reqAuras: { "MAGICIAN": 1 } },

    // 👉 [신규 확장 3] 공명 & 초거대 기상 (비용 3,100 ~ 4,500 구간)
    { id: 75, name: "공명석", desc: "행운 +200%, 속도 +200%", cost: 3100, luck: 2.00, speed: 2.00, color: "#4DD0E1", reqAuras: { "RESONANCE": 2 } },
    { id: 76, name: "간헐천 코어", desc: "행운 +100%, 속도 +250%", cost: 3200, luck: 1.00, speed: 2.50, color: "#80DEEA", reqAuras: { "GEYSER": 2 } },
    { id: 77, name: "지옥불 대검", desc: "행운 +320%", cost: 3300, luck: 3.20, speed: 0, color: "#B71C1C", reqAuras: { "HELLFIRE": 2 } },
    { id: 78, name: "연옥의 사슬", desc: "행운 +330%", cost: 3600, luck: 3.30, speed: 0, color: "#D84315", reqAuras: { "HELLFIRE": 1, "VOLCANO": 1 } },
    { id: 79, name: "눈사태 파쇄기", desc: "속도 +330%", cost: 3800, luck: 0, speed: 3.30, color: "#ECEFF1", reqAuras: { "AVALANCHE": 2 } },

    // [기존 코드 이음] 비용 4,000 ~ 4,000
    { id: 80, name: "이진법 렌즈", desc: "속도 +300%", cost: 4000, luck: 0, speed: 3.00, color: "#4CAF50", reqAuras: { "BINARY": 1 } },

    // 👉 [신규 확장 4] 태풍 & 한계 돌파 직전 (비용 4,200 ~ 5,500 구간)
    { id: 81, name: "태풍의 눈동자", desc: "속도 +350%", cost: 4200, luck: 0, speed: 3.50, color: "#546E7A", reqAuras: { "TYPHOON": 2 } },
    { id: 82, name: "수룡의 비늘", desc: "속도 +380%", cost: 4500, luck: 0, speed: 3.80, color: "#1976D2", reqAuras: { "TSUNAMI": 1, "TYPHOON": 1 } },
    
    // [기존 코드 이음] 비용 5,000 ~ 5,000
    { id: 83, name: "여사제의 면사포", desc: "행운 +350%", cost: 5000, luck: 3.50, speed: 0, color: "#5C6BC0", reqAuras: { "HIGH_PRIESTESS": 1 } },

    // 👉 [신규 확장 5] 기적의 무지개 (비용 5,200 ~ 5,500 구간)
    { id: 84, name: "무지개 브로치", desc: "행운 +360%", cost: 5200, luck: 3.60, speed: 0, color: "#E040FB", reqAuras: { "RAINBOW": 2 } },
    { id: 85, name: "유령선의 닻", desc: "행운 +380%", cost: 5500, luck: 3.80, speed: 0, color: "#78909C", reqAuras: { "PHANTOM": 1, "FOG_BANK": 3 } },

    // [기존 코드 이음] 비용 6,000 ~ 7,500
    { id: 86, name: "릿-코드 키보드", desc: "속도 +350%", cost: 6000, luck: 0, speed: 3.50, color: "#76FF03", reqAuras: { "LEET_CODE": 1 } },

    // 👉 [신규 확장 6] 에베레스트 & 9000 밈 (비용 6,500 ~ 8,000 구간)
    { id: 87, name: "얼어붙은 정상", desc: "속도 +390%", cost: 6500, luck: 0, speed: 3.90, color: "#CFD8DC", reqAuras: { "AVALANCHE": 1, "BLIZZARD": 1 } },
    { id: 88, name: "에베레스트 등반화", desc: "속도 +400%", cost: 7000, luck: 0, speed: 4.00, color: "#B0BEC5", reqAuras: { "EVEREST": 2 } },
    { id: 89, name: "희망의 오라클", desc: "행운 +400%", cost: 7200, luck: 4.00, speed: 0, color: "#E1BEE7", reqAuras: { "RAINBOW": 1, "HALO": 3 } },

    // [기존 코드 이음] 비용 7,500 ~ 7,500
    { id: 90, name: "황제의 왕관", desc: "행운 +400%", cost: 7500, luck: 4.00, speed: 0, color: "#D32F2F", reqAuras: { "EMPEROR": 1 } },

    // 👉 [신규 확장 7] 스카우터 파괴 & 조화 (비용 8,000 ~ 8,500 구간)
    { id: 91, name: "깨진 스카우터", desc: "행운 +420%", cost: 8000, luck: 4.20, speed: 0, color: "#FFEB3B", reqAuras: { "OVER_9000": 2 } },
    { id: 92, name: "조화의 반지", desc: "행운 +250%, 속도 +250%", cost: 8500, luck: 2.50, speed: 2.50, color: "#CE93D8", reqAuras: { "TRINITY": 1, "RESONANCE": 1 } },

    // [기존 코드 이음] 비용 9,000 ~ 9,000
    { id: 93, name: "연인들의 펜던트", desc: "행운 +200%, 속도 +200%", cost: 9000, luck: 2.00, speed: 2.00, color: "#FF80AB", reqAuras: { "LOVERS": 1, "VALENTINE": 1 } },

    // 👉 [신규 확장 8] 리미트 브레이크 (비용 9,500 ~ 10,800 구간)
    { id: 94, name: "한계돌파의 증표", desc: "속도 +450%", cost: 9500, luck: 0, speed: 4.50, color: "#FF1744", reqAuras: { "LIMIT_BREAK": 2 } },
    { id: 95, name: "초기화된 파워미터", desc: "행운 +450%, 속도 +450%", cost: 10500, luck: 4.50, speed: 4.50, color: "#FF5252", reqAuras: { "LIMIT_BREAK": 1, "OVER_9000": 1 } },
    { id: 96, name: "세계의 지붕 망토", desc: "속도 +480%", cost: 10800, luck: 0, speed: 4.80, color: "#90A4AE", reqAuras: { "EVEREST": 1, "BLIZZARD": 2 } },

    // [여기서부터는 기존 후반부 데이터 이음] ID 97번부터 기존 ID 66~150이 그대로 들어갑니다.
    { id: 97, name: "전차의 바퀴", desc: "속도 +450%", cost: 11000, luck: 0, speed: 4.50, color: "#FBC02D", reqAuras: { "CHARIOT": 1 } },
    { id: 98, name: "은자의 등불", desc: "행운 +500%, 속도 -200%", cost: 13000, luck: 5.00, speed: -2.00, color: "#78909C", reqAuras: { "HERMIT": 1 } },
    { id: 99, name: "운명의 수레바퀴", desc: "행운 +500%, 속도 +500%", cost: 16000, luck: 5.00, speed: 5.00, color: "#FFD700", reqAuras: { "FORTUNE_WHEEL": 1 } },
    { id: 100, name: "정의의 천칭", desc: "행운 +600%", cost: 20000, luck: 6.00, speed: 0, color: "#B0BEC5", reqAuras: { "JUSTICE": 1 } },
    { id: 101, name: "매달린 자의 밧줄", desc: "속도 +600%", cost: 25000, luck: 0, speed: 6.00, color: "#9575CD", reqAuras: { "HANGED_MAN": 1 } },
    { id: 102, name: "사신의 낫", desc: "행운 +750%, 속도 +200%", cost: 30000, luck: 7.50, speed: 2.00, color: "#212121", reqAuras: { "DEATH_TAROT": 1 } },
    { id: 103, name: "절제의 술잔", desc: "행운 +300%, 속도 +450%", cost: 35000, luck: 3.00, speed: 4.50, color: "#80CBC4", reqAuras: { "TEMPERANCE": 1 } },
    { id: 104, name: "붕괴된 탑의 파편", desc: "속도 +800%, 행운 -300%", cost: 40000, luck: -3.00, speed: 8.00, color: "#BF360C", reqAuras: { "THE_TOWER": 1 } },
    { id: 105, name: "파이(π) 나침반", desc: "행운 +800%", cost: 48000, luck: 8.00, speed: 0, color: "#00BCD4", reqAuras: { "PI_RATE": 1 } },
    { id: 106, name: "별의 이정표", desc: "속도 +900%", cost: 58000, luck: 0, speed: 9.00, color: "#B3E5FC", reqAuras: { "THE_STAR": 1 } },

    // [Lv.5 후반 초자연 & 광물: 비용 70,000 ~ 750,000 구간]
    { id: 107, name: "달의 그림자", desc: "행운 +950%", cost: 70000, luck: 9.50, speed: 0, color: "#E0E0E0", reqAuras: { "THE_MOON": 1 } },
    { id: 108, name: "태양의 찬가", desc: "속도 +1000%", cost: 85000, luck: 0, speed: 10.00, color: "#FFC107", reqAuras: { "THE_SUN": 1 } },
    { id: 109, name: "심판의 나팔", desc: "행운 +1200%, 속도 +1200%", cost: 100000, luck: 12.00, speed: 12.00, color: "#FFA000", reqAuras: { "JUDGMENT": 1 } },
    { id: 110, name: "세계수의 가지", desc: "행운 +1500%", cost: 120000, luck: 15.00, speed: 0, color: "#81C784", reqAuras: { "THE_WORLD": 1 } },
    { id: 111, name: "세잎 클로버", desc: "행운 +1800%", cost: 150000, luck: 18.00, speed: 0, color: "#2E7D32", reqAuras: { "CLOVER": 1 } },
    { id: 112, name: "럭키 세븐 코인", desc: "행운 +2500%", cost: 180000, luck: 25.00, speed: 0, color: "#FFD700", reqAuras: { "LUCKY_SEVEN": 1 } },
    { id: 113, name: "8번 당구공", desc: "행운 +3000%, 속도 -500%", cost: 220000, luck: 30.00, speed: -5.00, color: "#000000", reqAuras: { "EIGHT_BALL": 1 } },
    { id: 114, name: "공각기동대 USB", desc: "속도 +3000%", cost: 260000, luck: 0, speed: 30.00, color: "#00E5FF", reqAuras: { "GHOST_IN_SHELL": 1 } },
    { id: 115, name: "일루미나티의 눈", desc: "행운 +4000%", cost: 320000, luck: 40.00, speed: 0, color: "#F9A825", reqAuras: { "ILLUMINATI": 1 } },
    { id: 116, name: "피보나치 나선", desc: "행운 +3000%, 속도 +3000%", cost: 400000, luck: 30.00, speed: 30.00, color: "#8E24AA", reqAuras: { "FIBONACCI": 1 } },
    { id: 117, name: "회문(Palindrome) 거울", desc: "행운 +5000%", cost: 500000, luck: 50.00, speed: 0, color: "#42A5F5", reqAuras: { "PALINDROME": 1 } },
    { id: 118, name: "황금비율의 자", desc: "행운 +4000%, 속도 +4000%", cost: 600000, luck: 40.00, speed: 40.00, color: "#FFCA28", reqAuras: { "GOLDEN_RATIO": 1 } },
    { id: 119, name: "해커의 검은 모자", desc: "속도 +6000%", cost: 750000, luck: 0, speed: 60.00, color: "#388E3C", reqAuras: { "HACKER": 1 } },

    // [Lv.6 극후반: 비용 900,000 ~ 18,000,000 구간]
    { id: 120, name: "검은 고양이 부적", desc: "행운 -1000%, 속도 +8000%", cost: 900000, luck: -10.00, speed: 80.00, color: "#1A1A1A", reqAuras: { "BLACK_CAT": 1 } },
    { id: 121, name: "심연의 닻", desc: "행운 +8000%", cost: 1100000, luck: 80.00, speed: 0, color: "#1A237E", reqAuras: { "ABYSSAL": 2 } },
    { id: 122, name: "절대영도 냉각기", desc: "속도 +10000%", cost: 1300000, luck: 0, speed: 100.00, color: "#E1F5FE", reqAuras: { "ABSOLUTE_ZERO": 1 } },
    { id: 123, name: "광속의 신발", desc: "속도 +12000%", cost: 1600000, luck: 0, speed: 120.00, color: "#FFFFFF", reqAuras: { "SPEED_OF_LIGHT": 1 } },
    { id: 124, name: "풀하우스 칩", desc: "행운 +15000%", cost: 2000000, luck: 150.00, speed: 0, color: "#F06292", reqAuras: { "FULL_HOUSE": 1 } },
    { id: 125, name: "404 글리치 방패", desc: "행운 +12000%, 속도 +12000%", cost: 2500000, luck: 120.00, speed: 120.00, color: "#FF1744", reqAuras: { "ERROR_404": 1 } },
    { id: 126, name: "로얄 플러시 카드", desc: "행운 +25000%", cost: 3200000, luck: 250.00, speed: 0, color: "#D32F2F", reqAuras: { "ROYAL_FLUSH": 1 } },
    { id: 127, name: "오망성 소환진", desc: "행운 +30000%", cost: 4000000, luck: 300.00, speed: 0, color: "#C2185B", reqAuras: { "PENTAGRAM": 1 } },
    { id: 128, name: "야수의 송곳니", desc: "속도 +35000%", cost: 5000000, luck: 0, speed: 350.00, color: "#B71C1C", reqAuras: { "BEAST_MODE": 1 } },
    { id: 129, name: "잭팟 슬롯 머신", desc: "행운 +50000%", cost: 6500000, luck: 500.00, speed: 0, color: "#FFD700", reqAuras: { "JACKPOT": 1 } },
    { id: 130, name: "뫼비우스의 띠", desc: "속도 +50000%", cost: 8000000, luck: 0, speed: 500.00, color: "#2196F3", reqAuras: { "INFINITY_LOOP": 1 } },
    { id: 131, name: "구미호의 여우구슬", desc: "행운 +40000%, 속도 +40000%", cost: 10000000, luck: 400.00, speed: 400.00, color: "#FF5722", reqAuras: { "NINE_TAILS": 1 } },
    { id: 132, name: "일식의 로브", desc: "행운 +60000%", cost: 12000000, luck: 600.00, speed: 0, color: "#FF6D00", reqAuras: { "SOLAR_ECLIPSE": 1 } },
    { id: 133, name: "공허의 인도자", desc: "속도 +80000%", cost: 15000000, luck: 0, speed: 800.00, color: "#4A148C", reqAuras: { "VOID": 1 } },
    { id: 134, name: "차원 균열기", desc: "행운 +80000%", cost: 18000000, luck: 800.00, speed: 0, color: "#7B1FA2", reqAuras: { "DIMENSION_RIFT": 1 } },

    // [Lv.7 초월 우주 & 메탈: 비용 22,000,000 ~ 100,000,000 구간]
    { id: 135, name: "루비의 열정", desc: "행운 +100000%", cost: 22000000, luck: 1000.00, speed: 0, color: "#E53935", reqAuras: { "RUBY": 1 } },
    { id: 136, name: "사파이어의 지혜", desc: "속도 +100000%", cost: 22000000, luck: 0, speed: 1000.00, color: "#1E88E5", reqAuras: { "SAPPHIRE": 1 } },
    { id: 137, name: "에메랄드의 조화", desc: "행운 +80000%, 속도 +80000%", cost: 26000000, luck: 800.00, speed: 800.00, color: "#43A047", reqAuras: { "EMERALD": 1 } },
    { id: 138, name: "다이아몬드 방패", desc: "행운 +150000%", cost: 30000000, luck: 1500.00, speed: 0, color: "#E0F7FA", reqAuras: { "DIAMOND": 1 } },
    { id: 139, name: "자수정의 영안", desc: "속도 +150000%", cost: 35000000, luck: 0, speed: 1500.00, color: "#8E24AA", reqAuras: { "AMETHYST": 1 } },
    { id: 140, name: "흑요석 단검", desc: "행운 +120000%, 속도 +120000%", cost: 40000000, luck: 1200.00, speed: 1200.00, color: "#212121", reqAuras: { "OBSIDIAN": 1 } },
    { id: 141, name: "티타늄 갑주", desc: "행운 +200000%", cost: 45000000, luck: 2000.00, speed: 0, color: "#B0BEC5", reqAuras: { "TITANIUM": 1 } },
    { id: 142, name: "미스릴 체인", desc: "속도 +200000%", cost: 50000000, luck: 0, speed: 2000.00, color: "#CFD8DC", reqAuras: { "MITHRIL": 1 } },
    { id: 143, name: "오리할콘 대검", desc: "행운 +180000%, 속도 +180000%", cost: 55000000, luck: 1800.00, speed: 1800.00, color: "#FFB300", reqAuras: { "ORICHALCUM": 1 } },
    { id: 144, name: "아다만티움 코어", desc: "행운 +250000%", cost: 60000000, luck: 2500.00, speed: 0, color: "#37474F", reqAuras: { "ADAMANTIUM": 1 } },
    { id: 145, name: "제논 램프", desc: "속도 +250000%", cost: 60000000, luck: 0, speed: 2500.00, color: "#7E57C2", reqAuras: { "XENON": 1 } },
    { id: 146, name: "크립톤 건전지", desc: "행운 +220000%, 속도 +220000%", cost: 65000000, luck: 2200.00, speed: 2200.00, color: "#66BB6A", reqAuras: { "KRYPTON": 1 } },
    { id: 147, name: "네온 사인", desc: "행운 +300000%", cost: 70000000, luck: 3000.00, speed: 0, color: "#FF4081", reqAuras: { "NEON": 1 } },
    { id: 148, name: "분노의 도끼", desc: "속도 +300000%", cost: 75000000, luck: 0, speed: 3000.00, color: "#D32F2F", reqAuras: { "WRATH": 1 } },
    { id: 149, name: "탐욕의 주머니", desc: "행운 +350000%", cost: 80000000, luck: 3500.00, speed: 0, color: "#388E3C", reqAuras: { "GREED": 1 } },
    { id: 150, name: "별의 파편", desc: "행운 +400000%", cost: 85000000, luck: 4000.00, speed: 0, color: "#E57373", reqAuras: { "ASTRAL": 1 } },
    { id: 151, name: "성운의 눈", desc: "속도 +400000%", cost: 90000000, luck: 0, speed: 4000.00, color: "#81C784", reqAuras: { "NEBULA": 1 } },
    { id: 152, name: "코스모스 망토", desc: "행운 +350000%, 속도 +350000%", cost: 95000000, luck: 3500.00, speed: 3500.00, color: "#64B5F6", reqAuras: { "COSMOS": 1 } },
    { id: 153, name: "퀘이사의 빛", desc: "행운 +500000%", cost: 100000000, luck: 5000.00, speed: 0, color: "#FFD54F", reqAuras: { "QUASAR": 1 } },

    // [Lv.8 최종 우주/물리학: 비용 105,000,000 ~ 240,000,000 구간]
    { id: 154, name: "펄서 비콘", desc: "속도 +500000%", cost: 105000000, luck: 0, speed: 5000.00, color: "#BA68C8", reqAuras: { "PULSAR": 1 } },
    { id: 155, name: "마그네타 실드", desc: "행운 +600000%", cost: 110000000, luck: 6000.00, speed: 0, color: "#A1887F", reqAuras: { "MAGNETAR": 1 } },
    { id: 156, name: "중성자 별 목걸이", desc: "속도 +600000%", cost: 115000000, luck: 0, speed: 6000.00, color: "#E57373", reqAuras: { "NEUTRON_STAR": 1 } },
    { id: 157, name: "초거성의 왕관", desc: "행운 +500000%, 속도 +500000%", cost: 120000000, luck: 5000.00, speed: 5000.00, color: "#BA68C8", reqAuras: { "SUPER_GIANT": 1 } },
    { id: 158, name: "블랙홀 응축기", desc: "행운 +800000%", cost: 130000000, luck: 8000.00, speed: 0, color: "#000000", reqAuras: { "BLACK_HOLE": 1 } },
    { id: 159, name: "화이트홀 방출기", desc: "속도 +800000%", cost: 135000000, luck: 0, speed: 8000.00, color: "#FFFFFF", reqAuras: { "WHITE_HOLE": 1 } },
    { id: 160, name: "웜홀 게이트", desc: "행운 +700000%, 속도 +700000%", cost: 140000000, luck: 7000.00, speed: 7000.00, color: "#00E5FF", reqAuras: { "WORMHOLE": 1 } },
    { id: 161, name: "빅뱅 코어", desc: "행운 +1000000%", cost: 150000000, luck: 10000.00, speed: 0, color: "#FF1744", reqAuras: { "BIG_BANG": 1 } },
    { id: 162, name: "양자 도약기", desc: "속도 +1000000%", cost: 155000000, luck: 0, speed: 10000.00, color: "#A1887F", reqAuras: { "QUANTUM": 1 } },
    { id: 163, name: "초끈의 조율자", desc: "행운 +1200000%", cost: 160000000, luck: 12000.00, speed: 0, color: "#E57373", reqAuras: { "STRING": 1 } },
    { id: 164, name: "중력 앵커", desc: "속도 +1200000%", cost: 165000000, luck: 0, speed: 12000.00, color: "#81C784", reqAuras: { "GRAVITY": 1 } },
    { id: 165, name: "엔트로피 흡수체", desc: "행운 +1100000%, 속도 +1100000%", cost: 170000000, luck: 11000.00, speed: 11000.00, color: "#64B5F6", reqAuras: { "ENTROPY": 1 } },
    { id: 166, name: "감마선 폭발기", desc: "행운 +1500000%", cost: 175000000, luck: 15000.00, speed: 0, color: "#FFD54F", reqAuras: { "GAMMA_RAY": 1 } },
    { id: 167, name: "광자 블래스터", desc: "속도 +1500000%", cost: 180000000, luck: 0, speed: 15000.00, color: "#FFD54F", reqAuras: { "PHOTON": 1 } },
    { id: 168, name: "쿼크 융합로", desc: "행운 +1400000%, 속도 +1400000%", cost: 185000000, luck: 14000.00, speed: 14000.00, color: "#81C784", reqAuras: { "QUARK": 1 } },
    { id: 169, name: "보손 필드", desc: "행운 +1800000%", cost: 190000000, luck: 18000.00, speed: 0, color: "#FFD54F", reqAuras: { "BOSON": 1 } },
    { id: 170, name: "페르미온 슈트", desc: "속도 +1800000%", cost: 195000000, luck: 0, speed: 18000.00, color: "#BA68C8", reqAuras: { "FERMION": 1 } },
    { id: 171, name: "중력자 부츠", desc: "행운 +1700000%, 속도 +1700000%", cost: 200000000, luck: 17000.00, speed: 17000.00, color: "#A1887F", reqAuras: { "GRAVITON": 1 } },
    { id: 172, name: "타키온 드라이브", desc: "속도 +2100000%", cost: 205000000, luck: 0, speed: 21000.00, color: "#E57373", reqAuras: { "TACHYON": 1 } },
    { id: 173, name: "액시온 제너레이터", desc: "행운 +2100000%", cost: 210000000, luck: 21000.00, speed: 0, color: "#81C784", reqAuras: { "AXION": 1 } },
    { id: 174, name: "힉스 보손의 열쇠", desc: "행운 +2000000%, 속도 +2000000%", cost: 215000000, luck: 20000.00, speed: 20000.00, color: "#BA68C8", reqAuras: { "HIGGS_BOSON": 1 } },
    { id: 175, name: "M-이론의 성물", desc: "행운 +2300000%", cost: 220000000, luck: 23000.00, speed: 0, color: "#A1887F", reqAuras: { "M_THEORY": 1 } },
    { id: 176, name: "대통일 이론서", desc: "속도 +2300000%", cost: 225000000, luck: 0, speed: 23000.00, color: "#64B5F6", reqAuras: { "ULTIMATE": 1 } },
    { id: 177, name: "오메가의 시계", desc: "행운 +2400000%, 속도 +2400000%", cost: 230000000, luck: 24000.00, speed: 24000.00, color: "#BA68C8", reqAuras: { "OMEGA": 1 } },
    { id: 178, name: "신의 영역", desc: "행운 +2450000%, 속도 +2450000%", cost: 235000000, luck: 25000.00, speed: 25000.00, color: "#FFD54F", reqAuras: { "OMNIPOTENCE": 1 } },
    
    // [종결 180번] 기존 150번이었던 최종 아이템
    { id: 180, name: "THE LAST ANSWER", desc: "행운 +2500000%, 속도 +2500000%", cost: 240000000, luck: 25000.00, speed: 25000.00, color: "#FFFFFF", reqAuras: { "The Away From The World": 1 } }
];

        // 1. 소비 아이템 (채집 + 몬스터 전리품 + 물약) 통합 DB
export const consumableDB = {
    // [A] 배경 채집: 기초 재료 (촉매제 역할)
    "clear": { id: "clear", name: "태양의 열매", desc: "30초간 행운 +50%", color: "#FFD700", type: "luck", val: 0.5, duration: 30, host: "tree" },
    "cloudy": { id: "cloudy", name: "구름 솜사탕", desc: "30초간 속도 +50%", color: "#B0BEC5", type: "speed", val: 0.5, duration: 30, host: "tree" },
    "rain": { id: "rain", name: "영롱한 이슬", desc: "20초간 행운 +100%", color: "#64B5F6", type: "luck", val: 1.0, duration: 20, host: "grass" },
    "snow": { id: "snow", name: "서리꽃 사과", desc: "20초간 속도 +100%", color: "#81D4FA", type: "speed", val: 1.0, duration: 20, host: "tree" },
    "wind": { id: "wind", name: "바람의 사과", desc: "15초간 속도 +200%", color: "#81C784", type: "speed", val: 2.0, duration: 15, host: "tree" },
    "thunder": { id: "thunder", name: "번개 버섯", desc: "15초간 행운 +200%", color: "#FFEB3B", type: "luck", val: 2.0, duration: 15, host: "grass" },
    "foggy": { id: "foggy", name: "안개꽃", desc: "10초간 행운/속도 +150%", color: "#CFD8DC", type: "both", val: 1.5, duration: 10, host: "grass" },

    // [B] 몬스터 전용 전리품 (제작 핵심 재료)
    "nut_light": { id: "nut_light", name: "태양의 견과", desc: "고소한 빛의 정수 (재료)", color: "#FFD54F", isMaterial: true },
    "frog_skin": { id: "frog_skin", name: "미끌미끌한 가죽", desc: "습기를 머금은 가죽 (재료)", color: "#4CAF50", isMaterial: true },
    "rabbit_fur": { id: "rabbit_fur", name: "폭신한 토끼털", desc: "부드러운 냉기의 털 (재료)", color: "#FAFAFA", isMaterial: true },
    "spirit_wing": { id: "spirit_wing", name: "정령의 날개깃", desc: "무게가 없는 깃털 (재료)", color: "#B2DFDB", isMaterial: true },
    "volt_scale": { id: "volt_scale", name: "정전기 비늘", desc: "찌릿한 전기가 흐르는 비늘 (재료)", color: "#FFEB3B", isMaterial: true },
    "fairy_dust": { id: "fairy_dust", name: "요정의 가루", desc: "차원을 넘나드는 가루 (재료)", color: "#F48FB1", isMaterial: true },
    "shadow_beak": { id: "shadow_beak", name: "그림자 부리", desc: "빛을 삼키는 부리 (재료)", color: "#424242", isMaterial: true },
    "blood_fang": { id: "blood_fang", name: "핏빛 송곳니", desc: "생명력을 갈구하는 이빨 (재료)", color: "#B71C1C", isMaterial: true },
    "core_glitch": { id: "core_glitch", name: "손상된 코어", desc: "데이터가 파손된 핵 (재료)", color: "#00E5FF", isMaterial: true },

    // [C] 제작된 물약 (몬스터 재료 기반) - 30여종
    "p_sun_juice": { id: "p_sun_juice", name: "솔라 앰플", desc: "60초간 행운 +300%", color: "#FF8F00", type: "luck", val: 3.0, duration: 60, isPotion: true },
    "p_aqua_tea": { id: "p_aqua_tea", name: "심해의 눈물", desc: "60초간 행운 +500%", color: "#0277BD", type: "luck", val: 5.0, duration: 60, isPotion: true },
    "p_ice_cream": { id: "p_ice_cream", name: "프로스트 쉐이크", desc: "60초간 속도 +500%", color: "#E1F5FE", type: "speed", val: 5.0, duration: 60, isPotion: true },
    "p_wind_tonic": { id: "p_wind_tonic", name: "폭풍의 비약", desc: "45초간 속도 +1200%", color: "#26A69A", type: "speed", val: 12.0, duration: 45, isPotion: true },
    "p_volt_coffee": { id: "p_volt_coffee", name: "과충전 에스프레소", desc: "30초간 속도 +2500%", color: "#FFEE58", type: "speed", val: 25.0, duration: 30, isPotion: true },
    "p_fairy_perfume": { id: "p_fairy_perfume", name: "환상향의 향수", desc: "60초간 행운/속도 +800%", color: "#F06292", type: "both", val: 8.0, duration: 60, isPotion: true },
    
    "p_dark_matter": { id: "p_dark_matter", name: "암흑 물질 포션", desc: "90초간 행운 +5000%", color: "#212121", type: "luck", val: 50.0, duration: 90, isPotion: true },
    "p_vampire_blood": { id: "p_vampire_blood", name: "진조의 혈액", desc: "90초간 속도 +5000%", color: "#D32F2F", type: "speed", val: 50.0, duration: 90, isPotion: true },
    "p_void_msg": { id: "p_void_msg", name: "보이드 소스", desc: "60초간 행운/속도 +15000%", color: "#00E5FF", type: "both", val: 150.0, duration: 60, isPotion: true },

    "p_squirrel_luck": { id: "p_squirrel_luck", name: "다람쥐의 축복", desc: "120초간 행운 +200%", color: "#A1887F", type: "luck", val: 2.0, duration: 120, isPotion: true },
    "p_frog_agility": { id: "p_frog_agility", name: "개구리 점프", desc: "120초간 속도 +200%", color: "#81C784", type: "speed", val: 2.0, duration: 120, isPotion: true },
    "p_rabbit_freeze": { id: "p_rabbit_freeze", name: "동토의 정수", desc: "60초간 행운 +1000%", color: "#B2EBF2", type: "luck", val: 10.0, duration: 60, isPotion: true },
    
    "p_elemental": { id: "p_elemental", name: "엘리멘탈 브루", desc: "60초간 행운/속도 +3000%", color: "#FFF176", type: "both", val: 30.0, duration: 60, isPotion: true },
    "p_dimension": { id: "p_dimension", name: "차원 여행자의 술", desc: "180초간 속도 +1000%", color: "#9575CD", type: "speed", val: 10.0, duration: 180, isPotion: true },
    "p_stella": { id: "p_stella", name: "성좌의 가루약", desc: "60초간 행운 +10000%", color: "#E1BEE7", type: "luck", val: 100.0, duration: 60, isPotion: true },

    "p_glitch_god": { id: "p_glitch_god", name: "디버그 모드 시약", desc: "30초간 행운/속도 +50000%", color: "#00FF41", type: "both", val: 500.0, duration: 30, isPotion: true },
    "p_miracle": { id: "p_miracle", name: "운명의 미라클", desc: "10초간 행운 +1,000,000%", color: "#FFD700", type: "luck", val: 10000.0, duration: 10, isPotion: true },

    // 기존 물약 라인업 (유지)
    "potion_luck_1": { id: "potion_luck_1", name: "[하급] 행운의 물약", desc: "60초간 행운 +100%", color: "#FDD835", type: "luck", val: 1.0, duration: 60, isPotion: true },
    "potion_speed_1": { id: "potion_speed_1", name: "[하급] 신속의 물약", desc: "60초간 속도 +100%", color: "#4FC3F7", type: "speed", val: 1.0, duration: 60, isPotion: true },
    "potion_luck_2": { id: "potion_luck_2", name: "[중급] 행운의 물약", desc: "60초간 행운 +500%", color: "#FBC02D", type: "luck", val: 5.0, duration: 60, isPotion: true },
    "potion_speed_2": { id: "potion_speed_2", name: "[중급] 신속의 물약", desc: "60초간 속도 +500%", color: "#039BE5", type: "speed", val: 5.0, duration: 60, isPotion: true },
    "potion_luck_3": { id: "potion_luck_3", name: "[상급] 행운의 물약", desc: "60초간 행운 +2500%", color: "#FF9800", type: "luck", val: 25.0, duration: 60, isPotion: true },
    "potion_speed_3": { id: "potion_speed_3", name: "[상급] 신속의 물약", desc: "60초간 속도 +2500%", color: "#1976D2", type: "speed", val: 25.0, duration: 60, isPotion: true },
    "potion_ultimate": { id: "potion_ultimate", name: "[최상급] 초월의 영약", desc: "60초간 행운/속도 +25000%", color: "#E040FB", type: "both", val: 250.0, duration: 60, isPotion: true }
};

// 2. 확장된 연금술(물약 제작) 레시피 - 몬스터 전리품 위주
export const potionRecipes = [
    // [Lv.1 정수 시리즈]
    { result: "p_squirrel_luck", reqItems: { "nut_light": 5, "clear": 3 }, reqAuras: {} },
    { result: "p_frog_agility", reqItems: { "frog_skin": 5, "rain": 3 }, reqAuras: {} },
    { result: "p_rabbit_freeze", reqItems: { "rabbit_fur": 5, "snow": 3 }, reqAuras: {} },

    // [Lv.2 중급 앰플]
    { result: "p_sun_juice", reqItems: { "p_squirrel_luck": 2, "clear": 10 }, reqAuras: { "SUNBEAM": 1 } },
    { result: "p_aqua_tea", reqItems: { "frog_skin": 10, "rain": 10 }, reqAuras: { "SQUALL": 1 } },
    { result: "p_ice_cream", reqItems: { "rabbit_fur": 10, "snow": 10 }, reqAuras: { "BLIZZARD": 1 } },

    // [Lv.3 고성능 토닉]
    { result: "p_wind_tonic", reqItems: { "spirit_wing": 5, "wind": 10 }, reqAuras: { "ZEPHYR": 1 } },
    { result: "p_volt_coffee", reqItems: { "volt_scale": 5, "thunder": 10 }, reqAuras: { "THUNDERBOLT": 1 } },
    { result: "p_fairy_perfume", reqItems: { "fairy_dust": 5, "foggy": 10 }, reqAuras: { "MIRAGE": 1 } },

    // [Lv.4 마스터 포션 (혼합)]
    { result: "p_elemental", reqItems: { "p_sun_juice": 2, "p_aqua_tea": 2, "p_ice_cream": 2 }, reqAuras: { "ASTRUM": 1 } },
    { result: "p_dimension", reqItems: { "fairy_dust": 20, "p_wind_tonic": 3 }, reqAuras: { "VOID": 1 } },
    { result: "p_stella", reqItems: { "fairy_dust": 15, "p_volt_coffee": 3 }, reqAuras: { "CELESTIAL": 1 } },

    // [Lv.5 재앙/신화급 소모품]
    { result: "p_dark_matter", reqItems: { "shadow_beak": 10, "p_stella": 2 }, reqAuras: { "ECLIPSE": 1 } },
    { result: "p_vampire_blood", reqItems: { "blood_fang": 10, "p_elemental": 2 }, reqAuras: { "BLOOD_MOON": 1 } },
    { result: "p_void_msg", reqItems: { "core_glitch": 5, "p_dark_matter": 1, "p_vampire_blood": 1 }, reqAuras: { "GLITCH": 1 } },

    // [Lv.MAX 신의 시약]
    { result: "p_glitch_god", reqItems: { "core_glitch": 20, "potion_ultimate": 1 }, reqAuras: { "OMNIPOTENCE": 1 } },
    { result: "p_miracle", reqItems: { "core_glitch": 50, "p_void_msg": 5 }, reqAuras: { "The Away From The World": 1 } },

    // 기존 물약 레시피 (유지)
    { result: "potion_luck_1", reqItems: { "clear": 3, "thunder": 2 }, reqAuras: {} },
    { result: "potion_speed_1", reqItems: { "cloudy": 3, "snow": 2 }, reqAuras: {} },
    { result: "potion_luck_2", reqItems: { "potion_luck_1": 2, "foggy": 5 }, reqAuras: { "UNCOMMON": 3 } },
    { result: "potion_speed_2", reqItems: { "potion_speed_1": 2, "wind": 5 }, reqAuras: { "RARE": 2 } },
    { result: "potion_luck_3", reqItems: { "potion_luck_2": 3 }, reqAuras: { "CELESTIAL": 1, "JACKPOT": 1 } },
    { result: "potion_speed_3", reqItems: { "potion_speed_2": 3 }, reqAuras: { "SPEED_OF_LIGHT": 1 } },
    { result: "potion_ultimate", reqItems: { "potion_luck_3": 3, "potion_speed_3": 3 }, reqAuras: { "CREATOR": 1, "THE_WORLD": 1 } }
];