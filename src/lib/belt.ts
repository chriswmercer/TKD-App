/** Maps the free-text belt colour from the syllabus to display colours. */
const COLOURS: Record<string, string> = {
  white: '#F4F4F0',
  yellow: '#F2C21B',
  green: '#2E9B4E',
  blue: '#2F6FD0',
  red: '#C7352C',
  black: '#17181B',
};

export interface BeltLook {
  main: string;
  /** Tag stripe colour for in-between belts (e.g. "Yellow tag"). */
  stripe?: string;
  /** Readable text colour on top of `main`. */
  onMain: string;
}

export function beltLook(colour: string): BeltLook {
  const words: string[] = colour.toLowerCase().match(/[a-z]+/g) ?? [];
  const found = words.filter((w) => COLOURS[w]);
  // First colour is the belt; a second colour (e.g. "red with black stripe") is the stripe.
  const main = found.length ? COLOURS[found[0]] : '#9A9DA4';
  const stripe = found.length > 1 ? COLOURS[found[1]] : undefined;
  const light = ['#F4F4F0', '#F2C21B'].includes(main);
  return { main, stripe: stripe !== main ? stripe : undefined, onMain: light ? '#15161A' : '#FFFFFF' };
}
