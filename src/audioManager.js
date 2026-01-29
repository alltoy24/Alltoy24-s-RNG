// src/audioManager.js

// 1. 모든 효과음 파일 경로 모음 (HTML 태그 필요 없음)
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
    'hit_crit': './sfx/hit_crit.mp3'
};

// 오디오 객체 저장소
const sounds = {};

// 2. 초기화: 오디오 객체 미리 생성 (로딩)
Object.keys(SOUND_PATHS).forEach(key => {
    sounds[key] = new Audio(SOUND_PATHS[key]);
    sounds[key].volume = 0.9;
    if(key === 'spin') sounds[key].loop = true; // 스핀만 반복 재생
});

// 3. 배경음악(BGM) & 날씨 소리 플레이어 (전역 사용)
export const bgmPlayer = new Audio();
bgmPlayer.loop = true;
bgmPlayer.volume = 1.0;

export const weatherSfxPlayer = new Audio();
weatherSfxPlayer.loop = true;
weatherSfxPlayer.volume = 1.0;

// 5. [추가] main.js의 전투 시스템과 호환을 위한 객체 생성
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
// 4. 기능 함수들 export
// =========================================

// 소리 재생 (키 이름으로 재생)
export function playSound(key) {
    const audio = sounds[key];
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {}); // 에러 무시
    }
}

// 스핀 소리 멈춤 전용
export function stopSound(key) {
    const audio = sounds[key];
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

// BGM 페이드 아웃/인 (날씨 바뀔 때 등)
let fadeInterval;
export function smoothAudioTransition(newBgmSrc, newSfxSrc) {
    clearInterval(fadeInterval);
    
    fadeInterval = setInterval(() => {
        if (bgmPlayer.volume > 0.05) {
            // 소리 줄이기
            bgmPlayer.volume = Math.max(0, bgmPlayer.volume - 0.05);
            if (weatherSfxPlayer) weatherSfxPlayer.volume = Math.max(0, weatherSfxPlayer.volume - 0.05);
        } else {
            // 소리 교체 및 재생
            clearInterval(fadeInterval);
            
            bgmPlayer.src = newBgmSrc;
            bgmPlayer.play().catch(()=>{});

            if (newSfxSrc) {
                weatherSfxPlayer.src = newSfxSrc;
                weatherSfxPlayer.play().catch(()=>{});
            } else {
                weatherSfxPlayer.pause();
            }

            // 소리 키우기
            let fadeIn = setInterval(() => {
                if (bgmPlayer.volume < 0.95) {
                    bgmPlayer.volume = Math.min(1, bgmPlayer.volume + 0.05);
                    if (newSfxSrc) weatherSfxPlayer.volume = Math.min(1, weatherSfxPlayer.volume + 0.05);
                } else {
                    bgmPlayer.volume = 1.0;
                    clearInterval(fadeIn);
                }
            }, 50);
        }
    }, 50);
}

// 연출용 BGM 조절
let suspenseInterval;
export function fadeOutBGM() {
    clearInterval(suspenseInterval);
    suspenseInterval = setInterval(() => {
        if (bgmPlayer.volume > 0.1) bgmPlayer.volume -= 0.05;
        else clearInterval(suspenseInterval);
    }, 50);
}

export function restoreBGM() {
    clearInterval(suspenseInterval);
    bgmPlayer.volume = 1.0;
}