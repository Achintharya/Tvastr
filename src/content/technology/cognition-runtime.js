export const cognitionRuntimeContent = {
  id: "cognition-runtime",
  type: "cognition-runtime",
  title: "Inspection Runtime",
  subtitle: "Deterministic pipeline orchestration with health monitoring, telemetry, and edge-native execution.",
  body: "The Tvastr runtime orchestrates the full inspection pipeline — from image capture through signal extraction, reasoning, decision generation, and persistence. Every execution is deterministic, health-monitored, and produces structured telemetry for debugging, audit, and operational analysis.",
  runtimeComponents: [
    {
      name: "Pipeline Orchestration",
      description: "Sequential execution of multiple pipeline stages with dependency management, error handling, and graceful degradation. Each stage produces independently loggable outputs.",
      characteristics: [
        "Deterministic stage execution order",
        "Stage-level health monitoring",
        "Graceful degradation on component failure"
      ]
    },
    {
      name: "Health Monitoring",
      description: "Three-tier health status system that tracks pipeline component availability and signal quality in real time.",
      states: [
        { state: "OK", description: "All components operational. Full reasoning capability." },
        { state: "DEGRADED", description: "Partial component failure. Reduced confidence, flagged outputs." },
        { state: "FAILED", description: "Critical component unavailable. Pipeline halted, operator notified." }
      ]
    },
    {
      name: "Telemetry & Logging",
      description: "Structured JSONL logging for every pipeline execution — complete signal traces, decisions, and timing data for debugging and audit.",
      logs: [
        "Run logs: Full pipeline execution trace (monthly rotation)",
        "Signal traces: Detailed feature extraction data (daily rotation)",
        "Feedback logs: Operator corrections and overrides (permanent)"
      ]
    },
    {
      name: "API & Integration Layer",
      description: "REST API layer for analytics, quality frameworks, process intelligence, and system management.",
      interfaces: [
        "REST API: Analytics, quality, process, SPC, and decision endpoints",
        "WebSocket: Real-time manufacturing updates and alerts",
        "SQL Integration: Direct database read/write with connection pooling",
        "ERP Integration: Read-only production context from the plant ERP"
      ]
    },
    {
      name: "Edge Execution",
      description: "Inspection processing executes on local hardware inside the plant network. A licensed installation keeps working without internet within its offline allowance.",
      characteristics: [
        "Inference runs on the local machine",
        "Continues without internet within the license's offline allowance",
        "Automatic start with Windows and restart on failure"
      ]
    }
  ],
  executionFlow: [
    "Request received (image + manufacturing context)",
    "Quality validation and pre-processing",
    "Object detection and patch generation",
    "Signal feature extraction",
    "Multi-signal classification and fusion",
    "Decision generation (Accept / Review / Reject)",
    "Memory persistence and cluster matching",
    "Report generation and telemetry logging",
    "Response returned with full signal evidence"
  ],
  keyMessage: "The runtime is deterministic and health-monitored. Every inspection produces consistent results given the same inputs."
}
