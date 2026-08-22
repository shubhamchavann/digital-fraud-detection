import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PhoneCall, Globe, ShieldAlert, X, ExternalLink, 
  MapPin, Shield, Copy, Check, LifeBuoy, AlertTriangle, Building2
} from 'lucide-react';

interface OfficialHelplinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HelplineDirectory {
  country: string;
  flag: string;
  agencies: {
    name: string;
    description: string;
    number?: string;
    numberLabel?: string;
    website: string;
    websiteLabel: string;
    is24x7?: boolean;
    primaryEmergency?: boolean;
  }[];
}

const HELPLINE_DATA: HelplineDirectory[] = [
  {
    country: 'India',
    flag: '🇮🇳',
    agencies: [
      {
        name: 'National Cyber Crime Reporting Portal & Helpline',
        description: 'Ministry of Home Affairs (MHA) dedicated citizen financial fraud & online crime response portal.',
        number: '1930',
        numberLabel: '1930 (Toll-Free 24x7)',
        website: 'https://cybercrime.gov.in',
        websiteLabel: 'cybercrime.gov.in',
        is24x7: true,
        primaryEmergency: true,
      },
      {
        name: 'CERT-In (Indian Computer Emergency Response Team)',
        description: 'National nodal agency for responding to computer security incidents and critical vulnerabilities.',
        number: '1800-11-4949',
        numberLabel: '1800-11-4949 / +91-11-24669666',
        website: 'https://www.cert-in.org.in',
        websiteLabel: 'cert-in.org.in',
        is24x7: true,
      },
      {
        name: 'Chakshu & Sanchar Saathi (DoT)',
        description: 'Department of Telecommunications portal to report suspected fraud communications via SMS/WhatsApp/Calls.',
        website: 'https://sancharsaathi.gov.in/sfc',
        websiteLabel: 'sancharsaathi.gov.in',
      }
    ]
  },
  {
    country: 'United States',
    flag: '🇺🇸',
    agencies: [
      {
        name: 'FTC (Federal Trade Commission) Fraud Reporting',
        description: 'Official US government authority for reporting scams, consumer fraud, identity theft, and bad business practices.',
        number: '+1-877-382-4357',
        numberLabel: '1-877-FTC-HELP (1-877-382-4357)',
        website: 'https://reportfraud.ftc.gov',
        websiteLabel: 'reportfraud.ftc.gov',
        primaryEmergency: true,
      },
      {
        name: 'FBI Internet Crime Complaint Center (IC3)',
        description: 'Central hub for filing complaints regarding online cyber threats, business email compromise (BEC), and wire fraud.',
        number: '+1-800-225-5324',
        numberLabel: '1-800-CALL-FBI (1-800-225-5324)',
        website: 'https://www.ic3.gov',
        websiteLabel: 'ic3.gov',
      },
      {
        name: 'CISA (Cybersecurity & Infrastructure Security Agency)',
        description: 'America’s cyber defense agency providing threat warnings, incident response, and cybersecurity guidance.',
        number: '+1-888-282-0870',
        numberLabel: '1-888-282-0870',
        website: 'https://www.cisa.gov/report',
        websiteLabel: 'cisa.gov',
      },
      {
        name: 'IdentityTheft.gov',
        description: 'Official US recovery portal with step-by-step recovery plans if personal or financial credentials were compromised.',
        website: 'https://www.identitytheft.gov',
        websiteLabel: 'identitytheft.gov',
      }
    ]
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    agencies: [
      {
        name: 'Action Fraud (National Fraud & Cyber Crime Reporting)',
        description: 'UK police national reporting center for fraud and cybercrime incidents.',
        number: '0300 123 2040',
        numberLabel: '0300 123 2040 (UK)',
        website: 'https://www.actionfraud.police.uk',
        websiteLabel: 'actionfraud.police.uk',
        is24x7: true,
        primaryEmergency: true,
      },
      {
        name: 'NCSC (National Cyber Security Centre)',
        description: 'UK government technical authority providing public scam reporting and defense protocols.',
        website: 'https://www.ncsc.gov.uk',
        websiteLabel: 'ncsc.gov.uk (Forward SMS to 7726)',
      }
    ]
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    agencies: [
      {
        name: 'Canadian Anti-Fraud Centre (CAFC)',
        description: 'National repository for fraud data managed jointly by RCMP, Competition Bureau, and OPP.',
        number: '+1-888-495-8501',
        numberLabel: '1-888-495-8501 (Toll-Free)',
        website: 'https://antifraudcentre-centreantifraude.ca',
        websiteLabel: 'antifraudcentre-centreantifraude.ca',
        primaryEmergency: true,
      },
      {
        name: 'Canadian Centre for Cyber Security (Cyber.gc.ca)',
        description: 'Single unified source of expert advice and incident response in Canada.',
        number: '+1-833-292-3788',
        numberLabel: '1-833-CYBER-88 (1-833-292-3788)',
        website: 'https://www.cyber.gc.ca',
        websiteLabel: 'cyber.gc.ca',
      }
    ]
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    agencies: [
      {
        name: 'Australian Cyber Security Centre (ACSC)',
        description: 'Australian Government 24/7 incident hotline and cybersecurity assistance portal.',
        number: '1300 292 371',
        numberLabel: '1300 CYBER1 (1300 292 371 - 24/7)',
        website: 'https://www.cyber.gov.au',
        websiteLabel: 'cyber.gov.au',
        is24x7: true,
        primaryEmergency: true,
      },
      {
        name: 'Scamwatch (National Anti-Scam Centre)',
        description: 'ACCC service providing consumer scam alerts and public reporting tools.',
        website: 'https://www.scamwatch.gov.au',
        websiteLabel: 'scamwatch.gov.au',
      }
    ]
  },
  {
    country: 'International & Global',
    flag: '🌐',
    agencies: [
      {
        name: 'INTERPOL Cybercrime Directorate',
        description: 'Global law enforcement coordination tackling cross-border cyber financial crimes and phishing syndicates.',
        website: 'https://www.interpol.int/en/Crimes/Cybercrime',
        websiteLabel: 'interpol.int/Cybercrime',
      },
      {
        name: 'Google Safe Browsing & Report Phishing',
        description: 'Global URL blacklist clearinghouse used by Chrome, Firefox, Safari, and security scanners worldwide.',
        website: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
        websiteLabel: 'safebrowsing.google.com',
      }
    ]
  }
];

