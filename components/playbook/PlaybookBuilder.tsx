"use client";

/**
 * The Playbook Builder: a worksheet that never talks to a server.
 *
 * Andamio stays the system of record, because its assignment evidence is hashed on-chain and
 * a link to a page hosted here would attest to a URL whose contents can change. So this page
 * composes text the learner pastes into Andamio, and holds their drafts in localStorage only.
 * There is no fetch, XHR or WebSocket call on this route, deliberately.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ASSIGNMENTS } from "@/lib/playbook/assignments.generated";
import { playbookToArtifactHtml } from "@/lib/playbook/artifact";
import { assignmentForAnchor, moduleAnchor } from "@/lib/playbook/types";
import {
  clear,
  createDebouncedSaver,
  filledCount,
  hasAnyAnswer,
  load,
  MAX_IMPORT_BYTES,
  parseBackup,
  playbookToBackupJson,
  playbookToMarkdown,
  save,
  type Answers,
  type ImportResult,
  type SaveResult,
} from "@/lib/playbook/storage";
import AssignmentPanel from "./AssignmentPanel";
import styles from "./playbook.module.css";

const MARKDOWN_FILENAME = "deva-playbook.md";
const ARTIFACT_FILENAME = "deva-playbook.html";
const BACKUP_FILENAME = "deva-playbook-backup.json";

/** Which panel opens when there is no hash. Reading the list once keeps this off the render path. */
const FIRST_CODE = ASSIGNMENTS[0]?.code;

type Notice =
  | { kind: "none" }
  | { kind: "blocked" }
  | { kind: "quota" }
  | { kind: "dropped"; count: number }
  | { kind: "future"; version: number }
  | { kind: "corrupt" };

interface PendingImport {
  readonly answers: Answers;
  readonly filename: string;
  /** Answers the file fills that this browser has empty. */
  readonly gained: number;
  /** Answers filled in this browser that the file leaves empty — wiped if this goes ahead. */
  readonly lost: number;
  readonly total: number;
  readonly dropped: number;
}

