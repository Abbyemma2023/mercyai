import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  centered?: boolean;
};

export function SectionHeading({ eyebrow, title, description, centered = false }: SectionHeadingProps) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#5f625f]">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold tracking-[-0.055em] text-[#161817] sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="mt-5 text-pretty text-base leading-7 text-[#646864] sm:text-lg">{description}</p> : null}
    </div>
  );
}
