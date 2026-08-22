import React from 'react';
import { 
  ShieldCheck, AlertOctagon, ExternalLink, PhoneCall, 
  Globe, LifeBuoy, QrCode, Smartphone 
} from 'lucide-react';

interface FooterProps {
  onOpenEducation: () => void;
  onOpenHelplines: () => void;
  onOpenShareDevice: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenEducation, 
  onOpenHelplines,
  onOpenShareDevice
}) => {
  return (
    <footer className="w-full border-t border-white/10 glass-panel mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Official Emergency Cyber Crime Portals & Numbers Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display">
                  Official Cyber Crime Helplines & Verified Portals
                </h3>
                <p className="text-xs text-slate-400">
                  Government authorities to report online financial fraud, identity theft, and scam calls.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenHelplines}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-all cursor-pointer"
            >
              <span>View Full Directory</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* India 1930 */}
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>🇮🇳</span>
                  <span>India (MHA)</span>
                </span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded">24x7</span>
              </div>
              <p className="text-slate-400 text-[11px]">National Cyber Crime Reporting</p>
              <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                <a href="tel:1930" className="text-emerald-400 font-bold hover:underline">
                  📞 1930 (Helpline)
                </a>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline flex items-center gap-0.5">
                  <span>cybercrime.gov.in</span>
                </a>
              </div>
            </div>

            {/* US FTC & CISA */}
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>🇺🇸</span>
                  <span>United States (FTC)</span>
                </span>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">Official</span>
              </div>
              <p className="text-slate-400 text-[11px]">Federal Trade Commission & IC3</p>
              <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                <a href="tel:18773824357" className="text-emerald-400 font-bold hover:underline">
                  📞 1-877-FTC-HELP
                </a>
                <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline flex items-center gap-0.5">
                  <span>reportfraud.ftc.gov</span>
                </a>
              </div>
            </div>

            {/* UK Action Fraud */}
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>🇬🇧</span>
                  <span>United Kingdom (Police)</span>
                </span>
                <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded">Action Fraud</span>
              </div>
              <p className="text-slate-400 text-[11px]">National Fraud & Cyber Crime</p>
              <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                <a href="tel:03001232040" className="text-emerald-400 font-bold hover:underline">
                  📞 0300 123 2040
                </a>
                <a href="https://www.actionfraud.police.uk" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline flex items-center gap-0.5">
                  <span>actionfraud.police.uk</span>
                </a>
              </div>
            </div>

            {/* Australia / Canada */}
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>🇦🇺 🇨🇦</span>
                  <span>Australia / Canada</span>
                </span>
                <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded">ACSC / CAFC</span>
              </div>
              <p className="text-slate-400 text-[11px]">National Cyber Security Centres</p>
              <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                <a href="tel:1300292371" className="text-emerald-400 font-bold hover:underline">
                  📞 1300 CYBER1
                </a>
                <a href="https://www.cyber.gov.au" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline flex items-center gap-0.5">
                  <span>cyber.gov.au</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Incident Response Box */}
        <div className="glass-panel-danger p-6 rounded-3xl border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertOctagon className="w-5 h-5" />
            <span>Emergency Incident Protocol: Did You Already Click or Submit Data to a Phish?</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-200">
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
              <span className="font-bold text-rose-300 font-mono">1. Reset Passwords</span>
              <p className="text-slate-400 text-[11px] mt-1">Change credentials immediately from a different clean device. Terminate all active sessions.</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
              <span className="font-bold text-rose-300 font-mono">2. Lock Financial Cards</span>
              <p className="text-slate-400 text-[11px] mt-1">If card or bank details were entered, freeze your debit/credit card via your official banking app.</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
              <span className="font-bold text-rose-300 font-mono">3. Enable Hardware 2FA</span>
              <p className="text-slate-400 text-[11px] mt-1">Switch from SMS 2FA to FIDO2 / Authenticator apps (Google Auth, YubiKey) to prevent SIM swaps.</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
              <span className="font-bold text-rose-300 font-mono">4. Report to 1930 / FTC</span>
              <p className="text-slate-400 text-[11px] mt-1">File an official report with the Cyber Crime Portal (1930 / cybercrime.gov.in) or reportfraud.ftc.gov.</p>
            </div>
          </div>
        </div>

        {/* Links and Disclaimers */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-white/5 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white font-display">PHISHGUARD SENTINEL</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-[11px]">Real-Time Cyber Threat Defense Engine</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-[11px]">
            <button
              onClick={onOpenShareDevice}
              className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Open on Phone / Other Device</span>
            </button>

            <button
              onClick={onOpenEducation}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Phishing Academy
            </button>

            <button
              onClick={onOpenHelplines}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Official Helplines</span>
            </button>

            <a
              href="https://www.cisa.gov/phishing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>CISA</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://www.ic3.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>FBI IC3</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
