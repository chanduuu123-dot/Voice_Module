import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SepoliaPlanInterface from './components/SepoliaPlanInterface';
import VoiceStudio from './components/VoiceStudio';
import VerificationPortal from './components/VerificationPortal';
import VoiceIdentityRegistry from './components/VoiceIdentityRegistry';
import BlockchainExplorer from './components/BlockchainExplorer';
import NotificationToast from './components/NotificationToast';
import { blockchainService } from './utils/blockchain';

const THEMES = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Midnight',
    colorHex: '#030712',
    bgClass: 'bg-[#030712]',
    ambientGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6, 182, 212, 0.15), rgba(3, 7, 18, 0))'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Navy',
    colorHex: '#090d16',
    bgClass: 'bg-[#090d16]',
    ambientGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.18), rgba(9, 13, 22, 0))'
  },
  space: {
    id: 'space',
    name: 'Deep Space',
    colorHex: '#020408',
    bgClass: 'bg-[#020408]',
    ambientGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20, 184, 166, 0.15), rgba(2, 4, 8, 0))'
  },
  slate: {
    id: 'slate',
    name: 'Slate Charcoal',
    colorHex: '#0f172a',
    bgClass: 'bg-[#0f172a]',
    ambientGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), rgba(15, 23, 42, 0))'
  },
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst Violet',
    colorHex: '#0e0720',
    bgClass: 'bg-[#0e0720]',
    ambientGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168, 85, 247, 0.18), rgba(14, 7, 32, 0))'
  },
  light: {
    id: 'light',
    name: 'Clean Light',
    colorHex: '#f1f5f9',
    bgClass: 'bg-[#f1f5f9]',
    ambientGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.12), rgba(241, 245, 249, 0))'
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('plan');
  const [notification, setNotification] = useState(null);
  const [currentThemeId, setCurrentThemeId] = useState('obsidian');
  const currentTheme = THEMES[currentThemeId] || THEMES.obsidian;
  
  // Blockchain State
  const [walletInfo, setWalletInfo] = useState({
    connected: true,
    wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    useSimulated: true,
    networkName: 'VoiceProof EVM Testnet (Simulated)'
  });

  const [stats, setStats] = useState({
    totalRegistered: 3,
    deepfakesDetected: 43,
    verifiedSpeakers: 3,
    latestBlock: 19842100
  });

  const [transactions, setTransactions] = useState([]);
  const [speakerProfiles, setSpeakerProfiles] = useState([]);

  // Load state on mount
  useEffect(() => {
    refreshBlockchainData();
  }, []);

  const refreshBlockchainData = () => {
    const currentStats = blockchainService.getGlobalStats();
    const currentTxs = blockchainService.getTransactions();
    const currentSpeakers = blockchainService.getSpeakerProfiles();

    setStats(currentStats);
    setTransactions(currentTxs);
    setSpeakerProfiles(currentSpeakers);
  };

  const notify = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Connect Web3 Wallet
  const handleConnectWallet = async () => {
    try {
      const res = await blockchainService.connectWallet();
      setWalletInfo(res);
      notify(`Connected Wallet: ${res.wallet.substring(0, 6)}...${res.wallet.substring(res.wallet.length - 4)}`, 'success');
    } catch (err) {
      notify('Failed to connect wallet.', 'error');
    }
  };

  // Register Proof Handler
  const handleRegisterProof = async (proofData) => {
    const res = await blockchainService.registerVoiceProofOnChain(proofData);
    refreshBlockchainData();
    return res;
  };

  // Verify Hash Handler
  const handleVerifyHash = async (audioHash) => {
    return await blockchainService.getVoiceProof(audioHash);
  };

  // Register Speaker Passport Handler
  const handleRegisterSpeakerProfile = async (profileData) => {
    const res = await blockchainService.registerSpeakerProfile(profileData);
    refreshBlockchainData();
    return res;
  };

  return (
    <div
      className="min-h-screen text-slate-100 font-sans selection:bg-cyan-500 selection:text-black transition-colors duration-300 relative"
      style={{
        backgroundColor: currentTheme.colorHex,
        backgroundImage: currentTheme.ambientGlow
      }}
    >
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        walletInfo={walletInfo}
        onConnectWallet={handleConnectWallet}
        currentTheme={currentTheme}
        onSelectTheme={(themeId) => {
          setCurrentThemeId(themeId);
          notify(`Theme switched to ${THEMES[themeId]?.name}`, 'info');
        }}
        availableThemes={THEMES}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Dynamic Tab Content */}
        {activeTab === 'plan' && (
          <SepoliaPlanInterface
            onNotify={notify}
            walletInfo={walletInfo}
          />
        )}

        {activeTab === 'studio' && (
          <VoiceStudio
            onRegisterProof={handleRegisterProof}
            onNotify={notify}
            walletInfo={walletInfo}
          />
        )}

        {activeTab === 'verify' && (
          <VerificationPortal
            onVerifyHash={handleVerifyHash}
            onNotify={notify}
          />
        )}

        {activeTab === 'identity' && (
          <VoiceIdentityRegistry
            speakerProfiles={speakerProfiles}
            onRegisterProfile={handleRegisterSpeakerProfile}
            onNotify={notify}
            walletInfo={walletInfo}
          />
        )}

        {activeTab === 'explorer' && (
          <BlockchainExplorer
            transactions={transactions}
            walletInfo={walletInfo}
            onNotify={notify}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-black/40 backdrop-blur-md py-8 px-4 mt-16 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>VoiceProof Protocol v2.4 • Smart Contract EVM Verified</span>
          </div>
          <div>
            Built with React, Web Audio DSP, Ethers.js & Solidity
          </div>
        </div>
      </footer>

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />

    </div>
  );
}