export default function PlaybookBuilder() {
  // `null` means "not hydrated yet" so the UI never flashes an empty playbook over saved work.
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [notice, setNotice] = useState<Notice>({ kind: "none" });
  const [savedAt, setSavedAt] = useState<string>("");
  const [confirmingReset, setConfirmingReset] = useState(false);
  // An accepted file waits here until the learner confirms — restoring replaces everything,
  // so it must never happen as a side effect of picking a file.
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null);
  const [importProblem, setImportProblem] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelImportRef = useRef<HTMLButtonElement>(null);
  const [openCodes, setOpenCodes] = useState<ReadonlySet<string>>(
    () => new Set(FIRST_CODE === undefined ? [] : [FIRST_CODE]),
  );
  const [pendingScrollTo, setPendingScrollTo] = useState<string | null>(null);

  const onSaveResult = useCallback((result: SaveResult) => {
    if (result.kind === "saved") {
      setSavedAt(result.updatedAt);
      setNotice((current) => (current.kind === "quota" || current.kind === "blocked" ? { kind: "none" } : current));
    } else if (result.kind === "quota-exceeded") {
      setNotice({ kind: "quota" });
    } else {
      setNotice({ kind: "blocked" });
    }
  }, []);

  const saver = useMemo(() => createDebouncedSaver(onSaveResult), [onSaveResult]);
  const saverRef = useRef(saver);
  saverRef.current = saver;

  useEffect(() => {
    const result = load();
    switch (result.kind) {
      case "ok":
        setAnswers(result.answers);
        setSavedAt(result.updatedAt);
        if (result.droppedIds.length > 0) setNotice({ kind: "dropped", count: result.droppedIds.length });
        break;
      case "future-version":
        setAnswers({});
        setNotice({ kind: "future", version: result.version });
        break;
      case "corrupt":
        setAnswers({});
        setNotice({ kind: "corrupt" });
        break;
      case "unavailable":
        setAnswers({});
        setNotice({ kind: "blocked" });
        break;
      default:
        setAnswers({});
    }
  }, []);

  // Autosave is debounced, so a close or tab-hide mid-keystroke would otherwise lose the tail.
  useEffect(() => {
    const flush = () => saverRef.current.flush();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
      saverRef.current.flush();
    };
  }, []);

  /**
   * Deep links: `/playbook#module-400` opens that module and nothing else, so a link printed
   * in an Andamio brief lands the learner on the right prompts.
   */
  const applyHash = useCallback(() => {
    const target = assignmentForAnchor(window.location.hash);
    if (!target) return;
    setOpenCodes(new Set([target.code]));
    setPendingScrollTo(moduleAnchor(target.module));
  }, []);

  /**
   * Scroll after the panel has actually expanded.
   *
   * This deliberately does not use `requestAnimationFrame`: rAF does not fire in a tab that is
   * not being displayed, which is exactly how someone opens a link from course material. The
   * right module would expand and the page would never move to it. An effect runs on commit
   * regardless of visibility.
   *
   * `behavior: 'instant'` so a learner following a link arrives rather than watching the other
   * eight modules slide past.
   */
  useEffect(() => {
    if (pendingScrollTo === null) return;
    document.getElementById(pendingScrollTo)?.scrollIntoView({ block: "start", behavior: "instant" });
    setPendingScrollTo(null);
  }, [pendingScrollTo]);

  // In-page links and browser back/forward.
  useEffect(() => {
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [applyHash]);

  /**
   * Apply the initial hash only once the panels exist. This component renders a loading line
   * until `localStorage` has been read, so running it on mount would look up an element that
   * is not in the document yet.
   */
  const initialHashDone = useRef(false);
  useEffect(() => {
    if (answers === null || initialHashDone.current) return;
    initialHashDone.current = true;
    applyHash();
  }, [answers, applyHash]);

  const toggleAssignment = useCallback((code: string, moduleId: string, open: boolean) => {
    setOpenCodes((current) => {
      const next = new Set(current);
      if (open) next.add(code);
      else next.delete(code);
      return next;
    });
    // Keep the address bar pointing at what is being worked on, so copying the URL comes back
    // here. replaceState rather than pushState — expanding a panel is not a navigation and
    // should not fill the back button.
    if (open) window.history.replaceState(null, "", `#${moduleAnchor(moduleId)}`);
  }, []);

  // Move focus to Cancel, not to the destructive button — a stray Enter should not wipe a
  // half-written playbook.
  useEffect(() => {
    if (pendingImport) cancelImportRef.current?.focus();
  }, [pendingImport]);

  const handleChange = useCallback((fieldId: string, value: string) => {
    setAnswers((current) => {
      const next = { ...(current ?? {}), [fieldId]: value };
      saverRef.current.schedule(next);
      return next;
    });
  }, []);

  const download = (filename: string, contents: string, mime: string) => {
    const blob = new Blob([contents], { type: mime });
    const url = URL.createObjectURL(blob);
    // An <a download> click is not a navigation, so it is unaffected by `default-src 'self'`.
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // Revoked late, not on the next line. Firefox and WebKit can still be reading the blob
    // when the click returns, and revoking under them truncates or silently drops the
    // download. It matters most for the artifact, the largest thing this page emits.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const downloadBackup = (current: Answers) =>
    download(BACKUP_FILENAME, playbookToBackupJson(current), "application/json");

  /**
   * Print the artifact, not this page.
   *
   * The same composed document the download button produces, written into a hidden iframe
   * and printed from there, so the learner reaches a PDF in one action without saving a file
   * first. Printing this page instead would mean maintaining a second layout of an
   * interactive worksheet, and would still leave them with nothing to send.
   *
   * `srcdoc` keeps it in-document: no blob URL, no navigation, nothing for `default-src
   * 'self'` to refuse. The frame is removed after the print dialog returns; Safari resolves
   * `print()` before the dialog closes, so the removal is deferred rather than immediate.
   */
  const printArtifact = (current: Answers) => {
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    frame.srcdoc = playbookToArtifactHtml(current, new Date());
    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => frame.remove(), 60_000);
    };
    document.body.appendChild(frame);
  };

  const handleFilePicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Let the same file be picked again after a cancel.
    event.target.value = "";
    if (!file || answers === null) return;

    setImportProblem(null);
    setPendingImport(null);

    // Check the size before reading, so an oversized file is never pulled into memory.
    if (file.size > MAX_IMPORT_BYTES) {
      setImportProblem({ kind: "too-large", bytes: file.size });
      return;
    }

    let text: string;
    try {
      text = await file.text();
    } catch {
      setImportProblem({ kind: "not-json" });
      return;
    }

    const result = parseBackup(text);
    if (result.kind !== "ok") {
      setImportProblem(result);
      return;
    }

    // Gained and lost are counted against what is in this browser right now, so the dialog can
    // say what a restore actually costs rather than just how big the file is.
    const incoming = result.answers;
    const gained = Object.entries(incoming).filter(
      ([id, value]) => value.trim() !== "" && (answers[id] ?? "").trim() === "",
    ).length;
    const lost = Object.entries(answers).filter(
      ([id, value]) => value.trim() !== "" && (incoming[id] ?? "").trim() === "",
    ).length;

    setPendingImport({
      answers: incoming,
      filename: file.name,
      gained,
      lost,
      total: result.importedCount,
      dropped: result.droppedIds.length,
    });
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    // All or nothing: replace state in one go, never merge, then write immediately rather than
    // waiting for the debounce, so a restore survives an immediate tab close.
    saverRef.current.cancel();
    setAnswers(pendingImport.answers);
    onSaveResult(save(pendingImport.answers));
    setPendingImport(null);
    setNotice({ kind: "none" });
  };

  const handleReset = () => {
    saverRef.current.cancel();
    clear();
    setAnswers({});
    setSavedAt("");
    setConfirmingReset(false);
    setNotice({ kind: "none" });
  };

  if (answers === null) {
    return <p className={styles.loading}>Loading your playbook…</p>;
  }

  const anyAnswers = hasAnyAnswer(answers);
  const answeredNow = filledCount(answers);

  return (
    <div className={styles.builder}>
      <StorageNotice notice={notice} />

      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.toolButton}
          disabled={!anyAnswers}
          onClick={() => download(MARKDOWN_FILENAME, playbookToMarkdown(answers), "text/markdown")}>
          Download playbook (.md)
        </button>
        <button
          type="button"
          className={styles.toolButton}
          disabled={!anyAnswers}
          onClick={() => download(ARTIFACT_FILENAME, playbookToArtifactHtml(answers, new Date()), "text/html")}>
          Download your playbook document
        </button>
        <button type="button" className={styles.toolButton} disabled={!anyAnswers} onClick={() => printArtifact(answers)}>
          Print or save as PDF
        </button>
        <button
          type="button"
          className={styles.toolButton}
          disabled={!anyAnswers}
          onClick={() => downloadBackup(answers)}>
          Download backup (.json)
        </button>
        <button type="button" className={styles.toolButton} onClick={() => fileInputRef.current?.click()}>
          Restore from backup
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className={styles.srOnly}
          aria-label="Choose a playbook backup file to restore"
          onChange={handleFilePicked}
        />

        {confirmingReset ? (
          <>
            <button type="button" className={`${styles.toolButton} ${styles.toolButtonDanger}`} onClick={handleReset}>
              Erase every answer
            </button>
            <button type="button" className={styles.toolButton} onClick={() => setConfirmingReset(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className={styles.toolButton}
            disabled={!anyAnswers}
            onClick={() => setConfirmingReset(true)}>
            Erase
          </button>
        )}

        <span aria-live="polite" className={styles.savedAt}>
          {savedAt !== "" && `Saved in this browser at ${new Date(savedAt).toLocaleTimeString()}`}
        </span>
      </div>

      <p className={styles.hint}>
        The document is the one to send to someone: a single file that opens anywhere, and the same thing the print
        button lays out as a PDF. The .md is plain prose for your own reading. Neither is a backup and neither can be
        restored from. The .json is the canonical copy: keep it if you want to move your playbook to another browser
        or machine.
      </p>

      {importProblem && importProblem.kind !== "ok" && (
        <ImportProblem problem={importProblem} onDismiss={() => setImportProblem(null)} />
      )}

      {pendingImport && (
        <div
          role="alertdialog"
          aria-labelledby="import-confirm-title"
          aria-describedby="import-confirm-body"
          className={styles.dialog}>
          <p id="import-confirm-title" className={styles.dialogTitle}>
            {answeredNow > 0 ? "Replace your whole playbook with this backup?" : "Restore this backup?"}
          </p>
          <p id="import-confirm-body" className={styles.dialogBody}>
            <strong>{pendingImport.filename}</strong> holds {pendingImport.total} answer
            {pendingImport.total === 1 ? "" : "s"}.{" "}
            {answeredNow > 0 ? (
              <>
                Restoring <strong>replaces everything</strong>, it does not merge. You would gain{" "}
                <strong>
                  {pendingImport.gained} answer{pendingImport.gained === 1 ? "" : "s"}
                </strong>{" "}
                and lose{" "}
                <strong>
                  {pendingImport.lost} answer{pendingImport.lost === 1 ? "" : "s"}
                </strong>{" "}
                you have typed in this browser. That cannot be undone.
              </>
            ) : (
              <>Nothing is saved in this browser yet, so nothing will be overwritten.</>
            )}
            {pendingImport.dropped > 0 &&
              ` ${pendingImport.dropped} entr${pendingImport.dropped === 1 ? "y" : "ies"} in the file did not match any current prompt and will not be restored; your file is not changed.`}
          </p>
          <div className={styles.dialogActions}>
            <button
              type="button"
              ref={cancelImportRef}
              className={styles.toolButton}
              onClick={() => setPendingImport(null)}>
              Cancel
            </button>
            {answeredNow > 0 && (
              <button type="button" className={styles.toolButton} onClick={() => downloadBackup(answers)}>
                Back up what I have first
              </button>
            )}
            <button
              type="button"
              className={`${styles.toolButton} ${styles.toolButtonDanger}`}
              onClick={confirmImport}>
              {answeredNow > 0 ? "Replace everything" : "Restore"}
            </button>
          </div>
        </div>
      )}

      <div className={styles.panels}>
        {ASSIGNMENTS.map((assignment) => (
          <AssignmentPanel
            key={assignment.code}
            assignment={assignment}
            answers={answers}
            onChange={handleChange}
            open={openCodes.has(assignment.code)}
            onToggle={(open) => toggleAssignment(assignment.code, assignment.module, open)}
          />
        ))}
      </div>
    </div>
  );
}

