/**
 * localStorage persistence and export for the Playbook Builder.
 *
 * Everything here runs in the browser and nothing leaves it. There is no network call in this
 * module, and none anywhere else on the page, by design: Andamio stays the system of record
 * because its assignment evidence is hashed on-chain, and this site never becomes a
 * submission channel or a store of anybody's business plan.
 */

import { ASSIGNMENTS } from "./assignments.generated";
import { cellId, isKnownFieldId, tableCellIds, type AssignmentDef, type TablePromptDef } from "./types";

export const STORAGE_KEY = "deva-playbook-v1";
export const SCHEMA_VERSION = 1;

/** Answers are a flat map of field id to text. No nesting, no per-type shapes. */
export type Answers = Readonly<Record<string, string>>;

interface Envelope {
  readonly version: typeof SCHEMA_VERSION;
  readonly updatedAt: string;
  readonly answers: Answers;
}

export type LoadResult =
  | { readonly kind: "empty" }
  | {
      readonly kind: "ok";
      readonly answers: Answers;
      readonly updatedAt: string;
      readonly droppedIds: readonly string[];
    }
  | { readonly kind: "future-version"; readonly version: number; readonly raw: string }
  | { readonly kind: "corrupt"; readonly raw: string; readonly reason: string }
  | { readonly kind: "unavailable"; readonly reason: "blocked" };

export type SaveResult =
  | { readonly kind: "saved"; readonly updatedAt: string }
  | { readonly kind: "quota-exceeded" }
  | { readonly kind: "unavailable" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Safari in private mode, and any browser with site data blocked, throws on access rather
 * than returning null. Probe once per call rather than caching, since permission can change
 * within a session.
 */
function getStore(): Storage | null {
  try {
    const store = window.localStorage;
    const probe = "__deva_playbook_probe__";
    store.setItem(probe, "1");
    store.removeItem(probe);
    return store;
  } catch {
    return null;
  }
}

export function load(): LoadResult {
  const store = getStore();
  if (!store) return { kind: "unavailable", reason: "blocked" };

  let text: string | null;
  try {
    text = store.getItem(STORAGE_KEY);
  } catch {
    return { kind: "unavailable", reason: "blocked" };
  }
  if (text === null || text === "") return { kind: "empty" };

  let raw: unknown;
  try {
    // JSON.parse returns `any`; annotating keeps the checks below meaningful.
    raw = JSON.parse(text) as unknown;
  } catch {
    return { kind: "corrupt", raw: text, reason: "not valid JSON" };
  }

  if (!isRecord(raw)) return { kind: "corrupt", raw: text, reason: "not an object" };

  // Match the known version exactly. Anything else is someone else's format — keep their data
  // rather than guessing at a migration that has never been written.
  if (raw.version !== SCHEMA_VERSION) {
    const version = typeof raw.version === "number" ? raw.version : Number.NaN;
    return { kind: "future-version", version, raw: text };
  }

  if (!isRecord(raw.answers)) return { kind: "corrupt", raw: text, reason: "missing answers" };

  const { answers, droppedIds } = rebuildAnswers(raw.answers);
  const updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : "";
  return { kind: "ok", answers, updatedAt, droppedIds };
}

/**
 * Rebuild an answers map from untrusted input rather than casting it.
 *
 * Only known field ids with string values survive, so nothing a file supplies can reach state
 * under a key no prompt renders — including `__proto__`, which fails `isKnownFieldId` like any
 * other unrecognised key. Shared by `load` and `parseBackup` so the two cannot drift.
 *
 * Exported for the unit tests, which assert exactly that property.
 */
export function rebuildAnswers(source: Record<string, unknown>): {
  answers: Answers;
  droppedIds: readonly string[];
} {
  const answers: Record<string, string> = Object.create(null) as Record<string, string>;
  const droppedIds: string[] = [];

  for (const [id, value] of Object.entries(source)) {
    if (!isKnownFieldId(id) || typeof value !== "string") {
      droppedIds.push(id);
      continue;
    }
    answers[id] = value;
  }

  return { answers: { ...answers }, droppedIds };
}

export function save(answers: Answers): SaveResult {
  const store = getStore();
  if (!store) return { kind: "unavailable" };

  const updatedAt = new Date().toISOString();
  const envelope: Envelope = { version: SCHEMA_VERSION, updatedAt, answers };

  try {
    store.setItem(STORAGE_KEY, JSON.stringify(envelope));
    return { kind: "saved", updatedAt };
  } catch (error) {
    // QuotaExceededError is the one worth naming — the learner needs to know their work is
    // no longer being kept, not discover it after a reload. Firefox reports the same
    // condition under its own legacy name.
    const isQuota =
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED");
    return isQuota ? { kind: "quota-exceeded" } : { kind: "unavailable" };
  }
}

export function clear(): void {
  const store = getStore();
  if (!store) return;
  try {
    store.removeItem(STORAGE_KEY);
  } catch {
    // Nothing useful to do; the caller has already cleared its own state.
  }
}

/**
 * Trailing-edge debounce for autosave. Returns a `flush` so the caller can force a write on
 * unmount or tab hide rather than losing the last keystrokes.
 */
export function createDebouncedSaver(onResult: (result: SaveResult) => void, delayMs = 600) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: Answers | undefined;

  const write = () => {
    if (pending === undefined) return;
    const toWrite = pending;
    pending = undefined;
    onResult(save(toWrite));
  };

  return {
    schedule(answers: Answers) {
      pending = answers;
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(write, delayMs);
    },
    flush() {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      write();
    },
    cancel() {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      pending = undefined;
    },
  };
}

