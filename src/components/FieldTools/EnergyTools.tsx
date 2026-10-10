import React, { useState } from 'react';
import { Zap, BatteryCharging, Gauge, Sun, AlertTriangle, ShieldCheck } from 'lucide-react';

export const EnergyTools: React.FC = () => {
  // Solar Harvest State
  const [panelWatts, setPanelWatts] = useState<number>(200);
  const [peakSunHours, setPeakSunHours] = useState<number>(4.5);
  const [systemEfficiency, setSystemEfficiency] = useState<number>(80); // 80% typical MPPT + cabling + temp loss

  // Battery State of Charge Lookup
  const [batteryType, setBatteryType] = useState<'lifepo4' | 'agm' | 'flooded' | 'li_ion'>('lifepo4');
  const [batteryVoltage, setBatteryVoltage] = useState<number>(13.3);

  // Wire Voltage Drop State
  const [systemVoltage, setSystemVoltage] = useState<number>(12);
  const [loadAmps, setLoadAmps] = useState<number>(15);
  const [cableLengthMeters, setCableLengthMeters] = useState<number>(6); // one way
  const [wireGaugeAwg, setWireGaugeAwg] = useState<number>(10);

  // Earth Battery Ground Cell State
  const [earthCellPairs, setEarthCellPairs] = useState<number>(4);
  const [soilElectrolyte, setSoilElectrolyte] = useState<'doped_charcoal' | 'damp_meadow' | 'clay_wet' | 'dry_sand'>('doped_charcoal');
  const [plateAreaCm2, setPlateAreaCm2] = useState<number>(600);
  const [soilMoistureLevel, setSoilMoistureLevel] = useState<'saturated' | 'damp' | 'dry'>('damp');

  // Calculations
  const dailyWattHours = Math.round(panelWatts * peakSunHours * (systemEfficiency / 100));
  const dailyAh12V = Math.round(dailyWattHours / 12.8);
  const dailyAh24V = Math.round(dailyWattHours / 25.6);

  // Wire gauge resistance lookup table (Ohms per 1000m for pure annealed copper at 20°C)
  const awgResistanceMap: Record<number, number> = {
    4: 0.815,
    6: 1.296,
    8: 2.061,
    10: 3.277,
    12: 5.211,
    14: 8.286,
    16: 13.17,
    18: 20.95
  };

  const resistancePerMeter = (awgResistanceMap[wireGaugeAwg] || 3.277) / 1000;
  // Total loop distance is 2 * cableLengthMeters (supply + return)
  const totalResistance = 2 * cableLengthMeters * resistancePerMeter;
  const voltageDrop = (loadAmps * totalResistance).toFixed(2);
  const voltageDropPercent = ((parseFloat(voltageDrop) / systemVoltage) * 100).toFixed(1);
  const powerLossWatts = (loadAmps * parseFloat(voltageDrop)).toFixed(1);

  // Battery SoC calculation curves
  const getBatterySoC = (voltage: number, type: string) => {
    if (type === 'lifepo4') {
      // 12V 4-cell LiFePO4 resting curve
      if (voltage >= 13.6) return { soc: 100, status: 'Full / Absorption', color: 'text-emerald-400' };
      if (voltage >= 13.4) return { soc: 99, status: 'Upper Plateau', color: 'text-emerald-400' };
      if (voltage >= 13.3) return { soc: 90, status: 'Nominal Plateau', color: 'text-emerald-400' };
      if (voltage >= 13.25) return { soc: 70, status: 'Nominal Plateau', color: 'text-cyan-400' };
      if (voltage >= 13.20) return { soc: 50, status: 'Nominal Plateau', color: 'text-cyan-400' };
      if (voltage >= 13.10) return { soc: 30, status: 'Lower Plateau', color: 'text-amber-400' };
      if (voltage >= 13.00) return { soc: 20, status: 'Low Reserve', color: 'text-amber-400' };
      if (voltage >= 12.80) return { soc: 10, status: 'Critical Knee', color: 'text-rose-400' };
      if (voltage >= 12.00) return { soc: 0, status: 'Depleted (BMS Cutoff)', color: 'text-rose-500' };
      return { soc: 0, status: 'Severely Discharged', color: 'text-rose-600' };
    } else if (type === 'agm') {
      // 12V AGM Lead Acid resting 25°C
      if (voltage >= 12.84) return { soc: 100, status: 'Full Float', color: 'text-emerald-400' };
      if (voltage >= 12.65) return { soc: 85, status: 'Good Charge', color: 'text-emerald-400' };
      if (voltage >= 12.50) return { soc: 70, status: 'Moderate', color: 'text-cyan-400' };
      if (voltage >= 12.35) return { soc: 50, status: '50% Max Safe Depth of Discharge', color: 'text-amber-400' };
      if (voltage >= 12.20) return { soc: 35, status: 'Sulfation Hazard', color: 'text-amber-500' };
      if (voltage >= 12.00) return { soc: 20, status: 'Damage Imminent', color: 'text-rose-400' };
      return { soc: 0, status: 'Dead Cell / Sulfated', color: 'text-rose-600' };
    } else if (type === 'flooded') {
      // Flooded Lead Acid
      if (voltage >= 12.65) return { soc: 100, status: 'Fully Charged', color: 'text-emerald-400' };
      if (voltage >= 12.45) return { soc: 75, status: 'Adequate', color: 'text-cyan-400' };
      if (voltage >= 12.25) return { soc: 50, status: '50% Minimum Discharge Floor', color: 'text-amber-400' };
      if (voltage >= 12.05) return { soc: 25, status: 'Low / Acid Depleted', color: 'text-rose-400' };
      return { soc: 0, status: 'Completely Discharged', color: 'text-rose-600' };
    } else {
      // 3S 18650 Li-ion pack (9.0V to 12.6V)
      if (voltage >= 12.5) return { soc: 100, status: '4.20V / cell (Full)', color: 'text-emerald-400' };
      if (voltage >= 12.0) return { soc: 80, status: '4.00V / cell', color: 'text-emerald-400' };
      if (voltage >= 11.4) return { soc: 60, status: '3.80V / cell (Storage)', color: 'text-cyan-400' };
      if (voltage >= 10.8) return { soc: 30, status: '3.60V / cell', color: 'text-amber-400' };
      if (voltage >= 10.0) return { soc: 10, status: '3.33V / cell (Cutoff near)', color: 'text-rose-400' };
      return { soc: 0, status: 'Under-Voltage Cutoff', color: 'text-rose-600' };
    }
  };

  const currentBatteryState = getBatterySoC(batteryVoltage, batteryType);

  return (
    <div className="space-y-8">
      {/* Tool 1: Solar Daily Harvest Estimator */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-zinc-100">Solar Photovoltaic Daily Energy Harvest Estimator</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Insolation × Derating Model</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Computes realistic off-grid daily energy harvest considering atmospheric attenuation, temperature coefficient derating (-0.4%/°C above 25°C), MPPT tracking efficiency, and wiring losses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Panel Array Rating: <span className="text-amber-400 font-bold">{panelWatts} Watts STC</span>
            </label>
            <input
              type="range"
              min="50"
              max="1200"
              step="50"
              value={panelWatts}
              onChange={(e) => setPanelWatts(Number(e.target.value))}
              className="w-full accent-amber-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono mt-1">
              <span>100W (Portable)</span>
              <span>400W (Cabin)</span>
              <span>1200W (Base)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Peak Sun Hours: <span className="text-amber-400 font-bold">{peakSunHours} Hours/Day</span>
            </label>
            <input
              type="range"
              min="1.5"
              max="7.0"
              step="0.5"
              value={peakSunHours}
              onChange={(e) => setPeakSunHours(Number(e.target.value))}
              className="w-full accent-amber-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono mt-1">
              <span>Winter/Overcast (2h)</span>
              <span>Equinox (4.5h)</span>
              <span>Desert Summer (6.5h)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              System Total Efficiency: <span className="text-amber-400 font-bold">{systemEfficiency}%</span>
            </label>
            <input
              type="range"
              min="60"
              max="95"
              step="5"
              value={systemEfficiency}
              onChange={(e) => setSystemEfficiency(Number(e.target.value))}
              className="w-full accent-amber-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <p className="text-xs text-zinc-500 font-mono mt-1">
              MPPT Controller: ~85% | PWM Controller: ~70%
            </p>
          </div>
        </div>

        {/* Output Metrics Bar */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="block text-xs uppercase font-mono text-zinc-400">Total Harvest Energy</span>
            <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
              {dailyWattHours} <span className="text-xs text-zinc-400 font-normal">WATT-HOURS / DAY</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              ({ (dailyWattHours / 1000).toFixed(2) } kWh)
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-4">
            <span className="block text-xs uppercase font-mono text-zinc-400">12V Battery Replenishment</span>
            <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
              {dailyAh12V} <span className="text-xs text-zinc-400 font-normal">Amp-Hours (Ah)</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Sufficient to recharge { Math.round(dailyAh12V / 100 * 100) }% of a 100Ah 12V battery
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-4">
            <span className="block text-xs uppercase font-mono text-zinc-400">24V System Replenishment</span>
            <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
              {dailyAh24V} <span className="text-xs text-zinc-400 font-normal">Amp-Hours (Ah)</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Half the current draw, reduces cable gauge required
            </span>
          </div>
        </div>
      </section>

      {/* Tool 2: Battery State-of-Charge & Health Lookup */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BatteryCharging className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-zinc-100">Resting Battery State of Charge (SoC) & Health Diagnostic</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Open-Circuit Voltage (OCV) Method</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          CRITICAL MEASUREMENT RULE: Measure voltage only after the battery has rested with zero charge or discharge loads for at least 60 minutes. Measuring under active load will show a false sag.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Battery Chemistry</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => { setBatteryType('lifepo4'); setBatteryVoltage(13.3); }}
                className={`p-2 text-xs font-medium rounded border text-left transition-colors ${
                  batteryType === 'lifepo4'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                12V LiFePO4 (LFP 4S)
              </button>
              <button
                onClick={() => { setBatteryType('agm'); setBatteryVoltage(12.6); }}
                className={`p-2 text-xs font-medium rounded border text-left transition-colors ${
                  batteryType === 'agm'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                12V Sealed AGM Lead-Acid
              </button>
              <button
                onClick={() => { setBatteryType('flooded'); setBatteryVoltage(12.5); }}
                className={`p-2 text-xs font-medium rounded border text-left transition-colors ${
                  batteryType === 'flooded'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                12V Flooded Lead-Acid
              </button>
              <button
                onClick={() => { setBatteryType('li_ion'); setBatteryVoltage(11.8); }}
                className={`p-2 text-xs font-medium rounded border text-left transition-colors ${
                  batteryType === 'li_ion'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                3S Li-ion (18650 / 21700)
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Resting Voltage Reading: <span className="text-emerald-400 font-bold">{batteryVoltage.toFixed(2)} V</span>
              </label>
              <input
                type="range"
                min={batteryType === 'li_ion' ? 9.0 : 11.5}
                max={batteryType === 'li_ion' ? 12.6 : 14.4}
                step="0.05"
                value={batteryVoltage}
                onChange={(e) => setBatteryVoltage(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-800 h-2 rounded cursor-pointer"
              />
              <div className="flex justify-between text-xs text-zinc-500 font-mono mt-1">
                <span>{batteryType === 'li_ion' ? '9.0V' : '11.5V (Dead)'}</span>
                <span>{batteryType === 'li_ion' ? '11.1V (Nom)' : '12.8V'}</span>
                <span>{batteryType === 'li_ion' ? '12.6V (Full)' : '14.4V (Charge)'}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono text-zinc-400">Calculated Charge Level</span>
                <span className={`text-xs font-mono ${currentBatteryState.color}`}>
                  {currentBatteryState.status}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className={`text-4xl font-mono font-bold ${currentBatteryState.color} tabular-nums`}>
                  {currentBatteryState.soc}%
                </span>
                <span className="text-xs text-zinc-400 font-mono">CAPACITY REMAINING</span>
              </div>

              {/* Graphical State Bar */}
              <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full transition-all ${
                    currentBatteryState.soc > 50
                      ? 'bg-emerald-500'
                      : currentBatteryState.soc > 20
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${currentBatteryState.soc}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-zinc-400 border-t border-zinc-800 pt-3">
              {batteryType === 'lifepo4' && (
                <span>
                  Notice: LiFePO4 has an extremely flat discharge plateau between 13.3V and 13.1V. A drop from 13.2V to 12.8V represents rapid depletion. Max safe DoD is 90%.
                </span>
              )}
              {(batteryType === 'agm' || batteryType === 'flooded') && (
                <span>
                  Lead-Acid Warning: Discharging below 50% (approx 12.2V) triggers lead sulfate crystallization that permanently reduces amp-hour capacity.
                </span>
              )}
              {batteryType === 'li_ion' && (
                <span>
                  Storage Tip: Li-ion cells last longest if stored at 3.80V per cell (~11.4V for 3S pack) in cool conditions.
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tool 3: Wire Gauge & Voltage Drop Calculator */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Gauge className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-zinc-100">DC Wire Gauge & Voltage Drop Calculator</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Ohm's Law: V = 2 × I × L × R</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Low-voltage direct current (12V DC) carries high amperage, resulting in severe resistive losses and fire hazards over moderate cable runs. Critical loads (inverters, radios) must maintain &lt; 3% voltage drop.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">System Voltage</label>
            <select
              value={systemVoltage}
              onChange={(e) => setSystemVoltage(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs py-2 px-3 rounded font-mono"
            >
              <option value={12}>12 V DC (Nominal)</option>
              <option value={24}>24 V DC (Dual Battery)</option>
              <option value={48}>48 V DC (Microgrid)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Load Current: <span className="text-cyan-400 font-bold">{loadAmps} Amps</span>
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={loadAmps}
              onChange={(e) => setLoadAmps(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <span className="text-xs text-zinc-500 font-mono mt-1 block">
              Load: { loadAmps * systemVoltage } Watts
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Cable Run (1-Way): <span className="text-cyan-400 font-bold">{cableLengthMeters} meters</span> ({ Math.round(cableLengthMeters * 3.28) } ft)
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={cableLengthMeters}
              onChange={(e) => setCableLengthMeters(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <span className="text-xs text-zinc-500 font-mono mt-1 block">
              Round-trip loop: { cableLengthMeters * 2 } meters
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Wire Gauge (AWG)</label>
            <select
              value={wireGaugeAwg}
              onChange={(e) => setWireGaugeAwg(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs py-2 px-3 rounded font-mono"
            >
              <option value={4}>4 AWG (21.2 mm² - Heavy Inverter)</option>
              <option value={6}>6 AWG (13.3 mm² - Battery Bank)</option>
              <option value={8}>8 AWG (8.36 mm² - High Solar)</option>
              <option value={10}>10 AWG (5.26 mm² - Solar Run)</option>
              <option value={12}>12 AWG (3.31 mm² - Appliance)</option>
              <option value={14}>14 AWG (2.08 mm² - Lighting)</option>
              <option value={16}>16 AWG (1.31 mm² - Small Sensor)</option>
              <option value={18}>18 AWG (0.82 mm² - Signal)</option>
            </select>
          </div>
        </div>

        {/* Calculation Result */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="block text-xs uppercase font-mono text-zinc-400">Voltage Drop</span>
              <span className={`text-2xl font-mono font-bold tabular-nums ${
                parseFloat(voltageDropPercent) <= 3
                  ? 'text-emerald-400'
                  : parseFloat(voltageDropPercent) <= 5
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}>
                {voltageDrop} <span className="text-xs text-zinc-400 font-normal">VOLTS</span>
              </span>
            </div>

            <div className="border-l border-zinc-800 pl-6">
              <span className="block text-xs uppercase font-mono text-zinc-400">Percentage Loss</span>
              <span className={`text-2xl font-mono font-bold tabular-nums ${
                parseFloat(voltageDropPercent) <= 3
                  ? 'text-emerald-400'
                  : parseFloat(voltageDropPercent) <= 5
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}>
                {voltageDropPercent}%
              </span>
            </div>

            <div className="border-l border-zinc-800 pl-6">
              <span className="block text-xs uppercase font-mono text-zinc-400">Dissipated Heat</span>
              <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
                {powerLossWatts} <span className="text-xs text-zinc-400 font-normal">WATTS</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {parseFloat(voltageDropPercent) <= 3 ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3 py-1.5 rounded font-mono">
                <ShieldCheck className="w-4 h-4" /> Compliant (&lt;3% Standard)
              </span>
            ) : parseFloat(voltageDropPercent) <= 5 ? (
              <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/40 border border-amber-800 px-3 py-1.5 rounded font-mono">
                <AlertTriangle className="w-4 h-4" /> Acceptable for non-critical loads only
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800 px-3 py-1.5 rounded font-mono">
                <AlertTriangle className="w-4 h-4" /> Hazard: Increase wire gauge or shorten run
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Tool 4: Galvanic Copper-Zinc Ground Cell (Earth Battery) Calculator & Blueprint */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-zinc-100">
              Galvanic Copper-Zinc Ground Cell (Earth Battery) Simulator & Blueprint
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Bain (1841) / Stubblefield (1898) Principle</span>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed">
          Generates continuous baseline direct current directly from the earth using dissimilar galvanic oxidation-reduction potentials: Copper cathode (+0.34V) and Zinc anode (-0.76V) buried in moist, mineralized soil. Operates 24/7 without sun, wind, or fossil fuel.
        </p>

        {/* Interactive Earth Battery Calculator */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Series Cell Pairs: <span className="text-amber-400 font-bold">{earthCellPairs} Pairs</span>
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={earthCellPairs}
              onChange={(e) => setEarthCellPairs(Number(e.target.value))}
              className="w-full accent-amber-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono mt-1">
              <span>1 Pair (0.9V)</span>
              <span>4 Pairs (3.6V)</span>
              <span>12 Pairs (11V)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Soil & Electrolyte Doping
            </label>
            <select
              value={soilElectrolyte}
              onChange={(e) => setSoilElectrolyte(e.target.value as any)}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs py-2 px-3 rounded font-mono"
            >
              <option value="doped_charcoal">Doped: Moist Loam + Biochar & Wood Ash (0.95V / cell)</option>
              <option value="damp_meadow">Natural: Damp Forest Meadow Soil (0.85V / cell)</option>
              <option value="clay_wet">Dense Wet Clay (0.75V / cell)</option>
              <option value="dry_sand">Dry Sandy Soil / Arid (0.45V / cell)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Electrode Plate Area: <span className="text-cyan-400 font-bold">{plateAreaCm2} cm²</span>
            </label>
            <input
              type="range"
              min="150"
              max="2000"
              step="50"
              value={plateAreaCm2}
              onChange={(e) => setPlateAreaCm2(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <span className="text-xs text-zinc-500 font-mono mt-1 block">
              {plateAreaCm2 <= 400 ? 'Small Pipe / Rebar' : plateAreaCm2 <= 1000 ? 'Standard 20x30cm Plate' : 'Large Trench Sheet'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Soil Moisture Level
            </label>
            <select
              value={soilMoistureLevel}
              onChange={(e) => setSoilMoistureLevel(e.target.value as any)}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs py-2 px-3 rounded font-mono"
            >
              <option value="saturated">Saturated / Creek Bed Margin (Low Internal R)</option>
              <option value="damp">Moderate Damp Ground (Typical 25%)</option>
              <option value="dry">Dry Topsoil (High Internal R - Needs Doping)</option>
            </select>
          </div>
        </div>

        {/* Calculated Performance Readout */}
        {(() => {
          const voltPerCell = soilElectrolyte === 'doped_charcoal' ? 0.95 : soilElectrolyte === 'damp_meadow' ? 0.85 : soilElectrolyte === 'clay_wet' ? 0.75 : 0.45;
          const openCircuitVoltage = (earthCellPairs * voltPerCell).toFixed(2);
          const moistureFactor = soilMoistureLevel === 'saturated' ? 1.4 : soilMoistureLevel === 'damp' ? 1.0 : 0.35;
          const currentPerCellMa = ((plateAreaCm2 / 50) * moistureFactor * (voltPerCell / 0.85)).toFixed(1);
          const totalPowerMilliwatts = (parseFloat(openCircuitVoltage) * parseFloat(currentPerCellMa) * 0.5).toFixed(1);
          const dailyWattHours = ((parseFloat(totalPowerMilliwatts) * 24) / 1000).toFixed(2);

          return (
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="block text-xs uppercase font-mono text-zinc-400">Open-Circuit Voltage (Voc)</span>
                <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
                  {openCircuitVoltage} <span className="text-xs text-zinc-400 font-normal">VOLTS DC</span>
                </span>
                <span className="block text-xs font-mono text-zinc-500 mt-1">
                  {voltPerCell}V per cell pair in series
                </span>
              </div>

              <div className="border-l border-zinc-800 pl-4">
                <span className="block text-xs uppercase font-mono text-zinc-400">Short-Circuit Current</span>
                <span className="text-2xl font-mono font-bold text-cyan-400 tabular-nums">
                  {currentPerCellMa} <span className="text-xs text-zinc-400 font-normal">mA</span>
                </span>
                <span className="block text-xs font-mono text-zinc-500 mt-1">
                  Scales with plate surface area
                </span>
              </div>

              <div className="border-l border-zinc-800 pl-4">
                <span className="block text-xs uppercase font-mono text-zinc-400">Continuous Output</span>
                <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                  {totalPowerMilliwatts} <span className="text-xs text-zinc-400 font-normal">mW</span>
                </span>
                <span className="block text-xs font-mono text-zinc-500 mt-1">
                  Harvest: {dailyWattHours} Wh / day continuous
                </span>
              </div>

              <div className="border-l border-zinc-800 pl-4 flex flex-col justify-center text-xs font-mono">
                <span className="text-zinc-400 block mb-1">Functional Capability:</span>
                {parseFloat(openCircuitVoltage) >= 3.2 ? (
                  <span className="text-emerald-400 font-bold">
                    ✓ Direct 3.3V Microcontroller & LED Output
                  </span>
                ) : parseFloat(openCircuitVoltage) >= 1.2 ? (
                  <span className="text-cyan-400 font-bold">
                    ✓ 1-Transistor Joule Thief Step-Up Capable
                  </span>
                ) : (
                  <span className="text-amber-400">
                    ⚠ Add pairs in series to reach &gt;1.5V threshold
                  </span>
                )}
              </div>
            </div>
          );
        })()}

        {/* Blueprint & Fabrication Instructions */}
        <div className="bg-zinc-950 p-5 rounded-lg border border-zinc-800 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-400">
            Step-by-Step Fabrication, Wiring & Placement Blueprint
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300">
            <div className="space-y-3">
              <div className="font-semibold text-zinc-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-amber-400 flex items-center justify-center font-mono text-xs">1</span>
                <span>Electrode Material Selection & Prep</span>
              </div>
              <p className="leading-relaxed pl-7 text-zinc-400">
                <strong className="text-zinc-200">Copper Cathode (+):</strong> Scrap copper roofing flashing, 3/4" copper plumbing pipe, or coils of thick bare copper ground wire (minimum 10 AWG). Scour surfaces with coarse sandpaper or wire brush to remove protective patina.
                <br /><br />
                <strong className="text-zinc-200">Zinc Anode (-):</strong> Galvanized steel rebar, sheet zinc roof flashing, or marine sacrificial zinc boat anodes. (Hot-dip galvanized steel has a heavy zinc coating that lasts 1-2 years). Wire-brush to shiny metallic surface.
              </p>

              <div className="font-semibold text-zinc-100 flex items-center gap-2 pt-2">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-amber-400 flex items-center justify-center font-mono text-xs">2</span>
                <span>Burial Geometry & Soil Doping</span>
              </div>
              <p className="leading-relaxed pl-7 text-zinc-400">
                Dig separate holes or a trench <strong className="text-zinc-200">50 to 70 cm deep</strong> (below summer sun drying depth and winter frost line).
                Space each copper-zinc pair <strong className="text-zinc-200">1.5 to 2.0 meters apart</strong> to prevent localized ion exhaustion.
                Pack each copper plate with a 5cm jacket of <strong className="text-cyan-400">damp crushed charcoal or biochar</strong> (carbon expands effective surface area and prevents polarization). Dope the soil around the zinc with 5 liters of water mixed with 200g of Epsom salt or wood ash.
              </p>
            </div>

            <div className="space-y-3">
              <div className="font-semibold text-zinc-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-amber-400 flex items-center justify-center font-mono text-xs">3</span>
                <span>Interconnect Wiring & Waterproofing</span>
              </div>
              <p className="leading-relaxed pl-7 text-zinc-400">
                <strong className="text-zinc-200">Wire Specification:</strong> Use solid-conductor insulated copper building wire (<strong className="text-zinc-200">14 AWG or 16 AWG THHN</strong>). Avoid stranded wire in ground applications, as moisture wicks inside strands and corrodes them over time.
                <br /><br />
                <strong className="text-zinc-200">Series Wiring:</strong> Connect the Zinc anode of Cell 1 to the Copper cathode of Cell 2; Zinc of Cell 2 to Copper of Cell 3, continuing down the array.
                <br /><br />
                <strong className="text-rose-300">CRITICAL SPLICE WATERPROOFING:</strong> Solder connections with rosin-core solder. Seal every underground joint with silicone sealant and slide dual-wall adhesive-lined heatshrink over the splice. Exposed underground splices will corrode and open-circuit within 30 days!
              </p>

              <div className="font-semibold text-zinc-100 flex items-center gap-2 pt-2">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-amber-400 flex items-center justify-center font-mono text-xs">4</span>
                <span>Output Utilization & Joule Thief Circuit</span>
              </div>
              <p className="leading-relaxed pl-7 text-zinc-400">
                Connect terminal positive (+ lead from Copper 1) and negative (- lead from Zinc 4) into a terminal strip. Connect an inline <strong className="text-zinc-200">1N5819 Schottky blocking diode</strong> and a 1000uF low-leakage electrolytic capacitor.
                To power 3.3V/5V loads from low voltages (1.0V-2.0V), connect a simple 1-transistor (2N3904) toroid inductor Joule Thief circuit to boost voltage to 5V for LED lighting, low-power radios, or charging supercapacitors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
