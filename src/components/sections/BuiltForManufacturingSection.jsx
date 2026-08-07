import { useRef } from "react";
import { Server, Brain, Layers } from "lucide-react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { builtForManufacturingContent } from "@/content/homepage/built-for-manufacturing";
import { useSectionReveal } from "../../hooks/useSectionReveal";

const iconMap = {
  server: Server,
  brain: Brain,
  layers: Layers,
};

/**
 * BuiltForManufacturingSection
 * 
 * Three-column differentiator banner that immediately establishes
 * why Tvastr is different from cloud-adapted factory software.
 * Clean, focused, high-impact messaging.
 */
export function BuiltForManufacturingSection() {
  const sectionRef = useRef(null);
  const { id, title, subtitle, differentiators } = builtForManufacturingContent;

  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id={id}>
      <div className="max-w-5xl mx-auto text-center">
        <SectionHeader title={title} subtitle={subtitle} />

        <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-8 md:gap-12">
          {differentiators.map((diff, idx) => {
            const IconComponent = iconMap[diff.icon];
            return (
              <div
                key={idx}
                data-reveal-item
                className="flex flex-col items-center text-center"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "var(--process-primary)" }}
                >
                  <IconComponent
                    className="w-7 h-7"
                    style={{ color: "var(--bg-primary)" }}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-medium text-txt-primary mb-3">
                  {diff.title}
                </h3>
                <p className="text-base text-txt-secondary leading-relaxed max-w-xs">
                  {diff.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
