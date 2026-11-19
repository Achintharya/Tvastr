import { useRef } from "react";

import { SectionShell } from "../../primitives/SectionShell";
import { visualizerContent } from "@/content/technology/index";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function VisualizerSection() {
  const { eyebrow, title, summary, badge, link } = visualizerContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="visualizer" className="text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <p
          className="font-mono text-[11px] md:text-[12px] tracking-[0.28em] uppercase"
          style={{ color: "var(--signal-glow)" }}
        >
          {eyebrow}
        </p>

        <h2 className="text-3xl md:text-5xl font-medium text-txt-primary leading-[1.05] tracking-[-0.02em]">
          {title}
        </h2>

        <p
          data-subheading
          className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mx-auto"
        >
          {summary}
        </p>

        <div
          data-reveal-item
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs text-txt-muted border"
            style={{ borderColor: "var(--border-default)" }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="opacity-40 shrink-0"
            >
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M1 6h10M6 1C4.5 3 3.5 4.5 3.5 6S4.5 9 6 11M6 1c1.5 2 2.5 3.5 2.5 5S7.5 9 6 11"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            {badge}
          </span>

          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            style={{
              background: "var(--process-primary)",
              color: "var(--bg-primary)",
            }}
          >
            {link.label}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M5 3h6v6M11 3L3 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
