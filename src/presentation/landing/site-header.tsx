import Link from "next/link";
import { BrandMark } from "./brand-mark";

const navigation = [
  { label: "Platform", href: "#platform" },
  { label: "Designed For", href: "#designed-for" },
  { label: "AI Employees", href: "#ai-employees" },
  { label: "Solutions", href: "#solutions" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#fbfbfa]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.04em] text-[#161817]" aria-label="MercyAI home">
          <BrandMark /> MercyAI
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-[#555955] transition-colors hover:text-[#161817]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          <Link
            href="/demo"
            className="hidden rounded-full border border-[#d2dbca] bg-white px-4 py-2 text-sm font-semibold text-[#292d29] transition-colors hover:bg-[#f4f7f0] sm:inline-flex"
          >
            Try AI Demo
          </Link>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-[#161817] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5 hover:bg-[#2c302d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#161817]"
          >
            Book Sales Demo
          </a>
        </div>
      </div>
    </header>
  );
}
