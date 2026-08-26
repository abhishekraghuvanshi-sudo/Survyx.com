import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  History, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  X, 
  Clock, 
  Plus, 
  Check, 
  ExternalLink,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useUserJourney } from '../context/UserJourneyContext';
import { EscrowMilestone } from '../types';

export default function Vault() {
  const {
    state,
    releaseMilestone,
    signMilestone,
    raiseDispute,
    resolveDispute,
    depositFunds,
    resetEscrow,
    setCurrentView
  } = useUserJourney();

  const { totalSecuredVolume, milestones, dispute, transactions } = state;

  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Specification mismatch in dispatched batch #IN-991');
  const [depositAmount, setDepositAmount] = useState('2500000');
  const [depositLabel, setDepositLabel] = useState('RFQ-7731 (Solar Capacitors Contract)');

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    if (!isNaN(amountNum) && amountNum > 0) {
      depositFunds(amountNum, depositLabel);
      setShowDepositModal(false);
    }
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disputeReason.trim()) {
      raiseDispute(disputeReason);
      setShowDisputeModal(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-survyx-blue mb-1">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">NPCI-Regulated Vault</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Escrow Governance Vault</h2>
          <p className="text-slate-500 text-sm mt-0.5">Multi-signature milestone protection and algorithmic settlement layer.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowDepositModal(true)}
            className="bg-survyx-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
          >
            <Plus size={14} /> Deposit Escrow
          </button>
          <button 
            onClick={resetEscrow}
            className="p-2.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-xl transition-colors"
            title="Reset Vault Simulation"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* Dispute Alert Banner if Active */}
      <AnimatePresence>
        {dispute.isActive && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-red-800">
                    Trade Lock Active • Case #{dispute.caseId}
                  </span>
                  <span className="text-[9px] font-bold uppercase bg-red-200 text-red-800 px-2 py-0.5 rounded">
                    Under Mediation
                  </span>
                </div>
                <p className="text-xs text-red-700 font-medium mt-1">
                  Reason: "{dispute.reason}". Active milestones are frozen pending Officer Arya Sharma's mediation verdict.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setCurrentView('chat')}
                className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all"
              >
                Chat with Officer
              </button>
              <button 
                onClick={resolveDispute}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md transition-all"
              >
                Resolve & Unfreeze
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Balance Card */}
      <div className="registry-card bg-survyx-navy p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
           <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-blue-300" />
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest leading-none">Secured Trade Volume</span>
           </div>
           <h3 className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tighter">
             ₹{totalSecuredVolume.toLocaleString('en-IN')}.00
           </h3>
           <p className="mt-4 text-xs text-slate-400 max-w-md leading-relaxed">
             Institutional funds held in trust under Escrow Account #SVX-NPCI-00918, protected by SURVYX trade governance protocols.
           </p>
           <div className="mt-8 flex flex-wrap gap-4">
              <button 
                onClick={() => setShowAuditTrail(true)}
                className="bg-white/10 hover:bg-white/20 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest border border-white/20 transition-all flex items-center gap-2"
              >
                <History size={14} /> Audit Trail ({transactions.length})
              </button>
              {!dispute.isActive ? (
                <button 
                  onClick={() => setShowDisputeModal(true)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <AlertTriangle size={14} /> Raise Dispute
                </button>
              ) : (
                <button 
                  onClick={resolveDispute}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg"
                >
                  <Check size={14} /> Close Dispute
                </button>
              )}
           </div>
         </div>
         <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12 pointer-events-none">
            <Lock size={240} />
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="registry-card p-8 bg-white border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700 font-mono">Active Contract Milestones</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Contract: Solar Inverters Supply (RFQ-8822)</p>
              </div>
              <button 
                onClick={() => setShowAuditTrail(true)}
                className="text-xs font-bold text-survyx-blue flex items-center gap-1.5 hover:underline"
              >
                <History size={14} /> View History
              </button>
            </div>

            <div className="space-y-8">
               {milestones.map((m) => (
                 <MilestoneRow 
                   key={m.id} 
                   milestone={m}
                   onSign={() => signMilestone(m.id)}
                   onRelease={() => releaseMilestone(m.id)}
                   isDisputed={dispute.isActive && m.status === 'Disputed'}
                 />
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="registry-card p-6 border border-slate-100 bg-slate-50/50 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Multi-Signature Protocol</h4>
              <ul className="space-y-3.5">
                 <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-survyx-blue mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Buyer & Supplier dual-signatures required for milestone release.
                    </p>
                 </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-survyx-blue mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Instant trade-lock trigger on defect notice freezes capital instantly.
                    </p>
                 </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-survyx-blue mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Registry Officer mediation is legally binding under Indian Arbitration Act.
                    </p>
                 </li>
              </ul>
           </div>

           <div className="registry-card p-6 bg-survyx-navy text-white relative overflow-hidden">
              <h4 className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-3">Settlement Route</h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Settlements are powered by Real-Time Gross Settlement (RTGS) / NPCI Instant APIs with instant e-Sign invoice dispatch.
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span>UTR Latency: &lt; 30s</span>
                <span className="text-green-400 font-mono font-bold">● 100% HEALTH</span>
              </div>
           </div>
        </div>
      </div>

      {/* Audit Trail Modal */}
      <AnimatePresence>
        {showAuditTrail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Escrow Audit Trail</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Immutable transaction log recorded on SURVYX ledger</p>
                </div>
                <button 
                  onClick={() => setShowAuditTrail(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                {transactions.map((txn) => (
                  <div key={txn.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          txn.type === 'Deposit' ? 'bg-green-100 text-green-700' :
                          txn.type === 'Release' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {txn.type}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{txn.title}</span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 mt-1">
                        Ref: {txn.referenceId} • {txn.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black font-mono ${
                        txn.type === 'Deposit' ? 'text-green-600' :
                        txn.type === 'Release' ? 'text-slate-900' :
                        'text-red-600'
                      }`}>
                        {txn.amount}
                      </p>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{txn.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Verified by NPCI Escrow Route • 256-Bit Cryptographic Signatures
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Raise Dispute Modal */}
      <AnimatePresence>
        {showDisputeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertTriangle size={22} />
                  <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Raise Escrow Dispute</h3>
                </div>
                <button onClick={() => setShowDisputeModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Raising a dispute triggers an immediate algorithmic freeze on active escrow milestones. Officer Priya Krishnamurthy will initiate mediation proceedings within 2 hours.
              </p>

              <form onSubmit={handleDisputeSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                    Dispute Reason / Defect Detail
                  </label>
                  <textarea 
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none"
                    placeholder="Describe the discrepancy in material, quantity, or delivery..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowDisputeModal(false)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-900/30"
                  >
                    Trigger Freeze
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deposit Escrow Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-survyx-blue">
                  <ShieldCheck size={22} />
                  <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Deposit Escrow Funds</h3>
                </div>
                <button onClick={() => setShowDepositModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                    Deposit Amount (INR)
                  </label>
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-base font-black font-mono text-slate-800 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:outline-none"
                    placeholder="e.g. 2500000"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                    Contract / RFQ Label
                  </label>
                  <input 
                    type="text"
                    value={depositLabel}
                    onChange={(e) => setDepositLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:outline-none"
                    placeholder="e.g. Solar Capacitors Supply Contract"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowDepositModal(false)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-survyx-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-900/30"
                  >
                    Lock in Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MilestoneRow({ 
  milestone, 
  onSign, 
  onRelease, 
  isDisputed 
}: { 
  key?: React.Key;
  milestone: EscrowMilestone; 
  onSign: () => void; 
  onRelease: () => void; 
  isDisputed: boolean;
}) {
  const { completed, active, status, label, amount, formattedAmount, date, signaturesApproved, signaturesRequired } = milestone;

  return (
    <div className="relative pl-12">
       <div className={`absolute left-0 top-0 w-8 h-8 rounded-2xl border-4 border-white shadow-sm flex items-center justify-center transition-all ${
         completed ? 'bg-green-500' : 
         isDisputed ? 'bg-red-500 animate-pulse' :
         active ? 'bg-survyx-blue animate-pulse' : 
         'bg-slate-200'
       }`}>
          {completed && <CheckCircle2 size={14} className="text-white" />}
          {isDisputed && <AlertTriangle size={14} className="text-white" />}
          {!completed && !isDisputed && !active && <Lock size={12} className="text-slate-400" />}
          {active && !isDisputed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
       </div>

       {status !== 'Locked' && (
         <div className="absolute left-4 top-8 w-0.5 h-14 bg-slate-100" />
       )}

       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <p className={`text-sm font-bold ${active ? 'text-survyx-blue' : completed ? 'text-slate-900' : 'text-slate-400'}`}>
                {label}
              </p>
              {isDisputed && (
                <span className="text-[8px] font-black uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  Trade Frozen
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-mono font-bold uppercase mt-0.5 tracking-widest">
              {completed ? `Settled: ${date}` : `Status: ${status}`}
            </p>
            {milestone.description && (
              <p className="text-xs text-slate-500 mt-1 max-w-md font-medium">
                {milestone.description}
              </p>
            )}
            
            {/* Multi-sig progress */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Dual-Signatures:</span>
              <div className="flex gap-1">
                {[...Array(signaturesRequired)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center ${
                      i < signaturesApproved ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {i < signaturesApproved ? '✓' : ''}
                  </div>
                ))}
              </div>
              <span className="text-[9px] font-mono text-slate-500">
                ({signaturesApproved}/{signaturesRequired} Approved)
              </span>
            </div>
          </div>

          <div className="sm:text-right shrink-0 flex flex-col sm:items-end gap-2">
             <div>
               <p className={`text-base font-black font-mono ${completed ? 'text-slate-900' : 'text-slate-500'}`}>{formattedAmount}</p>
               <p className={`text-[9px] font-black uppercase tracking-widest ${
                 completed ? 'text-green-600' : 
                 isDisputed ? 'text-red-600' :
                 active ? 'text-survyx-blue' : 
                 'text-slate-300'
               }`}>
                 {isDisputed ? 'Disputed' : status}
               </p>
             </div>

             {active && !isDisputed && (
               <div className="flex items-center gap-2">
                 {signaturesApproved < signaturesRequired && (
                   <button 
                     onClick={onSign}
                     className="px-3 py-1.5 bg-white border border-slate-200 hover:border-survyx-blue text-slate-700 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm"
                   >
                     + Dual Sign
                   </button>
                 )}
                 <button 
                   onClick={onRelease}
                   className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm transition-all flex items-center gap-1"
                 >
                   <Check size={12} /> Release Funds
                 </button>
               </div>
             )}
          </div>
       </div>
    </div>
  );
}
