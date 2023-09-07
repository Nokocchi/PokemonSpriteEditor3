import { writable, type Writable } from 'svelte/store';
import { ColorPickerMode, type RGB } from './types';


export const contextColorUpdateStore: Writable<Map<string, RGB>> = writable(
    new Map<string, RGB>()
); 

export const contextCurrentLockedValueStore: Writable<Map<string, RGB>> = writable(
    new Map<string, RGB>()
);

export const dirtyImageDataStore: Writable<Uint8ClampedArray> = writable();
export const colorPickerModeStore: Writable<string> = writable(ColorPickerMode.RGB);
export const downloadPokemonStore: Writable<boolean> = writable(false);
export const paletteGridSizeStore: Writable<number> = writable(2);
export const currentlySelectedColorPixelLocationsStore: Writable<Map<string, number[]>> = writable(new Map<string, number[]>());
