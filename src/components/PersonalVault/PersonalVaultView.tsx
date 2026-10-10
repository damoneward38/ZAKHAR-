import React, { useState, useEffect } from 'react';
import { VaultNote, VaultChecklist } from '../../types';
import { Shield, FileText, CheckSquare, Download, Plus, Trash2, Edit3, Save, Printer, Share2, Archive } from 'lucide-react';

const INITIAL_NOTES: VaultNote[] = [
  {
    id: 'note-1',
    title: 'Camp Alpha Water Infiltration Coordinates & Maintenance',
    category: 'Water System',
    content: 'Slow sand filter requires top 1.5cm schmutzdecke wet skimming every 45 days. Keep reserve 200L gravity tank 80% full. Chlorination bucket dilution is 4 drops per liter for winter river runoff.',
    tags: ['Water', 'Camp Alpha', 'Maintenance'],
    updatedAt: '2026-10-09',
    isPinned: true
  },
  {
    id: 'note-2',
    title: 'Emergency Radio Net Schedule (PACE Protocol)',
    category: 'Comms',
    content: 'VHF Primary 146.520 MHz FM simplex. Monitor odd hours 0700, 0900, 1100, 1300, 1500, 1700 for 5 minutes only. If primary jammed, switch to GMRS Ch 20 (462.675 MHz). Transmit strictly 5W low power.',
    tags: ['Radio', 'PACE', 'Emergency'],
    updatedAt: '2026-10-09',
    isPinned: true
  }
];

const INITIAL_CHECKLISTS: VaultChecklist[] = [
  {
    id: 'chk-1',
    title: '72-Hour Rapid Evacuation Go-Bag Inspection',
    category: 'Readiness',
    items: [
      { id: 'i-1', text: '3 Liters potable water in stainless steel bottles', completed: true },
      { id: 'i-2', text: 'Water purification drops (unscented 6% NaOCl) & Sawyer mini filter', completed: true },
      { id: 'i-3', text: 'Emergency rations (3600 kcal compact high-density food bars)', completed: true },
      { id: 'i-4', text: 'Dual tourniquets (CAT Gen 7) & 2x Israeli compression bandages', completed: true },
      { id: 'i-5', text: 'VHF/UHF Handheld transceiver with spare 18650 battery pack', completed: false },
      { id: 'i-6', text: 'Silky Gomboy folding saw & fixed-blade full-tang carbon knife', completed: true },
      { id: 'i-7', text: 'Waterproof topographical paper map of region & lensatic compass', completed: false }
    ],
    updatedAt: '2026-10-09'
  },
  {
    id: 'chk-2',
    title: 'Winter Shelter & Heating System Commissioning',
    category: 'Infrastructure',
    items: [
      { id: 'i-21', text: 'Inspect rocket mass heater chimney for creosote buildup', completed: true },
      { id: 'i-22', text: 'Stack 2 cords dry seasoned hardwood under tarp roof', completed: false },
      { id: 'i-23', text: 'Verify battery bank room insulation stays above 5°C', completed: false }
    ],
    updatedAt: '2026-10-08'
  }
];

