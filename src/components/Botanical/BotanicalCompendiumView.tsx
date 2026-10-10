import React, { useState, useMemo } from 'react';
import { BOTANICAL_PLANTS } from '../../data/botanicalData';
import { BotanicalPlant, PlantMedicalIndication } from '../../types';
import { Flower2, AlertTriangle, ShieldCheck, Search, Filter, ShieldAlert, Sparkles, BookOpen, Droplets, CheckCircle2, Apple, HeartPulse, HelpCircle, Eye, ChevronRight } from 'lucide-react';

export const BotanicalCompendiumView: React.FC = () => {
  const [activeViewMode, setActiveViewMode] = useState<'identifier' | 'catalog'>('identifier');

  // Search & Filter State for Catalog
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIndication, setSelectedIndication] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');

  // Modal State
  const [activePlantModal, setActivePlantModal] = useState<BotanicalPlant | null>(null);
  const [lookalikeComparison, setLookalikeComparison] = useState<{ safe: BotanicalPlant; toxic: BotanicalPlant } | null>(null);

  // Field Plant Identifier Wizard State
  const [wizardFlowerColor, setWizardFlowerColor] = useState<string>('Any');
  const [wizardFlowerShape, setWizardFlowerShape] = useState<string>('Any');
  const [wizardStemTrait, setWizardStemTrait] = useState<string>('Any');
  const [wizardPurpose, setWizardPurpose] = useState<string>('pain'); // 'pain', 'bleeding', 'edible', 'poison_check', 'all'

  const indications: PlantMedicalIndication[] = [
    'Severe Pain & Inflammation (Analgesic)',
    'Wound Wash & Antiseptic',
    'Hemostatic / Blood Clotting',
    'Fever & Antipyretic',
    'Sedative & Sleep Aid',
    'Digestive Spasms & Nausea',
    'Respiratory Bronchodilator & Cough',
    'Burn & Skin Regeneration',
    'Nutritive Wild Food & Foraging',
    'Potent Poison / Lethal Hazard'
  ];

  const flowerColors = ['All', 'Yellow', 'White', 'Purple/Blue', 'Pink/Red', 'Green/Inconspicuous'];
  const classifications = ['All', 'Medicinal', 'Edible Wild', 'Deadly Toxic'];

  // Filtered plants for catalog
  const filteredPlants = useMemo(() => {
    return BOTANICAL_PLANTS.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.commonName.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q) ||
        p.family.toLowerCase().includes(q) ||
        p.activeCompounds.some(c => c.toLowerCase().includes(q)) ||
        p.medicalIndications.some(m => m.toLowerCase().includes(q)) ||
        p.flowerDescription.toLowerCase().includes(q);

      const matchesIndication = selectedIndication === 'All' || p.medicalIndications.includes(selectedIndication as any);
      const matchesColor = selectedColor === 'All' || p.flowerColor === selectedColor;
      const matchesClass = selectedClass === 'All' || p.classification === selectedClass;

      return matchesSearch && matchesIndication && matchesColor && matchesClass;
    });
  }, [searchQuery, selectedIndication, selectedColor, selectedClass]);

  // Field Identifier Scored Matches
  const identifierMatches = useMemo(() => {
    return BOTANICAL_PLANTS.map(plant => {
      let score = 0;
      const reasons: string[] = [];

      // Purpose check
      if (wizardPurpose === 'pain') {
        if (plant.medicalIndications.includes('Severe Pain & Inflammation (Analgesic)') || plant.activeCompounds.some(c => c.toLowerCase().includes('salicin') || c.toLowerCase().includes('hypericin'))) {
          score += 40;
          reasons.push('Contains proven analgesic / anti-inflammatory compounds for pain');
        }
      } else if (wizardPurpose === 'bleeding') {
        if (plant.medicalIndications.includes('Hemostatic / Blood Clotting') || plant.activeCompounds.some(c => c.toLowerCase().includes('achilleine'))) {
          score += 40;
          reasons.push('Proven hemostatic agent that accelerates blood clotting');
        }
      } else if (wizardPurpose === 'edible') {
        if (plant.classification === 'Edible Wild') {
          score += 40;
          reasons.push('Safe, nutrient-dense edible survival flora');
        }
      } else if (wizardPurpose === 'poison_check') {
        if (plant.classification === 'Deadly Toxic') {
          score += 40;
          reasons.push('Deadly toxic hazard: Requires strict isolation');
        }
      } else {
        score += 20;
      }

      // Flower Color
      if (wizardFlowerColor !== 'Any') {
        if (plant.flowerColor === wizardFlowerColor) {
          score += 25;
          reasons.push(`Flower color matches ${wizardFlowerColor}`);
        } else {
          score -= 15;
        }
      }

      // Flower Shape / Pattern
      if (wizardFlowerShape !== 'Any') {
        const desc = plant.flowerDescription.toLowerCase();
        if (wizardFlowerShape === 'umbel' && (desc.includes('umbel') || desc.includes('umbrella') || desc.includes('flat-topped'))) {
          score += 25;
          reasons.push('Umbel / umbrella-shaped flower cluster match');
        } else if (wizardFlowerShape === 'catkin' && desc.includes('catkin')) {
          score += 25;
          reasons.push('Cylindrical catkin bloom match');
        } else if (wizardFlowerShape === 'spike' && desc.includes('spike')) {
          score += 25;
          reasons.push('Dense elongated flower spike match');
        } else if (wizardFlowerShape === 'bell' && (desc.includes('bell') || desc.includes('tubular') || desc.includes('cowl') || desc.includes('hood'))) {
          score += 25;
          reasons.push('Tubular bell / hooded flower shape match');
        } else if (wizardFlowerShape === 'composite' && (desc.includes('composite') || desc.includes('star') || desc.includes('ray'))) {
          score += 25;
          reasons.push('Composite daisy/star flower head match');
        }
      }

      // Stem Trait
      if (wizardStemTrait !== 'Any') {
        const stem = plant.stemAndGrowth.toLowerCase();
        if (wizardStemTrait === 'purple_spots' && (stem.includes('purple') && stem.includes('spot') || stem.includes('blotch'))) {
          score += 35;
          reasons.push('CRITICAL: Stem has purple spots / mouse-urine odor (Hemlock indicator)');
        } else if (wizardStemTrait === 'hairy' && (stem.includes('hair') || stem.includes('rough') || stem.includes('ribbed'))) {
          score += 20;
          reasons.push('Stem is hairy / rough (contrasts with hairless hemlock)');
        } else if (wizardStemTrait === 'feathery_leaves' && (stem.includes('feathery') || stem.includes('fern') || stem.includes('pinnate'))) {
          score += 20;
          reasons.push('Leaves are finely divided / feathery');
        } else if (wizardStemTrait === 'stinging_hairs' && stem.includes('stinging')) {
          score += 35;
          reasons.push('Stems have stinging silica hairs (Nettle)');
        } else if (wizardStemTrait === 'woolly_velvet' && (stem.includes('woolly') || stem.includes('velvet') || stem.includes('felt'))) {
          score += 25;
          reasons.push('Leaves have thick woolly velvety coat (Mullein)');
        }
      }

      return {
        plant,
        score: Math.max(0, score),
        reasons
      };
    })
    .filter(m => m.score > 15)
    .sort((a, b) => b.score - a.score);
  }, [wizardFlowerColor, wizardFlowerShape, wizardStemTrait, wizardPurpose]);

  // Quick pairs for lookalike triage
  const lookalikePairs = [
    {
      safeId: 'common-yarrow',
      toxicId: 'poison-hemlock',
      title: 'Yarrow (Blood Clotting) vs Poison Hemlock (FATAL LETHAL)'
    },
    {
      safeId: 'wild-carrot',
      toxicId: 'poison-hemlock',
      title: 'Wild Carrot (Edible Root) vs Poison Hemlock (FATAL LETHAL)'
    },
    {
      safeId: 'mullein',
      toxicId: 'foxglove',
      title: 'Mullein (Lung Relief) vs Foxglove (CARDIAC ARREST)'
    },
    {
      safeId: 'meadowsweet',
      toxicId: 'poison-hemlock',
      title: 'Meadowsweet (Pain / Salicin) vs Water Hemlock (FATAL)'
    }
  ];

  const triggerPairComparison = (safeId: string, toxicId: string) => {
    const safe = BOTANICAL_PLANTS.find(p => p.id === safeId);
    const toxic = BOTANICAL_PLANTS.find(p => p.id === toxicId);
    if (safe && toxic) {
      setLookalikeComparison({ safe, toxic });
    }
  };

  // Preset wizard quick-setters
  const applyPreset = (preset: 'pain' | 'bleeding' | 'edible' | 'hemlock_check') => {
    setActiveViewMode('identifier');
    if (preset === 'pain') {
      setWizardPurpose('pain');
      setWizardFlowerColor('Any');
      setWizardFlowerShape('Any');
      setWizardStemTrait('Any');
    } else if (preset === 'bleeding') {
      setWizardPurpose('bleeding');
      setWizardFlowerColor('White');
      setWizardFlowerShape('umbel');
      setWizardStemTrait('feathery_leaves');
    } else if (preset === 'edible') {
      setWizardPurpose('edible');
      setWizardFlowerColor('Any');
      setWizardFlowerShape('Any');
      setWizardStemTrait('Any');
    } else if (preset === 'hemlock_check') {
      setWizardPurpose('poison_check');
      setWizardFlowerColor('White');
      setWizardFlowerShape('umbel');
      setWizardStemTrait('purple_spots');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flower2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                Botanical Field Pharmacopoeia & Plant Identification Engine
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Interactive plant identification keys: What to take for pain, what you take for clotting, identifying edible survival greens vs deadly neurotoxic lookalikes, flower appearance, and step-by-step extraction recipes.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 border border-zinc-800 rounded-lg">
            <button
              onClick={() => setActiveViewMode('identifier')}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeViewMode === 'identifier'
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Plant Identifier & Key</span>
            </button>
            <button
              onClick={() => setActiveViewMode('catalog')}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeViewMode === 'catalog'
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Flora Compendium ({BOTANICAL_PLANTS.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Diagnostic Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-800 text-xs font-mono">
          <span className="text-zinc-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Triage Presets:
          </span>
          <button
            onClick={() => applyPreset('pain')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              wizardPurpose === 'pain' && activeViewMode === 'identifier'
                ? 'bg-amber-950/70 border-amber-500 text-amber-300 font-bold'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            💊 What to take for Pain & Fever (Willow / Meadowsweet)
          </button>
          <button
            onClick={() => applyPreset('bleeding')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              wizardPurpose === 'bleeding' && activeViewMode === 'identifier'
                ? 'bg-rose-950/70 border-rose-500 text-rose-300 font-bold'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            🩸 Stop Severe Bleeding & Clotting (Yarrow)
          </button>
          <button
            onClick={() => applyPreset('edible')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              wizardPurpose === 'edible' && activeViewMode === 'identifier'
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            🍲 Safe Edible Wild Food (Dandelion / Nettle / Carrot)
          </button>
          <button
            onClick={() => applyPreset('hemlock_check')}
            className="px-2.5 py-1 rounded border border-rose-800/80 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 transition-colors font-bold"
          >
            ☠️ White Umbrella Flower Poison Alert (Hemlock Triage)
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE PLANT IDENTIFIER WIZARD */}
      {activeViewMode === 'identifier' && (
        <div className="space-y-6">
          {/* Diagnostic Key Controls Box */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-mono font-bold text-zinc-100 uppercase tracking-wider">
                  Field Diagnostic Identification Key (Step-by-Step Triage)
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {identifierMatches.length} candidate species matched
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              {/* Question 1: Purpose / Symptoms */}
              <div>
                <label className="block text-zinc-400 mb-1.5 uppercase font-semibold">
                  1. Purpose / Clinical Need:
                </label>
                <select
                  value={wizardPurpose}
                  onChange={(e) => setWizardPurpose(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="pain">Severe Pain & Fever (Analgesic)</option>
                  <option value="bleeding">Severe Bleeding (Hemostatic Clotting)</option>
                  <option value="edible">Safe Edible Wild Food / Greens</option>
                  <option value="poison_check">Isolate Deadly Poisons / Lookalikes</option>
                  <option value="all">Any Wild Plant Identification</option>
                </select>
              </div>

              {/* Question 2: Flower Color */}
              <div>
                <label className="block text-zinc-400 mb-1.5 uppercase font-semibold">
                  2. Flower Color Observed:
                </label>
                <select
                  value={wizardFlowerColor}
                  onChange={(e) => setWizardFlowerColor(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="Any">Any / Not in Bloom</option>
                  <option value="Yellow">Yellow (Willow, Mullein, Dandelion, St John's)</option>
                  <option value="White">White (Yarrow, Meadowsweet, Hemlock, Carrot)</option>
                  <option value="Purple/Blue">Purple / Blue (Nightshade, Monkshood)</option>
                  <option value="Pink/Red">Pink / Red (Valerian, Foxglove)</option>
                  <option value="Green/Inconspicuous">Green / Inconspicuous (Plantain, Nettle)</option>
                </select>
              </div>

              {/* Question 3: Flower Structure */}
              <div>
                <label className="block text-zinc-400 mb-1.5 uppercase font-semibold">
                  3. Flower Shape / Structure:
                </label>
                <select
                  value={wizardFlowerShape}
                  onChange={(e) => setWizardFlowerShape(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="Any">Any Shape</option>
                  <option value="umbel">Flat-Topped Umbrella / Umbel (Yarrow, Hemlock, Carrot)</option>
                  <option value="catkin">Slender Catkins on Branch (Willow)</option>
                  <option value="spike">Tall Dense Elongated Spike (Mullein, Plantain, Monkshood)</option>
                  <option value="bell">Tubular Bell / Drooping Cowl (Nightshade, Foxglove, Monkshood)</option>
                  <option value="composite">Composite Daisy Head / 5-Petaled Star (Dandelion, St John's)</option>
                </select>
              </div>

              {/* Question 4: Stem & Leaf Trait */}
              <div>
                <label className="block text-zinc-400 mb-1.5 uppercase font-semibold">
                  4. Stem & Leaf Characteristics:
                </label>
                <select
                  value={wizardStemTrait}
                  onChange={(e) => setWizardStemTrait(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="Any">Any Foliage</option>
                  <option value="purple_spots">🚨 SMOOTH HAIRLESS STEM WITH PURPLE SPOTS (HEMLOCK)</option>
                  <option value="hairy">Hairy / Rough Solid Green Stem (Yarrow, Carrot)</option>
                  <option value="feathery_leaves">Feathery / Fern-Like Leaves (Yarrow)</option>
                  <option value="stinging_hairs">Hollow Stinging Silica Hairs (Nettle)</option>
                  <option value="woolly_velvet">Thick Woolly Felted Leaves (Mullein)</option>
                </select>
              </div>
            </div>

            {/* Instant Red Alert warning banner if purple spots selected */}
            {wizardStemTrait === 'purple_spots' && (
              <div className="bg-rose-950/80 border-2 border-rose-600 p-4 rounded-lg flex items-start gap-3 animate-pulse">
                <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-rose-200 uppercase font-mono tracking-wider">
                    CRITICAL WARNING: LETHAL POISON HEMLOCK DETECTED!
                  </h4>
                  <p className="text-rose-300 leading-relaxed">
                    Smooth, hairless stems with purple blotches/spots and hollow centers belong to <strong>Conium maculatum (Poison Hemlock)</strong>.
                    It contains lethal coniine neurotoxin. Do NOT ingest, do NOT taste. 6-8 leaves cause total respiratory paralysis within 60-90 minutes.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Diagnostic Match Cards */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
              <span>Diagnostic Matches Ranked by Clinical & Morphological Alignment</span>
              <span className="text-zinc-500">Click any card for full recipe & safety profile</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {identifierMatches.map(({ plant, score, reasons }) => {
                const isDeadly = plant.classification === 'Deadly Toxic';
                const isEdible = plant.classification === 'Edible Wild';

                return (
                  <div
                    key={plant.id}
                    onClick={() => setActivePlantModal(plant)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group ${
                      isDeadly
                        ? 'bg-rose-950/30 border-rose-700/80 hover:border-rose-500 hover:bg-rose-950/50 shadow-[0_0_15px_rgba(225,29,72,0.15)]'
                        : isEdible
                        ? 'bg-emerald-950/20 border-emerald-800/80 hover:border-emerald-500 hover:bg-emerald-950/40'
                        : 'bg-zinc-900/90 border-zinc-800 hover:border-amber-500 hover:bg-zinc-850'
                    }`}
                  >
                    <div>
                      {/* Classification Badge & Match Bar */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          isDeadly
                            ? 'bg-rose-900/80 text-rose-200 border border-rose-700'
                            : isEdible
                            ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        }`}>
                          {plant.classification}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-zinc-400">Match Alignment:</span>
                          <span className={`text-xs font-mono font-bold ${
                            isDeadly ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {score}%
                          </span>
                        </div>
                      </div>

                      {/* Plant Names */}
                      <h4 className="text-base font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                        {plant.commonName}
                      </h4>
                      <span className="text-xs font-mono italic text-zinc-400 block mb-3">
                        {plant.scientificName} ({plant.family})
                      </span>

                      {/* What you take it for / What it does */}
                      <div className="mb-3 bg-zinc-950/80 p-3 rounded-lg border border-zinc-850 space-y-1">
                        <span className="text-[11px] font-mono uppercase text-zinc-500 block">
                          What You Take It For / Primary Action:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {plant.medicalIndications.map((ind, i) => (
                            <span
                              key={i}
                              className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                                isDeadly
                                  ? 'bg-rose-900/50 text-rose-200'
                                  : 'bg-zinc-900 text-amber-300 border border-zinc-800'
                              }`}
                            >
                              {ind.split(' (')[0]}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* What the flower looks like */}
                      <div className="mb-3 space-y-1 text-xs">
                        <span className="text-[11px] font-mono uppercase text-zinc-500 block flex items-center justify-between">
                          <span>What the Flower Looks Like:</span>
                          <span className="text-amber-400">Color: {plant.flowerColor}</span>
                        </span>
                        <p className="text-zinc-300 leading-relaxed font-sans bg-zinc-950/40 p-2 rounded border border-zinc-850">
                          {plant.flowerDescription}
                        </p>
                      </div>

                      {/* Why it matches */}
                      <div className="mb-3">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                          Diagnostic Alignment:
                        </span>
                        <ul className="text-[11px] font-mono text-zinc-400 space-y-0.5">
                          {reasons.slice(0, 2).map((r, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-amber-400" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500">
                        {plant.preparations.length > 0 ? `${plant.preparations.length} field preparation recipes` : 'Strict Poison Alert'}
                      </span>
                      <span className="text-amber-400 group-hover:underline flex items-center gap-1">
                        <span>Inspect Field Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FULL CATALOG BROWSER */}
      {activeViewMode === 'catalog' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-lg space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <span className="text-xs font-mono text-zinc-400 uppercase">
                Filter by Category, Symptom, or Flower Traits:
              </span>

              <div className="relative min-w-[280px]">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search plant, compound (e.g. salicin), or symptom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Filter Bar: Medical Indication */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800">
              <span className="text-xs font-mono text-zinc-500 mr-1">Medical Use:</span>
              <button
                onClick={() => setSelectedIndication('All')}
                className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${
                  selectedIndication === 'All' ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All Indications
              </button>
              {indications.map(ind => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndication(ind)}
                  className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${
                    selectedIndication === ind
                      ? ind.includes('Poison')
                        ? 'bg-rose-600 text-white font-bold'
                        : 'bg-emerald-500 text-zinc-950 font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {ind.split(' (')[0]}
                </button>
              ))}
            </div>

            {/* Secondary Filter: Flower Color & Classification */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-mono text-zinc-500 mr-1">Flower Color:</span>
                {flowerColors.map(col => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-2 py-0.5 text-xs rounded font-mono transition-colors ${
                      selectedColor === col ? 'bg-cyan-500 text-zinc-950 font-bold' : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">Toxicity / Type:</span>
                {classifications.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedClass(c)}
                    className={`px-2 py-0.5 text-xs rounded font-mono transition-colors ${
                      selectedClass === c
                        ? c === 'Deadly Toxic'
                          ? 'bg-rose-600 text-white font-bold'
                          : c === 'Edible Wild'
                          ? 'bg-emerald-500 text-zinc-950 font-bold'
                          : 'bg-zinc-200 text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid of Botanical Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map(plant => {
              const isDeadly = plant.classification === 'Deadly Toxic';
              const isEdible = plant.classification === 'Edible Wild';

              return (
                <div
                  key={plant.id}
                  onClick={() => setActivePlantModal(plant)}
                  className={`p-5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between group ${
                    isDeadly
                      ? 'bg-rose-950/25 border-rose-900/60 hover:border-rose-600 hover:bg-rose-950/40'
                      : isEdible
                      ? 'bg-emerald-950/25 border-emerald-900/60 hover:border-emerald-600 hover:bg-emerald-950/40'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-emerald-600 hover:bg-zinc-850'
                  }`}
                >
                  <div>
                    {/* Header Tag */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[11px] font-mono font-bold uppercase ${
                        isDeadly ? 'text-rose-400' : isEdible ? 'text-emerald-400' : 'text-cyan-400'
                      }`}>
                        {plant.classification}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        Flower: {plant.flowerColor}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-400 transition-colors mb-0.5">
                      {plant.commonName}
                    </h3>
                    <span className="text-xs font-mono italic text-zinc-400 block mb-3">
                      {plant.scientificName} ({plant.family})
                    </span>

                    {/* Medical Indications */}
                    <div className="mb-3 space-y-1">
                      <span className="text-[11px] font-mono uppercase text-zinc-500 block">Actions:</span>
                      <div className="flex flex-wrap gap-1">
                        {plant.medicalIndications.map((ind, i) => (
                          <span
                            key={i}
                            className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                              isDeadly
                                ? 'bg-rose-900/60 text-rose-200 border border-rose-800'
                                : 'bg-zinc-950 text-cyan-300 border border-zinc-800'
                            }`}
                          >
                            {ind.split(' (')[0]}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Flower and Leaf Description */}
                    <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed mb-4">
                      {plant.flowerDescription}
                    </p>
                  </div>

                  {/* Bottom Quick Look */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">
                      {plant.preparations.length} field recipes
                    </span>
                    <span className="text-amber-400 group-hover:underline">
                      View Full Profile →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Deadly Lookalike Triage Fast Buttons */}
      <div className="bg-rose-950/30 border border-rose-900/60 p-4 rounded-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-rose-300 text-xs font-mono font-semibold">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Lethal Lookalike Triage Quick Inspector:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {lookalikePairs.map((pair, idx) => (
            <button
              key={idx}
              onClick={() => triggerPairComparison(pair.safeId, pair.toxicId)}
              className="text-xs font-mono bg-zinc-900/90 hover:bg-rose-950/80 border border-rose-800 text-rose-200 px-3 py-1.5 rounded transition-colors"
            >
              {pair.title}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Lookalike Comparison Modal / Banner */}
      {lookalikeComparison && (
        <div className="bg-zinc-950 border border-amber-600/80 rounded-xl p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-mono font-bold text-amber-300 uppercase">
                Critical Lookalike Morphological Comparison
              </h3>
            </div>
            <button
              onClick={() => setLookalikeComparison(null)}
              className="text-xs text-zinc-400 hover:text-zinc-100 font-mono underline"
            >
              Close Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Safe Plant Side */}
            <div className="bg-emerald-950/30 border border-emerald-800/80 p-5 rounded-lg space-y-3">
              <span className="text-xs font-mono uppercase font-bold text-emerald-400 block">
                BENEFICIAL MEDICINAL / EDIBLE: {lookalikeComparison.safe.commonName}
              </span>
              <div className="text-xs text-zinc-300 space-y-2">
                <div><strong>Scientific:</strong> <em>{lookalikeComparison.safe.scientificName}</em></div>
                <div><strong>Flower Structure:</strong> {lookalikeComparison.safe.flowerDescription}</div>
                <div><strong>Stem & Leaf:</strong> {lookalikeComparison.safe.stemAndGrowth}</div>
                <div className="text-emerald-300 font-semibold pt-1">
                  Primary Medical Use: {lookalikeComparison.safe.medicalIndications.join(', ')}
                </div>
              </div>
            </div>

            {/* Deadly Toxic Side */}
            <div className="bg-rose-950/40 border border-rose-700 p-5 rounded-lg space-y-3">
              <span className="text-xs font-mono uppercase font-bold text-rose-400 block">
                DEADLY TOXIC HAZARD: {lookalikeComparison.toxic.commonName}
              </span>
              <div className="text-xs text-zinc-300 space-y-2">
                <div><strong>Scientific:</strong> <em>{lookalikeComparison.toxic.scientificName}</em></div>
                <div><strong>Lethal Alkaloid:</strong> {lookalikeComparison.toxic.activeCompounds.join(', ')}</div>
                <div className="text-rose-200">
                  <strong>Distinction Key:</strong> {lookalikeComparison.toxic.stemAndGrowth}
                </div>
                <div className="text-rose-400 font-bold pt-1">
                  Lethal Effect: {lookalikeComparison.toxic.toxicityWarning}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Profile */}
      {activePlantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`p-6 border-b flex items-start justify-between ${
              activePlantModal.classification === 'Deadly Toxic'
                ? 'bg-rose-950/60 border-rose-900'
                : 'bg-zinc-950/80 border-zinc-800'
            }`}>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono mb-1">
                  <span className={`font-bold ${
                    activePlantModal.classification === 'Deadly Toxic'
                      ? 'text-rose-400'
                      : activePlantModal.classification === 'Edible Wild'
                      ? 'text-emerald-400'
                      : 'text-cyan-400'
                  }`}>
                    {activePlantModal.classification}
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400">{activePlantModal.family}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-amber-400">Flower: {activePlantModal.flowerColor}</span>
                </div>

                <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">
                  {activePlantModal.commonName}
                </h2>
                <span className="text-xs font-mono italic text-zinc-400 block mt-0.5">
                  {activePlantModal.scientificName}
                </span>
              </div>

              <button
                onClick={() => setActivePlantModal(null)}
                className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300">
              {/* Toxicity Alert if Deadly */}
              {activePlantModal.toxicityWarning && (
                <div className="bg-rose-950/50 border border-rose-600 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-bold font-mono text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <span>LETHAL TOXICITY WARNING & SYMPTOMS</span>
                  </div>
                  <p className="text-rose-200 leading-relaxed">
                    {activePlantModal.toxicityWarning}
                  </p>
                  {activePlantModal.emergencyAntidoteProtocol && (
                    <div className="pt-2 border-t border-rose-900 text-rose-300 font-mono">
                      <strong>EMERGENCY FIELD PROTOCOL:</strong> {activePlantModal.emergencyAntidoteProtocol}
                    </div>
                  )}
                </div>
              )}

              {/* What you take it for / Indications */}
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block">
                  Medicinal Purpose & Indication
                </span>
                <div className="flex flex-wrap gap-2">
                  {activePlantModal.medicalIndications.map((ind, i) => (
                    <span key={i} className="bg-zinc-900 border border-zinc-700 px-3 py-1 rounded text-zinc-200 font-mono">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Identification Characteristics Grid */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 font-semibold">
                  Botanical Identification Characteristics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-1">
                    <span className="text-amber-400 font-mono font-semibold block">Flower Structure & Color</span>
                    <p className="leading-relaxed text-zinc-300">{activePlantModal.flowerDescription}</p>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-1">
                    <span className="text-amber-400 font-mono font-semibold block">Leaf Pattern & Stems</span>
                    <p className="leading-relaxed text-zinc-300">
                      Leaf Pattern: {activePlantModal.leafPattern}. {activePlantModal.stemAndGrowth}
                    </p>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-1">
                    <span className="text-cyan-400 font-mono font-semibold block">Habitat & Optimal Harvest Season</span>
                    <p className="leading-relaxed text-zinc-300">{activePlantModal.habitatAndSeason}</p>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-1">
                    <span className="text-cyan-400 font-mono font-semibold block">Active Pharmacological Compounds</span>
                    <p className="leading-relaxed text-zinc-300 font-mono">
                      {activePlantModal.activeCompounds.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Danger Lookalikes */}
              {activePlantModal.lookalikes.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Danger Lookalikes & Critical Distinctions
                  </h4>
                  <div className="space-y-3">
                    {activePlantModal.lookalikes.map((lk, i) => (
                      <div key={i} className="bg-zinc-950 p-4 rounded-lg border border-amber-900/60 space-y-1.5">
                        <div className="flex items-center justify-between font-bold text-amber-300">
                          <span>Confused with: {lk.toxicCommonName} (<em>{lk.toxicSpecies}</em>)</span>
                          <span className="text-rose-400 font-mono text-[11px]">HAZARD</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                          <strong>How to Distinguish:</strong> {lk.distinctionKey}
                        </p>
                        <p className="text-rose-300 text-[11px] font-mono">
                          Lethal Consequence: {lk.lethalHazard}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Field Preparation Recipes */}
              {activePlantModal.preparations.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-3 font-semibold flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-emerald-400" />
                    Field Extraction & Preparation Recipes
                  </h4>
                  <div className="space-y-3">
                    {activePlantModal.preparations.map((prep, i) => (
                      <div key={i} className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-300 text-sm">{prep.method}</span>
                          <span className="text-zinc-500 font-mono">Part: {prep.partUsed}</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{prep.instructions}</p>
                        <div className="text-cyan-400 font-mono pt-1 border-t border-zinc-900">
                          <strong>Standard Dosage:</strong> {prep.dosage}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
              <button
                onClick={() => setActivePlantModal(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors"
              >
                Close Compendium Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
