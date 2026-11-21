/**
 * Composes a whole playbook into one self-contained HTML document — the thing a learner would
 * put in front of a board, a funder or a co-founder.
 *
 * Pure by design: answers in, a string out, with the generation date passed as an argument so
 * the tests can fix it. There is no DOM here and no network call anywhere in it, because the
 * whole point of the Playbook Builder is that nothing a learner typed leaves their browser.
 *
 * NOTHING IN THE OUTPUT MAY FETCH ANYTHING. The file is opened from `file://`, often with a
 * dead network, so there is no stylesheet link, no font file and no image: one inline `<style>`
 * carries the design and the brand is expressed in palette, rules and type weight.
 *
 * `assignmentToHtml` could not do this job. It has no empty-state branch for tables, and 21 of
 * the 45 prompts are tables, so an unanswered audit grid would render as a wall of blank boxes
 * — the loudest thing on the page. Editing it is out of the question: its bytes are the
 * clipboard's HTML flavour and are hashed on-chain as Andamio evidence. So this module walks
 * the prompts itself and reuses `paragraphs` and `tableToHtml` for the rendering, which keeps
 * one escaping path rather than growing a second renderer.
 */

import { ASSIGNMENTS } from "./assignments.generated";
import { paragraphs, escapeHtml, tableToHtml } from "./clipboard";
import { answeredCount, type Answers } from "./storage";
import { tableCellIds, type AssignmentDef, type PromptDef } from "./types";

const DOCUMENT_TITLE = "My Developer Accelerator Playbook";

/** This module's own copy, because `tableToHtml` has no empty state to borrow one from. */
const UNANSWERED = `<p class="unanswered">Not yet answered.</p>`;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * `30 September 2026`, built from the date's own parts.
 *
 * Deliberately not `toLocaleDateString`: this runs in a browser whose locale we do not choose
 * and in Node under a test, and a document that renders a different date in each is a document
 * whose date cannot be asserted. Local parts, not UTC ones, so the date matches the clock of
 * the learner who pressed the button.
 */
function formatDate(date: Date): string {
  const month = MONTHS[date.getMonth()] ?? "";
  return `${date.getDate()} ${month} ${date.getFullYear()}`;
}

function isAnswered(prompt: PromptDef, answers: Answers): boolean {
  if (prompt.kind === "text") return (answers[prompt.id] ?? "").trim() !== "";
  return !tableCellIds(prompt).every((id) => (answers[id] ?? "").trim() === "");
}

function promptToHtml(prompt: PromptDef, answers: Answers): string {
  // `prompt.hint` is suppressed throughout. It is coaching copy addressed to the learner,
  // and reads as an instruction to whoever is handed the
  // finished document.
  const heading = `<h3>${escapeHtml(prompt.label)}</h3>`;

  if (!isAnswered(prompt, answers)) return `<section class="prompt">${heading}${UNANSWERED}</section>`;

  const body =
    prompt.kind === "table"
      ? // The container scrolls, not the page: a 16-row audit with four columns is wider than
        // 390px and would otherwise push the whole document sideways on a phone.
        `<div class="grid">${tableToHtml(prompt, answers)}</div>`
      : paragraphs(answers[prompt.id] ?? "");

  return `<section class="prompt">${heading}${body}</section>`;
}

function assignmentToArtifactHtml(assignment: AssignmentDef, answers: Answers): string {
  // The module heading is this composer's, because the renderer never emitted one:
  // `assignmentToHtml` opens with `{code} - {title}`, and `code` is display-only and churns
  // with every course reshuffle. The module number and name are the stable handle, so the
  // document is organised by those — never by `code`.
  const parts = [
    `<h2>${escapeHtml(`Module ${assignment.module} - ${assignment.moduleName}`)}</h2>`,
    `<p class="lead">${escapeHtml(assignment.intro)}</p>`,
  ];

  for (const prompt of assignment.prompts) parts.push(promptToHtml(prompt, answers));

  return `<section class="module">${parts.join("")}</section>`;
}

/**
 * Completion counted in prompts, over 45.
 *
 * Not `filledCount`: that counts non-empty entries across 347 field ids, 302 of which are
 * single table cells, so it reports a number against a denominator no reader can interpret.
 */
