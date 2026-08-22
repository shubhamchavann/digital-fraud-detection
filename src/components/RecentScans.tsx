import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, Search, ShieldAlert, ShieldCheck, AlertTriangle, 
  Trash2, ExternalLink, Globe, Mail, Eye, X, Copy, Check, 
  CornerDownRight, Sparkles, Filter 
} from 'lucide-react';
import { ScanResult } from '../types';

interface RecentScansProps {
  scans: ScanResult[];
  onDeleteScan: (id: string) => void;
  onSelectScanForReview: (scan: ScanResult) => void;
  onRescanTarget: (target: string, type: 'url' | 'email') => void;
}

export const RecentScans: React.FC<RecentScansProps> = ({
  scans,
  onDeleteScan,
  onSelectScanForReview,
  onRescanTarget,
}) => {
  const [filterVerdict, setFilterVerdict] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedScanModal, setSelectedScanModal] = useState<ScanResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredScans = scans.filter((scan) => {
    if (filterVerdict !== 'all' && scan.verdict.toLowerCase() !== filterVerdict.toLowerCase()) {
      return false;
    }
    if (filterType !== 'all' && scan.type !== filterType) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        scan.target.toLowerCase().includes(q) ||
        scan.threatCategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatTimeAgo = (isoDate: string) => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleCopyTarget = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="recent-scans-panel" className="space-y-4">
      {/* Header & Controls */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-display">
              Scan Forensics Audit Log
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {filteredScans.length} Records
            </span>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-scans-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search target or category..."
              className="w-full pl-9 pr-3 py-1.8 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500/60"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>

          {['all', 'Dangerous', 'Suspicious', 'Safe'].map((v) => (
            <button
              key={v}
              onClick={() => setFilterVerdict(v)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                filterVerdict === v
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5'
              }`}
            >
              {v === 'all' ? 'All Verdicts' : v}
            </button>
          ))}

          <span className="text-slate-600">|</span>

          {['all', 'url', 'email'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5'
              }`}
            >
              {t === 'all' ? 'All Types' : t === 'url' ? 'Links' : 'Email/SMS'}
            </button>
          ))}
        </div>
      </div>

      {/* Scans List / Cards */}
      {filteredScans.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl border border-white/10 text-center space-y-2">
          <History className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-medium text-slate-400">No matching scan history records found.</p>
          <p className="text-xs text-slate-500">Run a URL or Email analysis to record forensic entries.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredScans.map((scan) => {
            const isDanger = scan.verdict === 'Dangerous';
            const isSuspicious = scan.verdict === 'Suspicious';

            return (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-white/15 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
              >
                {/* Left side: Type Icon + Target & Category */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    isDanger
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                      : isSuspicious
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  }`}>
                    {scan.type === 'url' ? <Globe className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        isDanger
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : isSuspicious
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {scan.verdict} ({scan.riskScore}/100)
                      </span>
                      <span className="text-xs font-semibold text-white font-display truncate">
                        {scan.threatCategory}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slate-300 truncate max-w-full">
                      {scan.target}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>{formatTimeAgo(scan.timestamp)}</span>
                      <span>•</span>
                      <span>{scan.flags.length} Red Flags</span>
                      {scan.aiForensics && (
                        <>
                          <span>•</span>
                          <span className="text-cyan-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI Forensics
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    id={`btn-inspect-scan-${scan.id}`}
                    onClick={() => setSelectedScanModal(scan)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => onRescanTarget(scan.target, scan.type)}
                    title="Re-run scan"
                    className="p-1.8 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteScan(scan.id)}
                    title="Delete log record"
                    className="p-1.8 rounded-xl bg-slate-900/80 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-white/10 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Inspection Modal */}
      <AnimatePresence>
        {selectedScanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel-elevated max-w-2xl w-full p-6 rounded-3xl border border-white/15 max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${
                    selectedScanModal.verdict === 'Dangerous' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    {selectedScanModal.type === 'url' ? <Globe className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Forensic Diagnostic Dossier</h3>
                    <p className="text-xs text-slate-400 font-mono">ID: {selectedScanModal.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedScanModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Target info */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Target Subject / Link</span>
                <p className="text-xs font-mono text-white break-all">{selectedScanModal.target}</p>
              </div>

              {/* Score and verdict */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Verdict</span>
                  <p className={`text-sm font-bold mt-0.5 ${
                    selectedScanModal.verdict === 'Dangerous' ? 'text-rose-400' : selectedScanModal.verdict === 'Suspicious' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {selectedScanModal.verdict}
                  </p>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Risk Index</span>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedScanModal.riskScore}/100</p>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Scan Latency</span>
                  <p className="text-sm font-bold text-cyan-300 mt-0.5">{selectedScanModal.scanDurationMs}ms</p>
                </div>
              </div>

              {/* AI Forensics if available */}
              {selectedScanModal.aiForensics && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Threat Rationale:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{selectedScanModal.aiForensics.explanation}</p>
                </div>
              )}

              {/* Red flags */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 uppercase font-mono">
                  Identified Red Flags ({selectedScanModal.flags.length})
                </span>
                <div className="space-y-2">
                  {selectedScanModal.flags.map((flag) => (
                    <div key={flag.id} className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{flag.title}</span>
                        <span className="text-[10px] font-mono text-rose-400 uppercase">{flag.severity}</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{flag.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedScanModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-slate-200 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
