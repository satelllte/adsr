export const round = (value: number, precision = 0): number => {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
};
