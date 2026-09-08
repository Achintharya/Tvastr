// Homepage sections
import { HeroSection } from '../components/sections/HeroSection'
import { BuiltForManufacturingSection } from '../components/sections/BuiltForManufacturingSection'
import { IndustryProblemSection } from '../components/sections/IndustryProblemSection'
import { PlatformOverviewSection } from '../components/sections/PlatformOverviewSection'
import { InspectionVisibilitySection } from '../components/sections/InspectionVisibilitySection'
import { PlatformCapabilitiesSection } from '../components/sections/PlatformCapabilitiesSection'
import { DeploymentSection } from '../components/sections/DeploymentSection'
import { ContactSection } from '../components/sections/ContactSection'

// Technology page sections
import { TechnologyHeroSection } from '../components/sections/technology/TechnologyHeroSection'
import { CoreArchitectureSection } from '../components/sections/technology/CoreArchitectureSection'
import { PerceptionEngineSection } from '../components/sections/technology/PerceptionEngineSection'
import { SignalReasoningSection } from '../components/sections/technology/SignalReasoningSection'
import { EnergyReasoningSection } from '../components/sections/technology/EnergyReasoningSection'
import { IndustrialMemorySection } from '../components/sections/technology/IndustrialMemorySection'
import { CognitionRuntimeSection } from '../components/sections/technology/CognitionRuntimeSection'
import { ProcessIntelligenceSection } from '../components/sections/technology/ProcessIntelligenceSection'
import { DeploymentArchitectureSection } from '../components/sections/technology/DeploymentArchitectureSection'
import { TechnologyCTASection } from '../components/sections/technology/TechnologyCTASection'

export const sectionRegistry = {
  // Homepage
  'hero': HeroSection,
  'built-for-manufacturing': BuiltForManufacturingSection,
  'industry-problem': IndustryProblemSection,
  'platform-overview': PlatformOverviewSection,
  'inspection-visibility': InspectionVisibilitySection,
  'platform-capabilities': PlatformCapabilitiesSection,
  'deployment': DeploymentSection,
  'contact': ContactSection,

  // Technology page
  'technology-hero': TechnologyHeroSection,
  'core-architecture': CoreArchitectureSection,
  'perception-engine': PerceptionEngineSection,
  'signal-reasoning': SignalReasoningSection,
  'energy-reasoning': EnergyReasoningSection,
  'industrial-memory': IndustrialMemorySection,
  'cognition-runtime': CognitionRuntimeSection,
  'process-intelligence': ProcessIntelligenceSection,
  'deployment-architecture': DeploymentArchitectureSection,
  'technology-cta': TechnologyCTASection,
}