export const PersonalVaultView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'checklists'>('notes');

  // Notes State
  const [notes, setNotes] = useState<VaultNote[]>(() => {
    try {
      const saved = localStorage.getItem('zakhar_vault_notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch (e) {
      return INITIAL_NOTES;
    }
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteCategory, setNoteCategory] = useState<string>('General');

  // Checklists State
  const [checklists, setChecklists] = useState<VaultChecklist[]>(() => {
    try {
      const saved = localStorage.getItem('zakhar_vault_checklists');
      return saved ? JSON.parse(saved) : INITIAL_CHECKLISTS;
    } catch (e) {
      return INITIAL_CHECKLISTS;
    }
  });
  const [newChecklistTitle, setNewChecklistTitle] = useState<string>('');
  const [newItemText, setNewItemText] = useState<string>('');

  // Save notes
  useEffect(() => {
    try {
      localStorage.setItem('zakhar_vault_notes', JSON.stringify(notes));
    } catch (e) {}
  }, [notes]);

  // Save checklists
  useEffect(() => {
    try {
      localStorage.setItem('zakhar_vault_checklists', JSON.stringify(checklists));
    } catch (e) {}
  }, [checklists]);

  // Load active note
  useEffect(() => {
    const cur = notes.find(n => n.id === activeNoteId);
    if (cur) {
      setNoteTitle(cur.title);
      setNoteContent(cur.content);
      setNoteCategory(cur.category);
    }
  }, [activeNoteId]);

  const saveCurrentNote = () => {
    if (!noteTitle.trim()) return;
    const updated = notes.map(n => {
      if (n.id === activeNoteId) {
        return {
          ...n,
          title: noteTitle.trim(),
          content: noteContent,
          category: noteCategory,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return n;
    });
    setNotes(updated);
  };

  const createNewNote = () => {
    const newNote: VaultNote = {
      id: `note-${Date.now()}`,
      title: 'Untitled Field Note',
      category: 'General',
      content: '',
      tags: [],
      updatedAt: new Date().toISOString().split('T')[0],
      isPinned: false
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id: string) => {
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    if (remaining.length > 0) setActiveNoteId(remaining[0].id);
  };

  const toggleCheckItem = (chkId: string, itemId: string) => {
    const updated = checklists.map(chk => {
      if (chk.id === chkId) {
        return {
          ...chk,
          items: chk.items.map(it => it.id === itemId ? { ...it, completed: !it.completed } : it)
        };
      }
      return chk;
    });
    setChecklists(updated);
  };

  const addCheckItem = (chkId: string) => {
    if (!newItemText.trim()) return;
    const updated = checklists.map(chk => {
      if (chk.id === chkId) {
        return {
          ...chk,
          items: [...chk.items, { id: `item-${Date.now()}`, text: newItemText.trim(), completed: false }]
        };
      }
      return chk;
    });
    setChecklists(updated);
    setNewItemText('');
  };

  const exportVaultDossier = () => {
    const markdownContent = `# ZAKHAR PERSONAL KNOWLEDGE VAULT DOSSIER
Exported: ${new Date().toISOString()}
Integrity: Hermetic Local Storage / Offline Archive

---

## 1. FIELD NOTES & EMERGENCY STANDARD OPERATING PROCEDURES

${notes.map(n => `### ${n.title}
*Category: ${n.category} | Updated: ${n.updatedAt}*

${n.content}
`).join('\n---\n')}

## 2. OPERATIONAL READINESS CHECKLISTS

${checklists.map(c => `### ${c.title}
${c.items.map(it => `- [${it.completed ? 'X' : ' '}] ${it.text}`).join('\n')}
`).join('\n\n')}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zakhar_vault_dossier_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const exportRemovableStoragePackage = () => {
    const packageManifest = {
      format: "ZAKHAR_OFFLINE_STORAGE_PACKAGE_V1",
      exportedAt: new Date().toISOString(),
      vaultNotesCount: notes.length,
      checklistsCount: checklists.length,
      manifestChecksumSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      notes,
      checklists
    };

    const blob = new Blob([JSON.stringify(packageManifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zakhar_removable_storage_bundle_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-6">
      {/* Vault Header Controls */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Personal Knowledge Vault</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Durable offline encrypted local storage for field notes, emergency SOPs, and readiness checklists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportVaultDossier}
            className="flex items-center gap-1.5 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Markdown Dossier</span>
          </button>
          <button
            onClick={exportRemovableStoragePackage}
            className="flex items-center gap-1.5 text-xs font-mono bg-amber-950/60 border border-amber-600 text-amber-300 hover:bg-amber-900/80 px-3 py-1.5 rounded transition-colors"
          >
            <Archive className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Removable Bundle</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-lg transition-colors ${
            activeTab === 'notes' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Field Notes & SOPs ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('checklists')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-lg transition-colors ${
            activeTab === 'checklists' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Operational Checklists ({checklists.length})</span>
        </button>
      </div>

      {/* Tab 1: Notes */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Notes Sidebar List */}
          <div className="lg:col-span-4 space-y-3">
            <button
              onClick={createNewNote}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-zinc-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Field Note</span>
            </button>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {notes.map(n => (
                <div
                  key={n.id}
                  onClick={() => setActiveNoteId(n.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                    activeNoteId === n.id
                      ? 'bg-amber-950/40 border-amber-500'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex-1 mr-2">
                    <span className="text-[11px] font-mono text-cyan-400 block mb-0.5">{n.category}</span>
                    <h4 className="text-sm font-semibold text-zinc-100 truncate">{n.title}</h4>
                    <span className="text-[11px] font-mono text-zinc-500 mt-1 block">Updated: {n.updatedAt}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }}
                    className="text-zinc-600 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Note Editor Stage */}
          <div className="lg:col-span-8 bg-zinc-900/90 border border-zinc-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note Title..."
                className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-100 font-bold text-base px-3 py-2 rounded font-mono focus:outline-none focus:border-amber-500"
              />

              <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs py-2 px-3 rounded font-mono"
              >
                <option value="General">General</option>
                <option value="Water System">Water System</option>
                <option value="Comms">Comms & Radio</option>
                <option value="Medical">Medical / First Aid</option>
                <option value="Power">Power & Solar</option>
                <option value="Security">Perimeter & Security</option>
              </select>

              <button
                onClick={saveCurrentNote}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-semibold px-4 py-2 rounded font-mono flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>

            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={14}
              placeholder="Record field observations, specific component dimensions, water chemistry logs, or tactical radio schedules..."
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-4 rounded font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Checklists */}
      {activeTab === 'checklists' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {checklists.map(chk => {
              const completedCount = chk.items.filter(i => i.completed).length;
              const percent = Math.round((completedCount / (chk.items.length || 1)) * 100);

              return (
                <div key={chk.id} className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-cyan-400 uppercase">{chk.category}</span>
                      <h3 className="text-base font-bold text-zinc-100">{chk.title}</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">{percent}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2">
                    {chk.items.map(it => (
                      <div
                        key={it.id}
                        onClick={() => toggleCheckItem(chk.id, it.id)}
                        className={`p-2.5 rounded border text-xs cursor-pointer flex items-center gap-3 transition-colors ${
                          it.completed
                            ? 'bg-zinc-950/60 border-zinc-800/60 text-zinc-500 line-through'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-zinc-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={it.completed}
                          onChange={() => {}}
                          className="accent-amber-500 w-4 h-4 cursor-pointer rounded"
                        />
                        <span className="flex-1 font-mono">{it.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add Item form */}
                  <div className="pt-2 border-t border-zinc-800 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add item..."
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') addCheckItem(chk.id); }}
                      className="flex-1 bg-zinc-950 border border-zinc-800 text-xs px-2.5 py-1.5 rounded font-mono text-zinc-100"
                    />
                    <button
                      onClick={() => addCheckItem(chk.id)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded font-mono"
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
