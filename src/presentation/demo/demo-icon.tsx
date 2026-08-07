type DemoIconName =
  | "arrow-left"
  | "calendar"
  | "check"
  | "chevron"
  | "download"
  | "refresh"
  | "send"
  | "sparkle"
  | "user";

export function DemoIcon({
  name,
  className = "",
}: {
  name: DemoIconName;
  className?: string;
}) {
  const props = {
    "aria-hidden": true,
    className: `size-5 ${className}`,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "arrow-left":
      return <svg {...props}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>;
    case "calendar":
      return <svg {...props}><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M7.5 3.5v3M16.5 3.5v3M3.5 9h17M8 13h.01M12 13h.01M16 13h.01" /></svg>;
    case "check":
      return <svg {...props}><path d="m5 12 4.2 4.2L19 6.5" /></svg>;
    case "chevron":
      return <svg {...props}><path d="m8 10 4 4 4-4" /></svg>;
    case "download":
      return <svg {...props}><path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M5 20h14" /></svg>;
    case "refresh":
      return <svg {...props}><path d="M20 11a8 8 0 0 0-14.8-3.9L3 10M4 5v5h5M4 13a8 8 0 0 0 14.8 3.9L21 14M20 19v-5h-5" /></svg>;
    case "send":
      return <svg {...props}><path d="m21 3-7.5 18-3.4-7.1L3 10.5 21 3Z" /><path d="m10.1 13.9 4.4-4.4" /></svg>;
    case "sparkle":
      return <svg {...props}><path d="m12 3 1.55 5.45L19 10l-5.45 1.55L12 17l-1.55-5.45L5 10l5.45-1.55L12 3ZM19 16l.65 2.35L22 19l-2.35.65L19 22l-.65-2.35L16 19l2.35-.65L19 16Z" /></svg>;
    case "user":
      return <svg {...props}><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c.65-3.7 2.8-5.5 6.5-5.5s5.85 1.8 6.5 5.5" /></svg>;
  }
}
