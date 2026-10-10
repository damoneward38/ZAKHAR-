import React from 'react';
import { TacticalTheme, OperatorUser } from '../types';
import { Shield, Eye, Sun, Moon, ShieldCheck, Mic } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: TacticalTheme;
  setTheme: (theme: TacticalTheme) => void;
  currentUser: OperatorUser;
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  currentUser,
  onOpenAdminModal
}) => {
  const navItems = [
    { id: 'tools', label: 'Survival Kits & Tools' },
    { id: 'techtree', label: 'Tech Tree' },
    { id: 'flora', label: 'Flora & Medicine' },
    { id: 'chat', label: 'AI Brain (Voice)' },
    { id: 'pricing', label: 'Field Licenses ($19-$99)' },
    { id: 'library', label: 'Knowledge Base' },
    { id: 'maps', label: 'Offline Nav' },
    { id: 'vault', label: 'Vault' },
    { id: 'blueprint', label: 'Blueprint & Risk' }
  ];

  const cycleTheme = () => {
    if (theme === 'standard') setTheme('amber');
    else if (theme === 'amber') setTheme('red');
    else setTheme('standard');
  };

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element Brand wordmark */}
      <button
        onClick={() => setActiveTab('tools')}
        className="text-base font-bold tracking-tight text-zinc-100 font-mono whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors flex items-center gap-2"
      >
        <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm inline-block" />
        <span>ZAKHAR // FIELD OS</span>
      </button>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="flex items-center gap-3 lg:gap-5 text-xs font-mono font-medium text-zinc-400 overflow-x-auto py-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === item.id
                ? 'text-amber-400 font-bold border-b border-amber-400'
                : 'hover:text-zinc-100 hover:underline underline-offset-4'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: Quick Voice Conversation Mode + Admin Operator Badge + Theme Mode */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Quick Launch Conversation Mode */}
        <button
          onClick={() => setActiveTab('chat')}
          title="Direct Hands-Free Voice Conversation Mode"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-sm'
              : 'bg-zinc-900 border-zinc-800 text-amber-300 hover:border-amber-600 hover:bg-zinc-850'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Conversation Mode</span>
        </button>

        {/* Operator / Admin Authentication Badge */}
        <button
          onClick={onOpenAdminModal}
          title="Operator Profile & Security Clearance (Click to Manage)"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all whitespace-nowrap ${
            currentUser.isAuthenticated && currentUser.role === 'admin'
              ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300 hover:bg-emerald-900/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate max-w-[140px]">
            {currentUser.role === 'admin' ? 'ADMIN // DAMONE (313)' : 'OPERATOR LOGIN'}
          </span>
        </button>

        {/* Tactical Theme Toggle */}
        <button
          onClick={cycleTheme}
          title="Cycle Display Theme: Standard Dark -> Amber Low-Light -> Red Night-Vision"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              theme === 'standard' ? 'bg-cyan-400' : theme === 'amber' ? 'bg-amber-400' : 'bg-rose-500'
            }`}
          />
          <span className="capitalize">{theme}</span>
        </button>
      </div>
    </header>
  );
};
