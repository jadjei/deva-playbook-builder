/**
 * Composes the two clipboard flavours the Andamio evidence field needs.
 *
 * Andamio stores assignment evidence as a Tiptap document, and that document is hashed for
 * on-chain verification. Plain text pastes as plain text — headings stay literal and tables
 * stop being tables — so structure has to travel as `text/html`.
 *
 * That makes escaping a correctness requirement, not a nicety: React's text-node safety
 * protects this page and does nothing for the paste target, whose contents end up in the
 * hash. Everything the learner typed goes through `escapeHtml` before it reaches the HTML
 * flavour.
 */

import { assignmentToMarkdown, type Answers } from "./storage";
import { cellId, type AssignmentDef, type TablePromptDef } from "./types";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Exported for the artifact composer in `artifact.ts`, which walks prompts itself so it can
 * add module headings and an unanswered marker for tables. It reuses these two so there is
 * exactly one escaping path in the codebase; `assignmentToHtml` still calls them and its
 * output bytes are unchanged, which matters because those bytes are hashed on-chain.
 */
export function paragraphs(value: string): string {
  const trimmed = value.trim();
  if (trimmed === "") return "<p><em>Not yet answered.</em></p>";
  return trimmed
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function tableToHtml(prompt: TablePromptDef, answers: Answers): string {
  const head = `<tr><th>${escapeHtml(prompt.label)}</th>${prompt.columns
    .map((column) => `<th>${escapeHtml(column.label)}</th>`)
    .join("")}</tr>`;

  const body = prompt.rows
    .map((row) => {
      const cells = prompt.columns
        .map((column) => {
          const value = answers[cellId(prompt, row.key, column.key)] ?? "";
          return `<td>${escapeHtml(value.trim()).replace(/\n/g, "<br>")}</td>`;
        })
        .join("");
      return `<tr><th scope="row">${escapeHtml(row.label)}</th>${cells}</tr>`;
    })
    .join("");

  return `<table><thead>${head}</thead><tbody>${body}</tbody></table>`;
}

export function assignmentToHtml(assignment: AssignmentDef, answers: Answers): string {
  const parts: string[] = [`<h2>${escapeHtml(`${assignment.code} - ${assignment.title}`)}</h2>`];

  for (const prompt of assignment.prompts) {
    parts.push(`<h3>${escapeHtml(prompt.label)}</h3>`);
    parts.push(prompt.kind === "table" ? tableToHtml(prompt, answers) : paragraphs(answers[prompt.id] ?? ""));
  }

  return parts.join("");
}

export type CopyOutcome = "copied" | "fallback";

/**
 * Writes both flavours. Falls back to `text/plain` alone, then to reporting failure so the
 * caller can show a pre-selected textarea — `navigator.clipboard` needs a secure context and
 * can be denied outright.
 */
export async function copyAssignment(assignment: AssignmentDef, answers: Answers): Promise<CopyOutcome> {
  const plain = assignmentToMarkdown(assignment, answers);
  const html = assignmentToHtml(assignment, answers);

  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
      return "copied";
    } catch {
      // Fall through to the plain-text path below.
    }
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(plain);
      return "copied";
    } catch {
      // Fall through.
    }
  }

  return "fallback";
}
