import raw from './content.json';
import type { Belt, Content, GlossaryTerm, Pattern } from './types';

export * from './types';

const content = raw as unknown as Content;

export const belts: Belt[] = content.belts;
export const patterns: Pattern[] = content.patterns;
export const generalSections = content.general;

export const getBelt = (id: string) => belts.find((b) => b.id === id);
export const getPattern = (id: string) => patterns.find((p) => p.id === id);

/** Every Korean term, de-duplicated, tagged with the first belt that introduces it. */
export const glossary: GlossaryTerm[] = (() => {
  const seen = new Set<string>();
  const out: GlossaryTerm[] = [];
  for (const b of belts) {
    for (const t of b.terminology) {
      const k = `${t.english.toLowerCase()}|${t.korean.toLowerCase()}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ ...t, beltId: b.id });
    }
  }
  return out;
})();
