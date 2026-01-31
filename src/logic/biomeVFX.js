import { lerp } from '../utils.js';

// [설정] 12개 바이옴별 분위기 및 파티클 설정 (BIOME_DATA 기준)
const BIOME_STYLES = {
    // 1. 세계의 끝 (남쪽) - 우주 느낌, 별가루
    "SOUTH_EDGE": { 
        fogColor: { r: 0, g: 8, b: 20 }, // 아주 어두운 남색
        fogAlpha: 0.2, 
        particleColor: "rgba(100, 200, 255, 0.8)", // 푸른 별가루
        speed: 2, // 둥둥 떠다님
        count: 50,
        type: "star", // 별 모양
        sizeBase: 3
    },
    // 2. 얼어붙은 산지 - 차가운 눈보라
    "FROZEN_MOUNTAIN": { 
        fogColor: { r: 200, g: 240, b: 255 }, 
        fogAlpha: 0.3, 
        particleColor: "rgba(255, 255, 255, 0.9)", // 흰 눈
        speed: 25, // 빠른 눈보라
        count: 120,
        type: "snow",
        sizeBase: 3
    },
    // 3. 오염된 지대 - 보라색 독기
    "CORRUPTED": { 
        fogColor: { r: 36, g: 0, b: 70 }, 
        fogAlpha: 0.4, 
        particleColor: "rgba(160, 50, 200, 0.7)", // 보라색 포자
        speed: 5, // 천천히 퍼짐
        count: 60,
        type: "spore",
        sizeBase: 3
    },
    // 4. 고대 유적지 - 오래된 먼지, 모래
    "ANCIENT_RUIN": { 
        fogColor: { r: 88, g: 47, b: 14 }, // 고동색 틴트
        fogAlpha: 0.3, 
        particleColor: "rgba(180, 140, 100, 0.6)", 
        speed: 8, 
        count: 40,
        type: "dust",
        sizeBase: 2
    },
    // 5. 절벽 지대 - 강한 바람, 흙먼지
    "CLIFFS": { 
        fogColor: { r: 100, g: 150, b: 240 }, // 파란 하늘빛
        fogAlpha: 0.1, 
        particleColor: "rgba(255, 255, 255, 0.4)", // 하얀 바람선
        speed: 40, // 매우 강풍
        count: 30,
        type: "wind_line", // 길쭉한 선
        sizeBase: 2
    },
    // 6. 평원 지대 (시작) - 맑음, 가끔 나뭇잎
    "PLAINS": { 
        fogColor: { r: 255, g: 255, b: 255 }, 
        fogAlpha: 0.0, // 깨끗함
        particleColor: "rgba(100, 200, 80, 0.7)", // 초록잎
        speed: 10, // 산들바람 (바람 불때만 나옴)
        count: 0,  // 기본 0개 (날씨 영향 받음)
        type: "leaf",
        sizeBase: 4
    },
    // 7. 사막 지대 - 황토색 모래폭풍
    "DESERT": { 
        fogColor: { r: 255, g: 180, b:50 }, 
        fogAlpha: 0.3, // 누런 틴트
        particleColor: "rgba(220, 180, 60, 0.9)", // 모래알
        speed: 30, // 빠름
        count: 100, // 많음 (바람 불면 더 많아짐)
        type: "sand",
        sizeBase: 2
    },
    // 8. 해변 지대 - 맑고 투명함, 물방울
    "BEACH": { 
        fogColor: { r: 0, g: 180, b: 216 }, 
        fogAlpha: 0.1, 
        particleColor: "rgba(200, 240, 255, 0.6)", 
        speed: 12, 
        count: 15,
        type: "bubble", // 물방울 느낌
        sizeBase: 3
    },
    // 9. 마법의 숲 - 신비로운 반짝임
    "MAGIC_FOREST": { 
        fogColor: { r: 114, g: 9, b: 183 }, 
        fogAlpha: 0.25, 
        particleColor: "rgba(255, 100, 200, 0.8)", // 핑크빛 반짝임
        speed: 3, 
        count: 50,
        type: "sparkle",
        sizeBase: 4
    },
    // 10. 잊혀진 도시 - 회색 잿가루
    "FORGOTTEN_CITY": { 
        fogColor: { r: 40, g: 50, b: 60 }, 
        fogAlpha: 0.5, // 탁함
        particleColor: "rgba(120, 130, 140, 0.7)", 
        speed: 6, 
        count: 80,
        type: "ash",
        sizeBase: 3
    },
    // 11. 머나먼 지대 - 삭막함
    "FAR_LANDS": { 
        fogColor: { r: 100, g: 100, b: 100 }, 
        fogAlpha: 0.3, 
        particleColor: "rgba(80, 80, 80, 0.5)", 
        speed: 15, 
        count: 30,
        type: "dust",
        sizeBase: 2
    },
    // 12. 세계의 끝 (북쪽) - 오로라, 어둠
    "NORTH_EDGE": { 
        fogColor: { r: 0, g: 20, b: 40 }, 
        fogAlpha: 0.4, 
        particleColor: "rgba(100, 255, 200, 0.6)", // 오로라빛
        speed: 4, 
        count: 60,
        type: "aurora_dust",
        sizeBase: 3
    }
};

