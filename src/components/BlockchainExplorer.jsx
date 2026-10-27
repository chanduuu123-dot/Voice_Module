import React, { useState } from 'react';
import { Cpu, Layers, ExternalLink, Copy, Code, Check, Search, ShieldCheck, ArrowRight, Terminal } from 'lucide-react';

const SOLIDITY_SOURCE_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VoiceProofRegistry {
    enum Status { Unverified, Verified, Disputed, Revoked }

    struct VoiceProof {
        bytes32 audioHash;          // SHA-256 Audio Hash
        bytes32 pHash;              // Perceptual Audio Hash
        address creator;            // Wallet Address
        uint16 authenticityScore;   // AI Score (0-10000)
        uint64 timestamp;           // Block Timestamp
        string ipfsURI;             // Metadata URI
        string title;               // Audio Title
        Status status;              // Registration Status
        bytes signature;            // EIP-712 Signature
    }

    mapping(bytes32 => VoiceProof) public proofs;
    bytes32[] public registeredAudioHashes;

    event VoiceProofRegistered(
        bytes32 indexed audioHash,
        bytes32 indexed pHash,
        address indexed creator,
        uint16 authenticityScore,
        string title,
        string ipfsURI,
        uint64 timestamp
    );

    function registerVoiceProof(
        bytes32 _audioHash,
        bytes32 _pHash,
        uint16 _authenticityScore,
        string calldata _title,
        string calldata _ipfsURI,
        bytes calldata _signature
    ) external returns (bool) {
        require(_audioHash != bytes32(0), "Empty audio hash");
        require(proofs[_audioHash].timestamp == 0, "Already registered");

        proofs[_audioHash] = VoiceProof({
            audioHash: _audioHash,
            pHash: _pHash,
            creator: msg.sender,
            authenticityScore: _authenticityScore,
            timestamp: uint64(block.timestamp),
            ipfsURI: _ipfsURI,
            title: _title,
            status: Status.Verified,
            signature: _signature
        });

        registeredAudioHashes.push(_audioHash);
        emit VoiceProofRegistered(_audioHash, _pHash, msg.sender, _authenticityScore, _title, _ipfsURI, uint64(block.timestamp));
        return true;
    }
}`;

export default function BlockchainExplorer({ transactions, walletInfo, onNotify }) {
  const [viewTab, setViewTab] = useState('txs'); // 'txs' or 'code'
  const [searchTx, setSearchTx] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredTxs = transactions.filter(tx =>
    tx.txHash.toLowerCase().includes(searchTx.toLowerCase()) ||
    tx.title.toLowerCase().includes(searchTx.toLowerCase()) ||
    tx.from.toLowerCase().includes(searchTx.toLowerCase())
  );

  const copyCode = () => {
    navigator.clipboard.writeText(SOLIDITY_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify('Solidity Smart Contract copied to clipboard!', 'info');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Decentralized Ledger Explorer</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            EVM Block Explorer & <span className="text-emerald-400">Contract State</span>
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Real-time feed of smart contract events, on-chain audio attestations, and verifiable Solidity code.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewTab('txs')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              viewTab === 'txs' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Transactions ({transactions.length})</span>
          </button>
          <button
            onClick={() => setViewTab('code')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              viewTab === 'code' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Solidity Contract</span>
          </button>
        </div>
      </div>

      {viewTab === 'txs' ? (
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTx}
              onChange={(e) => setSearchTx(e.target.value)}
              placeholder="Search by Transaction Hash, Wallet Address, or Title..."
              className="w-full bg-transparent text-xs text-cyan-300 font-mono focus:outline-none"
            />
          </div>

          {/* Transactions List */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Recent VoiceProof EVM Transactions
            </h3>

            {filteredTxs.length > 0 ? (
              <div className="space-y-3">
                {filteredTxs.map((tx) => (
                  <div
                    key={tx.txHash}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/30 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold truncate">{tx.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            CONFIRMED
                          </span>
                        </div>
                        <div className="text-[11px] text-cyan-400 truncate mt-0.5">
                          Tx: {tx.txHash}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          From: {tx.from}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-slate-300 font-bold">Block #{tx.blockNumber}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Gas: {tx.gasUsed}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 font-mono text-xs">
                No matching EVM transactions found
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm text-white font-mono">VoiceProofRegistry.sol</span>
              <span className="text-xs text-slate-500 font-mono">(Solidity ^0.8.20)</span>
            </div>

            <button
              onClick={copyCode}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Code' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-96 select-all">
            {SOLIDITY_SOURCE_CODE}
          </pre>
        </div>
      )}

    </div>
  );
}
