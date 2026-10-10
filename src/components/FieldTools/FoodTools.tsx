import React, { useState } from 'react';
import { Apple, Scale, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';

export const FoodTools: React.FC = () => {
  // Calorie & Ration Estimator State
  const [bodyWeightKg, setBodyWeightKg] = useState<number>(75);
  const [packWeightKg, setPackWeightKg] = useState<number>(18);
  const [distanceKm, setDistanceKm] = useState<number>(12);
  const [terrainDifficulty, setTerrainDifficulty] = useState<number>(1.3); // 1.0 flat road, 1.3 rough trail, 1.7 mountain scree
  const [ambientTempC, setAmbientTempC] = useState<number>(5);

  // Meat Salt Cure State
  const [meatWeightKg, setMeatWeightKg] = useState<number>(5);
  const [cureStyle, setCureStyle] = useState<'dry_cure' | 'wet_brine'>('dry_cure');

  // Universal Edibility Stage State
  const [currentTestStage, setCurrentTestStage] = useState<number>(1);
  const [stageStartedAt, setStageStartedAt] = useState<number | null>(null);

  // Calorie Calculation (Pandolf equation approximation for pack marching + basal metabolic rate)
  const bmrKcal = 10 * bodyWeightKg + 6.25 * 175 - 5 * 30 + 5; // ~1700 kcal baseline
  const walkingBurnKcalPerKm = (bodyWeightKg + packWeightKg) * 0.75 * terrainDifficulty;
  const activityBurnKcal = walkingBurnKcalPerKm * distanceKm;
  const coldWeatherPenaltyKcal = ambientTempC < 10 ? (10 - ambientTempC) * 35 : 0;
  const totalDailyKcal = Math.round(bmrKcal + activityBurnKcal + coldWeatherPenaltyKcal);

  // Daily water requirement in Liters
  const baseWaterLiters = (bodyWeightKg * 0.035).toFixed(1);
  const exertionWaterLiters = (distanceKm * 0.25 * terrainDifficulty).toFixed(1);
  const totalWaterLiters = (parseFloat(baseWaterLiters) + parseFloat(exertionWaterLiters)).toFixed(1);

  // Salt Cure calculations
  // Dry cure: 2.75% coarse non-iodized salt, 0.5% sugar, 0.25% cure #1 (if available)
  const saltGrams = cureStyle === 'dry_cure' ? Math.round(meatWeightKg * 1000 * 0.028) : Math.round(meatWeightKg * 1000 * 0.08); // 8% brine
  const sugarGrams = Math.round(meatWeightKg * 1000 * 0.008);
  const cureDays = Math.ceil(meatWeightKg * 2.5); // rule of thumb: ~2.5 days per kg thickness

  const edibilityStages = [
    { stage: 1, name: 'Visual & Scent Screen', time: 'Immediate', desc: 'Discard if almond/cyanide odor, milky sap, umbrella flower clusters, or spine thorns.' },
    { stage: 2, name: 'Contact Skin Rub', time: '15 Minutes', desc: 'Rub crushed plant on inner wrist. Check for redness, rash, or itching.' },
    { stage: 3, name: 'Outer Lip Touch', time: '3 Minutes', desc: 'Touch crushed leaf to outer border of lips. Watch for tingling or burning.' },
    { stage: 4, name: 'Tongue Tip Test', time: '15 Minutes', desc: 'Place on tongue tip without swallowing. If bitter or soapy, spit and rinse immediately.' },
    { stage: 5, name: 'Chew & Swallow Pea Size', time: '8 Hours', desc: 'Chew and swallow tiny pea-sized morsel. Fast from other foods for 8 hours. Monitor nausea/cramps.' },
    { stage: 6, name: 'Quarter-Cup Trial Dose', time: '8 Hours', desc: 'Consume 1/4 cup cooked plant. If symptom-free after 8 additional hours, safe in moderation.' }
  ];

  return (
    <div className="space-y-8">
      {/* Tool 1: Calorie & Hydration Expenditure Estimator */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Apple className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-zinc-100">Daily Calorie & Water Expenditure Field Estimator</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Pandolf / USARIEM Load Marching Model</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Estimates metabolic energy demand and water consumption during backcountry marches with heavy loads and cold weather thermal penalties.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Body Mass: <span className="text-emerald-400 font-bold">{bodyWeightKg} kg</span> ({ Math.round(bodyWeightKg * 2.2) } lbs)
            </label>
            <input
              type="range"
              min="50"
              max="120"
              value={bodyWeightKg}
              onChange={(e) => setBodyWeightKg(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-zinc-800 h-2 rounded cursor-pointer mb-4"
            />

            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Pack Weight: <span className="text-emerald-400 font-bold">{packWeightKg} kg</span> ({ Math.round(packWeightKg * 2.2) } lbs)
            </label>
            <input
              type="range"
              min="0"
              max="45"
              value={packWeightKg}
              onChange={(e) => setPackWeightKg(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Daily March Distance: <span className="text-emerald-400 font-bold">{distanceKm} km</span> ({ (distanceKm * 0.62).toFixed(1) } mi)
            </label>
            <input
              type="range"
              min="1"
              max="40"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-zinc-800 h-2 rounded cursor-pointer mb-4"
            />

            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Terrain Incline & Surface</label>
            <select
              value={terrainDifficulty}
              onChange={(e) => setTerrainDifficulty(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs py-2 px-3 rounded font-mono"
            >
              <option value={1.0}>Flat Paved / Packed Dirt (1.0x)</option>
              <option value={1.3}>Rough Forest Trail / Gravel (1.3x)</option>
              <option value={1.7}>Steep Mountain Scree / Deep Sand (1.7x)</option>
              <option value={2.2}>Deep Snow Pack / Heavy Swamp (2.2x)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Ambient Temperature: <span className="text-emerald-400 font-bold">{ambientTempC} °C</span> ({ Math.round(ambientTempC * 9/5 + 32) } °F)
            </label>
            <input
              type="range"
              min="-20"
              max="40"
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-zinc-800 h-2 rounded cursor-pointer mb-4"
            />
            <p className="text-xs text-zinc-500 font-mono">
              {ambientTempC < 5 ? 'Sub-freezing shivering penalty applied' : ambientTempC > 28 ? 'High evaporative sweat penalty' : 'Moderate temperate zone'}
            </p>
          </div>
        </div>

        {/* Output Metrics Bar */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="block text-xs uppercase font-mono text-zinc-400">Total Caloric Requirement</span>
            <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
              {totalDailyKcal} <span className="text-xs text-zinc-400 font-normal">KCAL / DAY</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Basal: {Math.round(bmrKcal)} | Exertion: {Math.round(activityBurnKcal)} | Cold: {Math.round(coldWeatherPenaltyKcal)}
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-4">
            <span className="block text-xs uppercase font-mono text-zinc-400">Daily Water Consumption</span>
            <span className="text-2xl font-mono font-bold text-cyan-400 tabular-nums">
              {totalWaterLiters} <span className="text-xs text-zinc-400 font-normal">LITERS / DAY</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Minimum fluid intake to prevent heat exhaustion
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-4">
            <span className="block text-xs uppercase font-mono text-zinc-400">Ration Pack Equivalency</span>
            <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
              {(totalDailyKcal / 1250).toFixed(1)} <span className="text-xs text-zinc-400 font-normal">MRE Meals</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Based on standard 1,250 kcal field ration
            </span>
          </div>
        </div>
      </section>

      {/* Tool 2: Wild Plant Edibility Stage Tracker */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-zinc-100">Universal Edibility Test (UET) Stage Tracker</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">FM 21-76 Progressive Screening</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Rule: Fast from other food for 8 hours prior. Test strictly ONE single plant part at a time. If ANY negative reaction occurs, discard immediately and rinse with water.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {edibilityStages.map(s => (
            <div
              key={s.stage}
              onClick={() => setCurrentTestStage(s.stage)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                currentTestStage === s.stage
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                  : currentTestStage > s.stage
                  ? 'bg-zinc-950/70 border-emerald-900/50 text-zinc-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold uppercase">Stage {s.stage}</span>
                <span className="text-xs font-mono text-zinc-400">{s.time}</span>
              </div>
              <h4 className="text-sm font-semibold mb-1 text-zinc-100">{s.name}</h4>
              <p className="text-xs text-zinc-400 line-clamp-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tool 3: Meat & Fish Salt-Cure Calculator */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-zinc-100">Meat & Fish Salt-Curing & Brine Proportioner</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Preservation Chemistry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Meat Raw Weight: <span className="text-cyan-400 font-bold">{meatWeightKg} kg</span> ({ Math.round(meatWeightKg * 2.2) } lbs)
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={meatWeightKg}
              onChange={(e) => setMeatWeightKg(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Curing Technique</label>
            <div className="flex gap-2">
              <button
                onClick={() => setCureStyle('dry_cure')}
                className={`flex-1 py-2 text-xs font-medium rounded border ${cureStyle === 'dry_cure' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
              >
                Equilibrium Dry Cure (2.8%)
              </button>
              <button
                onClick={() => setCureStyle('wet_brine')}
                className={`flex-1 py-2 text-xs font-medium rounded border ${cureStyle === 'wet_brine' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
              >
                Wet Immersion Brine (8%)
              </button>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
            <span className="block text-xs font-mono uppercase text-zinc-400">Pure Non-Iodized Salt</span>
            <span className="text-2xl font-mono font-bold text-cyan-400 tabular-nums">
              {saltGrams} <span className="text-xs text-zinc-400 font-normal">GRAMS</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Sugar: {sugarGrams}g | Cure Duration: ~{cureDays} days at &lt;4°C
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
