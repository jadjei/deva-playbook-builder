import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Developer Accelerator Academy Playbook Builder",
  description: "A browser-only worksheet for drafting course assignments. Nothing typed into it is sent anywhere.",
};

export const viewport: Viewport = {
  themeColor: "#111418",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
