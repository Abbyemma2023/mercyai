type IconName =
  | "arrow"
  | "clock"
  | "conversation"
  | "finance"
  | "hr"
  | "knowledge"
  | "operations"
  | "sales"
  | "sparkle"
  | "support";

type IconProps = { name: IconName; className?: string };

export function Icon({ name, className = "" }: IconProps) {
  const common = { className: `size-5 ${className}`, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24", "aria-hidden": true };

  switch (name) {
    case "arrow": return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></svg>;
    case "conversation": return <svg {...common}><path d="M20 11.5a7.5 7.5 0 0 1-10.8 6.7L4 20l1.8-4.3A7.5 7.5 0 1 1 20 11.5Z" /><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" /></svg>;
    case "finance": return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 15.5 10.6 13l2 1.7L16.5 10M8 8h.01" /></svg>;
    case "hr": return <svg {...common}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9.5" r="2" /><path d="M3.8 19c.5-3.1 2.3-5 5.2-5s4.7 1.9 5.2 5M15.3 14.6c2.6.1 4.4 1.5 4.9 4.4" /></svg>;
    case "knowledge": return <svg {...common}><path d="M5 4.5h10a4 4 0 0 1 4 4V20H9a4 4 0 0 0-4 0V4.5Z" /><path d="M9 7.5h6M9 11h6" /></svg>;
    case "operations": return <svg {...common}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg>;
    case "sales": return <svg {...common}><path d="M5 19.5V14M10 19.5V9M15 19.5V12M20 19.5V5" /><path d="m5 10 5-4 5 3 5-5" /></svg>;
    case "sparkle": return <svg {...common}><path d="m12 3 1.5 5.6L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.4L12 3ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></svg>;
    case "support": return <svg {...common}><path d="M4.5 13v-1a7.5 7.5 0 0 1 15 0v1" /><path d="M4.5 13v3.5h3V13M19.5 13v3.5h-3V13M16.5 19.5c-1.4.8-3 .8-4.5 0" /></svg>;
  }
}