export function hasAnyAnswer(answers: Answers): boolean {
  return Object.values(answers).some((value) => value.trim() !== "");
}

export function filledCount(answers: Answers): number {
  return Object.values(answers).filter((value) => value.trim() !== "").length;
}

/** How many of an assignment's prompts have anything in them. Drives the `3/5` on each panel. */
export function answeredCount(assignment: AssignmentDef, answers: Answers): number {
  return assignment.prompts.filter((prompt) => {
    if (prompt.kind === "text") return (answers[prompt.id] ?? "").trim() !== "";
    return tableCellIds(prompt).some((id) => (answers[id] ?? "").trim() !== "");
  }).length;
}

function tableToMarkdown(prompt: TablePromptDef, answers: Answers): string {
  const header = `| ${prompt.label} | ${prompt.columns.map((c) => c.label).join(" | ")} |`;
  const divider = `|${"---|".repeat(prompt.columns.length + 1)}`;
  const rows = prompt.rows.map((row) => {
    const cells = prompt.columns.map((column) => {
      const value = answers[cellId(prompt, row.key, column.key)] ?? "";
      // A newline inside a cell would break the table; markdown has no escape for it.
      return value.replace(/\s*\n\s*/g, " ").replace(/\|/g, "\\|").trim();
    });
    return `| ${row.label} | ${cells.join(" | ")} |`;
  });
  return [header, divider, ...rows].join("\n");
}

/** One assignment as markdown — the unit the learner pastes into Andamio. */
export function assignmentToMarkdown(assignment: AssignmentDef, answers: Answers): string {
  const parts: string[] = [`## ${assignment.code} - ${assignment.title}`, ""];

  for (const prompt of assignment.prompts) {
    parts.push(`### ${prompt.label}`, "");
    if (prompt.kind === "table") {
      parts.push(tableToMarkdown(prompt, answers), "");
    } else {
      const value = (answers[prompt.id] ?? "").trim();
      parts.push(value === "" ? "_Not yet answered._" : value, "");
    }
  }

  return parts.join("\n").trimEnd() + "\n";
}

/** The whole playbook as prose. Readable, not re-importable — that is what the backup is for. */
export function playbookToMarkdown(answers: Answers): string {
  const parts: string[] = [
    "# My Developer Accelerator Playbook",
    "",
    "Assembled with the Playbook Builder. This copy is for you to read and keep; it is",
    "not a backup and cannot be restored from. To submit a section, open the builder, use",
    "Copy for Andamio on that module and paste it into the assignment's evidence field.",
    "",
  ];
  for (const assignment of ASSIGNMENTS) {
    parts.push(`# Module ${assignment.module} - ${assignment.moduleName}`, "");
    parts.push(assignmentToMarkdown(assignment, answers), "");
  }
  return parts.join("\n").trimEnd() + "\n";
}

/** Canonical state, for restore. Kept separate from the prose so neither misleads. */
export function playbookToBackupJson(answers: Answers): string {
  const envelope: Envelope = {
    version: SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    answers,
  };
  return JSON.stringify(envelope, null, 2);
}

/**
 * A whole playbook is a few hundred fields of prose; a megabyte is far more than any real one
 * and far less than anything that would stall `JSON.parse` or overflow the storage quota on
 * write. Checked before reading the file, not after.
 */
export const MAX_IMPORT_BYTES = 1_048_576;

export type ImportResult =
  | {
      readonly kind: "ok";
      readonly answers: Answers;
      readonly importedCount: number;
      readonly droppedIds: readonly string[];
    }
  | { readonly kind: "too-large"; readonly bytes: number }
  | { readonly kind: "not-json" }
  | { readonly kind: "wrong-shape"; readonly reason: string }
  | { readonly kind: "future-version"; readonly version: number }
  | { readonly kind: "no-answers" };

/**
 * Parse a downloaded backup. Reads the `.json` only — the `.md` export is prose for the human
 * and deliberately does not round-trip, because the learner is free to edit it.
 *
 * Returns a result rather than throwing, and never returns a partial map: the caller either
 * gets a complete set of answers to apply or a reason it cannot. `droppedIds` is carried so the
 * UI can say what was left behind instead of discarding it silently.
 */
export function parseBackup(text: string): ImportResult {
  if (text.length > MAX_IMPORT_BYTES) return { kind: "too-large", bytes: text.length };

  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    return { kind: "not-json" };
  }

  if (!isRecord(raw)) return { kind: "wrong-shape", reason: "the file is not a playbook backup" };

  if (raw.version !== SCHEMA_VERSION) {
    const version = typeof raw.version === "number" ? raw.version : Number.NaN;
    return Number.isNaN(version)
      ? { kind: "wrong-shape", reason: "the file has no version and may not be a playbook backup" }
      : { kind: "future-version", version };
  }

  if (!isRecord(raw.answers)) return { kind: "wrong-shape", reason: "the file has no answers in it" };

  const { answers, droppedIds } = rebuildAnswers(raw.answers);
  const importedCount = filledCount(answers);
  if (importedCount === 0) return { kind: "no-answers" };

  return { kind: "ok", answers, importedCount, droppedIds };
}
