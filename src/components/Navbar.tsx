import React from 'react';
import { 
  ShieldCheck, Radar, Search, Mail, Radio, Flag, 
  BookOpen, User as UserIcon, LogOut, RefreshCw, 
  PhoneCall 
} from 'lucide-react';
import { User } from '../types';

export type NavTab = 'dashboard' | 'url-scanner' | 'email-analyzer' | 'threat-feed' | 'reports' | 'education';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onReplayIntro: () => void;
  onOpenHelplines: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenAuth,
  onLogout,
  onReplayIntro,
  onOpenHelplines,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-18">
          {/* Logo & Live Pulse */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              id="nav-brand-logo"
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
            >
              <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all shrink-0">
                <div className="w-full h-full bg-slate-950/80 rounded-[10px] flex items-center justify-center backdrop-blur-xs">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#030712] animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white">
                    PHISH<span className="text-cyan-400">GUARD</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                    v3.4
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>GRID: ONLINE</span>
                </div>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs (Desktop only) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            <button
              id="nav-tab-dashboard"
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Radar className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-tab-url-scanner"
              onClick={() => onSelectTab('url-scanner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'url-scanner'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Link Scanner</span>
            </button>

            <button
              id="nav-tab-email-analyzer"
              onClick={() => onSelectTab('email-analyzer')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'email-analyzer'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email / Text Forensics</span>
            </button>

            <button
              id="nav-tab-threat-feed"
              onClick={() => onSelectTab('threat-feed')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'threat-feed'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Live Threat Radar</span>
            </button>

            <button
              id="nav-tab-reports"
              onClick={() => onSelectTab('reports')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'reports'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>Report Scam</span>
            </button>

            <button
              id="nav-tab-education"
              onClick={() => onSelectTab('education')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'education'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Academy (Simple)</span>
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Helplines Button */}
            <button
              id="nav-btn-helplines"
              onClick={onOpenHelplines}
              title="Official Emergency Cyber Helplines & Numbers"
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/30 transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.15)]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-bounce" />
              <span className="font-mono">1930 <span className="hidden md:inline">/ Helplines</span></span>
            </button>

            {/* Replay Intro */}
            <button
              id="nav-btn-replay-intro"
              onClick={onReplayIntro}
              title="Replay Scanner Radar Sequence"
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-white/10">
                <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-cyan-500/20">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-white truncate max-w-[100px]">{user.name}</p>
                  </div>
                </div>
                <button
                  id="nav-btn-logout"
                  onClick={onLogout}
                  title="Log out"
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-btn-login"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Analyst Portal</span>
                <span className="sm:hidden">Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar (Horizontally scrollable with clean spacing) */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-white/5 scrollbar-none">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all ${
              currentTab === 'dashboard' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radar className="w-3.5 h-3.5 shrink-0" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onSelectTab('url-scanner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all ${
              currentTab === 'url-scanner' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span>Link Scanner</span>
          </button>

          <button
            onClick={() => onSelectTab('email-analyzer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all ${
              currentTab === 'email-analyzer' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span>Email / SMS</span>
          </button>

          <button
            onClick={() => onSelectTab('education')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all ${
              currentTab === 'education' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Academy (Simple)</span>
          </button>

          <button
            onClick={() => onSelectTab('threat-feed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all ${
              currentTab === 'threat-feed' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span>Live Radar</span>
          </button>

          <button
            onClick={() => onSelectTab('reports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all ${
              currentTab === 'reports' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5 shrink-0" />
            <span>Report Scam</span>
          </button>
        </div>
      </div>
    </header>
  );
};