// [중요] 실제 BIOME_DATA 범위와 일치시킴
const BIOME_RANGES = [
    { id: "SOUTH_EDGE", start: 0, end: 25000 },
    { id: "FROZEN_MOUNTAIN", start: 25000, end: 50000 },
    { id: "CORRUPTED", start: 50000, end: 75000 },
    { id: "ANCIENT_RUIN", start: 75000, end: 100000 },
    { id: "CLIFFS", start: 100000, end: 125000 },
    { id: "PLAINS", start: 125000, end: 175000 }, // 시작 지점
    { id: "DESERT", start: 175000, end: 200000 },
    { id: "BEACH", start: 200000, end: 225000 },
    { id: "MAGIC_FOREST", start: 225000, end: 250000 },
    { id: "FORGOTTEN_CITY", start: 250000, end: 275000 },
    { id: "FAR_LANDS", start: 275000, end: 300000 },
    { id: "NORTH_EDGE", start: 300000, end: 325000 }
];

export class BiomeVFXManager {
    constructor() {
        this.particles = [];
        // 풀링 (최대치 300개)
        for(let i=0; i<300; i++) {
            this.particles.push({
                x: Math.random() * 2000,
                y: Math.random() * 1000,
                sizeVar: Math.random() * 0.5 + 0.5,
                speedOffset: Math.random() * 0.4 + 0.8,
                rotation: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.1,
                jitterPhase: Math.random() * Math.PI * 2,
                active: false
            });
        }
        
        this.currentStyle = {
            fogColor: { r: 255, g: 255, b: 255 },
            fogAlpha: 0.0,
            particleColor: "rgba(0,0,0,0)",
            type: "none",
            speed: 0,
            count: 0,
            sizeBase: 0
        };
        this.currentBiomeId = "PLAINS";
    }

    getBiomeAt(x) {
        for (let b of BIOME_RANGES) {
            if (x >= b.start && x < b.end) return b.id;
        }
        return "PLAINS";
    }

