import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Plus, CheckCircle2, Building, Fingerprint, Calendar, Award, ExternalLink, Lock } from 'lucide-react';

export default function VoiceIdentityRegistry({ speakerProfiles, onRegisterProfile, onNotify, walletInfo }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !organization) {
      onNotify('Please fill in all identity fields.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await onRegisterProfile({ name, organization });
      setIsSubmitting(false);
      setShowModal(false);
      setName('');
      setOrganization('');
      onNotify('Speaker Passport Registered On-Chain Successfully!', 'success');
    } catch (err) {
      console.error('Profile registration error:', err);
      setIsSubmitting(false);
      onNotify('Failed to register identity profile.', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Verified Speaker Passports</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Voice Identity & <span className="text-purple-400">Speaker Registry</span>
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Anchors biometric voice embeddings and wallet credentials to protect journalists, public figures, and voice artists against unauthorized AI voice cloning.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Speaker Passport</span>
        </button>
      </div>

      {/* Grid of Registered Speaker Passports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {speakerProfiles.map((speaker, idx) => (
          <div
            key={speaker.wallet || idx}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all backdrop-blur-xl shadow-xl flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                {speaker.isVerified && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>VERIFIED IDENTITY</span>
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                {speaker.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 mb-4">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{speaker.organization}</span>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Registered Wallet</span>
                  <span className="text-cyan-300 text-[11px] truncate block">
                    {speaker.wallet}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">Voice Embedding Vector Hash</span>
                  <span className="text-purple-300 text-[10px] truncate block">
                    {speaker.voiceEmbeddingHash}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{speaker.registeredAt || '2026-08-15'}</span>
              </div>
              <div className="text-cyan-400 font-bold">
                {speaker.totalAudioMinted || 1} Proofs Minted
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form for Speaker Identity Registration */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-400" />
                <span>Create Speaker Passport</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Anchors your official speaker identity and voice embedding hash on the EVM VoiceProofRegistry contract.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Full Legal / Professional Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Elena Rostova"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Organization / Media Entity</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Global Quantum Dynamics"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Connected Wallet Address</label>
                <input
                  type="text"
                  value={walletInfo.wallet || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono opacity-80"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Registering On-Chain...' : 'Confirm & Register Speaker Passport'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
