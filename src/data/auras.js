export const allAuras = [
    // [기초 등급] 1~4 (기존 동일)
    { name: "COMMON", chanceX: 2, color: "#b0b0b0", glow: "0 0 5px white", condition: "all" },
    { name: "UNCOMMON", chanceX: 5, color: "#81C784", glow: "0 0 10px #81C784", condition: "all" },
    { name: "RARE", chanceX: 15, color: "#64B5F6", glow: "0 0 20px #64B5F6", condition: "all" },
    { name: "EPIC", chanceX: 50, color: "#BA68C8", glow: "0 0 30px #BA68C8", condition: "all" },

    // [초반부 확장] 10 ~ 1,000 구간 (자연 현상, 빛, 기상 이변)
    { name: "DEW", chanceX: 12, color: "#B3E5FC", glow: "0 0 10px #B3E5FC", condition: "rain" }, // 아침 이슬
    { name: "FROST", chanceX: 18, color: "#E0F7FA", glow: "0 0 10px #E0F7FA", condition: "snow" }, // 성에, 서리
    { name: "EMBER", chanceX: 25, color: "#FF5722", glow: "0 0 15px #FF5722", condition: "clear" }, // 잉걸불, 남은 불씨
    { name: "GHOST_LIGHT", chanceX: 35, color: "#69F0AE", glow: "0 0 15px #69F0AE", condition: "foggy" }, // 도깨비불
    { name: "AFTERGLOW", chanceX: 45, color: "#FFAB40", glow: "0 0 15px #FFAB40", condition: "clear" }, // 잔광, 노을빛
    { name: "FLURRY", chanceX: 55, color: "#B0BEC5", glow: "0 0 15px #B0BEC5", condition: "snow" }, // 가벼운 돌풍, 눈발
    { name: "MIRAGE", chanceX: 75, color: "#BA68C8", glow: "0 0 20px #BA68C8", condition: "clear" }, // 신기루
    { name: "HALO", chanceX: 90, color: "#FFF9C4", glow: "0 0 20px #FFF9C4", condition: "all" }, // 빛무리 (달무리, 햇무리)
    { name: "SQUALL", chanceX: 115, color: "#4FC3F7", glow: "0 0 20px #4FC3F7", condition: "rain" }, // 스콜 (국지성 호우)
    { name: "WHIRLWIND", chanceX: 135, color: "#90A4AE", glow: "0 0 25px #90A4AE", condition: "wind" }, // 회오리바람
    { name: "OVERCAST", chanceX: 160, color: "#78909C", glow: "0 0 25px #78909C", condition: "foggy" }, // 잔뜩 흐린 하늘
    { name: "SUNBEAM", chanceX: 190, color: "#FFCA28", glow: "0 0 25px #FFCA28", condition: "clear" }, // 햇살 줄기 (틈새 빛)
    { name: "ASHEN", chanceX: 210, color: "#9E9E9E", glow: "0 0 25px #9E9E9E", condition: "foggy" }, // 화산재, 잿빛
    { name: "POLARIS", chanceX: 240, color: "#E1F5FE", glow: "0 0 30px #E1F5FE", condition: "all" }, // 북극성 (길잡이)
    { name: "MOONLIGHT", chanceX: 270, color: "#D1C4E9", glow: "0 0 30px #D1C4E9", condition: "all" }, // 달빛
    { name: "COMET", chanceX: 310, color: "#80DEEA", glow: "0 0 30px #80DEEA", condition: "all" }, // 혜성 (유성보다 큰 천체)
    { name: "DUSK", chanceX: 330, color: "#5E35B1", glow: "0 0 30px #5E35B1", condition: "all" }, // 땅거미, 황혼
    { name: "DAWN", chanceX: 370, color: "#F06292", glow: "0 0 30px #F06292", condition: "all" }, // 새벽의 여명
    { name: "AURORA", chanceX: 420, color: "#1DE9B6", glow: "0 0 35px #1DE9B6", condition: "snow" }, // 오로라 (극광)
    { name: "VORTEX", chanceX: 480, color: "#5C6BC0", glow: "0 0 35px #5C6BC0", condition: "wind" }, // 거대한 소용돌이
    { name: "TUNDRA", chanceX: 530, color: "#81D4FA", glow: "0 0 35px #81D4FA", condition: "snow" }, // 얼어붙은 툰드라
    { name: "HEAT_HAZE", chanceX: 580, color: "#FF5722", glow: "0 0 35px #FF5722", condition: "clear" }, // 아지랑이 (열 파동)
    { name: "THUNDERBOLT", chanceX: 620, color: "#FBC02D", glow: "0 0 40px #FBC02D", condition: "thunder" }, // 벼락 (일격)
    { name: "SUPERCELL", chanceX: 680, color: "#455A64", glow: "0 0 40px #455A64", condition: "thunder" }, // 슈퍼셀 (거대 적란운)
    { name: "METEOR", chanceX: 730, color: "#FF8A65", glow: "0 0 40px #FF8A65", condition: "all" }, // 유성우
    { name: "CHILL_WIND", chanceX: 780, color: "#B0BEC5", glow: "0 0 40px #B0BEC5", condition: "snow" }, // 뼈를 깎는 삭풍
    { name: "FOG_BANK", chanceX: 820, color: "#CFD8DC", glow: "0 0 45px #CFD8DC", condition: "foggy" }, // 거대 안개 장벽
    { name: "ACID_RAIN", chanceX: 890, color: "#8BC34A", glow: "0 0 45px #8BC34A", condition: "rain" }, // 산성비 (녹색 비)
    { name: "WILDFIRE", chanceX: 940, color: "#D84315", glow: "0 0 45px #D84315", condition: "wind" }, // 걷잡을 수 없는 들불
    { name: "EYE_OF_STORM", chanceX: 980, color: "#ECEFF1", glow: "0 0 50px white", condition: "rain" }, // 태풍의 눈 (평온함)

    // [초반부 날씨] 100 ~ 5,000 구간 (숫자 디테일업)
    { name: "BREEZE", chanceX: 77, color: "#CFD8DC", glow: "0 0 30px #CFD8DC", condition: "wind" },
    { name: "DROPLET", chanceX: 88, color: "#90CAF9", glow: "0 0 20px #90CAF9", condition: "rain" },
    { name: "SNOWFLAKE", chanceX: 99, color: "#E3F2FD", glow: "0 0 20px #E3F2FD", condition: "snow" },
    { name: "SUNSHINE", chanceX: 101, color: "#FFEB3B", glow: "0 0 30px #FFEB3B", condition: "clear" },
    { name: "MIST", chanceX: 111, color: "#B0BEC5", glow: "0 0 30px #B0BEC5", condition: "foggy" },
    { name: "SPARK", chanceX: 123, color: "#FFF176", glow: "0 0 30px #FFF176", condition: "thunder" },
    { name: "DAYLIGHT", chanceX: 365, color: "#FFEE58", glow: "0 0 40px #FFEE58", condition: "clear" }, // 1년 365일
    { name: "DRIZZLE", chanceX: 444, color: "#64B5F6", glow: "0 0 30px #64B5F6", condition: "rain" },
    { name: "HAILSTONE", chanceX: 555, color: "#BBDEFB", glow: "0 0 30px #BBDEFB", condition: "snow" },
    { name: "STATIC", chanceX: 777, color: "#FFF59D", glow: "0 0 30px #FFF59D", condition: "thunder" },
    { name: "GALE", chanceX: 1234, color: "#B0BEC5", glow: "0 0 40px #B0BEC5", condition: "wind" },
    { name: "MONSOON", chanceX: 2048, color: "#1976D2", glow: "0 0 40px #1976D2", condition: "rain" }, // 2048 게임

    // [초중반 돌파 구간] 1,000 ~ 10,000 구간 
    // 👉 거대 기상 현상, 특이한 숫자 조합, 행운의 상징
    { name: "WISHING_STAR", chanceX: 1111, color: "#FFF59D", glow: "0 0 35px #FFF59D", condition: "clear" }, // 11:11 소원을 비는 별똥별
    /* { name: "GALE", chanceX: 1234 ... 기존 코드 } */ 
    { name: "BLOOD_MOON", chanceX: 1500, color: "#D32F2F", glow: "0 0 40px #B71C1C", condition: "all" }, // 불길한 붉은 달
    { name: "ZEPHYR", chanceX: 1800, color: "#A5D6A7", glow: "0 0 35px #A5D6A7", condition: "wind" }, // 봄을 부르는 서풍
    /* { name: "MONSOON", chanceX: 2048 ... 기존 코드 } */
    { name: "STRAIGHT_FLUSH", chanceX: 2345, color: "#FFB74D", glow: "0 0 40px #FFB74D", condition: "all" }, // 연속된 숫자 (포커)
    { name: "VOLCANO", chanceX: 2500, color: "#FF3D00", glow: "0 0 45px #FF3D00", condition: "clear" }, // 화산 대폭발 (애쉬 상위호환)
    { name: "SANDSTORM", chanceX: 3000, color: "#D7CCC8", glow: "0 0 40px #D7CCC8", condition: "wind" }, // 시야를 가리는 모래폭풍
    { name: "TRINITY", chanceX: 3333, color: "#B39DDB", glow: "0 0 40px #B39DDB", condition: "all" }, // 3의 삼위일체 (조화)
    { name: "BLIZZARD", chanceX: 4000, color: "#81D4FA", glow: "0 0 50px #81D4FA", condition: "snow" }, // 거대 눈보라 (삭풍 상위호환)
    { name: "PHANTOM", chanceX: 4444, color: "#9E9E9E", glow: "0 0 40px #9E9E9E", condition: "foggy" }, // 죽음의 숫자 4444 (망령)
    { name: "TSUNAMI", chanceX: 5000, color: "#1565C0", glow: "0 0 55px #1565C0", condition: "rain" }, // 거대 지진 해일
    { name: "RESONANCE", chanceX: 5555, color: "#4DD0E1", glow: "0 0 40px #4DD0E1", condition: "all" }, // 5555 공명 현상
    { name: "GEYSER", chanceX: 6000, color: "#80DEEA", glow: "0 0 45px #80DEEA", condition: "clear" }, // 하늘로 솟구치는 간헐천
    { name: "HELLFIRE", chanceX: 6666, color: "#B71C1C", glow: "0 0 50px #B71C1C", condition: "all" }, // 6666 연옥의 불꽃 (들불 상위호환)
    { name: "TYPHOON", chanceX: 7000, color: "#546E7A", glow: "0 0 60px #546E7A", condition: "rain" }, // 태풍 (슈퍼셀, 스콜의 최종 형태)
    { name: "RAINBOW", chanceX: 7777, color: "#E040FB", glow: "0 0 50px #E040FB", condition: "clear" }, // 비 갠 뒤의 일곱 빛깔 무지개 (행운)
    { name: "AVALANCHE", chanceX: 8000, color: "#ECEFF1", glow: "0 0 55px white", condition: "snow" }, // 모든 것을 덮는 눈사태
    { name: "EVEREST", chanceX: 8848, color: "#CFD8DC", glow: "0 0 55px #B0BEC5", condition: "snow" }, // 에베레스트의 높이 (세계의 지붕)
    { name: "OVER_9000", chanceX: 9001, color: "#FFEB3B", glow: "0 0 60px #FFEB3B", condition: "all" }, // 전투력 9000 돌파 (스카우터 파괴)
    { name: "LIMIT_BREAK", chanceX: 9999, color: "#FF1744", glow: "0 0 70px #FF1744", condition: "all" }, // 네 자릿수의 한계 돌파

    // [중반부] 10,000 ~ 1,000,000 구간 
    // 👉 [핵심] 타로 카드, 수학, 도시전설, 암호학 등 테마가 담긴 재밌는 확률 등장!
    { name: "CELESTIAL", chanceX: 10001, color: "#00E5FF", glow: "0 0 60px #00E5FF", condition: "all" }, // 거울 숫자
    { name: "THE_FOOL", chanceX: 10101, color: "#FF7043", glow: "0 0 30px #FF7043", condition: "all" }, // 타로 0번(시작)
    { name: "BINARY", chanceX: 10110, color: "#4CAF50", glow: "0 0 30px #4CAF50", condition: "all" }, // 2진수 느낌
    { name: "MAGICIAN", chanceX: 11111, color: "#AB47BC", glow: "0 0 30px #AB47BC", condition: "all" }, // 타로 1번, 숫자 1 도배
    { name: "HEATWAVE", chanceX: 12345, color: "#E64A19", glow: "0 0 60px #E64A19", condition: "clear" }, // 스트레이트
    { name: "HIGH_PRIESTESS", chanceX: 12121, color: "#5C6BC0", glow: "0 0 30px #5C6BC0", condition: "all" },
    { name: "LEET_CODE", chanceX: 13370, color: "#76FF03", glow: "0 0 30px #76FF03", condition: "all" }, // 1337 (LEET)
    { name: "VALENTINE", chanceX: 14214, color: "#F06292", glow: "0 0 30px #F06292", condition: "all" }, // 2월 14일
    { name: "EMPRESS", chanceX: 14444, color: "#EC407A", glow: "0 0 30px #EC407A", condition: "all" },
    { name: "EMPEROR", chanceX: 15555, color: "#D32F2F", glow: "0 0 30px #D32F2F", condition: "all" },
    { name: "HIEROPHANT", chanceX: 16666, color: "#8D6E63", glow: "0 0 30px #8D6E63", condition: "all" },
    { name: "LOVERS", chanceX: 17777, color: "#FF80AB", glow: "0 0 30px #FF80AB", condition: "all" },
    { name: "CHARIOT", chanceX: 18888, color: "#FBC02D", glow: "0 0 30px #FBC02D", condition: "all" },
    { name: "HERMIT", chanceX: 19999, color: "#78909C", glow: "0 0 30px #78909C", condition: "all" }, // 고독한 은자
    { name: "FORTUNE_WHEEL", chanceX: 20202, color: "#FFD700", glow: "0 0 30px #FFD700", condition: "all" },
    { name: "JUSTICE", chanceX: 21111, color: "#B0BEC5", glow: "0 0 30px #B0BEC5", condition: "all" },
    { name: "HANGED_MAN", chanceX: 22222, color: "#9575CD", glow: "0 0 30px #9575CD", condition: "all" }, // 콩진호 오라
    { name: "DEATH_TAROT", chanceX: 23456, color: "#212121", glow: "0 0 30px #212121", condition: "all" },
    { name: "TEMPERANCE", chanceX: 25000, color: "#80CBC4", glow: "0 0 30px #80CBC4", condition: "all" },
    { name: "THE_TOWER", chanceX: 27777, color: "#BF360C", glow: "0 0 30px #BF360C", condition: "all" },
    { name: "PI_RATE", chanceX: 31415, color: "#00BCD4", glow: "0 0 30px #00BCD4", condition: "all" }, // 원주율 파이(3.1415)
    { name: "THE_STAR", chanceX: 33333, color: "#B3E5FC", glow: "0 0 30px #B3E5FC", condition: "all" },
    { name: "THE_MOON", chanceX: 36936, color: "#E0E0E0", glow: "0 0 30px #E0E0E0", condition: "all" }, // 369 게임
    { name: "THE_SUN", chanceX: 38888, color: "#FFC107", glow: "0 0 30px #FFC107", condition: "all" },
    { name: "JUDGMENT", chanceX: 42042, color: "#FFA000", glow: "0 0 30px #FFA000", condition: "all" }, // 히치하이커의 42
    { name: "THE_WORLD", chanceX: 44444, color: "#E8F5E9", glow: "0 0 30px #81C784", condition: "all" }, // 죽음의 44444
    { name: "AQUA_DRAGON", chanceX: 55555, color: "#00BCD4", glow: "0 0 50px #00BCD4", condition: "rain" }, // 비의 정점 (5만대)
    { name: "CLOVER", chanceX: 61000, color: "#2E7D32", glow: "0 0 30px #2E7D32", condition: "all" }, 
    { name: "SUNSPOT", chanceX: 61803, color: "#D84315", glow: "0 0 70px #D84315", condition: "clear" }, // 황금비율 (1.61803)
    { name: "LUCKY_SEVEN", chanceX: 77777, color: "#FFD700", glow: "0 0 30px #FFD700", condition: "all" }, // 럭키 세븐
    { name: "EIGHT_BALL", chanceX: 88888, color: "#000000", glow: "0 0 30px #FFFFFF", condition: "all" }, // 당구 8번공 (행운)
    { name: "GHOST_IN_SHELL", chanceX: 99999, color: "#00E5FF", glow: "0 0 30px #00E5FF", condition: "all" }, // 사이버펑크 99999
    { name: "MILLENNIUM", chanceX: 100000, color: "#ECEFF1", glow: "0 0 50px white", condition: "all" },
    { name: "ILLUMINATI", chanceX: 111111, color: "#F9A825", glow: "0 0 30px #F9A825", condition: "all" }, // 일루미나티
    { name: "FIBONACCI", chanceX: 112358, color: "#8E24AA", glow: "0 0 30px #8E24AA", condition: "all" }, // 피보나치 수열
    { name: "PALINDROME", chanceX: 123321, color: "#42A5F5", glow: "0 0 30px #42A5F5", condition: "all" }, // 앞뒤가 똑같은 숫자
    { name: "GOLDEN_RATIO", chanceX: 161803, color: "#FFCA28", glow: "0 0 30px #FFCA28", condition: "all" }, // 황금비율 1.61803
    { name: "HACKER", chanceX: 192168, color: "#388E3C", glow: "0 0 30px #388E3C", condition: "all" }, // 공유기 IP (192.168.x.x)
    { name: "BLACK_CAT", chanceX: 222222, color: "#1A1A1A", glow: "0 0 30px #FF5722", condition: "all" }, // 불길한 검은 고양이
    { name: "ABYSSAL", chanceX: 250000, color: "#1A237E", glow: "0 0 80px #1A237E", condition: "all" },
    { name: "ABSOLUTE_ZERO", chanceX: 273150, color: "#E1F5FE", glow: "0 0 120px white", condition: "snow" }, // 절대영도 -273.15도
    { name: "SPEED_OF_LIGHT", chanceX: 299792, color: "#FFFFFF", glow: "0 0 50px #FFEE58", condition: "all" }, // 광속 (299,792km/s)
    { name: "FULL_HOUSE", chanceX: 333222, color: "#F06292", glow: "0 0 30px #F06292", condition: "all" }, // 포커 풀하우스 (3장+2장)
    { name: "RAIJIN", chanceX: 350000, color: "#F9A825", glow: "0 0 80px #F9A825", condition: "thunder" },
    { name: "ERROR_404", chanceX: 404404, color: "#FF1744", glow: "0 0 30px #FF1744", condition: "all" }, // 404 Not Found
    { name: "ROYAL_FLUSH", chanceX: 525252, color: "#D32F2F", glow: "0 0 30px #D32F2F", condition: "all" }, // 트럼프 52장
    { name: "PENTAGRAM", chanceX: 555555, color: "#C2185B", glow: "0 0 30px #C2185B", condition: "all" }, // 오망성
    { name: "BEAST_MODE", chanceX: 666666, color: "#B71C1C", glow: "0 0 50px #B71C1C", condition: "all" }, // 짐승의 숫자 666
    { name: "JACKPOT", chanceX: 777777, color: "#FFD700", glow: "0 0 100px #FFD700", condition: "all" }, // 잭팟! 777
    { name: "INFINITY_LOOP", chanceX: 888888, color: "#2196F3", glow: "0 0 30px #2196F3", condition: "all" }, // 무한대(8)
    { name: "NINE_TAILS", chanceX: 999999, color: "#FF5722", glow: "0 0 50px #FF5722", condition: "all" }, // 구미호 (9)

    // [후반부 ~ 초월] 1,000,000 ~ 2,400,000,000 (기존 거대 개념들 유지 및 밸런싱)
    { name: "eclipse", chanceX: 1500000, color: "#FF6D00", glow: "0 0 100px #FF6D00", condition: "all" },
    { name: "VOID", chanceX: 2600000, color: "#4A148C", glow: "0 0 120px #4A148C", condition: "all" },
    { name: "DIMENSION_RIFT", chanceX: 5000000, color: "#7B1FA2", glow: "0 0 120px #7B1FA2", condition: "all" },
    { name: "CREATOR", chanceX: 10000000, color: "#FFFFFF", glow: "0 0 150px white", condition: "all" },
    { name: "GLITCH", chanceX: 15000000, color: "#76FF03", glow: "0 0 150px #76FF03", condition: "all" },
    { name: "ARCHANGEL", chanceX: 25000000, color: "#F06292", glow: "0 0 150px #F06292", condition: "all" },
    
    // 우주 / 항성계
    { name: "ASTRAL", chanceX: 35000000, color: "#E57373", glow: "0 0 30px #E57373", condition: "all" },
    { name: "NEBULA", chanceX: 50000000, color: "#81C784", glow: "0 0 30px #81C784", condition: "all" },
    { name: "COSMOS", chanceX: 75000000, color: "#64B5F6", glow: "0 0 30px #64B5F6", condition: "all" },
    { name: "QUASAR", chanceX: 100000000, color: "#FFD54F", glow: "0 0 30px #FFD54F", condition: "all" },
    { name: "PULSAR", chanceX: 120000000, color: "#BA68C8", glow: "0 0 30px #BA68C8", condition: "all" },
    { name: "MAGNETAR", chanceX: 140000000, color: "#A1887F", glow: "0 0 30px #A1887F", condition: "all" },
    { name: "NEUTRON_STAR", chanceX: 160000000, color: "#E57373", glow: "0 0 30px #E57373", condition: "all" },
    { name: "WHITE_DWARF", chanceX: 180000000, color: "#81C784", glow: "0 0 30px #81C784", condition: "all" },
    { name: "RED_GIANT", chanceX: 200000000, color: "#64B5F6", glow: "0 0 30px #64B5F6", condition: "all" },
    { name: "BLUE_GIANT", chanceX: 230000000, color: "#FFD54F", glow: "0 0 30px #FFD54F", condition: "all" },
    { name: "SUPER_GIANT", chanceX: 260000000, color: "#BA68C8", glow: "0 0 30px #BA68C8", condition: "all" },
    { name: "BLACK_HOLE", chanceX: 290000000, color: "#000000", glow: "0 0 50px purple", condition: "all" },
    { name: "WHITE_HOLE", chanceX: 320000000, color: "#FFFFFF", glow: "0 0 50px white", condition: "all" },
    { name: "WORMHOLE", chanceX: 350000000, color: "#00E5FF", glow: "0 0 30px #00E5FF", condition: "all" },
    { name: "BIG_BANG", chanceX: 400000000, color: "#FF1744", glow: "0 0 60px #FF1744", condition: "all" },

    // 양자 / 물리학 / 파장
    { name: "STRING", chanceX: 450000000, color: "#E57373", glow: "0 0 30px #E57373", condition: "all" },
    { name: "GRAVITY", chanceX: 500000000, color: "#81C784", glow: "0 0 30px #81C784", condition: "all" },
    { name: "ENTROPY", chanceX: 550000000, color: "#64B5F6", glow: "0 0 30px #64B5F6", condition: "all" },
    { name: "GAMMA_RAY", chanceX: 600000000, color: "#FFD54F", glow: "0 0 30px #FFD54F", condition: "all" },
    { name: "X_RAY", chanceX: 650000000, color: "#BA68C8", glow: "0 0 30px #BA68C8", condition: "all" },
    { name: "UV_RAY", chanceX: 700000000, color: "#A1887F", glow: "0 0 30px #A1887F", condition: "all" },
    { name: "INFRARED", chanceX: 750000000, color: "#E57373", glow: "0 0 30px #E57373", condition: "all" },
    { name: "MICROWAVE", chanceX: 800000000, color: "#81C784", glow: "0 0 30px #81C784", condition: "all" },
    { name: "RADIO_WAVE", chanceX: 850000000, color: "#64B5F6", glow: "0 0 30px #64B5F6", condition: "all" },
    { name: "PHOTON", chanceX: 900000000, color: "#FFD54F", glow: "0 0 30px #FFD54F", condition: "all" },
    { name: "ELECTRON", chanceX: 950000000, color: "#BA68C8", glow: "0 0 30px #BA68C8", condition: "all" },
    { name: "PROTON", chanceX: 1000000000, color: "#A1887F", glow: "0 0 30px #A1887F", condition: "all" },
    { name: "NEUTRON", chanceX: 1100000000, color: "#E57373", glow: "0 0 30px #E57373", condition: "all" },
    { name: "QUARK", chanceX: 1200000000, color: "#81C784", glow: "0 0 30px #81C784", condition: "all" },
    { name: "LEPTON", chanceX: 1300000000, color: "#64B5F6", glow: "0 0 30px #64B5F6", condition: "all" },
    { name: "BOSON", chanceX: 1400000000, color: "#FFD54F", glow: "0 0 30px #FFD54F", condition: "all" },
    { name: "FERMION", chanceX: 1500000000, color: "#BA68C8", glow: "0 0 30px #BA68C8", condition: "all" },
    { name: "GRAVITON", chanceX: 1600000000, color: "#A1887F", glow: "0 0 30px #A1887F", condition: "all" },
    { name: "TACHYON", chanceX: 1700000000, color: "#E57373", glow: "0 0 30px #E57373", condition: "all" },
    { name: "AXION", chanceX: 1800000000, color: "#81C784", glow: "0 0 30px #81C784", condition: "all" },
    { name: "DILATON", chanceX: 1900000000, color: "#64B5F6", glow: "0 0 30px #64B5F6", condition: "all" },
    { name: "GLUON", chanceX: 2000000000, color: "#FFD54F", glow: "0 0 30px #FFD54F", condition: "all" },
    { name: "HIGGS_BOSON", chanceX: 2100000000, color: "#BA68C8", glow: "0 0 30px #BA68C8", condition: "all" },
    { name: "M_THEORY", chanceX: 2150000000, color: "#A1887F", glow: "0 0 30px #A1887F", condition: "all" },

    // 광물 / 환상 금속
    { name: "RUBY", chanceX: 2180000000, color: "#E53935", glow: "0 0 30px #E53935", condition: "all" },
    { name: "SAPPHIRE", chanceX: 2190000000, color: "#1E88E5", glow: "0 0 30px #1E88E5", condition: "all" },
    { name: "EMERALD", chanceX: 2200000000, color: "#43A047", glow: "0 0 30px #43A047", condition: "all" },
    { name: "DIAMOND", chanceX: 2210000000, color: "#E0F7FA", glow: "0 0 30px #E0F7FA", condition: "all" },
    { name: "AMETHYST", chanceX: 2220000000, color: "#8E24AA", glow: "0 0 30px #8E24AA", condition: "all" },
    { name: "OBSIDIAN", chanceX: 2230000000, color: "#212121", glow: "0 0 30px #212121", condition: "all" },
    { name: "TITANIUM", chanceX: 2240000000, color: "#B0BEC5", glow: "0 0 30px #B0BEC5", condition: "all" },
    { name: "MITHRIL", chanceX: 2250000000, color: "#CFD8DC", glow: "0 0 30px #CFD8DC", condition: "all" },
    { name: "ORICHALCUM", chanceX: 2260000000, color: "#FFB300", glow: "0 0 30px #FFB300", condition: "all" },
    { name: "ADAMANTIUM", chanceX: 2270000000, color: "#37474F", glow: "0 0 30px #37474F", condition: "all" },
    { name: "XENON", chanceX: 2280000000, color: "#7E57C2", glow: "0 0 30px #7E57C2", condition: "all" },
    { name: "KRYPTON", chanceX: 2290000000, color: "#66BB6A", glow: "0 0 30px #66BB6A", condition: "all" },
    { name: "NEON", chanceX: 2300000000, color: "#FF4081", glow: "0 0 30px #FF4081", condition: "all" },

    // 감정 / 7대 죄악
    { name: "EUPHORIA", chanceX: 2305000000, color: "#FFEB3B", glow: "0 0 30px #FFEB3B", condition: "all" },
    { name: "MELANCHOLY", chanceX: 2310000000, color: "#5C6BC0", glow: "0 0 30px #5C6BC0", condition: "all" },
    { name: "WRATH", chanceX: 2315000000, color: "#D32F2F", glow: "0 0 30px #D32F2F", condition: "all" },
    { name: "PRIDE", chanceX: 2320000000, color: "#FBC02D", glow: "0 0 30px #FBC02D", condition: "all" },
    { name: "GREED", chanceX: 2325000000, color: "#388E3C", glow: "0 0 30px #388E3C", condition: "all" },
    { name: "ENVY", chanceX: 2330000000, color: "#00796B", glow: "0 0 30px #00796B", condition: "all" },
    { name: "LUST", chanceX: 2335000000, color: "#C2185B", glow: "0 0 30px #C2185B", condition: "all" },
    { name: "SLOTH", chanceX: 2340000000, color: "#795548", glow: "0 0 30px #795548", condition: "all" },
    { name: "GLUTTONY", chanceX: 2345000000, color: "#E64A19", glow: "0 0 30px #E64A19", condition: "all" },

    // 신화 / 종말 / 절대적 개념 (23.5억 ~ 24억)
    { name: "APOCALYPSE", chanceX: 2350000000, color: "#E53935", glow: "0 0 30px #E53935", condition: "all" },
    { name: "RAGNAROK", chanceX: 2355000000, color: "#D84315", glow: "0 0 30px #D84315", condition: "all" },
    { name: "NIRVANA", chanceX: 2360000000, color: "#F06292", glow: "0 0 30px #F06292", condition: "all" },
    { name: "VALHALLA", chanceX: 2365000000, color: "#FFD54F", glow: "0 0 30px #FFD54F", condition: "all" },
    { name: "ELYSIUM", chanceX: 2370000000, color: "#81C784", glow: "0 0 30px #81C784", condition: "all" },
    { name: "TARTARUS", chanceX: 2375000000, color: "#455A64", glow: "0 0 30px #455A64", condition: "all" },
    { name: "GAIA", chanceX: 2380000000, color: "#689F38", glow: "0 0 30px #689F38", condition: "all" },
    { name: "CHRONOS", chanceX: 2385000000, color: "#5D4037", glow: "0 0 30px #5D4037", condition: "all" },
    { name: "AION", chanceX: 2390000000, color: "#78909C", glow: "0 0 30px #78909C", condition: "all" },
    { name: "FATE", chanceX: 2395000000, color: "#AB47BC", glow: "0 0 30px #AB47BC", condition: "all" },

    // [신의 영역: 초희귀 10종]
    { name: "OMNIPRESENCE", chanceX: 2399100000, color: "#FFD54F", glow: "0 0 30px #FFD54F", condition: "all" },
    { name: "OMNISCIENCE", chanceX: 2399200000, color: "#BA68C8", glow: "0 0 30px #BA68C8", condition: "all" },
    { name: "OMNIPOTENCE", chanceX: 2399300000, color: "#A1887F", glow: "0 0 30px #A1887F", condition: "all" },
    { name: "INFINITY", chanceX: 2399400000, color: "#E57373", glow: "0 0 30px #E57373", condition: "all" },
    { name: "ABSOLUTE", chanceX: 2399500000, color: "#81C784", glow: "0 0 30px #81C784", condition: "all" },
    { name: "ULTIMATE", chanceX: 2399600000, color: "#64B5F6", glow: "0 0 30px #64B5F6", condition: "all" },
    { name: "ALPHA", chanceX: 2399700000, color: "#FFD54F", glow: "0 0 30px #FFD54F", condition: "all" },
    { name: "OMEGA", chanceX: 2399800000, color: "#BA68C8", glow: "0 0 30px #BA68C8", condition: "all" },
    { name: "ORIGIN", chanceX: 2399900000, color: "#A1887F", glow: "0 0 30px #A1887F", condition: "all" },
    { name: "ENDING", chanceX: 2399950000, color: "#E57373", glow: "0 0 30px #E57373", condition: "all" },

    // [최종 240억 분의 1]
    { name: "The Away From The World", chanceX: 2400000000, color: "#FFFFFF", glow: "0 0 300px white, 0 0 150px black", condition: "all" }
];