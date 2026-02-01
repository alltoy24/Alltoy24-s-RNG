export const gearDB = [
    // =========================================================================
    // [Tier 1: 입문] (Lv.1~20) - 자연과 기초
    // =========================================================================
    { id: 1, name: "나무 반지", desc: "행운 +5%", cost: 10, luck: 0.05, speed: 0, color: "#8D6E63", reqAuras: { "COMMON": 30, "DEW": 5 } },
    { id: 2, name: "돌멩이 부적", desc: "속도 +5%", cost: 10, luck: 0, speed: 0.05, color: "#9E9E9E", reqAuras: { "COMMON": 30, "ASHEN": 5 } },
    { id: 3, name: "이슬 반지", desc: "행운 +7%", cost: 20, luck: 0.07, speed: 0, color: "#B3E5FC", reqAuras: { "DEW": 20, "DROPLET": 5, "COMMON": 50 } },
    { id: 4, name: "새싹 귀걸이", desc: "행운 +5%, 속도 +5%", cost: 30, luck: 0.05, speed: 0.05, color: "#81C784", reqAuras: { "UNCOMMON": 10, "DEW": 15, "SUNBEAM": 5 } },
    { id: 5, name: "민들레 목걸이", desc: "속도 +10%", cost: 40, luck: 0, speed: 0.10, color: "#FFEB3B", reqAuras: { "BREEZE": 25, "SUNSHINE": 10, "UNCOMMON": 15 } },
    { id: 6, name: "장작 불씨", desc: "행운 +12%", cost: 50, luck: 0.12, speed: 0, color: "#FF5722", reqAuras: { "EMBER": 20, "SPARK": 10, "COMMON": 100 } },
    { id: 7, name: "물방울 브로치", desc: "행운 +15%", cost: 60, luck: 0.15, speed: 0, color: "#90CAF9", reqAuras: { "DROPLET": 40, "DRIZZLE": 10, "DEW": 30 } },
    { id: 8, name: "반딧불이 랜턴", desc: "행운 +18%", cost: 70, luck: 0.18, speed: 0.02, color: "#69F0AE", reqAuras: { "GHOST_LIGHT": 25, "MIST": 15, "DUSK": 5 } },
    { id: 9, name: "노을빛 망토", desc: "행운 +20%", cost: 80, luck: 0.20, speed: 0, color: "#FFAB40", reqAuras: { "AFTERGLOW": 30, "SUNBEAM": 15, "DUSK": 10 } },
    { id: 10, name: "안개 장화", desc: "속도 +20%", cost: 100, luck: 0, speed: 0.20, color: "#B0BEC5", reqAuras: { "MIST": 50, "OVERCAST": 20, "BREEZE": 30 } },
    { id: 11, name: "구리 반지", desc: "행운 +22%", cost: 120, luck: 0.22, speed: 0, color: "#D7CCC8", reqAuras: { "COMMON": 300, "UNCOMMON": 50, "RARE": 5 } },
    { id: 12, name: "철제 갑옷", desc: "속도 -5%, 행운 +25%", cost: 150, luck: 0.25, speed: -0.05, color: "#607D8B", reqAuras: { "UNCOMMON": 150, "ASHEN": 40, "EMBER": 20 } },
    { id: 13, name: "은빛 팔찌", desc: "행운 +28%", cost: 180, luck: 0.28, speed: 0, color: "#E0E0E0", reqAuras: { "RARE": 30, "HALO": 15, "MOONLIGHT": 5 } },
    { id: 14, name: "금박 장식", desc: "행운 +30%", cost: 200, luck: 0.30, speed: 0, color: "#FFD700", reqAuras: { "RARE": 50, "SUNBEAM": 30, "SUNSHINE": 20 } },
    { id: 15, name: "눈송이 결정", desc: "속도 +25%", cost: 220, luck: 0, speed: 0.25, color: "#E3F2FD", reqAuras: { "SNOWFLAKE": 40, "FROST": 25, "FLURRY": 15 } },
    { id: 16, name: "산들바람 깃털", desc: "속도 +30%", cost: 250, luck: 0, speed: 0.30, color: "#B2DFDB", reqAuras: { "BREEZE": 150, "WHIRLWIND": 20, "ZEPHYR": 5 } },
    { id: 17, name: "작은 불꽃", desc: "행운 +32%", cost: 280, luck: 0.32, speed: 0, color: "#FFCC80", reqAuras: { "SPARK": 50, "STATIC": 15, "EMBER": 40 } },
    { id: 18, name: "새벽의 이슬", desc: "행운 +35%", cost: 300, luck: 0.35, speed: 0, color: "#81D4FA", reqAuras: { "DEW": 200, "DAWN": 10, "POLARIS": 3 } },
    { id: 19, name: "회색 구름", desc: "속도 +35%", cost: 320, luck: 0, speed: 0.35, color: "#9E9E9E", reqAuras: { "OVERCAST": 80, "MIST": 60, "ASHEN": 40 } },
    { id: 20, name: "탐험가의 배낭", desc: "행운 +40%", cost: 350, luck: 0.40, speed: -0.05, color: "#795548", reqAuras: { "COMMON": 1000, "UNCOMMON": 200, "RARE": 50, "EPIC": 5 } },

    // =========================================================================
    // [Tier 2: 초보] (Lv.21~50) - 기상 이변과 자연의 힘
    // =========================================================================
    { id: 21, name: "강철 부츠", desc: "속도 +40%", cost: 400, luck: 0, speed: 0.40, color: "#607D8B", reqAuras: { "UNCOMMON": 500, "RARE": 100, "ASHEN": 50 } },
    { id: 22, name: "눈보라 망토", desc: "속도 +45%", cost: 450, luck: 0, speed: 0.45, color: "#81D4FA", reqAuras: { "FLURRY": 40, "SNOWFLAKE": 100, "BLIZZARD": 3 } },
    { id: 23, name: "신기루 거울", desc: "행운 +50%", cost: 500, luck: 0.50, speed: 0, color: "#BA68C8", reqAuras: { "MIRAGE": 25, "HEAT_HAZE": 10, "SUNBEAM": 30 } },
    { id: 24, name: "태양의 팔찌", desc: "행운 +55%", cost: 600, luck: 0.55, speed: 0, color: "#FFEB3B", reqAuras: { "SUNSHINE": 80, "DAYLIGHT": 20, "SUNBEAM": 50, "EPIC": 10 } },
    { id: 25, name: "폭풍의 눈", desc: "속도 +55%", cost: 650, luck: 0, speed: 0.55, color: "#455A64", reqAuras: { "EYE_OF_STORM": 5, "SQUALL": 30, "VORTEX": 10 } },
    { id: 26, name: "달빛 팬던트", desc: "행운 +60%", cost: 700, luck: 0.60, speed: 0.10, color: "#9575CD", reqAuras: { "MOONLIGHT": 40, "HALO": 30, "DUSK": 20, "EPIC": 15 } },
    { id: 27, name: "오로라 실드", desc: "행운 +70%", cost: 800, luck: 0.70, speed: 0, color: "#1DE9B6", reqAuras: { "AURORA": 10, "POLARIS": 15, "FROST": 50, "RARE": 100 } },
    { id: 28, name: "마력의 반지", desc: "행운 +80%", cost: 1000, luck: 0.80, speed: 0, color: "#7B1FA2", reqAuras: { "EPIC": 50, "TRINITY": 3, "COMMON": 2000 } },
    { id: 29, name: "마력의 장화", desc: "속도 +80%", cost: 1000, luck: 0, speed: 0.80, color: "#7B1FA2", reqAuras: { "EPIC": 50, "VORTEX": 15, "UNCOMMON": 1500 } },
    { id: 30, name: "툰드라 갑주", desc: "행운 +90%", cost: 1200, luck: 0.90, speed: -0.20, color: "#0288D1", reqAuras: { "TUNDRA": 20, "CHILL_WIND": 15, "FROST": 80, "SNOWFLAKE": 200 } },
    { id: 31, name: "열기의 단검", desc: "행운 +50%, 속도 +50%", cost: 1300, luck: 0.50, speed: 0.50, color: "#FF5722", reqAuras: { "HEAT_HAZE": 30, "EMBER": 150, "SPARK": 100, "EPIC": 25 } },
    { id: 32, name: "벼락의 투구", desc: "속도 +100%", cost: 1500, luck: 0, speed: 1.00, color: "#FBC02D", reqAuras: { "THUNDERBOLT": 15, "STATIC": 80, "SPARK": 200, "RARE": 300 } },
    { id: 33, name: "슈퍼셀 코어", desc: "행운 +100%", cost: 1800, luck: 1.00, speed: 0, color: "#455A64", reqAuras: { "SUPERCELL": 15, "OVERCAST": 150, "SQUALL": 80, "RARE": 500 } },
    { id: 34, name: "유성우 화살", desc: "속도 +110%", cost: 2000, luck: 0, speed: 1.10, color: "#FF8A65", reqAuras: { "METEOR": 10, "COMET": 20, "POLARIS": 30, "DAWN": 15 } },
    { id: 35, name: "천상의 시작", desc: "행운 +110%", cost: 2200, luck: 1.10, speed: 0, color: "#00E5FF", reqAuras: { "CELESTIAL": 10, "WISHING_STAR": 15, "HALO": 50, "POLARIS": 40 } },
    { id: 36, name: "삭풍의 피리", desc: "행운 +120%", cost: 2500, luck: 1.20, speed: 0, color: "#B0BEC5", reqAuras: { "CHILL_WIND": 30, "ZEPHYR": 20, "GALE": 10, "WHIRLWIND": 100 } },
    { id: 37, name: "안개 장벽", desc: "행운 +130%", cost: 2800, luck: 1.30, speed: 0, color: "#CFD8DC", reqAuras: { "FOG_BANK": 30, "MIST": 300, "OVERCAST": 200, "PHANTOM": 5 } },
    { id: 38, name: "태양풍 반지", desc: "속도 +120%", cost: 3000, luck: 0, speed: 1.20, color: "#FF9800", reqAuras: { "DAYLIGHT": 50, "SUNSHINE": 150, "GALE": 20, "EPIC": 40 } },
    { id: 39, name: "산성비 플라스크", desc: "속도 +130%", cost: 3200, luck: 0, speed: 1.30, color: "#8BC34A", reqAuras: { "ACID_RAIN": 20, "SQUALL": 100, "DROPLET": 400, "DRIZZLE": 100 } },
    { id: 40, name: "들불의 횃불", desc: "행운 +140%", cost: 3500, luck: 1.40, speed: 0, color: "#D84315", reqAuras: { "WILDFIRE": 25, "EMBER": 300, "HEAT_HAZE": 50, "GALE": 15 } },
    { id: 41, name: "얼음 조각상", desc: "행운 +100%", cost: 3800, luck: 1.00, speed: -0.10, color: "#E0F7FA", reqAuras: { "FROST": 150, "SNOWFLAKE": 300, "HAILSTONE": 50, "EPIC": 20 } },
    { id: 42, name: "바람의 정령석", desc: "속도 +100%", cost: 3800, luck: 0, speed: 1.00, color: "#69F0AE", reqAuras: { "BREEZE": 500, "ZEPHYR": 30, "WHIRLWIND": 50, "EPIC": 20 } },
    { id: 43, name: "대지의 가호", desc: "행운 +150%", cost: 4000, luck: 1.50, speed: -0.20, color: "#5D4037", reqAuras: { "COMMON": 10000, "UNCOMMON": 2000, "RARE": 500, "EPIC": 50 } },
    { id: 44, name: "급류의 물갈퀴", desc: "속도 +140%", cost: 4200, luck: 0, speed: 1.40, color: "#29B6F6", reqAuras: { "SQUALL": 60, "MONSOON": 10, "DROPLET": 500, "DRIZZLE": 150 } },
    { id: 45, name: "자석 반지", desc: "행운 +160%", cost: 4500, luck: 1.60, speed: 0, color: "#607D8B", reqAuras: { "RARE": 1000, "STATIC": 100, "SPARK": 200, "EPIC": 30 } },
    { id: 46, name: "증기 기관", desc: "속도 +150%", cost: 4800, luck: 0, speed: 1.50, color: "#B0BEC5", reqAuras: { "MIST": 200, "EMBER": 150, "HEAT_HAZE": 50, "EPIC": 50 } },
    { id: 47, name: "사막의 장미", desc: "행운 +170%", cost: 5000, luck: 1.70, speed: 0, color: "#EF5350", reqAuras: { "HEAT_HAZE": 100, "MIRAGE": 50, "ASHEN": 200, "EPIC": 40 } },
    { id: 48, name: "오아시스 물병", desc: "속도 +160%", cost: 5200, luck: 0, speed: 1.60, color: "#26C6DA", reqAuras: { "MIRAGE": 80, "DROPLET": 400, "DEW": 300, "RARE": 500 } },
    { id: 49, name: "고대 룬석", desc: "행운 +180%", cost: 5500, luck: 1.80, speed: 0, color: "#78909C", reqAuras: { "EPIC": 150, "TRINITY": 10, "RESONANCE": 5, "COMMON": 5000 } },
    { id: 50, name: "비행 양탄자", desc: "속도 +180%", cost: 6000, luck: 0, speed: 1.80, color: "#5C6BC0", reqAuras: { "GALE": 50, "VORTEX": 30, "ZEPHYR": 40, "BREEZE": 1000 } },

    // =========================================================================
    // [Tier 3: 중수] (Lv.51~80) - 거대 재해와 추상적 조화
    // =========================================================================
    { id: 51, name: "태풍의 눈 마안", desc: "행운 +200%", cost: 7000, luck: 2.00, speed: 2.00, color: "#ECEFF1", reqAuras: { "EYE_OF_STORM": 15, "TYPHOON": 3, "SQUALL": 100, "VORTEX": 50 } },
    { id: 52, name: "만년설 방패", desc: "행운 +250%", cost: 8000, luck: 2.50, speed: -0.50, color: "#81D4FA", reqAuras: { "HAILSTONE": 50, "AVALANCHE": 5, "TUNDRA": 40, "FROST": 300 } },
    { id: 53, name: "뇌우의 검", desc: "속도 +250%, 행운 +100%", cost: 9000, luck: 1.00, speed: 2.50, color: "#FBC02D", reqAuras: { "THUNDERBOLT": 30, "RAIJIN": 2, "STATIC": 200, "SQUALL": 150 } },
    { id: 54, name: "토네이도 부츠", desc: "속도 +300%", cost: 10000, luck: 0, speed: 3.00, color: "#78909C", reqAuras: { "WHIRLWIND": 60, "GALE": 100, "VORTEX": 80, "ZEPHYR": 50 } },
    { id: 55, name: "심해의 비늘", desc: "행운 +300%", cost: 12000, luck: 3.00, speed: 0, color: "#00BCD4", reqAuras: { "MONSOON": 40, "TSUNAMI": 5, "AQUA_DRAGON": 2, "DROPLET": 1000 } },
    { id: 56, name: "소원의 별조각", desc: "행운 +350%", cost: 14000, luck: 3.50, speed: 0, color: "#FFF59D", reqAuras: { "WISHING_STAR": 30, "COMET": 40, "METEOR": 50, "CELESTIAL": 15 } },
    { id: 57, name: "서풍의 부채", desc: "속도 +350%", cost: 16000, luck: 0, speed: 3.50, color: "#A5D6A7", reqAuras: { "ZEPHYR": 60, "BREEZE": 2000, "WHIRLWIND": 100, "GALE": 80 } },
    { id: 58, name: "붉은 달의 펜던트", desc: "행운 +300%, 속도 +300%", cost: 18000, luck: 3.00, speed: 3.00, color: "#D32F2F", reqAuras: { "BLOOD_MOON": 20, "DUSK": 100, "MOONLIGHT": 150, "EPIC": 500 } },
    { id: 59, name: "별빛 망토", desc: "속도 +400%", cost: 20000, luck: 0, speed: 4.00, color: "#FFF9C4", reqAuras: { "WISHING_STAR": 25, "DAYLIGHT": 100, "HALO": 200, "SUNBEAM": 300 } },
    { id: 60, name: "핏빛 성배", desc: "행운 +400%", cost: 22000, luck: 4.00, speed: 0, color: "#B71C1C", reqAuras: { "BLOOD_MOON": 25, "MONSOON": 60, "DUSK": 150, "RARE": 5000 } },
    { id: 61, name: "사일런트 대검", desc: "행운 +300%, 속도 +300%", cost: 24000, luck: 3.00, speed: 3.00, color: "#546E7A", reqAuras: { "FOG_BANK": 50, "MIST": 1000, "PHANTOM": 20, "OVERCAST": 400 } },
    { id: 62, name: "폭염의 지팡이", desc: "행운 +500%", cost: 26000, luck: 5.00, speed: 0, color: "#D84315", reqAuras: { "HEATWAVE": 30, "SUNSPOT": 5, "HEAT_HAZE": 300, "WILDFIRE": 100 } },
    { id: 63, name: "환영의 날개", desc: "속도 +500%", cost: 28000, luck: 0, speed: 5.00, color: "#607D8B", reqAuras: { "MIRAGE": 150, "GHOST_LIGHT": 100, "PHANTOM": 30, "VORTEX": 100 } },
    { id: 64, name: "플러시 카드", desc: "행운 +600%", cost: 30000, luck: 6.00, speed: 0, color: "#FFB74D", reqAuras: { "STRAIGHT_FLUSH": 25, "TRINITY": 40, "RARE": 8000, "EPIC": 500 } },
    { id: 65, name: "용암 방패", desc: "행운 +650%", cost: 35000, luck: 6.50, speed: 0, color: "#FF3D00", reqAuras: { "VOLCANO": 20, "EMBER": 2000, "ASHEN": 1500, "HEAT_HAZE": 400 } },
    { id: 66, name: "모래 폭풍 망토", desc: "속도 +650%", cost: 35000, luck: 0, speed: 6.50, color: "#D7CCC8", reqAuras: { "SANDSTORM": 30, "WHIRLWIND": 200, "GALE": 150, "ASHEN": 500 } },
    { id: 67, name: "조커 카드", desc: "행운 +700%", cost: 40000, luck: 7.00, speed: 0, color: "#FFCA28", reqAuras: { "THE_FOOL": 15, "STRAIGHT_FLUSH": 40, "MIRAGE": 100, "EPIC": 1000 } },
    { id: 68, name: "타오르는 심장", desc: "행운 +800%", cost: 45000, luck: 8.00, speed: 0, color: "#FF5722", reqAuras: { "VOLCANO": 30, "WILDFIRE": 80, "HELLFIRE": 10, "EMBER": 3000 } },
    { id: 69, name: "삼위일체 성물", desc: "행운 +500%, 속도 +500%", cost: 50000, luck: 5.00, speed: 5.00, color: "#B39DDB", reqAuras: { "TRINITY": 77, "RESONANCE": 40, "CELESTIAL": 30, "EPIC": 777 } },
    { id: 70, name: "얼음꽃 왕관", desc: "속도 +800%", cost: 55000, luck: 0, speed: 8.00, color: "#81D4FA", reqAuras: { "BLIZZARD": 25, "HAILSTONE": 150, "FROST": 1000, "SNOWFLAKE": 2000 } },
    { id: 71, name: "망령의 로브", desc: "행운 +800%", cost: 60000, luck: 8.00, speed: 0, color: "#9E9E9E", reqAuras: { "PHANTOM": 50, "GHOST_LIGHT": 300, "DUSK": 400, "MIST": 2000 } },
    { id: 72, name: "해일 서핑보드", desc: "속도 +900%", cost: 65000, luck: 0, speed: 9.00, color: "#1565C0", reqAuras: { "TSUNAMI": 30, "MONSOON": 100, "SQUALL": 300, "DROPLET": 5000 } },
    { id: 73, name: "바보의 보따리", desc: "행운 +1000%, 속도 -200%", cost: 70000, luck: 10.00, speed: -2.00, color: "#FF7043", reqAuras: { "THE_FOOL": 33, "COMMON": 55555, "UNCOMMON": 5555, "RARE": 555 } },
    { id: 74, name: "마법사의 지팡이", desc: "행운 +600%, 속도 +600%", cost: 75000, luck: 6.00, speed: 6.00, color: "#AB47BC", reqAuras: { "MAGICIAN": 15, "TRINITY": 100, "RESONANCE": 80, "EPIC": 2000 } },
    { id: 75, name: "공명석", desc: "행운 +700%, 속도 +700%", cost: 80000, luck: 7.00, speed: 7.00, color: "#4DD0E1", reqAuras: { "RESONANCE": 77, "TRINITY": 77, "CELESTIAL": 50, "EPIC": 1500 } },
    { id: 76, name: "간헐천 코어", desc: "행운 +500%, 속도 +800%", cost: 85000, luck: 5.00, speed: 8.00, color: "#80DEEA", reqAuras: { "GEYSER": 30, "SQUALL": 200, "HEAT_HAZE": 200, "DROPLET": 2000 } },
    { id: 77, name: "지옥불 대검", desc: "행운 +1000%", cost: 90000, luck: 10.00, speed: 0, color: "#B71C1C", reqAuras: { "HELLFIRE": 40, "VOLCANO": 50, "WILDFIRE": 200, "EMBER": 5000 } },
    { id: 78, name: "연옥의 사슬", desc: "행운 +1100%", cost: 95000, luck: 11.00, speed: 0, color: "#D84315", reqAuras: { "HELLFIRE": 60, "VOLCANO": 80, "ASHEN": 3000, "EPIC": 3000 } },
    { id: 79, name: "다크 아이", desc: "행운 +950%", cost: 100000, luck: 9.50, speed: 0, color: "#212121", reqAuras: { "ABYSSAL": 10, "PHANTOM": 100, "DUSK": 500, "BLACK_CAT": 3 } },
    { id: 80, name: "스피드 레이서", desc: "속도 +1000%", cost: 100000, luck: 0, speed: 10.00, color: "#FDD835", reqAuras: { "LIMIT_BREAK": 5, "GALE": 500, "VORTEX": 300, "UNCOMMON": 20000 } },

    // =========================================================================
    // [Tier 4: 고수] (Lv.81~110) - 과학과 타로의 조화
    // =========================================================================
    { id: 81, name: "눈사태 파쇄기", desc: "속도 +1200%", cost: 120000, luck: 0, speed: 12.00, color: "#ECEFF1", reqAuras: { "AVALANCHE": 40, "BLIZZARD": 80, "TUNDRA": 200, "SNOWFLAKE": 5000 } },
    { id: 82, name: "이진법 렌즈", desc: "속도 +1500%", cost: 130000, luck: 0, speed: 15.00, color: "#4CAF50", reqAuras: { "BINARY": 50, "LEET_CODE": 10, "GHOST_IN_SHELL": 5, "EPIC": 5000 } },
    { id: 83, name: "태풍의 눈동자", desc: "속도 +1800%", cost: 140000, luck: 0, speed: 18.00, color: "#546E7A", reqAuras: { "TYPHOON": 25, "EYE_OF_STORM": 100, "VORTEX": 400, "GALE": 600 } },
    { id: 84, name: "수룡의 비늘", desc: "속도 +2000%", cost: 150000, luck: 0, speed: 20.00, color: "#1976D2", reqAuras: { "AQUA_DRAGON": 15, "TSUNAMI": 60, "TYPHOON": 30, "MONSOON": 300 } },
    { id: 85, name: "여사제의 면사포", desc: "행운 +1500%", cost: 160000, luck: 15.00, speed: 0, color: "#5C6BC0", reqAuras: { "HIGH_PRIESTESS": 15, "MOONLIGHT": 1000, "HALO": 800, "EPIC": 8000 } },
    { id: 86, name: "무지개 브로치", desc: "행운 +2000%", cost: 170000, luck: 20.00, speed: 0, color: "#E040FB", reqAuras: { "RAINBOW": 30, "SUNSHINE": 1000, "DROPLET": 1500, "AURORA": 100 } },
    { id: 87, name: "유령선의 닻", desc: "행운 +2500%", cost: 180000, luck: 25.00, speed: 0, color: "#78909C", reqAuras: { "PHANTOM": 150, "FOG_BANK": 300, "ABYSSAL": 5, "MIST": 5000 } },
    { id: 88, name: "릿-코드 키보드", desc: "속도 +2500%", cost: 190000, luck: 0, speed: 25.00, color: "#76FF03", reqAuras: { "LEET_CODE": 30, "HACKER": 5, "BINARY": 200, "ERROR_404": 2 } },
    { id: 89, name: "얼어붙은 정상", desc: "속도 +3000%", cost: 200000, luck: 0, speed: 30.00, color: "#CFD8DC", reqAuras: { "EVEREST": 10, "AVALANCHE": 80, "BLIZZARD": 150, "ABSOLUTE_ZERO": 1 } },
    { id: 90, name: "에베레스트 등반화", desc: "속도 +3500%", cost: 220000, luck: 0, speed: 35.00, color: "#B0BEC5", reqAuras: { "EVEREST": 25, "AVALANCHE": 100, "GALE": 1000, "RARE": 30000 } },
    { id: 91, name: "희망의 오라클", desc: "행운 +3000%", cost: 240000, luck: 30.00, speed: 0, color: "#E1BEE7", reqAuras: { "RAINBOW": 50, "HALO": 1000, "WISHING_STAR": 150, "CELESTIAL": 100 } },
    { id: 92, name: "황제의 왕관", desc: "행운 +3500%", cost: 260000, luck: 35.00, speed: 0, color: "#D32F2F", reqAuras: { "EMPEROR": 20, "EMPRESS": 20, "PRIDE": 50, "RARE": 50000 } },
    { id: 93, name: "깨진 스카우터", desc: "행운 +4000%", cost: 280000, luck: 40.00, speed: 0, color: "#FFEB3B", reqAuras: { "OVER_9000": 30, "LIMIT_BREAK": 50, "BINARY": 400, "EPIC": 10000 } },
    { id: 94, name: "조화의 반지", desc: "행운 +2000%, 속도 +2000%", cost: 300000, luck: 20.00, speed: 20.00, color: "#CE93D8", reqAuras: { "TRINITY": 333, "RESONANCE": 333, "TEMPERANCE": 10, "CELESTIAL": 200 } },
    { id: 95, name: "연인들의 펜던트", desc: "행운 +2500%, 속도 +2500%", cost: 320000, luck: 25.00, speed: 25.00, color: "#FF80AB", reqAuras: { "LOVERS": 20, "VALENTINE": 30, "LUST": 40, "EUPHORIA": 5 } },
    { id: 96, name: "한계돌파의 증표", desc: "속도 +4500%", cost: 350000, luck: 0, speed: 45.00, color: "#FF1744", reqAuras: { "LIMIT_BREAK": 100, "OVER_9000": 80, "GALE": 3000, "EPIC": 15000 } },
    { id: 97, name: "파워미터 3.0", desc: "행운 +4500%", cost: 380000, luck: 45.00, speed: 10.00, color: "#FF5252", reqAuras: { "OVER_9000": 150, "LIMIT_BREAK": 50, "HACKER": 10, "BINARY": 1000 } },
    { id: 98, name: "세계의 지붕", desc: "속도 +5000%", cost: 400000, luck: 0, speed: 50.00, color: "#90A4AE", reqAuras: { "EVEREST": 50, "BLIZZARD": 400, "GALE": 5000, "TUNDRA": 1000 } },
    { id: 99, name: "전차의 바퀴", desc: "속도 +6000%", cost: 450000, luck: 0, speed: 60.00, color: "#FBC02D", reqAuras: { "CHARIOT": 25, "GALE": 4000, "VORTEX": 2000, "WHIRLWIND": 3000 } },
    { id: 100, name: "은자의 등불", desc: "행운 +8000%, 속도 -500%", cost: 500000, luck: 80.00, speed: -5.00, color: "#78909C", reqAuras: { "HERMIT": 25, "DUSK": 3000, "MIST": 5000, "GHOST_LIGHT": 1000 } },
    { id: 101, name: "운명의 수레바퀴", desc: "행운 +50배", cost: 550000, luck: 50.00, speed: 50.00, color: "#FFD700", reqAuras: { "FORTUNE_WHEEL": 25, "FATE": 10, "RESONANCE": 1000, "TRINITY": 1000 } },
    { id: 102, name: "정의의 천칭", desc: "행운 +60배", cost: 600000, luck: 60.00, speed: 0, color: "#B0BEC5", reqAuras: { "JUSTICE": 25, "TEMPERANCE": 40, "RESONANCE": 800, "RARE": 100000 } },
    { id: 103, name: "매달린 자의 밧줄", desc: "속도 +80배", cost: 650000, luck: 0, speed: 80.00, color: "#9575CD", reqAuras: { "HANGED_MAN": 25, "MELANCHOLY": 10, "DUSK": 4000, "SLOTH": 50 } },
    { id: 104, name: "사신의 낫", desc: "행운 +90배, 속도 +20배", cost: 700000, luck: 90.00, speed: 20.00, color: "#212121", reqAuras: { "DEATH_TAROT": 25, "PHANTOM": 1000, "ABYSSAL": 20, "WRATH": 100 } },
    { id: 105, name: "절제의 술잔", desc: "행운 +50배, 속도 +50배", cost: 750000, luck: 50.00, speed: 50.00, color: "#80CBC4", reqAuras: { "TEMPERANCE": 30, "RESONANCE": 1500, "DROPLET": 10000, "DEW": 5000 } },
    { id: 106, name: "붕괴된 탑", desc: "속도 +100배, 행운 -50배", cost: 800000, luck: -50.00, speed: 100.00, color: "#BF360C", reqAuras: { "THE_TOWER": 30, "VOLCANO": 200, "ASHEN": 10000, "APOCALYPSE": 2 } },
    { id: 107, name: "파이 나침반", desc: "행운 +80배", cost: 850000, luck: 80.00, speed: 0, color: "#00BCD4", reqAuras: { "PI_RATE": 50, "BINARY": 2000, "GOLDEN_RATIO": 10, "CELESTIAL": 500 } },
    { id: 108, name: "별의 이정표", desc: "속도 +120배", cost: 900000, luck: 0, speed: 120.00, color: "#B3E5FC", reqAuras: { "THE_STAR": 30, "WISHING_STAR": 1000, "POLARIS": 1500, "HALO": 2000 } },
    { id: 109, name: "달의 그림자", desc: "행운 +100배", cost: 950000, luck: 100.00, speed: 0, color: "#E0E0E0", reqAuras: { "THE_MOON": 30, "MOONLIGHT": 3000, "DUSK": 5000, "PHANTOM": 500 } },
    { id: 110, name: "태양의 찬가", desc: "속도 +150배", cost: 1000000, luck: 0, speed: 150.00, color: "#FFC107", reqAuras: { "THE_SUN": 30, "DAYLIGHT": 4000, "SUNSHINE": 10000, "SUNSPOT": 20 } },
    { id: 111, name: "우주 망원경", desc: "행운 +120배", cost: 1050000, luck: 120.00, speed: 0, color: "#5C6BC0", reqAuras: { "ASTRAL": 15, "CELESTIAL": 1000, "POLARIS": 3000, "COMMON": 100000 } },
    { id: 112, name: "양자 컴퓨터", desc: "속도 +180배", cost: 1100000, luck: 0, speed: 180.00, color: "#00E676", reqAuras: { "BINARY": 5000, "LEET_CODE": 200, "HACKER": 50, "UNCOMMON": 50000 } },
    { id: 113, name: "붉은 실", desc: "행운 +110배", cost: 1150000, luck: 110.00, speed: 0, color: "#D50000", reqAuras: { "LOVERS": 100, "VALENTINE": 200, "FATE": 50, "RARE": 200000 } },
    { id: 114, name: "푸른 실", desc: "속도 +160배", cost: 1200000, luck: 0, speed: 160.00, color: "#2962FF", reqAuras: { "HANGED_MAN": 100, "MELANCHOLY": 50, "AION": 10, "EPIC": 30000 } },
    { id: 115, name: "황금 사과", desc: "행운 +130배", cost: 1250000, luck: 130.00, speed: 20.00, color: "#FFD700", reqAuras: { "EMPEROR": 100, "GOLDEN_RATIO": 50, "SUNSHINE": 15000, "RARE": 500000 } },
    { id: 116, name: "은제 탄환", desc: "속도 +200배", cost: 1300000, luck: 0, speed: 200.00, color: "#B0BEC5", reqAuras: { "JUSTICE": 100, "METEOR": 500, "MOONLIGHT": 10000, "TITANIUM": 5 } },
    { id: 117, name: "흑마법서", desc: "행운 +140배", cost: 1350000, luck: 140.00, speed: 0, color: "#4A148C", reqAuras: { "THE_FOOL": 150, "DEATH_TAROT": 50, "PHANTOM": 5000, "WRATH": 500 } },
    { id: 118, name: "백마법서", desc: "속도 +220배", cost: 1400000, luck: 0, speed: 220.00, color: "#F5F5F5", reqAuras: { "HIGH_PRIESTESS": 150, "MAGICIAN": 100, "CELESTIAL": 2000, "EUPHORIA": 500 } },
    { id: 119, name: "카오스 오브", desc: "행운 +150배, 속도 +150배", cost: 1450000, luck: 150.00, speed: 150.00, color: "#FF6E40", reqAuras: { "ENTROPY": 10, "WHIRLWIND": 5000, "VORTEX": 3000, "GALE": 10000 } },
    { id: 120, name: "오더 실드", desc: "행운 +160배", cost: 1500000, luck: 160.00, speed: 50.00, color: "#42A5F5", reqAuras: { "JUSTICE": 200, "EMPEROR": 50, "RESONANCE": 5000, "TITANIUM": 10 } },

    // =========================================================================
    // [Tier 5: 초월자] (Lv.111~140) - 고차원 원소와 신성
    // =========================================================================
    { id: 121, name: "심판의 나팔", desc: "행운 +50배, 속도 +50배", cost: 1800000, luck: 50.00, speed: 50.00, color: "#FFA000", reqAuras: { "JUDGMENT": 50, "APOCALYPSE": 5, "HALO": 10000, "RESONANCE": 5000 } },
    { id: 122, name: "세계수의 가지", desc: "행운 +60배", cost: 2000000, luck: 60.00, speed: 0, color: "#81C784", reqAuras: { "THE_WORLD": 50, "GAIA": 5, "DEW": 50000, "SUNSHINE": 50000 } },
    { id: 123, name: "세잎 클로버", desc: "행운 +70배", cost: 2200000, luck: 70.00, speed: 0, color: "#2E7D32", reqAuras: { "CLOVER": 50, "RAINBOW": 500, "WISHING_STAR": 2000, "RARE": 1000000 } },
    { id: 124, name: "럭키 세븐 코인", desc: "행운 +77배", cost: 2500000, luck: 77.00, speed: 0, color: "#FFD700", reqAuras: { "LUCKY_SEVEN": 77, "JACKPOT": 5, "STRAIGHT_FLUSH": 1000, "RARE": 777777 } },
    { id: 125, name: "8번 당구공", desc: "행운 +80배, 속도 -10배", cost: 2800000, luck: 80.00, speed: -10.00, color: "#000000", reqAuras: { "EIGHT_BALL": 50, "DUSK": 10000, "BLACK_CAT": 20, "OBSIDIAN": 5 } },
    { id: 126, name: "공각기동대 USB", desc: "속도 +80배", cost: 3000000, luck: 0, speed: 80.00, color: "#00E5FF", reqAuras: { "GHOST_IN_SHELL": 50, "HACKER": 100, "BINARY": 20000, "ERROR_404": 10 } },
    { id: 127, name: "일루미나티의 눈", desc: "행운 +90배", cost: 3500000, luck: 90.00, speed: 0, color: "#F9A825", reqAuras: { "ILLUMINATI": 50, "OMNISCIENCE": 2, "POLARIS": 10000, "CELESTIAL": 5000 } },
    { id: 128, name: "피보나치 나선", desc: "행운 +100배, 속도 +100배", cost: 4000000, luck: 100.00, speed: 100.00, color: "#8E24AA", reqAuras: { "FIBONACCI": 50, "GOLDEN_RATIO": 100, "RESONANCE": 8888, "TRINITY": 8888 } },
    { id: 129, name: "회문 거울", desc: "행운 +120배", cost: 4500000, luck: 120.00, speed: 0, color: "#42A5F5", reqAuras: { "PALINDROME": 50, "MIRAGE": 1000, "CELESTIAL": 10000, "EPIC": 100000 } },
    { id: 130, name: "황금비율의 자", desc: "행운 +130배, 속도 +130배", cost: 5000000, luck: 130.00, speed: 130.00, color: "#FFCA28", reqAuras: { "GOLDEN_RATIO": 200, "FIBONACCI": 100, "RESONANCE": 15000, "COMMON": 1000000 } },
    { id: 131, name: "해커의 검은 모자", desc: "속도 +150배", cost: 5500000, luck: 0, speed: 150.00, color: "#388E3C", reqAuras: { "HACKER": 200, "LEET_CODE": 1000, "BINARY": 50000, "VOID": 2 } },
    { id: 132, name: "검은 고양이 부적", desc: "행운 -50배, 속도 +200배", cost: 6000000, luck: -50.00, speed: 200.00, color: "#1A1A1A", reqAuras: { "BLACK_CAT": 50, "PHANTOM": 10000, "DUSK": 20000, "ENVY": 500 } },
    { id: 133, name: "심연의 닻", desc: "행운 +200배", cost: 7000000, luck: 200.00, speed: 0, color: "#1A237E", reqAuras: { "ABYSSAL": 100, "TSUNAMI": 300, "GRAVITY": 5, "OBSIDIAN": 20 } },
    { id: 134, name: "절대영도 냉각기", desc: "속도 +250배", cost: 8000000, luck: 0, speed: 250.00, color: "#E1F5FE", reqAuras: { "ABSOLUTE_ZERO": 30, "BLIZZARD": 2000, "TUNDRA": 5000, "FROST": 50000 } },
    { id: 135, name: "광속의 신발", desc: "속도 +300배", cost: 9000000, luck: 0, speed: 300.00, color: "#FFFFFF", reqAuras: { "SPEED_OF_LIGHT": 30, "PHOTON": 10, "GALE": 30000, "SUNSHINE": 100000 } },
    { id: 136, name: "풀하우스 칩", desc: "행운 +250배", cost: 10000000, luck: 250.00, speed: 0, color: "#F06292", reqAuras: { "FULL_HOUSE": 50, "STRAIGHT_FLUSH": 1500, "TRINITY": 3000, "GREED": 1000 } },
    { id: 137, name: "404 글리치 방패", desc: "행운 +220배, 속도 +220배", cost: 12000000, luck: 220.00, speed: 220.00, color: "#FF1744", reqAuras: { "ERROR_404": 50, "GLITCH": 5, "BINARY": 100000, "HACKER": 500 } },
    { id: 138, name: "로얄 플러시 카드", desc: "행운 +350배", cost: 15000000, luck: 350.00, speed: 0, color: "#D32F2F", reqAuras: { "ROYAL_FLUSH": 50, "FULL_HOUSE": 500, "JACKPOT": 50, "PRIDE": 1000 } },
    { id: 139, name: "오망성 소환진", desc: "행운 +400배", cost: 18000000, luck: 400.00, speed: 0, color: "#C2185B", reqAuras: { "PENTAGRAM": 50, "PHANTOM": 20000, "HELLFIRE": 5000, "LUST": 1000 } },
    { id: 140, name: "야수의 송곳니", desc: "속도 +400배", cost: 20000000, luck: 0, speed: 400.00, color: "#B71C1C", reqAuras: { "BEAST_MODE": 50, "WRATH": 2000, "GALE": 50000, "EMBER": 100000 } },

    // =========================================================================
    // [Tier 6: 종결자] (Lv.141~179) - 우주와 절대적 개념
    // =========================================================================
    { id: 141, name: "잭팟 슬롯 머신", desc: "행운 +500배", cost: 25000000, luck: 500.00, speed: 0, color: "#FFD700", reqAuras: { "JACKPOT": 100, "LUCKY_SEVEN": 777, "ROYAL_FLUSH": 100, "GREED": 5000 } },
    { id: 142, name: "뫼비우스의 띠", desc: "속도 +500배", cost: 30000000, luck: 0, speed: 500.00, color: "#2196F3", reqAuras: { "INFINITY_LOOP": 50, "INFINITY": 2, "VORTEX": 30000, "GALE": 100000 } },
    { id: 143, name: "구미호 여우구슬", desc: "행운 +450배, 속도 +450배", cost: 35000000, luck: 450.00, speed: 450.00, color: "#FF5722", reqAuras: { "NINE_TAILS": 50, "EUPHORIA": 1000, "MELANCHOLY": 1000, "ENVY": 1000 } },
    { id: 144, name: "일식의 로브", desc: "행운 +600배", cost: 40000000, luck: 600.00, speed: 0, color: "#FF6D00", reqAuras: { "eclipse": 50, "THE_SUN": 500, "THE_MOON": 500, "DUSK": 100000 } },
    { id: 145, name: "공허의 인도자", desc: "속도 +800배", cost: 50000000, luck: 0, speed: 800.00, color: "#4A148C", reqAuras: { "VOID": 50, "PHANTOM": 100000, "ABYSSAL": 1000, "GRAVITY": 50 } },
    { id: 146, name: "차원 균열기", desc: "행운 +800배", cost: 60000000, luck: 800.00, speed: 0, color: "#7B1FA2", reqAuras: { "DIMENSION_RIFT": 50, "GLITCH": 30, "ERROR_404": 2000, "BINARY": 200000 } },
    { id: 147, name: "루비의 열정", desc: "행운 +900배", cost: 70000000, luck: 900.00, speed: 0, color: "#E53935", reqAuras: { "RUBY": 50, "WRATH": 5000, "EMBER": 500000, "COMMON": 10000000 } },
    { id: 148, name: "사파이어의 지혜", desc: "속도 +900배", cost: 80000000, luck: 0, speed: 900.00, color: "#1E88E5", reqAuras: { "SAPPHIRE": 50, "OMNISCIENCE": 10, "DROPLET": 500000, "UNCOMMON": 5000000 } },
    { id: 149, name: "에메랄드의 조화", desc: "행운 +700배, 속도 +700배", cost: 90000000, luck: 700.00, speed: 700.00, color: "#43A047", reqAuras: { "EMERALD": 50, "RESONANCE": 50000, "TRINITY": 50000, "RARE": 2000000 } },
    { id: 150, name: "다이아몬드 방패", desc: "행운 +1000배", cost: 100000000, luck: 1000.00, speed: 0, color: "#E0F7FA", reqAuras: { "DIAMOND": 50, "PRIDE": 10000, "HALO": 100000, "RARE": 5000000 } },
    { id: 151, name: "자수정의 영안", desc: "속도 +1000배", cost: 110000000, luck: 0, speed: 1000.00, color: "#8E24AA", reqAuras: { "AMETHYST": 50, "HIGH_PRIESTESS": 5000, "POLARIS": 100000, "EPIC": 500000 } },
    { id: 152, name: "흑요석 단검", desc: "행운 +800배, 속도 +800배", cost: 120000000, luck: 800.00, speed: 800.00, color: "#212121", reqAuras: { "OBSIDIAN": 50, "ABYSSAL": 5000, "DUSK": 500000, "COMMON": 15000000 } },
    { id: 153, name: "티타늄 갑주", desc: "행운 +1100배", cost: 130000000, luck: 1100.00, speed: 0, color: "#B0BEC5", reqAuras: { "TITANIUM": 50, "JUSTICE": 5000, "RARE": 10000000, "UNCOMMON": 10000000 } },
    { id: 154, name: "미스릴 체인", desc: "속도 +1100배", cost: 140000000, luck: 0, speed: 1100.00, color: "#CFD8DC", reqAuras: { "MITHRIL": 50, "GALE": 500000, "VORTEX": 300000, "EPIC": 800000 } },
    { id: 155, name: "오리할콘 대검", desc: "행운 +950배, 속도 +950배", cost: 150000000, luck: 950.00, speed: 950.00, color: "#FFB300", reqAuras: { "ORICHALCUM": 50, "VALHALLA": 5, "EMBER": 1000000, "RARE": 5000000 } },
    { id: 156, name: "아다만티움 코어", desc: "행운 +1200배", cost: 160000000, luck: 1200.00, speed: 0, color: "#37474F", reqAuras: { "ADAMANTIUM": 50, "ABSOLUTE": 5, "OBSIDIAN": 2000, "TITANIUM": 2000 } },
    { id: 157, name: "제논 램프", desc: "속도 +1200배", cost: 170000000, luck: 0, speed: 1200.00, color: "#7E57C2", reqAuras: { "XENON": 50, "PHOTON": 50, "DAYLIGHT": 200000, "SUNBEAM": 500000 } },
    { id: 158, name: "크립톤 건전지", desc: "행운 +1000배, 속도 +1000배", cost: 180000000, luck: 1000.00, speed: 1000.00, color: "#66BB6A", reqAuras: { "KRYPTON": 50, "STATIC": 500000, "SPARK": 500000, "BINARY": 500000 } },
    { id: 159, name: "네온 사인", desc: "행운 +1300배", cost: 190000000, luck: 1300.00, speed: 0, color: "#FF4081", reqAuras: { "NEON": 50, "EUPHORIA": 10000, "RAINBOW": 10000, "RARE": 8000000 } },
    { id: 160, name: "분노의 도끼", desc: "속도 +1300배", cost: 200000000, luck: 0, speed: 1300.00, color: "#D32F2F", reqAuras: { "WRATH": 50000, "HELLFIRE": 100000, "EMBER": 2000000, "SLOTH": 5000 } },
    { id: 161, name: "탐욕의 주머니", desc: "행운 +1400배", cost: 220000000, luck: 1400.00, speed: 0, color: "#388E3C", reqAuras: { "GREED": 50000, "JACKPOT": 500, "RARE": 20000000, "COMMON": 100000000 } },
    { id: 162, name: "별의 파편", desc: "행운 +1450배", cost: 240000000, luck: 1450.00, speed: 0, color: "#E57373", reqAuras: { "ASTRAL": 100, "WISHING_STAR": 50000, "POLARIS": 100000, "CELESTIAL": 50000 } },
    { id: 163, name: "성운의 눈", desc: "속도 +1450배", cost: 260000000, luck: 0, speed: 1450.00, color: "#81C784", reqAuras: { "NEBULA": 100, "ASTRAL": 200, "GALE": 1000000, "VORTEX": 500000 } },
    { id: 164, name: "코스모스 망토", desc: "행운 +1200배, 속도 +1200배", cost: 280000000, luck: 1200.00, speed: 1200.00, color: "#64B5F6", reqAuras: { "COSMOS": 100, "NEBULA": 200, "ASTRAL": 300, "CELESTIAL": 100000 } },
    { id: 165, name: "퀘이사의 빛", desc: "행운 +1300배", cost: 300000000, luck: 1300.00, speed: 0, color: "#FFD54F", reqAuras: { "QUASAR": 50, "SUNSPOT": 5000, "DAYLIGHT": 1000000, "HALO": 500000 } },
    { id: 166, name: "펄서 비콘", desc: "속도 +1300배", cost: 320000000, luck: 0, speed: 1300.00, color: "#BA68C8", reqAuras: { "PULSAR": 50, "STATIC": 1000, "BINARY": 10000, "ERROR_404": 5000 } },
    { id: 167, name: "마그네타 실드", desc: "행운 +1400배", cost: 350000000, luck: 1400.00, speed: 0, color: "#A1887F", reqAuras: { "MAGNETAR": 50, "GRAVITY": 500, "TITANIUM": 10000, "RARE": 500000 } },
    { id: 168, name: "중성자 별", desc: "속도 +1400배", cost: 380000000, luck: 0, speed: 1400.00, color: "#E57373", reqAuras: { "NEUTRON_STAR": 50, "GRAVITY": 600, "VORTEX": 100000, "GALE": 200000 } },
    { id: 169, name: "초거성의 왕관", desc: "행운 +1100배, 속도 +1100배", cost: 400000000, luck: 1100.00, speed: 1100.00, color: "#BA68C8", reqAuras: { "SUPER_GIANT": 50, "RED_GIANT": 100, "BLUE_GIANT": 100, "COSMOS": 200 } },
    { id: 170, name: "블랙홀 응축기", desc: "행운 +1350배", cost: 450000000, luck: 1350.00, speed: 0, color: "#000000", reqAuras: { "BLACK_HOLE": 50, "VOID": 100, "GRAVITY": 2000, "ABYSSAL": 50000 } },
    { id: 171, name: "화이트홀 방출기", desc: "속도 +1350배", cost: 500000000, luck: 0, speed: 1350.00, color: "#FFFFFF", reqAuras: { "WHITE_HOLE": 50, "SUNSHINE": 100000, "DAYLIGHT": 5000000, "PHOTON": 10000 } },
    { id: 172, name: "웜홀 게이트", desc: "행운 +1250배, 속도 +1250배", cost: 550000000, luck: 1250.00, speed: 1250.00, color: "#00E5FF", reqAuras: { "WORMHOLE": 50, "DIMENSION_RIFT": 100, "GLITCH": 100, "BINARY": 2000000 } },
    { id: 173, name: "빅뱅 코어", desc: "행운 +1400배", cost: 600000000, luck: 1400.00, speed: 0, color: "#FF1744", reqAuras: { "BIG_BANG": 50, "ORIGIN": 10, "ALPHA": 10, "OMNIPOTENCE": 5 } },
    { id: 174, name: "양자 도약기", desc: "속도 +1400배", cost: 650000000, luck: 0, speed: 1400.00, color: "#A1887F", reqAuras: { "QUANTUM": 50, "ELECTRON": 100000, "PROTON": 100000, "NEUTRON": 100000 } },
    { id: 175, name: "초끈의 조율자", desc: "행운 +1420배", cost: 700000000, luck: 1420.00, speed: 0, color: "#E57373", reqAuras: { "STRING": 50, "M_THEORY": 10, "RESONANCE": 10000, "CELESTIAL": 5000 } },
    { id: 176, name: "중력 앵커", desc: "속도 +1420배", cost: 750000000, luck: 0, speed: 1420.00, color: "#81C784", reqAuras: { "GRAVITY": 5000, "BLACK_HOLE": 100, "TITANIUM": 100000, "COMMON": 2000000 } },
    { id: 177, name: "엔트로피 흡수체", desc: "행운 +1300배, 속도 +1300배", cost: 800000000, luck: 1300.00, speed: 1300.00, color: "#64B5F6", reqAuras: { "ENTROPY": 50, "VOID": 500, "ASHEN": 5000000, "SLOTH": 10000 } },
    { id: 178, name: "감마선 폭발기", desc: "행운 +1450배", cost: 900000000, luck: 1450.00, speed: 0, color: "#FFD54F", reqAuras: { "GAMMA_RAY": 50, "QUASAR": 200, "BIG_BANG": 20, "SUPER_GIANT": 500 } },
    { id: 179, name: "광자 블래스터", desc: "속도 +1450배", cost: 950000000, luck: 0, speed: 1450.00, color: "#FFD54F", reqAuras: { "PHOTON": 5000, "SPEED_OF_LIGHT": 1000, "SUNBEAM": 100000, "EPIC": 50000 } },

    // =========================================================================
    // [Tier 7: THE END] (Lv.180) - 진정한 마지막 해답
    // =========================================================================
    { 
        id: 180, name: "THE LAST ANSWER", 
        desc: "모든 확률을 지배하는 자. (행운 +150,000%, 속도 +50,000%)", 
        cost: 1000000000, 
        luck: 1500.00, 
        speed: 500.00, 
        color: "#FFFFFF", 
        reqAuras: { 
            "The Away From The World": 1, 
            "OMNIPOTENCE": 7,
            "OMNISCIENCE": 7,
            "OMNIPRESENCE": 7,
            "INFINITY": 7,
            "ABSOLUTE": 7,
            "ULTIMATE": 7,
            "ALPHA": 7,
            "OMEGA": 7,
            "ORIGIN": 7,
            "ENDING": 7,
            "BIG_BANG": 100,
            "CREATOR": 100,
            "COMMON": 100000
        } 
    }
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

    // ★ [추가] 여기가 없어서 스폰이 안 됐던 겁니다!
    "heatwave": { id: "heatwave", name: "선인장 꽃", desc: "20초간 행운 +250%", color: "#FF4081", type: "luck", val: 2.5, duration: 20, host: "tree" }, // 선인장(tree)에서 생성
    "glitch": { id: "glitch", name: "오류 조각", desc: "10초간 행운/속도 +500%", color: "#00E5FF", type: "both", val: 5.0, duration: 10, host: "grass" },
    "eclipse": { id: "eclipse", name: "검은 태양의 파편", desc: "30초간 행운 +300%", color: "#212121", type: "luck", val: 3.0, duration: 30, host: "grass" },
    "blood-moon": { id: "blood-moon", name: "붉은 달의 눈물", desc: "30초간 속도 +300%", color: "#D32F2F", type: "speed", val: 3.0, duration: 30, host: "tree" },
    // [Tier 1]
    "nut_light": { 
        id: "nut_light", name: "태양의 견과", 
        desc: "따스한 햇살을 머금은 견과류. (재료)", 
        color: "#FFD54F", isMaterial: true 
    },
    "frog_skin": { 
        id: "frog_skin", name: "미끌미끌한 가죽", 
        desc: "방수력이 뛰어난 개구리 가죽. (재료)", 
        color: "#81C784", isMaterial: true 
    },
    "slime_gel": { 
        id: "slime_gel", name: "슬라임 진액", 
        desc: "끈적끈적한 점액질. 기초 연금술 재료. (재료)", 
        color: "#76FF03", isMaterial: true 
    },

    // [Tier 2]
    "volt_scale": { 
        id: "volt_scale", name: "정전기 비늘", 
        desc: "찌릿한 전류가 흐르는 도마뱀 비늘. (재료)", 
        color: "#FBC02D", isMaterial: true 
    },
    "fiber": { 
        id: "fiber", name: "질긴 섬유", 
        desc: "회전초에서 얻은 마른 식물 줄기. (재료)", 
        color: "#8D6E63", isMaterial: true 
    },

    // [Tier 3]
    "spirit_wing": { 
        id: "spirit_wing", name: "정령의 날개깃", 
        desc: "중력을 거스르는 신비한 깃털. (재료)", 
        color: "#B2DFDB", isMaterial: true 
    },
    "rabbit_fur": { 
        id: "rabbit_fur", name: "폭신한 토끼털", 
        desc: "보온성이 뛰어난 부드러운 털. (재료)", 
        color: "#FAFAFA", isMaterial: true 
    },
    "stone_core": { 
        id: "stone_core", name: "원소의 핵", 
        desc: "단단하게 응축된 차가운 마력의 돌. (재료)", 
        color: "#81D4FA", isMaterial: true 
    },
    "ectoplasm": { 
        id: "ectoplasm", name: "엑토플라즘", 
        desc: "만질 수 없는 유령의 잔재. (재료)", 
        color: "#B0BEC5", isMaterial: true 
    },
    "fairy_dust": { 
        id: "fairy_dust", name: "요정의 가루", 
        desc: "반짝이는 차원의 가루. (재료)", 
        color: "#F48FB1", isMaterial: true 
    },

    // [Tier 4]
    "ancient_gear": { 
        id: "ancient_gear", name: "고대 톱니바퀴", 
        desc: "잊혀진 문명의 기술로 만들어진 부품. (재료)", 
        color: "#A1887F", isMaterial: true 
    },

    // [Tier 5 - 보스급]
    "shadow_beak": { 
        id: "shadow_beak", name: "그림자 부리", 
        desc: "빛을 삼키는 칠흑 같은 부리. (재료)", 
        color: "#212121", isMaterial: true 
    },
    "blood_fang": { 
        id: "blood_fang", name: "핏빛 송곳니", 
        desc: "생명력을 갈구하는 붉은 이빨. (재료)", 
        color: "#D32F2F", isMaterial: true 
    },
    "core_glitch": { 
        id: "core_glitch", name: "손상된 코어", 
        desc: "데이터가 파손된 정체불명의 핵. (재료)", 
        color: "#00E5FF", isMaterial: true 
    },

    // [Tier 6 - 잭팟]
    "gold_nugget": { 
        id: "gold_nugget", name: "순금 덩어리", 
        desc: "압도적인 가치를 지닌 순금. (환금용)", 
        color: "#FFD700", isMaterial: true 
    },

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

// 2. 확장된 연금술(물약 제작) 레시피 - 슬라임 진액 필수 포함
export const potionRecipes = [
    // =================================================================
    // [Lv.1 정수 시리즈] 기초: 진액 5개 필요
    // =================================================================
    { 
        result: "p_squirrel_luck", 
        reqItems: { "slime_gel": 5, "nut_light": 5, "clear": 3 }, 
        reqAuras: {} 
    },
    { 
        result: "p_frog_agility", 
        reqItems: { "slime_gel": 5, "frog_skin": 5, "rain": 3 }, 
        reqAuras: {} 
    },
    { 
        result: "p_rabbit_freeze", 
        reqItems: { "slime_gel": 5, "rabbit_fur": 5, "snow": 3 }, 
        reqAuras: {} 
    },

    // =================================================================
    // [Lv.2 중급 앰플] 농축: 진액 15개 필요
    // =================================================================
    { 
        result: "p_sun_juice", 
        reqItems: { "slime_gel": 15, "p_squirrel_luck": 2, "clear": 10 }, 
        reqAuras: { "SUNBEAM": 1 } 
    },
    { 
        result: "p_aqua_tea", 
        reqItems: { "slime_gel": 15, "frog_skin": 10, "rain": 10 }, 
        reqAuras: { "SQUALL": 1 } 
    },
    { 
        result: "p_ice_cream", 
        reqItems: { "slime_gel": 15, "rabbit_fur": 10, "snow": 10 }, 
        reqAuras: { "BLIZZARD": 1 } 
    },

    // =================================================================
    // [Lv.3 고성능 토닉] 추출: 진액 30개 필요
    // =================================================================
    { 
        result: "p_wind_tonic", 
        reqItems: { "slime_gel": 30, "spirit_wing": 5, "wind": 10 }, 
        reqAuras: { "ZEPHYR": 1 } 
    },
    { 
        result: "p_volt_coffee", 
        reqItems: { "slime_gel": 30, "volt_scale": 5, "thunder": 10 }, 
        reqAuras: { "THUNDERBOLT": 1 } 
    },
    { 
        result: "p_fairy_perfume", 
        reqItems: { "slime_gel": 30, "fairy_dust": 5, "foggy": 10 }, 
        reqAuras: { "MIRAGE": 1 } 
    },

    // =================================================================
    // [Lv.4 마스터 포션] 혼합: 진액 100개 필요
    // =================================================================
    { 
        result: "p_elemental", 
        reqItems: { "slime_gel": 100, "p_sun_juice": 1, "p_aqua_tea": 1, "p_ice_cream": 1 }, 
        reqAuras: { "ASTRUM": 1 } 
    },
    { 
        result: "p_dimension", 
        reqItems: { "slime_gel": 100, "fairy_dust": 20, "p_wind_tonic": 3 }, 
        reqAuras: { "VOID": 1 } 
    },
    { 
        result: "p_stella", 
        reqItems: { "slime_gel": 100, "fairy_dust": 15, "p_volt_coffee": 3 }, 
        reqAuras: { "CELESTIAL": 1 } 
    },

    // =================================================================
    // [Lv.5 재앙/신화급] 연성: 진액 300개 필요
    // =================================================================
    { 
        result: "p_dark_matter", 
        reqItems: { "slime_gel": 300, "shadow_beak": 10, "p_stella": 2 }, 
        reqAuras: { "ECLIPSE": 1 } 
    },
    { 
        result: "p_vampire_blood", 
        reqItems: { "slime_gel": 300, "blood_fang": 10, "p_elemental": 2 }, 
        reqAuras: { "BLOOD_MOON": 1 } 
    },
    { 
        result: "p_void_msg", 
        reqItems: { "slime_gel": 300, "core_glitch": 5, "p_dark_matter": 1, "p_vampire_blood": 1 }, 
        reqAuras: { "GLITCH": 1 } 
    },

    // =================================================================
    // [Lv.MAX 신의 시약] 기적: 진액 1,000개 ~ 5,000개 필요
    // =================================================================
    { 
        result: "p_glitch_god", 
        reqItems: { "slime_gel": 1000, "core_glitch": 20, "potion_ultimate": 1 }, 
        reqAuras: { "OMNIPOTENCE": 1 } 
    },
    { 
        result: "p_miracle", 
        reqItems: { "slime_gel": 5000, "core_glitch": 50, "p_void_msg": 5 }, 
        reqAuras: { "The Away From The World": 1 } 
    },

    // =================================================================
    // [기존 물약 레시피 (하위 호환)] - 여기도 진액 추가
    // =================================================================
    { result: "potion_luck_1", reqItems: { "slime_gel": 3, "clear": 3, "thunder": 2 }, reqAuras: {} },
    { result: "potion_speed_1", reqItems: { "slime_gel": 3, "cloudy": 3, "snow": 2 }, reqAuras: {} },
    
    { result: "potion_luck_2", reqItems: { "slime_gel": 10, "potion_luck_1": 2, "foggy": 5 }, reqAuras: { "UNCOMMON": 3 } },
    { result: "potion_speed_2", reqItems: { "slime_gel": 10, "potion_speed_1": 2, "wind": 5 }, reqAuras: { "RARE": 2 } },
    
    { result: "potion_luck_3", reqItems: { "slime_gel": 30, "potion_luck_2": 3 }, reqAuras: { "CELESTIAL": 1, "JACKPOT": 1 } },
    { result: "potion_speed_3", reqItems: { "slime_gel": 30, "potion_speed_2": 3 }, reqAuras: { "SPEED_OF_LIGHT": 1 } },
    
    { result: "potion_ultimate", reqItems: { "slime_gel": 100, "potion_luck_3": 3, "potion_speed_3": 3 }, reqAuras: { "CREATOR": 1, "THE_WORLD": 1 } }
];