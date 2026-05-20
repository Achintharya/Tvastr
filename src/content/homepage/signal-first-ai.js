export const signalFirstAIContent = {
  id: "signal-first-ai",
  type: "signal-first-ai",
  title: "Signal-First Reasoning. Not Detection-Only AI.",
  subtitle: "Tvastr doesn't rely on neural network confidence scores alone. Multiple independent signals must agree before making decisions.",
  body: "Most inspection AI uses one model to produce confidence scores. Tvastr uses multiple independent signal channels — texture, geometry, edges, topology — where each provides its own evidence. Decisions come from weighted agreement between signals, producing explainable classifications.",
  signalSystems: [
    {
      name: "Texture Analysis",
      description: "Surface pattern analysis to detect irregular textures."
    },
    {
      name: "Geometry Reasoning",
      description: "Shape analysis for cracks and dimensional changes."
    },
    {
      name: "Edge & Boundary Detection",
      description: "Edge analysis for defect boundaries and crack paths."
    },
    {
      name: "Topology Scoring",
      description: "Spatial analysis of defect clusters across casting zones."
    },
    {
      name: "Anomaly Detection",
      description: "Statistical detection of anomalies in intensity, density, and surface patterns."
    },
    {
      name: "Agreement & Fusion",
      description: "Weighted consensus across signals. Decisions need multi-signal agreement, not single-model confidence."
    }
  ],
  differentiators: [
    "Multiple signals must agree for classification",
    "Every decision has a traceable reasoning path",
    "Physics-based thresholds replace opaque model weights",
    "Signal disagreement triggers review, not forced decisions",
    "Root cause analysis connects defects to process behavior"
  ],
  keyMessage: "Explainable signal-first reasoning means engineers can audit, understand, and improve every decision the system makes."
}
