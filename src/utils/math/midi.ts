/**
 * Gets frequency in Hz for corresponding MIDI note.
 *
 * Same as JUCE's `MidiMessage::getMidiNoteInHertz`:
 * https://github.com/juce-framework/JUCE/blob/master/modules/juce_audio_basics/midi/juce_MidiMessage.cpp#L1037-L1040
 */
export function midiNoteToFreq(note: number) {
  return 440 * 2 ** ((note - 69) / 12);
}
