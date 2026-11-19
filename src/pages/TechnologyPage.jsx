import { useEffect } from "react";

import { useDocumentHead } from "../hooks/useDocumentHead";
import { sectionRegistry } from "../config/sectionRegistry";
import {
  technologyHeroSection,
  technologyCtaSection,
  technologyTabs,
} from "../config/technologySections";
import { TechnologySubNav } from "../components/sections/technology/TechnologySubNav";
import { useTechnologyTabs } from "../hooks/useTechnologyTabs";
import { ScrollTrigger } from "../animation/gsap";

function renderSection({ type, id }) {
  const SectionComponent = sectionRegistry[type];
  if (!SectionComponent) {
    console.warn(`Section component not found for type: ${type}`);
    return null;
  }
  return <SectionComponent key={id} />;
}

export function TechnologyPage() {
  useDocumentHead(
    "Technology | Tvastr Industrial Intelligence",
    "Learn how Tvastr works: signal-based inspection pipeline, process intelligence, SPC monitoring, and deployment architecture.",
    "https://tvastr.co/technology",
  );

  const { activeTab, select } = useTechnologyTabs();

  // Sections mount hidden (display:none) when their tab is inactive, so
  // ScrollTrigger positions must be recalculated after every tab switch.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [activeTab]);

  return (
    <div id="technology-page" className="bg-bg-primary">
      {renderSection(technologyHeroSection)}

      <TechnologySubNav activeTab={activeTab} onSelect={select} />

      {technologyTabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`technology-tabpanel-${tab.id}`}
          aria-labelledby={`technology-tab-${tab.id}`}
          style={{ display: tab.id === activeTab ? "block" : "none" }}
        >
          {tab.sections.map(renderSection)}
        </div>
      ))}

      {renderSection(technologyCtaSection)}
    </div>
  );
}
