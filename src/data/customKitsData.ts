import { CustomSurvivalKit } from '../types';

export const INITIAL_CUSTOM_KITS: CustomSurvivalKit[] = [
  {
    id: 'kit-dried-meats',
    title: 'Off-Grid Wilderness Meat Curing & Biltong Jerky Infrastructure',
    category: 'Food & Preservation',
    tier: 'Primitive / Stone Age',
    sourceFileName: 'field_manual_meat_curing_and_drying.pdf',
    sourceFileType: 'application/pdf',
    summary: 'Complete infrastructure for salt curing, cold smoking, and drying wild game or domestic lean meats without refrigeration. Prevents botulism and insect contamination.',
    infrastructureBlueprint: `### Blueprint: Solar-Convection Meat Dehydration & Smoke Box
1. **Frame:** Build a 60x60x120cm vertical pine/cedar timber frame elevated 40cm above ground.
2. **Insect Exclusion:** Line all intake and exhaust openings with 30-mesh stainless or brass fly screening.
3. **Convection Draft:** Bottom features a 15-degree angled black metal solar collector chute that heats air entering the base; top features a capped chimney to create continuous updraft.
4. **Hanging Racks:** Crossbeams fitted with notched food-grade stainless or willow skewers spaced 8cm apart.`,
    billOfMaterials: [
      { name: 'Lean game meat / beef', quantity: '10 kg', purpose: 'Feedstock (all white fat trimmed)', sourceClassification: 'Wild / Natural' },
      { name: 'Coarse non-iodized sea salt', quantity: '350 g', purpose: '3.5% dry rub cure osmotic barrier', sourceClassification: 'Manufactured' },
      { name: 'Oak or Hickory wood chips', quantity: '5 kg', purpose: 'Phenolic preservative cold smoke', sourceClassification: 'Wild / Natural' },
      { name: 'Insect screen mesh (30 mesh)', quantity: '2 m²', purpose: 'Fly and blowfly maggot barrier', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Trim 100% of white fat and sinew; slice lean muscle fibers strictly with the grain into 5mm uniform strips.',
      'Apply 3% salt cure dry rub with cracked black pepper and crushed wild garlic. Let cure for 3 hours at <15°C.',
      'Dip in 5% apple cider vinegar wash for 30 seconds to lower surface pH below 4.5 (inhibits mold).',
      'Hang strips onto skewers inside the dehydration box ensuring zero meat surfaces touch each other.',
      'Apply indirect hardwood smoke (<60°C) for 4 hours, then allow ambient solar updraft drying for 48 hours until strips bend and crack without wet moisture oozing.'
    ],
    fieldTips: [
      'Always trim every speck of fat: meat dries and keeps for a year, but fat goes rancid in 3 weeks.',
      'Cracking white fiber test: when bent backwards, white fibers should appear in the crack, confirming proper dry weight reduction (~55% water loss).',
      'Store finished jerky in airtight glass jars with dry wood-ash desiccant packets.'
    ],
    safetyWarnings: [
      'Never use resinous softwoods (pine, fir, spruce) for smoking—resins deposit toxic creosote and unpalatable terpenes.',
      'If ambient humidity exceeds 85%, auxiliary low heat (coals below box) must be maintained to prevent fungal surface spore growth.'
    ],
    aiKnowledgeSummary: 'Provides off-grid meat preservation without electricity. Salt-rub, vinegar wash, convection smoke-box, 5mm lean cuts, 55% weight reduction benchmark.',
    createdAt: '2026-10-10T14:00:00.000Z',
    isPaywalledTier3: false,
    authorCallsign: 'COMMANDER // DAMONE (313-DETROIT)'
  },
  {
    id: 'kit-fallen-tree-soil',
    title: 'Fallen Tree Decomposition & Hügelkultur High-Yield Bio-Fertilizer',
    category: 'Custom Infrastructure',
    tier: 'Primitive / Stone Age',
    sourceFileName: 'permaculture_hugel_soil_regeneration.txt',
    sourceFileType: 'text/plain',
    summary: 'Transforms decaying rotten logs, punky forest deadfall, and microbial leaf mold into an ultra-rich, self-fertilizing soil sponge that holds drought water for 5 years.',
    infrastructureBlueprint: `### Blueprint: Deep-Trench Hügelkultur Water-Retention Soil Bed
1. **Excavation:** Dig a 1.2m wide by 3m long trench, 40cm deep. Set excavated topsoil aside.
2. **Foundation Core:** Pack bottom with spongy, decomposing fallen hardwood logs (oak, beech, maple with visible mycelium).
3. **Nitrogen Balance:** Pack all voids with nitrogen greens (cut fresh grass, green weeds, comfrey, animal manure) at a 3:1 carbon-to-nitrogen ratio.
4. **Mound Layering:** Mound upwards 60cm above grade, topping with aged compost and the reserved topsoil.`,
    billOfMaterials: [
      { name: 'Decaying fallen hardwood logs (punky/rotted)', quantity: '400 kg', purpose: 'Carbon sponge & fungal water reservoir', sourceClassification: 'Wild / Natural' },
      { name: 'Fresh nitrogen greens & comfrey/nettles', quantity: '100 kg', purpose: 'Microbial fuel to accelerate fungal rot', sourceClassification: 'Wild / Natural' },
      { name: 'Excavated native topsoil & leaf mold', quantity: '300 kg', purpose: 'Top cap planting medium', sourceClassification: 'Wild / Natural' },
      { name: 'Wood ash from clean hardwood campfire', quantity: '15 kg', purpose: 'Potassium (K) & trace mineral doping', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Locate forest deadfall with white-rot fungi (soft punky wood that easily indents with a finger).',
      'Excavate trench along slope contour to act as a rainwater catch swale.',
      'Saturate dry logs with water before burial so the fungal reservoir starts at 100% field capacity.',
      'Pack greens tightly around logs to trigger warm thermophilic microbial colonization.',
      'Cap with soil and mulch heavily with straw or shredded autumn leaves to prevent surface evaporation.'
    ],
    fieldTips: [
      'Punky deadfall wood absorbs 3x its weight in water, meaning crops on the mound survive extreme summer droughts with zero irrigation.',
      'The gradual 10-year log decomposition radiates slight geothermal soil warmth (1-2°C), extending growing seasons by 3 weeks in autumn.',
      'Avoid black walnut logs (contains juglone which inhibits nightshade plants).'
    ],
    safetyWarnings: [
      'Ensure mound sides slope at maximum 45 degrees to prevent heavy rain washouts before root systems anchor the soil.',
      'Do not use fresh green non-rotted timber as the core without double nitrogen, or it will temporarily lock up soil nitrogen.'
    ],
    aiKnowledgeSummary: 'Decomposes fallen forest trees into drought-proof, self-fertilizing living soil beds using layered carbon/nitrogen microbial beds.',
    createdAt: '2026-10-10T14:05:00.000Z',
    isPaywalledTier3: false,
    authorCallsign: 'COMMANDER // DAMONE (313-DETROIT)'
  },
  {
    id: 'kit-woodgas-carburetor',
    title: 'Scrap Steel Woodgas Gasifier & Generator Carburetor Adapter',
    category: 'Energy & Power',
    tier: 'Early Industrial',
    sourceFileName: 'fema_stratified_downdraft_woodgas_plans.pdf',
    sourceFileType: 'application/pdf',
    summary: 'Synthesizes combustible carbon monoxide (CO) and hydrogen (H2) fuel from hardwood chips to run standard four-stroke gasoline engine generators without petroleum.',
    infrastructureBlueprint: `### Blueprint: Stratified Downdraft Woodgas Generator Core
1. **Reactor Chamber:** Fabricate from double-walled propane cylinder or 30-gallon steel drum with ceramic refractory insulation.
2. **Constriction Hearth:** 10cm diameter stainless choke plate with four 12mm radial air tuyeres.
3. **Cyclone Separator:** 15cm swirl canister to drop coarse ash particles out of the hot gas stream.
4. **Condenser & Wood-Chip Packed Bed Cooler:** Cools gas from 400°C to <40°C, condensing pyroligneous moisture.`,
    billOfMaterials: [
      { name: 'Discarded 20lb or 100lb propane tanks', quantity: '2 tanks', purpose: 'Reaction vessel (degassed and vented)', sourceClassification: 'Scrap / Salvage' },
      { name: 'High-temp refractory mortar / clay', quantity: '10 kg', purpose: 'Hearth thermal lining >1000°C', sourceClassification: 'Manufactured' },
      { name: 'Steel plumbing fittings (1.5" NPT)', quantity: '1 set', purpose: 'Air blast tuyeres & gas exit pipe', sourceClassification: 'Scrap / Salvage' },
      { name: 'Automotive pleated air filter', quantity: '1 unit', purpose: 'Final particulate soot safety barrier', sourceClassification: 'Scrap / Salvage' }
    ],
    buildSteps: [
      'Degas and purge propane cylinder with water before cutting.',
      'Weld hearth restriction plate 25cm above grate; install 4 tuyere air inlets pointing 15 degrees downward.',
      'Install cyclone separator downstream of gas outlet to scrub fly-ash.',
      'Route gas through cooling coil and wood-chip filter bed to remove moisture and tar.',
      'Fabricate T-junction air-mixing valve directly onto small engine carburetor intake.'
    ],
    fieldTips: [
      'Wood chips must be dry (<15% moisture) and uniform 2-4cm size to prevent bridging.',
      'Start draft with 12V bilge blower until gas ignites with a clear blue flame at flare port before switching to engine intake.'
    ],
    safetyWarnings: [
      'DEADLY CO HAZARD: Syngas contains 20% Carbon Monoxide. Never run indoors or near living quarters.',
      'Never shut down engine while gasifier is glowing without closing air inlet valves.'
    ],
    aiKnowledgeSummary: 'Downdraft gasifier converting dry wood chips into CO/H2 syngas to operate standard ICE generators off-grid.',
    createdAt: '2026-10-10T14:10:00.000Z',
    isPaywalledTier3: true,
    authorCallsign: 'COMMANDER // DAMONE (313-DETROIT)'
  }
];
