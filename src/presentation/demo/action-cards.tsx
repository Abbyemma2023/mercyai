import type { ConversationAction } from "@/core/domain/conversation";
import { DemoIcon } from "./demo-icon";

const actions: ReadonlyArray<{
  action: ConversationAction;
  label: string;
  description: string;
  icon: "calendar" | "download" | "user";
}> = [
  { action: "book-viewing", label: "Book Viewing", description: "Arrange a private tour", icon: "calendar" },
  { action: "download-brochure", label: "Download Brochure", description: "Get property details", icon: "download" },
  { action: "talk-to-human", label: "Talk to Human", description: "Connect with an advisor", icon: "user" },
];

export function ActionCards({
  onAction,
  onRestart,
  onViewReport,
  disabled,
}: {
  onAction: (action: ConversationAction) => void;
  onRestart: () => void;
  onViewReport?: () => void;
  disabled: boolean;
}) {
  return (
    <section aria-label="Conversation actions" className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
      {actions.map((item) => (
        <button
          key={item.action}
          type="button"
          disabled={disabled}
          onClick={() => onAction(item.action)}
          className="group flex items-center gap-3 rounded-xl border border-[#e0e3de] bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-[#cdd9bc] hover:shadow-[0_10px_22px_rgba(38,48,30,0.06)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eff5e8] text-[#647a4b] transition-colors group-hover:bg-[#e2f2c2]">
            <DemoIcon name={item.icon} className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-[#272b27]">{item.label}</span>
            <span className="mt-0.5 block text-xs text-[#7c817b]">{item.description}</span>
          </span>
        </button>
      ))}

      {onViewReport && (
        <button
          type="button"
          disabled={disabled}
          onClick={onViewReport}
          className="group flex items-center gap-3 rounded-xl border border-[#b8df65] bg-[#f2fcd8] p-3.5 text-left transition-all hover:-translate-y-0.5 hover:bg-[#e6f9be] hover:shadow-[0_10px_22px_rgba(38,48,30,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#d4f66b] text-[#243315]">
            <DemoIcon name="sparkle" className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-bold text-[#1f2915]">Executive Report</span>
            <span className="mt-0.5 block text-xs text-[#4a5938]">View Business Impact</span>
          </span>
        </button>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={onRestart}
        className="group flex items-center gap-3 rounded-xl border border-[#e0e3de] bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-[#cdd9bc] hover:shadow-[0_10px_22px_rgba(38,48,30,0.06)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f3f4f2] text-[#717670]">
          <DemoIcon name="refresh" className="size-4" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-[#272b27]">Restart</span>
          <span className="mt-0.5 block text-xs text-[#7c817b]">Begin demo again</span>
        </span>
      </button>
    </section>
  );
}
