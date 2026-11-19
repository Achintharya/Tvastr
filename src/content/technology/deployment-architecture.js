export const deploymentArchitectureContent = {
  id: "deployment-architecture",
  type: "deployment-architecture",
  title: "Deployment Architecture",
  subtitle: "Edge-native, on-premise deployment with offline capability for industrial environments.",
  body: "Tvastr is installed on a Windows machine inside the plant network. Inspection, reasoning, analytics and storage run on the local network. By default, internet is used only for license renewal and software updates; an optional cloud classification assist stays disabled unless the plant enables it.",
  infrastructure: {
    database: {
      title: "SQL Integration",
      description: "Native SQL Server integration with connection pooling and automatic schema migration."
    },
    api: {
      title: "API Architecture",
      description: "FastAPI REST server with WebSocket real-time updates, OpenAPI documentation, and license-based feature gating."
    },
    network: {
      title: "Network Requirements",
      description: "Runs on the plant's local network."
    }
  },
  coreProperties: [
    "Edge-native: processing inside the plant firewall by default",
    "Offline-capable: inspection continues without internet within the license's offline allowance",
    "Automatic start: launches with Windows and restarts automatically on failure",
    "Local storage: inspection images and records are stored on the plant's own server",
    "API-first: standard integration protocols"
  ],
  keyMessage: "Industrial deployment architecture, installed inside the plant. Not cloud software adapted for factory use."
}
