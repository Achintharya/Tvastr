export const perceptionEngineContent = {
  id: "perception-engine",
  type: "perception-engine",
  title: "Perception Engine",
  subtitle: "Multi-stage signal capture and feature extraction. Vision is one component of a broader reasoning architecture.",
  body: "The perception engine processes casting images through quality validation, object detection, dense patch analysis, and signal extraction. It does not produce final decisions — it produces structured feature vectors that flow into the reasoning layer for explainable classification.",
  stages: [
    {
      name: "Quality Validation",
      description: "Pre-processing verification for image quality — blur detection, brightness range, contrast adequacy. Flags degradation without blocking production.",
      output: "Image quality score and degradation flags"
    },
    {
      name: "Object Localization",
      description: "Neural detection for casting localization and defect region proposals. Serves as proposal generator — not final classifier.",
      output: "Bounding box proposals with confidence scores"
    },
    {
      name: "Dense Patch Analysis",
      description: "Sliding window analysis across the full casting surface with overlapping regions for comprehensive coverage.",
      output: "Patch-level confidence scores across casting image"
    },
    {
      name: "Signal Feature Extraction",
      description: "Multi-dimensional feature extraction capturing surface texture, geometric properties, edge characteristics, defect density, and intensity patterns.",
      output: "Multi-dimensional signal feature vectors per patch"
    },
    {
      name: "Topology & Anomaly Scoring",
      description: "Spatial distribution analysis of defect proposals across casting zones. Identifies cluster density, spread patterns, and anomalous concentrations.",
      output: "Topology scores, cluster maps, and anomaly flags"
    }
  ],

  designPrinciple: "The perception engine extracts — it does not decide. Decisions are made by the reasoning layer, which has access to all signal evidence and can explain every classification.",
  keyMessage: "Vision detection is a signal source. Not the final authority. Multiple independent signals must converge before classification occurs."
}
