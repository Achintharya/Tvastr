import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { signalFirstAIContent } from "@/content/homepage/signal-first-ai";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function SignalFirstAISection() {
  const { title, subtitle, body, capabilities, keyMessage } =
    signalFirstAIContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="signal-first-ai">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        eyebrow="Quality Intelligence"
      />

      {/* Body text */}
      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      {/* Key capabilities — clean 2x2 grid */}
      <div
        className="rounded-2xl p-8 md:p-12 lg:p-16"
        style={{
          background: "var(--process-primary)",
          color: "var(--bg-primary)",
        }}
      >
        <p
          className="font-mono text-[11px] tracking-[0.28em] uppercase mb-6"
          style={{ color: "var(--signal-glow)" }}
        >
          Key Capabilities
        </p>
        <h3 className="text-2xl md:text-3xl font-medium leading-tight mb-10 max-w-3xl">
          What you get with Tvastr
        </h3>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
          {capabilities.map((capability, i) => (
            <div key={i} className="flex items-start gap-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 flex-shrink-0 opacity-90"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-base leading-relaxed">{capability}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key message */}
      <p className="mt-16 text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