export const OfficialHelplinesModal: React.FC<OfficialHelplinesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('India');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCountryData = HELPLINE_DATA.find((c) => c.country === selectedCountry) || HELPLINE_DATA[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="glass-panel-elevated w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white font-display">
                    Official Cyber Security Helplines & Websites
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    VERIFIED DIRECTORY
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Direct official government emergency numbers and reporting portals if you or someone you know was targeted.
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

          {/* Quick Notice Banner */}
          <div className="bg-amber-950/40 px-6 py-3 border-b border-amber-500/20 flex items-center gap-2 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Immediate Fraud Action:</strong> If money was stolen within the last 2 hours, call your country's national helpline immediately (e.g. <strong>1930 in India</strong> or your bank) to freeze the fraudulent transaction before it leaves the banking network.
            </span>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Country Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {HELPLINE_DATA.map((c) => (
                <button
                  key={c.country}
                  onClick={() => setSelectedCountry(c.country)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCountry === c.country
                      ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span>{c.country}</span>
                </button>
              ))}
            </div>

            {/* Selected Country Agencies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCountryData.agencies.map((agency, idx) => (
                <div
                  key={idx}
                  className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    agency.primaryEmergency
                      ? 'border-rose-500/30 bg-rose-950/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <h3 className="font-bold text-white text-sm font-display">
                          {agency.name}
                        </h3>
                      </div>
                      {agency.is24x7 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shrink-0">
                          24x7 ACTIVE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {agency.description}
                    </p>
                  </div>

                  {/* Actions (Call Button & Official Web Link) */}
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    {agency.number && (
                      <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-mono text-xs text-white font-bold">
                            {agency.numberLabel || agency.number}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopy(agency.number!)}
                            title="Copy phone number"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            {copiedText === agency.number ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href={`tel:${agency.number.replace(/[^0-9+]/g, '')}`}
                            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1 transition-all"
                          >
                            <span>Call Now</span>
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="font-mono text-xs text-cyan-300 truncate">
                          {agency.websiteLabel}
                        </span>
                      </div>
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center gap-1 shrink-0 transition-all"
                      >
                        <span>Visit Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 4 Golden Steps If Scammed */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-3">
              <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-cyan-400" />
                <span>What to do during the "Golden Hour" after a scam:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                  <span className="font-bold text-rose-300 font-mono">1. Freeze Cards/Accounts</span>
                  <p className="text-slate-400 text-[11px]">Immediately lock your credit/debit cards via mobile banking app.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                  <span className="font-bold text-rose-300 font-mono">2. Call 1930 / Helpline</span>
                  <p className="text-slate-400 text-[11px]">Report within 2 hours so funds can be held in transit.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                  <span className="font-bold text-rose-300 font-mono">3. Change Passwords</span>
                  <p className="text-slate-400 text-[11px]">Update your primary email, banking, and social logins from a clean device.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                  <span className="font-bold text-rose-300 font-mono">4. Save Evidence</span>
                  <p className="text-slate-400 text-[11px]">Take screenshots of messages, transaction UTR numbers, and scam URLs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
            <span>Always verify web addresses ending in <strong>.gov</strong> or official national domains.</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium cursor-pointer transition-colors"
            >
              Close Directory
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
