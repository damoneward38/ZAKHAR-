export type TacticalTheme = 'standard' | 'amber' | 'red';

export type TechTier = 'Primitive / Stone Age' | 'Agrarian & Forging' | 'Early Industrial' | 'Electromechanical' | 'Modern Resilience';

export type TechCategory = 
  | 'Water & Sanitation'
  | 'Energy & Power'
  | 'Metallurgy & Materials'
  | 'Food & Preservation'
  | 'Medical & Health'
  | 'Mechanics & Tools'
  | 'Communications & Signals'
  | 'Chemistry & Reagents';

export interface BOMItem {
  name: string;
  quantity: string;
  purpose: string;
  salvagedAlternative?: string;
  sourceClassification?: 'Wild / Natural' | 'Scrap / Salvage' | 'Synthesized' | 'Manufactured';
}

export interface TechNode {
  id: string;
  name: string;
  category: TechCategory;
  tier: TechTier;
  summary: string;
  description: string;
  prerequisites: string[]; // tech node IDs
  unlocks: string[]; // downstream tech node IDs
  billOfMaterials: BOMItem[];
  buildSteps: string[];
  safetyWarnings: string[];
  acceptanceTests: string[];
  failureModesAndRecovery: string[];
  citations: string[];
  estimatedBuildHours: number;
  criticality: 'Essential Survival' | 'Civilizational Infrastructure' | 'Productivity Multiplier';
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: TechCategory;
  readTimeMin: number;
  authoritativeSource: string;
  summary: string;
  keyPrinciples: string[];
  stepByStepProtocol: {
    step: number;
    title: string;
    action: string;
    hazards?: string;
  }[];
  quickReferenceTable?: {
    headers: string[];
    rows: (string | number)[][];
  };
  fieldTroubleshooting: {
    symptom: string;
    rootCause: string;
    correctiveAction: string;
  }[];
  offlineVerifiedDate: string;
}

export interface Waypoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  type: 'Water' | 'Shelter' | 'Cache' | 'Hazard' | 'Rendezvous' | 'Observation';
  notes: string;
  timestamp: string;
}

export interface MapRegionPackage {
  id: string;
  name: string;
  areaKm2: number;
  resolutionMeters: number;
  sizeMb: number;
  status: 'Downloaded' | 'Available' | 'Verifying';
  featuresCount: number;
  lastUpdated: string;
}

export interface VaultNote {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  updatedAt: string;
  isPinned: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
}

export interface VaultChecklist {
  id: string;
  title: string;
  category: string;
  items: ChecklistItem[];
  updatedAt: string;
}

export interface RolloutGate {
  gateNumber: number;
  title: string;
  requirement: string;
  status: 'PASSED' | 'PENDING_HUMAN_APPROVAL' | 'BLOCKED_BY_RISK';
  evidenceCollected: string;
  verificationMethod: string;
}

export interface AuditFinding {
  service: string;
  endpoint: string;
  responseObserved: string;
  riskEvaluation: 'Normal / Expected' | 'Severe Boundary Risk' | 'Pending Verification';
  actionMandated: string;
}

export type PlantMedicalIndication =
  | 'Severe Pain & Inflammation (Analgesic)'
  | 'Wound Wash & Antiseptic'
  | 'Hemostatic / Blood Clotting'
  | 'Fever & Antipyretic'
  | 'Sedative & Sleep Aid'
  | 'Digestive Spasms & Nausea'
  | 'Respiratory Bronchodilator & Cough'
  | 'Burn & Skin Regeneration'
  | 'Nutritive Wild Food & Foraging'
  | 'Potent Poison / Lethal Hazard';

export interface PlantPreparationMethod {
  method: 'Decoction (Boiled)' | 'Cold/Hot Infusion (Steeped)' | 'Fresh Poultice (Crushed)' | 'Alcohol Tincture' | 'Infused Salve';
  partUsed: 'Leaves' | 'Inner Bark' | 'Roots' | 'Flowers' | 'Seeds' | 'Whole Aerial';
  instructions: string;
  dosage: string;
}

export interface PlantLookalike {
  toxicSpecies: string;
  toxicCommonName: string;
  distinctionKey: string;
  lethalHazard: string;
}

export interface BotanicalPlant {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  classification: 'Medicinal' | 'Edible Wild' | 'Deadly Toxic' | 'Poisonous Irritant';
  medicalIndications: PlantMedicalIndication[];
  activeCompounds: string[];
  flowerDescription: string;
  flowerColor: 'Yellow' | 'White' | 'Purple/Blue' | 'Pink/Red' | 'Green/Inconspicuous';
  leafPattern: 'Alternate' | 'Opposite' | 'Basal Rosette' | 'Whorled' | 'Compound Pinnate';
  stemAndGrowth: string;
  habitatAndSeason: string;
  preparations: PlantPreparationMethod[];
  lookalikes: PlantLookalike[];
  toxicityWarning?: string;
  emergencyAntidoteProtocol?: string;
  svgBadge: string;
}

export interface OperatorUser {
  email: string;
  role: 'admin' | 'guest';
  callsign: string;
  isAuthenticated: boolean;
  passcode?: string;
  loginTimestamp: string;
  permissions: string[];
}

export interface PricingTier {
  id: 'pioneer' | 'engineer' | 'commander';
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  billingPeriod: string;
  popular?: boolean;
  features: string[];
  description: string;
  badge?: string;
  buttonText: string;
}

export interface CheckoutOrder {
  orderId: string;
  tierId: string;
  tierName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentMethod: 'sandbox_card' | 'sandbox_paypal' | 'sandbox_crypto';
  licenseKey: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
  cardNumberMasked?: string;
}

export interface FiledArchiveItem {
  id: string;
  title: string;
  category: 'functions' | 'ideas' | 'designs' | 'partner_notes';
  content: string;
  tags: string[];
  createdAt: string;
  codeSnippet?: string;
}

export interface CustomSurvivalKit {
  id: string;
  title: string;
  category: TechCategory | 'Community Survival' | 'Custom Infrastructure';
  tier: TechTier;
  sourceFileName?: string;
  sourceFileType?: string;
  summary: string;
  infrastructureBlueprint: string;
  billOfMaterials: BOMItem[];
  buildSteps: string[];
  fieldTips: string[];
  safetyWarnings: string[];
  aiKnowledgeSummary: string;
  createdAt: string;
  isPaywalledTier3: boolean;
  authorCallsign: string;
}

