import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, ShieldAlert, ShieldCheck, AlertTriangle, Sparkles, Terminal, 
  Copy, Check, RefreshCw, CornerDownRight, CheckCircle2, 
  Zap, Clock 
} from 'lucide-react';
import { ScanResult } from '../types';
import { api } from '../services/api';

interface EmailAnalyzerProps {
  onScanComplete?: (result: ScanResult) => void;
  initialResult?: ScanResult | null;
}

const EMAIL_PRESETS = [
  {
    label: 'USPS Incomplete Address SMS',
    subject: 'USPS Delivery Notification #9021',
    sender: 'tracking-alert@sms-postal-hub.top',
    content: 'USPS: Your package could not be delivered on 08/21 due to incomplete house number. Please update your address within 24 hours to avoid package return: http://usps-postal-tracking.top/redeliver. A $0.30 redelivery fee applies.',
    type: 'threat'
  },
  {
    label: 'Netflix 24h Suspension Alert',
    subject: 'Urgent: Your Netflix Subscription Payment Failed',
    sender: 'billing-update@netflix-auth-verify.cf',
    content: 'Dear Customer, We were unable to process your monthly payment for Netflix subscription. Your account will be suspended within 24 hours unless you update your billing immediately. Click here to verify and restore access: http://update-netflix-billing.cf/auth',
    type: 'threat'
  },
  {
    label: 'Geek Squad $399 Renewal Invoice',
    subject: 'Invoice #GS-88910: Auto-Renewal Confirmed ($399.99)',
    sender: 'geeksquad-support-help@gmail.com',
    content: 'Thank you for your order. We have auto-renewed your 3-Year Geek Squad Best Buy PC Total Support for $399.99 charged to your card. If you did not authorize this charge, call our toll-free refund department immediately at +1-888-910-3849 to claim your instant refund.',
    type: 'threat'
  },
  {
    label: 'CEO Urgent Gift Card / Wire',
    subject: 'Quick task - Are you at your desk?',
    sender: 'ceo-office-internal@outlook.com',
    content: 'Hi, I am in a conference meeting with clients and need an urgent favor. Can you purchase 5x $100 Apple gift cards for the team right away and scratch off the back to reply with the codes? I will reimburse you by direct deposit this afternoon.',
    type: 'threat'
  },
  {
    label: 'Legitimate Amazon Order Update',
    subject: 'Your Amazon.com order #112-9021882 has shipped',
    sender: 'auto-confirm@amazon.com',
    content: 'Hello, your package containing "USB-C Cable (6ft)" has shipped via UPS tracking #1Z99999999. Estimated delivery is Friday. Track your package anytime in your Amazon mobile application.',
    type: 'safe'
  }
];

