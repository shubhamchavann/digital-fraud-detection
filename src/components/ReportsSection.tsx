import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flag, ThumbsUp, ShieldAlert, CheckCircle2, AlertTriangle, Plus, Send, UserCheck } from 'lucide-react';
import { ScamReport, FlagSeverity } from '../types';
import { api } from '../services/api';

interface ReportsSectionProps {
  reports: ScamReport[];
  onReportSubmitted: (newReport: ScamReport) => void;
  onReportUpvoted: (updatedReport: ScamReport) => void;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({
  reports,
  onReportSubmitted,
  onReportUpvoted,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [target, setTarget] = useState<string>('');
  const [scamType, setScamType] = useState<string>('SMS Delivery Smishing');
  const [targetBrand, setTargetBrand] = useState<string>('USPS');
  const [description, setDescription] = useState<string>('');
  const [senderInfo, setSenderInfo] = useState<string>('');
  const [severity, setSeverity] = useState<FlagSeverity>('high');
  const [reporterName, setReporterName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim() || !description.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitReport({
        target: target.trim(),
        scamType,
        targetBrand: targetBrand.trim() || 'Unknown Entity',
        description: description.trim(),
        senderInfo: senderInfo.trim() || 'N/A',
        severity,
        reporterName: reporterName.trim() || 'Sentinel_Agent'
      });

      onReportSubmitted(res);
      setIsSubmitting(false);
      setShowSubmitModal(false);
      setSuccessMsg('Scam threat report submitted successfully! Thank you for protecting the community.');
      setTarget('');
      setDescription('');
      setSenderInfo('');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setIsSubmitting(false);
      alert('Failed to submit report.');
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      const updated = await api.upvoteReport(id);
      onReportUpvoted(updated);
    } catch {
      // ignore
    }
  };

  return (
    <div id="reports-section" className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel-elevated p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
              <Flag className="w-3.5 h-3.5" />
              <span>COMMUNITY SENTINEL DEFENSE</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-display">
              Reported Phishing Threats & Scams
            </h2>
            <p className="text-slate-400 text-sm">
              Encountered a suspicious link, SMS smishing attempt, or impersonation fraud? Submit it to crowdsource protection.
            </p>
          </div>

          <button
            id="btn-open-submit-report"
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Scam Report</span>
          </button>
        </div>

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 mt-4"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-display">
            Community Verified Threat Reports ({reports.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-white/20 transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                    rep.status === 'Confirmed Malicious'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {rep.status}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Target: <strong className="text-white">{rep.targetBrand}</strong>
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white font-display">{rep.scamType}</h4>
                  <p className="text-xs font-mono text-cyan-300 bg-slate-950/80 p-2 rounded-xl border border-white/5 break-all mt-1">
                    {rep.target}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rep.description}
                </p>
              </div>

              {/* Bottom details & upvote */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{rep.reporterName}</span>
                </div>

                <button
                  id={`btn-upvote-${rep.id}`}
                  onClick={() => handleUpvote(rep.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Confirm / Upvote ({rep.upvotes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Report Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel-elevated max-w-lg w-full p-6 rounded-3xl border border-white/15 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Flag className="w-4 h-4 text-cyan-400" />
                  <span>Report a Phishing Scam</span>
                </h3>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="text-slate-400 hover:text-white text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Suspicious Link / Target Headline <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g. http://fake-bank-login.xyz/auth"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Scam Type</label>
                    <select
                      value={scamType}
                      onChange={(e) => setScamType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none"
                    >
                      <option value="SMS Delivery Smishing">SMS Delivery Smishing</option>
                      <option value="Fake Bank Login">Fake Bank Login</option>
                      <option value="Scareware Invoice Extortion">Scareware Invoice Extortion</option>
                      <option value="Crypto Seed Phrase Drainer">Crypto Seed Phrase Drainer</option>
                      <option value="QR Code Scam (Quishing)">QR Code Scam (Quishing)</option>
                      <option value="Romance / Pig Butchering">Romance / Pig Butchering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Targeted Brand</label>
                    <input
                      type="text"
                      value={targetBrand}
                      onChange={(e) => setTargetBrand(e.target.value)}
                      placeholder="e.g. Chase, USPS, Apple"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Incident Description & Tactic Details <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how you received this, what information was requested, and any phone numbers or addresses involved..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Sender Info (Optional)</label>
                    <input
                      type="text"
                      value={senderInfo}
                      onChange={(e) => setSenderInfo(e.target.value)}
                      placeholder="e.g. +1-800-XXX-XXXX or email"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Your Display Name</label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Alex_Sec"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
