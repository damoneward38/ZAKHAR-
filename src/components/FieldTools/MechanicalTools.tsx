import React, { useState } from 'react';
import { Wrench, ShieldAlert, Layers, Flame, ArrowUpRight } from 'lucide-react';

export const MechanicalTools: React.FC = () => {
  // Pulley Calculator State
  const [loadWeightKg, setLoadWeightKg] = useState<number>(300);
  const [pulleyRatio, setPulleyRatio] = useState<number>(3); // 3:1 Z-drag
  const [sheaveEfficiency, setSheaveEfficiency] = useState<number>(90); // 90% per pulley sheave

  // Sling Angle State
  const [slingAngleDeg, setSlingAngleDeg] = useState<number>(60); // degrees from horizontal
  const [liftedMassKg, setLiftedMassKg] = useState<number>(500);

  // Calculations
  // Effective mechanical advantage accounting for friction
  const numberOfSheaves = pulleyRatio === 1 ? 0 : pulleyRatio === 2 ? 1 : pulleyRatio === 3 ? 2 : pulleyRatio === 4 ? 3 : 4;
  const totalEfficiency = Math.pow(sheaveEfficiency / 100, numberOfSheaves);
  const idealHaulForceKg = Math.round(loadWeightKg / pulleyRatio);
  const realisticHaulForceKg = Math.round(idealHaulForceKg / totalEfficiency);
  const ropeTravelRatio = pulleyRatio; // to lift load 1m, pull X meters of rope

  // Sling Tension: T = W / (2 * sin(theta))
  const sinAngle = Math.sin((slingAngleDeg * Math.PI) / 180);
  const tensionPerLegKg = Math.round(liftedMassKg / (2 * sinAngle));
  const tensionMultiplicationFactor = (1 / (2 * sinAngle)).toFixed(2);

  const temperColors = [
    { tempC: 220, tempF: 428, color: '#fef08a', name: 'Very Faint Straw', hardness: '62-64 HRC', tools: 'Engraving tools, razors, surgical scrapers, glass cutters' },
    { tempC: 240, tempF: 464, color: '#fde047', name: 'Dark Straw / Yellow', hardness: '59-61 HRC', tools: 'Hunting knives, lathe tools, punches, metal milling cutters' },
    { tempC: 255, tempF: 491, color: '#d97706', name: 'Brown / Golden Amber', hardness: '57-59 HRC', tools: 'Shear blades, wood chisels, plane irons, axes' },
    { tempC: 270, tempF: 518, color: '#a855f7', name: 'Purple / Magenta', hardness: '54-56 HRC', tools: 'Cold chisels, adzes, center punches, heavy splitters' },
    { tempC: 295, tempF: 563, color: '#3b82f6', name: 'Dark Blue / Indigo', hardness: '50-52 HRC', tools: 'Springs, swords, screwdrivers, crowbars, prybars' },
    { tempC: 320, tempF: 608, color: '#06b6d4', name: 'Light Blue / Ash', hardness: '45-48 HRC', tools: 'Wood handsaws, masonry spikes (high toughness, low brittleness)' }
  ];

  return (
    <div className="space-y-8">
      {/* Tool 1: Pulley Mechanical Advantage & Z-Drag */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-zinc-100">Pulley Mechanical Advantage & Rigging Haul Force</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Euler-Eytelwein Friction Model</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Calculates theoretical versus actual hauling effort required to hoist heavy equipment, recover vehicles, or tension zip-lines, accounting for cumulative sheave bearing friction.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Load to Lift: <span className="text-cyan-400 font-bold">{loadWeightKg} kg</span> ({ Math.round(loadWeightKg * 2.2) } lbs)
            </label>
            <input
              type="range"
              min="20"
              max="2000"
              step="20"
              value={loadWeightKg}
              onChange={(e) => setLoadWeightKg(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Pulley System Configuration</label>
            <select
              value={pulleyRatio}
              onChange={(e) => setPulleyRatio(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs py-2 px-3 rounded font-mono"
            >
              <option value={1}>1:1 Direct Haul (Direction change only, 0 sheaves moving)</option>
              <option value={2}>2:1 Gun Tackle (Single moving block)</option>
              <option value={3}>3:1 Z-Drag / Luff Tackle (Search & Rescue standard)</option>
              <option value={4}>4:1 Double Fiddle Block (Two twin sheaves)</option>
              <option value={5}>5:1 Complex Compound System</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Sheave Efficiency: <span className="text-cyan-400 font-bold">{sheaveEfficiency}%</span>
            </label>
            <input
              type="range"
              min="70"
              max="98"
              value={sheaveEfficiency}
              onChange={(e) => setSheaveEfficiency(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Sealed Ball Bearing: 95% | Bushing: 85% | Carabiner: 70%
            </p>
          </div>
        </div>

        {/* Output Metrics Bar */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="block text-xs uppercase font-mono text-zinc-400">Realistic Hauling Force Required</span>
            <span className="text-2xl font-mono font-bold text-cyan-400 tabular-nums">
              {realisticHaulForceKg} <span className="text-xs text-zinc-400 font-normal">kg ({ Math.round(realisticHaulForceKg * 2.2) } lbs)</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Ideal frictionless: {idealHaulForceKg} kg
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-4">
            <span className="block text-xs uppercase font-mono text-zinc-400">Rope Travel Ratio</span>
            <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
              {ropeTravelRatio}:1
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Pull {ropeTravelRatio} meters of rope to lift load 1 meter
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-4">
            <span className="block text-xs uppercase font-mono text-zinc-400">Anchor Load Force</span>
            <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
              {loadWeightKg + realisticHaulForceKg} <span className="text-xs text-zinc-400 font-normal">kg</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Combined load + human hauling reaction
            </span>
          </div>
        </div>
      </section>

      {/* Tool 2: Rigging Sling Angle Tension Multiplier */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ArrowUpRight className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-semibold text-zinc-100">Rigging Sling Angle Tension Multiplier</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Vector Resolution Trigonometry</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          CRITICAL RIGGING SAFETY RULE: As the horizontal angle of a two-leg sling flattens below 60 degrees, tension in each sling leg skyrockets exponentially. At 30 degrees, tension equals 100% of the entire load on each individual leg!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Sling Angle from Horizontal: <span className="text-amber-400 font-bold">{slingAngleDeg}°</span>
            </label>
            <input
              type="range"
              min="15"
              max="90"
              value={slingAngleDeg}
              onChange={(e) => setSlingAngleDeg(Number(e.target.value))}
              className="w-full accent-amber-500 bg-zinc-800 h-2 rounded cursor-pointer mb-4"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span className="text-rose-400">Extreme Hazard (&lt;30°)</span>
              <span className="text-amber-400">Caution (45°)</span>
              <span className="text-emerald-400">Optimal (60°-90°)</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center justify-between">
            <div>
              <span className="block text-xs uppercase font-mono text-zinc-400">Tension on Each Sling Leg</span>
              <span className={`text-3xl font-mono font-bold tabular-nums ${slingAngleDeg < 30 ? 'text-rose-400' : slingAngleDeg < 45 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {tensionPerLegKg} <span className="text-xs text-zinc-400 font-normal">kg ({ Math.round(tensionPerLegKg * 2.2) } lbs)</span>
              </span>
              <span className="block text-xs font-mono text-zinc-500 mt-1">
                Load per leg: {Math.round(liftedMassKg * parseFloat(tensionMultiplicationFactor))} kg
              </span>
            </div>

            {slingAngleDeg < 30 && (
              <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-600 px-3 py-2 rounded text-xs text-rose-300 font-mono">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                DANGER: SLING FAILURE IMMINENT
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tool 3: Carbon Steel Tempering Color & Temperature Guide */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-zinc-100">Carbon Steel Heat-Treating Tempering Color Scale</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Oxide Film Thickness Calibration</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          After hardening steel by quenching from red heat (800°C) into water or oil, it is brittle like glass (martensite). Tempering reheats polished clean steel to specific temperatures, forming thin interference-color oxide films that dictate toughness versus edge-holding hardness.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Oxide Color</th>
                <th className="py-2.5 px-3">Temp (°C / °F)</th>
                <th className="py-2.5 px-3">Approx Hardness</th>
                <th className="py-2.5 px-3">Appropriate Tools & Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {temperColors.map((t, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/50">
                  <td className="py-3 px-3 flex items-center gap-2 font-medium text-zinc-200">
                    <span
                      className="w-4 h-4 rounded-full border border-zinc-700 shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.name}</span>
                  </td>
                  <td className="py-3 px-3 text-amber-400 font-bold">{t.tempC}°C / {t.tempF}°F</td>
                  <td className="py-3 px-3 text-zinc-400">{t.hardness}</td>
                  <td className="py-3 px-3 text-zinc-300">{t.tools}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
