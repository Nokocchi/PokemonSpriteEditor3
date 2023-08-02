import { writable, derived, type Writable } from 'svelte/store';
import { RGBToHSL, type RGB, HSLToRGB } from './types';

export const contextKeyOriginalRGBMap: Writable<Map<string, RGB>> = writable(new Map<string, RGB>());
// Currently we are setting currentColor = initialColor in Slider mount anyway, which will set these store values.
// Look into whether we can make a "super store" with the initial colors for each ColorPicker


