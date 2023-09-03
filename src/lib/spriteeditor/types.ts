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

export const HSLToRGB = (hsl: HSL): RGB => {
    let { h, s, l } = hsl;
    s /= 100;
    l /= 100;

    let a=s*Math.min(l,1-l);
    let f= (n,k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1),-1);
    let r = f(0);
    let g = f(8);
    let b = f(4);
    return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
}

export const RGBToHSL = (rgb: RGB): HSL => {
    let { r, g, b } = rgb;
    r /= 255;
    g /= 255;
    b /= 255;

    let v =Math.max(r,g,b), c=v-Math.min(r,g,b), f=(1-Math.abs(v+v-c-1)); 
    let hTemp = c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
    let h = 60*(hTemp<0?hTemp+6:hTemp);
    let s = f ? c/f : 0;
    let l = (v+v-c)/2;
    return {h: h, s: s*100, l: l*100};
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

export const RGBVal = Object.freeze({
    r: "r",
    g: "g",
    b: "b",
});

export const HSLVal = Object.freeze({
    h: "h",
    s: "s",
    l: "l",
});

export const extractPixelData = (pkmnImage: HTMLImageElement): ImageData => {
    if (!pkmnImage) return;
    let tempCanvas: OffscreenCanvas = new OffscreenCanvas(
        pkmnImage.width,
        pkmnImage.height
    );
    tempCanvas
        .getContext("2d", { willReadFrequently: true })
        .drawImage(pkmnImage, 0, 0);
    return tempCanvas
        .getContext("2d")
        .getImageData(0, 0, pkmnImage.width, pkmnImage.height);
};

export const canvasScaler = (dragHandle: HTMLDivElement, [initialHeight, maxCanvasSize, updateFunction]) => {

    // How important are destroy and update functions in the return value? 
    // Make the resizing of the canvas prettier. Avoid all those weird if(undefined). Maybe use a keyblock around the whole canvas? 
    let moving = false;

    dragHandle.style.height = `${initialHeight}px`;

    dragHandle.addEventListener('mousedown', () => {
        moving = true;
    });

    dragHandle.addEventListener('touchstart', (e) => {
        moving = true;
    }, { passive: false });

    window.addEventListener('mousemove', (e) => {
        let mouseYPos: number = e.clientY;
        if (moving && 0 <= mouseYPos && mouseYPos <= maxCanvasSize) {
            dragHandle.style.height = `${mouseYPos}px`;
            updateFunction(mouseYPos);
        }
    });

    window.addEventListener('touchmove', (e) => {
        let mouseYPos: number = e.touches[0].clientY;
        if (moving && 0 <= mouseYPos && mouseYPos <= maxCanvasSize) {
            dragHandle.style.height = `${mouseYPos}px`;
            updateFunction(mouseYPos);
        }
    }, { passive: false });

    window.addEventListener('mouseup', () => {
        moving = false;
    });

    window.addEventListener('touchup', () => {
        moving = false;
    });

    /*
    return {
        update(options) {
            tooltip.setProps(options);
        },
        destroy() {
            tooltip.destroy();
        }
    };*/

}

export const scrollGlassPaneWidth = (scrollGlassPanel: HTMLDivElement, parent: HTMLDivElement) => {
    
    scrollGlassPanel.style.width = parent ? `${parent.scrollWidth}px` : "0px";
    
    return {
        update(updatedParent: HTMLDivElement) {
            scrollGlassPanel.style.width = `${updatedParent.scrollWidth}px`;
        },
    };

}

export const getMaxCanvasHeight = (imageHeight: number, imageWidth: number, screenWidth: number) => {
    let imageProportions: number = imageHeight / imageWidth;
    let maxWidthOfSingleCanvas: number = screenWidth / 2;
    return maxWidthOfSingleCanvas * imageProportions;
};

export const ColorPickerMode = Object.freeze({
    RGB: "RGB",
    HSL: "HSL",
    HEX: "HEX",
});

export const getSliderColor = (h: number, hslValue: string, val: number) => {
    // for all slider background colors, use current hue, full saturation and medium luminosity
    // for the individual slider's min and max values, we can just set those to 0 or 100
    let hsl: HSL = {h: h, s: 100, l: 50};
    if(hslValue){
        hsl[hslValue] = val;
    }
    let rgb: RGB = HSLToRGB(hsl);
    return "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")"
}


