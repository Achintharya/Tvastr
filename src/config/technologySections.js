// Technology page structure: hero, tabbed subsection groups, closing CTA.
// Every section type appears in exactly one tab group.
export const technologyHeroSection = { type: "technology-hero", id: "technology-hero" };
export const technologyCtaSection = { type: "technology-cta", id: "technology-cta" };

export const technologyTabs = [
  {
    id: "perception-and-signals",
    label: "Perception and Signals",
    sections: [
      { type: "core-architecture", id: "core-architecture" },
      { type: "perception-engine", id: "perception-engine" },
      { type: "signal-reasoning", id: "signal-reasoning" },
    ],
  },
  {
    id: "memory-and-runtime",
    label: "Memory and Runtime",
    sections: [
      { type: "industrial-memory", id: "industrial-memory" },
      { type: "cognition-runtime", id: "cognition-runtime" },
    ],
  },
  {
    id: "intelligence-and-deployment",
    label: "Intelligence and Deployment",
    sections: [
      { type: "process-intelligence", id: "process-intelligence" },
      { type: "deployment-architecture", id: "deployment-architecture" },
      { type: "visualizer", id: "visualizer" },
    ],
  },
];
