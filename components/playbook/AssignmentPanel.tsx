"use client";

import { useId, useState } from "react";
import {
  cellId,
  moduleAnchor,
  type AssignmentDef,
  type PromptDef,
  type TablePromptDef,
} from "@/lib/playbook/types";
import { answeredCount, assignmentToMarkdown, type Answers } from "@/lib/playbook/storage";
import { copyAssignment } from "@/lib/playbook/clipboard";
import styles from "./playbook.module.css";

interface Props {
  assignment: AssignmentDef;
  answers: Answers;
  onChange: (fieldId: string, value: string) => void;
  /** Controlled by the parent so a `#module-400` link can decide what is showing. */
  open: boolean;
  onToggle: (open: boolean) => void;
}

export default function AssignmentPanel({ assignment, answers, onChange, open, onToggle }: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "fallback">("idle");
  const panelId = useId();
  const anchor = moduleAnchor(assignment.module);

  const done = answeredCount(assignment, answers);
  const total = assignment.prompts.length;

  const handleCopy = async () => {
    const outcome = await copyAssignment(assignment, answers);
    setCopyState(outcome);
    if (outcome === "copied") window.setTimeout(() => setCopyState("idle"), 2500);
  };

  return (
    <section id={anchor} className={styles.panel}>
      <h2 className={styles.panelHeading}>
        <button
          type="button"
          className={styles.panelToggle}
          onClick={() => onToggle(!open)}
          aria-expanded={open}
          aria-controls={panelId}>
          <span className={styles.panelLabel}>
            <span className={styles.panelModule}>
              Module {assignment.module} · {assignment.moduleName} · {assignment.code}
            </span>
            <span className={styles.panelTitle}>{assignment.title}</span>
          </span>
          <span className={styles.panelMeta}>
            <span className={`${styles.count} ${done === total ? styles.countDone : ""}`}>
              {done}/{total}
            </span>
            <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} aria-hidden="true" />
          </span>
        </button>
      </h2>

      <div id={panelId} hidden={!open} className={styles.panelBody}>
        <p className={styles.intro}>{assignment.intro}</p>

        {assignment.prompts.map((prompt) => (
          <Prompt key={prompt.id} prompt={prompt} answers={answers} onChange={onChange} />
        ))}

        <div className={styles.panelFoot}>
          <button type="button" className={styles.copyButton} onClick={handleCopy}>
            Copy for Andamio
          </button>
          <span aria-live="polite" className={styles.copyStatus}>
            {copyState === "copied" && "Copied. Paste it into this assignment's evidence field on Andamio."}
            {copyState === "fallback" && "Clipboard unavailable. Copy the text below by hand."}
          </span>
          <a className={styles.anchorLink} href={`#${anchor}`}>
            Link to this module
          </a>
        </div>

        {copyState === "fallback" && (
          <textarea
            readOnly
            rows={14}
            className={`${styles.textarea} ${styles.copyOut}`}
            value={assignmentToMarkdown(assignment, answers)}
            onFocus={(event) => event.currentTarget.select()}
            aria-label={`${assignment.title} - text to copy by hand`}
          />
        )}
      </div>
    </section>
  );
}

function Prompt({
  prompt,
  answers,
  onChange,
}: {
  prompt: PromptDef;
  answers: Answers;
  onChange: (fieldId: string, value: string) => void;
}) {
  const hintId = `${prompt.id}-hint`;

  return (
    <div className={styles.prompt}>
      <h3 className={styles.promptLabel} id={`${prompt.id}-label`}>
        {prompt.label}
      </h3>
      <p className={styles.hint} id={hintId}>
        {prompt.hint}
      </p>

      {prompt.kind === "table" ? (
        <TableInput prompt={prompt} answers={answers} onChange={onChange} />
      ) : (
        <textarea
          id={prompt.id}
          className={styles.textarea}
          value={answers[prompt.id] ?? ""}
          onChange={(event) => onChange(prompt.id, event.target.value)}
          rows={prompt.size === "long" ? 8 : 4}
          aria-labelledby={`${prompt.id}-label`}
          aria-describedby={hintId}
        />
      )}
    </div>
  );
}

/**
 * Table cells are ordinary fields with their own ids, so a column can be added later without
 * shifting stored data. A grid on desktop; each row stacks into its own labelled block below
 * 600px, where a real table is unusable.
 */
function TableInput({
  prompt,
  answers,
  onChange,
}: {
  prompt: TablePromptDef;
  answers: Answers;
  onChange: (fieldId: string, value: string) => void;
}) {
  const rowStyle = {
    "--pb-cols": `minmax(9rem, 0.8fr) repeat(${prompt.columns.length}, minmax(0, 1fr))`,
  } as React.CSSProperties;

  return (
    <div className={styles.table}>
      {/* Decoration only: the real labelling is the aria-label on each input, which names the
          prompt, the row and the column. Hidden below 600px, where rows stack and each cell
          carries its own visible column label instead. */}
      <div className={styles.tableHead} style={rowStyle} aria-hidden="true">
        <span className={styles.rowLabel} />
        {prompt.columns.map((column) => (
          <span key={column.key} className={styles.headCell}>
            {column.label}
          </span>
        ))}
      </div>

      {prompt.rows.map((row) => (
        <div key={row.key} className={styles.tableRow} style={rowStyle}>
          <span className={styles.rowLabel}>{row.label}</span>
          {prompt.columns.map((column) => {
            const id = cellId(prompt, row.key, column.key);
            return (
              <div key={column.key} className={styles.cell}>
                <span className={styles.cellLabel}>{column.label}</span>
                <input
                  type="text"
                  className={styles.cellInput}
                  value={answers[id] ?? ""}
                  onChange={(event) => onChange(id, event.target.value)}
                  aria-label={`${prompt.label} - ${row.label} - ${column.label}`}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
