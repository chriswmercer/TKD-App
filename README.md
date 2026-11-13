# TKD Assistant

An unofficial Tae Kwon-Do study aid for the TAGB syllabus (iOS + Android, phone + tablet), built with Expo / React Native.

- **Belts** – every grading from 10th Kup to 5th Dan: patterns, practical, sparring, theory and Korean terms.
- **Patterns** – each pattern with its move-by-move breakdown (all at once, or one move at a time).
- **Glossary** – searchable Korean terminology.
- **Quiz** – per-belt quizzes (optionally including earlier belts), graded at the end. Results are kept on-device.
- **Info** – tenets, oath, conduct, rules.

## Develop

Requires Node >= 22.13.

```bash
npm install
npm run content      # rebuild src/data/content.json from content-src/*
npx expo start       # press i / a, or scan with Expo Go
npm run typecheck
npx expo lint
```

## Content

`content-src/` holds the raw collected syllabus data (see `content-src/SCHEMA.md`); `npm run content` normalises it into `src/data/content.json`, which the app bundles. Wording of explanatory text is paraphrased, not copied. **Verify the data against the official syllabus before publishing.**

## Release (App Store / Google Play)

```bash
npm i -g eas-cli && eas login
eas build:configure
eas build --platform all --profile production
eas submit --platform ios    # needs Apple Developer account
eas submit --platform android # needs Google Play Console account
```

Before submitting: set your own bundle id / package in `app.json`, replace the placeholder icon, add a support email to `PRIVACY.md` and host it at a public URL, and complete the store listings (screenshots for phone and tablet, descriptions, age rating, data-safety form: "no data collected").
