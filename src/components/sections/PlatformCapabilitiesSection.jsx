import { useRef } from "react";
import { CheckCircle, Activity, TrendingUp, Zap } from "lucide-react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { platformCapabilitiesContent } from "@/content/homepage/platform-capabilities";
import { useSectionReveal } from "../../hooks/useSectionReveal";

const iconMap = {
  "check-circle": CheckCircle,
  activity: Activity,
  "trending-up": TrendingUp,
  zap: Zap,
};

/**
 * PlatformCapabilitiesSection
 * 
 * Customer outcome-focused capabilities organized by intelligence domain.
 * Shows what customers GET from the platform, not which product delivers it.
 */
export function PlatformCapabilitiesSection() {
  const sectionRef = useRef(null);
  const { id, title, subtitle, capabilities, platformFeatures, keyMessage } =
    platformCapabilitiesContent;

  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id={id}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader title={title} subtitle={subtitle} eyebrow="Capabilities" />

        {/* Four-column capability grid */}
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {capabilities.map((cap, idx) => {
            const IconComponent = iconMap[cap.icon];
            return (
              <div
                key={idx}
                data-reveal-item
                className="flex flex-col p-6 md:p-7 rounded-lg"
                style={{ background: "var(--bg-panel)" }}
              >
                <div className="mb-4">
                  <IconComponent
                    className="w-6 h-6"
                    style={{ color: "var(--process-primary)" }}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-medium text-txt-primary mb-4">
                  {cap.category}
                </h3>
                <ul className="space-y-2.5 flex-1">
                  {cap.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-txt-secondary leading-relaxed"
                    >
                      <span
                        className="inline-block w-1 h-1 rounded-full mt-2 flex-shrink-0"
                        style={{ background: "var(--process-primary)" }}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Platform features banner */}
        <div
          className="mt-12 md:mt-16 p-6 md:p-8 rounded-lg border"
          style={{
            background: "var(--bg-panel)",
            borderColor: "var(--border-default)",
          }}
        >
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase mb-4 text-process-primary">
            Platform Features
          </p>
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
            {platformFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ background: "var(--process-primary)" }}
                  aria-hidden="true"
                />
                <span className="text-sm md:text-base text-txt-secondary leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key message */}
        <p className="text-center text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mx-auto mt-12 md:mt-16">
          {keyMessage}
        </p>
      </div>
    </SectionShell>
  );
}
