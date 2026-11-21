# Developer Accelerator Academy Playbook Builder

A browser-only worksheet for the nine module assignments of the Developer Accelerator
Academy, a course on [Andamio](https://andamio.io) funded by Project Catalyst, Fund 11,
project 1100048. Learners draft their answers here, then copy each assignment into its
evidence field on Andamio, which stays the record.

- **Nothing leaves the browser.** There is no account, no server-side storage and no network
  request. Drafts autosave to `localStorage`, and the Content-Security-Policy keeps
  `connect-src` to `'self'`.
- **Copy for Andamio** puts each assignment on the clipboard as HTML and as plain text, so
  headings and tables survive the paste. Learner text is HTML-escaped first, because Andamio
  hashes what it receives.
- **Exports:** a Markdown copy for reading, a self-contained HTML document (no external
  fetches, prints to A4 as a PDF) and a JSON backup that restores in another browser.
- **Deep links:** `/playbook#module-400` opens that module alone.

## The assignment text is placeholder

The real briefs are the intellectual property of Edify Systems Limited and are not in this
repository (see `NOTICE`). `lib/playbook/assignments.generated.ts` keeps their structure
(module numbers and titles, assignment codes, prompt kinds, and every prompt, row and column
id) with placeholder text in place of the titles, introductions, labels and hints.

Generate your own from YAML briefs with
[deva-course](https://github.com/jadjei/deva-course), whose `gen-playbook-config.py` writes
this same file:

```bash
python3 gen-playbook-config.py --out /path/to/playbook-builder/lib/playbook/assignments.generated.ts
```

The brief format is `plan/ASSIGNMENT-SCHEMA.md` in that repository. Field ids are
`localStorage` keys: rename one and every learner's saved answer under it is orphaned. Adjust
`tests/unit/playbook.test.ts` for your course: it assumes this one's shape (modules 000 to 800, 45
prompts, a first prompt id of `000-venture-snapshot`).

## Run it

Node.js 20 or later.

```bash
npm ci
npm run dev        # http://localhost:3000/playbook
```

Checks:

```bash
npm run typecheck
npm run lint
npm test           # vitest: storage, restore, escaping, anchors, the HTML document
npm run build
npm start          # serves the production build
```

## Layout

| Path | What |
|---|---|
| `app/playbook/page.tsx` | the page |
| `components/playbook/` | the builder, one panel per assignment, and its styles |
| `lib/playbook/types.ts` | prompt definitions, field ids and anchors |
| `lib/playbook/storage.ts` | autosave, Markdown export, backup and restore |
| `lib/playbook/clipboard.ts` | the two clipboard flavours |
| `lib/playbook/artifact.ts` | the self-contained HTML document |
| `lib/playbook/assignments.generated.ts` | the assignments (placeholder here) |
| `components/Chrome.tsx`, `app/globals.css` | plain page furniture and colour tokens |

## Licence

Apache License 2.0 (`LICENSE`). `NOTICE` sets out what is not licensed here, including the
Developer Accelerator Academy, Fluid7 and Edify names.
