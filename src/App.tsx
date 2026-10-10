import React, { useState, useEffect } from 'react';
import { TacticalTheme, OperatorUser, CustomSurvivalKit } from './types';
import { Header } from './components/Header';
import { FieldToolsContainer } from './components/FieldTools/FieldToolsContainer';
import { TechTreeGraph } from './components/TechTree/TechTreeGraph';
import { KnowledgeLibrary } from './components/KnowledgeLibrary/KnowledgeLibrary';
import { BotanicalCompendiumView } from './components/Botanical/BotanicalCompendiumView';
import { ChatAssistantView } from './components/ChatAssistant/ChatAssistantView';
import { OfflineMapsView } from './components/OfflineMaps/OfflineMapsView';
import { PersonalVaultView } from './components/PersonalVault/PersonalVaultView';
import { NeuralCoreBlueprintView } from './components/NeuralCoreBlueprint/NeuralCoreBlueprintView';
import { CheckoutView } from './components/Checkout/CheckoutView';
import { AdminModal } from './components/Admin/AdminModal';
import { INITIAL_CUSTOM_KITS } from './data/customKitsData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('tools');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Custom Survival Kits State (File Ingestion & Community Lore)
  const [customKits, setCustomKits] = useState<CustomSurvivalKit[]>(() => {
    try {
      const saved = localStorage.getItem('zakhar_custom_survival_kits');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_CUSTOM_KITS;
  });

  const handleAddCustomKit = (newKit: CustomSurvivalKit) => {
    const updated = [newKit, ...customKits];
    setCustomKits(updated);
    try {
      localStorage.setItem('zakhar_custom_survival_kits', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteCustomKit = (id: string) => {
    const updated = customKits.filter(k => k.id !== id);
    setCustomKits(updated);
    try {
      localStorage.setItem('zakhar_custom_survival_kits', JSON.stringify(updated));
    } catch (e) {}
  };

  // Operator User State (Pre-authenticated for damoneward38@gmail.com 313Damone)
  const [currentUser, setCurrentUser] = useState<OperatorUser>(() => {
    try {
      const saved = localStorage.getItem('zakhar_operator_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email && parsed.role) return parsed;
      }
    } catch (e) {}
    // Default authorized Administrator Damone
    return {
      email: 'damoneward38@gmail.com',
      role: 'admin',
      callsign: 'COMMANDER // DAMONE (313-DETROIT)',
      isAuthenticated: true,
      passcode: '313Damone',
      loginTimestamp: new Date().toISOString(),
      permissions: [
        'SYSTEM_OVERRIDE_LEVEL_5',
        'VAULT_MASTER_ACCESS',
        'NEURALCORE_AUDIT_SIGN_OFF',
        'AI_BRAIN_COMMANDER_MODE',
        'MGRS_TACTICAL_ENCRYPTION',
        'MASTER_REDOUBT_LEVEL_5'
      ]
    };
  });

  const [theme, setTheme] = useState<TacticalTheme>(() => {
    try {
      const saved = localStorage.getItem('zakhar_theme');
      return (saved as TacticalTheme) || 'standard';
    } catch (e) {
      return 'standard';
    }
  });

  useEffect(() => {
    document.body.className = `theme-${theme} bg-zinc-950 text-zinc-100 antialiased`;
    try {
      localStorage.setItem('zakhar_theme', theme);
    } catch (e) {}
  }, [theme]);

  // Persist operator user
  const handleUpdateUser = (updated: OperatorUser) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('zakhar_operator_session', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3-Zone Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        currentUser={currentUser}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'tools' && (
          <FieldToolsContainer
            currentUser={currentUser}
            customKits={customKits}
            onAddKit={handleAddCustomKit}
            onDeleteKit={handleDeleteCustomKit}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'techtree' && <TechTreeGraph />}
        {activeTab === 'flora' && <BotanicalCompendiumView />}
        {activeTab === 'chat' && (
          <ChatAssistantView
            currentUser={currentUser}
            customKits={customKits}
            onAddCustomKit={handleAddCustomKit}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'pricing' && <CheckoutView currentUser={currentUser} onUpdateUser={handleUpdateUser} onNavigateTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'library' && <KnowledgeLibrary />}
        {activeTab === 'maps' && <OfflineMapsView />}
        {activeTab === 'vault' && <PersonalVaultView />}
        {activeTab === 'blueprint' && <NeuralCoreBlueprintView />}
      </main>

      {/* Admin Authentication & Command Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Subtle Uncluttered Footer */}
      <footer className="border-t border-zinc-800/80 py-4 px-6 text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>STANDALONE AIR-GAPPED RUNTIME · OPERATOR: {currentUser.callsign}</span>
        </div>
        <div>
          <span>ZAKHAR OS // NEURALCORE AUDIT 9 OCT 2026</span>
        </div>
      </footer>
    </div>
  );
}
