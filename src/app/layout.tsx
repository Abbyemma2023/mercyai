import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MercyAI | AI Sales Employee for Real Estate Teams",
  description:
    "Qualify inbound real estate leads 24/7, book viewing appointments sub-5-seconds, and scale pipeline velocity with MercyAI's intelligent AI Sales Employee.",
  keywords: [
    "AI Sales Employee",
    "Real Estate Lead Qualification",
    "Property Lead Automation",
    "Real Estate AI Assistant",
    "MercyAI",
    "Estate Agency Automation",
  ],
  authors: [{ name: "MercyAI Team" }],
  openGraph: {
    title: "MercyAI | AI Sales Employee for Real Estate Teams",
    description:
      "Turn every inbound property inquiry into a qualified viewing appointment. Automate lead triage, timeline & budget qualification 24/7.",
    url: "https://mercyai.com",
    siteName: "MercyAI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MercyAI | AI Sales Employee for Real Estate Teams",
    description:
      "Qualify real estate leads in 5 minutes 24/7. Never lose a high-value property buyer to slow response times.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fbfbfa] text-[#161817]">{children}</body>
    </html>
  );
}
