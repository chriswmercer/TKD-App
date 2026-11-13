// Normalises content-src/*.json (raw collected data) into src/data/content.json.
// Run: node scripts/build-content.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (...p) => join(root, 'content-src', ...p);
const readJson = (f) => JSON.parse(readFileSync(f, 'utf8'));
const key = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const warnings = [];

const patternFiles = readdirSync(src('patterns')).filter((f) => f.endsWith('.json'));
const rawPatterns = patternFiles.map((f) => readJson(src('patterns', f)));
const patternByKey = new Map(rawPatterns.map((p) => [key(p.name), p]));

const gradeFiles = readdirSync(src('gradings'))
  .filter((f) => /^grade-\d+\.json$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

const belts = gradeFiles.map((f, order) => {
  const g = readJson(src('gradings', f));
  const patternIds = [];
  for (const name of g.patterns ?? []) {
    const p = patternByKey.get(key(name));
    if (p) patternIds.push(p.id);
    else warnings.push(`${g.name}: pattern "${name}" has no pattern file`);
  }
  return {
    id: g.id,
    name: g.name,
    beltColour: g.beltColour ?? '',
    type: g.type,
    rank: g.rank,
    order,
    practical: g.practical ?? [],
    theory: g.theory ?? [],
    terminology: g.terminology ?? [],
    patterns: patternIds,
    sparring: g.sparring ?? [],
    otherSections: g.otherSections ?? [],
  };
});

const firstBeltForPattern = new Map();
for (const b of belts) for (const id of b.patterns) if (!firstBeltForPattern.has(id)) firstBeltForPattern.set(id, b.id);

const patterns = rawPatterns
  .map((p) => {
    if (p.movements.length !== p.movementCount)
      warnings.push(`${p.name}: ${p.movements.length} movements recorded vs ${p.movementCount} stated`);
    return {
      id: p.id,
      name: p.name,
      grade: p.grade ?? '',
      beltId: firstBeltForPattern.get(p.id),
      meaning: p.meaning ?? '',
      movementCount: p.movementCount,
      startingPosition: p.startingPosition ?? '',
      endingPosition: p.endingPosition ?? '',
      diagram: p.diagram ?? '',
      movements: p.movements.map((m) => ({
        n: m.n,
        footwork: m.footwork ?? '',
        stance: m.stance ?? '',
        technique: m.technique ?? '',
        direction: m.direction ?? '',
      })),
    };
  })
  .sort((a, b) => {
    const ao = belts.find((x) => x.id === a.beltId)?.order ?? 999;
    const bo = belts.find((x) => x.id === b.beltId)?.order ?? 999;
    return ao - bo || a.name.localeCompare(b.name);
  });

let general = [];
try {
  general = readJson(src('general', 'general.json')).sections;
} catch {
  warnings.push('general.json missing');
}

writeFileSync(
  join(root, 'src', 'data', 'content.json'),
  JSON.stringify({ belts, patterns, general }, null, 1)
);
console.log(`belts: ${belts.length}, patterns: ${patterns.length}, general sections: ${general.length}`);
for (const w of warnings) console.warn('WARN', w);
