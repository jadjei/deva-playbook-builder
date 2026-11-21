import { describe, expect, it } from "vitest";
import { ASSIGNMENTS, FIELD_IDS } from "@/lib/playbook/assignments.generated";
import { assignmentForAnchor, cellId, isKnownFieldId, moduleAnchor, tableCellIds } from "@/lib/playbook/types";
import { assignmentToMarkdown, parseBackup, rebuildAnswers, SCHEMA_VERSION } from "@/lib/playbook/storage";
import { assignmentToHtml, escapeHtml } from "@/lib/playbook/clipboard";
import { playbookToArtifactHtml } from "@/lib/playbook/artifact";

const firstAssignment = ASSIGNMENTS[0];
if (!firstAssignment) throw new Error("no assignments generated");

const aTextId = "000-venture-snapshot";

describe("generated prompt definitions", () => {
  it("has one assignment per module, 000 to 800", () => {
    expect(ASSIGNMENTS.map((a) => a.module)).toEqual(["000", "100", "200", "300", "400", "500", "600", "700", "800"]);
  });

  it("registers every table cell id the UI will write to", () => {
    for (const assignment of ASSIGNMENTS) {
      for (const prompt of assignment.prompts) {
        const ids = prompt.kind === "table" ? tableCellIds(prompt) : [prompt.id];
        for (const id of ids) expect(isKnownFieldId(id), id).toBe(true);
      }
    }
  });

  it("builds a table cell id as table.row.column", () => {
    const table = ASSIGNMENTS.flatMap((a) => a.prompts).find((p) => p.kind === "table");
    if (!table || table.kind !== "table") throw new Error("expected at least one table prompt");
    const row = table.rows[0];
    const column = table.columns[0];
    if (!row || !column) throw new Error("expected a table with rows and columns");
    expect(cellId(table, row.key, column.key)).toBe(`${table.id}.${row.key}.${column.key}`);
  });

  it("never reuses a field id across prompts", () => {
    // Duplicates are invisible to the type system but would make two prompts share storage.
    const ids = ASSIGNMENTS.flatMap((a) =>
      a.prompts.flatMap((p) => (p.kind === "table" ? tableCellIds(p) : [p.id])),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("rebuildAnswers", () => {
  it("keeps known field ids with string values", () => {
    const { answers, droppedIds } = rebuildAnswers({ [aTextId]: "a draft" });
    expect(answers[aTextId]).toBe("a draft");
    expect(droppedIds).toEqual([]);
  });

  it("drops unknown keys rather than casting them into state", () => {
    const { answers, droppedIds } = rebuildAnswers({ "not-a-real-field": "x", [aTextId]: "keep" });
    expect(answers).toEqual({ [aTextId]: "keep" });
    expect(droppedIds).toEqual(["not-a-real-field"]);
  });

  it("drops __proto__ like any other unrecognised key, and does not pollute the prototype", () => {
    // Parsed from JSON so that __proto__ arrives as a genuine own property.
    const source = JSON.parse('{"__proto__": {"polluted": true}, "constructor": "x"}') as Record<string, unknown>;
    const { answers, droppedIds } = rebuildAnswers(source);

    expect(answers).toEqual({});
    expect(droppedIds).toContain("__proto__");
    expect(droppedIds).toContain("constructor");
    expect(Object.prototype.hasOwnProperty.call(answers, "__proto__")).toBe(false);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(isKnownFieldId("__proto__")).toBe(false);
  });

  it("drops non-string values under otherwise valid ids", () => {
    const { answers, droppedIds } = rebuildAnswers({ [aTextId]: 42, "000-what-you-want": null });
    expect(answers).toEqual({});
    expect(droppedIds).toHaveLength(2);
  });
});

describe("parseBackup", () => {
  const backup = (answers: Record<string, unknown>, version: unknown = SCHEMA_VERSION) =>
    JSON.stringify({ version, updatedAt: "2026-09-24T00:00:00.000Z", answers });

  it("accepts a backup this version wrote", () => {
    const result = parseBackup(backup({ [aTextId]: "restored" }));
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") return;
    expect(result.answers[aTextId]).toBe("restored");
    expect(result.importedCount).toBe(1);
  });

  it("reports unknown ids instead of silently discarding them", () => {
    const result = parseBackup(backup({ [aTextId]: "restored", "old-renamed-field": "orphan" }));
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") return;
    expect(result.droppedIds).toEqual(["old-renamed-field"]);
  });

  it("refuses a file larger than the 1MB cap without parsing it", () => {
    const result = parseBackup("x".repeat(1_048_577));
    expect(result).toEqual({ kind: "too-large", bytes: 1_048_577 });
  });

  it("refuses a newer schema rather than guessing at a migration", () => {
    expect(parseBackup(backup({ [aTextId]: "x" }, 2))).toEqual({ kind: "future-version", version: 2 });
  });

  it("names the problem for a file that is not a backup at all", () => {
    expect(parseBackup("# My playbook\n\nSome prose.").kind).toBe("not-json");
    expect(parseBackup("[]").kind).toBe("wrong-shape");
    expect(parseBackup('{"answers":{}}').kind).toBe("wrong-shape");
    expect(parseBackup(backup({ [aTextId]: "x" }, "1")).kind).toBe("wrong-shape");
  });

  it("rejects an envelope whose answers are not an object", () => {
    expect(parseBackup(backup([] as unknown as Record<string, unknown>)).kind).toBe("wrong-shape");
  });

  it("refuses a valid but empty backup, so a restore cannot quietly wipe everything", () => {
    expect(parseBackup(backup({ [aTextId]: "   " })).kind).toBe("no-answers");
  });
});

describe("anchor parsing", () => {
  it("builds the canonical anchor from the module, never from the code", () => {
    expect(moduleAnchor("400")).toBe("module-400");
  });

  it("resolves the canonical form, with or without the hash", () => {
    expect(assignmentForAnchor("#module-400")?.module).toBe("400");
    expect(assignmentForAnchor("module-400")?.module).toBe("400");
  });

  it("resolves a bare module number, because people type it", () => {
    expect(assignmentForAnchor("#400")?.module).toBe("400");
    expect(assignmentForAnchor("#000")?.module).toBe("000");
    expect(assignmentForAnchor("#800")?.module).toBe("800");
  });

  it("resolves an assignment code as a last resort, so older links still work", () => {
    expect(assignmentForAnchor(`#${firstAssignment.code}`)?.code).toBe(firstAssignment.code);
    expect(assignmentForAnchor("#100.4A")?.module).toBe("100");
  });

  it("decodes percent-encoding and tolerates whitespace and case", () => {
    expect(assignmentForAnchor("#MODULE-400")?.module).toBe("400");
    expect(assignmentForAnchor("#%6Dodule-400")?.module).toBe("400");
    expect(assignmentForAnchor("#  module-400  ")?.module).toBe("400");
  });

  it("ignores anything it does not recognise rather than erroring", () => {
    expect(assignmentForAnchor("")).toBeUndefined();
    expect(assignmentForAnchor("#")).toBeUndefined();
    expect(assignmentForAnchor("#module-999")).toBeUndefined();
    expect(assignmentForAnchor("#contact")).toBeUndefined();
    // A malformed escape sequence makes decodeURIComponent throw; it must not reach the caller.
    expect(assignmentForAnchor("#%E0%A4%A")).toBeUndefined();
  });
});

describe("html escaping for the Andamio paste", () => {
  it("escapes every character that could change the pasted document", () => {
    expect(escapeHtml(`<script>alert("x" & 'y')</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot; &amp; &#39;y&#39;)&lt;/script&gt;",
    );
  });

  it("escapes the ampersand first, so an escape is never double-encoded", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  it("escapes learner text in the HTML flavour, which React's safety does not cover", () => {
    // The paste target hashes what it receives, so an unescaped angle bracket is a correctness
    // bug, not a rendering one.
    const html = assignmentToHtml(firstAssignment, { [aTextId]: '<img src=x onerror="alert(1)">' });
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  });

  it("escapes table cells and the row and column labels too", () => {
    const table = ASSIGNMENTS.flatMap((a) => a.prompts).find((p) => p.kind === "table");
    const assignment = ASSIGNMENTS.find((a) => a.prompts.some((p) => p.kind === "table"));
    if (!table || table.kind !== "table" || !assignment) throw new Error("expected a table prompt");
    const row = table.rows[0];
    const column = table.columns[0];
    if (!row || !column) throw new Error("expected a table with rows and columns");

    const html = assignmentToHtml(assignment, { [cellId(table, row.key, column.key)]: "a < b & c" });
    expect(html).toContain("<td>a &lt; b &amp; c</td>");
  });

  it("turns a blank line into a paragraph break and a single newline into a break", () => {
    const html = assignmentToHtml(firstAssignment, { [aTextId]: "one\ntwo\n\nthree" });
    expect(html).toContain("<p>one<br>two</p><p>three</p>");
  });

  it("says so explicitly when a prompt is unanswered", () => {
    expect(assignmentToHtml(firstAssignment, {})).toContain("<p><em>Not yet answered.</em></p>");
  });
});

describe("markdown for the plain-text flavour", () => {
  it("flattens newlines and escapes pipes inside table cells", () => {
    const table = ASSIGNMENTS.flatMap((a) => a.prompts).find((p) => p.kind === "table");
    const assignment = ASSIGNMENTS.find((a) => a.prompts.some((p) => p.kind === "table"));
    if (!table || table.kind !== "table" || !assignment) throw new Error("expected a table prompt");
    const row = table.rows[0];
    const column = table.columns[0];
    if (!row || !column) throw new Error("expected a table with rows and columns");

    const md = assignmentToMarkdown(assignment, { [cellId(table, row.key, column.key)]: "a\nb | c" });

    // The whole row has to land on one line: a literal newline in a cell would break the
    // table, and markdown has no escape for one. The pipe does have an escape, so it gets it.
    const line = md.split("\n").find((candidate) => candidate.startsWith(`| ${row.label} |`));
    expect(line).toBeDefined();
    expect(line).toContain("a b \\| c");
  });
});

describe("the field id set the builder validates against", () => {
  it("is not empty, so a generation failure cannot silently drop every restored answer", () => {
    expect(FIELD_IDS.size).toBeGreaterThan(300);
  });
});

describe("the playbook artifact", () => {
  // Fixed so the cover date is asserted rather than whatever today happens to be. Built from
  // local components, because the composer formats from local ones - an ISO instant would
  // render as the day before or after in some timezones and make this suite machine-dependent.
  const generatedAt = new Date(2026, 8, 30, 12, 0, 0);

  const firstTable = ASSIGNMENTS.flatMap((a) => a.prompts).find((p) => p.kind === "table");
  if (!firstTable || firstTable.kind !== "table") throw new Error("expected at least one table prompt");
  const firstRow = firstTable.rows[0];
  const firstColumn = firstTable.columns[0];
  if (!firstRow || !firstColumn) throw new Error("expected a table with rows and columns");
  const aCellId = cellId(firstTable, firstRow.key, firstColumn.key);

  const PROMPT_TOTAL = ASSIGNMENTS.flatMap((a) => a.prompts).length;

  /**
   * Every element tag in the document, attributes included.
   *
   * Sound as a structural probe precisely because `escapeHtml` turns every `<` a learner typed
   * into `&lt;`: anything matching here was emitted by the composer, never by prose. A plain
   * substring scan for `src=` would instead trip over the escaped `&lt;img src=x ...&gt;` the
   * escaping tests above feed in, and a scan for `href="http` could never match at all, because
   * the quote is escaped before the scan sees it.
   */
  function elementTags(html: string): string[] {
    return html.match(/<[a-zA-Z!/][^>]*>/g) ?? [];
  }

  function styleBlocks(html: string): string[] {
    return [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((match) => match[1] ?? "");
  }

  /** The markup between one prompt's `<h3>` and the next heading of any level. */
  function sectionFor(html: string, label: string): string {
    const heading = `<h3>${escapeHtml(label)}</h3>`;
    const start = html.indexOf(heading);
    expect(start, `no section for ${label}`).toBeGreaterThanOrEqual(0);
    const rest = html.slice(start + heading.length);
    const next = rest.search(/<h[1-6][ >]/);
    return next === -1 ? rest : rest.slice(0, next);
  }

  it("escapes every character a learner typed", () => {
    const html = playbookToArtifactHtml({ [aTextId]: `<script>alert("x" & 'y')</script>` }, generatedAt);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("</script>");
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot; &amp; &#39;y&#39;)&lt;/script&gt;");
  });

  it("heads each module with its number and name, in 000-to-800 order", () => {
    const html = playbookToArtifactHtml({}, generatedAt);
    const headings = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((match) => match[1]);

    // Keyed on module and name, never on `code`: codes are display-only and churn with every
    // course reshuffle, so a document organised by them would reorganise itself.
    expect(headings).toEqual(ASSIGNMENTS.map((a) => escapeHtml(`Module ${a.module} - ${a.moduleName}`)));
    expect(headings.join(" ")).not.toContain(firstAssignment.code);
  });

  const firstTextPrompt = firstAssignment.prompts[0];
  if (!firstTextPrompt || firstTextPrompt.kind !== "text") throw new Error("expected a text prompt first");

  it("suppresses the hint, which is coaching copy addressed to the learner", () => {
    const html = playbookToArtifactHtml({ [aTextId]: "answered" }, generatedAt);
    expect(html).not.toContain(escapeHtml(firstTextPrompt.hint));
  });

  it("marks an unanswered text prompt rather than leaving a gap", () => {
    const html = playbookToArtifactHtml({ [aCellId]: "something elsewhere" }, generatedAt);
    expect(sectionFor(html, firstTextPrompt.label)).toContain("Not yet answered.");
  });

  it("marks a wholly unanswered table instead of printing an empty grid", () => {
    const html = playbookToArtifactHtml({ [aTextId]: "something elsewhere" }, generatedAt);
    const section = sectionFor(html, firstTable.label);
    expect(section).toContain("Not yet answered.");
    expect(section).not.toContain("<table");
  });

  it("renders a partly filled table as a grid, keeping an empty cell empty", () => {
    const html = playbookToArtifactHtml({ [aCellId]: "observed" }, generatedAt);
    const section = sectionFor(html, firstTable.label);
    expect(section).toContain("<table>");
    expect(section).toContain("<td>observed</td>");
    expect(section).toContain("<td></td>");
    expect(section).not.toContain("Not yet answered.");
  });

  it("counts completion in prompts, not in fields", () => {
    // One text answer plus two cells of the SAME table is two answered prompts. Three filled
    // fields, so `filledCount` would report three - and the two cells deliberately sit in one
    // table, because a fixture of one answer plus one cell reads as 2 either way and would let
    // a field count through.
    const secondColumn = firstTable.columns[1] ?? firstColumn;
    const secondRow = firstTable.rows[1] ?? firstRow;
    const anotherCellId = cellId(firstTable, secondRow.key, secondColumn.key);
    expect(anotherCellId).not.toBe(aCellId);

    const html = playbookToArtifactHtml({ [aTextId]: "a", [aCellId]: "b", [anotherCellId]: "c" }, generatedAt);
    expect(PROMPT_TOTAL).toBe(45);
    expect(html).toContain("2 of 45 prompts answered across 9 modules");
  });

  it("carries the generation date in a form no locale data can change", () => {
    expect(playbookToArtifactHtml({}, generatedAt)).toContain("30 September 2026");
  });

  it("has exactly one h1 and declares its language", () => {
    const html = playbookToArtifactHtml({ [aTextId]: "a" }, generatedAt);
    expect(html.match(/<h1[ >]/g) ?? []).toHaveLength(1);
    expect(html).toContain('<html lang="en">');
  });

  it("tells the reader to switch print headers and footers off", () => {
    expect(playbookToArtifactHtml({}, generatedAt)).toContain("headers and footers");
  });

  it("is self-contained: nothing in it can fetch anything", () => {
    const html = playbookToArtifactHtml({ [aTextId]: '<img src=x onerror="alert(1)">' }, generatedAt);

    for (const tag of elementTags(html)) {
      expect(tag, tag).not.toMatch(/[\s"']-?(?:src|href|srcset|poster|data|codebase|background)\s*=/i);
    }

    const styles = styleBlocks(html);
    expect(styles).toHaveLength(1);
    expect(styles[0]).not.toContain("url(");
    expect(styles[0]).not.toContain("@import");
  });

  it("produces a valid document from an empty answers map", () => {
    expect(() => playbookToArtifactHtml({}, generatedAt)).not.toThrow();
    const html = playbookToArtifactHtml({}, generatedAt);
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("<title>");
    expect(html.trimEnd().endsWith("</html>")).toBe(true);
    expect(html).toContain("0 of 45 prompts answered across 9 modules");
    // Every prompt unanswered, and not one empty grid anywhere in the document.
    expect(html.match(/Not yet answered\./g) ?? []).toHaveLength(PROMPT_TOTAL);
    expect(html).not.toContain("<table");
  });

  it("leaves assignmentToHtml's bytes exactly as they were, because they are hashed on-chain", () => {
    // Built from the definitions rather than pasted, so course copy can change; the markup
    // shape - no attributes, no separators, no module heading - is the part that must not.
    const expected =
      `<h2>${escapeHtml(`${firstAssignment.code} - ${firstAssignment.title}`)}</h2>` +
      firstAssignment.prompts
        .map((prompt) => {
          if (prompt.kind === "table") throw new Error("expected the first assignment to be text-only");
          const body = prompt.id === aTextId ? "<p>hello</p>" : "<p><em>Not yet answered.</em></p>";
          return `<h3>${escapeHtml(prompt.label)}</h3>${body}`;
        })
        .join("");

    expect(assignmentToHtml(firstAssignment, { [aTextId]: "hello" })).toBe(expected);
  });
});
