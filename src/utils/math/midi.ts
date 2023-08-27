/**
 * Gets frequency in Hz for corresponding MIDI note.
 */
export function midiNoteToFreq(note: number) {
  return 440 * 2 ** ((note - 69) / 12);
}