    update(playerX, W, H, weatherId) {
        const biomeId = this.getBiomeAt(playerX);
        
        // 해당 바이옴의 기본 스타일 가져오기
        let target = { ...BIOME_STYLES[biomeId] || BIOME_STYLES["PLAINS"] };

        // [날씨 영향] 날씨에 따라 스타일 변형 (Overriding)
        const isWindy = (weatherId === "wind" || weatherId === "rain" || weatherId === "thunder");
        
        if (biomeId === "PLAINS") {
            // 평원은 바람 불 때만 나뭇잎 날림
            if (!isWindy) {
                target.count = 0; // 맑을 땐 깨끗
            } else {
                target.count = 15;
                target.speed = 20;
            }
        } 
        else if (biomeId === "DESERT") {
            // 사막은 바람 불면 모래폭풍 강화
            if (isWindy) {
                target.count = 250;
                target.speed = 50;
                target.fogAlpha = 0.7; // 더 뿌옇게
            } else {
                target.count = 20; // 평소엔 아지랑이 느낌으로 조금만
                target.speed = 5;
                target.fogAlpha = 0.2;
            }
        }
        // (필요하면 다른 바이옴도 날씨 조건 추가 가능)

        // 디버깅: 바이옴 변경 시 로그 출력
        if (this.currentBiomeId !== biomeId) {
            console.log(`[VFX] Biome Changed: ${this.currentBiomeId} -> ${biomeId}`);
            this.currentBiomeId = biomeId;
        }

        // 값 보간 (부드러운 전환)
        this.currentStyle.fogColor.r = lerp(this.currentStyle.fogColor.r, target.fogColor.r, 0.02);
        this.currentStyle.fogColor.g = lerp(this.currentStyle.fogColor.g, target.fogColor.g, 0.02);
        this.currentStyle.fogColor.b = lerp(this.currentStyle.fogColor.b, target.fogColor.b, 0.02);
        this.currentStyle.fogAlpha = lerp(this.currentStyle.fogAlpha, target.fogAlpha, 0.02);
        this.currentStyle.speed = lerp(this.currentStyle.speed, target.speed, 0.05);
        this.currentStyle.count = lerp(this.currentStyle.count, target.count, 0.05);

        // 즉시 적용
        this.currentStyle.type = target.type;
        this.currentStyle.particleColor = target.particleColor;
        this.currentStyle.sizeBase = target.sizeBase;

        // 파티클 물리 업데이트
        const activeCount = Math.floor(this.currentStyle.count);
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.active = (i < activeCount);

            if (p.active) {
                // 왼쪽 -> 오른쪽 이동
                p.x += this.currentStyle.speed * p.speedOffset;
                
                // 위아래 떨림 (Jitter)
                p.jitterPhase += 0.05;
                // 속도가 빠르면 덜 떨리고, 느리면 둥둥 떠다님
                let jitterAmp = (this.currentStyle.speed > 20) ? 0.5 : 1.5;
                p.y += Math.sin(p.jitterPhase) * jitterAmp;
                
                p.rotation += p.rotSpeed;

                // 화면 밖 리셋
                if (p.x > W) {
                    p.x = -50;
                    p.y = Math.random() * H;
                }
            }
        }
    }

    draw(ctx, W, H) {
        // 1. 화면 틴트 (Fog Tint)
        if (this.currentStyle.fogAlpha > 0.01) {
            const c = this.currentStyle.fogColor;
            ctx.fillStyle = `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${this.currentStyle.fogAlpha})`;
            ctx.fillRect(0, 0, W, H);
        }

        // 2. 파티클 그리기
        if (this.currentStyle.count < 1) return;

        ctx.fillStyle = this.currentStyle.particleColor;
        const baseSize = this.currentStyle.sizeBase;
        
        for (let p of this.particles) {
            if (!p.active) continue;
            
            const size = baseSize * p.sizeVar;

            if (this.currentStyle.type === "leaf") {
                // 나뭇잎 (회전하는 타원)
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.beginPath();
                ctx.ellipse(0, 0, size * 2, size, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            else if (this.currentStyle.type === "wind_line") {
                // 바람 선 (가로로 김)
                ctx.beginPath();
                ctx.rect(p.x, p.y, size * 10, 1); // 얇고 긴 선
                ctx.fill();
            }
            else if (this.currentStyle.type === "star" || this.currentStyle.type === "sparkle") {
                // 반짝이는 십자
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * 2); // 빨리 회전
                ctx.beginPath();
                ctx.moveTo(-size, 0); ctx.lineTo(size, 0);
                ctx.moveTo(0, -size); ctx.lineTo(0, size);
                ctx.strokeStyle = ctx.fillStyle;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
            }
            else if (this.currentStyle.type === "sand" || this.currentStyle.type === "snow") {
                // 작은 사각형 알갱이
                ctx.beginPath();
                ctx.rect(p.x, p.y, size, size);
                ctx.fill();
            }
            else {
                // 기본 원형 (포자, 먼지 등)
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}