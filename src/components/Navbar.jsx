import React, { useState } from 'react';
import { ShieldCheck, Mic, FileCheck2, UserCheck, Cpu, Wallet, Activity, CheckCircle2, ChevronRight, Lock, Sparkles, Palette } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, walletInfo, onConnectWallet, currentTheme, onSelectTheme, availableThemes }) {
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('plan')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center transition group-hover:bg-opacity-50">
              <ShieldCheck className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400 font-sans">
                Voice<span className="text-cyan-400">Proof</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full">
                AI + Web3
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              AI Voice Authenticity & Blockchain Provenance Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Responsive Scrollable Bar */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-medium overflow-x-auto max-w-full py-1.5 px-2 scrollbar-none shadow-inner">
          <button
            onClick={() => setActiveTab('plan')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'plan'
                ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 text-cyan-300 border border-cyan-400 shadow-sm shadow-cyan-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Mini-Project Plan</span>
            <span className="px-1.5 py-0.5 text-[9px] bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/40 uppercase font-mono">
              Sepolia
            </span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mic className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Voice Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'verify'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Verify Audio</span>
          </button>

          <button
            onClick={() => setActiveTab('identity')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'identity'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Speaker Passports</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'explorer'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>EVM Explorer</span>
          </button>
        </nav>

        {/* Right Utility: Theme Switcher, Network Badge & Web3 Wallet Connect */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Background Theme Switcher */}
          {availableThemes && onSelectTheme && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowThemeMenu(!showThemeMenu);
                  setShowNetworkMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/60 text-xs font-mono text-slate-300 hover:border-cyan-500/50 transition shadow-sm"
                title="Change background color theme"
              >
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: currentTheme?.colorHex || '#030712' }}
                ></span>
                <span className="hidden lg:inline">{currentTheme?.name || 'Theme'}</span>
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-56 p-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 text-xs animate-fadeIn">
                  <div className="text-slate-400 font-semibold mb-2 flex items-center justify-between text-[11px] font-mono border-b border-slate-800 pb-1.5">
                    <span>BACKGROUND COLOR</span>
                    <Palette className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="space-y-1">
                    {Object.values(availableThemes).map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          onSelectTheme(theme.id);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition text-left text-xs ${
                          currentTheme?.id === theme.id
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-inner"
                            style={{ backgroundColor: theme.colorHex }}
                          ></span>
                          <span>{theme.name}</span>
                        </div>
                        {currentTheme?.id === theme.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Network Indicator */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNetworkMenu(!showNetworkMenu);
                setShowThemeMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/60 text-xs font-mono text-slate-300 hover:border-slate-500 transition"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline">{walletInfo.networkName}</span>
              <span className="sm:hidden">EVM Testnet</span>
            </button>

            {showNetworkMenu && (
              <div className="absolute right-0 mt-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 text-xs">
                <div className="text-slate-400 font-semibold mb-2 flex items-center justify-between">
                  <span>ACTIVE EVM NETWORK</span>
                  <Lock className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="p-2 bg-slate-800/80 rounded-xl mb-2 flex items-center justify-between border border-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-200 font-medium">Simulated EVM Sandbox</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  In-memory EVM smart contract state enabled. Supports EIP-712 signatures & instant block confirmations.
                </p>
              </div>
            )}
          </div>

          {/* Wallet Button */}
          <button
            onClick={onConnectWallet}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Wallet className="w-4 h-4" />
            <span>
              {walletInfo.wallet
                ? `${walletInfo.wallet.substring(0, 6)}...${walletInfo.wallet.substring(walletInfo.wallet.length - 4)}`
                : 'Connect Wallet'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
