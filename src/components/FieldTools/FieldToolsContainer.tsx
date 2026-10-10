import React, { useState } from 'react';
import { Droplet, Zap, Radio, HeartPulse, Apple, Wrench, Lock, Layers } from 'lucide-react';
import { WaterTools } from './WaterTools';
import { EnergyTools } from './EnergyTools';
import { RadioTools } from './RadioTools';
import { HealthTools } from './HealthTools';
import { FoodTools } from './FoodTools';
import { MechanicalTools } from './MechanicalTools';
import { CryptoComputeTools } from './CryptoComputeTools';
import { CustomKitManager } from './CustomKitManager';
import { CustomSurvivalKit, OperatorUser } from '../../types';

interface FieldToolsContainerProps {
  currentUser?: OperatorUser;
  customKits?: CustomSurvivalKit[];
  onAddKit?: (kit: CustomSurvivalKit) => void;
  onDeleteKit?: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
  onSelectKitForChat?: (kit: CustomSurvivalKit) => void;
}

export const FieldToolsContainer: React.FC<FieldToolsContainerProps> = ({
  currentUser = {
    email: 'damoneward38@gmail.com',
    role: 'admin',
    callsign: 'COMMANDER // DAMONE (313-DETROIT)',
    isAuthenticated: true,
    passcode: '313Damone',
    loginTimestamp: new Date().toISOString(),
    permissions: ['SYSTEM_OVERRIDE_LEVEL_5']
  },
  customKits = [],
  onAddKit = () => {},
  onDeleteKit = () => {},
  onNavigateTab = () => {},
  onSelectKitForChat
}) => {
  const [activeSubTool, setActiveSubTool] = useState<string>('kits');

  const subTools = [
    { id: 'kits', label: '⭐ Survival Kits & Ingestion (Tier 3)', icon: Layers },
    { id: 'water', label: 'Water & Treatment', icon: Droplet },
    { id: 'energy', label: 'Energy & Power', icon: Zap },
    { id: 'radio', label: 'Radio & Morse', icon: Radio },
    { id: 'health', label: 'Medical & Triage', icon: HeartPulse },
    { id: 'food', label: 'Food & Rations', icon: Apple },
    { id: 'mechanics', label: 'Mechanics & Rigging', icon: Wrench },
    { id: 'crypto', label: 'Cryptography & Compute', icon: Lock }
  ];

  return (
    <div className="space-y-6">
      {/* Subtool Selector Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-lg flex items-center gap-1.5 overflow-x-auto">
        {subTools.map(st => {
          const Icon = st.icon;
          const isActive = activeSubTool === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setActiveSubTool(st.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Subtool Render */}
      <div>
        {activeSubTool === 'kits' && (
          <CustomKitManager
            currentUser={currentUser}
            customKits={customKits}
            onAddKit={onAddKit}
            onDeleteKit={onDeleteKit}
            onNavigateTab={onNavigateTab}
            onSelectKitForChat={onSelectKitForChat}
          />
        )}
        {activeSubTool === 'water' && <WaterTools />}
        {activeSubTool === 'energy' && <EnergyTools />}
        {activeSubTool === 'radio' && <RadioTools />}
        {activeSubTool === 'health' && <HealthTools />}
        {activeSubTool === 'food' && <FoodTools />}
        {activeSubTool === 'mechanics' && <MechanicalTools />}
        {activeSubTool === 'crypto' && <CryptoComputeTools />}
      </div>
    </div>
  );
};