function completion(answers: Answers): string {
  const answered = ASSIGNMENTS.reduce((total, assignment) => total + answeredCount(assignment, answers), 0);
  const total = ASSIGNMENTS.flatMap((assignment) => assignment.prompts).length;
  return `${answered} of ${total} prompts answered across ${ASSIGNMENTS.length} modules`;
}

/**
 * One inline stylesheet, and the only one.
 *
 * Structure is carried by rules and type weight, never by fills, because Chrome and Safari
 * print with background graphics off by default — a design that leans on shaded table headers
 * or a tinted cover prints as an unreadable flat page for most people who try it.
 */
const STYLES = `
:root {
  --paper: #ffffff;
  --rule: #d8dce1;
  --rule-strong: #a9b0b9;
  --text: #16191d;
  --text-2: #3b4148;
  --muted: #646b74;
  --gold: #1f5bb5;
}
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--text);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}
main { max-width: 46rem; margin: 0 auto; padding: 2.5rem 1rem 4rem; }
.cover { border-bottom: 2px solid var(--gold); padding-bottom: 1.75rem; margin-bottom: 2.5rem; }
.eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}
h1 { margin: 0; font-size: 2rem; line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
.meta { margin: 1rem 0 0; color: var(--text-2); font-weight: 500; }
.note { margin: 0.75rem 0 0; font-size: 0.875rem; color: var(--muted); }
.module { margin: 0 0 3rem; }
h2 {
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--rule-strong);
  font-size: 1.375rem;
  line-height: 1.25;
  font-weight: 600;
}
.lead { margin: 0 0 2rem; color: var(--text-2); }
.prompt { margin: 0 0 2rem; }
h3 { margin: 0 0 0.5rem; font-size: 1rem; font-weight: 700; }
p { margin: 0 0 0.75rem; overflow-wrap: break-word; }
.prompt p:last-child { margin-bottom: 0; }
.unanswered { color: var(--muted); font-style: italic; }
.grid { overflow-x: auto; border-left: 1px solid var(--rule); }
table { width: 100%; min-width: 34rem; border-collapse: collapse; font-size: 0.875rem; }
th, td {
  border: 1px solid var(--rule);
  border-left: 0;
  padding: 0.5rem 0.625rem;
  text-align: left;
  vertical-align: top;
}
thead th { border-bottom: 2px solid var(--rule-strong); font-weight: 700; }
tbody th { font-weight: 600; }
@page { size: A4 portrait; margin: 18mm 15mm; }
@media print {
  body { font-size: 10.5pt; }
  main { max-width: none; padding: 0; }
  .module { break-before: page; margin-bottom: 0; }
  .cover + .module { break-before: auto; }
  .prompt, tr, h2, h3 { break-inside: avoid; }
  h2, h3 { break-after: avoid; }
  /* So the 16-row audit grid repeats its header on every page it spills onto. */
  thead { display: table-header-group; }
  .grid { overflow: visible; border-left: 0; }
  table { min-width: 0; }
  th, td { border-left: 1px solid var(--rule); }
}
`.trim();

/**
 * The whole playbook as one document. Self-contained, printable, and safe to hand to anyone.
 */
export function playbookToArtifactHtml(answers: Answers, generatedAt: Date): string {
  const cover = [
    '<header class="cover">',
    '<p class="eyebrow">Developer Accelerator Academy &middot; Playbook Builder</p>',
    `<h1>${escapeHtml(DOCUMENT_TITLE)}</h1>`,
    `<p class="meta">Assembled ${escapeHtml(formatDate(generatedAt))} &middot; ${escapeHtml(completion(answers))}</p>`,
    // CSS cannot remove the browser's own print furniture, so the reader is told. Worth the
    // one line: a page numbered by the browser and stamped with a file:// path is the
    // difference between a document and a printout.
    '<p class="note">Composed in your browser from your own answers; nothing was sent anywhere. ',
    "To make a PDF, print this page and switch headers and footers off in your browser&rsquo;s print options.</p>",
    "</header>",
  ].join("");

  const body = ASSIGNMENTS.map((assignment) => assignmentToArtifactHtml(assignment, answers)).join("");

  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(DOCUMENT_TITLE)}</title>`,
    `<style>\n${STYLES}\n</style>`,
    "</head>",
    "<body>",
    `<main>${cover}${body}</main>`,
    "</body>",
    "</html>",
    "",
  ].join("\n");
}