export const EmailAnalyzer: React.FC<EmailAnalyzerProps> = ({ onScanComplete, initialResult }) => {
  const [subject, setSubject] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(initialResult || null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (presetContent?: { content: string; subject: string; sender: string }) => {
    const toAnalyzeContent = (presetContent ? presetContent.content : content).trim();
    const toAnalyzeSubject = presetContent ? presetContent.subject : subject;
    const toAnalyzeSender = presetContent ? presetContent.sender : senderEmail;

    if (!toAnalyzeContent) {
      setErrorMsg('Please paste the email or message body text to analyze.');
      return;
    }
    setErrorMsg(null);
    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await api.scanEmail(toAnalyzeContent, toAnalyzeSubject, toAnalyzeSender);
      setTimeout(() => {
        setScanResult(result);
        setIsScanning(false);
        if (onScanComplete) {
          onScanComplete(result);
        }
      }, 1200);
    } catch (err: any) {
      setIsScanning(false);
      setErrorMsg(err.message || 'Failed to analyze message content.');
    }
  };

  const handleCopyReport = () => {
    if (!scanResult) return;
    const reportText = `PHISHGUARD EMAIL FORENSICS REPORT
Target: ${scanResult.target}
Verdict: ${scanResult.verdict.toUpperCase()} (Risk Score: ${scanResult.riskScore}/100)
Category: ${scanResult.threatCategory}
Urgency Score: ${scanResult.emailForensics?.urgencyScore || 0}/100
Flags Count: ${scanResult.flags.length}
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="email-analyzer-section" className="space-y-6">
      {/* Header Panel */}
      <div className="glass-panel-elevated p-5 sm:p-7 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
                <Mail className="w-3.5 h-3.5" />
                <span>SOCIAL ENGINEERING FORENSICS</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight font-display">
                Email, SMS & Scareware Text Analyzer
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Paste suspicious emails, SMS messages, or scareware renewal notices to detect psychological urgency triggers, spoofed sender domains, and financial extortion.
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Common Scam Presets (Click to Load):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {EMAIL_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  id={`btn-preset-email-${idx}`}
                  type="button"
                  onClick={() => {
                    setSubject(preset.subject);
                    setSenderEmail(preset.sender);
                    setContent(preset.content);
                    handleAnalyze(preset);
                  }}
                  className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    preset.type === 'threat'
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-300 hover:bg-rose-900/50 hover:border-rose-500/50'
                      : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-500/50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="space-y-3 pt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Subject Line / Header (Optional)
                </label>
                <input
                  id="input-email-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Action Required: Account Suspension..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Sender Email / Phone (Optional)
                </label>
                <input
                  id="input-email-sender"
                  type="text"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="e.g. no-reply@security-paypal-alert.xyz"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Body / SMS Content <span className="text-cyan-400">*</span>
              </label>
              <textarea
                id="input-email-body"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the full message text, body, or suspicious instructions here..."
                className="w-full px-3.5 py-3 rounded-2xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500/60 font-mono leading-relaxed"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                id="btn-clear-email"
                type="button"
                onClick={() => {
                  setSubject('');
                  setSenderEmail('');
                  setContent('');
                  setScanResult(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 border border-white/5 cursor-pointer"
              >
                Clear
              </button>

              <button
                id="btn-execute-email-scan"
                type="submit"
                disabled={isScanning}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 cursor-pointer transition-all"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Text...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Analyze Phishing Tactics</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Output */}
      {scanResult && !isScanning && (
        <motion.div
          id="email-scan-result-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Verdict Header */}
          <div className={`p-5 sm:p-7 md:p-8 rounded-3xl border ${
            scanResult.verdict === 'Dangerous'
              ? 'glass-panel-danger glow-danger border-rose-500/40'
              : scanResult.verdict === 'Suspicious'
              ? 'glass-panel-warning border-amber-500/40'
              : 'glass-panel-safe glow-safe border-emerald-500/40'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
              <div className="space-y-2 flex-1 min-w-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase ${
                  scanResult.verdict === 'Dangerous'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : scanResult.verdict === 'Suspicious'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {scanResult.verdict === 'Dangerous' ? <ShieldAlert className="w-4 h-4 shrink-0" /> : <ShieldCheck className="w-4 h-4 shrink-0" />}
                  <span>{scanResult.verdict.toUpperCase()} THREAT VERDICT</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {scanResult.threatCategory}
                </h3>
              </div>

              {/* Urgency and Risk Score Badges */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <div className="bg-slate-950/80 p-3 sm:p-3.5 rounded-2xl border border-white/10 text-center flex-1 sm:flex-initial sm:min-w-[100px]">
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Risk Score</p>
                  <p className="text-xl sm:text-2xl font-black text-white font-display leading-none mt-1">
                    {scanResult.riskScore}<span className="text-xs text-slate-500 font-normal">/100</span>
                  </p>
                </div>

                {scanResult.emailForensics && (
                  <div className="bg-slate-950/80 p-3 sm:p-3.5 rounded-2xl border border-white/10 text-center flex-1 sm:flex-initial sm:min-w-[100px]">
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Urgency Meter</p>
                    <p className={`text-xl sm:text-2xl font-black font-display leading-none mt-1 ${
                      scanResult.emailForensics.urgencyScore > 60 ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {scanResult.emailForensics.urgencyScore}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3.5 mt-3.5 border-t border-white/10">
              <button
                id="btn-copy-email-report"
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs border border-white/10 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Report Copied' : 'Copy Forensics'}</span>
              </button>
            </div>
          </div>

          {/* Psychological Threat Tactics Grid */}
          {scanResult.emailForensics && (
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-xs sm:text-sm font-bold text-white font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Detected Persuasion & Social Engineering Tactics</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Impersonated Entity</span>
                  <p className="text-xs sm:text-sm font-bold text-white mt-1 truncate">
                    {scanResult.emailForensics.impersonationTarget || 'Generic Spoof'}
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Scam Classification</span>
                  <p className="text-xs sm:text-sm font-bold text-cyan-300 mt-1 truncate">
                    {scanResult.emailForensics.scamCategory}
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Sender Anomaly</span>
                  <p className={`text-xs sm:text-sm font-bold mt-1 truncate ${
                    scanResult.emailForensics.senderAnomaly ? 'text-rose-400' : 'text-slate-300'
                  }`}>
                    {scanResult.emailForensics.senderAnomaly ? 'Spoofed Domain' : 'Consistent'}
                  </p>
                </div>
              </div>

              {/* Trigger Phrases Highlighted */}
              {scanResult.emailForensics.triggerPhrases.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase font-mono">
                    High-Risk Phrasing & Hooks Detected:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {scanResult.emailForensics.triggerPhrases.map((phrase, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono"
                      >
                        "{phrase}"
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Forensic Commentary */}
          {scanResult.aiForensics && (
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Gemini AI Linguistic Threat Breakdown</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                  Confidence: {scanResult.aiForensics.confidence}%
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {scanResult.aiForensics.explanation}
              </p>
              
              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Protective Protocol:</span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                  {scanResult.aiForensics.recommendedActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Itemized Red Flags */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Red Flags & Rule Violations ({scanResult.flags.length})</span>
            </h4>

            <div className="space-y-3">
              {scanResult.flags.map((flag) => (
                <div
                  key={flag.id}
                  className="bg-slate-950/70 p-3.5 sm:p-4 rounded-2xl border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{flag.title}</span>
                    <span className="text-[10px] font-mono text-rose-400 uppercase">{flag.severity}</span>
                  </div>
                  <p className="text-xs text-slate-300">{flag.description}</p>
                  <div className="text-xs text-cyan-300/90 pt-1 flex items-start gap-1">
                    <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{flag.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
