import { BIOME_DATA } from '../data/biomes.js';
import { hexToRgb, lerp } from '../utils.js';

export class BiomeManager {
    constructor() {
        this.currentBiomeKey = "PLAINS";
        this.blendRange = 3000; // 부드러운 전환 범위
        
        // 현재 상태 (보간 적용)
        this.state = {
            name: "평원 지대",
            skyTop: [135, 206, 235], 
            skyBot: [240, 255, 240],
            ground: [46, 125, 50],
            gravity: 0.8,
            fogDensity: 0.1
        };

        this.targetState = { ...this.state };
        this.lerpSpeed = 0.05;

        // ★ [추가] 방문 기록 관리
        this.visitedBiomes = new Set();
        const saved = localStorage.getItem('rng_visited_biomes');
        if (saved) {
            try {
                this.visitedBiomes = new Set(JSON.parse(saved));
            } catch(e) { console.error("방문 기록 로드 실패", e); }
        }
    }

    getBiomeWeights(x) {
        let weights = [];
        for (const key in BIOME_DATA) {
            const b = BIOME_DATA[key];
            const [start, end] = b.range;

            if (x >= start - this.blendRange && x <= end + this.blendRange) {
                let dist = Math.max(0, x < start ? start - x : x > end ? x - end : 0);
                let weight = Math.max(0, 1.0 - (dist / this.blendRange));
                
                // 코사인 보간 (S자 곡선)
                const smoothWeight = (1 - Math.cos(weight * Math.PI)) / 2;
                if (smoothWeight > 0) weights.push({ key, weight: smoothWeight });
            }
        }

        const total = weights.reduce((s, b) => s + b.weight, 0);
        if (total === 0) return [{ key: "PLAINS", weight: 1.0 }];
        return weights.map(b => ({ key: b.key, weight: b.weight / total }));
    }

    getColorAt(x) {
        const weights = this.getBiomeWeights(x);
        let gRGB = [0, 0, 0], tRGB = [0, 0, 0], bRGB = [0, 0, 0];

        weights.forEach(bw => {
            const data = BIOME_DATA[bw.key];
            const g = hexToRgb(data.ground);
            const t = hexToRgb(data.sky.top);
            const b = hexToRgb(data.sky.bot);
            
            for(let i=0; i<3; i++) {
                gRGB[i] += g[i] * bw.weight;
                tRGB[i] += t[i] * bw.weight;
                bRGB[i] += b[i] * bw.weight;
            }
        });

        return { ground: gRGB, skyTop: tRGB, skyBot: bRGB };
    }

    update(playerX) {
        const weights = this.getBiomeWeights(playerX);
        
        let tRGB = [0, 0, 0], bRGB = [0, 0, 0], gRGB = [0, 0, 0];
        let grav = 0;
        let mainBiome = weights[0]; // 가장 가중치가 높은 바이옴 찾기용

        weights.forEach(bw => {
            const data = BIOME_DATA[bw.key];
            const w = bw.weight;

            const t = hexToRgb(data.sky.top);
            const b = hexToRgb(data.sky.bot);
            const g = hexToRgb(data.ground);

            for(let i=0; i<3; i++) {
                tRGB[i] += t[i] * w;
                bRGB[i] += b[i] * w;
                gRGB[i] += g[i] * w;
            }
            grav += (data.physics?.gravity || 0.8) * w;
            
            // 가장 비중이 큰 바이옴 찾기
            if (w > (mainBiome?.weight || 0)) mainBiome = bw;
        });

        // ★ [핵심 추가] 바이옴 변경 감지 및 UI 트리거
        if (mainBiome.key !== this.currentBiomeKey) {
            this.triggerUI(mainBiome.key);
            this.currentBiomeKey = mainBiome.key;
        }

        // 1. 목표치 설정
        this.targetState = {
            name: BIOME_DATA[mainBiome.key].name,
            skyTop: tRGB,
            skyBot: bRGB,
            ground: gRGB,
            gravity: grav
        };

        // 2. 색상/물리 보간 (Lerp)
        for (let i = 0; i < 3; i++) {
            this.state.skyTop[i] = lerp(this.state.skyTop[i], this.targetState.skyTop[i], this.lerpSpeed);
            this.state.skyBot[i] = lerp(this.state.skyBot[i], this.targetState.skyBot[i], this.lerpSpeed);
            this.state.ground[i] = lerp(this.state.ground[i], this.targetState.ground[i], this.lerpSpeed);
        }
        this.state.gravity = lerp(this.state.gravity, this.targetState.gravity, this.lerpSpeed);
        this.state.name = this.targetState.name;
    }

    // ★ [신규 기능] UI 알림 트리거
    triggerUI(key) {
        const biome = BIOME_DATA[key];
        const name = biome.name;

        // 최초 방문 여부 확인
        if (!this.visitedBiomes.has(key)) {
            // 1. 최초 방문: 중앙 타이틀 (실크송 스타일)
            this.visitedBiomes.add(key);
            localStorage.setItem('rng_visited_biomes', JSON.stringify([...this.visitedBiomes]));
            this.showCenterTitle(name);
        } else {
            // 2. 재방문: 사이드 토스트 알림
            this.showSideToast(name);
        }
    }

    showCenterTitle(text) {
        const overlay = document.getElementById("biome-center-overlay");
        const titleText = document.getElementById("silk-title-text");
        
        if (overlay && titleText) {
            titleText.innerText = text;
            overlay.classList.remove("active");
            void overlay.offsetWidth; // 리플로우 강제 (애니메이션 리셋)
            overlay.classList.add("active");
        }
    }

    showSideToast(text) {
        const toast = document.getElementById("biome-side-toast");
        
        if (toast) {
            toast.innerText = text;
            toast.classList.add("show");
            
            // 기존 타이머 취소 후 재설정
            if (this.toastTimer) clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
        }
    }
}