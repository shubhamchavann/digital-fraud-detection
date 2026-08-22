import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Mail, ShieldAlert, ShieldCheck, AlertTriangle, 
  Trash2, ExternalLink, Filter, Clock, Eye, Sparkles, X, 
  Copy, Check
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
  const [filterType, setFilterType] = useState<'all' | 'url' | 'email'>('all');
  const [filterVerdict, setFilterVerdict] = useState<'all' | 'Dangerous' | 'Suspicious' | 'Safe'>('all');
  const [selectedScanModal, setSelectedScanModal] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const filteredScans = scans.filter((scan) => {
    if (filterType !== 'all' && scan.type !== filterType) return false;
    if (filterVerdict !== 'all' && scan.verdict !== filterVerdict) return false;
    return true;
  });

  const formatTimeAgo = (timestamp: string) => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const handleCopyModalTarget = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="recent-scans-section" className="space-y-4">
      {/* Header with Title and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950/40 p-4 rounded-3xl border border-white/5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-white font-display">
            Forensic Telemetry Scan Log ({filteredScans.length})
          </h3>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-white/5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('url')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'url' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Links
            </button>
            <button
              onClick={() => setFilterType('email')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'email' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Messages
            </button>
          </div>

          {/* Verdict Filter */}
          <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-white/5 text-xs">
            <button
              onClick={() => setFilterVerdict('all')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                filterVerdict === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Ver.
            </button>
            <button
              onClick={() => setFilterVerdict('Dangerous')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                filterVerdict === 'Dangerous' ? 'bg-rose-500/20 text-rose-300 font-medium' : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Danger
            </button>
            <button
              onClick={() => setFilterVerdict('Suspicious')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                filterVerdict === 'Suspicious' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              Suspect
            </button>
            <button
              onClick={() => setFilterVerdict('Safe')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                filterVerdict === 'Safe' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Safe
            </button>
          </div>
        </div>
      </div>

      {/* Scans List */}
      {filteredScans.length === 0 ? (
        <div className="glass-panel p-8 rounded-3xl border border-white/5 text-center text-slate-400 text-sm">
          No forensic scan logs match the selected filter.
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
                className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-white/5 hover:border-white/15 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 group"
              >
                {/* Left side: Type Icon + Target & Category */}
                <div className="flex items-start gap-3 flex-1 min-w-0 w-full md:w-auto">
                  <div className={`p-2 sm:p-2.5 rounded-xl border shrink-0 ${
                    isDanger
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                      : isSuspicious
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  }`}>
                    {scan.type === 'url' ? <Globe className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border shrink-0 ${
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

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono">
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
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => onRescanTarget(scan.target, scan.type)}
                    title="Re-run scan"
                    className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteScan(scan.id)}
                    title="Delete log record"
                    className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-white/10 transition-all cursor-pointer"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel-elevated max-w-2xl w-full p-4 sm:p-6 rounded-3xl border border-white/15 max-h-[90vh] overflow-y-auto space-y-4 sm:space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base sm:text-lg font-bold text-white font-display">
                    Scan Log Telemetry Detail
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedScanModal(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Target and Verdict */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono uppercase border ${
                    selectedScanModal.verdict === 'Dangerous'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : selectedScanModal.verdict === 'Suspicious'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {selectedScanModal.verdict} ({selectedScanModal.riskScore}/100 Risk)
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Logged: {new Date(selectedScanModal.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-black/40 p-2.5 sm:p-3 rounded-2xl border border-white/10 gap-2">
                  <span className="text-xs font-mono text-slate-300 break-all min-w-0">
                    {selectedScanModal.target}
                  </span>
                  <button
                    onClick={() => handleCopyModalTarget(selectedScanModal.target)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-300 text-xs shrink-0 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* AI Assessment if exists */}
              {selectedScanModal.aiForensics && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemini AI Forensic Assessment</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedScanModal.aiForensics.explanation}
                  </p>
                </div>
              )}

              {/* Red flags */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400">
                  Detected Red Flags ({selectedScanModal.flags.length})
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedScanModal.flags.map((f, i) => (
                    <div key={i} className="bg-slate-950/60 p-2.5 sm:p-3 rounded-xl border border-white/5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{f.title}</span>
                        <span className="text-[10px] font-mono text-rose-400 uppercase">{f.severity}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    const target = selectedScanModal.target;
                    const type = selectedScanModal.type;
                    setSelectedScanModal(null);
                    onRescanTarget(target, type);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Re-Scan in Live Radar
                </button>
                <button
                  onClick={() => setSelectedScanModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
