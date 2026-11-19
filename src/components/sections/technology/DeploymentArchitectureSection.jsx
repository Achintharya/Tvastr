import { useRef } from "react";

import { SectionShell } from "../../primitives/SectionShell";
import { SectionHeader } from "../../primitives/SectionHeader";
import { deploymentArchitectureContent } from "@/content/technology/index";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function DeploymentArchitectureSection() {
  const {
    title,
    subtitle,
    body,
    coreProperties,
    infrastructure,
    keyMessage,
  } = deploymentArchitectureContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="deployment-architecture">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        eyebrow="Infrastructure"
      />
      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      {/* Core Properties — deep green band */}
      <div
        className="p-8 md:p-10 rounded-2xl mb-16"
        style={{
          background: "var(--process-primary)",
          color: "var(--bg-primary)",
        }}
      >
        <p
          className="font-mono text-[11px] tracking-[0.28em] uppercase mb-6"
          style={{ color: "var(--signal-glow)" }}
        >
          Core Properties
        </p>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
          {coreProperties.map((prop, i) => (
            <div key={i} className="flex items-start gap-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 flex-shrink-0 opacity-80"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-base leading-relaxed">{prop}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure — hairline grid */}
      <div className="grid md:grid-cols-3 gap-px bg-border-subtle border border-border-subtle mb-12">
        {Object.values(infrastructure).map((item, i) => (
          <div key={i} data-reveal-item className="p-7 bg-bg-primary">
            <h4 className="text-lg font-medium text-txt-primary leading-tight mb-3">
              {item.title}
            </h4>
            <p className="text-sm text-txt-secondary leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <p className="text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
