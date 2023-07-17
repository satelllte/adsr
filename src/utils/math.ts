/**
 * Clamps "x" value in [min..max] range
 */
export const clamp = (x: number, min: number, max: number): number => Math.max(min, Math.min(max, x));

/**
 * Clamps "x" value in [0..1] range
 */
export const clamp01 = (x: number): number => clamp(x, 0, 1);

/**
 * Maps "x" value in [0..1] range onto [min..max] range linearly
 */
export const mapFrom01Range = (x: number, min: number, max: number): number => ((max - min) * x) + min;

/**
 * Maps "x" value in [min..max] range onto [0..1] range linearly
 */
export const mapTo01Range = (x: number, min: number, max: number): number => (x - min) / (max - min);
