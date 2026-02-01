// src/audioManager.js

export let globalBgmVolume = 0.5; // 기본값 50%
export let globalSfxVolume = 0.5;

export const bgmPlayer = document.getElementById("bgm");
export const weatherSfxPlayer = document.getElementById("weather-sfx");

// 1. 모든 효과음 파일 경로 모음
const SOUND_PATHS = {
    // UI 및 시스템
    'roll': './sfx/roll.mp3',
    'levelup': './sfx/levelup.mp3',
    'click': './sfx/click.mp3',
    'success': './sfx/success.mp3',
    'equip': './sfx/equip.mp3',
    'reveal': './sfx/reveal.mp3',
    'glitch': './sfx/glitch.mp3',
    'star': './sfx/star_catch.mp3',
    'spin': './sfx/spin.mp3',
    'lightning': './sfx/lightning.mp3',
    'chat_ping': './sfx/chat_ping.mp3',
    // VFX
    'meteor_fall': './sfx/meteor_fall.mp3',
    'meteor_impact': './sfx/meteor_impact.mp3',
    'magic_circle': './sfx/magic_circle.mp3',
    'meteor_friction': './sfx/meteor_friction.mp3',
    'flashbang_ring': './sfx/flashbang_ring.mp3',
    // 전투 (COMBAT_SFX)
    'attack_1': './sfx/atk_bullet.mp3',
    'attack_2': './sfx/atk_slash.mp3',
    'attack_3': './sfx/atk_laser.mp3',
    'attack_4': './sfx/atk_holy.mp3',
    'attack_5': './sfx/atk_chakram.mp3',
    'attack_6': './sfx/atk_void.mp3',
    'hit_normal': './sfx/hit_normal.mp3',
    'hit_crit': './sfx/hit_crit.mp3',
    'ice_crack': './sfx/ice_crack.mp3' // 얼음 가시 소리 추가
};

// 오디오 객체 저장소
const sounds = {};

// 2. 초기화: 오디오 객체 미리 생성 (로딩)
Object.keys(SOUND_PATHS).forEach(key => {
    sounds[key] = new Audio(SOUND_PATHS[key]);
    if(key === 'spin') sounds[key].loop = true; 
});

// 3. 전투 시스템 호환 객체
export const COMBAT_SFX = {
    attack_1: sounds['attack_1'],
    attack_2: sounds['attack_2'],
    attack_3: sounds['attack_3'],
    attack_4: sounds['attack_4'],
    attack_5: sounds['attack_5'],
    attack_6: sounds['attack_6'],
    hit_normal: sounds['hit_normal'],
    hit_crit: sounds['hit_crit']
};

// =========================================
// 4. 볼륨 조절 함수 (사용자 설정)
// =========================================

export function setBGMVolume(val) {
    globalBgmVolume = Math.max(0, Math.min(1, val)); // 0~1 사이로 제한
    if (bgmPlayer) bgmPlayer.volume = globalBgmVolume;
}

export function setSFXVolume(val) {
    globalSfxVolume = Math.max(0, Math.min(1, val));
    // 날씨 효과음(지속음)은 즉시 반영
    if (weatherSfxPlayer) weatherSfxPlayer.volume = globalSfxVolume;
}

// =========================================
// 5. 기능 함수들
// =========================================

export function playSound(type) {
    const el = document.getElementById(`sfx-${type}`);
    if (el) {
        if (!el.paused) el.currentTime = 0;
        el.volume = globalSfxVolume; 
        el.play().catch(() => {});
    } else if (sounds[type]) {
        // 미리 로딩된 오디오 객체 사용
        if (!sounds[type].paused) sounds[type].currentTime = 0;
        sounds[type].volume = globalSfxVolume;
        sounds[type].play().catch(() => {});
    } else if (COMBAT_SFX && COMBAT_SFX[type]) {
        // 전투 사운드 (동시 재생을 위해 클론 생성)
        let clone = COMBAT_SFX[type].cloneNode();
        clone.volume = globalSfxVolume;
        clone.play().catch(() => {});
    }
}

export function stopSound(key) {
    const audio = sounds[key];
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    const el = document.getElementById(`sfx-${key}`);
    if(el) {
        el.pause();
        el.currentTime = 0;
    }
}

// ★ [수정됨] 부드러운 전환 (최대 볼륨을 globalBgmVolume으로 제한)
let fadeInterval;
export function smoothAudioTransition(newBgmSrc, newSfxSrc) {
    clearInterval(fadeInterval);
    
    // 1. 소리 줄이기 (현재 볼륨 -> 0)
    fadeInterval = setInterval(() => {
        if (bgmPlayer.volume > 0.05) {
            bgmPlayer.volume = Math.max(0, bgmPlayer.volume - 0.05);
            if (weatherSfxPlayer) weatherSfxPlayer.volume = Math.max(0, weatherSfxPlayer.volume - 0.05);
        } else {
            // 소리 다 줄어들면 교체
            clearInterval(fadeInterval);
            
            // 소스 변경
            if(newBgmSrc && bgmPlayer.src !== newBgmSrc) {
                bgmPlayer.src = newBgmSrc;
                bgmPlayer.play().catch(()=>{});
            }
            if (newSfxSrc) {
                weatherSfxPlayer.src = newSfxSrc;
                weatherSfxPlayer.play().catch(()=>{});
            } else {
                weatherSfxPlayer.pause();
            }

            // 2. 소리 키우기 (0 -> 사용자 설정값까지)
            let fadeIn = setInterval(() => {
                let targetBGM = globalBgmVolume;
                let targetSFX = globalSfxVolume;

                let bgmDone = false;
                let sfxDone = false;

                // BGM 페이드 인
                if (bgmPlayer.volume < targetBGM - 0.05) {
                    bgmPlayer.volume += 0.05;
                } else {
                    bgmPlayer.volume = targetBGM;
                    bgmDone = true;
                }

                // SFX 페이드 인 (날씨음)
                if (weatherSfxPlayer && newSfxSrc) {
                    if (weatherSfxPlayer.volume < targetSFX - 0.05) {
                        weatherSfxPlayer.volume += 0.05;
                    } else {
                        weatherSfxPlayer.volume = targetSFX;
                        sfxDone = true;
                    }
                } else {
                    sfxDone = true;
                }

                if (bgmDone && sfxDone) clearInterval(fadeIn);

            }, 50);
        }
    }, 50);
}

// ★ [수정됨] 연출용 BGM 조절 (일시적으로 줄였다가 복구)
let suspenseInterval;
export function fadeOutBGM() {
    clearInterval(suspenseInterval);
    suspenseInterval = setInterval(() => {
        // 현재 설정된 볼륨의 10% 수준까지만 줄임
        if (bgmPlayer.volume > globalBgmVolume * 0.1) {
            bgmPlayer.volume -= 0.05;
        } else {
            clearInterval(suspenseInterval);
        }
    }, 50);
}

export function restoreBGM() {
    clearInterval(suspenseInterval);
    // 원래 설정된 볼륨으로 복구
    bgmPlayer.volume = globalBgmVolume;
}