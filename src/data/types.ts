export type TermCategory = 'number' | 'command' | 'stance' | 'technique' | 'body' | 'other';

export interface Term {
  category: TermCategory;
  english: string;
  korean: string;
}

export interface Belt {
  id: string;
  name: string;
  beltColour: string;
  type: 'kup' | 'dan';
  rank: number;
  /** 0 = first belt, increasing with seniority. */
  order: number;
  practical: { title: string; detail?: string }[];
  theory: { question: string; answer: string }[];
  terminology: Term[];
  /** Pattern ids required at this grade. */
  patterns: string[];
  sparring: string[];
  otherSections: { heading: string; items: string[] }[];
}

export interface Movement {
  n: number;
  footwork: string;
  stance: string;
  technique: string;
  direction: string;
}

export interface Pattern {
  id: string;
  name: string;
  grade: string;
  /** Belt id of the first grade that requires this pattern, if known. */
  beltId?: string;
  meaning: string;
  movementCount: number;
  startingPosition: string;
  endingPosition: string;
  diagram: string;
  movements: Movement[];
}

export interface GeneralSection {
  id: string;
  title: string;
  summary: string;
  items: { title?: string; text: string }[];
}

export interface GlossaryTerm extends Term {
  beltId: string;
}

export interface Content {
  belts: Belt[];
  patterns: Pattern[];
  general: GeneralSection[];
}
