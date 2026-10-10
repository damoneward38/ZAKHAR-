import React from 'react';
import { TechNode } from '../../types';
import { X, AlertTriangle, CheckCircle2, ShieldCheck, Clock, BookOpen, Layers, ArrowRight } from 'lucide-react';

interface TechDetailModalProps {
  node: TechNode;
  allNodes: TechNode[];
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
}

export const TechDetailModal: React.FC<TechDetailModalProps> = ({
  node,
  allNodes,
  onClose,
  onSelectNode
}) => {
  const prereqNodes = allNodes.filter(n => node.prerequisites.includes(n.id));
  const unlockNodes = allNodes.filter(n => node.unlocks.includes(n.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-start justify-between bg-zinc-950/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono mb-1.5">
              <span className="text-amber-400 font-semibold">{node.tier}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-cyan-400">{node.category}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">{node.criticality}</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">{node.name}</h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">{node.summary}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-300">
          {/* Engineering Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Scientific & Engineering Foundation</h4>
            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/80">
              {node.description}
            </p>
          </div>

          {/* Prerequisite and Unlock Lineage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-950/40 p-4 rounded-lg border border-zinc-800">
              <span className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Prerequisites Required ({prereqNodes.length})
              </span>
              {prereqNodes.length === 0 ? (
                <span className="text-xs text-emerald-400 font-mono">Foundational (Root Node - No Prerequisites)</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {prereqNodes.map(pr => (
                    <button
                      key={pr.id}
                      onClick={() => onSelectNode(pr.id)}
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>{pr.name}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-zinc-950/40 p-4 rounded-lg border border-zinc-800">
              <span className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Technologies Unlocked Downstream ({unlockNodes.length})
              </span>
              {unlockNodes.length === 0 ? (
                <span className="text-xs text-zinc-500 font-mono">Terminal capability leaf</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {unlockNodes.map(un => (
                    <button
                      key={un.id}
                      onClick={() => onSelectNode(un.id)}
                      className="text-xs bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-800/80 px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>{un.name}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bill of Materials (BOM) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Bill of Materials & Salvage Alternatives</h4>
              <span className="text-xs font-mono text-zinc-500">Est. Build: ~{node.estimatedBuildHours} Hours</span>
            </div>
            <div className="overflow-x-auto border border-zinc-800 rounded-lg">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Functional Purpose</th>
                    <th className="py-2.5 px-3">Scrap / Salvage Alternative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {node.billOfMaterials.map((bom, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30">
                      <td className="py-2.5 px-3 font-semibold text-zinc-100">{bom.name}</td>
                      <td className="py-2.5 px-3 text-amber-400">{bom.quantity}</td>
                      <td className="py-2.5 px-3 text-zinc-400">{bom.purpose}</td>
                      <td className="py-2.5 px-3 text-cyan-300">{bom.salvagedAlternative || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step-by-Step Construction Steps */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">Construction & Deployment Steps</h4>
            <ol className="space-y-2.5 text-xs text-zinc-300">
              {node.buildSteps.map((step, idx) => (
                <li key={idx} className="flex gap-3 bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/80">
                  <span className="font-mono text-amber-500 font-bold shrink-0 text-sm">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Safety Warnings & Hazards */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Critical Safety Conditions & Hazards
            </h4>
            <div className="bg-rose-950/30 border border-rose-900/60 p-4 rounded-lg space-y-2 text-xs text-rose-200">
              {node.safetyWarnings.map((warn, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 shrink-0">•</span>
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acceptance Tests & Failure Modes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-950/40 p-4 rounded-lg border border-zinc-800">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Acceptance Test Criteria
              </span>
              <ul className="space-y-2 text-xs text-zinc-300">
                {node.acceptanceTests.map((test, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 shrink-0">✓</span>
                    <span>{test}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-950/40 p-4 rounded-lg border border-zinc-800">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 block mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Failure Modes & Recovery
              </span>
              <ul className="space-y-2 text-xs text-zinc-300">
                {node.failureModesAndRecovery.map((fail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 shrink-0">!</span>
                    <span>{fail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Historical & Authoritative Citations */}
          <div className="border-t border-zinc-800 pt-4 text-xs font-mono text-zinc-500 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>Citations: {node.citations.join(' · ')}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
