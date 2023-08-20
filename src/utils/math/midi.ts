export function noteToFreq(note: number) {
  const a = 440;
  return (a / 32) * 2 ** ((note - 9) / 12);
}
