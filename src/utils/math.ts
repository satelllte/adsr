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

/**
 * Maps MIDI index to frequency in Hz. A4 MIDI note's index is 69
 */
export const mapMidiToHz = (midiIndex: number): number => 440 * (2 ** ((midiIndex - 69) / 12));

/**
 * Gets MIDI note index by (note, octave) pair.
 * "note" - number from 0 to 11, defining a note from "C" to "B" (absolute, without specifying octave).
 * "octave" - number of octave from 1 to 9.
 */
export const getMidiIndex = (note: number, octave: number): number => 12 + (12 * octave) + note;
