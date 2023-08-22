/**
 * Gets frequency in Hz for corresponding MIDI note.
 */
export function midiNoteToFreq(note: number) {
  const a = 440;
  return (a / 32) * 2 ** ((note - 9) / 12);
}
