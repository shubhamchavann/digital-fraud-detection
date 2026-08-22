import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, Laptop, Tablet, QrCode, Copy, Check, 
  ExternalLink, X, Share2, Sparkles, ShieldCheck 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareDeviceModal: React.FC<ShareDeviceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // Obtain current or shared URL
  const appUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost') 
        ? 'https://ais-pre-vz727uyoapbsh5odj6dghu-878811788528.asia-east1.run.app' 
        : window.location.origin)
    : 'https://ais-pre-vz727uyoapbsh5odj6dghu-878811788528.asia-east1.run.app';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PhishGuard - AI Cybersecurity & Scam Detector',
          text: 'Scan suspicious links, emails, and SMS for scams in real time with PhishGuard.',
          url: appUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="glass-panel-elevated w-full max-w-lg rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl space-y-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-display">
                  Open on Phone / Other Device
                </h2>
                <p className="text-xs text-slate-400">
                  Scan the QR code or copy the direct link to use PhishGuard anywhere.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-4 bg-white rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] border-4 border-cyan-400/50">
                <QRCodeSVG
                  value={appUrl}
                  size={190}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Scan with your Phone Camera (iOS / Android)</span>
              </div>
            </div>

            {/* Device Compatibility Icons */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col items-center gap-1 text-slate-300">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-[11px]">Mobile Phone</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col items-center gap-1 text-slate-300">
                <Tablet className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-[11px]">Tablet / iPad</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col items-center gap-1 text-slate-300">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-[11px]">Laptop / PC</span>
              </div>
            </div>

            {/* Link Copy Box */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-slate-400">
                Direct Workable Web Link:
              </label>
              <div className="flex items-center gap-2 bg-slate-950/90 p-2 rounded-2xl border border-white/10 shadow-inner">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 bg-transparent px-3 text-xs text-cyan-300 font-mono focus:outline-none select-all truncate"
                />
                <button
                  id="btn-copy-device-link"
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Native Share button */}
            <div className="flex gap-3">
              <button
                onClick={handleNativeShare}
                className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Share via WhatsApp / SMS / App</span>
              </button>

              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
