
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

export interface ColorPickerResult_i {
    color: Color;
    colorAsRGB: () => RGB;
}

export interface RgbColorPickerResult_i extends ColorPickerResult_i {
    color: RGB;
    colorAsRGB: () => RGB;
}

export class RgbColorPickerResult implements RgbColorPickerResult_i {
    color: RGB;

    constructor(color: RGB) {
        this.color = color;
    }

    colorAsRGB(): RGB {
        return this.color;
    }
}

export type Color = RGB | HSL | HEX;

export interface HslColorPickerResult_i extends ColorPickerResult_i {
    color: HSL;
    colorAsRGB: () => RGB;
}

export class HslColorPickerResult implements HslColorPickerResult_i {
    color: HSL;

    constructor(color: HSL) {
        this.color = color;
    }

    colorAsRGB(): RGB {
        return HSLToRGB(this.color)
    }
}

const HSLToRGB = (hsl: HSL) => {
    let {h, s, l} = hsl;
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
        r: Math.round(255 * f(0)), 
        g: Math.round(255 * f(8)), 
        b: Math.round(255 * f(4))} as RGB;
  };

export const RGBToHSL = (rgb: RGB) => {
    let {r, g, b} = rgb;
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

