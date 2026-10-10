import { TechNode } from '../types';

export const TECH_TREE_NODES: TechNode[] = [
  {
    id: 'charcoal-retort',
    name: 'Charcoal Production Retort',
    category: 'Chemistry & Reagents',
    tier: 'Primitive / Stone Age',
    summary: 'Pyrolysis kiln converting hardwood into high-carbon charcoal fuel without open air burning.',
    description: 'Charcoal burns at temperatures exceeding 1100°C, high enough to smelt copper and iron, unlike raw wood which rarely exceeds 800°C and releases moisture. An indirect retort barrel captures wood vinegar and combustible syngas.',
    prerequisites: [],
    unlocks: ['bloomery-furnace', 'water-charcoal-adsorption', 'woodgas-reactor', 'blacksmith-forge'],
    billOfMaterials: [
      { name: '55-gallon steel drum (or clay pit)', quantity: '1 unit', purpose: 'Outer combustion chamber', salvagedAlternative: 'Heavy oil drum / clay dome kiln', sourceClassification: 'Scrap / Salvage' },
      { name: '30-gallon inner drum (airtight seal)', quantity: '1 unit', purpose: 'Pyrolysis retort cylinder', salvagedAlternative: 'Steel grease drum with clamped lid', sourceClassification: 'Scrap / Salvage' },
      { name: '1-inch steel pipe manifold', quantity: '1.2 m', purpose: 'Syngas exhaust feedback burner', salvagedAlternative: 'Exhaust tubing or copper pipe', sourceClassification: 'Scrap / Salvage' },
      { name: 'Dense seasoned hardwood logs (oak/hickory/ash)', quantity: '50 kg', purpose: 'Feedstock timber', salvagedAlternative: 'Any dense fallen branchwood dried <15% moisture', sourceClassification: 'Wild / Natural' }
    ],
    buildSteps: [
      'Drill four 12mm holes in the bottom rim of the 30-gallon inner drum to vent pyrolysis syngas downward.',
      'Pack the inner drum tightly with uniform 5–10cm hardwood chunks. Clamp lid with high-temp refractory clay seal.',
      'Invert inner drum inside 55-gallon outer drum onto steel rebar supports 15cm off the bottom.',
      'Fill gap between drums with kindling. Ignite bottom fire. Once internal wood reaches 280°C, syngas ignites spontaneously at bottom jets.',
      'When chimney exhaust transitions from thick white steam to clear flame, seal all air intakes with damp soil and allow 12h cool-down.'
    ],
    safetyWarnings: [
      'Carbon monoxide (CO) hazard: Never operate inside enclosed shelters or tents.',
      'Thermal runaway and explosive flashover if the retort lid is opened before cooling below 100°C (pyrophoric spontaneous combustion).',
      'Wear eye protection and heavy split-cowhide welding gloves.'
    ],
    acceptanceTests: [
      'Produced charcoal rings with a metallic clink when struck against stone.',
      'Breaks cleanly with shiny black vitreous cross-section, leaves minimal dust.',
      'Burns smokeless in forge with ash residue <2% of initial dry weight.'
    ],
    failureModesAndRecovery: [
      'Wood ash instead of charcoal: Air leak in retort lid. Seal seam with clay/wood-ash slurry before next fire.',
      'Unburnt brown wood core: Insufficient burn duration or wet feedstock (>20% moisture). Re-pack and run secondary cycle.'
    ],
    citations: ['FAO Forestry Paper 41: Simple Technologies for Charcoal Making', 'US Army FM 5-103 Survivability'],
    estimatedBuildHours: 6,
    criticality: 'Essential Survival'
  },
  {
    id: 'slow-sand-filter',
    name: 'Slow Sand Water Filtration Unit',
    category: 'Water & Sanitation',
    tier: 'Primitive / Stone Age',
    summary: 'Biological schmutzdecke sand bed removing 99.9% of bacteria, protozoa (Giardia/Crypto), and turbidity.',
    description: 'Unlike rapid mechanical filters that only strain coarse particles, slow sand filtration cultivates an active biological biofilm layer (schmutzdecke) in the top 2cm of fine sand that preys on and consumes pathogenic microbes continuously without chemicals.',
    prerequisites: [],
    unlocks: ['clean-water-distribution', 'sterile-medical-wash'],
    billOfMaterials: [
      { name: 'Food-grade 200L barrel or masonry cistern', quantity: '1 unit', purpose: 'Filter housing container', salvagedAlternative: 'Polyethylene IBC tote or brick basin', sourceClassification: 'Scrap / Salvage' },
      { name: 'Fine washed silica sand (0.15 - 0.35 mm grain)', quantity: '120 kg', purpose: 'Active biofilm filtration media', salvagedAlternative: 'River sand sieved through window screen and rinsed', sourceClassification: 'Wild / Natural' },
      { name: 'Coarse support gravel (2 - 6 mm)', quantity: '25 kg', purpose: 'Underdrain gravel bed', salvagedAlternative: 'Washed pea gravel from dry creek beds', sourceClassification: 'Wild / Natural' },
      { name: 'Slotted PVC or bamboo underdrain pipe', quantity: '60 cm', purpose: 'Effluent collection pipe', salvagedAlternative: 'Perforated plastic pipe wrapped in geotextile', sourceClassification: 'Scrap / Salvage' },
      { name: 'Swan-neck elevated outlet pipe', quantity: '1 assembly', purpose: 'Maintains 5cm water head over sand bed', salvagedAlternative: 'Flexible garden hose looped to overflow height', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Install slotted collector pipe at the base of the container, connecting to an external swan-neck outlet.',
      'Place 10cm of coarse gravel (10-20mm) over underdrain, followed by 5cm of fine gravel (2-5mm).',
      'Carefully pour 60-80cm of washed silica sand in 10cm lifts, keeping the bed submerged to prevent air entrapment.',
      'Install a diffuser plate (perforated wooden board or plastic lid) at water surface to prevent incoming raw water from scouring sand bed.',
      'Run raw surface water slowly for 7-14 days to mature the biological schmutzdecke layer before drinking effluent.'
    ],
    safetyWarnings: [
      'Unconditioned sand bed is ineffective: Do not consume water during the 1-2 week biological ripening phase.',
      'Never allow the sand bed to dry out, which kills the schmutzdecke microorganisms and collapses purification efficacy.',
      'Does not remove dissolved chemical toxins or heavy metals without activated charcoal stage.'
    ],
    acceptanceTests: [
      'Flow rate stabilizes between 100 to 200 liters per hour per square meter of sand area.',
      'Turbidity is consistently < 1.0 NTU (crystal clear in glass cylinder held against black line).',
      'No stagnation odor or foul sulfur smell in effluent.'
    ],
    failureModesAndRecovery: [
      'Flow rate slows to drip: Top 1cm of sand is clogged. Perform wet scraping (skim top 1.5cm of sand), smooth bed, and re-ripen for 48 hours.',
      'Channeling through sand: Sand settled unevenly. Drain down to gravel, re-pack evenly in submerged state.'
    ],
    citations: ['WHO Guidelines for Drinking-Water Quality (Vol 1)', 'Huisman & Wood: Slow Sand Filtration (WHO 1974)'],
    estimatedBuildHours: 8,
    criticality: 'Essential Survival'
  },
  {
    id: 'earth-battery-galvanic',
    name: 'Galvanic Copper-Zinc Ground Battery Cell',
    category: 'Energy & Power',
    tier: 'Primitive / Stone Age',
    summary: 'Dissimilar metal telluric ground cells using buried copper and zinc in mineralized soil to extract continuous base-load DC electricity.',
    description: 'Discovered by Alexander Bain (1841) for telegraph lines and patented by Nathan Stubblefield (1898). When dissimilar metals with different electrochemical galvanic reduction potentials (Copper cathode +0.34V, Zinc anode -0.76V) are buried in moist earth containing natural mineral salts (electrolytes), a continuous spontaneous oxidation-reduction reaction occurs. Zinc oxidizes and releases electrons through the external circuit back to the copper cathode, producing 0.85V to 1.1V per cell pair. Wiring cells in series increases voltage to power emergency Joule Thief LEDs, trickle charge supercapacitors, and run low-voltage radio receivers indefinitely without sunlight, wind, or fuel.',
    prerequisites: [],
    unlocks: ['lead-acid-reconstruction', 'crystal-radio-receiver', 'spark-gap-radio'],
    billOfMaterials: [
      { name: 'Copper cathode plates or pipes (15cm x 30cm)', quantity: '4 - 6 units', purpose: 'Positive reduction electrode', salvagedAlternative: 'Scrap copper roof flashing, copper plumbing pipe, or stripped heavy bare copper wire', sourceClassification: 'Scrap / Salvage' },
      { name: 'Zinc anode plates or rods (15cm x 30cm)', quantity: '4 - 6 units', purpose: 'Negative sacrificial oxidation electrode', salvagedAlternative: 'Galvanized steel rebar, zinc roof flashing, or marine zinc boat anodes', sourceClassification: 'Scrap / Salvage' },
      { name: 'Solid insulated copper wire (14-16 AWG THHN)', quantity: '25 m', purpose: 'Series interconnect bus and delivery line', salvagedAlternative: 'Automotive wiring harness or Romex solid building wire', sourceClassification: 'Scrap / Salvage' },
      { name: 'Soil electrolyte enhancer (Epsom salt / wood ash / charcoal)', quantity: '5 kg', purpose: 'Lowers soil resistance and retains moisture', salvagedAlternative: 'Crushed hardwood charcoal fines + table salt or compost runoff', sourceClassification: 'Wild / Natural' },
      { name: 'Waterproof joint seal (Silicone & dual-wall heatshrink)', quantity: '1 set', purpose: 'Prevents copper wire corrosion at buried junction', salvagedAlternative: 'Melted pitch / pine resin + rubber bicycle inner tube wrapping', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Survey site: Choose moist, mineral-rich shaded soil (creek margin, garden perimeter, under downspout). Dig 4 to 6 holes 50-70 cm deep spaced 1.5 to 2.0 meters apart.',
      'Scour zinc and copper plates with coarse sand or wire brush to remove protective passivating oxides and expose raw metal.',
      'Embed copper cathode vertically in hole 1; pack 5cm layer of damp crushed biochar/charcoal around copper (carbon acts as depolarizer and expands effective surface area).',
      'Embed zinc anode in hole 2. Pour 5 liters of water mixed with 200g Epsom salt, wood ash, or vinegar around zinc bed to establish rich ion channel.',
      'Wire in series: Solder zinc electrode 1 to copper electrode 2, zinc 2 to copper 3, etc. Coat all buried soldered splices with heavy silicone and shrink dual-wall heatshrink.',
      'Terminal leads (+ on Copper 1, - on Zinc 4) connect to terminal block. Step up output voltage using a simple 1-transistor Joule Thief circuit to illuminate white LED or charge battery.'
    ],
    safetyWarnings: [
      'Environmental contamination: NEVER use concentrated battery acids, motor oil, or heavy industrial toxins to dope soil. Use only food-grade salts, vinegar, or wood ash.',
      'Galvanic consumption: The zinc anode is sacrificial and slowly dissolves over 18-36 months. Design electrode mounting for periodic inspection and replacement.'
    ],
    acceptanceTests: [
      'Single buried copper-zinc pair reads between 0.82V and 1.05V open-circuit voltage (Voc) on digital multimeter.',
      'Four-cell series array delivers >= 3.4V Voc and sustained short-circuit current >= 15 mA.',
      'Continuous 24-hour illumination of high-efficiency white LED through Joule Thief step-up oscillator without external batteries.'
    ],
    failureModesAndRecovery: [
      'Current drops to microamps: Soil dried out around electrodes. Pour bucket of water containing 100g table salt into each electrode hole to restore electrolyte conductivity.',
      'Voltage drops over time: Zinc anode passivated with white zinc hydroxide scale. Dig up zinc rod, wire-brush clean, and re-seat in charcoal/ash slurry.'
    ],
    citations: ['Bain, Alexander: British Patent 9745 (Electric Clocks and Ground Batteries 1843)', 'Stubblefield, Nathan: US Patent 600,457 (Electrical Battery 1898)', 'Pierce, G.W.: Wireless Telephony and Earth Currents'],
    estimatedBuildHours: 4,
    criticality: 'Essential Survival'
  },
  {
    id: 'botanical-pharmacopoeia-extraction',
    name: 'Wild Botanical Pharmacopoeia & Alkaloid Extraction',
    category: 'Medical & Health',
    tier: 'Primitive / Stone Age',
    summary: 'Systematic identification, field triage, and solvent extraction of natural analgesics (willow salicin), hemostatic clotting agents (yarrow achilleine), and antiseptics.',
    description: 'Before modern synthetic pharmaceuticals, botanical medicine formed the foundation of human survival. Plants synthesize secondary metabolites—salicin (aspirin precursor in willow cambium), achilleine (hemostatic platelet agonist in yarrow), aucubin (antibacterial iridoid in plantain), valerenic acid (GABA sedative in valerian), and verbascoside (expectorant in mullein). Proper extraction techniques (decoctions for tough roots/bark, infusions for flowers/leaves, alcohol tinctures for stable storage, and fresh chewed poultices for immediate wound tamponade) extract active compounds while strict morphological identification isolates lethal lookalikes like Conium maculatum (poison hemlock).',
    prerequisites: [],
    unlocks: ['dakin-antiseptic', 'penicillin-culturing'],
    billOfMaterials: [
      { name: 'Target medicinal flora (Willow, Yarrow, Plantain, Valerian, Mullein)', quantity: 'As needed', purpose: 'Active pharmacological source biomass', salvagedAlternative: 'Foraged wild from uncontaminated riparian borders and meadows', sourceClassification: 'Wild / Natural' },
      { name: 'Pure extraction solvent (Distilled water or 40-60% ethanol)', quantity: '1 - 2 L', purpose: 'Phytochemical solvent', salvagedAlternative: 'Boiled rain water or distilled high-proof alcohol', sourceClassification: 'Synthesized' },
      { name: 'Clean mortar & pestle or smooth hardwood mallet', quantity: '1 set', purpose: 'Cellular mechanical disruption / maceration', salvagedAlternative: 'Smooth river stones washed clean', sourceClassification: 'Wild / Natural' },
      { name: 'Fine linen / cotton straining cloth & dark glass jars', quantity: '4 sets', purpose: 'Filtration and light-protected storage', salvagedAlternative: 'Clean bandana + dark beer bottles wrapped in foil', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Field Identification & Verification: Confirm 5 botanical characteristics (flower structure, leaf arrangement, stem cross-section, scent, root type) against compendium before harvesting.',
      'Harvest timing: Collect aerial leaves and flowers at midday when dew evaporates; dig roots in late autumn when energy withdraws underground; peel tree inner bark in early spring during sap rise.',
      'Mechanical maceration: Chop, bruise, or grind plant material to rupture cell walls and expose alkaloids to solvent.',
      'Extraction: Boil bark/roots for 20-30 min (Decoction); steep flowers/leaves in hot water covered for 15 min (Infusion); or macerate in 50% alcohol for 4 weeks (Tincture).',
      'Filter through dense cloth, press dregs, and bottle in clean amber glass. Label with plant name, preparation date, and dosage instructions.'
    ],
    safetyWarnings: [
      'LETHAL LOOKALIKE HAZARD: Never harvest Apiaceae (parsley family) without verifying smooth vs hairy stem and purple spots (Poison Hemlock fatality).',
      'Always perform a contact skin scratch test before internal ingestion of wild decoctions to detect idiosyncratic allergic anaphylaxis.'
    ],
    acceptanceTests: [
      'Yarrow poultice ceases active capillary oozing within 2 minutes of compression.',
      'Willow bark decoction provides subjective reduction in tension headache and joint pain within 45 minutes.',
      'Tincture stores at room temperature in dark bottles for over 12 months with zero microbial spoilage.'
    ],
    failureModesAndRecovery: [
      'Decoction develops mold or sour odor within 48 hours: Water-based decoctions spoil rapidly. Always brew fresh daily or preserve by adding 20% ethanol by volume.'
    ],
    citations: ['US Army Survival Manual FM 21-76 (Medicinal Plants)', 'Hoffmann, David: Medical Herbalism', 'Duke, James: Handbook of Medicinal Herbs'],
    estimatedBuildHours: 5,
    criticality: 'Essential Survival'
  },
  {
    id: 'hydraulic-ram-pump',
    name: 'Hydraulic Ram Pump (Hydram)',
    category: 'Mechanics & Tools',
    tier: 'Early Industrial',
    summary: 'Fuel-free mechanical pump using water hammer inertia to lift 10% of flow up to 10x supply fall elevation.',
    description: 'Requires zero electrical or fossil energy. Uses the kinetic kinetic energy of a falling water volume through a drive pipe. Sudden closure of a waste valve triggers a water-hammer pressure spike, forcing a fraction through a check valve into an air pressure chamber and up the delivery pipe.',
    prerequisites: [],
    unlocks: ['aqueduct-irrigation', 'elevated-cistern-storage'],
    billOfMaterials: [
      { name: 'Steel / Schedule 40 PVC drive pipe (1.25" dia)', quantity: '10 - 15 m', purpose: 'Rigid kinetic momentum pipe', salvagedAlternative: 'Galvanized iron conduit pipe', sourceClassification: 'Scrap / Salvage' },
      { name: 'Heavy brass swing check valve (Waste Valve)', quantity: '1.25"', purpose: 'Water hammer impulse trigger', salvagedAlternative: 'Modified inline flap check valve with counterweight', sourceClassification: 'Manufactured' },
      { name: 'Inline spring check valve (Delivery Valve)', quantity: '1.25"', purpose: 'One-way pressure accumulator valve', salvagedAlternative: 'Plumbing check valve with rubber flapper', sourceClassification: 'Manufactured' },
      { name: 'Steel pressure tank or 3" sealed pipe nipple', quantity: '1 unit', purpose: 'Air cushion dampener (prevents pipe rupture)', salvagedAlternative: 'Empty fire extinguisher bottle or propane tank', sourceClassification: 'Scrap / Salvage' },
      { name: '0.5" delivery pipe', quantity: '50 - 200 m', purpose: 'High-elevation output line', salvagedAlternative: 'Standard garden hose or PEX tubing', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Select intake site with 1.5 to 4 meters of vertical drop (head) over a 10 to 15 meter drive pipe run.',
      'Anchor ram body firmly to concrete footings or heavy timber frame to absorb continuous mechanical shock hammer.',
      'Assemble tee fitting: horizontal drive pipe feeds directly into waste valve and upward check valve.',
      'Mount pressure vessel directly above the delivery check valve; ensure captive air bubble is trapped inside.',
      'Cycle waste valve manually 5-10 times until automatic rhythmic pulsation (40-70 beats/min) self-sustains.'
    ],
    safetyWarnings: [
      'High pressure spike: Delivery side can exceed 150 PSI (10 bar). Use schedule 40 or metal pipe.',
      'Air cushion waterlogging: Air in the vessel dissolves over weeks; install snifter valve or drain quarterly.'
    ],
    acceptanceTests: [
      'Steady rhythmic heartbeat cadence of 50-65 clicks per minute without human intervention.',
      'Continuous stream at header tank elevated 10x the drive head height.'
    ],
    failureModesAndRecovery: [
      'Pump stops ticking: Trash stuck in waste valve or inadequate drive water volume. Clean strainer at intake.',
      'Hammer sound becomes harsh metallic banging: Pressure tank has lost air cushion (waterlogged). Drain tank and seal.'
    ],
    citations: ['Intermediate Technology Publications: A Guide on Hydraulic Ram Pumps (TD Watt)', 'US Dept of Agriculture Bulletin 1424'],
    estimatedBuildHours: 5,
    criticality: 'Civilizational Infrastructure'
  },
  {
    id: 'bloomery-furnace',
    name: 'Clay Bloomery Smelting Furnace',
    category: 'Metallurgy & Materials',
    tier: 'Agrarian & Forging',
    summary: 'Direct reduction furnace reducing iron ore (hematite/bog iron) into a consolidated wrought iron bloom.',
    description: 'A bloomery produces sponge iron directly from solid iron oxide ore without melting the iron (melting point 1538°C). Operating at 1150-1250°C using charcoal and forced air tuyere, carbon monoxide reduces iron oxide while gangue turns to liquid fayalite slag tapped at the base.',
    prerequisites: ['charcoal-retort'],
    unlocks: ['wrought-iron-tools', 'blacksmith-anvil', 'steel-carburizing'],
    billOfMaterials: [
      { name: 'Refractory clay & sand mixture (1:2 ratio)', quantity: '150 kg', purpose: 'Furnace shaft wall construction', salvagedAlternative: 'River clay tempered with dry horse manure and crushed pottery', sourceClassification: 'Wild / Natural' },
      { name: 'Iron ore (bog iron, crushed hematite, magnetite)', quantity: '40 kg', purpose: 'Metallic iron source', salvagedAlternative: 'Rust scrap flakes or river bog iron nodules', sourceClassification: 'Wild / Natural' },
      { name: 'Lump hardwood charcoal (walnut-sized)', quantity: '100 kg', purpose: 'Reducing agent and high-caloric fuel', salvagedAlternative: 'Charcoal from retort process', sourceClassification: 'Synthesized' },
      { name: 'Ceramic tuyere pipe (25-35mm ID)', quantity: '1 unit', purpose: 'Air blast injection nozzle', salvagedAlternative: 'Rolled clay pipe fired at high temp or iron pipe with mud jacket', sourceClassification: 'Wild / Natural' },
      { name: 'Air blast supply (bellows or electric blower)', quantity: '1 assembly', purpose: 'Continuous oxygen delivery', salvagedAlternative: 'Dual box bellows or modified 12V radiator fan', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Build circular clay shaft 30cm inside diameter, 100cm tall, with 10cm thick walls over a stone ring foundation.',
      'Set ceramic tuyere 15cm above furnace floor, tilted downward at 15 to 20 degrees toward center.',
      'Preheat furnace gently over 24 hours with small wood fires to drive off moisture and prevent wall spalling.',
      'Fill shaft with charcoal and ignite blast. Once stack hits yellow heat (1200°C), begin alternate charges of 1kg ore / 1.5kg charcoal every 10 min.',
      'Tap liquid black slag through tap hole every 45 min. After 4-6 hours, break furnace breast and extract glowing iron bloom with tongs for immediate heavy hammer compaction.'
    ],
    safetyWarnings: [
      'Extreme thermal hazard: Splattering molten slag reaches 1200°C. Full leather apron, face shield, and heavy boots mandatory.',
      'Dangerous carbon monoxide plume from shaft top; conduct outdoors in clear open breeze.'
    ],
    acceptanceTests: [
      'Bloom extracted possesses dense metallic heft and sparks brilliant yellow-white on grinder.',
      'Hammering bloom on anvil expels trapped slag and consolidates into ductile bar without crumbling.'
    ],
    failureModesAndRecovery: [
      'Iron oxidizes away or forms cast iron puddle: Blast air too high or fuel ratio wrong. Reduce blower speed, increase charcoal layer thickness.',
      'Ore falls through unreduced: Charge size too large or furnace shaft too short. Crush ore finer (<6mm).'
    ],
    citations: ['Pleiner, Radomir: Iron in Archaeology - The European Bloomery Smelters', 'Tylecote: Metallurgy in Archaeology'],
    estimatedBuildHours: 18,
    criticality: 'Civilizational Infrastructure'
  },
  {
    id: 'woodgas-reactor',
    name: 'Stratified Downdraft Woodgas Gasifier',
    category: 'Energy & Power',
    tier: 'Early Industrial',
    summary: 'Thermochemical reactor converting dry wood chips into combustible syngas (CO + H2) for gasoline engines.',
    description: 'Developed extensively during WWII fuel shortages (over 1 million European vehicles ran on wood gas). The downdraft configuration draws tars through a glowing 1000°C charcoal constriction zone (hearth throat), cracking sticky volatile tars into clean permanent gases that run standard internal combustion engines.',
    prerequisites: ['charcoal-retort'],
    unlocks: ['engine-electrical-generation', 'mechanical-mill-power'],
    billOfMaterials: [
      { name: 'Heavy steel cylinder (e.g., 100lb propane tank)', quantity: '1 unit', purpose: 'Outer reactor vessel', salvagedAlternative: 'Heavy gauge steel hot water heater tank', sourceClassification: 'Scrap / Salvage' },
      { name: 'Stainless steel brake drum or pipe reducer', quantity: '1 unit', purpose: 'High-temp constriction throat restriction', salvagedAlternative: 'Cast iron truck wheel hub or stainless pot', sourceClassification: 'Scrap / Salvage' },
      { name: 'Air nozzles (tuyeres)', quantity: '4-6 ports', purpose: 'Even air distribution around reaction zone', salvagedAlternative: '0.75" stainless steel hex bolts drilled out', sourceClassification: 'Scrap / Salvage' },
      { name: 'Cyclone separator & wood chip filter drum', quantity: '1 assembly', purpose: 'Soot removal and gas cooling radiator', salvagedAlternative: 'Ammunition box / 20L paint can packed with coarse wood shavings', sourceClassification: 'Scrap / Salvage' },
      { name: 'Dry wood chips (size 2-4cm, moisture <15%)', quantity: '25 kg/hr', purpose: 'Biomass feedstock', salvagedAlternative: 'Hardwood chunks, corn cobs, dry nutshells', sourceClassification: 'Wild / Natural' }
    ],
    buildSteps: [
      'Cut propane tank (strictly purged of all fuel with water rinse). Mount internal stainless throat plate 40cm from bottom.',
      'Install 4-6 symmetrical radial tuyeres pointing 45° downward into throat constriction.',
      'Fabricate shaker grate 10cm beneath restriction plate to drop ash into collection hopper.',
      'Plumb gas outlet through cyclone soot spinner, radiator cooling pipe loop, and fine sawdust filter barrel.',
      'Start bed with charcoal in throat. Apply suction blower, ignite tuyere ports, verify clear blue-purple flare before connecting to engine intake mixer.'
    ],
    safetyWarnings: [
      'LETHAL CARBON MONOXIDE (CO): Syngas contains 20-25% CO. Colorless, odorless, rapid asphyxiation. Never run indoors.',
      'Gas flare is nearly invisible in sunlight. Keep dry vegetation 5 meters away.',
      'Uncracked tar will stick engine intake valves open within 15 minutes if throat temperature drops below 900°C.'
    ],
    acceptanceTests: [
      'Gas burns at flare nozzle with clean, self-sustaining purple-blue flame for >30 continuous minutes.',
      'Engine runs smoothly under 50% electrical load on woodgas without petrol feed.'
    ],
    failureModesAndRecovery: [
      'Sticky black tar on engine spark plugs: Feedstock too wet or bridging in hopper. Empty fuel hopper, dry wood to <15% moisture, preheat charcoal zone.'
    ],
    citations: ['FEMA / Oak Ridge National Laboratory: Biomass Energy Project Downdraft Gasifier (1989)', 'SERI Generator Gas: Swedish Experience 1939-1945'],
    estimatedBuildHours: 24,
    criticality: 'Civilizational Infrastructure'
  },
  {
    id: 'biogas-digester',
    name: 'Anaerobic Continuous Biogas Digester',
    category: 'Energy & Power',
    tier: 'Early Industrial',
    summary: 'Mesophilic anaerobic fermentation chamber converting livestock manure and food waste into methane fuel and liquid fertilizer.',
    description: 'Methanogenic archaea digest volatile organic solids in an oxygen-free aqueous environment, generating biogas (60% CH4, 40% CO2). 1 cubic meter of biogas produces 6 kWh of thermal energy, boiling 20L of water or running a modified gas mantle lamp for 6 hours.',
    prerequisites: ['slow-sand-filter'],
    unlocks: ['clean-cooking-fuel', 'nitrogen-rich-fertilizer'],
    billOfMaterials: [
      { name: '1000L IBC Polyethylene Tote', quantity: '1 unit', purpose: 'Airtight digester fermentation chamber', salvagedAlternative: 'Two 200L polyethylene barrels connected in series', sourceClassification: 'Scrap / Salvage' },
      { name: '4-inch PVC inlet & discharge pipes', quantity: '3 m', purpose: 'Feedstock gravity chute and effluent overflow', salvagedAlternative: 'Drainage pipe or rigid conduit', sourceClassification: 'Scrap / Salvage' },
      { name: 'Truck inner tube or counterweighted drum', quantity: '1 unit', purpose: 'Low-pressure gas storage bladder', salvagedAlternative: 'Heavy EPDM pond liner bag', sourceClassification: 'Scrap / Salvage' },
      { name: 'Iron sponge H2S scrubber (steel wool in PVC pipe)', quantity: '1 assembly', purpose: 'Removes corrosive rotten-egg hydrogen sulfide', salvagedAlternative: 'Rust-coated gravel in 2" pipe', sourceClassification: 'Scrap / Salvage' },
      { name: 'Active cattle / goat manure slurry seed inoculum', quantity: '100 L', purpose: 'Bacterial seed culture', salvagedAlternative: 'Pond bottom anaerobic mud + fresh farm manure', sourceClassification: 'Wild / Natural' }
    ],
    buildSteps: [
      'Plumb 4" inlet pipe plunging 15cm off the bottom of the IBC tote so new feed enters anaerobic zone without oxygen.',
      'Plumb overflow siphon pipe on opposite wall at 80% tank height for discharge of nutrient-rich bio-slurry.',
      'Install 0.75" gas collection bulkhead at top cap; seal all threads with marine silicone and Teflon tape.',
      'Fill tank with 600L lukewarm water and 150L fresh manure. Seal tightly. Maintain between 25°C and 37°C.',
      'Vent initial 7-10 days of gas (chiefly CO2) until gas sample ignites with steady blue flame. Route through iron oxide scrubber to gas bladder.'
    ],
    safetyWarnings: [
      'Explosion risk: Methane in air is explosive between 5% and 15% concentration. Keep open flames away from bladder.',
      'Never seal a digester without a pressure relief bubbler (U-tube manometer).'
    ],
    acceptanceTests: [
      'Gas ignites at burner ring with clean blue flame without odor of hydrogen sulfide after scrubber.',
      'Daily feeding of 10kg dung/waste generates ~300-500L usable gas per day.'
    ],
    failureModesAndRecovery: [
      'Acid crash (pH drops <6.5, gas production stops): Overfeeding carbohydrate wastes. Stop feeding, add wood ash or lime slurry to buffer pH back to 7.2.'
    ],
    citations: ['FAO Soils Bulletin 41: China: Azolla propagation and small-scale biogas technology', 'Intermediate Technology: Biogas Plants in Animal Husbandry'],
    estimatedBuildHours: 12,
    criticality: 'Civilizational Infrastructure'
  },
  {
    id: 'lead-acid-reconstruction',
    name: 'Reconstituted Planté Lead-Acid Battery',
    category: 'Energy & Power',
    tier: 'Electromechanical',
    summary: 'Rugged deep-cycle electrochemical storage cells formed from recycled sheet lead and sulfuric acid.',
    description: 'Unlike modern pasted plate batteries that degrade rapidly, Gaston Planté\'s original 1859 design uses pure solid lead plates cycled electrochemically to form durable sponge lead (negative) and lead dioxide (positive). Simple to repair, indestructible against overcharge, and indefinitely rebuildable.',
    prerequisites: ['sulfuric-acid-chamber'],
    unlocks: ['solar-battery-bank', 'dc-microgrid', 'radio-comms-station'],
    billOfMaterials: [
      { name: 'Pure sheet lead (roof flashing or salvaged pipes)', quantity: '15 kg', purpose: 'Anode and cathode electrode plates', salvagedAlternative: 'Scrap lead wheel weights melted and cast into flat ingots', sourceClassification: 'Scrap / Salvage' },
      { name: 'Sulfuric acid electrolyte (specific gravity 1.200)', quantity: '4 L', purpose: 'Electrochemical ion carrier', salvagedAlternative: 'Chamber process sulfuric acid diluted 3:1 in distilled water', sourceClassification: 'Synthesized' },
      { name: 'High-density polyethylene or glass cell jars', quantity: '3 cells (for 6V)', purpose: 'Acid-resistant cell containers', salvagedAlternative: 'Cut 5-liter HDPE detergent jugs or glass battery jars', sourceClassification: 'Scrap / Salvage' },
      { name: 'Perforated corrugated plastic plate separators', quantity: '12 sheets', purpose: 'Prevents plate short-circuits', salvagedAlternative: 'Cedar wood veneer boiled in lye or plastic gutter guard', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Cut lead sheet into rectangular plates (15cm x 20cm) with integrally cut terminal tabs extending upwards.',
      'Score plate surfaces deeply with wire brush or scored hacksaw blade to increase electrochemical surface area 300%.',
      'Alternate positive and negative plates with corrugated plastic separators in cell jar (e.g. 3 positive, 4 negative per 2.1V cell).',
      'Pour diluted electrolyte (ALWAYS add acid slowly to distilled water, NEVER water to acid).',
      'Begin Planté formation cycling: Charge at 2.4V/cell, discharge through resistor, reverse charge slightly, and repeat 10-15 cycles until positive plates develop rich chocolate-brown PbO2 coating.'
    ],
    safetyWarnings: [
      'Sulfuric acid causes catastrophic chemical burns and blindness. Full splash goggles, nitrile gloves, and baking soda neutralizer on standby.',
      'Explosive hydrogen gas released during charging. Ensure copious cross-ventilation; zero sparks.',
      'Lead toxicity: Wash hands thoroughly; do not ingest or inhale casting fumes.'
    ],
    acceptanceTests: [
      'Each cell produces 2.12V resting open-circuit voltage when fully charged.',
      'Specific gravity rises from 1.150 discharged to 1.220 fully charged on hydrometer.',
      'Sustains 5A load for 4 hours without cell voltage falling below 1.75V.'
    ],
    failureModesAndRecovery: [
      'Sudden voltage drop in one cell: Dendrite or lead shed shorting plates. Lift plate pack, rinse sediment from jar bottom, replace separator.'
    ],
    citations: ['Planté, Gaston: The Storage of Electrical Energy (1883)', 'Vinal, George: Storage Batteries (John Wiley & Sons)'],
    estimatedBuildHours: 14,
    criticality: 'Civilizational Infrastructure'
  },
  {
    id: 'pelton-hydro-turbine',
    name: 'Pelton Wheel Micro-Hydro Turbine',
    category: 'Energy & Power',
    tier: 'Early Industrial',
    summary: 'Impulse water turbine using split hemispherical buckets to extract up to 85% kinetic energy from high-head streams.',
    description: 'Converts high-pressure water jets from mountain streams into rotary mechanical power. Water hits the sharp splitter ridge of each Pelton cup, reversing flow 165 degrees and transferring nearly all momentum to the shaft with minimal turbulence.',
    prerequisites: ['hydraulic-ram-pump'],
    unlocks: ['rotary-generator-dynamo', 'grist-mill-automation'],
    billOfMaterials: [
      { name: 'Pelton runner wheel with spoon cups', quantity: '1 unit (25cm dia)', purpose: 'Impulse runner rotor', salvagedAlternative: 'Cast aluminum spoons bolted to circular steel disc or 3D/carved hardwood mold', sourceClassification: 'Manufactured' },
      { name: 'Brass or steel tapered water jet nozzle', quantity: '6-12 mm orifice', purpose: 'Converts static pressure head to velocity jet', salvagedAlternative: 'Turned brass plumbing hose nozzle', sourceClassification: 'Scrap / Salvage' },
      { name: 'Sealed pillow block bearings & 20mm steel shaft', quantity: '1 set', purpose: 'Low-friction rotational support', salvagedAlternative: 'Bicycle wheel hub or car alternator shaft', sourceClassification: 'Scrap / Salvage' },
      { name: 'Permanent magnet DC motor or car alternator', quantity: '1 unit', purpose: 'Electrical generation', salvagedAlternative: 'Treadmill DC motor or brushless washing machine motor', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Survey stream for head (minimum 10m vertical fall recommended) and flow rate (liters per second).',
      'Plumb penstock pipe (2" to 3" diameter) from intake pool down to turbine house with smooth gradual bends.',
      'Fabricate Pelton runner: bolt 16-20 twin-bucket spoons symmetrically around periphery of circular steel hub.',
      'Enclose runner in shroud housing to capture splashing water. Aim jet nozzle tangentially at pitch circle of runner cups.',
      'Couple turbine shaft to alternator with pulley drive ratio sized so runner operates at 50% of jet runaway speed.'
    ],
    safetyWarnings: [
      'High-velocity water jet can penetrate skin and cause lethal embolisms. Never place hands in path of active nozzle.',
      'Over-speed runaway: If electrical load disconnects, turbine speed can double; balance runner dynamically to prevent catastrophic flywheel burst.'
    ],
    acceptanceTests: [
      'Rotates silently under full jet stream with clean water discharge dropping straight down from shroud.',
      'Produces continuous electrical output matching calculated hydraulic power ($P = 9.81 \\times Q \\times H \\times 0.6$).'
    ],
    failureModesAndRecovery: [
      'Cavitation and eroded bucket splitters: Debris in water or blunt splitter ridge. Install 1mm intake screen at penstock header pond.'
    ],
    citations: ['Harvey, Adam: Micro-Hydro Design Manual (ITDG Publishing)', 'US Dept of the Interior: Water Measurement Manual'],
    estimatedBuildHours: 16,
    criticality: 'Civilizational Infrastructure'
  },
  {
    id: 'dakin-antiseptic',
    name: "Dakin's Antiseptic Wound Irrigation Solution",
    category: 'Medical & Health',
    tier: 'Early Industrial',
    summary: 'Buffered 0.5% sodium hypochlorite solution developed during WWI to debride necrotic tissue without damaging living cells.',
    description: 'Alexis Carrel and Henry Dakin proved that strong antiseptics like carbolic acid killed patient leukocytes faster than bacteria. By buffering dilute sodium hypochlorite with sodium bicarbonate to neutral pH (7.5-8.0), Dakin solution dissolves dead tissue, destroys bacteria and viruses on contact, while leaving granulating flesh unharmed.',
    prerequisites: [],
    unlocks: ['sterile-wound-debridement', 'field-surgical-care'],
    billOfMaterials: [
      { name: 'Unscented plain sodium hypochlorite bleach (5.25% - 6%)', quantity: '100 mL', purpose: 'Active chlorine antiseptic agent', salvagedAlternative: 'Freshly synthesized electrochemical hypochlorite', sourceClassification: 'Manufactured' },
      { name: 'Sodium bicarbonate (baking soda, food grade)', quantity: '10 g', purpose: 'pH buffer to prevent tissue chemical burn', salvagedAlternative: 'Refined trona mineral or wood-ash bicarbonate', sourceClassification: 'Synthesized' },
      { name: 'Boiled distilled or sterile pure water', quantity: '1000 mL', purpose: 'Sterile solvent', salvagedAlternative: 'Slow sand filtered water boiled 15 min and cooled', sourceClassification: 'Synthesized' },
      { name: 'Amber glass or opaque container', quantity: '1 L', purpose: 'Light-shielded storage vessel', salvagedAlternative: 'Dark beer bottle wrapped in aluminum foil', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Boil 1000 mL of clean water in stainless steel or enamel pot for 15 minutes. Cool covered to room temperature.',
      'Dissolve 10 grams (approx 2 teaspoons) of sodium bicarbonate completely into the water.',
      'Add 95 mL of fresh unscented 5.25% bleach to produce Full-Strength Dakin (0.5%), or 48 mL for Half-Strength (0.25%).',
      'Test pH with litmus paper: Must be between 7.4 and 8.0. If too basic, add tiny pinches of bicarbonate.',
      'Transfer to clean dark bottle. Label with date and strength. Store in cool dark place; discard after 7 days.'
    ],
    safetyWarnings: [
      'NEVER use scented, splash-less, or detergent-enhanced laundry bleaches (toxic industrial surfactants).',
      'Do not apply directly to eyes or open peritoneal abdominal cavity.',
      'Must be freshly mixed; active chlorine decomposes under sunlight and warmth within 48-72 hours.'
    ],
    acceptanceTests: [
      'Solution exhibits faint chlorine scent without stinging smell of raw bleach.',
      'pH reads neutral/mildly alkaline (7.5 - 8.0) on indicator paper.',
      'Non-irritating on intact test skin patch after 5-minute contact.'
    ],
    failureModesAndRecovery: [
      'Patient reports severe burning sensations: Solution is unbuffered or too concentrated. Flush immediately with sterile saline; verify bicarbonate buffering.'
    ],
    citations: ['Carrel, A. & Dehelly, G.: The Treatment of Infected Wounds (1917)', 'British Medical Journal: Dakin Solution in Modern Wound Management'],
    estimatedBuildHours: 1,
    criticality: 'Essential Survival'
  },
  {
    id: 'penicillin-culturing',
    name: 'Penicillium Mold Culture & Surface Fermentation',
    category: 'Medical & Health',
    tier: 'Early Industrial',
    summary: 'Surface fermentation of Penicillium chrysogenum on carbohydrate broth with charcoal adsorption extraction.',
    description: 'During WWII, the Northern Regional Research Laboratory developed methods to culture high-yielding Penicillium chrysogenum strains on agricultural residues (corn steep liquor, lactose). Penicillin blocks bacterial peptidoglycan cell-wall synthesis, halting Gram-positive bacterial infections (Streptococcus, Staph, Clostridium, Anthrax).',
    prerequisites: ['slow-sand-filter', 'charcoal-retort'],
    unlocks: ['antibiotic-isolation', 'sterile-culture-lab'],
    billOfMaterials: [
      { name: 'Spore source (Penicillium mold from moldy cantaloupe / citrus)', quantity: 'Isolate', purpose: 'Fungal inoculum strain', salvagedAlternative: 'Blue-green mold found on aged organic melons or whole rye bread', sourceClassification: 'Wild / Natural' },
      { name: 'Carbohydrate nutrient broth (lactose, sucrose, mineral salts)', quantity: '5 L', purpose: 'Fermentation growth substrate', salvagedAlternative: 'Boiled corn kernels broth + milk whey (lactose) + 1g epsom salts', sourceClassification: 'Wild / Natural' },
      { name: 'Activated powdered charcoal (acid washed)', quantity: '50 g', purpose: 'Penicillin molecule adsorption carrier', salvagedAlternative: 'Charcoal retort dust treated with dilute acid and washed', sourceClassification: 'Synthesized' },
      { name: 'Solvent (Cold ethyl acetate or high-proof ethanol)', quantity: '250 mL', purpose: 'Elution extraction solvent', salvagedAlternative: 'Distilled 90% ethanol chilled to 0°C', sourceClassification: 'Synthesized' },
      { name: 'Sterile shallow glass trays with foil covers', quantity: '6 units', purpose: 'Surface pellicle growth vessels', salvagedAlternative: 'Wide glass Pyrex baking dishes boiled in pressure cooker', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Prepare nutrient medium: Boil 200g sweet corn steep liquor, 40g lactose/whey, 3g sodium nitrate, 0.5g MgSO4 in 1L water. Autoclave/boil 30 min.',
      'Pour 2cm depth into sterilized shallow trays under sterile laminar box (alcohol wiped enclosure with candle updraft).',
      'Inoculate surface with blue-green Penicillium spores. Incubate at 24°C in dark for 6-8 days.',
      'A dense wrinkled green-white velvet mat forms, sweating amber droplets of yellow penicillin broth underneath.',
      'Filter liquid through cloth. Acidify broth to pH 2.5 with cold vinegar. Shake with activated charcoal to adsorb penicillin. Filter charcoal and elute with chilled ethyl acetate/alcohol at neutral pH.'
    ],
    safetyWarnings: [
      'SEVERE ALLERGY RISK: Anaphylaxis risk in penicillin-allergic individuals. Always perform scratch skin test first.',
      'Contamination risk: Wild molds can produce lethal mycotoxins (e.g. Aspergillus flavus aflatoxins). Inspect culture morphology microscopically before extraction.',
      'Crude extracts are strictly for life-threatening emergencies when modern medical facilities are destroyed.'
    ],
    acceptanceTests: [
      'Agar plate seeded with safe Bacillus subtilis shows distinct 20mm clear zone of bacterial inhibition around paper disc soaked in extract.',
      'Broth emits distinctive sweet mushroom/bread-like Penicillium odor without rancid bacterial slime.'
    ],
    failureModesAndRecovery: [
      'Culture turns black, pink, or gray: Contamination by wild competing molds. Discard entirely, sterilize glassware 1 hour in boiling water, restart.'
    ],
    citations: ['Florey, H.W. et al.: Antibiotics: A Survey of Penicillin (Oxford 1949)', 'US Dept of Agriculture: NRRL Penicillium Chrysogenum Bulletin'],
    estimatedBuildHours: 40,
    criticality: 'Civilizational Infrastructure'
  },
  {
    id: 'sulfuric-acid-chamber',
    name: 'Lead-Chamber Sulfuric Acid Synthesis',
    category: 'Chemistry & Reagents',
    tier: 'Early Industrial',
    summary: 'Continuous production of sulfuric acid (H2SO4) via oxidation of sulfur dioxide using nitrogen oxide catalysts.',
    description: 'Sulfuric acid is the "mother of chemicals" in industrial technology—essential for battery electrolyte, fertilizers, chemical pickling, gunpowder refining, and medicine synthesis. The lead-chamber process burns sulfur to produce SO2, which reacts with steam and nitric oxide catalysts inside lead-lined chambers.',
    prerequisites: ['charcoal-retort'],
    unlocks: ['lead-acid-reconstruction', 'nitric-acid-distillation', 'chemical-fertilizers'],
    billOfMaterials: [
      { name: 'Elemental sulfur or iron pyrite rocks (FeS2)', quantity: '5 kg', purpose: 'Sulfur dioxide source', salvagedAlternative: 'Agricultural sulfur dusting powder or mineral pyrite', sourceClassification: 'Wild / Natural' },
      { name: 'Potassium nitrate (saltpeter) or nitric acid', quantity: '500 g', purpose: 'Nitrogen dioxide oxidizing catalyst', salvagedAlternative: 'Refined dung-bed saltpeter leachate', sourceClassification: 'Wild / Natural' },
      { name: 'Sheet lead or heavy borosilicate glass reaction train', quantity: '1 chamber', purpose: 'Acid-proof oxidation chamber', salvagedAlternative: 'Pyrex carboys or ceramic sewer pipe sections', sourceClassification: 'Scrap / Salvage' },
      { name: 'Steam generator (kettle with copper tube)', quantity: '1 unit', purpose: 'Water vapor injection', salvagedAlternative: 'Sealed water pot on charcoal brazier', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Construct sealed chamber from welded lead sheets or connected glass vessels with acid-resistant joints.',
      'Ignite sulfur/pyrite in iron combustion pot with regulated air intake to generate SO2 gas stream.',
      'Introduce nitric acid vapors (or saltpeter treated with sulfuric acid) alongside sulfur dioxide and steam into chamber.',
      'Nitrogen dioxide oxidizes SO2 to SO3, which dissolves instantly in water droplets to condense as "chamber acid" (65% H2SO4) on floor.',
      'Syphon collected chamber acid into glass retorts; boil gently to evaporate water until concentrated oil of vitriol (93% H2SO4) forms.'
    ],
    safetyWarnings: [
      'HIGH CHEMICAL DANGER: Hot concentrated sulfuric acid causes instantaneous flesh destruction and charring. Full neoprene protective suit and respirator.',
      'Sulfur dioxide and NOx gas are severe pulmonary irritants: Inhaling fumes causes pulmonary edema. Operate exclusively outdoors with scrubbers.',
      'Water added to concentrated acid will boil violently and explode into caustic steam.'
    ],
    acceptanceTests: [
      'Concentrated liquid is heavy, oily, and completely transparent with density > 1.80 g/cm³.',
      'Instantly chars wood splinters or paper strips black on contact (dehydration reaction).'
    ],
    failureModesAndRecovery: [
      'Nitric catalyst escapes out chimney without oxidizing: Chamber temperature too hot (>80°C) or excess draft. Reduce sulfur burn rate, cool chamber walls with external water spray.'
    ],
    citations: ['Lunge, George: The Manufacture of Sulphuric Acid and Alkali', 'Taylor: A History of Industrial Chemistry'],
    estimatedBuildHours: 30,
    criticality: 'Civilizational Infrastructure'
  },
  {
    id: 'spark-gap-radio',
    name: 'Marconi Rotary Spark-Gap Radio Transmitter & Coherer',
    category: 'Communications & Signals',
    tier: 'Electromechanical',
    summary: 'Direct damped-wave electromagnetic transmitter and nickel-silver powder coherer receiver for Morse telegraphy.',
    description: 'The foundation of wireless radio communication (Hertz, Tesla, Marconi). A high-voltage spark jumping across an inductor-capacitor tank circuit rings the resonant LC circuit, radiating high-power damped RF waves into an elevated wire antenna across dozens of kilometers.',
    prerequisites: ['lead-acid-reconstruction'],
    unlocks: ['emergency-broadcast-net', 'wire-telegraph-repeater'],
    billOfMaterials: [
      { name: 'High-voltage induction coil or car ignition coil', quantity: '1 unit', purpose: 'Step-up voltage generator (15,000 - 30,000V)', salvagedAlternative: 'Automotive 12V ignition coil with 555-timer / buzzer interrupter', sourceClassification: 'Scrap / Salvage' },
      { name: 'Leyden jar capacitors (glass bottles lined with foil)', quantity: '4 jars', purpose: 'High-voltage RF tank capacitor (10-20 nF)', salvagedAlternative: 'Glass wine bottles wrapped inside and out with heavy aluminum foil', sourceClassification: 'Scrap / Salvage' },
      { name: 'Heavy copper tubing RF tank coil', quantity: '6-8 turns', purpose: 'Tuned inductor antenna coupler', salvagedAlternative: 'Heavy bare copper ground wire wound around wooden pegs', sourceClassification: 'Scrap / Salvage' },
      { name: 'Brass spark electrodes (spherical gap)', quantity: '1 pair', purpose: 'Quenched spark discharge gap', salvagedAlternative: 'Two large brass carriage bolts rounded with file', sourceClassification: 'Scrap / Salvage' },
      { name: 'Elevated long-wire antenna & deep earth ground rod', quantity: '30 m wire', purpose: 'Electromagnetic radiator', salvagedAlternative: 'Solid copper wire hoisted into tall trees via halyard', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Connect 12V battery through Morse telegraph key into 12V automotive ignition coil primary winding.',
      'Wire high-voltage secondary output across brass spark gap spaced 3-5mm apart.',
      'Connect Leyden jar capacitors and copper tank coil in series across spark gap to create resonant oscillator.',
      'Tap antenna and ground rod into intermediate turns of tank coil to match impedance and tune resonant frequency.',
      'Fabricate receiver coherer: Glass tube packed loosely with 95% nickel / 5% silver filings between two brass plugs; wire to battery, relay, and electromagnetic knocker tapper.'
    ],
    safetyWarnings: [
      'LETHAL HIGH VOLTAGE: Spark circuit carries up to 30,000V at RF frequencies. Capacitors retain lethal charges long after power disconnect. Discharge with insulated grounding stick.',
      'Generates wideband RF electromagnetic interference across all radio spectra. In peacetime, operate ONLY into shielded 50-ohm dummy load for calibration.'
    ],
    acceptanceTests: [
      'Crisp snappy bright blue-white spark discharge with rhythmic audio crack.',
      'Coherer receiver clicks relay reliably at 1 km range upon transmitting Morse pulses.'
    ],
    failureModesAndRecovery: [
      'Weak spark or hot coil: Interrupter contacts pitted or arcing. Add 0.5uF snubber capacitor across interrupter points.'
    ],
    citations: ['Marconi, Guglielmo: Wireless Telegraphy (Nobel Lecture 1909)', 'Collins, A. Frederick: Wireless Telegraphy: Its History, Theory and Practice'],
    estimatedBuildHours: 12,
    criticality: 'Civilizational Infrastructure'
  },
  {
    id: 'one-time-pad-crypto',
    name: 'Manual Vernam One-Time Pad (OTP) Cipher Station',
    category: 'Communications & Signals',
    tier: 'Primitive / Stone Age',
    summary: 'Mathematically unbreakable symmetric stream cipher requiring zero electricity, computers, or specialized hardware.',
    description: 'Proven mathematically by Claude Shannon (1949) to be unconditionally secure if the key is truly random, as long as the plaintext, kept strictly secret, and used exactly once. Operates using simple modulo-26 letter addition/subtraction or modular matrix tables.',
    prerequisites: [],
    unlocks: ['secure-field-comms', 'encrypted-recon-dispatch'],
    billOfMaterials: [
      { name: 'True random physical entropy source', quantity: '1 set', purpose: 'Key generation entropy', salvagedAlternative: '10-sided dice, tumbler with 26 labeled wooden tokens, or radioactive detector clicks', sourceClassification: 'Wild / Natural' },
      { name: 'Pre-printed twin key-sheets (Sender & Receiver pads)', quantity: 'Duplicate pairs', purpose: 'Identical synchronized key books', salvagedAlternative: 'Typewritten or meticulously inked grid paper with carbon copy', sourceClassification: 'Synthesized' },
      { name: 'Vigenère / Modulo-26 table card', quantity: '1 pocket card', purpose: 'Arithmetic lookup guide', salvagedAlternative: 'Hand-drawn 26x26 letter matrix on waterproof cardstock', sourceClassification: 'Synthesized' }
    ],
    buildSteps: [
      'Generate key text: Draw tokens randomly from tumbler (or roll dice) to form 5-letter random groups (e.g., XJKLP MQZTF). Record identical copies on Pad A and Pad B.',
      'Format plaintext into standard 5-letter blocks, stripping punctuation (e.g. WATER CACHE AT RIDGE).',
      'For each plaintext letter, add the corresponding key letter value using modular addition without carries (A=0, Z=25): $(P + K) \\pmod{26} = C$.',
      'Transmit ciphertext groups via radio or courier.',
      'Receiver decrypts by subtracting the identical key letter: $(C - K) \\pmod{26} = P$.',
      'CRITICAL DISPOSAL: Immediately burn or shred the used key page from the pad. Never reuse a single letter of key.'
    ],
    safetyWarnings: [
      'REUSE DESTROYS SECURITY: Reusing a single page of key (Two-Time Pad) completely breaks cipher mathematically via depth cryptanalysis (e.g., Project Venona).',
      'Do not use computer pseudo-random numbers (e.g. simple PRNGs); only physical atmospheric/mechanical entropy.'
    ],
    acceptanceTests: [
      'Test message encodes and decodes symmetrically with 100% character fidelity.',
      'Statistical frequency distribution of key sheet shows zero bias across all 26 characters.'
    ],
    failureModesAndRecovery: [
      'Desynchronization of pad pages between operators: Include pre-arranged 3-letter pad sheet index in message preamble.'
    ],
    citations: ['Shannon, Claude: Communication Theory of Secrecy Systems (Bell System Tech Journal 1949)', 'Kahn, David: The Codebreakers'],
    estimatedBuildHours: 2,
    criticality: 'Essential Survival'
  },
  {
    id: 'treadle-lathe',
    name: 'Heavy Timber Treadle Wood & Metal Lathe',
    category: 'Mechanics & Tools',
    tier: 'Agrarian & Forging',
    summary: 'Human-powered rotary turning machine capable of truing round shafts, cutting wooden pulleys, and machining metal bearings.',
    description: 'The lathe is the parent of all machine tools—the only tool capable of replicating itself and manufacturing precision round components (pistons, valves, bushings, screws). A heavy flywheel driven by foot treadle stores momentum for continuous unidirectional turning.',
    prerequisites: ['bloomery-furnace'],
    unlocks: ['precision-screw-cutting', 'hydraulic-cylinder-machining', 'steam-engine-piston'],
    billOfMaterials: [
      { name: 'Seasoned dense timber beams (10cm x 15cm x 2m)', quantity: '4 beams', purpose: 'Rigid bed ways and leg stand', salvagedAlternative: 'Squared oak or maple structural framing timbers', sourceClassification: 'Wild / Natural' },
      { name: 'Cast iron or concrete heavy flywheel (40-60 kg)', quantity: '1 unit (60cm dia)', purpose: 'Kinetic inertia accumulator', salvagedAlternative: 'Poured concrete disc in bicycle rim or truck brake drum', sourceClassification: 'Scrap / Salvage' },
      { name: 'Hardened steel headstock spindle & center pin', quantity: '1 assembly', purpose: 'Rotating workpiece drive arbor', salvagedAlternative: 'Car axle shaft and taper roller bearing assembly', sourceClassification: 'Scrap / Salvage' },
      { name: 'Forged tool rest & tailstock clamp assembly', quantity: '1 set', purpose: 'Rigid chisel support', salvagedAlternative: 'Fabricated from welded steel angle iron and acme rod', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Construct dual bed ways from twin oak beams spaced 4cm apart, planed dead flat and parallel.',
      'Mount headstock bearing blocks at left end with bronze bushings or salvaged ball bearings.',
      'Hang flywheel on crankshaft beneath bed. Connect crankshaft to foot treadle lever with hardwood connecting rod.',
      'Fabricate tailstock that slides along bed ways with locking wedge for securing varying workpiece lengths.',
      'Turn wooden drive pulleys first, then mount hardened carbon steel scrapers to machine bronze bushings and soft steel.'
    ],
    safetyWarnings: [
      'Entanglement hazard: Loose clothing, ties, long hair, or gloves will drag operator into spinning chuck. Tie back hair, roll sleeves above elbow.',
      'High-speed wood splitting: Inspect workpieces for cracks before mounting between centers; wear safety glasses.'
    ],
    acceptanceTests: [
      'Spindle rotates with less than 0.05mm runout (measured with dial indicator or feeler gauge).',
      'Turns true 50cm wooden cylinder with uniform diameter along full length within 0.2mm tolerance.'
    ],
    failureModesAndRecovery: [
      'Tool chatter and rough surface: Tool rest positioned too far from work or bed ways flexing. Move tool rest within 3mm of cut, cross-brace timber legs.'
    ],
    citations: ['Holtzapffel, Charles: Turning and Mechanical Manipulation', 'US Navy Machinist Mate Rating Manual (NAVEDTRA 14151)'],
    estimatedBuildHours: 25,
    criticality: 'Productivity Multiplier'
  },
  {
    id: 'lime-pozzolana-mortar',
    name: 'Calcined Lime & Pozzolanic Roman Cement',
    category: 'Metallurgy & Materials',
    tier: 'Primitive / Stone Age',
    summary: 'Hydraulic waterproof mortar made from burned limestone and pulverized volcanic ash or crushed fired brick.',
    description: 'Discovered by Roman engineers and standing for 2,000 years in the Pantheon. Pure lime mortar only hardens in air by absorbing CO2. By adding reactive amorphous aluminosilicates (pozzolana, crushed brick pottery dust), it hardens underwater via hydraulic calcium-silicate-hydrate crystallization.',
    prerequisites: ['charcoal-retort'],
    unlocks: ['stone-cistern-reservoir', 'blast-resistant-masonry', 'aqueduct-infrastructure'],
    billOfMaterials: [
      { name: 'Limestone rocks, seashells, or marble chunks (CaCO3)', quantity: '50 kg', purpose: 'Calcium carbonate source', salvagedAlternative: 'Crushed oyster shells from coastal middens or chalk', sourceClassification: 'Wild / Natural' },
      { name: 'Finely pulverized fired terracotta brick / pottery dust', quantity: '30 kg', purpose: 'Pozzolanic reactive silica/alumina', salvagedAlternative: 'Crushed roofing tiles or volcanic pumice ash sieved through 100-mesh', sourceClassification: 'Wild / Natural' },
      { name: 'Sharp clean washed masonry sand', quantity: '60 kg', purpose: 'Aggregate filler', salvagedAlternative: 'River sand free of organic silt and salt', sourceClassification: 'Wild / Natural' },
      { name: 'Kiln fuel (hardwood/charcoal)', quantity: '100 kg', purpose: 'Calcination heat (>900°C)', salvagedAlternative: 'Dense wood chunks in updraft stone kiln', sourceClassification: 'Wild / Natural' }
    ],
    buildSteps: [
      'Stack limestone chunks in stone flare kiln over wood fire. Burn continuously for 24-36 hours at 900°C until limestone converts to quicklime (CaO), losing 44% of weight as CO2.',
      'Carefully slake quicklime with water (violent exothermic boiling reaction: $CaO + H_2O \\rightarrow Ca(OH)_2$). Let slaked lime putty mature under water in pit for 7+ days.',
      'Grind fired clay bricks into fine powder passing through 100-mesh screen (pozzolana).',
      'Mix 1 part slaked lime putty, 1 part pozzolana powder, and 2.5 parts sharp washed sand with minimal water.',
      'Lay stone masonry or pack into wooden forms. Keep damp with wet burlap for 7 days to cure hydraulic crystals.'
    ],
    safetyWarnings: [
      'SEVERE CAUSTIC REACTION: Quicklime (CaO) boils instantly in water. Splatters cause permanent corneal burns and deep alkaline tissue destruction. Wear full goggles and rubber gloves.',
      'Silica dust inhalation: Wear dust mask when crushing pozzolana to prevent silicosis.'
    ],
    acceptanceTests: [
      'Mortar sets and hardens completely when fully submerged under water in a test jar after 72 hours.',
      'Cured mortar withstands hammer tap with sharp ringing sound, non-crumbly.'
    ],
    failureModesAndRecovery: [
      'Mortar turns to dusty powder: Lime was under-burned in kiln (retained CaCO3 core) or mix dried out too fast in direct sun. Burn limestone longer at higher temperature; keep work shaded and wet during curing.'
    ],
    citations: ['Vitruvius: De Architectura (Book II on Lime & Pozzolana)', 'Lea, F.M.: The Chemistry of Cement and Concrete'],
    estimatedBuildHours: 20,
    criticality: 'Essential Survival'
  },
  {
    id: 'solar-concentrator-still',
    name: 'Compound Parabolic Solar Thermal Still',
    category: 'Water & Sanitation',
    tier: 'Primitive / Stone Age',
    summary: 'Solar-thermal distillation apparatus purifying seawater, brackish groundwater, or chemical wastewater.',
    description: 'Unlike simple glass box solar stills that produce only 2-3 L/m²/day, a compound parabolic concentrator focuses solar radiation onto an evacuated or black-anodized evaporator pipe, boiling water into pure steam while condensing latent heat into incoming feedwater for 4x higher yield.',
    prerequisites: [],
    unlocks: ['sterile-medical-wash', 'salt-extraction-refining'],
    billOfMaterials: [
      { name: 'Polished aluminum sheet or mirrored Mylar film', quantity: '2 m²', purpose: 'Reflective solar concentrator trough', salvagedAlternative: 'Polished food-grade stainless sheet or aluminized rescue blankets glued to plywood', sourceClassification: 'Scrap / Salvage' },
      { name: 'Copper evaporator pipe coated in flat black enamel', quantity: '1.5 m (50mm dia)', purpose: 'Solar thermal absorption boiler', salvagedAlternative: 'Black iron plumbing pipe or heavy copper pipe', sourceClassification: 'Scrap / Salvage' },
      { name: 'Glass envelope tube or transparent acrylic sleeve', quantity: '1.5 m (75mm dia)', purpose: 'Thermal insulation greenhouse jacket', salvagedAlternative: 'Fluorescent light bulb tube washed clean', sourceClassification: 'Scrap / Salvage' },
      { name: 'Counter-flow copper condensation coil', quantity: '3 m', purpose: 'Heat recovery steam condenser', salvagedAlternative: 'Flexible copper tubing immersed in raw feedwater bucket', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Cut parabolic wooden rib templates and face with curved 2mm plywood backing.',
      'Affix reflective polished aluminum sheet across parabolic curve with focal line 25cm in front of surface.',
      'Mount black-coated copper boiler tube along focal line inside glass jacket.',
      'Plumb gravity-fed float valve to maintain 2cm water level inside boiler pipe.',
      'Direct steam output into coiled copper condenser submerged in incoming cold seawater tank to preheat intake.'
    ],
    safetyWarnings: [
      'Blinding solar focal reflection: Never look directly into reflective trough; wear UV-rated welding shade 5 goggles.',
      'Focal line exceeds 200°C: Severe contact thermal burns. Insulate exposed steam fittings with wool wrap.'
    ],
    acceptanceTests: [
      'Produces continuous stream of distilled water (> 8 L per sunny day per square meter).',
      'Distillate total dissolved solids (TDS) reads < 10 ppm from 35,000 ppm seawater input.'
    ],
    failureModesAndRecovery: [
      'Scale buildup in boiler pipe: Calcium and salt crusting reduces heat transfer. Flush boiler pipe weekly with dilute vinegar or citric acid.'
    ],
    citations: ['Duffie & Beckman: Solar Engineering of Thermal Processes', 'UN Department of Economic and Social Affairs: Solar Distillation Manual'],
    estimatedBuildHours: 10,
    criticality: 'Essential Survival'
  },
  {
    id: 'zeer-pot-cooling',
    name: 'Evaporative Zeer Pot Refrigerator',
    category: 'Food & Preservation',
    tier: 'Primitive / Stone Age',
    summary: 'Electricity-free evaporative cooler maintaining contents 6°C to 12°C below ambient desert heat.',
    description: 'Invented by Mohammed Bah Abba in Nigeria. Two nested unglazed porous earthenware pots with damp sand sandwiched between them. As water evaporates through the porous outer pot walls, it draws latent heat of vaporization (2260 kJ/kg) from the inner storage chamber, preserving vegetables, vaccines, and perishable medicines for weeks without electricity.',
    prerequisites: [],
    unlocks: ['root-cellar-storage', 'insulin-perishable-preservation'],
    billOfMaterials: [
      { name: 'Large unglazed porous terra cotta clay pot (50cm dia)', quantity: '1 unit', purpose: 'Outer evaporative cooling envelope', salvagedAlternative: 'Porous unsealed clay planter or hand-built coiled clay urn', sourceClassification: 'Wild / Natural' },
      { name: 'Smaller glazed or unglazed clay pot (35cm dia)', quantity: '1 unit', purpose: 'Inner dry food storage chamber', salvagedAlternative: 'Unglazed earthenware jar with sealed interior', sourceClassification: 'Wild / Natural' },
      { name: 'Clean coarse river sand', quantity: '15 kg', purpose: 'Thermal mass & capillary water wick', salvagedAlternative: 'Washed creek sand', sourceClassification: 'Wild / Natural' },
      { name: 'Heavy burlap sack or coarse linen cloth', quantity: '1 piece', purpose: 'Moist insulated top lid', salvagedAlternative: 'Multiple layers of clean wet cotton toweling', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Fill the bottom 5cm of the large pot with coarse clean sand.',
      'Place the smaller pot concentrically inside the large pot, aligning rims.',
      'Fill the annular gap between the two pots completely with sand, tamping lightly.',
      'Saturate the sand packing with cold water until fully damp (approx 2-3 liters).',
      'Place food or medicine inside inner dry pot. Cover top with damp burlap cloth. Place in shaded area with steady breeze.'
    ],
    safetyWarnings: [
      'Relies on relative humidity: Efficacy drops significantly in humid tropical conditions (>70% RH); optimal in arid dry climates.',
      'Do not allow raw meat or poultry juices to contaminate sand bed, which breeds pathogenic bacteria.'
    ],
    acceptanceTests: [
      'Interior temperature stabilizes at least 8°C below external shade temperature in dry breeze.',
      'Fresh leafy greens remain crisp for >14 days without wilting.'
    ],
    failureModesAndRecovery: [
      'Cooling fails: Sand dried out or zero air circulation. Add water twice daily; elevate pot on stones in breezy corridor.'
    ],
    citations: ['Bah Abba, Mohammed: Rolex Award for Enterprise (2000)', 'Practical Action Technical Brief: Evaporative Cooling'],
    estimatedBuildHours: 2,
    criticality: 'Essential Survival'
  },
  {
    id: 'crystal-radio-receiver',
    name: 'Galena Crystal RF Detector Radio',
    category: 'Communications & Signals',
    tier: 'Early Industrial',
    summary: 'Passive radio receiver powered 100% by ambient electromagnetic radio waves without batteries.',
    description: 'Uses a natural lead sulfide crystal (galena) touched by a fine phosphor bronze "cat whisker" wire point-contact diode to demodulate AM radio signals. The incoming RF signal picked up by an elevated antenna is tuned by an inductor and detected directly into high-impedance headphones.',
    prerequisites: ['bloomery-furnace'],
    unlocks: ['emergency-broadcast-net'],
    billOfMaterials: [
      { name: 'Galena mineral crystal (lead sulfide PbS)', quantity: '1 piece', purpose: 'Point-contact semiconductor rectifying diode', salvagedAlternative: '1N34A germanium diode or pyrites / razor blade touched by pencil lead', sourceClassification: 'Wild / Natural' },
      { name: 'Enamelled copper magnet wire (24-28 AWG)', quantity: '50 m', purpose: 'Hand-wound RF tuning coil', salvagedAlternative: 'Wire stripped from discarded transformer or electric motor stator', sourceClassification: 'Scrap / Salvage' },
      { name: 'Cardboard cylinder (oatmeal box or PVC pipe)', quantity: '10cm dia x 20cm', purpose: 'Coil winding coil former', salvagedAlternative: 'Dry rolled paper tube or bamboo section', sourceClassification: 'Scrap / Salvage' },
      { name: 'High-impedance magnetic headphones (2000+ ohms)', quantity: '1 unit', purpose: 'Sensitive audio transducer', salvagedAlternative: 'Piezoelectric crystal earphone or 8-ohm headphone connected through audio transformer', sourceClassification: 'Scrap / Salvage' },
      { name: 'Long-wire antenna (20-30m) & cold water pipe ground', quantity: '1 assembly', purpose: 'RF energy harvest collector', salvagedAlternative: 'Insulated copper wire strung between trees + copper rod driven in damp earth', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Wind 100 close turns of enamel magnet wire neatly around cardboard cylinder. Scrape insulation strip along top line for slider contact.',
      'Mount galena crystal in brass cup or solder blob. Mount springy fine wire (cat whisker) on adjustable arm.',
      'Connect long-wire antenna to one side of coil, ground rod to other side.',
      'Wire detector and crystal headphone in series across tuned coil slider.',
      'Put on headphones; probe different spots on crystal surface with cat whisker tip while adjusting slider until clear audio broadcast is heard.'
    ],
    safetyWarnings: [
      'LIGHTNING HAZARD: Long outdoor antennas must have heavy-duty knife switch to direct earth ground during thunderstorms.',
      'Galena contains lead: Wash hands after handling raw minerals; do not ingest.'
    ],
    acceptanceTests: [
      'Picks up local AM emergency broadcast station voice and music clearly with zero battery connected.',
      'Audio volume increases when grounding to deep water table rod.'
    ],
    failureModesAndRecovery: [
      'No sound in headphones: Modern low-impedance 32-ohm earbuds do not work directly without 1000:8 ohm audio transformer. Use piezo element or matching transformer.'
    ],
    citations: ['US Army Signal Corps Technical Manual TM 11-455', 'Gernsback, Hugo: The Boy\'s Book of Radio'],
    estimatedBuildHours: 3,
    criticality: 'Essential Survival'
  },
  {
    id: 'savonius-wind-turbine',
    name: 'Savonius Vertical-Axis Wind Turbine',
    category: 'Energy & Power',
    tier: 'Early Industrial',
    summary: 'Omnidirectional low-speed high-torque vertical wind rotor fabricated from split 55-gallon oil drums.',
    description: 'Invented by Sigurd Savonius (1922). Operates primarily on aerodynamic drag rather than lift. The two offset semicircular scoops funnel wind from any direction without needing a tail vane or yaw steering mechanism, generating high starting torque ideal for mechanical water pumping or low-RPM alternators.',
    prerequisites: ['charcoal-retort'],
    unlocks: ['wind-powered-water-pump', 'rotary-generator-dynamo'],
    billOfMaterials: [
      { name: '55-gallon steel drum', quantity: '1 unit', purpose: 'S-shaped rotor scoop blades', salvagedAlternative: 'Two plastic 200L barrels cut in half lengthwise', sourceClassification: 'Scrap / Salvage' },
      { name: '1-inch steel axle shaft & self-aligning bearings', quantity: '2 m shaft', purpose: 'Vertical rotational axis', salvagedAlternative: 'Automobile rear wheel hub and spindle', sourceClassification: 'Scrap / Salvage' },
      { name: 'Structural steel angle or timber framework', quantity: '1 frame', purpose: 'Tower and bearing support gantry', salvagedAlternative: 'Treated 4x4 dimensional lumber bolted together', sourceClassification: 'Scrap / Salvage' },
      { name: 'Pulley and belt step-up drive (1:5 ratio)', quantity: '1 set', purpose: 'RPM matching to generator or piston pump', salvagedAlternative: 'Bicycle chain and sprockets or washing machine belt drive', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Cut 55-gallon drum cleanly in half lengthwise to create two identical semicircular troughs.',
      'Weld or bolt the two half-drums to circular end discs with an overlap ratio of 0.2 (gap in center lets air flow across).',
      'Center and lock rotor assembly onto vertical 1" shaft with set screws.',
      'Mount shaft between two heavy sealed pillow-block bearings on rigid A-frame tower.',
      'Couple bottom shaft extension to reciprocating water pump rod or permanent magnet generator.'
    ],
    safetyWarnings: [
      'High mechanical inertia: A spinning steel drum carries immense torque. Never attempt to grab or stop rotor by hand.',
      'Install mechanical disc brake or furling flap to prevent overspeed destruction in gale-force winds (>60 km/h).'
    ],
    acceptanceTests: [
      'Self-starts rotating smoothly in light breezes under 8 km/h from any compass direction.',
      'Generates continuous reciprocating stroke lifting 500L water/hour through 10m head.'
    ],
    failureModesAndRecovery: [
      'Violent vibration at specific speeds: Rotor out of balance. Add lead counterweights to lighter scoop until rotor stays stationary at any random angle when resting.'
    ],
    citations: ['Savonius, S.J.: The S-Rotor and Its Applications (Mechanical Engineering 1931)', 'Brace Research Institute: Savonius Rotor Construction Manual'],
    estimatedBuildHours: 12,
    criticality: 'Productivity Multiplier'
  },
  {
    id: 'biochar-soil-remediation',
    name: 'Terra Preta Biochar & Microbial Inoculation',
    category: 'Food & Preservation',
    tier: 'Primitive / Stone Age',
    summary: 'High-porosity recalcitrant pyrolyzed carbon inoculated with compost tea, creating permanent soil fertility.',
    description: 'Modeled after Amazonian Terra Preta soils that remain fertile after 2,500 years. Raw charcoal added to soil stunts plant growth by scavenging nitrogen; when "charged" with compost tea, fish emulsion, or livestock urine, biochar\'s immense surface area (400 m²/g) permanently locks nutrients and moisture in the root zone.',
    prerequisites: ['charcoal-retort'],
    unlocks: ['permanent-intensive-farming'],
    billOfMaterials: [
      { name: 'Crushed charcoal fines (<6mm pieces)', quantity: '50 kg', purpose: 'Porous carbon matrix habitat', salvagedAlternative: 'Charcoal retort fines and siftings', sourceClassification: 'Synthesized' },
      { name: 'Aerated compost tea or active barnyard manure slurry', quantity: '40 L', purpose: 'Biological nitrogen and fungal inoculant', salvagedAlternative: 'Worm castings leachate or fresh livestock urine diluted 1:5', sourceClassification: 'Wild / Natural' },
      { name: 'Finely ground limestone or rock dust', quantity: '5 kg', purpose: 'Mineral micronutrient re-mineralization', salvagedAlternative: 'Basalt quarry dust or sifted wood ash', sourceClassification: 'Wild / Natural' }
    ],
    buildSteps: [
      'Crush lump charcoal with tamper until grain size is between 1mm and 6mm (do not pulverize to dust).',
      'Mix charcoal fines with equal volume of mature thermophilic compost or manure slurry in large tub.',
      'Add rock dust and keep mixture thoroughly moist at 25°C for 14-21 days to cultivate mycorrhizal fungi and nitrifying bacteria.',
      'Check temperature: Internal warmth indicates active biological colonization ("charging").',
      'Broadcast into garden beds at 10% volume by soil depth (10L charged biochar per square meter); incorporate to 15cm.'
    ],
    safetyWarnings: [
      'Inhalation of black carbon dust causes pneumoconiosis: Always wet charcoal before crushing or wear NIOSH P100 mask.',
      'Never apply raw, uncharged charcoal directly to crops; it causes severe nitrogen immobilization and yellow chlorosis.'
    ],
    acceptanceTests: [
      'Treated soil retains 50% more moisture during drought compared to untreated control plots.',
      'Earthworm count in root zone increases 3x within 60 days of application.'
    ],
    failureModesAndRecovery: [
      'Stunted yellow seedlings: Biochar was under-charged and stole available soil nitrogen. Top-dress bed with compost tea or dilute chicken manure tea.'
    ],
    citations: ['Lehmann & Joseph: Biochar for Environmental Management', 'Glaser et al.: Ameliorating Physical and Chemical Properties of Highly Weathered Soils in the Tropics with Charcoal'],
    estimatedBuildHours: 4,
    criticality: 'Productivity Multiplier'
  }
];

