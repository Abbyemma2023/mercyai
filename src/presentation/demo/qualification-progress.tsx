import type { ProgressItem } from "@/core/application/conversation/progress-tracker";
import { DemoIcon } from "./demo-icon";

export function QualificationProgress({ items }: { items: ProgressItem[] }) {
  const completed = items.filter((item) => item.complete).length;

  return <div><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-[#1d201e]">Lead qualification</p><p className="mt-1 text-xs text-[#747974]">{completed} of {items.length} details captured</p></div><span className="grid size-9 place-items-center rounded-full bg-[#eef7d6] text-sm font-bold text-[#5c7e32]">{completed}</span></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#ebede9]"><div className="h-full rounded-full bg-[#94cc4b] transition-all duration-700" style={{ width: `${(completed / items.length) * 100}%` }} /></div><ol className="mt-6 space-y-4">{items.map((item) => <li key={item.key} className={`flex items-center gap-3 text-sm transition-colors ${item.complete ? "text-[#3f6423]" : "text-[#888c87]"}`}><span className={`grid size-5 place-items-center rounded-full border transition-all duration-500 ${item.complete ? "border-[#80bc3d] bg-[#80bc3d] text-white" : "border-[#d7dad5] bg-white text-transparent"}`}><DemoIcon name="check" className="size-3" /></span><span className={item.complete ? "font-medium" : ""}>{item.label}</span></li>)}</ol></div>;
}