function ImportProblem({ problem, onDismiss }: { problem: ImportResult; onDismiss: () => void }) {
  let message: string;
  switch (problem.kind) {
    case "too-large":
      message = `That file is ${(problem.bytes / 1_048_576).toFixed(1)} MB, which is far larger than any playbook backup, so it was not opened. Nothing has been changed; check you picked the right file.`;
      break;
    case "not-json":
      message =
        "That file could not be read as a backup. Restore needs the .json backup, not the .md playbook. The playbook is written for you to read, and cannot be restored from.";
      break;
    case "future-version":
      message = `That backup was written by a newer version of this page (version ${problem.version}), so it has not been restored. Nothing has been changed and your file is untouched.`;
      break;
    case "no-answers":
      message =
        "That backup is valid but has no answers in it, so there was nothing to restore. Nothing has been changed.";
      break;
    case "wrong-shape":
      message = `That file could not be restored: ${problem.reason}. Nothing has been changed.`;
      break;
    default:
      return null;
  }

  return (
    <div role="alert" className={`${styles.message} ${styles.messageError}`}>
      <span>{message}</span>
      <button type="button" className={styles.dismiss} onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}

const STORAGE_MESSAGES: Record<Exclude<Notice["kind"], "none">, string> = {
  blocked:
    "This browser is blocking site storage, so your answers cannot be saved between visits. You can still fill the form in and copy your answers out, but do not reload the page before you do.",
  quota:
    "Your browser storage is full, so the most recent changes were not saved. Download a backup now, then free some space.",
  dropped:
    "Some saved answers did not match any current prompt and were not loaded. They are still in your last downloaded backup, if you have one.",
  future:
    "Your saved playbook was written by a newer version of this page, so it was not loaded. Your saved data has not been changed, so download a backup before entering anything new.",
  corrupt: "Your saved playbook could not be read, so this page has started empty. The unreadable data has not been overwritten yet.",
};

function StorageNotice({ notice }: { notice: Notice }) {
  if (notice.kind === "none") return null;

  const isError = notice.kind === "quota" || notice.kind === "blocked";
  return (
    <div role="status" className={`${styles.message} ${isError ? styles.messageError : styles.messageWarn}`}>
      <span>{STORAGE_MESSAGES[notice.kind]}</span>
    </div>
  );
}
