import React, { useState, useMemo } from 'react';
import { KNOWLEDGE_ARTICLES } from '../../data/knowledgeArticles';
import { KnowledgeArticle, TechCategory } from '../../types';
import { BookOpen, Search, Bookmark, BookmarkCheck, Printer, CheckCircle2, AlertTriangle, ShieldCheck, Copy, Check } from 'lucide-react';

export const KnowledgeLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticleId, setSelectedArticleId] = useState<string>(KNOWLEDGE_ARTICLES[0].id);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zakhar_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [copiedProtocol, setCopiedProtocol] = useState<boolean>(false);

  const categories = ['All', 'Water & Sanitation', 'Medical & Health', 'Communications & Signals', 'Food & Preservation'];

  const toggleBookmark = (id: string) => {
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter(b => b !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('zakhar_bookmarks', JSON.stringify(updated));
    } catch (e) {}
  };

  const filteredArticles = useMemo(() => {
    return KNOWLEDGE_ARTICLES.filter(art => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.keyPrinciples.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const activeArticle = useMemo(() => {
    return KNOWLEDGE_ARTICLES.find(a => a.id === selectedArticleId) || KNOWLEDGE_ARTICLES[0];
  }, [selectedArticleId]);

  const copyArticleText = () => {
    if (!activeArticle) return;
    const text = `# ${activeArticle.title}\nCategory: ${activeArticle.category}\nSource: ${activeArticle.authoritativeSource}\n\n## SUMMARY\n${activeArticle.summary}\n\n## KEY PRINCIPLES\n${activeArticle.keyPrinciples.join('\n- ')}\n\n## PROTOCOL\n${activeArticle.stepByStepProtocol.map(s => `${s.step}. ${s.title}: ${s.action}`).join('\n\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedProtocol(true);
    setTimeout(() => setCopiedProtocol(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar List */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-sm text-zinc-100">Searchable Knowledge Library</h3>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search field manuals & protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] px-2.5 py-1 rounded font-mono transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Cards */}
        <div className="space-y-2">
          {filteredArticles.map(art => {
            const isSelected = art.id === activeArticle.id;
            const isBookmarked = bookmarkedIds.includes(art.id);

            return (
              <div
                key={art.id}
                onClick={() => setSelectedArticleId(art.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-cyan-400">{art.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-500">{art.readTimeMin}m read</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(art.id); }}
                      className="text-zinc-500 hover:text-amber-400"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-zinc-100 mb-1 leading-snug">
                  {art.title}
                </h4>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Article Reader Stage */}
      <div className="lg:col-span-8">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-6 lg:p-8 space-y-6">
          {/* Article Header */}
          <div className="border-b border-zinc-800 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span>{activeArticle.category}</span>
                <span className="text-zinc-600">·</span>
                <span>Verified: {activeArticle.offlineVerifiedDate}</span>
                <span className="text-zinc-600">·</span>
                <span>{activeArticle.readTimeMin} Min Read</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyArticleText}
                  className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-100 bg-zinc-800 px-3 py-1.5 rounded transition-colors"
                >
                  {copiedProtocol ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedProtocol ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => toggleBookmark(activeArticle.id)}
                  className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400 bg-zinc-800 px-3 py-1.5 rounded transition-colors"
                >
                  {bookmarkedIds.includes(activeArticle.id) ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                  <span>{bookmarkedIds.includes(activeArticle.id) ? 'Saved' : 'Bookmark'}</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-2">
              {activeArticle.title}
            </h1>

            <p className="text-xs font-mono text-zinc-500">
              Authority Source: {activeArticle.authoritativeSource}
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">Executive Summary</span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {activeArticle.summary}
            </p>
          </div>

          {/* Key Principles */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">Core Operational Principles</h3>
            <ul className="space-y-2 text-xs text-zinc-300">
              {activeArticle.keyPrinciples.map((principle, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/80">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{principle}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step-by-Step Protocol */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">Step-by-Step Protocol</h3>
            <div className="space-y-3">
              {activeArticle.stepByStepProtocol.map(step => (
                <div key={step.step} className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold text-xs">STEP {step.step}:</span>
                    <h4 className="text-sm font-semibold text-zinc-100">{step.title}</h4>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed pl-6">
                    {step.action}
                  </p>
                  {step.hazards && (
                    <div className="pl-6 pt-1 text-xs text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{step.hazards}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reference Table */}
          {activeArticle.quickReferenceTable && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">Quick Reference Lookup Table</h3>
              <div className="overflow-x-auto border border-zinc-800 rounded-lg">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                      {activeArticle.quickReferenceTable.headers.map((h, i) => (
                        <th key={i} className="py-2.5 px-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {activeArticle.quickReferenceTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-zinc-800/30">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-3">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Field Troubleshooting */}
          {activeArticle.fieldTroubleshooting.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Field Troubleshooting & Failure Modes
              </h3>
              <div className="space-y-2.5">
                {activeArticle.fieldTroubleshooting.map((t, idx) => (
                  <div key={idx} className="bg-zinc-950/40 border border-zinc-800/80 p-3.5 rounded-lg text-xs space-y-1">
                    <div className="font-semibold text-rose-300">Symptom: {t.symptom}</div>
                    <div className="text-zinc-400">Root Cause: {t.rootCause}</div>
                    <div className="text-emerald-300 font-mono">Corrective Action: {t.correctiveAction}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
