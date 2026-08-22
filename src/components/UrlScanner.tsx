import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ShieldAlert, ShieldCheck, AlertTriangle, Globe, Lock, Unlock, 
  ExternalLink, Sparkles, Server, Terminal, Copy, Check, RefreshCw, 
  Download, ArrowRight, CornerDownRight, CheckCircle2, XCircle, FileCode, Layers
} from 'lucide-react';
import { ScanResult, RedFlag } from '../types';
import { api } from '../services/api';

interface UrlScannerProps {
  onScanComplete?: (result: ScanResult) => void;
  initialResult?: ScanResult | null;
}

const PRESET_LINKS = [
  {
    label: 'PayPal Phish (High-Risk TLD)',
    url: 'http://paypal.account-verification-security.top/login.php',
    type: 'threat'
  },
  {
    label: 'Chase Bank IDN Homograph',
    url: 'https://xn--chse-qqa.com/online-banking/auth',
    type: 'threat'
  },
  {
    label: 'Raw IP Credential Trap',
    url: 'http://194.87.12.88:8080/secure/wallet-connect',
    type: 'threat'
  },
  {
    label: 'Bitly Obfuscated Shortlink',
    url: 'https://bit.ly/claim-tax-refund-2026',
    type: 'warning'
  },
  {
    label: 'Legitimate Link (GitHub Security)',
    url: 'https://github.com/features/security',
    type: 'safe'
  }
];

