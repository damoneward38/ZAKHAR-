import { KnowledgeArticle } from '../types';

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'emergency-water-purification',
    title: 'Emergency Water Purification & Disinfection Protocols',
    category: 'Water & Sanitation',
    readTimeMin: 7,
    authoritativeSource: 'WHO Guidelines for Drinking-Water Quality / CDC Emergency Water Protocols',
    summary: 'Standardized operational procedures for chemical chlorination, altitude boiling kinetics, flocculation of turbid water, and SODIS solar ultraviolet pasteurization.',
    keyPrinciples: [
      'Turbid (cloudy) water shields pathogens from chemicals and UV; coarse filtration or flocculation must ALWAYS precede chemical disinfection.',
      'Boiling kills 100% of biological pathogens (viruses, bacteria, cysts including Cryptosporidium and Giardia); 1 minute at rolling boil, 3 minutes above 2000m (6500ft).',
      'Chlorine requires contact time (minimum 30 minutes) and temperature compensation (double time if water is <10°C).'
    ],
    stepByStepProtocol: [
      {
        step: 1,
        title: 'Coarse Straining & Turbidity Reduction',
        action: 'Pour raw water through a clean cotton bandana, folded cloth, or sand cone into a clean settling bucket. Allow heavy sediment to settle for 60 minutes.',
        hazards: 'Straining removes silt but ZERO microbial pathogens.'
      },
      {
        step: 2,
        title: 'Chemical Chlorination Dosing (Unscented 5.25% - 6% Bleach)',
        action: 'For CLEAR water: Add 2 drops (0.1 mL) per 1 liter (8 drops per gallon). For CLOUDY/COLD water: Add 4 drops (0.2 mL) per 1 liter (16 drops per gallon). Mix vigorously.',
        hazards: 'Use ONLY unscented sodium hypochlorite. Never use splashless or scented laundry bleaches.'
      },
      {
        step: 3,
        title: 'Mandatory 30-Minute Quench Contact Period',
        action: 'Seal container and let stand in shade for 30 minutes (60 minutes if water is freezing). Sniff water: A faint chlorine odor must be present. If absent, repeat dose and wait another 15 minutes.',
        hazards: 'Consuming water before 30 minutes risks ingesting viable Giardia or viral particles.'
      },
      {
        step: 4,
        title: 'Alternate Solar Disinfection (SODIS) Protocol',
        action: 'Fill clean, clear PET plastic bottles (under 2L capacity) completely. Shake 20 seconds for oxygenation. Lay flat on corrugated metal roof or foil in direct unobstructed sunlight for 6 full hours (or 2 consecutive days if 50% overcast).',
        hazards: 'Bottles must be PET (#1 recyclable), not PVC or colored glass.'
      }
    ],
    quickReferenceTable: {
      headers: ['Disinfection Method', 'Clear Water Dose / Time', 'Cloudy / Cold Dose / Time', 'Target Pathogens Killed'],
      rows: [
        ['Rolling Boil', '1 full minute', '3 full minutes (at >2000m altitude)', '100% of Bacteria, Viruses, Protozoa & Cysts'],
        ['Bleach (5.25% NaOCl)', '2 drops / Liter (30 min)', '4 drops / Liter (60 min)', 'Bacteria & Viruses; Poor against Cryptosporidium cysts'],
        ['2% Tincture of Iodine', '5 drops / Liter (30 min)', '10 drops / Liter (60 min)', 'Bacteria & Viruses; Moderate against Giardia'],
        ['SODIS Solar UV-A', '6 hours direct sunlight', '2 full days (cloudy)', 'Bacteria, Viruses, and Vibrio cholerae']
      ]
    },
    fieldTroubleshooting: [
      {
        symptom: 'Water smells strongly of rotten eggs (H2S)',
        rootCause: 'Anaerobic sulfur-reducing bacteria in stagnation.',
        correctiveAction: 'Aerate vigorously by pouring between two clean buckets 10 times, then pass through activated charcoal retort bed.'
      },
      {
        symptom: 'No chlorine smell after 30-minute dose',
        rootCause: 'High organic load consumed entire free chlorine residual (chlorine demand exceeded).',
        correctiveAction: 'Double the bleach dosage, shake, and wait another 30 minutes until faint chlorine scent remains.'
      }
    ],
    offlineVerifiedDate: '9 Oct 2026'
  },
  {
    id: 'burn-rule-of-nines-triage',
    title: 'Severe Burn Evaluation & Parkland Resuscitation Protocol',
    category: 'Medical & Health',
    readTimeMin: 8,
    authoritativeSource: 'American Burn Association / US DoD Joint Trauma System Clinical Practice Guidelines',
    summary: 'Rapid percentage total body surface area (TBSA) calculation using Wallace Rule of Nines, inhalation injury indicators, and intravenous fluid resuscitation calculation.',
    keyPrinciples: [
      'Superficial 1st-degree burns (erythema/sunburn without blisters) are NOT included in % TBSA calculation.',
      'Only 2nd-degree (partial-thickness, blistering, moist red) and 3rd-degree (full-thickness, leathery, painless, white/charred) burns count toward fluid resuscitation volume.',
      'Adults with >20% TBSA burns rapidly enter hypovolemic burn shock due to systemic capillary leak syndrome and require prompt fluid replacement.'
    ],
    stepByStepProtocol: [
      {
        step: 1,
        title: 'Immediate Scene Safety & Extinguishment',
        action: 'Stop burning process: Smother flames with heavy wool blanket, roll on ground, or flush with cool clean water for 2-5 minutes maximum. Remove smoldering clothing immediately, but do NOT tear clothing stuck to charred skin.',
        hazards: 'NEVER apply ice or ice-water to large burns (>10% TBSA); it triggers lethal hypothermia and vasoconstrictive tissue death.'
      },
      {
        step: 2,
        title: 'Calculate % TBSA via Wallace Rule of Nines',
        action: 'Head & Neck = 9%, Each Entire Arm = 9% (4.5% anterior / 4.5% posterior), Anterior Torso (Chest + Abdomen) = 18%, Posterior Torso (Back + Buttocks) = 18%, Each Entire Leg = 18% (9% anterior / 9% posterior), Perineum / Genitalia = 1%. Alternatively: Patient\'s palm + fingers = 1% TBSA for irregular scattered burn patches.',
        hazards: 'Overestimating TBSA leads to fluid overload pulmonary edema; underestimating leads to renal failure.'
      },
      {
        step: 3,
        title: 'Parkland Fluid Resuscitation Formula (First 24 Hours)',
        action: 'Total 24h Lactated Ringer\'s (mL) = 4 mL × Patient Weight (kg) × % TBSA. Give 50% of this total volume during the FIRST 8 HOURS from TIME OF BURN (not time of medical arrival). Give remaining 50% over the subsequent 16 hours.',
        hazards: 'Monitor urine output strictly: Target 0.5 mL/kg/hour in adults (approx 30-50 mL/hour). Adjust infusion rate up or down based on hourly urine volume.'
      },
      {
        step: 4,
        title: 'Dressing & Infection Prevention',
        action: 'Cover burn wounds with clean, dry, sterile non-adherent cotton sheets. Keep patient warm with blankets.',
        hazards: 'Never apply butter, grease, toothpaste, or unverified folk pastes to open burn wounds.'
      }
    ],
    quickReferenceTable: {
      headers: ['Anatomical Region', 'Adult % TBSA', 'Child (<5 yr) % TBSA', 'Clinical Notes'],
      rows: [
        ['Entire Head & Neck', '9%', '18%', 'Children possess disproportionately larger cranial surface area'],
        ['Anterior Trunk (Chest/Abdomen)', '18%', '18%', 'Circumferential burns can restrict thoracic respiratory expansion'],
        ['Posterior Trunk (Back/Gluteal)', '18%', '18%', 'High risk for pressure necrosis; pad with sterile dressings'],
        ['Each Entire Upper Limb', '9% (each)', '9% (each)', '4.5% anterior forearm/arm, 4.5% posterior'],
        ['Each Entire Lower Limb', '18% (each)', '14% (each)', '9% anterior thigh/calf, 9% posterior leg'],
        ['Groin / Genitalia', '1%', '1%', 'Critical zone; mandatory catheterization if swollen']
      ]
    },
    fieldTroubleshooting: [
      {
        symptom: 'Urine output drops below 20 mL/hour despite fluid delivery',
        rootCause: 'Hypovolemia and third-space plasma loss exceeding estimated rate.',
        correctiveAction: 'Increase IV fluid delivery rate by 25% for the next hour; verify catheter is not kinked.'
      },
      {
        symptom: 'Stridor, hoarse voice, singed facial hair, carbonaceous black sputum',
        rootCause: 'Thermal inhalation airway burn with impending glottic edema.',
        correctiveAction: 'Secure definitive airway (endotracheal tube or emergency cricothyroidotomy) immediately before vocal cords swell shut.'
      }
    ],
    offlineVerifiedDate: '9 Oct 2026'
  },
  {
    id: 'radio-communications-pace-plan',
    title: 'Off-Grid Radio Communications & PACE Operational Plan',
    category: 'Communications & Signals',
    readTimeMin: 9,
    authoritativeSource: 'US Army Field Manual FM 24-18 / ARRL Emergency Communications Handbook',
    summary: 'Practical tactical guide to line-of-sight propagation, battery preservation, wilderness emergency radio monitoring windows, and the Primary, Alternate, Contingency, Emergency (PACE) framework.',
    keyPrinciples: [
      'Line-of-Sight horizon distance is governed by antenna heights: $d \\approx 3.57(\\sqrt{h_1} + \\sqrt{h_2})$ km. Gaining 30 meters of elevation expands radio coverage radius by 20+ km.',
      'Radio transmission consumes 10x to 20x more power than receiving; observe strict 3-minute transmission limits and pre-arranged schedule windows (Scheds).',
      'Maintain standardized frequency discipline on recognized emergency calling frequencies.'
    ],
    stepByStepProtocol: [
      {
        step: 1,
        title: 'Establish Standard PACE Communications Plan',
        action: 'PRIMARY (P): VHF/UHF Handheld FM on local simplex channel (e.g. 146.520 MHz or MURS Ch 3 151.940 MHz). ALTERNATE (A): GMRS Repeater or Cross-band mobile rig. CONTINGENCY (C): HF NVIS (Near Vertical Incidence Skywave) 40m/80m band. EMERGENCY (E): Optical heliograph mirror flashes, whistle signals, or smoke beacons.',
        hazards: 'Ensure all team members program identical frequencies, CTCSS/PL privacy tones, and squelch settings beforehand.'
      },
      {
        step: 2,
        title: 'Observe Synchronized Listening Windows (Scheds)',
        action: 'To preserve handheld battery power, turn receiver ON for exactly 5 minutes at the top of every odd hour (e.g. 0700, 0900, 1100, 1300, 1500, 1700). Monitor quietly; transmit check-in only if necessary.',
        hazards: 'Continuous listening drains a 2000mAh radio battery in 18 hours; strict scheduled monitoring extends lifespan to 7 days.'
      },
      {
        step: 3,
        title: 'Emergency Distress Broadcast Protocol (MAYDAY)',
        action: 'Broadcast standardized format: "MAYDAY MAYDAY MAYDAY. This is [Callsign/Name]. Location [Coordinates or landmarks]. Situation [Nature of emergency]. Number of casualties. Assistance needed. Listening on [Frequency]. OVER."',
        hazards: 'Repeat transmission twice, then switch to receive mode and listen attentively for 3 full minutes before repeating.'
      }
    ],
    quickReferenceTable: {
      headers: ['Service & Frequency', 'Channel / Designation', 'Use Case & Protocol', 'Power Limits / Notes'],
      rows: [
        ['146.520 MHz FM', '2m HAM National Simplex', 'Primary off-grid calling frequency in North America', '5W-50W; vertical polarization'],
        ['156.800 MHz FM', 'Marine VHF Channel 16', 'International maritime distress & emergency calling', '1W-25W; coastal and waterway rescue'],
        ['121.500 MHz AM', 'Aviation Guard VHF', 'Emergency locator transmitter & pilot distress', 'International civil aviation emergency'],
        ['462.5625 MHz FM', 'FRS/GMRS Channel 1', 'Common un-licensed family radio emergency calling', '0.5W FRS / 5W GMRS; short range LOS'],
        ['151.940 MHz FM', 'MURS Channel 3', 'Multi-Use Radio Service VHF license-free band', '2W maximum; excellent foliage penetration']
      ]
    },
    fieldTroubleshooting: [
      {
        symptom: 'Cannot reach station over high mountain ridge',
        rootCause: 'VHF/UHF signals are strictly line-of-sight and blocked by terrain diffraction shadows.',
        correctiveAction: 'Climb 50m to high ridge saddle or aim beam antenna at opposing bare granite rock face to knife-edge refract or reflect signal.'
      },
      {
        symptom: 'Receiver flooded with deafening static/hash noise',
        rootCause: 'Nearby poorly-shielded solar inverter or LED switching power supply RF interference.',
        correctiveAction: 'Increase squelch threshold, switch to narrow FM, or move antenna 10 meters away from power inverters.'
      }
    ],
    offlineVerifiedDate: '9 Oct 2026'
  },
  {
    id: 'universal-edibility-test',
    title: 'Universal Edibility Test for Unknown Wild Flora',
    category: 'Food & Preservation',
    readTimeMin: 6,
    authoritativeSource: 'US Army Survival Manual FM 21-76 / Survival Air Force Regulation 64-4',
    summary: 'A disciplined 24-hour progressive contact testing protocol to test unfamiliar wild plants for toxic alkaloids, saponins, and cyanogenic glycosides when facing starvation.',
    keyPrinciples: [
      'Test only ONE single plant part (leaf, stem, root, or fruit) at a time; never test multiple parts simultaneously.',
      'Fast completely from all other foods for 8 hours prior to beginning the test; drink only verified clean water.',
      'NEVER test mushrooms or wild fungi under this protocol; toxic fungal amatoxins have delayed latency (up to 24 hours) and cause irreversible liver necrosis.'
    ],
    stepByStepProtocol: [
      {
        step: 1,
        title: 'Initial Visual & Olfactory Screen',
        action: 'Avoid plants with white or milky sap (with rare exceptions like dandelion), bitter almond/peach scent (cyanide), umbrella-shaped white flower clusters (poison hemlock), thorns on stems, or 3-leaf clusters.',
        hazards: 'If the plant fails visual inspection, discard immediately without proceeding to skin test.'
      },
      {
        step: 2,
        title: 'Contact Skin Test (Wrist or Elbow)',
        action: 'Crush a portion of the selected plant part. Rub vigorously into the tender skin of your inner wrist or inside of elbow. Wait 15 minutes. Check for redness, rash, burning, or numbness.',
        hazards: 'Any skin reaction indicates immediate failure; thoroughly wash off with soap and water.'
      },
      {
        step: 3,
        title: 'External Lip & Corner of Mouth Test',
        action: 'If no skin irritation occurs after 15 minutes, touch a tiny crushed piece to the outer edge of your lips. Wait 3 minutes. Monitor for stinging, burning, or tingling.',
        hazards: 'Do not place in mouth yet.'
      },
      {
        step: 4,
        title: 'Tongue Tip Test',
        action: 'Place the sample on the tip of your tongue for 15 minutes without chewing or swallowing. If any soapy, nauseating, bitter, or burning sensation occurs, spit out immediately and rinse mouth with water.',
        hazards: 'Do not swallow saliva.'
      },
      {
        step: 5,
        title: 'Chewing & Swallowing Micro-Sample',
        action: 'If zero reaction occurs after 15 minutes, chew a pea-sized piece thoroughly for 15 minutes, then swallow. Wait 8 full hours. If any abdominal pain, cramping, nausea, diarrhea, or vertigo occurs, induce vomiting and drink activated charcoal.',
        hazards: 'Keep plenty of clean drinking water on hand.'
      },
      {
        step: 6,
        title: 'Verification Dose',
        action: 'If completely symptom-free after 8 hours, eat 1/4 cup of the prepared plant part. Wait an additional 8 hours. If still symptom-free, the specific tested part prepared in that exact method is safe to consume in moderate quantities.',
        hazards: 'Cooking frequently breaks down toxins; if tested boiled, consume ONLY boiled.'
      }
    ],
    quickReferenceTable: {
      headers: ['Stage', 'Test Site', 'Duration', 'Fail Conditions (Discard Plant)'],
      rows: [
        ['Stage 1', 'Nose & Sight', 'Immediate', 'Almond scent, milky sap, shiny umbrella umbels'],
        ['Stage 2', 'Inner Wrist Skin', '15 minutes', 'Itching, hives, burning, redness'],
        ['Stage 3', 'Outer Lip', '3 minutes', 'Tingling, burning, numbness'],
        ['Stage 4', 'Tongue Tip', '15 minutes', 'Bitterness, soap taste, stinging sensation'],
        ['Stage 5', 'Chew & Swallow', '8 hours', 'Cramping, vomiting, nausea, dizziness'],
        ['Stage 6', 'Quarter Cup Dose', '8 hours', 'Any systemic digestive distress']
      ]
    },
    fieldTroubleshooting: [
      {
        symptom: 'Accidentally swallowed toxic plant; intense stomach cramping within 30 min',
        rootCause: 'Plant alkaloid or cardiac glycoside poisoning.',
        correctiveAction: 'Induce vomiting if conscious, then administer 50g activated charcoal slurry mixed with 300mL water to bind residual toxins in the gastrointestinal tract.'
      }
    ],
    offlineVerifiedDate: '9 Oct 2026'
  },
  {
    id: 'galvanic-earth-battery-blueprint',
    title: 'Galvanic Copper-Zinc Earth Battery: Principles, Fabrication, and Deployment',
    category: 'Energy & Power',
    readTimeMin: 10,
    authoritativeSource: 'British Patent 9745 (Bain 1843) / US Patent 600,457 (Stubblefield 1898) / US Signal Corps Ground Currents',
    summary: 'Comprehensive engineering guide to extracting continuous baseline direct current directly from the earth using dissimilar copper-zinc electrodes and mineralized soil electrolytes.',
    keyPrinciples: [
      'Electrochemical Galvanic Potential: Zinc has a standard oxidation potential of -0.76V; Copper has a reduction potential of +0.34V. The net theoretical galvanic cell potential in electrolyte is ~1.10 Volts.',
      'Soil behaves as a resistive aqueous electrolyte. Moisture, mineral salts (sulfates, chlorides, nitrates), and compaction dictate cell internal resistance ($R_{int}$).',
      'Series arrays multiply voltage ($V_{total} = N \\times V_{cell}$), while larger electrode surface areas reduce internal resistance and boost current capacity.'
    ],
    stepByStepProtocol: [
      {
        step: 1,
        title: 'Electrode Sourcing and Mechanical Preparation',
        action: 'Acquire 4 to 6 copper plates or 3/4" copper pipe sections (15cm x 30cm) for positive cathodes. Acquire matching zinc plates, galvanized rebar, or marine sacrificial boat zincs for negative anodes. Sand and wire-brush all surfaces down to bright raw metal to strip passive oxide films.',
        hazards: 'Wear leather gloves when handling sharp cut sheet metal edges.'
      },
      {
        step: 2,
        title: 'Excavation & Moisture Bedding',
        action: 'Dig a series of 4 to 6 holes or an interconnected trench 50 to 70 cm deep (below the dry surface horizon and frost depth). Space copper-zinc pairs 1.5 to 2.0 meters apart. Place copper vertically; pack a 5cm surrounding bed of damp crushed biochar or hardwood charcoal around each copper plate (carbon acts as a depolarizing porous conductor).',
        hazards: 'Do not place electrodes closer than 1 meter to avoid localized ion field cancellation.'
      },
      {
        step: 3,
        title: 'Electrolyte Soil Doping',
        action: 'Around the zinc anode bed, pour 5 liters of lukewarm water saturated with 200g of Epsom salt (magnesium sulfate) or sifted wood ash. Tamp damp native soil tightly around both electrodes to eliminate insulating air pockets.',
        hazards: 'NEVER use battery acid, motor fluids, or industrial salts that contaminate soil or groundwater.'
      },
      {
        step: 4,
        title: 'Series Interconnect Wiring & Hermetic Waterproofing',
        action: 'Use 14 AWG or 16 AWG solid copper THHN building wire. Solder the Zinc of Cell 1 to the Copper of Cell 2; Zinc of Cell 2 to Copper of Cell 3, continuing down the bank. Coat every underground soldered joint heavily in 100% silicone sealant, followed by marine dual-wall adhesive heatshrink.',
        hazards: 'Unsealed underground connections will undergo rapid electrolytic galvanic corrosion and snap within weeks.'
      },
      {
        step: 5,
        title: 'Circuit Connection & Joule Thief Step-Up Interface',
        action: 'Bring terminal leads (+ on Copper 1, - on Zinc N) to a weather-shielded terminal block. Wire through an inline Schottky diode (1N5819) to prevent night-time backfeed. Connect to a 1-transistor toroid Joule Thief oscillator circuit to step up 3.5V to 5.0V for charging supercapacitors or powering LEDs.',
        hazards: 'Observe correct polarity: Copper is always Positive (+), Zinc is always Negative (-).'
      }
    ],
    quickReferenceTable: {
      headers: ['Cell Configuration', 'Open Circuit Volts (Voc)', 'Short Circuit Current (Isc)', 'Applicable Field Loads'],
      rows: [
        ['1 Pair (Small 15x15cm)', '0.85 V - 0.95 V', '2 - 5 mA', 'Ultra-low voltage sensor / galvanic galvanometer'],
        ['4 Pairs in Series (Standard)', '3.40 V - 3.80 V', '15 - 35 mA', 'Direct white LED glow, Joule Thief step-up to 5V'],
        ['8 Pairs in Series (Extended)', '6.80 V - 7.60 V', '25 - 50 mA', 'Trickle-charging 3.7V LiFePO4 cells, LoRa beacon'],
        ['12 Pairs in Series / Parallel', '5.10 V (2x Parallel)', '60 - 100 mA', 'Low-power 5V USB trickle charging via supercapacitor']
      ]
    },
    fieldTroubleshooting: [
      {
        symptom: 'Cell voltage suddenly drops below 0.3V per pair',
        rootCause: 'Surrounding soil has completely dried out, increasing soil resistivity to megaohms.',
        correctiveAction: 'Pour 5-10 liters of water mixed with 100g table salt or wood ash around the electrode bed; check for broken wiring splices.'
      },
      {
        symptom: 'Voltage is normal (>3.5V) but current output is microamps when load connected',
        rootCause: 'Zinc anode has passivated with insulating white zinc hydroxide / zinc carbonate scale crust.',
        correctiveAction: 'Dig up zinc electrodes, scrub with wire brush to restore shiny metallic zinc, and re-bed in charcoal slurry.'
      }
    ],
    offlineVerifiedDate: '10 Oct 2026'
  }
];
