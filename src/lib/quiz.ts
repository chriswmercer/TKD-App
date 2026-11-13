import { belts, getPattern, type Belt } from '@/data';

export type Question =
  | { kind: 'choice'; id: string; prompt: string; hint?: string; options: string[]; answer: string }
  | { kind: 'reveal'; id: string; prompt: string; hint?: string; answer: string };

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function options(answer: string, pool: string[], n = 4): string[] {
  const distractors = shuffle([...new Set(pool.filter((p) => p && p !== answer))]).slice(0, n - 1);
  return shuffle([answer, ...distractors]);
}

/** Belts whose content the quiz draws from: this belt, optionally plus all earlier ones. */
export function quizBelts(beltId: string, includeEarlier: boolean): Belt[] {
  const target = belts.find((b) => b.id === beltId);
  if (!target) return [];
  return belts.filter((b) => (includeEarlier ? b.order <= target.order : b.id === beltId));
}

export function buildQuiz(beltId: string, includeEarlier: boolean, count: number): Question[] {
  const pool = quizBelts(beltId, includeEarlier);
  const terms = pool.flatMap((b) => b.terminology).filter((t) => t.english && t.korean);
  const allKorean = belts.flatMap((b) => b.terminology.map((t) => t.korean));
  const allEnglish = belts.flatMap((b) => b.terminology.map((t) => t.english));
  const qs: Question[] = [];

  terms.forEach((t, i) => {
    if (i % 2 === 0) {
      qs.push({
        kind: 'choice',
        id: `t-ke-${i}`,
        prompt: `What is the Korean for "${t.english}"?`,
        options: options(t.korean, allKorean),
        answer: t.korean,
      });
    } else {
      qs.push({
        kind: 'choice',
        id: `t-ek-${i}`,
        prompt: `What does "${t.korean}" mean?`,
        options: options(t.english, allEnglish),
        answer: t.english,
      });
    }
  });

  const patternIds = [...new Set(pool.flatMap((b) => b.patterns))];
  const allCounts = patternIds.map((id) => String(getPattern(id)?.movementCount ?? ''));
  for (const id of patternIds) {
    const p = getPattern(id);
    if (!p) continue;
    if (p.movementCount) {
      qs.push({
        kind: 'choice',
        id: `p-n-${id}`,
        prompt: `How many movements are in ${p.name}?`,
        options: options(String(p.movementCount), [
          ...allCounts,
          String(p.movementCount + 2),
          String(Math.max(1, p.movementCount - 3)),
        ]),
        answer: String(p.movementCount),
      });
    }
    if (p.meaning) {
      qs.push({
        kind: 'reveal',
        id: `p-m-${id}`,
        prompt: `What is the meaning or background of the pattern ${p.name}?`,
        answer: p.meaning,
      });
    }
  }

  for (const b of pool) {
    b.theory.forEach((t, i) => {
      if (!t.question) return;
      qs.push({
        kind: 'reveal',
        id: `th-${b.id}-${i}`,
        prompt: t.question,
        hint: b.name,
        answer: t.answer || 'No written answer in the syllabus for this item.',
      });
    });
  }

  return shuffle(qs).slice(0, count);
}

export function gradeFor(percent: number): { label: string; message: string } {
  if (percent >= 90) return { label: 'Excellent', message: 'Outstanding. You know this material very well.' };
  if (percent >= 75) return { label: 'Good', message: 'Solid result. A little more revision and it is perfect.' };
  if (percent >= 50) return { label: 'Developing', message: 'You are getting there. Review the reference and try again.' };
  return { label: 'Keep practising', message: 'Spend some time in the reference section, then retry.' };
}
