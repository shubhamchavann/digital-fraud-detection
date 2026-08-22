import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity, TrendingUp, Zap, Radio, Globe } from 'lucide-react';
import { GlobalStats } from '../types';

interface StatsOverviewProps {
  stats: GlobalStats | null;
  onRefresh?: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  if (!stats) return null;

  const total = stats.totalScans || 1;
  const threatPercent = Math.round((stats.threatsBlocked / total) * 100);
  const suspiciousPercent = Math.round((stats.suspiciousDetected / total) * 100);
  const safePercent = Math.round((stats.safeCleared / total) * 100);

  return (
    <div id="stats-overview-section" className="space-y-4">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Scans */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel p-5 rounded-3xl border border-white/10 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400">Total Scans</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-white font-display">
              {stats.totalScans}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+{stats.todayScansCount} processed today</span>
            </div>
          </div>
        </motion.div>

        {/* Threats Blocked */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel p-5 rounded-3xl border border-rose-500/20 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400">Threats Blocked</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-rose-400 font-display">
              {stats.threatsBlocked}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {threatPercent}% critical severity
            </p>
          </div>
        </motion.div>

        {/* Suspicious Detected */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel p-5 rounded-3xl border border-amber-500/20 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400">Suspicious Links</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-amber-400 font-display">
              {stats.suspiciousDetected}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {suspiciousPercent}% caution flagged
            </p>
          </div>
        </motion.div>

        {/* Detection Accuracy */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel p-5 rounded-3xl border border-emerald-500/20 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400">Engine Accuracy</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-emerald-400 font-display">
              {stats.accuracyRate}%
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Heuristic + AI Forensics
            </p>
          </div>
        </motion.div>
      </div>

      {/* Threat Distribution Bar & Mini Timeline */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-white uppercase font-mono">Live Threat Ratio Distribution</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Dangerous ({threatPercent}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Suspicious ({suspiciousPercent}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Clean ({safePercent}%)
            </span>
          </div>
        </div>

        {/* Proportion Bar */}
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-white/5 p-0.5">
          <div
            style={{ width: `${Math.max(threatPercent, 4)}%` }}
            className="h-full bg-rose-500 rounded-l-full transition-all"
            title={`Dangerous: ${stats.threatsBlocked}`}
          />
          <div
            style={{ width: `${Math.max(suspiciousPercent, 4)}%` }}
            className="h-full bg-amber-500 transition-all"
            title={`Suspicious: ${stats.suspiciousDetected}`}
          />
          <div
            style={{ width: `${Math.max(safePercent, 4)}%` }}
            className="h-full bg-emerald-500 rounded-r-full transition-all"
            title={`Safe: ${stats.safeCleared}`}
          />
        </div>
      </div>
    </div>
  );
};
