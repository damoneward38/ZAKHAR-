import React, { useState, useMemo } from 'react';
import { TECH_TREE_NODES } from '../../data/techTreeData';
import { TechNode, TechTier, TechCategory } from '../../types';
import { TechDetailModal } from './TechDetailModal';
import { GitBranch, Search, Filter, ShieldCheck, ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';

export const TechTreeGraph: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeNodeModal, setActiveNodeModal] = useState<TechNode | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [pathTargetNode, setPathTargetNode] = useState<TechNode | null>(null);

  const tiers: TechTier[] = [
    'Primitive / Stone Age',
    'Agrarian & Forging',
    'Early Industrial',
    'Electromechanical',
    'Modern Resilience'
  ];

  const categories: TechCategory[] = [
    'Water & Sanitation',
    'Energy & Power',
    'Metallurgy & Materials',
    'Food & Preservation',
    'Medical & Health',
    'Mechanics & Tools',
    'Communications & Signals',
    'Chemistry & Reagents'
  ];

  // Recursively calculate all ancestor prerequisites for a node
  const getAncestors = (nodeId: string, visited = new Set<string>()): string[] => {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);
    const node = TECH_TREE_NODES.find(n => n.id === nodeId);
    if (!node) return [];

    let ancestors: string[] = [nodeId];
    for (const prereqId of node.prerequisites) {
      ancestors = ancestors.concat(getAncestors(prereqId, visited));
    }
    return ancestors;
  };

  // Trace prerequisite path
  const tracePathTo = (node: TechNode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pathTargetNode?.id === node.id) {
      setHighlightedPath([]);
      setPathTargetNode(null);
    } else {
      const path = getAncestors(node.id);
      setHighlightedPath(path);
      setPathTargetNode(node);
    }
  };

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return TECH_TREE_NODES.filter(node => {
      const matchesSearch =
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.billOfMaterials.some(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTier = selectedTier === 'All' || node.tier === selectedTier;
      const matchesCategory = selectedCategory === 'All' || node.category === selectedCategory;

      return matchesSearch && matchesTier && matchesCategory;
    });
  }, [searchQuery, selectedTier, selectedCategory]);

  // Group nodes by tier for structured tree view
  const nodesByTier = useMemo(() => {
    const map: Record<string, TechNode[]> = {};
    tiers.forEach(t => { map[t] = []; });
    filteredNodes.forEach(node => {
      if (map[node.tier]) {
        map[node.tier].push(node);
      }
    });
    return map;
  }, [filteredNodes]);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                250 Fundamentals → 500 Extensions Dependency Graph
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Interactive civilizational reconstruction tree. Trace prerequisite dependencies, bills of materials, and downstream unlocks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search technologies or materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {pathTargetNode && (
              <button
                onClick={() => { setHighlightedPath([]); setPathTargetNode(null); }}
                className="text-xs bg-amber-950/70 border border-amber-600 text-amber-300 px-3 py-1.5 rounded-lg font-mono flex items-center gap-1.5 hover:bg-amber-900/80 transition-colors"
              >
                <span>Clear Path ({highlightedPath.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800">
          <span className="text-xs font-mono text-zinc-500 mr-1">Tiers:</span>
          <button
            onClick={() => setSelectedTier('All')}
            className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${
              selectedTier === 'All' ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Tiers
          </button>
          {tiers.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${
                selectedTier === t ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-mono text-zinc-500 mr-1">Domain:</span>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-2 py-0.5 text-xs rounded font-mono transition-colors ${
              selectedCategory === 'All' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Domains
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-2 py-0.5 text-xs rounded font-mono transition-colors ${
                selectedCategory === c ? 'bg-cyan-500 text-zinc-950 font-bold' : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Path Target Active Status Banner */}
      {pathTargetNode && (
        <div className="bg-amber-950/40 border border-amber-600/80 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CornerDownRight className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs font-mono uppercase text-amber-400 block">Pathfinder Active: Prerequisite Tree Traced</span>
              <span className="text-sm font-bold text-zinc-100">
                Target: {pathTargetNode.name} ({highlightedPath.length} nodes in prerequisite chain)
              </span>
            </div>
          </div>
          <span className="text-xs text-zinc-400 font-mono hidden md:block">
            Highlighted in gold below. Build foundations first before progressing.
          </span>
        </div>
      )}

      {/* Hierarchical Tier Columns */}
      <div className="space-y-8">
        {tiers.map(tier => {
          const tierNodes = nodesByTier[tier] || [];
          if (tierNodes.length === 0 && selectedTier !== 'All') return null;

          return (
            <div key={tier} className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="text-sm font-mono font-bold text-zinc-200 uppercase tracking-wider">{tier}</h3>
                </div>
                <span className="text-xs font-mono text-zinc-500">{tierNodes.length} technologies</span>
              </div>

              {tierNodes.length === 0 ? (
                <div className="p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-lg text-xs text-zinc-500 font-mono">
                  No technologies match active search criteria in this tier.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tierNodes.map(node => {
                    const isPathHighlighted = highlightedPath.includes(node.id);
                    const isTarget = pathTargetNode?.id === node.id;

                    return (
                      <div
                        key={node.id}
                        onClick={() => setActiveNodeModal(node)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between group ${
                          isTarget
                            ? 'bg-amber-950/70 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                            : isPathHighlighted
                            ? 'bg-amber-950/40 border-amber-500'
                            : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-cyan-400 font-medium">
                              {node.category}
                            </span>
                            <span className="text-[11px] font-mono text-zinc-500">
                              ~{node.estimatedBuildHours}h build
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-zinc-100 group-hover:text-amber-400 transition-colors mb-1.5">
                            {node.name}
                          </h4>

                          <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                            {node.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                          <div className="text-zinc-500 flex items-center gap-2">
                            <span>Prereqs: {node.prerequisites.length}</span>
                            <span>·</span>
                            <span>Unlocks: {node.unlocks.length}</span>
                          </div>

                          <button
                            onClick={(e) => tracePathTo(node, e)}
                            title="Trace Prerequisite Chain"
                            className={`p-1 rounded transition-colors text-[11px] flex items-center gap-1 ${
                              isTarget
                                ? 'bg-amber-400 text-zinc-950 font-bold'
                                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700'
                            }`}
                          >
                            <GitBranch className="w-3 h-3" />
                            <span>Path</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tech Detail Modal */}
      {activeNodeModal && (
        <TechDetailModal
          node={activeNodeModal}
          allNodes={TECH_TREE_NODES}
          onClose={() => setActiveNodeModal(null)}
          onSelectNode={(nodeId) => {
            const found = TECH_TREE_NODES.find(n => n.id === nodeId);
            if (found) setActiveNodeModal(found);
          }}
        />
      )}
    </div>
  );
};