export const UrlScanner: React.FC<UrlScannerProps> = ({ onScanComplete, initialResult }) => {
  const [urlInput, setUrlInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStage, setScanStage] = useState<string>('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(initialResult || null);
  const [copied, setCopied] = useState<boolean>(false);
  const [enableAi, setEnableAi] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleScan = async (targetUrl?: string) => {
    const toScan = (targetUrl || urlInput).trim();
    if (!toScan) {
      setErrorMsg('Please enter or select a URL to analyze.');
      return;
    }
    setErrorMsg(null);
    setIsScanning(true);
    setScanResult(null);

    // Multi-stage scan animation steps
    const stages = [
      'Deconstructing URL host and protocol hierarchy...',
      'Running IDN Homograph & Punycode glyph detector...',
      'Cross-referencing 250+ targeted corporate brand names...',
      'Inspecting TLD risk reputation & sub-domain stacking...',
      'Deep path & credential harvesting heuristics analysis...',
      'Synthesizing threat intelligence...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < stages.length) {
        setScanStage(stages[currentStep]);
        currentStep++;
      }
    }, 280);

    try {
      const result = await api.scanUrl(toScan, enableAi);
      setTimeout(() => {
        clearInterval(interval);
        setScanResult(result);
        setIsScanning(false);
        if (onScanComplete) {
          onScanComplete(result);
        }
      }, 1800);
    } catch (err: any) {
      clearInterval(interval);
      setIsScanning(false);
      setErrorMsg(err.message || 'Failed to complete forensic scan.');
    }
  };

  const handleCopyReport = () => {
    if (!scanResult) return;
    const reportText = `PHISHGUARD FORENSIC SCAN REPORT
Target URL: ${scanResult.target}
Verdict: ${scanResult.verdict.toUpperCase()} (Risk Score: ${scanResult.riskScore}/100)
Threat Category: ${scanResult.threatCategory}
Flags Detected: ${scanResult.flags.length}
Timestamp: ${scanResult.timestamp}
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    if (!scanResult) return;
    const blob = new Blob([JSON.stringify(scanResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishguard-scan-${scanResult.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case 'Dangerous':
        return {
          panelClass: 'glass-panel-danger glow-danger border-rose-500/40',
          badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          textClass: 'text-rose-400',
          icon: ShieldAlert,
          color: '#f43f5e'
        };
      case 'Suspicious':
        return {
          panelClass: 'glass-panel-warning border-amber-500/40',
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          textClass: 'text-amber-400',
          icon: AlertTriangle,
          color: '#f59e0b'
        };
      default:
        return {
          panelClass: 'glass-panel-safe glow-safe border-emerald-500/40',
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          textClass: 'text-emerald-400',
          icon: ShieldCheck,
          color: '#10b981'
        };
    }
  };

  return (
    <div id="url-scanner-section" className="space-y-6">
      {/* Scanner Input Header Box */}
      <div className="glass-panel-elevated p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
                <Search className="w-3.5 h-3.5" />
                <span>HEURISTIC URL RADAR</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-display">
                Real-Time Link & Domain Forensic Scanner
              </h2>
              <p className="text-slate-400 text-sm">
                Analyze suspected URLs for punycode homographs, unauthorized brand mimics, hidden redirects, and credential harvesters.
              </p>
            </div>

            {/* AI Toggle */}
            <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-2xl border border-white/5 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Threat Forensics:</span>
              <button
                id="btn-toggle-ai-url"
                onClick={() => setEnableAi(!enableAi)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                  enableAi ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    enableAi ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Main Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleScan();
            }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Globe className="w-5 h-5 text-cyan-400/70" />
              </div>
              <input
                id="input-url-target"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste link to verify (e.g. https://paypal.secure-login-checkpoint.xyz)..."
                disabled={isScanning}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 font-mono shadow-inner transition-all disabled:opacity-50"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              id="btn-execute-url-scan"
              type="submit"
              disabled={isScanning}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] disabled:opacity-50 cursor-pointer transition-all active:scale-98"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Link...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Scan Link</span>
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Quick Preset Test Cases */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Threat Sample Presets (Click to Test):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_LINKS.map((preset, idx) => (
                <button
                  key={idx}
                  id={`btn-preset-link-${idx}`}
                  type="button"
                  onClick={() => {
                    setUrlInput(preset.url);
                    handleScan(preset.url);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    preset.type === 'threat'
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-300 hover:bg-rose-900/50 hover:border-rose-500/50'
                      : preset.type === 'warning'
                      ? 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/50 hover:border-amber-500/50'
                      : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-500/50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Scanning Radar State */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            id="url-scan-in-progress"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel p-8 rounded-3xl border border-cyan-500/30 text-center relative overflow-hidden"
          >
            <div className="max-w-md mx-auto flex flex-col items-center space-y-5">
              {/* Radar circular sweep */}
              <div className="relative w-28 h-28 rounded-full border border-cyan-500/30 bg-slate-950/90 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="w-full h-full animate-radar origin-center bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(6,182,212,0.45)_360deg)]" />
                </div>
                <Globe className="w-10 h-10 text-cyan-400 animate-pulse relative z-10" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-display">Forensic Inspection Active</h3>
                <p className="text-xs font-mono text-cyan-300 mt-1 min-h-[20px]">{scanStage}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-white/5">
                <motion.div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full"
                  animate={{ width: ['5%', '100%'] }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forensic Scan Results Output */}
      {scanResult && !isScanning && (
        <motion.div
          id="url-scan-result-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Main Verdict & Gauge Banner */}
          {(() => {
            const styles = getVerdictStyles(scanResult.verdict);
            const VerdictIcon = styles.icon;

            return (
              <div className={`p-6 md:p-8 rounded-3xl border transition-all ${styles.panelClass}`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Left: Verdict and category */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider border ${styles.badgeClass}`}>
                        <VerdictIcon className="w-4 h-4" />
                        <span>VERDICT: {scanResult.verdict}</span>
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Scan Duration: {scanResult.scanDurationMs}ms
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display">
                        {scanResult.threatCategory}
                      </h3>
                      <p className="text-slate-300 font-mono text-xs md:text-sm break-all mt-1 bg-black/30 px-3 py-1.5 rounded-xl border border-white/5">
                        {scanResult.target}
                      </p>
                    </div>
                  </div>

                  {/* Right: Risk Score Gauge Circle */}
                  <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-white/10 shrink-0">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          stroke={styles.color}
                          strokeWidth="3.5"
                          strokeDasharray={`${scanResult.riskScore}, 100`}
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-white font-display leading-none">
                          {scanResult.riskScore}
                        </span>
                        <span className="text-[9px] text-slate-400 uppercase font-mono">Risk</span>
                      </div>
                    </div>

                    <div className="text-left space-y-1">
                      <p className="text-xs font-semibold text-white">Threat Severity</p>
                      <p className={`text-xs font-bold ${styles.textClass}`}>
                        {scanResult.riskScore >= 70 ? 'CRITICAL RISK' : scanResult.riskScore >= 30 ? 'ELEVATED RISK' : 'LOW RISK / CLEAN'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {scanResult.flags.length} Red Flags Flagged
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions: Copy Report, Download JSON, Re-scan */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-4 mt-4 border-t border-white/10">
                  <button
                    id="btn-copy-scan-report"
                    onClick={handleCopyReport}
                    className="flex items-center gap-1.5 px-3.5 py-1.8 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
                  </button>

                  <button
                    id="btn-download-scan-json"
                    onClick={handleExportJson}
                    className="flex items-center gap-1.5 px-3.5 py-1.8 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* AI Threat Analysis Commentary (if present) */}
          {scanResult.aiForensics && (
            <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini AI Threat Intelligence Assessment</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                  Confidence: {scanResult.aiForensics.confidence}%
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {scanResult.aiForensics.explanation}
              </p>
              
              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Recommended Countermeasures:</span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                  {scanResult.aiForensics.recommendedActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-xl border border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Domain & Network Diagnostics Card */}
          {scanResult.domainDetails && (
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Domain Structure & Network Telemetry</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Hostname</p>
                  <p className="text-xs font-mono font-bold text-white truncate mt-0.5">
                    {scanResult.domainDetails.hostname}
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 font-mono uppercase">SSL Encryption</p>
                  <p className={`text-xs font-mono font-bold mt-0.5 flex items-center gap-1 ${
                    scanResult.domainDetails.sslSecure ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {scanResult.domainDetails.sslSecure ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    {scanResult.domainDetails.sslSecure ? 'HTTPS Valid' : 'Insecure HTTP'}
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 font-mono uppercase">TLD Extension</p>
                  <p className="text-xs font-mono font-bold text-white mt-0.5">
                    .{scanResult.domainDetails.tld || 'none'}
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Punycode / Homograph</p>
                  <p className={`text-xs font-mono font-bold mt-0.5 ${
                    scanResult.domainDetails.hasPunycode ? 'text-rose-400' : 'text-slate-300'
                  }`}>
                    {scanResult.domainDetails.hasPunycode ? 'Detected (xn--)' : 'None'}
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Subdomain Depth</p>
                  <p className="text-xs font-mono font-bold text-white mt-0.5">
                    {scanResult.domainDetails.subdomainCount} levels
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Server Location</p>
                  <p className="text-xs font-mono font-bold text-cyan-300 truncate mt-0.5">
                    {scanResult.domainDetails.simulatedDns?.serverCountry || 'United States'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Red Flags Breakdown List */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Detailed Red Flags & Rule Violations ({scanResult.flags.length})</span>
              </div>
            </div>

            {scanResult.flags.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>No security rule violations detected. The destination matches standard legitimate patterns.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {scanResult.flags.map((flag) => (
                  <div
                    key={flag.id}
                    className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 space-y-2 hover:border-white/10 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          flag.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : flag.severity === 'high'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {flag.severity}
                        </span>
                        <h4 className="text-sm font-semibold text-white font-display">
                          {flag.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        RULE: {flag.rule}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      {flag.description}
                    </p>

                    <div className="flex items-start gap-1.5 text-xs text-cyan-300/90 bg-cyan-950/30 p-2 rounded-xl border border-cyan-500/10">
                      <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Recommendation:</strong> {flag.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
