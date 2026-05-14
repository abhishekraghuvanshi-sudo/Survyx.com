import React from 'react';
import { motion } from 'motion/react';
import { Lock, CheckCircle2, ShieldCheck, ArrowRight, History } from 'lucide-react';

export default function Vault() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Escrow Governance</h2>
          <p className="text-slate-500 mt-1">Multi-signature milestone protection and settlement vault.</p>
        </div>
      </header>

      <div className="registry-card bg-survyx-navy p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
           <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-blue-300" />
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest leading-none">Secured Trade Volume</span>
           </div>
           <h3 className="text-5xl font-extrabold font-mono tracking-tighter">₹12,420,500.00</h3>
           <p className="mt-4 text-xs text-slate-400 max-w-md">Institutional funds held in trust, protected by SURVYX trade governance protocols and NPCI-compliant security layers.</p>
           <div className="mt-10 flex flex-wrap gap-4">
              <button className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border border-white/20 transition-all">Audit Trail</button>
              <button className="bg-survyx-blue hover:bg-blue-600 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-900/50 transition-all flex items-center gap-2">Raise Dispute <ArrowRight size={14} /></button>
           </div>
         </div>
         <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12">
            <Lock size={240} />
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="registry-card p-8 bg-white border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 font-mono">Active Milestones</h3>
              <History size={16} className="text-slate-300" />
            </div>
            <div className="space-y-8">
               <Milestone label="Material Intake (30%)" amount="₹4,20,000" status="Released" date="12 May 2024" completed />
               <Milestone label="Logistics Verification (40%)" amount="₹5,60,000" status="In Transit Audit" date="Pending" active />
               <Milestone label="Final Handover (30%)" amount="₹4,20,000" status="Locked" date="Pending" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="registry-card p-6 border border-slate-100 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Security Protocol</h4>
              <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-survyx-blue mt-0.5" />
                    <p className="text-[11px] text-slate-600 font-medium">Multi-sig validation required for all releases.</p>
                 </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-survyx-blue mt-0.5" />
                    <p className="text-[11px] text-slate-600 font-medium">Automated trade-lock upon dispute trigger.</p>
                 </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-survyx-blue mt-0.5" />
                    <p className="text-[11px] text-slate-600 font-medium">Registry Officer mediation binding.</p>
                 </li>
              </ul>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function Milestone({ label, amount, status, date, completed, active }: any) {
  return (
    <div className="relative pl-12">
       <div className={`absolute left-0 top-0 w-8 h-8 rounded-2xl border-4 border-white shadow-sm flex items-center justify-center transition-all ${completed ? 'bg-green-500' : active ? 'bg-survyx-blue animate-pulse' : 'bg-slate-200'}`}>
          {completed && <CheckCircle2 size={14} className="text-white" />}
          {!completed && !active && <Lock size={12} className="text-slate-400" />}
          {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
       </div>
       {status !== 'Locked' && (
         <div className="absolute left-4 top-8 w-0.5 h-8 bg-slate-100" />
       )}
       <div className="flex justify-between items-start">
          <div>
            <p className={`text-md font-bold ${active ? 'text-survyx-blue' : completed ? 'text-slate-900' : 'text-slate-400'}`}>{label}</p>
            <p className="text-[10px] text-slate-400 font-mono font-bold uppercase mt-1 tracking-widest">
              {date !== 'Pending' ? `Validated: ${date}` : status}
            </p>
          </div>
          <div className="text-right">
             <p className={`text-sm font-bold ${completed ? 'text-slate-900' : 'text-slate-400'}`}>{amount}</p>
             <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${completed ? 'text-green-600' : active ? 'text-survyx-blue' : 'text-slate-300'}`}>{status}</p>
          </div>
       </div>
    </div>
  );
}
