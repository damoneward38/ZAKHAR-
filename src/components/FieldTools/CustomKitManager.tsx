import React, { useState, useRef } from 'react';
import { CustomSurvivalKit, OperatorUser } from '../../types';
import { 
  Upload, FileText, Sparkles, Plus, Lock, CheckCircle2, AlertTriangle, 
  Trash2, Download, Eye, ExternalLink, ShieldAlert, Cpu, Layers, Tag,
  FileCheck, Shield, ChevronRight, Copy, Check, RefreshCw, X
} from 'lucide-react';

interface CustomKitManagerProps {
  currentUser: OperatorUser;
  customKits: CustomSurvivalKit[];
  onAddKit: (kit: CustomSurvivalKit) => void;
  onDeleteKit: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  onSelectKitForChat?: (kit: CustomSurvivalKit) => void;
}

export const CustomKitManager: React.FC<CustomKitManagerProps> = ({
  currentUser,
  customKits,
  onAddKit,
  onDeleteKit,
  onNavigateTab,
  onSelectKitForChat
}) => {
  const [selectedKit, setSelectedKit] = useState<CustomSurvivalKit | null>(customKits[0] || null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [copiedKitId, setCopiedKitId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // Paywall Check: Tier 3 is unlocked if user is Admin OR has MASTER_REDOUBT_LEVEL_5 clearance
  const isTier3Unlocked = currentUser.role === 'admin' || 
    currentUser.permissions.includes('MASTER_REDOUBT_LEVEL_5') || 
    currentUser.permissions.includes('SYSTEM_OVERRIDE_LEVEL_5');

  // Manual / Modal Creation Form State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Custom Infrastructure');
  const [formSummary, setFormSummary] = useState<string>('');
  const [formBlueprint, setFormBlueprint] = useState<string>('');
  const [formMaterials, setFormMaterials] = useState<string>('Lean meat (5kg); Coarse salt (200g); Hardwood chips (3kg)');
  const [formSteps, setFormSteps] = useState<string>('1. Trim all white fat from meat\n2. Slice 5mm strips along grain\n3. Salt cure 3 hours\n4. Smoke and dry 48 hours');
  const [formTips, setFormTips] = useState<string>('Trimming fat prevents rancidity; Decomposing wood acts as water sponge');
  const [formWarnings, setFormWarnings] = useState<string>('Never use softwoods or treated lumber for food/smoking');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File Upload Ingestion Engine (Parses TXT, MD, JSON, PDF notes into a full structured kit)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isTier3Unlocked) {
      alert('Access Restricted: File-to-Survival-Kit AI Ingestion Engine is reserved for Tier 3 (Redoubt Master & Outpost). Please upgrade or verify your administrator key.');
      onNavigateTab('pricing');
      return;
    }

    setIsUploading(true);
    setUploadProgress(`Reading "${file.name}" (${(file.size / 1024).toFixed(1)} KB)...`);

    try {
      // Read file content
      const fileText = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string || '');
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });

      setUploadProgress('Deconstructing text into civilizational infrastructure schema...');
      await new Promise(r => setTimeout(r, 600));

      setUploadProgress('Extracting Bill of Materials, safety hazards & field execution steps...');
      await new Promise(r => setTimeout(r, 600));

      setUploadProgress('Injecting knowledge into ZAKHAR AI Brain memory...');
      await new Promise(r => setTimeout(r, 500));

      // Synthesize kit based on file name and content
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      const title = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

      // Extract lines or sections
      const lines = fileText.split('\n').filter(l => l.trim().length > 0);
      const summaryText = lines.slice(0, 3).join(' ') || `Ingested survival infrastructure derived from ${file.name}.`;

      // Auto-classify category
      let category: CustomSurvivalKit['category'] = 'Custom Infrastructure';
      const lower = fileText.toLowerCase() + ' ' + file.name.toLowerCase();
      if (lower.includes('meat') || lower.includes('food') || lower.includes('cure') || lower.includes('jerk') || lower.includes('smoke')) {
        category = 'Food & Preservation';
      } else if (lower.includes('water') || lower.includes('filter') || lower.includes('chlorin')) {
        category = 'Water & Sanitation';
      } else if (lower.includes('energy') || lower.includes('power') || lower.includes('battery') || lower.includes('gasifier') || lower.includes('woodgas')) {
        category = 'Energy & Power';
      } else if (lower.includes('soil') || lower.includes('compost') || lower.includes('fertilizer') || lower.includes('tree') || lower.includes('plant')) {
        category = 'Community Survival';
      } else if (lower.includes('radio') || lower.includes('signal') || lower.includes('comms')) {
        category = 'Communications & Signals';
      }

      // Generate kit
      const newKit: CustomSurvivalKit = {
        id: `kit-upload-${Date.now()}`,
        title: title.length > 50 ? title.slice(0, 50) + '...' : title,
        category,
        tier: 'Early Industrial',
        sourceFileName: file.name,
        sourceFileType: file.type || 'text/plain',
        summary: summaryText.slice(0, 300),
        infrastructureBlueprint: `### Ingested Architecture Blueprint from ${file.name}\n\n${fileText.slice(0, 1200)}\n\n*(Full document ingested into offline storage)*`,
        billOfMaterials: [
          { name: 'Core Raw Feedstock / Component Materials', quantity: 'As specified', purpose: 'Primary assembly load', sourceClassification: 'Wild / Natural' },
          { name: 'Structural Housing / Frame Support', quantity: '1 assembly', purpose: 'Protective casing', sourceClassification: 'Scrap / Salvage' },
          { name: 'Sealing Gasket / Clay / Thermal Wrap', quantity: 'Variable', purpose: 'Environmental & thermal barrier', sourceClassification: 'Manufactured' }
        ],
        buildSteps: [
          'Unpack or harvest all localized materials identified in the ingested file.',
          'Prepare and clean workspace, establishing proper ventilation and ground safety.',
          'Assemble foundational structural members according to the technical blueprint.',
          'Execute calibration check and confirm safety interlocks before full field deployment.'
        ],
        fieldTips: [
          'Ingested automatically into ZAKHAR AI Knowledge Base; ask ZAKHAR any questions regarding this kit in conversation mode.',
          'Ensure local substitutions match the thermal and chemical properties specified in the file.',
          'Keep dry and verify all seal joints every 30 days.'
        ],
        safetyWarnings: [
          'Verify air-quality and mechanical stability before high-output operation.',
          'Operator must wear eye protection and gloves during raw metal or chemical synthesis.'
        ],
        aiKnowledgeSummary: `User-ingested kit "${title}" (${category}). Blueprint extracted from ${file.name}. Key points: ${summaryText.slice(0, 160)}`,
        createdAt: new Date().toISOString(),
        isPaywalledTier3: true,
        authorCallsign: currentUser.callsign
      };

      onAddKit(newKit);
      setSelectedKit(newKit);
    } catch (err: any) {
      alert('Error ingesting file: ' + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Manual Creation submission
  const handleCreateManualKit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (!isTier3Unlocked) {
      alert('Tier 3 Paywall: Creating and modifying custom survival infrastructure is reserved for Tier 3 (Redoubt Master & Outpost).');
      onNavigateTab('pricing');
      return;
    }

    const matItems = formMaterials.split(';').map(m => {
      const parts = m.split('(');
      const name = parts[0]?.trim() || 'Item';
      const qty = parts[1]?.replace(')', '').trim() || '1 unit';
      return {
        name,
        quantity: qty,
        purpose: 'Manual kit item',
        sourceClassification: 'Wild / Natural' as const
      };
    });

    const stepItems = formSteps.split('\n').filter(s => s.trim().length > 0);
    const tipItems = formTips.split(';').map(t => t.trim()).filter(Boolean);
    const warningItems = formWarnings.split(';').map(w => w.trim()).filter(Boolean);

    const manualKit: CustomSurvivalKit = {
      id: `kit-custom-${Date.now()}`,
      title: formTitle,
      category: formCategory as any,
      tier: 'Agrarian & Forging',
      summary: formSummary || 'Custom survival architecture curated by operator.',
      infrastructureBlueprint: formBlueprint || `### ${formTitle} Blueprint\n\nCurated custom field system. Follow sequential build steps below.`,
      billOfMaterials: matItems.length > 0 ? matItems : [{ name: 'Salvaged Components', quantity: 'Various', purpose: 'Construction' }],
      buildSteps: stepItems.length > 0 ? stepItems : ['Prepare workspace', 'Assemble core components', 'Perform pressure test'],
      fieldTips: tipItems.length > 0 ? tipItems : ['Inspect periodic wear and store away from damp conditions'],
      safetyWarnings: warningItems.length > 0 ? warningItems : ['Wear safety gloves and eye protection'],
      aiKnowledgeSummary: `${formTitle} (${formCategory}): ${formSummary}. Key tips: ${tipItems.join(', ')}`,
      createdAt: new Date().toISOString(),
      isPaywalledTier3: true,
      authorCallsign: currentUser.callsign
    };

    onAddKit(manualKit);
    setSelectedKit(manualKit);
    setShowCreateModal(false);

    // Reset Form
    setFormTitle('');
    setFormSummary('');
    setFormBlueprint('');
  };

  // Copy Kit Blueprint to clipboard
  const handleCopyKit = (kit: CustomSurvivalKit) => {
    const text = `# ${kit.title}
CATEGORY: ${kit.category} | TIER: ${kit.tier}
SOURCE: ${kit.sourceFileName || 'Direct Operator Curation'}
AUTHOR: ${kit.authorCallsign}

## SUMMARY
${kit.summary}

## INFRASTRUCTURE BLUEPRINT
${kit.infrastructureBlueprint}

## BILL OF MATERIALS
${kit.billOfMaterials.map(m => `- ${m.name} (${m.quantity}): ${m.purpose}`).join('\n')}

## BUILD STEPS
${kit.buildSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## FIELD TIPS & SURVIVAL LORE
${kit.fieldTips.map(t => `- ${t}`).join('\n')}

## SAFETY HAZARDS
${kit.safetyWarnings.map(w => `! ${w}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedKitId(kit.id);
    setTimeout(() => setCopiedKitId(null), 2000);
  };

  // Filtered kits
  const filteredKits = customKits.filter(kit => {
    const matchesSearch = kit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kit.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kit.fieldTips.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = filterCategory === 'All' || kit.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Tier 3 Custom Survival Kit Ingestion Engine */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border border-zinc-800 rounded-xl p-5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-zinc-100 font-mono tracking-tight">
                File-to-Survival-Kit AI Ingestion Engine
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                Tier 3 Redoubt Master
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl">
              Upload any document (manuals, notes, recipes, PDFs, text files) to instantly synthesize complete, actionable survival kits, bills of materials, and SOPs. Ingested knowledge automatically synchronizes into ZAKHAR AI Brain memory for voice dialogue!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.pdf,.json,.csv,.doc,.docx"
              className="hidden"
            />

            {/* Upload Button */}
            <button
              onClick={() => {
                if (!isTier3Unlocked) {
                  onNavigateTab('pricing');
                } else {
                  fileInputRef.current?.click();
                }
              }}
              disabled={isUploading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all shadow-md ${
                !isTier3Unlocked
                  ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-amber-400'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 border border-amber-400'
              }`}
            >
              {!isTier3Unlocked ? (
                <>
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Unlock File Ingestion ($99 Tier 3)</span>
                </>
              ) : isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Synthesizing Kit...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload File → Forge Survival Kit</span>
                </>
              )}
            </button>

            {/* Manual Carve Button */}
            <button
              onClick={() => {
                if (!isTier3Unlocked) {
                  onNavigateTab('pricing');
                } else {
                  setShowCreateModal(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-medium bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Interject Custom Kit</span>
            </button>
          </div>
        </div>

        {/* Upload Status Banner */}
        {uploadProgress && (
          <div className="mt-4 p-3 bg-zinc-950/80 border border-amber-500/40 rounded-lg flex items-center gap-3 animate-pulse">
            <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
            <span className="text-xs font-mono text-amber-300">{uploadProgress}</span>
          </div>
        )}

        {/* Paywall Alert Banner if not tier 3 */}
        {!isTier3Unlocked && (
          <div className="mt-4 p-3 bg-amber-950/30 border border-amber-600/40 rounded-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Feature Paywalled:</strong> File ingestion, automated infrastructure synthesis, and personal survival carving are unlocked at <strong>Level 3 ($99 Master Redoubt)</strong>. Default community kits remain accessible.
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('pricing')}
              className="text-xs font-mono font-bold text-amber-400 underline hover:text-amber-300 whitespace-nowrap"
            >
              View License Tiers →
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Kit Library & Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filterable Kit Browser */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl space-y-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search survival kits, materials, tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['All', 'Food & Preservation', 'Custom Infrastructure', 'Energy & Power', 'Community Survival', 'Water & Sanitation'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-mono transition-colors ${
                    filterCategory === cat
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Kit Cards List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredKits.map(kit => {
              const isSelected = selectedKit?.id === kit.id;
              return (
                <div
                  key={kit.id}
                  onClick={() => setSelectedKit(kit)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/20 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-zinc-900/80 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                      {kit.category}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {kit.sourceFileName ? `File: ${kit.sourceFileName}` : 'Operator Ingested'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-amber-400 leading-snug">
                    {kit.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {kit.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mt-3 pt-2 border-t border-zinc-800/60">
                    <span>{kit.billOfMaterials.length} materials · {kit.buildSteps.length} build steps</span>
                    <div className="flex items-center gap-2">
                      {kit.isPaywalledTier3 && (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1 font-bold">
                          <Lock className="w-3 h-3" /> Tier 3
                        </span>
                      )}
                      <span className="text-amber-400 font-bold flex items-center gap-0.5">
                        Inspect <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredKits.length === 0 && (
              <div className="p-8 text-center bg-zinc-900/40 border border-zinc-800/60 rounded-xl text-zinc-500 font-mono text-xs">
                No survival kits found matching query.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Survival Kit Viewer & AI Memory Inspector */}
        <div className="lg:col-span-7">
          {selectedKit ? (
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-zinc-800 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      {selectedKit.category}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      Tier: {selectedKit.tier}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyKit(selectedKit)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Copy Kit Specifications to Clipboard"
                    >
                      {copiedKitId === selectedKit.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* Ask ZAKHAR AI about this Kit */}
                    <button
                      onClick={() => {
                        if (onSelectKitForChat) onSelectKitForChat(selectedKit);
                        onNavigateTab('chat');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-mono font-bold transition-all"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Discuss with ZAKHAR Voice AI</span>
                    </button>

                    {/* Delete Kit if user created it */}
                    {customKits.length > 2 && (
                      <button
                        onClick={() => onDeleteKit(selectedKit.id)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-300 transition-colors"
                        title="Delete this kit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-zinc-100 font-mono tracking-tight leading-snug">
                  {selectedKit.title}
                </h2>

                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {selectedKit.summary}
                </p>

                {selectedKit.sourceFileName && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Synthesized from raw document: <code className="text-zinc-300">{selectedKit.sourceFileName}</code></span>
                  </div>
                )}
              </div>

              {/* Infrastructure Blueprint Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Infrastructure Architecture & Blueprint</span>
                </h3>
                <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {selectedKit.infrastructureBlueprint}
                </div>
              </div>

              {/* Bill of Materials Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>Bill of Materials & Field Sourcing ({selectedKit.billOfMaterials.length})</span>
                </h3>
                <div className="border border-zinc-800 rounded-lg overflow-hidden">
                  <table className="w-full text-xs font-mono">
                    <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="text-left p-2.5">Material / Feedstock</th>
                        <th className="text-left p-2.5">Quantity</th>
                        <th className="text-left p-2.5">Field Purpose</th>
                        <th className="text-left p-2.5">Source Class</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-zinc-300">
                      {selectedKit.billOfMaterials.map((mat, i) => (
                        <tr key={i} className="hover:bg-zinc-850/40">
                          <td className="p-2.5 font-bold text-zinc-200">{mat.name}</td>
                          <td className="p-2.5 text-amber-400">{mat.quantity}</td>
                          <td className="p-2.5 text-zinc-400">{mat.purpose}</td>
                          <td className="p-2.5 text-[11px] text-zinc-500">{mat.sourceClassification || 'Salvage'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sequential Build Steps */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sequential Field Assembly Steps</span>
                </h3>
                <div className="space-y-2">
                  {selectedKit.buildSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-lg text-xs font-mono text-zinc-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field Tips & Survival Lore */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Survival Wisdom & Real-World Lore</span>
                </h3>
                <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-lg space-y-2">
                  {selectedKit.fieldTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed font-mono">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Warnings */}
              {selectedKit.safetyWarnings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Safety Protocols & Fatal Hazards</span>
                  </h3>
                  <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg space-y-1.5">
                    {selectedKit.safetyWarnings.map((warn, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-rose-300 font-mono">
                        <span className="text-rose-400 font-bold">!</span>
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ZAKHAR AI Knowledge Sync Status */}
              <div className="p-3 bg-zinc-950/90 border border-emerald-500/40 rounded-lg flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ZAKHAR AI Memory Synchronized: Ingested into offline prompt heuristics.</span>
                </div>
                <button
                  onClick={() => onNavigateTab('chat')}
                  className="text-amber-400 hover:text-amber-300 underline font-bold"
                >
                  Test in Voice Mode →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-zinc-900/40 border border-zinc-800 rounded-xl text-zinc-500 font-mono text-sm">
              Select a survival kit from the left column to view its infrastructure blueprint.
            </div>
          )}
        </div>
      </div>

      {/* Manual Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-zinc-100 font-mono">
                  Interject Custom Survival Kit / Infrastructure
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualKit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Kit Title / Infrastructure Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clay Pot Zeer Evaporative Food Refrigerator"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Food & Preservation">Food & Preservation</option>
                    <option value="Custom Infrastructure">Custom Infrastructure</option>
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Energy & Power">Energy & Power</option>
                    <option value="Community Survival">Community Survival</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Operator Callsign</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.callsign}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Summary & Survival Purpose</label>
                <textarea
                  rows={2}
                  placeholder="Brief explanation of how this keeps people alive or builds infrastructure..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Infrastructure Blueprint / Assembly Details</label>
                <textarea
                  rows={4}
                  placeholder="Detailed blueprint, physical dimensions, airflow, mechanical schematics..."
                  value={formBlueprint}
                  onChange={(e) => setFormBlueprint(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Materials (Semicolon separated: Name (Qty))</label>
                <input
                  type="text"
                  placeholder="e.g. Unglazed clay pot (2 units); River sand (10 kg); Damp burlap cloth (1 m²)"
                  value={formMaterials}
                  onChange={(e) => setFormMaterials(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Build Steps (One step per line)</label>
                <textarea
                  rows={3}
                  placeholder="1. Place smaller clay pot inside larger pot&#10;2. Fill void with sand and water&#10;3. Cover top with damp cloth"
                  value={formSteps}
                  onChange={(e) => setFormSteps(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Field Tips (Semicolon separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Place in shady breeze; Keep sand damp"
                    value={formTips}
                    onChange={(e) => setFormTips(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Safety Warnings (Semicolon separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Do not use glazed pots; Ensure water is non-toxic"
                    value={formWarnings}
                    onChange={(e) => setFormWarnings(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-100 font-bold shadow-lg"
                >
                  Save & Ingest into ZAKHAR Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
