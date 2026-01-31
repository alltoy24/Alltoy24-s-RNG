// data/weathers.js

export const WEATHER_DB = {
    "clear": {
        name: "맑음",
        chance: 30,
        condition: "ALL", // 낮/밤/모두
        music: "bgms/clear.mp3",
        sfx: "weathers/clear.mp3",
        buff: { luck: 0.1, speed: 0.1 },
        particles: null // 파티클 없음
    },
    "rain": {
        name: "비",
        chance: 10,
        condition: "ALL",
        music: "bgms/rain.mp3",
        sfx: "weathers/rain.mp3",
        buff: { luck: 0.2, speed: -0.1 },
        particles: { type: "rain", count: 800, vy: 25 },
        skyOverride: { top: [30,40,50], bot: [80,90,110], sun: [180,180,180] } // 흐린 하늘색
    },
    "snow": {
        name: "눈",
        chance: 8.5,
        condition: "ALL",
        music: "bgms/snow.mp3",
        sfx: "weathers/snow.mp3",
        buff: { luck: 0.3, speed: -0.2 },
        particles: { type: "snow", count: 600, vy: 2 }
    },
    "wind": {
        name: "강풍",
        chance: 15,
        condition: "ALL",
        music: "bgms/wind.mp3",
        sfx: "weathers/wind.mp3",
        buff: { luck: 0, speed: 1.0 },
        particles: { type: "wind", count: 100, vx: 30 }
    },
    "thunder": {
        name: "뇌우",
        chance: 8.5,
        condition: "ALL",
        music: "bgms/thunder.mp3",
        sfx: "weathers/thunder.mp3",
        buff: { luck: 0.5, speed: 0.5 },
        particles: { type: "rain", count: 1500, vy: 35 },
        skyOverride: { top: [10,10,25], bot: [40,45,70], sun: [200,220,255] }
    },
    "foggy": {
        name: "안개",
        chance: 10,
        condition: "ALL",
        music: "bgms/foggy.mp3",
        sfx: "weathers/foggy.mp3",
        buff: { luck: 0, speed: 0.3 },
        particles: { type: "fog", count: 15, vx: 0.5 }
    },
    "cloudy": {
        name: "흐림",
        chance: 10,
        condition: "ALL",
        music: "bgms/cloudy.mp3",
        sfx: "weathers/cloudy.mp3",
        buff: { luck: -0.1, speed: -0.1 },
        particles: null
    },
    "eclipse": {
        name: "일식",
        chance: 3,
        condition: "DAY",
        music: "bgms/eclipse.mp3",
        sfx: "weathers/eerie_hum.mp3",
        buff: { luck: 10.0, speed: 0 },
        particles: null
    },
    "blood-moon": {
        name: "월식",
        chance: 3,
        condition: "NIGHT",
        music: "bgms/blood_moon.mp3",
        sfx: "weathers/wolf_howl.mp3",
        buff: { luck: 5.0, speed: 5.0 },
        particles: null,
        skyOverride: { top: [20,0,0], bot: [100,0,0], sun: [255,0,0] }
    },
    "glitch": {
        name: "차원 붕괴",
        chance: 2,
        condition: "ALL",
        music: "bgms/glitch_void.mp3",
        sfx: "weathers/glitch_ambience.mp3",
        buff: { luck: 25.0, speed: 10.0 },
        particles: { type: "glitch", count: 1000, vy: 15 },
        skyOverride: { top: [0,0,0], bot: [45,0,90], sun: [0,255,255] }
    }
};