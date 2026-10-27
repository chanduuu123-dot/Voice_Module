import React from 'react';
import { ShieldCheck, AlertTriangle, Users, Layers, Zap, Sparkles } from 'lucide-react';

export default function HeroStats({ stats }) {
  return (
    <div className="relative overflow-hidden mb-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 border border-cyan-500/20 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
      {/* Dynamic background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cryptographic Audio Provenance Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Verify AI Voice Authenticity with <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">Blockchain Integrity</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Defend journalism, legal proceedings, and executive media against deepfake impersonations. VoiceProof extracts acoustic spectrogram features, calculates perceptual audio hashes, and anchors cryptographic EIP-712 signatures directly onto the EVM.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 font-mono">
            <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>DSP Spectrogram Engine: <strong className="text-cyan-300 font-semibold">Active</strong></span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Audio Records Minted</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {stats.totalRegistered || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">EVM Provenance Passports</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Deepfakes Intercepted</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
            {stats.deepfakesDetected || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Synthetic TTS Clones Flagged</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Speaker Passports</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {stats.verifiedSpeakers || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Verified Identity Embeddings</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Block Height</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            #{stats.latestBlock || 19842100}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Confirmed EVM Blocks</p>
        </div>

      </div>
    </div>
  );
}
