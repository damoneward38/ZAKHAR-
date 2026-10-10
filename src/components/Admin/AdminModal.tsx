import React, { useState } from 'react';
import { OperatorUser } from '../../types';
import { Shield, ShieldCheck, ShieldAlert, Key, User, Check, LogOut, Terminal, Lock, Cpu, Database, Sparkles } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: OperatorUser;
  onUpdateUser: (user: OperatorUser) => void;
  onNavigateTab: (tab: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onNavigateTab
}) => {
  const [emailInput, setEmailInput] = useState<string>('damoneward38@gmail.com');
  const [passcodeInput, setPasscodeInput] = useState<string>('313Damone');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successActionMsg, setSuccessActionMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Verify authorized administrator credentials
    if (
      (emailInput.trim().toLowerCase() === 'damoneward38@gmail.com' && passcodeInput.trim() === '313Damone') ||
      (passcodeInput.trim() === '313Damone')
    ) {
      const adminUser: OperatorUser = {
        email: emailInput.trim().toLowerCase() || 'damoneward38@gmail.com',
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
          'MGRS_TACTICAL_ENCRYPTION'
        ]
      };
      onUpdateUser(adminUser);
      setSuccessActionMsg('Administrator clearance verified. Welcome Commander Damone.');
      setTimeout(() => setSuccessActionMsg(null), 3500);
    } else {
      setErrorMessage('Invalid authentication credentials. Required: damoneward38@gmail.com with passcode 313Damone.');
    }
  };

  const handleLogout = () => {
    const guestUser: OperatorUser = {
      email: 'guest@field.local',
      role: 'guest',
      callsign: 'FIELD OPERATOR (GUEST)',
      isAuthenticated: false,
      loginTimestamp: new Date().toISOString(),
      permissions: ['FIELD_TOOLS_READ', 'TECH_TREE_READ', 'FLORA_READ']
    };
    onUpdateUser(guestUser);
    setSuccessActionMsg('Logged out. Session reverted to Field Guest mode.');
    setTimeout(() => setSuccessActionMsg(null), 3000);
  };

  const handleBypassRolloutGates = () => {
    try {
      localStorage.setItem('zakhar_audit_override', 'true');
      setSuccessActionMsg('All 6 NeuralCore Rollout Gates overridden with Admin signature.');
      setTimeout(() => setSuccessActionMsg(null), 3500);
    } catch (e) {}
  };

  const handlePurgeAndOptimize = () => {
    try {
      localStorage.removeItem('zakhar_ai_sessions');
      setSuccessActionMsg('AI Brain session state purged & recalibrated.');
      setTimeout(() => setSuccessActionMsg(null), 3000);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded border ${
              currentUser.isAuthenticated && currentUser.role === 'admin'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-tight">
                ZAKHAR Security & Operator Administration
              </h3>
              <span className="text-[11px] text-zinc-500">
                Level 5 Air-Gapped Command Authority
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {currentUser.isAuthenticated && currentUser.role === 'admin' ? (
            /* Logged in Admin View */
            <div className="space-y-5">
              {/* Status Card */}
              <div className="bg-emerald-950/30 border border-emerald-700/80 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ADMINISTRATOR VERIFIED // ACTIVE SESSION
                  </span>
                  <span className="text-[10px] text-emerald-300/80 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-600">
                    CLEARANCE: LEVEL 5
                  </span>
                </div>

                <div className="space-y-1 text-zinc-300 pt-1 border-t border-emerald-900/60">
                  <div><strong>Operator Email:</strong> <span className="text-zinc-100">{currentUser.email}</span></div>
                  <div><strong>Callsign:</strong> <span className="text-amber-400">{currentUser.callsign}</span></div>
                  <div><strong>Authorized Passcode:</strong> <span className="text-zinc-400">•••••••••• (313Damone)</span></div>
                  <div><strong>Session Initialized:</strong> <span className="text-zinc-400">{new Date(currentUser.loginTimestamp).toLocaleString()}</span></div>
                </div>
              </div>

              {/* Granted Privileges */}
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-2 font-semibold">
                  Granted Root Security Permissions:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {currentUser.permissions.map((perm, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-800 p-2 rounded text-[11px] text-zinc-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Admin Actions */}
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-2 font-semibold">
                  Administrative Field Commands:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => { onClose(); onNavigateTab('chat'); }}
                    className="p-2.5 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600 text-amber-300 rounded font-semibold text-left flex items-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Launch AI Brain Voice Chat</span>
                  </button>

                  <button
                    onClick={handleBypassRolloutGates}
                    className="p-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 rounded text-left flex items-center gap-2 transition-colors"
                  >
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Sign Off All Rollout Gates</span>
                  </button>

                  <button
                    onClick={() => { onClose(); onNavigateTab('blueprint'); }}
                    className="p-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 rounded text-left flex items-center gap-2 transition-colors"
                  >
                    <Cpu className="w-4 h-4 text-rose-400" />
                    <span>View Engineering Plane</span>
                  </button>

                  <button
                    onClick={() => { onClose(); onNavigateTab('pricing'); }}
                    className="p-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-600 text-amber-300 rounded font-semibold text-left flex items-center gap-2 transition-colors"
                  >
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>Field Licenses & Sandbox Checkout</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="p-2.5 bg-zinc-950 hover:bg-rose-950/60 border border-zinc-800 hover:border-rose-800 text-rose-300 rounded text-left flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>End Admin Session</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg space-y-1">
                <span className="text-amber-400 font-bold block uppercase">
                  Administrator Credentials Required
                </span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Enter authorized administrator email (damoneward38@gmail.com) and security passcode (313Damone) to unlock Level 5 system command privileges.
                </p>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 text-[11px] uppercase">
                  Administrator Email:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="damoneward38@gmail.com"
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 text-[11px] uppercase">
                  Security Passcode:
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Enter passcode (e.g. 313Damone)"
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-950/60 border border-rose-800 text-rose-300 rounded text-[11px] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Lock className="w-4 h-4" />
                <span>Verify & Log In as Admin</span>
              </button>
            </form>
          )}

          {successActionMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-300 rounded flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successActionMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between text-[11px] text-zinc-500">
          <span>HOST: 0.0.0.0:3000 · AIR-GAPPED</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
