import React, { useState, useEffect } from 'react';
import { Droplet, Flame, Filter, Sun, Timer, CheckCircle2, AlertTriangle } from 'lucide-react';

export const WaterTools: React.FC = () => {
  // Bleach Calculator State
  const [waterVolume, setWaterVolume] = useState<number>(10); // Liters
  const [waterClarity, setWaterClarity] = useState<'clear' | 'cloudy'>('clear');
  const [bleachStrength, setBleachStrength] = useState<number>(6); // percent

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Boiling Calculator State
  const [altitudeMeters, setAltitudeMeters] = useState<number>(500);

  // Slow Sand Filter Sizing
  const [dailyDemandLiters, setDailyDemandLiters] = useState<number>(60); // 60 L/day for small group

  // Calculations
  const dropsPerLiter = waterClarity === 'clear' ? (bleachStrength >= 6 ? 2 : 3) : (bleachStrength >= 6 ? 4 : 6);
  const totalDrops = Math.round(waterVolume * dropsPerLiter);
  const totalMl = (totalDrops * 0.05).toFixed(2); // ~20 drops per mL

  // Boiling point calculation: T_boil = 100 - (altitude / 300) approx
  const boilingPointC = Number(Math.max(80, Math.min(100, 100 - (altitudeMeters * 0.0033))).toFixed(1));
  const boilingDurationMin = altitudeMeters >= 2000 ? 3 : 1;

  // Filter Sizing: Design loading rate ~ 150 L/m²/day
  const requiredSurfaceAreaM2 = (dailyDemandLiters / 150).toFixed(2);
  const requiredDiameterCm = Math.round(2 * Math.sqrt(parseFloat(requiredSurfaceAreaM2) / Math.PI) * 100);
  const sandVolumeKg = Math.round(parseFloat(requiredSurfaceAreaM2) * 0.7 * 1600); // 70cm sand depth, ~1600 kg/m³

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {
        // audio not supported or blocked
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const startQuenchTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setTimerActive(true);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Tool 1: Bleach & Chemical Dosing */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Droplet className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-zinc-100">Sodium Hypochlorite Bleach Disinfection Calculator</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">CDC / WHO Standard Protocol</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Accurate chemical titration for emergency water treatment. Always use unscented, plain household bleach (5.25% - 8.25% NaOCl). Never use detergent, scented, or splashless variants.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Water Volume: <span className="text-cyan-400 font-bold">{waterVolume} Liters</span> ({ (waterVolume * 0.264).toFixed(1) } Gal)
            </label>
            <input
              type="range"
              min="1"
              max="200"
              value={waterVolume}
              onChange={(e) => setWaterVolume(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono mt-1">
              <span>1L (Canteen)</span>
              <span>20L (Jerrycan)</span>
              <span>200L (Drum)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Water Condition</label>
            <div className="flex gap-2">
              <button
                onClick={() => setWaterClarity('clear')}
                className={`flex-1 py-2 text-xs font-medium rounded border transition-colors ${
                  waterClarity === 'clear'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Clear / Filtered
              </button>
              <button
                onClick={() => setWaterClarity('cloudy')}
                className={`flex-1 py-2 text-xs font-medium rounded border transition-colors ${
                  waterClarity === 'cloudy'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Cloudy / Cold (&lt;10°C)
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              {waterClarity === 'clear' ? 'Baseline: 2 drops / L (~0.1 mL)' : 'Double dose: 4 drops / L (~0.2 mL) for turbid water'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Bleach Concentration</label>
            <select
              value={bleachStrength}
              onChange={(e) => setBleachStrength(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs py-2 px-3 rounded focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value={6}>5.25% - 6.0% (Standard Household Bleach)</option>
              <option value={8.25}>8.25% (Concentrated Bleach)</option>
              <option value={4}>3.5% - 4.0% (Aged / Low-Strength Bleach)</option>
            </select>
            <p className="text-xs text-zinc-500 mt-2 font-mono">Specific Gravity: ~1.08 g/cm³</p>
          </div>
        </div>

        {/* Output Metrics Bar */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="block text-xs uppercase font-mono text-zinc-400">Prescribed Dosage</span>
              <span className="text-2xl font-mono font-bold text-cyan-400 tabular-nums">
                {totalDrops} <span className="text-xs text-zinc-400 font-normal">DROPS</span>
              </span>
            </div>
            <div className="border-l border-zinc-800 pl-6">
              <span className="block text-xs uppercase font-mono text-zinc-400">Liquid Volume</span>
              <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
                {totalMl} <span className="text-xs text-zinc-400 font-normal">mL</span>
              </span>
            </div>
            <div className="border-l border-zinc-800 pl-6">
              <span className="block text-xs uppercase font-mono text-zinc-400">Required Contact Time</span>
              <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
                {waterClarity === 'clear' ? '30' : '60'} <span className="text-xs text-zinc-400 font-normal">MINUTES</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {timerActive ? (
              <div className="flex items-center gap-3 bg-cyan-950/50 border border-cyan-800/80 px-4 py-2 rounded">
                <Timer className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="font-mono text-lg font-bold text-cyan-300 tabular-nums">
                  {formatTimer(timerSeconds)}
                </span>
                <button
                  onClick={() => setTimerActive(false)}
                  className="text-xs text-zinc-400 hover:text-rose-400 ml-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => startQuenchTimer(waterClarity === 'clear' ? 30 : 60)}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-medium px-4 py-2 rounded text-xs transition-colors"
              >
                <Timer className="w-4 h-4" />
                Start {waterClarity === 'clear' ? '30-Min' : '60-Min'} Disinfection Timer
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Tool 2: Altitude Boiling Curve */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-semibold text-zinc-100">Thermal Disinfection & Altitude Boiling Curve</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Thermodynamic Vapor Pressure Model</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          At higher elevations, lower atmospheric pressure drops the boiling point of water. While 70°C pasteurizes most vegetative bacteria within minutes, water boils cooler at altitude and requires longer rolling boil exposure to neutralize hardy spore pathogens and Cryptosporidium cysts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Elevation: <span className="text-amber-400 font-bold">{altitudeMeters} meters</span> ({ Math.round(altitudeMeters * 3.28084) } ft)
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={altitudeMeters}
              onChange={(e) => setAltitudeMeters(Number(e.target.value))}
              className="w-full accent-amber-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono mt-1">
              <span>Sea Level (0m)</span>
              <span>Mile High (1600m)</span>
              <span>High Alpine (5000m)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
              <span className="block text-xs uppercase font-mono text-zinc-400">Boiling Temperature</span>
              <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
                {boilingPointC} <span className="text-xs text-zinc-400">°C</span>
              </span>
              <span className="block text-xs font-mono text-zinc-500 mt-1">
                ({ ((boilingPointC * 9) / 5 + 32).toFixed(1) } °F)
              </span>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
              <span className="block text-xs uppercase font-mono text-zinc-400">Mandatory Rolling Boil</span>
              <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
                {boilingDurationMin} <span className="text-xs text-zinc-400 font-normal">MINUTES</span>
              </span>
              <span className="block text-xs font-mono text-zinc-500 mt-1">
                {altitudeMeters >= 2000 ? 'Extended altitude safety duration' : 'Standard sea-level safety duration'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tool 3: Slow Sand Filter Sizing Dimensioner */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-zinc-100">Biological Slow Sand Filter Dimensional Sizing</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Huisman-Wood Hydraulic Formula</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Slow sand filters require low interstitial flow velocity (0.1 - 0.2 m/hr) so the biological schmutzdecke can metabolize pathogens. Sizing too small forces water through too rapidly, destroying biological cleansing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Group Daily Need: <span className="text-emerald-400 font-bold">{dailyDemandLiters} L/day</span>
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={dailyDemandLiters}
              onChange={(e) => setDailyDemandLiters(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Approx { Math.round(dailyDemandLiters / 4) } adults (at 4L/person/day)
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg">
            <span className="block text-xs uppercase font-mono text-zinc-400">Surface Area Needed</span>
            <span className="text-xl font-mono font-bold text-zinc-100 tabular-nums">
              {requiredSurfaceAreaM2} <span className="text-xs text-zinc-400">m²</span>
            </span>
            <span className="block text-xs text-zinc-500 mt-1">At 150 L/m²/day loading</span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg">
            <span className="block text-xs uppercase font-mono text-zinc-400">Cistern Minimum Diameter</span>
            <span className="text-xl font-mono font-bold text-emerald-400 tabular-nums">
              {requiredDiameterCm} <span className="text-xs text-zinc-400">cm</span>
            </span>
            <span className="block text-xs text-zinc-500 mt-1">
              {requiredDiameterCm <= 60 ? 'Standard 200L barrel fits' : 'Requires multi-barrel array'}
            </span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg">
            <span className="block text-xs uppercase font-mono text-zinc-400">Silica Sand Required</span>
            <span className="text-xl font-mono font-bold text-zinc-100 tabular-nums">
              {sandVolumeKg} <span className="text-xs text-zinc-400">kg</span>
            </span>
            <span className="block text-xs text-zinc-500 mt-1">70 cm bed depth (0.2 mm grain)</span>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4 text-xs text-zinc-400 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            Operating Rule: Maintain continuous 5–10 cm water head over sand bed via swan-neck elevated siphon. Never let bed dry out, or schmutzdecke microorganisms die within 4 hours.
          </span>
        </div>
      </section>
    </div>
  );
};
