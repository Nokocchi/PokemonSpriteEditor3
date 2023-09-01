import { writable, type Writable } from 'svelte/store';
import { ColorPickerMode, type multiSelectUpdate, type RGB } from './types';


export const contextColorUpdateStore: Writable<Map<string, multiSelectUpdate>> = writable(
    new Map<string, multiSelectUpdate>()
); 

export const contextCurrentLockedValueStore: Writable<Map<string, RGB>> = writable(
    new Map<string, RGB>()
);

export const dirtyImageDataStore: Writable<Uint8ClampedArray> = writable();
export const colorPickerModeStore: Writable<string> = writable(ColorPickerMode.RGB);
export const downloadPokemonStore: Writable<boolean> = writable(false);
