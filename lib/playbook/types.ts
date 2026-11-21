/**
 * Shape of the Playbook Builder's prompt definitions, plus the pure helpers derived from them.
 *
 * `assignments.generated.ts` is GENERATED from the course repo and imports `AssignmentDef`
 * from here as a type only, so there is no runtime cycle. These interfaces have to match the
 * generator's output exactly: if they drift, the generated file stops compiling, which is the
 * intended failure mode.
 *
 * FIELD IDS ARE OPAQUE AND PERMANENT. They are localStorage keys. Assignment codes churn with
 * every course reshuffle (`100.4a`, `207.a`, `502.a` are all current codes and none of them are
 * stable); ids must not. Never derive an id from a code, and never rename one.
 */

import { ASSIGNMENTS, FIELD_IDS } from "./assignments.generated";

export interface TextPromptDef {
  readonly kind: "text";
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  /** Rough size of the expected answer; drives textarea height only. */
  readonly size: "short" | "long";
}

export interface TableAxisDef {
  readonly key: string;
  readonly label: string;
}

export interface TablePromptDef {
  readonly kind: "table";
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly rows: readonly TableAxisDef[];
  readonly columns: readonly TableAxisDef[];
}

export type PromptDef = TextPromptDef | TablePromptDef;

export interface AssignmentDef {
  /** Module directory prefix: '000' … '800'. The one stable handle the course has. */
  readonly module: string;
  readonly moduleName: string;
  /** Assignment code. Display only — this changes when the course is reorganised. */
  readonly code: string;
  readonly title: string;
  readonly intro: string;
  readonly prompts: readonly PromptDef[];
}

/** The field id of one table cell. The single place this string is built. */
export function cellId(table: TablePromptDef, rowKey: string, columnKey: string): string {
  return `${table.id}.${rowKey}.${columnKey}`;
}

/** Every field id a table prompt owns, row-major. */
export function tableCellIds(table: TablePromptDef): string[] {
  return table.rows.flatMap((row) => table.columns.map((column) => cellId(table, row.key, column.key)));
}

/**
 * Whether a string is a field id this build renders.
 *
 * `FIELD_IDS` comes from the generator, so it cannot drift from the prompts. Everything
 * restored from storage or from a backup file is checked against it before it reaches state.
 */
export function isKnownFieldId(value: string): boolean {
  return FIELD_IDS.has(value);
}

/**
 * Anchor for deep links: `/playbook#module-400`.
 *
 * Keyed on the module, deliberately. A link printed in an Andamio brief has to keep working
 * across a course reorganisation, and module numbers survive those where codes do not.
 * Never build one of these from `code`.
 */
export function moduleAnchor(module: string): string {
  return `module-${module}`;
}

/**
 * Resolve a URL fragment to an assignment. Accepts the canonical `module-400`, a bare `400`
 * because people will type it, and an assignment code as a last resort so an older link does
 * not simply fail. Returns undefined for anything unrecognised — a bad fragment is ignored
 * rather than treated as an error worth showing a learner.
 */
export function assignmentForAnchor(fragment: string): AssignmentDef | undefined {
  const stripped = fragment.replace(/^#/, "");

  let decoded: string;
  try {
    decoded = decodeURIComponent(stripped);
  } catch {
    // A malformed escape (`#%E0%A4%A`) throws rather than returning anything. Fall back to the
    // raw text; it will simply not match, which is the right outcome.
    decoded = stripped;
  }

  const cleaned = decoded.trim().toLowerCase();
  if (cleaned === "") return undefined;

  const moduleId = cleaned.startsWith("module-") ? cleaned.slice("module-".length) : cleaned;
  return (
    ASSIGNMENTS.find((assignment) => assignment.module === moduleId) ??
    ASSIGNMENTS.find((assignment) => assignment.code.toLowerCase() === cleaned)
  );
}

export function findAssignment(code: string): AssignmentDef | undefined {
  return ASSIGNMENTS.find((assignment) => assignment.code === code);
}
