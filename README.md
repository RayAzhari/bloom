# Bloom

A calm study companion: tasks, a focus timer, and study spaces for Math MA and LS 1A.
Runs entirely in the browser. There's no backend or account; everything is saved in `localStorage`.

## Run locally

```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # production build → dist/
npm run preview          # serve the production build
npm run verify:content   # checks answer keys + content structure
```

## Deploy (Vercel)

It's a static Vite app. `vercel.json` is included, and hash routing means no rewrites are needed.
- Dashboard: push to GitHub → vercel.com → Add New Project → import the repo → Deploy (Vite is auto-detected).
- CLI: `npm i -g vercel && vercel` (preview) then `vercel --prod`.

## Where things live

```
src/content/            ← all study material (edit here, not in components)
  math/functions.js, rates.js, limits.js, applications.js   one file per unit
  math/index.js         unit order
  math/lessons.js       "Help me understand" lessons
  ls1a/concepts.js      LS 1A categories (summary, vocab, connections)
  ls1a/cards.js         flashcards
  ls1a/practice.js      reasoning questions
  ls1a/lessons.js       LS 1A lessons
  resources.js          external links (kept separate from original content)
  messages.js           encouragement messages
  buddy.js              Petal the study buddy: tips per page + cheer-up lines
src/state/              tasks/review/flashcards store + timer (timestamp-based)
src/components/, src/pages/
scripts/verify-content.mjs   recomputes every numeric answer independently
```

Content markup: `` `x^{2}` `` renders as math, `**bold**`, `*italic*`, and a string `"$$ … $$"` renders as a display line.
After you add a numeric question, register its independent recomputation in `scripts/verify-content.mjs`.
