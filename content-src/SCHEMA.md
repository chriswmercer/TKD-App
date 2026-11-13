# Content collection schema (raw, pre-app)

Source: https://www.blackbeltschools.com/syllabus/ (TAGB syllabus, (c) Andrew Tombling).
Rule: record FACTS faithfully (technique names, Korean terms, move sequences, counts).
Rewrite ALL explanatory prose (meanings, theory answers, descriptions) in your own words.
Never invent content. If the page is inconsistent/unclear, keep your best reading and add a string to `notes`.

## content-src/gradings/grade-<N>.json   (N = gradings.asp?grade=N, 1..15)
{
  "gradeParam": 1,
  "id": "10th-kup",            // kebab: "10th-kup" ... "1st-kup", "1st-dan" ... "5th-dan"
  "name": "10th Kup",
  "beltColour": "White",
  "type": "kup" | "dan",
  "rank": 10,                   // kup number or dan number
  "sourceUrl": "...",
  "practical": [ { "title": "short technique/drill name", "detail": "optional extra info" } ],
  "theory":    [ { "question": "...", "answer": "paraphrased" } ],
  "terminology": [ { "category": "number|command|stance|technique|body|other", "english": "...", "korean": "..." } ],
  "patterns": [ "Chon-Ji" ],   // pattern names required for this grade, exactly as spelled on the site
  "sparring": [ "..." ],       // sparring requirements, if any
  "otherSections": [ { "heading": "...", "items": [ "..." ] } ],  // anything else on the page
  "notes": [ "inconsistencies / typos you noticed / uncertainties" ]
}

## content-src/patterns/<slug>.json   (slug = lowercase kebab of the name, e.g. chon-ji)
{
  "id": "chon-ji",
  "name": "Chon-Ji",
  "sourceId": 940,
  "sourceUrl": "...",
  "grade": "grade as stated on the page, e.g. 9th Kup",
  "meaning": "paraphrased meaning/background, 1-3 sentences",
  "movementCount": 19,
  "startingPosition": "...",
  "endingPosition": "...",
  "diagram": "one-sentence description of the floor diagram/lines (e.g. points A-D, start on line AB facing D)",
  "movements": [ { "n": 1, "footwork": "...", "stance": "...", "technique": "...", "direction": "..." } ],
  "notes": [ ]
}
