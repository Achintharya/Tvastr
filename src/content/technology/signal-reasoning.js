export const signalReasoningContent = {
  id: "signal-reasoning",
  type: "signal-reasoning",
  title: "Signal-Based Reasoning",
  subtitle: "Multiple independent signal channels collaborate to produce explainable defect classifications. No single model has final authority.",
  body: "The reasoning layer receives feature vectors from the perception engine and applies physics-grounded threshold rules across five signal categories. Classification requires agreement between multiple signal channels — a design that produces traceable, auditable decisions rather than opaque confidence scores.",
  signalChannels: [
    {
      name: "Texture Signals",
      description: "Surface pattern analysis detecting irregular textures associated with porosity, roughness, and inclusions.",
      interpretation: "High texture variance combined with low homogeneity indicates surface irregularity consistent with defects."
    },
    {
      name: "Geometry Signals",
      description: "Shape analysis identifying crack morphology and structural deformation through contour-based metrics.",
      interpretation: "Geometric irregularities indicate linear defects such as cracks."
    },
    {
      name: "Edge Signals",
      description: "Boundary identification measuring edge characteristics to identify defect boundaries and crack paths.",
      interpretation: "High edge density indicates defect boundaries, crack propagation, or inclusion interfaces."
    },
    {
      name: "Blob Signals",
      description: "Defect density analysis for porosity and inclusion detection across casting regions.",
      interpretation: "Multiple small regions indicate porosity. Larger isolated regions suggest blow holes or cavities."
    },
    {
      name: "Intensity Signals",
      description: "Grayscale intensity analysis for cavity and void detection through statistical assessment.",
      interpretation: "Low mean intensity with high deviation indicates dark cavities or subsurface voids."
    }
  ],
  fusionArchitecture: {
    title: "Multi-Signal Fusion",
    description: "Final classification uses weighted fusion across all signal sources plus agreement validation.",
    principle: "Signal-based reasoning is the primary classifier. Neural networks provide supporting evidence. Agreement between channels validates consistency."
  },
  classificationRequirement: "Every defect classification requires agreement across multiple independent signal channels. Insufficient evidence triggers manual review — never forced classification.",
  explainability: [
    "Every classification produces a signal evidence summary",
    "Engineers can trace which signals triggered the decision",
    "Disagreement between channels is logged and flagged",
    "Threshold adjustments are auditable and documented",
    "No hidden weights — all rules are physics-grounded"
  ],
  keyMessage: "Decisions are made by signal agreement — not model confidence. Every classification is explainable, traceable, and auditable."
}
