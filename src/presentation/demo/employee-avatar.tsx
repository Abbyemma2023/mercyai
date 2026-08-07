import { DemoIcon } from "./demo-icon";

export function EmployeeAvatar({ size = "large" }: { size?: "small" | "large" }) {
  const dimensions = size === "large" ? "size-28 sm:size-32" : "size-10";

  return <span aria-label="Maya, AI Sales Employee" className={`relative grid ${dimensions} place-items-center rounded-[32%] bg-[#d9f785] text-[#2d3a1f] shadow-[0_18px_34px_rgba(98,127,47,0.2)]`}>
    <span className="grid size-[62%] place-items-center rounded-[36%] border border-[#a6c45e]/50 bg-[#eefbc8] shadow-inner"><DemoIcon name="sparkle" className={size === "large" ? "size-9" : "size-4"} /></span>
    <span className="absolute -bottom-1 -right-1 size-5 rounded-full border-[3px] border-[#fbfbfa] bg-[#80c243]" />
  </span>;
}
