import { PricingTier } from '../types';

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'pioneer',
    name: 'Scout Survival Basic',
    tagline: 'Puts essential survival tech in the hands of every citizen',
    price: 19,
    originalPrice: 39,
    billingPeriod: 'One-time Field License',
    popular: false,
    description: 'Affordable, rugged offline survival knowledge and field calculators. Built to ensure cost is never a barrier to staying alive.',
    badge: 'ESSENTIAL SURVIVAL',
    buttonText: 'Deploy Scout License ($19)',
    features: [
      '250 Civilizational Fundamental Tech Blueprints',
      'Interactive Botanical Identifier (Medicinal, Edible & Toxic)',
      'Essential Field Calculators (Chlorine dosing, altitude boiling, wire drop)',
      'Offline Solar Noon Compass & Grid Coordinates',
      '100% Offline Air-Gapped Standalone Operation',
      'ZAKHAR AI Field Assistant (Local heuristic engine)',
      'Lifetime offline updates for Scout fundamentals'
    ]
  },
  {
    id: 'engineer',
    name: 'Field Engineer & Commander',
    tagline: 'Complete self-reliance, power generation, and voice AI',
    price: 49,
    originalPrice: 89,
    billingPeriod: 'One-time Field License',
    popular: true,
    description: 'The definitive tactical setup. Full civilizational extension tree, free earth energy schematics, and continuous hands-free voice AI.',
    badge: 'MOST POPULAR // RECOMMENDED',
    buttonText: 'Deploy Commander License ($49)',
    features: [
      'Everything in Scout Survival Basic',
      'Complete 500-Extension Dependency Tech Tree (Bloomery iron, Woodgas, Planté batteries, Pelton hydro)',
      'Galvanic Ground Battery Blueprints (Copper + Zinc, Joule Thief step-up, deep burial specs)',
      'Continuous Hands-Free Two-Way Voice Conversation Mode',
      'Multi-Mode Fast AI Dialogue (Rapid chat, blueprint, and triage)',
      'Encrypted Personal Vault with local export & backup',
      'START Wilderness Triage & Rule of Nines Parkland Burn Calculator',
      'Radio Horizon Line-of-Sight, Morse Flasher & PACE Comms Planner'
    ]
  },
  {
    id: 'commander',
    name: 'Redoubt Master & Outpost',
    tagline: 'Civilizational continuity for families, homesteads, and communities',
    price: 99,
    originalPrice: 199,
    billingPeriod: 'One-time Field License',
    popular: false,
    description: 'Master operating system package for survival communities and self-sufficient outposts with file-to-kit synthesis, automated knowledge injection, and custom infrastructure carvers.',
    badge: 'COMMUNITY & REDOUBT',
    buttonText: 'Deploy Master Redoubt ($99)',
    features: [
      'Everything in Field Engineer & Commander',
      '⭐ Tier 3 Exclusive: File-to-Survival-Kit AI Ingestion Engine (Upload any document to forge full survival kits & SOPs)',
      '⭐ Custom Infrastructure Carving: Interject personal survival lore (dried meats, fallen tree soil composting, off-grid water)',
      '⭐ AI Brain Memory Synthesis: Ingested kits automatically sync into ZAKHAR AI knowledge base',
      'Offline Air-Gapped Master Data Package (Full exportable database)',
      'Level 5 Root Administrator clearance with unlimited operator callsigns',
      'Vernam One-Time Pad (OTP) Shannon Entropy cipher generation engine',
      'Tactical MGRS Multi-Station Map Grid Coordinator',
      'Printable High-Density Emergency Field Survival SOP Manual',
      'Priority offline knowledge base updates & lifetime license key'
    ]
  }
];

export const SANDBOX_TEST_CARDS = [
  {
    brand: 'Visa (Sandbox Success)',
    number: '4242 •••• •••• 4242',
    rawNumber: '4242424242424242',
    exp: '12/28',
    cvc: '313',
    outcome: 'Approved - Instant Field License Generated'
  },
  {
    brand: 'Mastercard (Sandbox Success)',
    number: '5555 •••• •••• 4444',
    rawNumber: '5555555555554444',
    exp: '08/29',
    cvc: '777',
    outcome: 'Approved - Level 5 Clearance Unlocked'
  },
  {
    brand: 'Test Decline Simulation',
    number: '4000 •••• •••• 0002',
    rawNumber: '4000000000000002',
    exp: '05/27',
    cvc: '999',
    outcome: 'Declined - Simulates card refusal handling'
  }
];
