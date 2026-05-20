export const signalFirstAIContent = {
  id: "signal-first-ai",
  type: "signal-first-ai",
  title: "Signal-First Reasoning. Not Detection-Only AI.",
  subtitle: "Tvastr does not rely solely on neural network confidence scores. Multiple independent signal systems must agree before decisions are made.",
  body: "Standard inspection AI uses a single deep learning model to produce confidence scores. Tvastr operates differently: raw inspection data is decomposed into independent signal channels — texture, geometry, edge patterns, topology — and each channel produces its own evidence. Final decisions emerge from weighted agreement between multiple signal systems, producing explainable, physics-grounded classifications.",
  signalSystems: [
    {
      name: "Texture & Surface Analysis",
      description: "Surface pattern and edge analysis using Local Binary Patterns and contour-based geometry to detect irregular textures and crack morphology."
    },
    {
      name: "Topology & Spatial Reasoning",
      description: "Spatial distribution analysis of defect clusters and anomaly identification across casting zones."
    },
    {
      name: "Anomaly Detection",
      description: "Statistical anomaly identification in intensity, blob density, and surface uniformity."
    },
    {
      name: "Signal Agreement & Fusion",
      description: "Weighted consensus across all signal channels. Decisions require multi-signal agreement — not single-model confidence."
    }
  ],
  differentiators: [
    "Multiple independent signals must converge for classification",
    "Every decision produces a traceable reasoning path",
    "Signal disagreement triggers human review — not forced classification"
  ],
  keyMessage: "Explainable signal-first reasoning means engineers can audit, understand, and improve every decision the system makes."
}
