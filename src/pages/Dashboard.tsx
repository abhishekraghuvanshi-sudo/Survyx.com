import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Globe, 
  Gavel, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight,
  Plus,
  Search,
  MessageSquare,
  Activity,
  Zap,
  Lock,
  ArrowRight,
  Briefcase,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  setView: (v: any) => void;
  euid: string;
  mode: 'consumer' | 'provider';
  key?: React.Key;
}

export default function Dashboard({ setView, euid, mode }: DashboardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">
            Welcome, <span className="text-survyx-blue">Abhishek</span>
          </h2>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-survyx-navy text-white text-[8px] font-black uppercase rounded">
             {mode === 'consumer' ? 'Procurement Lead' : 'Service Provider'}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network Status:</span>
             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest">Connected</span>
             </div>
          </div>
          <button className="text-slate-400 hover:text-survyx-navy transition-colors">
            <Activity size={18} />
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
             <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Compliance Action Required</p>
            <p className="text-[10px] text-amber-700 font-medium tracking-tight">Your Institutional Status is currently "Limited". Complete Registry Verification to unlock full trade volume.</p>
          </div>
        </div>
        <button 
          onClick={() => setView('verification')}
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-lg shadow-amber-200 flex items-center gap-2"
        >
           Start Verification <ArrowRight size={14} />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mode === 'consumer' ? (
          <>
            <StatCard label="OPEN REQS" value="4" sub="AWAITING CONCIERGE" icon={<Briefcase size={14} className="text-blue-400 opacity-20" />} />
            <StatCard label="IN ESCROW" value="₹84L" sub="3 SECURE DEPOSITS" icon={<ShieldCheck size={14} className="text-blue-400 opacity-20" />} />
            <StatCard label="BIDS REVIEW" value="12" sub="PENDING SIGN-OFF" icon={<MessageSquare size={14} className="text-blue-400 opacity-20" />} />
            <StatCard label="SAVED" value="₹2.4L" sub="OPTIMIZATION REBATE" icon={<TrendingUp size={14} className="text-green-400 opacity-20" />} />
          </>
        ) : (
          <>
            <StatCard label="PIPELINE" value="₹1.2Cr" sub="POTENTIAL GMV" icon={<TrendingUp size={14} className="text-blue-400 opacity-20" />} />
            <StatCard label="LEADS" value="08" sub="CONCIERGE ASSIGNED" icon={<Zap size={14} className="text-yellow-400 opacity-20" />} />
            <StatCard label="QUALIFIED" value="98%" sub="TRUST RATING" icon={<ShieldCheck size={14} className="text-blue-400 opacity-20" />} />
            <StatCard label="EARNINGS" value="₹14.2L" sub="SETTLED THIS MONTH" icon={<Activity size={14} className="text-green-400 opacity-20" />} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Hub Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {mode === 'consumer' ? (
            /* Requirement Punching Form - From Image 7 & 1 */
            <div className="registry-card bg-white border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Requirement Punching Form</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Submit your trade necessity for institutional vetting</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-survyx-blue border border-blue-100 rounded-lg text-[9px] font-black uppercase">
                     Expert Guidance Active
                  </div>
               </div>
               <div className="p-8 space-y-6">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">What do you actually want / Problem Statement (PS)?</label>
                    <textarea 
                      placeholder="e.g., We need to source 500 units of Tier-1 solar inverters with 10-year warranty sync..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-survyx-blue/10 outline-none h-32 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Industry Type & Category</label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-700">
                         <option>Renewable Energy Infrastructure</option>
                         <option>Automotive & EV Supply</option>
                         <option>Heavy Manufacturing</option>
                         <option>Consumer Electronics (B2B)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Budgetary Intent / BOM Estimated</label>
                      <input 
                        type="text" 
                        placeholder="e.g., ₹25,00,000 - ₹40,00,000"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <button className="flex-1 w-full bg-survyx-navy text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
                       Punch Requirement <ArrowRight size={16} />
                    </button>
                    <p className="text-[9px] font-bold text-slate-400 uppercase text-center max-w-[200px] leading-relaxed">
                       Assigned to <span className="text-survyx-navy">Consulting Team</span> upon submission.
                    </p>
                  </div>
               </div>
            </div>
          ) : (
            /* Provider Hub - From Image 8 & 9 */
            <div className="registry-card bg-white border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Ecosystem Partner Hub</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Managed Service Catalog & Active Leads</p>
                  </div>
                  <button className="bg-survyx-blue text-white px-6 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
                    Update Catalogue
                  </button>
               </div>
               
               <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-slate-50 transition-all">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-survyx-navy group-hover:text-survyx-blue transition-colors">
                               <Zap size={20} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-survyx-navy uppercase tracking-tight">Active Requirement PS-{490+i}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Consumer: Tier-1 Logistics Hub • Urgent • ₹4.2M BOM</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="text-[8px] font-black uppercase text-green-500 px-2 py-0.5 bg-green-50 rounded">Matches Profile</span>
                            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-survyx-navy transition-colors">
                               <ArrowUpRight size={16} />
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
               
               <div className="p-4 border-t border-slate-50 text-center">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Showing assigned leads from Concierge Hub</p>
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="registry-card p-6 bg-blue-50/30 border border-blue-100 relative overflow-hidden group">
               <Zap className="absolute -right-4 -top-4 w-24 h-24 text-survyx-blue opacity-5 -rotate-12 group-hover:scale-110 transition-transform" />
               <h4 className="text-xs font-black text-survyx-blue uppercase tracking-widest mb-2">Trade Health Analytics</h4>
               <p className="text-[10px] text-slate-500 max-w-[200px] mb-4">Accelerate operations with unified B2B/B2C authenticity checks.</p>
               <button 
                onClick={() => setView('verification')}
                className="flex items-center gap-2 text-[9px] font-black uppercase text-survyx-blue hover:gap-3 transition-all"
               >
                  Verify Compliance <ArrowRight size={12} />
               </button>
            </div>
            <div className="registry-card p-6 bg-slate-900 text-white relative overflow-hidden group">
               <ShieldCheck className="absolute -right-4 -top-4 w-24 h-24 text-white opacity-5 -rotate-12 group-hover:scale-110 transition-transform" />
               <h4 className="text-xs font-black text-blue-300 uppercase tracking-widest mb-2">Joint Venture Logic</h4>
               <p className="text-[10px] text-slate-400 max-w-[200px] mb-4">Form temporary trade rafts with other partners to deliver end-to-end solutions.</p>
               <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-white/10 rounded text-[8px] font-black uppercase">Institutional Grade</div>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info/Concierge */}
        <div className="lg:col-span-4 space-y-6">
           <div className="registry-card bg-white border border-slate-100 shadow-sm p-6">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Support Concierge</h4>
                <div className="flex items-center gap-2 text-[8px] font-black text-green-500 uppercase tracking-widest">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   <span>Active</span>
                </div>
             </div>
             
             <div className="flex items-center space-x-4 mb-6">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Priya Krishnamurthy</p>
                  <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Senior Trade Specialist</p>
                </div>
             </div>

             <div className="bg-slate-50 p-6 rounded-lg italic text-[11px] text-slate-400 leading-relaxed mb-6 border border-slate-100">
                "Abhishek, welcome to SURVYX. I'm your trade concierge. Once you create an RFQ, I'll help you find the best suppliers and manage your escrow."
             </div>

             <button onClick={() => setView('chat')} className="w-full bg-slate-900 text-white py-4 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg active:scale-95">
                Chat with Priya
             </button>
           </div>

           <div className="registry-card p-6 bg-white border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Registry Health Index</h4>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-[8px] font-black uppercase text-survyx-blue border border-blue-100 rounded">
                   Institutional Grade
                </div>
             </div>
             <div className="space-y-6">
                <div className="p-4 bg-survyx-navy text-white rounded-2xl relative overflow-hidden group mb-6">
                   <div className="relative z-10">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">SURVYX Score™</p>
                      <div className="flex items-end gap-2">
                         <span className="text-4xl font-black tracking-tighter">742</span>
                         <span className="text-[10px] font-bold text-blue-400 mb-1.5">/ 1000</span>
                      </div>
                      <p className="text-[9px] font-medium text-slate-400 mt-2">Top 15% in your industry segment. Your governance level is <span className="text-white font-black">PLATINUM</span>.</p>
                   </div>
                   <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-survyx-blue/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                </div>

                <div>
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network Risk</span>
                      <span className="text-xs font-black text-slate-900">N/A</span>
                   </div>
                   <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-survyx-blue h-full w-[20%] opacity-20" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">On-time Rate</p>
                      <p className="text-sm font-black text-slate-300 mt-1">-%</p>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">QA Pass Rate</p>
                      <p className="text-sm font-black text-slate-300 mt-1">-%</p>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, sub, icon }: any) {
  return (
    <div className="registry-card p-6 bg-white border border-slate-100 shadow-sm relative overflow-hidden group hover:border-survyx-blue transition-all">
      <div className="absolute top-4 right-4">
         {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-survyx-navy mt-1 tracking-tighter">{value}</p>
      </div>
      <p className="text-[9px] font-black mt-4 text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
        <div className="w-1 h-1 rounded-full bg-slate-200" />
        {sub}
      </p>
    </div>
  );
}

