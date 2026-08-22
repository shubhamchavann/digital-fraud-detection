import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldAlert, ShieldCheck, Cpu, Radar, Terminal, ArrowRight, Zap } from 'lucide-react';

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  useEffect(() => {
    const logs = [
      'INITIALIZING PHISHGUARD CORE ENGINE v3.4...',
      'LOADING HEURISTIC THREAT SIGNATURES [OK]',
      'INITIALIZING IDN HOMOGRAPH & PUNYCODE DETECTOR [OK]',
      'ESTABLISHING LIVE THREAT RADAR MESH [ONLINE]',
      'PHISHGUARD SENTINEL READY.'
    ];

    logs.forEach((msg, idx) => {
      setTimeout(() => {
        setLogMessages(prev => [...prev, msg]);
      }, 400 * (idx + 1));
    });

    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1600);
    const t3 = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      id="intro-sequence"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712] overflow-hidden"
    >
      {/* Dynamic Background Glowing Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[90px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
        
        {/* Subtle Cyber Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Center Radar & Logo Container */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6 text-center">
        {/* Radar Sonar Rings */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          {/* Animated sonar rings */}
          <motion.div
            animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border border-cyan-400/40"
          />
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, delay: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border border-blue-500/30"
          />

          {/* Radar Scanner Beam */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 bg-slate-900/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_50px_-10px_rgba(6,182,212,0.4)]">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="w-full h-full animate-radar origin-center bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(6,182,212,0.4)_360deg)]" />
            </div>
            
            {/* Center Shield Icon */}
            <motion.div
              initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative z-10 p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.6)]"
            >
              <ShieldCheck className="w-12 h-12 text-white" />
            </motion.div>
          </div>
        </div>

        {/* Brand Name Assembling */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-2 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Threat Detection Grid
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white font-display">
            PHISH<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">GUARD</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-light">
            Real-Time Heuristic & AI Phishing Defense Engine
          </p>
        </motion.div>

        {/* Terminal Telemetry Stream */}
        <div className="w-full bg-slate-950/80 rounded-xl border border-white/10 p-3.5 text-left font-mono text-xs text-slate-300 backdrop-blur-md shadow-2xl h-24 overflow-hidden relative">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 text-slate-400 text-[10px]">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>CORE_BOOT_TELEMETRY</span>
            </div>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
          </div>
          <div className="space-y-1">
            {logMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 text-[11px] text-cyan-300/90 truncate"
              >
                <span className="text-slate-600">&gt;</span>
                {msg}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skip button */}
        <div className="mt-6">
          <button
            id="btn-skip-intro"
            onClick={onComplete}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
