import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, ShieldAlert, Search, Mail, Radio, Flag, 
  BookOpen, Sparkles, Activity, AlertTriangle, ArrowRight, 
  RefreshCw, CheckCircle2, PhoneCall, HeartHandshake
} from 'lucide-react';

import { IntroSequence } from './components/IntroSequence';
import { Navbar, NavTab } from './components/Navbar';
import { UrlScanner } from './components/UrlScanner';
import { EmailAnalyzer } from './components/EmailAnalyzer';
import { StatsOverview } from './components/StatsOverview';
import { RecentScans } from './components/RecentScans';
import { LiveThreatFeed } from './components/LiveThreatFeed';
import { ReportsSection } from './components/ReportsSection';
import { AwarenessHub } from './components/AwarenessHub';
import { AuthModal } from './components/AuthModal';
import { OfficialHelplinesModal } from './components/OfficialHelplinesModal';
import { Footer } from './components/Footer';

import { api, authStorage } from './services/api';
import { ScanResult, ScamReport, ThreatFeedItem, GlobalStats, User } from './types';

export default function App() {
  // Intro Sequence state
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return sessionStorage.getItem('phishguard_intro_seen') !== 'true';
  });

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Application Data States
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [threatFeed, setThreatFeed] = useState<ThreatFeedItem[]>([]);
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isHelplinesOpen, setIsHelplinesOpen] = useState<boolean>(false);
  const [activeUrlScanTarget, setActiveUrlScanTarget] = useState<string | null>(null);

  // Load initial data from backend API
  const loadInitialData = async () => {
    try {
      const [fetchedStats, fetchedScans, fetchedThreats, fetchedReports, currentUser] = await Promise.all([
        api.getStats(),
        api.getScans(),
        api.getThreatFeed(),
        api.getReports(),
        api.getCurrentUser(),
      ]);

      setStats(fetchedStats);
      setScans(fetchedScans);
      setThreatFeed(fetchedThreats);
      setReports(fetchedReports);
      setUser(currentUser);
    } catch (err) {
      console.error('Error bootstrapping PhishGuard telemetry:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('phishguard_intro_seen', 'true');
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const handleScanCompleted = (newScan: ScanResult) => {
    setScans((prev) => [newScan, ...prev.filter((s) => s.id !== newScan.id)]);
    api.getStats().then(setStats);
  };

  const handleDeleteScan = async (id: string) => {
    await api.deleteScan(id);
    setScans((prev) => prev.filter((s) => s.id !== id));
    api.getStats().then(setStats);
  };

  const handleRescanTarget = (target: string, type: 'url' | 'email') => {
    if (type === 'url') {
      setActiveUrlScanTarget(target);
      setCurrentTab('url-scanner');
    } else {
      setCurrentTab('email-analyzer');
    }
  };

  const handleInspectThreatIoC = (ioc: string) => {
    setActiveUrlScanTarget(ioc);
    setCurrentTab('url-scanner');
  };

  const handleLogout = () => {
    authStorage.clear();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Light Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute top-1/3 -right-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Intro Sonar Sequence Overlay */}
      <AnimatePresence>
        {showIntro && <IntroSequence onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Main App Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onReplayIntro={handleReplayIntro}
        onOpenHelplines={() => setIsHelplinesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 relative z-10 space-y-6 sm:space-y-8">
        {/* Quick Hero Banner on Dashboard Tab */}
        {currentTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel-elevated p-5 sm:p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl"
          >
            <div className="max-w-3xl space-y-3.5 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-[11px] sm:text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SENTINEL TELEMETRY ACTIVE</span>
                </div>
                <button
                  onClick={() => setIsHelplinesOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] sm:text-xs font-mono hover:bg-emerald-900/60 transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>1930 / Official Helplines</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display leading-tight">
                Automated Phishing & Fraud Detection Engine
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                Multi-layer protection combining deep heuristic signature scanning, IDN homograph punycode validation, brand impersonation detection, and Gemini AI forensic threat intelligence.
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-2">
                <button
                  id="btn-hero-scan-url"
                  onClick={() => setCurrentTab('url-scanner')}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer shrink-0"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>Scan Suspicious Link</span>
                </button>

                <button
                  id="btn-hero-scan-email"
                  onClick={() => setCurrentTab('email-analyzer')}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer shrink-0"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Analyze Message / Email</span>
                </button>

                <button
                  id="btn-hero-take-quiz"
                  onClick={() => setCurrentTab('education')}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 transition-all cursor-pointer shrink-0"
                >
                  <HeartHandshake className="w-4 h-4 shrink-0" />
                  <span>Safety Academy (Plain English)</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dynamic Views by Tab */}
        <AnimatePresence mode="wait">
          {currentTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Global Stats Overview */}
              <StatsOverview stats={stats} />

              {/* Embedded Quick Scanner */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2">
                    <Search className="w-4 h-4 text-cyan-400" />
                    <span>Quick Link Inspection</span>
                  </h3>
                </div>
                <UrlScanner onScanComplete={handleScanCompleted} initialTarget={activeUrlScanTarget} />
              </div>

              {/* Recent Scans History Log */}
              <RecentScans
                scans={scans}
                onDeleteScan={handleDeleteScan}
                onSelectScanForReview={(scan) => {
                  if (scan.type === 'url') {
                    setCurrentTab('url-scanner');
                  } else {
                    setCurrentTab('email-analyzer');
                  }
                }}
                onRescanTarget={handleRescanTarget}
              />
            </motion.div>
          )}

          {currentTab === 'url-scanner' && (
            <motion.div
              key="url-scanner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <UrlScanner onScanComplete={handleScanCompleted} initialTarget={activeUrlScanTarget} />
              <RecentScans
                scans={scans.filter((s) => s.type === 'url')}
                onDeleteScan={handleDeleteScan}
                onSelectScanForReview={() => {}}
                onRescanTarget={handleRescanTarget}
              />
            </motion.div>
          )}

          {currentTab === 'email-analyzer' && (
            <motion.div
              key="email-analyzer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <EmailAnalyzer onScanComplete={handleScanCompleted} />
              <RecentScans
                scans={scans.filter((s) => s.type === 'email')}
                onDeleteScan={handleDeleteScan}
                onSelectScanForReview={() => {}}
                onRescanTarget={handleRescanTarget}
              />
            </motion.div>
          )}

          {currentTab === 'threat-feed' && (
            <motion.div
              key="threat-feed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <LiveThreatFeed threats={threatFeed} onInspectThreatIoC={handleInspectThreatIoC} />
            </motion.div>
          )}

          {currentTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ReportsSection
                reports={reports}
                onReportSubmitted={(newRep) => setReports((prev) => [newRep, ...prev])}
                onReportUpvoted={(updRep) =>
                  setReports((prev) => prev.map((r) => (r.id === updRep.id ? updRep : r)))
                }
              />
            </motion.div>
          )}

          {currentTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AwarenessHub onOpenHelplines={() => setIsHelplinesOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Analyst Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          setIsAuthOpen(false);
        }}
      />

      {/* Official Cyber Security Helplines & Numbers Modal */}
      <OfficialHelplinesModal
        isOpen={isHelplinesOpen}
        onClose={() => setIsHelplinesOpen(false)}
      />

      {/* Global Footer */}
      <Footer 
        onOpenEducation={() => setCurrentTab('education')}
        onOpenHelplines={() => setIsHelplinesOpen(true)}
      />
    </div>
  );
}
