import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { industrialMemoryContent } from "@/content/technology/industrial-memory";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function IndustrialMemorySection() {
  const { title, subtitle, body, subsystems, keyMessage } =
    industrialMemoryContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="industrial-memory">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        eyebrow="Memory System"
      />

      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      {/* Subsystems — vertical stack with details */}
      <div className="space-y-8 mb-16">
        {subsystems.map((subsystem, i) => (
          <div
            key={i}
            data-reveal-item
            className="p-6 md:p-8 rounded-lg border"
            style={{
              background: "var(--bg-primary)",
              borderColor: "var(--border-subtle)",
            }}
          >
            {/* Subsystem header */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(0,60,51,0.1)" }}
              >
                <span
                  className="font-mono text-sm font-bold"
                  style={{ color: "var(--process-primary)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg md:text-xl font-bold text-txt-primary mb-2">
                  {subsystem.name}
                </h4>
                <p className="text-sm md:text-base text-txt-secondary leading-relaxed">
                  {subsystem.description}
                </p>
              </div>
            </div>

            {/* Process steps or storage details */}
            {subsystem.process && (
              <div className="mt-6 pl-14">
                <p
                  className="font-mono text-[10px] tracking-[0.24em] uppercase mb-3"
                  style={{ color: "var(--telemetry-primary)" }}
                >
                  Process Flow
                </p>
                <ul className="space-y-2">
                  {subsystem.process.map((step, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-sm text-txt-secondary"
                    >
                      <span
                        className="font-mono text-xs mt-0.5"
                        style={{ color: "var(--process-primary)" }}
                      >
                        →
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {subsystem.storage && (
              <div className="mt-6 pl-14">
                <p
                  className="font-mono text-[10px] tracking-[0.24em] uppercase mb-3"
                  style={{ color: "var(--telemetry-primary)" }}
                >
                  Storage Schema
                </p>
                <ul className="space-y-2">
                  {subsystem.storage.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-sm text-txt-secondary"
                    >
                      <span
                        className="font-mono text-xs mt-0.5"
                        style={{ color: "var(--process-primary)" }}
                      >
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {subsystem.entities && (
              <div className="mt-6 pl-14">
                <p
                  className="font-mono text-[10px] tracking-[0.24em] uppercase mb-3"
                  style={{ color: "var(--telemetry-primary)" }}
                >
                  Intelligence Entities
                </p>
                <ul className="space-y-2">
                  {subsystem.entities.map((entity, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-sm text-txt-secondary"
                    >
                      <span
                        className="font-mono text-xs mt-0.5"
                        style={{ color: "var(--process-primary)" }}
                      >
                        •
                      </span>
                      <span>{entity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key message — highlighted callout */}
      <div
        className="p-8 md:p-10 rounded-2xl"
        style={{
          background: "rgba(0,60,51,0.05)",
          border: "1px solid rgba(0,60,51,0.1)",
        }}
      >
        <p className="text-base md:text-lg text-txt-secondary leading-relaxed text-center max-w-3xl mx-auto">
          {keyMessage}
        </p>
      </div>
    </SectionShell>
  );
}
