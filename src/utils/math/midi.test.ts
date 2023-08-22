import {describe, expect, it} from 'vitest';
import {midiNoteToFreq} from './midi';

describe('midiNoteToFreq', () => {
  it('calculates frequency correctly for each MIDI note', () => {
    // https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
    const table = [
      {midiNote: 0, frequency: 8.18},
      {midiNote: 1, frequency: 8.66},
      {midiNote: 2, frequency: 9.18},
      {midiNote: 3, frequency: 9.72},
      {midiNote: 4, frequency: 10.3},
      {midiNote: 5, frequency: 10.91},
      {midiNote: 6, frequency: 11.56},
      {midiNote: 7, frequency: 12.25},
      {midiNote: 8, frequency: 12.98},
      {midiNote: 9, frequency: 13.75},
      {midiNote: 10, frequency: 14.57},
      {midiNote: 11, frequency: 15.43},
      {midiNote: 12, frequency: 16.35},
      {midiNote: 13, frequency: 17.32},
      {midiNote: 14, frequency: 18.35},
      {midiNote: 15, frequency: 19.45},
      {midiNote: 16, frequency: 20.6},
      {midiNote: 17, frequency: 21.83},
      {midiNote: 18, frequency: 23.12},
      {midiNote: 19, frequency: 24.5},
      {midiNote: 20, frequency: 25.96},
      {midiNote: 21, frequency: 27.5},
      {midiNote: 22, frequency: 29.14},
      {midiNote: 23, frequency: 30.87},
      {midiNote: 24, frequency: 32.7},
      {midiNote: 25, frequency: 34.65},
      {midiNote: 26, frequency: 36.71},
      {midiNote: 27, frequency: 38.89},
      {midiNote: 28, frequency: 41.2},
      {midiNote: 29, frequency: 43.65},
      {midiNote: 30, frequency: 46.25},
      {midiNote: 31, frequency: 49},
      {midiNote: 32, frequency: 51.91},
      {midiNote: 33, frequency: 55},
      {midiNote: 34, frequency: 58.27},
      {midiNote: 35, frequency: 61.74},
      {midiNote: 36, frequency: 65.41},
      {midiNote: 37, frequency: 69.3},
      {midiNote: 38, frequency: 73.42},
      {midiNote: 39, frequency: 77.78},
      {midiNote: 40, frequency: 82.41},
      {midiNote: 41, frequency: 87.31},
      {midiNote: 42, frequency: 92.5},
      {midiNote: 43, frequency: 98},
      {midiNote: 44, frequency: 103.83},
      {midiNote: 45, frequency: 110},
      {midiNote: 46, frequency: 116.54},
      {midiNote: 47, frequency: 123.47},
      {midiNote: 48, frequency: 130.81},
      {midiNote: 49, frequency: 138.59},
      {midiNote: 50, frequency: 146.83},
      {midiNote: 51, frequency: 155.56},
      {midiNote: 52, frequency: 164.81},
      {midiNote: 53, frequency: 174.61},
      {midiNote: 54, frequency: 185.0},
      {midiNote: 55, frequency: 196.0},
      {midiNote: 56, frequency: 207.65},
      {midiNote: 57, frequency: 220},
      {midiNote: 58, frequency: 233.08},
      {midiNote: 59, frequency: 246.94},
      {midiNote: 60, frequency: 261.63},
      {midiNote: 61, frequency: 277.18},
      {midiNote: 62, frequency: 293.66},
      {midiNote: 63, frequency: 311.13},
      {midiNote: 64, frequency: 329.63},
      {midiNote: 65, frequency: 349.23},
      {midiNote: 66, frequency: 369.99},
      {midiNote: 67, frequency: 392},
      {midiNote: 68, frequency: 415.3},
      {midiNote: 69, frequency: 440},
      {midiNote: 70, frequency: 466.16},
      {midiNote: 71, frequency: 493.88},
      {midiNote: 72, frequency: 523.25},
      {midiNote: 73, frequency: 554.37},
      {midiNote: 74, frequency: 587.33},
      {midiNote: 75, frequency: 622.25},
      {midiNote: 76, frequency: 659.26},
      {midiNote: 77, frequency: 698.46},
      {midiNote: 78, frequency: 739.99},
      {midiNote: 79, frequency: 783.99},
      {midiNote: 80, frequency: 830.61},
      {midiNote: 81, frequency: 880},
      {midiNote: 82, frequency: 932.33},
      {midiNote: 83, frequency: 987.77},
      {midiNote: 84, frequency: 1046.5},
      {midiNote: 85, frequency: 1108.73},
      {midiNote: 86, frequency: 1174.66},
      {midiNote: 87, frequency: 1244.51},
      {midiNote: 88, frequency: 1318.51},
      {midiNote: 89, frequency: 1396.91},
      {midiNote: 90, frequency: 1479.98},
      {midiNote: 91, frequency: 1567.98},
      {midiNote: 92, frequency: 1661.22},
      {midiNote: 93, frequency: 1760},
      {midiNote: 94, frequency: 1864.66},
      {midiNote: 95, frequency: 1975.53},
      {midiNote: 96, frequency: 2093.0},
      {midiNote: 97, frequency: 2217.46},
      {midiNote: 98, frequency: 2349.32},
      {midiNote: 99, frequency: 2489.02},
      {midiNote: 100, frequency: 2637.02},
      {midiNote: 101, frequency: 2793.83},
      {midiNote: 102, frequency: 2959.96},
      {midiNote: 103, frequency: 3135.96},
      {midiNote: 104, frequency: 3322.44},
      {midiNote: 105, frequency: 3520},
      {midiNote: 106, frequency: 3729.31},
      {midiNote: 107, frequency: 3951.07},
      {midiNote: 108, frequency: 4186.01},
      {midiNote: 109, frequency: 4434.92},
      {midiNote: 110, frequency: 4698.64},
      {midiNote: 111, frequency: 4978.03},
      {midiNote: 112, frequency: 5274.04},
      {midiNote: 113, frequency: 5587.65},
      {midiNote: 114, frequency: 5919.91},
      {midiNote: 115, frequency: 6271.93},
      {midiNote: 116, frequency: 6644.88},
      {midiNote: 117, frequency: 7040},
      {midiNote: 118, frequency: 7458.62},
      {midiNote: 119, frequency: 7902.13},
      {midiNote: 120, frequency: 8372.02},
      {midiNote: 121, frequency: 8869.84},
      {midiNote: 122, frequency: 9397.27},
      {midiNote: 123, frequency: 9956.06},
      {midiNote: 124, frequency: 10548.08},
      {midiNote: 125, frequency: 11175.3},
      {midiNote: 126, frequency: 11839.82},
      {midiNote: 127, frequency: 12543.85},
    ] satisfies Array<{
      midiNote: number;
      frequency: number;
    }>;

    table.forEach(({midiNote, frequency}) => {
      expect(midiNoteToFreq(midiNote)).toBeCloseTo(frequency);
    });
  });
});
