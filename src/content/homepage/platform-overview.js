export const platformOverviewContent = {
  id: "platform-overview",
  type: "platform-overview",
  
  title: "The Tvastr Cortex Platform",
  
  subtitle: "Manufacturing requires different kinds of intelligence at different levels.",
  
  body: "Operational teams need real-time visibility. Engineers need AI-assisted investigation. Executives need strategic insight. Rather than forcing one application to do everything, Tvastr is built as specialized AI Cortexes that work together on one platform.",
  
  cortexes: [
    {
      id: "piras",
      name: "PIRAS",
      role: "Primary Operational Workspace",
      description: "Real-time operational interface for production teams. Unifies inspection intelligence, rejection analysis, process analytics, SPC monitoring, quality frameworks, and manufacturing dashboards into one workspace.",
      route: "/products/piras",
      visualEmphasis: "primary"
    },
    {
      id: "vajra",
      name: "Vajra Cortex",
      role: "AI Reasoning Layer",
      description: "Conversational AI reasoning engine providing natural language investigations, evidence-backed root cause analysis, and voice-enabled manufacturing intelligence.",
      route: "/products/vajra-cortex",
      visualEmphasis: "standard"
    },
    {
      id: "executive-mis",
      name: "Executive MIS Cortex",
      role: "Executive Intelligence Platform",
      description: "Separate executive dashboard providing C-suite visibility across multiple plants with real-time KPIs, business intelligence, and strategic decision support.",
      route: "/products/executive-mis-cortex",
      visualEmphasis: "standard"
    }
  ],
  
  keyMessage: "Three specialized Cortexes. One integrated platform. Complete manufacturing intelligence from shop floor to boardroom."
}
