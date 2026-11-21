import Link from "next/link";
import styles from "./chrome.module.css";

/** Plain page furniture: a text title, a section heading and a footer. No logo, no web fonts. */

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.wrap}>
        <Link className={styles.title} href="/playbook">
          Developer Accelerator Academy Playbook Builder
        </Link>
      </div>
    </header>
  );
}

export function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className={styles.sectionHead}>
      <span className={styles.sectionNumber}>{n}</span>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <p>
          Open source under the Apache License 2.0. The assignment text in this build is placeholder; see the
          README to generate your own.
        </p>
      </div>
    </footer>
  );
}
