import Link from "next/link";
import { BrandMark } from "@/presentation/landing/brand-mark";
import { DemoIcon } from "./demo-icon";

export function DemoHeader() {
  return <header className="border-b border-black/[0.06] bg-[#fbfbfa]/85 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"><Link href="/" className="flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.04em] text-[#161817]" aria-label="MercyAI home"><BrandMark />MercyAI</Link><Link href="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#535853] transition-colors hover:bg-black/[0.05] hover:text-[#161817]"><DemoIcon name="arrow-left" className="size-4" />Back to Home</Link></div></header>;
}
