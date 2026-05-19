import { useRef, useLayoutEffect } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { industryProblemContent } from "@/content/homepage/industry-problem";
import { useSectionReveal } from "../../hooks/useSectionReveal";
import { gsap, gsapContext, ScrollTrigger } from "../../animation/gsap";
import { useReducedMotionContext } from "../../animation/MotionConfig";

export function IndustryProblemSection() {
  const { id, title, subtitle, body, problems } = industryProblemContent;
  const sectionRef = useRef(null);
  const { reducedMotion } = useReducedMotionContext();
  useSectionReveal(sectionRef);

  // Parallax reveal: section rises up from below as user scrolls past hero
  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsapContext(() => {
      gsap.fromTo(
        sectionRef.current,
        { yPercent: 30 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top 60%",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      const el = sectionRef.current;
      if (el) {
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === el || (t.trigger && el.contains(t.trigger)))
          .forEach((t) => t.kill());
      }
    };
  }, [reducedMotion]);

  return (
    <SectionShell ref={sectionRef} id={id}>
      <SectionHeader title={title} subtitle={subtitle} eyebrow="The Problem" />

      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      {/* Problem cards — 2x3 stone-tile grid (Cohere product-card pattern) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle border border-border-subtle">
        {problems.map((problem, i) => (
          <div key={i} data-reveal-item className="p-8 bg-bg-primary">
            <p
              className="font-mono text-[11px] tracking-[0.24em] uppercase mb-4"
              style={{ color: "var(--signal-glow)" }}
            >
              {String(i + 1).padStart(2, "0")} /{" "}
              {String(problems.length).padStart(2, "0")}
            </p>
            <h4 className="text-lg font-medium text-txt-primary leading-tight mb-3">
              {problem.title}
            </h4>
            <p className="text-sm text-txt-secondary leading-relaxed">
              {problem.description}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
