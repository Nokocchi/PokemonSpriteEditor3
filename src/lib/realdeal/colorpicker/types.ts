import { writable, type Writable } from "svelte/store";

export type SpritePath = {
    fullPath: string;
    generation: string;
    game: string;
    other: string[]
}

export type PokemonSelectOption = { id: number, name: string }

export type HSL = {
    h: number;
    s: number;
    l: number;
};

export type RGB = {
    r: number;
    g: number;
    b: number;
};

export type HEX = {
    val: string;
};


export const HSLToRGB = (hsl: HSL) => {
    let { h, s, l } = hsl;
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
        r: Math.round(255 * f(0)),
        g: Math.round(255 * f(8)),
        b: Math.round(255 * f(4))
    } as RGB;
};

export const RGBToHSL = (rgb: RGB) => {
    let { r, g, b } = rgb;
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0;
    return {
        h: Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
        s: Math.round(100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
        l: Math.round((100 * (2 * l - s)) / 2),
    } as HSL;
};

export type NewColorResult = {
    pixelsToChange: number[]
    newColor: RGB
}

export const CurrentWindow = Object.freeze({
    SELECT: "SELECT",
    EDIT: "EDIT",
    PALETTES: "PALETTES",
});

export const isEquals = (color1: RGB, color2: RGB): boolean => {
    return color1 && color2
        && color1.r === color2.r
        && color1.g === color2.g
        && color1.b === color2.b;
}

export let getAsRGB = (contextKey: string): RGB => {
    const chars: string[] = contextKey.split(":");
    return {
        r: Number(chars[0]),
        g: Number(chars[1]),
        b: Number(chars[2]),
    };
};

export const contextUpdateRStore: Writable<Map<RGB, Function>> = writable(
    new Map<RGB, Function>()
);
export const contextUpdateGStore: Writable<Map<RGB, Function>> = writable(
    new Map<RGB, Function>()
);
export const contextUpdateBStore: Writable<Map<RGB, Function>> = writable(
    new Map<RGB, Function>()
);