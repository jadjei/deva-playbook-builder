import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHead, SiteFooter, SiteHeader } from "@/components/Chrome";
import PlaybookBuilder from "@/components/playbook/PlaybookBuilder";
import site from "@/components/chrome.module.css";
import styles from "@/components/playbook/playbook.module.css";

export const metadata: Metadata = {
  title: "Playbook Builder | Developer Accelerator Academy",
  description:
    "Draft your Developer Accelerator assignments in your browser, then copy each one into Andamio. Nothing you type here is sent anywhere.",
  // Linked from the course material on Andamio, not from the public site. It is a worksheet,
  // not a page we want in search results competing with the programme page.
  robots: { index: false, follow: false },
};

export default function PlaybookPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className={site.hero}>
          <div className={site.wrap}>
            <div className={site.heroRule}>
              <span className={site.brandLabel}>Developer Accelerator Academy</span>
              <span className={site.label}>Playbook Builder</span>
            </div>
            <div className={site.heroCopy} style={{ paddingTop: 48 }}>
              <h1 className={site.heroTitle}>Draft it here. Submit it on Andamio.</h1>
              <p className={site.lede}>
                A worksheet for the nine module assignments. Write your answers, keep them across
                modules, and copy each assignment into its evidence field on Andamio when it is
                ready.
              </p>
            </div>
          </div>
        </section>

        <section className={`${site.section} ${site.paper}`}>
          <div className={site.wrap}>
            <div className={styles.noticeBand}>
              <div>
                <h2 className={styles.noticeHead}>Your answers stay in this browser</h2>
                <p className={styles.noticeBody}>
                  <strong>Nothing you type on this page is sent anywhere.</strong> There is no
                  account, no server and no network request: your drafts are saved in this
                  browser&apos;s own storage, on this device. Nobody else can read them, and
                  neither can we.
                </p>
                <p className={styles.noticeBody}>
                  That cuts both ways. Clearing your browser data, or switching to another
                  browser or machine, loses the lot. Download a backup when you have done real
                  work, and restore it wherever you want to carry on.
                </p>
              </div>
              <div>
                <h2 className={styles.noticeHead}>How it fits with Andamio</h2>
                <ol className={styles.noticeSteps}>
                  <li>Open the module you are working on. A link like #module-400 opens it directly.</li>
                  <li>Draft your answers here. They save as you type.</li>
                  <li>
                    Press <strong>Copy for Andamio</strong> and paste into that assignment&apos;s
                    evidence field.
                  </li>
                  <li>
                    Submit on Andamio. It stays the record: your evidence is hashed on-chain
                    there, not here.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className={site.section}>
          <div className={site.wrap}>
            <SectionHead n="01" title="Your playbook" />
            {/* The builder reads localStorage on mount, so it renders nothing useful on the
                server. The boundary keeps the rest of the page prerendered. */}
            <Suspense fallback={<p className={styles.loading}>Loading your playbook…</p>}>
              <PlaybookBuilder />
            </Suspense>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
