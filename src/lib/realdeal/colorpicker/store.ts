import { writable, type Writable } from 'svelte/store';
import type { multiSelectUpdate, RGB } from './types';

export const contextColorUpdateStore: Writable<Map<string, multiSelectUpdate>> = writable(
    new Map<string, multiSelectUpdate>()
); 

export const contextCurrentLockedValueStore: Writable<Map<string, RGB>> = writable(
    new Map<string, RGB>()
);

