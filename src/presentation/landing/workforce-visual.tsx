import { Icon } from "./icon";

const employees = [
  { label: "Sales", icon: "sales" as const, position: "left-[2%] top-[20%]", delay: "[animation-delay:400ms]" },
  { label: "Support", icon: "support" as const, position: "right-[2%] top-[12%]", delay: "[animation-delay:900ms]" },
  { label: "Finance", icon: "finance" as const, position: "bottom-[8%] left-[15%]", delay: "[animation-delay:1300ms]" },
  { label: "Operations", icon: "operations" as const, position: "bottom-[3%] right-[8%]", delay: "[animation-delay:700ms]" },
];

export function WorkforceVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[530px]" role="img" aria-label="Illustration of AI Employees working together">
      <div className="absolute inset-[8%] rounded-full border border-dashed border-[#b8c6b0]" />
      <div className="absolute inset-[20%] rounded-full border border-[#d9e3d5]" />
      <div className="absolute inset-[31%] rounded-full bg-[#e4f4bd] blur-3xl animate-pulse-soft" />
      <div className="absolute inset-[30%] grid place-items-center rounded-[32%] border border-white/80 bg-[#171a18] p-5 text-center shadow-[0_28px_60px_rgba(29,41,24,0.25)]">
        <div>
          <span className="mx-auto mb-3 grid size-10 place-items-center rounded-2xl bg-[#d4f66b] text-[#171a18]"><Icon name="sparkle" /></span>
          <p className="text-sm font-semibold text-white">MercyAI Core</p>
          <p className="mt-1 text-[11px] text-white/55">Orchestrating work</p>
        </div>
      </div>
      {employees.map((employee) => (
        <div key={employee.label} className={`animate-float absolute ${employee.position} ${employee.delay} rounded-2xl border border-white bg-white/90 p-3.5 shadow-[0_14px_34px_rgba(31,41,27,0.12)] backdrop-blur-sm`}>
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl bg-[#eff8d8] text-[#52603e]"><Icon name={employee.icon} className="size-4" /></span>
            <span className="text-xs font-semibold text-[#303330]">AI {employee.label}</span>
            <span className="size-1.5 rounded-full bg-[#91d13a]" />
          </div>
        </div>
      ))}
      <div className="absolute left-[27%] top-[15%] h-px w-[23%] rotate-[31deg] bg-gradient-to-r from-transparent to-[#afbf9c]" />
      <div className="absolute right-[22%] top-[29%] h-px w-[23%] -rotate-[27deg] bg-gradient-to-r from-[#afbf9c] to-transparent" />
      <div className="absolute bottom-[24%] left-[28%] h-px w-[22%] rotate-[-30deg] bg-gradient-to-r from-transparent to-[#afbf9c]" />
      <div className="absolute bottom-[23%] right-[27%] h-px w-[20%] rotate-[31deg] bg-gradient-to-r from-[#afbf9c] to-transparent" />
    </div>
  );
}
