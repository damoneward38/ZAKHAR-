import React, { useState, useEffect } from 'react';
import { HeartPulse, Flame, Clock, Activity, AlertOctagon, CheckCircle, ShieldAlert } from 'lucide-react';

interface TourniquetLog {
  id: string;
  patient: string;
  limb: string;
  appliedAt: number; // timestamp
}

export const HealthTools: React.FC = () => {
  // START Triage State
  const [canWalk, setCanWalk] = useState<boolean | null>(null);
  const [spontaneousBreathing, setSpontaneousBreathing] = useState<boolean | null>(null);
  const [breathingAfterAirway, setBreathingAfterAirway] = useState<boolean | null>(null);
  const [respiratoryRate, setRespiratoryRate] = useState<string | null>(null); // 'normal' | 'fast' (>30)
  const [radialPulsePresent, setRadialPulsePresent] = useState<boolean | null>(null);
  const [obeysCommands, setObeysCommands] = useState<boolean | null>(null);

  // Burn Calculator State
  const [patientWeightKg, setPatientWeightKg] = useState<number>(75);
  const [selectedBurnZones, setSelectedBurnZones] = useState<Record<string, number>>({});

  // Tourniquet State
  const [tourniquets, setTourniquets] = useState<TourniquetLog[]>([
    { id: '1', patient: 'Casualty #1', limb: 'Right Thigh (High & Tight)', appliedAt: Date.now() - 42 * 60 * 1000 }
  ]);
  const [newPatient, setNewPatient] = useState<string>('');
  const [newLimb, setNewLimb] = useState<string>('Right Upper Arm');
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Update clock every 10 seconds for tourniquet tracker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Burn zones map
  const burnZones = [
    { id: 'head', name: 'Entire Head & Neck', percent: 9 },
    { id: 'anterior_torso', name: 'Anterior Torso (Chest + Abdomen)', percent: 18 },
    { id: 'posterior_torso', name: 'Posterior Torso (Upper & Lower Back)', percent: 18 },
    { id: 'left_arm', name: 'Left Entire Arm', percent: 9 },
    { id: 'right_arm', name: 'Right Entire Arm', percent: 9 },
    { id: 'left_leg', name: 'Left Entire Leg', percent: 18 },
    { id: 'right_leg', name: 'Right Entire Leg', percent: 18 },
    { id: 'groin', name: 'Perineum / Genitalia', percent: 1 }
  ];

  const toggleBurnZone = (zoneId: string, percent: number) => {
    setSelectedBurnZones(prev => {
      const copy = { ...prev };
      if (copy[zoneId]) {
        delete copy[zoneId];
      } else {
        copy[zoneId] = percent;
      }
      return copy;
    });
  };

  const totalTbsa = Object.values(selectedBurnZones).reduce((a, b) => a + b, 0);
  const parklandTotal24hMl = Math.round(4 * patientWeightKg * totalTbsa);
  const parklandFirst8hMl = Math.round(parklandTotal24hMl / 2);
  const parklandFirst8hRateMlHr = Math.round(parklandFirst8hMl / 8);
  const parklandRemaining16hRateMlHr = Math.round(parklandFirst8hMl / 16);

  // START Triage Outcome
  const getTriageCategory = () => {
    if (canWalk === true) return { tag: 'MINOR (GREEN)', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-500' };
    if (canWalk === false) {
      if (spontaneousBreathing === false && breathingAfterAirway === false) {
        return { tag: 'EXPECTANT / DECEASED (BLACK)', color: 'text-zinc-400', bg: 'bg-zinc-950 border-zinc-700' };
      }
      if (spontaneousBreathing === false && breathingAfterAirway === true) {
        return { tag: 'IMMEDIATE (RED)', color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-500' };
      }
      if (spontaneousBreathing === true) {
        if (respiratoryRate === 'fast') return { tag: 'IMMEDIATE (RED)', color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-500' };
        if (respiratoryRate === 'normal') {
          if (radialPulsePresent === false) return { tag: 'IMMEDIATE (RED)', color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-500' };
          if (radialPulsePresent === true) {
            if (obeysCommands === false) return { tag: 'IMMEDIATE (RED)', color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-500' };
            if (obeysCommands === true) return { tag: 'DELAYED (YELLOW)', color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-500' };
          }
        }
      }
    }
    return null;
  };

  const triageResult = getTriageCategory();

  const resetTriage = () => {
    setCanWalk(null);
    setSpontaneousBreathing(null);
    setBreathingAfterAirway(null);
    setRespiratoryRate(null);
    setRadialPulsePresent(null);
    setObeysCommands(null);
  };

  const addTourniquet = () => {
    if (!newPatient.trim()) return;
    const item: TourniquetLog = {
      id: Date.now().toString(),
      patient: newPatient,
      limb: newLimb,
      appliedAt: Date.now()
    };
    setTourniquets([item, ...tourniquets]);
    setNewPatient('');
  };

  const removeTourniquet = (id: string) => {
    setTourniquets(tourniquets.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Tool 1: START Wilderness Mass Casualty Triage */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-semibold text-zinc-100">Simple Triage and Rapid Treatment (START) Decision Tree</h3>
          </div>
          <button
            onClick={resetTriage}
            className="text-xs text-zinc-400 hover:text-zinc-200 underline font-mono"
          >
            Reset Evaluation
          </button>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Standard triage protocol for mass casualties. Rapidly segregates patients based on physiological respiration, perfusion, and neurological responsiveness in under 30 seconds.
        </p>

        {/* Step-by-Step Flow */}
        <div className="space-y-4 mb-6">
          {/* Question 1: Ambulatory */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="block text-xs font-mono uppercase text-zinc-500">1. Ambulatory Assessment</span>
              <span className="text-sm font-medium text-zinc-200">Can the patient walk and follow commands?</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setCanWalk(true); }}
                className={`px-3 py-1.5 text-xs font-medium rounded border ${canWalk === true ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
              >
                Yes (Walking)
              </button>
              <button
                onClick={() => { setCanWalk(false); }}
                className={`px-3 py-1.5 text-xs font-medium rounded border ${canWalk === false ? 'bg-zinc-800 border-zinc-600 text-zinc-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
              >
                No
              </button>
            </div>
          </div>

          {/* Question 2: Breathing */}
          {canWalk === false && (
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="block text-xs font-mono uppercase text-zinc-500">2. Respiration Check</span>
                <span className="text-sm font-medium text-zinc-200">Is the patient breathing spontaneously?</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setSpontaneousBreathing(true); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${spontaneousBreathing === true ? 'bg-zinc-800 border-zinc-600 text-zinc-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  Yes
                </button>
                <button
                  onClick={() => { setSpontaneousBreathing(false); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${spontaneousBreathing === false ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  No (Apneic)
                </button>
              </div>
            </div>
          )}

          {/* Question 2b: Airway Repositioning */}
          {canWalk === false && spontaneousBreathing === false && (
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="block text-xs font-mono uppercase text-zinc-500">2b. Airway Reposition</span>
                <span className="text-sm font-medium text-zinc-200">Perform head-tilt / chin-lift or jaw-thrust. Does breathing resume?</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setBreathingAfterAirway(true)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${breathingAfterAirway === true ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  Yes (Resumed)
                </button>
                <button
                  onClick={() => setBreathingAfterAirway(false)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${breathingAfterAirway === false ? 'bg-zinc-800 border-zinc-600 text-zinc-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  No (Still Apneic)
                </button>
              </div>
            </div>
          )}

          {/* Question 3: Respiratory Rate */}
          {canWalk === false && spontaneousBreathing === true && (
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="block text-xs font-mono uppercase text-zinc-500">3. Respiratory Rate</span>
                <span className="text-sm font-medium text-zinc-200">Breathing speed (breaths per minute):</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRespiratoryRate('normal')}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${respiratoryRate === 'normal' ? 'bg-zinc-800 border-zinc-600 text-zinc-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  Normal (10–30 bpm)
                </button>
                <button
                  onClick={() => setRespiratoryRate('fast')}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${respiratoryRate === 'fast' ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  Tachypneic (&gt;30 bpm or &lt;10 bpm)
                </button>
              </div>
            </div>
          )}

          {/* Question 4: Radial Pulse */}
          {canWalk === false && spontaneousBreathing === true && respiratoryRate === 'normal' && (
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="block text-xs font-mono uppercase text-zinc-500">4. Perfusion Check</span>
                <span className="text-sm font-medium text-zinc-200">Is radial wrist pulse palpable? (Or capillary refill &lt; 2s):</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRadialPulsePresent(true)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${radialPulsePresent === true ? 'bg-zinc-800 border-zinc-600 text-zinc-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  Yes (Pulse Present)
                </button>
                <button
                  onClick={() => setRadialPulsePresent(false)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${radialPulsePresent === false ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  No (Absent / Cap Refill &gt; 2s)
                </button>
              </div>
            </div>
          )}

          {/* Question 5: Mental Status */}
          {canWalk === false && spontaneousBreathing === true && respiratoryRate === 'normal' && radialPulsePresent === true && (
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="block text-xs font-mono uppercase text-zinc-500">5. Mental Status</span>
                <span className="text-sm font-medium text-zinc-200">Can patient follow simple command ("Squeeze my hand")?</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setObeysCommands(true)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${obeysCommands === true ? 'bg-amber-950/60 border-amber-500 text-amber-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  Yes (Obeys)
                </button>
                <button
                  onClick={() => setObeysCommands(false)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${obeysCommands === false ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  No (Confused / Unresponsive)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Triage Decision Banner */}
        {triageResult && (
          <div className={`p-4 rounded-lg border flex items-center justify-between ${triageResult.bg}`}>
            <div>
              <span className="text-xs uppercase font-mono text-zinc-400 block">Assigned Triage Priority</span>
              <span className={`text-xl font-mono font-bold ${triageResult.color}`}>
                {triageResult.tag}
              </span>
            </div>
            <div className="text-right text-xs text-zinc-300 max-w-sm">
              {triageResult.tag.includes('RED') && 'Priority 1 Evacuation. Requires immediate stabilization interventions within 60 minutes.'}
              {triageResult.tag.includes('YELLOW') && 'Priority 2. Serious injuries but systemic physiology currently stable; can wait 2-4 hours.'}
              {triageResult.tag.includes('GREEN') && 'Priority 3 ("Walking Wounded"). Minimal care required; direct to casualty collection point.'}
              {triageResult.tag.includes('BLACK') && 'Dead or non-survivable catastrophic trauma. Provide palliative comfort care only.'}
            </div>
          </div>
        )}
      </section>

      {/* Tool 2: Burn Rule of Nines & Parkland Resuscitation */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-semibold text-zinc-100">Wallace Rule of Nines & Parkland Fluid Resuscitation</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">ABA Standard Protocol</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Select all burned anatomical zones (2nd degree blistering or 3rd degree full-thickness only). Calculates total body surface area (% TBSA) and 24-hour Lactated Ringer's IV replacement volumes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
              Select Burn Zones (Click to Toggle):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {burnZones.map(zone => {
                const isSelected = !!selectedBurnZones[zone.id];
                return (
                  <button
                    key={zone.id}
                    onClick={() => toggleBurnZone(zone.id, zone.percent)}
                    className={`p-3 rounded text-left border transition-all ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-500 text-amber-200'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <span className="block font-mono font-bold text-sm">{zone.percent}%</span>
                    <span className="text-xs line-clamp-2 mt-1">{zone.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-col justify-between">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Patient Mass: <span className="text-amber-400 font-bold">{patientWeightKg} kg</span> ({ Math.round(patientWeightKg * 2.2) } lbs)
              </label>
              <input
                type="range"
                min="40"
                max="130"
                value={patientWeightKg}
                onChange={(e) => setPatientWeightKg(Number(e.target.value))}
                className="w-full accent-amber-500 bg-zinc-800 h-2 rounded cursor-pointer mb-4"
              />

              <div className="border-t border-zinc-800 pt-3">
                <span className="block text-xs font-mono uppercase text-zinc-500">Calculated Burn Area</span>
                <span className="text-3xl font-mono font-bold text-amber-400 tabular-nums">
                  {totalTbsa}% <span className="text-xs text-zinc-400 font-normal">TBSA</span>
                </span>
                <span className="block text-xs text-zinc-500 mt-1">
                  {totalTbsa > 20 ? 'Critical burn shock threshold exceeded' : 'Moderate burn burden'}
                </span>
              </div>
            </div>

            <div className="text-xs text-zinc-500 border-t border-zinc-800 pt-3">
              Formula: 4 mL × {patientWeightKg} kg × {totalTbsa}%
            </div>
          </div>
        </div>

        {/* Parkland IV Resuscitation Grid */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <span className="block text-xs uppercase font-mono text-zinc-400">Total 24h Fluid</span>
            <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
              {parklandTotal24hMl} <span className="text-xs text-zinc-400 font-normal">mL</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              ({ (parklandTotal24hMl / 1000).toFixed(2) } Liters LR)
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-4">
            <span className="block text-xs uppercase font-mono text-zinc-400">First 8 Hours Volume</span>
            <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
              {parklandFirst8hMl} <span className="text-xs text-zinc-400 font-normal">mL</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              From time of burn event
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-4">
            <span className="block text-xs uppercase font-mono text-zinc-400">First 8h Infusion Rate</span>
            <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
              {parklandFirst8hRateMlHr} <span className="text-xs text-zinc-400 font-normal">mL / hr</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Target 30-50 mL/hr urine output
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-4">
            <span className="block text-xs uppercase font-mono text-zinc-400">Next 16h Infusion Rate</span>
            <span className="text-2xl font-mono font-bold text-zinc-200 tabular-nums">
              {parklandRemaining16hRateMlHr} <span className="text-xs text-zinc-400 font-normal">mL / hr</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Titrate to vital signs
            </span>
          </div>
        </div>
      </section>

      {/* Tool 3: Tourniquet Time Tracker */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-semibold text-zinc-100">Tourniquet Application Log & Limb Ischemia Warning</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">TCCC Protocol</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Tracks elapsed tourniquet application duration. Tourniquets left beyond 2 hours risk permanent neuromuscular damage, rhabdomyolysis, and limb amputation. Mark time directly on patient forehead with indelible marker (e.g. "T 14:30").
        </p>

        {/* Add Tourniquet Bar */}
        <div className="flex flex-wrap gap-3 mb-6 bg-zinc-950 p-4 border border-zinc-800 rounded-lg">
          <input
            type="text"
            placeholder="Casualty ID / Name"
            value={newPatient}
            onChange={(e) => setNewPatient(e.target.value)}
            className="flex-1 min-w-[200px] bg-zinc-800 border border-zinc-700 text-xs px-3 py-2 rounded font-mono text-zinc-100"
          />
          <select
            value={newLimb}
            onChange={(e) => setNewLimb(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-xs px-3 py-2 rounded font-mono text-zinc-100"
          >
            <option value="Right Upper Arm">Right Upper Arm</option>
            <option value="Left Upper Arm">Left Upper Arm</option>
            <option value="Right Thigh (High & Tight)">Right Thigh (High & Tight)</option>
            <option value="Left Thigh (High & Tight)">Left Thigh (High & Tight)</option>
            <option value="Right Lower Leg">Right Lower Leg</option>
            <option value="Left Lower Leg">Left Lower Leg</option>
          </select>
          <button
            onClick={addTourniquet}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium px-4 py-2 rounded transition-colors"
          >
            Log Tourniquet Placement
          </button>
        </div>

        {/* Tourniquets Active List */}
        <div className="space-y-3">
          {tourniquets.map(tq => {
            const elapsedMs = currentTime - tq.appliedAt;
            const elapsedMins = Math.floor(elapsedMs / (1000 * 60));
            const hours = Math.floor(elapsedMins / 60);
            const mins = elapsedMins % 60;
            const isWarning = elapsedMins >= 90 && elapsedMins < 120;
            const isCritical = elapsedMins >= 120;

            return (
              <div
                key={tq.id}
                className={`p-4 rounded-lg border flex items-center justify-between flex-wrap gap-4 ${
                  isCritical
                    ? 'bg-rose-950/60 border-rose-600'
                    : isWarning
                    ? 'bg-amber-950/60 border-amber-600'
                    : 'bg-zinc-950 border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-100">{tq.patient}</span>
                    <span className="text-xs text-zinc-400">· {tq.limb}</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono mt-1 block">
                    Applied: {new Date(tq.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-mono uppercase text-zinc-400 block">Elapsed Time</span>
                    <span className={`text-xl font-mono font-bold tabular-nums ${
                      isCritical ? 'text-rose-400 animate-pulse' : isWarning ? 'text-amber-400' : 'text-zinc-100'
                    }`}>
                      {hours}h {mins}m
                    </span>
                  </div>

                  {isCritical ? (
                    <span className="text-xs bg-rose-900/80 text-rose-200 border border-rose-500 px-2 py-1 rounded font-mono flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> &gt;2h ISCHEMIA DANGER
                    </span>
                  ) : isWarning ? (
                    <span className="text-xs bg-amber-900/80 text-amber-200 border border-amber-500 px-2 py-1 rounded font-mono flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5" /> 90m RE-EVALUATE
                    </span>
                  ) : (
                    <span className="text-xs bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-1 rounded font-mono">
                      Nominal (&lt;90m)
                    </span>
                  )}

                  <button
                    onClick={() => removeTourniquet(tq.id)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 ml-2"
                  >
                    Release
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
