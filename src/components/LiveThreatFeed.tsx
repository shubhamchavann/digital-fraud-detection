import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Radio, AlertOctagon, ShieldAlert, Zap, Globe, Sparkles, Filter, CheckCircle2, Flame } from 'lucide-react';
import { ThreatFeedItem } from '../types';

interface LiveThreatFeedProps {
  threats: ThreatFeedItem[];
  onInspectThreatIoC?: (ioc: string) => void;
}

export const LiveThreatFeed: React.FC<LiveThreatFeedProps> = ({ threats, onInspectThreatIoC }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredThreats = threats.filter(
    (t) => activeCategory === 'all' || t.category.toLowerCase() === activeCategory.toLowerCase()
  );

  const categories = ['all', 'Smishing', 'Brand Impersonation', 'Crypto Drainer', 'Quishing', 'Spear Phishing'];

  return (
    <div id="threat-feed-section" className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel-elevated p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>GLOBAL THREAT RADAR FEED</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-display">
              Active Phishing & Fraud Campaign Intelligence
            </h2>
            <p className="text-slate-400 text-sm">
              Real-time telemetry on active in-the-wild social engineering campaigns, brand lures, and malicious domain clusters.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-rose-500/20 text-xs font-mono text-rose-300 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>THREAT RADAR: HIGH ALERT</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-white/5">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Vector:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 border-white/5 hover:bg-white/5'
              }`}
            >
              {cat === 'all' ? 'All Active Vectors' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Threats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredThreats.map((threat) => {
          const isCritical = threat.severity === 'critical';

          return (
            <motion.div
              key={threat.id}
              whileHover={{ y: -2 }}
              className={`glass-panel p-6 rounded-3xl border transition-all space-y-4 ${
                isCritical ? 'border-rose-500/25 hover:border-rose-500/40' : 'border-amber-500/25 hover:border-amber-500/40'
              }`}
            >
              {/* Card top */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                      isCritical ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {threat.severity}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                      {threat.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Target: <strong className="text-white">{threat.targetBrand}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-display pt-1">
                    {threat.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-xl border border-rose-500/20 shrink-0">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{threat.activeCampaignCount} Lures</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {threat.description}
              </p>

              {/* IoCs list */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  Known Indicators of Compromise (IoCs):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {threat.indicators.map((ioc, i) => (
                    <button
                      key={i}
                      onClick={() => onInspectThreatIoC && onInspectThreatIoC(ioc)}
                      title="Click to paste into Link/Text Scanner"
                      className="px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/30 text-cyan-300 text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      {ioc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Countermeasure tip */}
              <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-xs text-emerald-300/90 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Defense Protocol:</strong> {threat.preventionTip}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
