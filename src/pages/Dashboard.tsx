import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  AlertCircle,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { useUserJourney } from '../context/UserJourneyContext';
import TradeAnalyticsChart from '../components/TradeAnalyticsChart';

interface DashboardProps {
  setView?: (v: any) => void;
  euid?: string;
  mode?: 'consumer' | 'provider';
  key?: React.Key;
}

export default function Dashboard({}: DashboardProps) {
  const {
    state,
    setCurrentView,
    punchRequirement,
    setTradeMode
  } = useUserJourney();

  const { 
    user, 
    profile, 
    tradeMode, 
    verificationStatus, 
    auditInfo, 
    trustScore, 
    governanceTier, 
    totalSecuredVolume, 
    rfqs 
  } = state;

  // Requirement form state
  const [problemStatement, setProblemStatement] = useState('');
  const [industryType, setIndustryType] = useState('Renewable Energy Infrastructure');
  const [budgetIntent, setBudgetIntent] = useState('');
  const [punchSuccess, setPunchSuccess] = useState(false);

  const handlePunchRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (problemStatement.trim()) {
      punchRequirement({
        title: problemStatement.slice(0, 45) + (problemStatement.length > 45 ? '...' : ''),
        category: industryType,
        budget: budgetIntent || '₹20,00,000 - ₹35,00,000',
        description: problemStatement
      });
      setProblemStatement('');
      setBudgetIntent('');
      setPunchSuccess(true);
      setTimeout(() => setPunchSuccess(false), 4000);
    }
  };

  const displayName = profile.authorizedSignatory.split(' ')[0] || user?.name || 'Abhishek';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">
            Welcome, <span className="text-survyx-blue">{displayName}</span>
          </h2>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-survyx-navy text-white text-[9px] font-black uppercase rounded-lg">
             {tradeMode === 'consumer' ? 'Procurement Lead' : 'Service Provider'}
          </div>
          {verificationStatus === 'verified' && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-[8px] font-black uppercase rounded">
              <CheckCircle2 size={10} /> Verified Platinum
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network Status:</span>
             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest">Connected</span>
             </div>
          </div>
          <button 
            onClick={() => setCurrentView('verification')}
            className="text-slate-400 hover:text-survyx-navy transition-colors"
            title="View Compliance Status"
          >
            <Activity size={18} />
          </button>
        </div>
      </div>

      {/* DYNAMIC COMPLIANCE JOURNEY BANNER */}
      {verificationStatus !== 'verified' && verificationStatus !== 'under_review' && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
               <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Compliance Action Required</p>
              <p className="text-[10px] text-amber-700 font-medium tracking-tight">
                Your Institutional Status is currently "Draft / Limited". Complete Registry Verification to unlock full Escrow trade volume.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('verification')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-md shadow-amber-200 flex items-center justify-center gap-2 shrink-0"
          >
             Start Verification <ArrowRight size={14} />
          </button>
        </motion.div>
      )}

      {verificationStatus === 'under_review' && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 text-survyx-blue rounded-xl flex items-center justify-center shrink-0 animate-pulse">
               <Clock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-blue-950 uppercase tracking-tight">Registry Audit In Progress (Queue #{auditInfo.queuePosition})</p>
                <span className="text-[8px] font-bold uppercase bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                  Officer Priya Reviewing
                </span>
              </div>
              <p className="text-[10px] text-blue-700 font-medium tracking-tight">
                Documents for {profile.businessName} are under automated ROC/GSTN cross-audit. Estimated clearance {auditInfo.estimatedCompletion}.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('verification')}
            className="bg-survyx-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 shrink-0"
          >
             Check Audit Status <ArrowRight size={14} />
          </button>
        </motion.div>
      )}

      {verificationStatus === 'verified' && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-green-50 border border-green-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
               <Award size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-green-950 uppercase tracking-tight">Institutional Entity Verified • Tier-1 Platinum</p>
              <p className="text-[10px] text-green-700 font-medium tracking-tight">
                {profile.businessName} (EUID: {state.euid}) has full clearance for multi-million Escrow vault deposits and direct RFQ execution.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('vault')}
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
          >
             Open Vault <ArrowRight size={14} />
          </button>
        </motion.div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tradeMode === 'consumer' ? (
          <>
            <StatCard 
              label="OPEN REQS" 
              value={rfqs.length.toString()} 
              sub="AWAITING CONCIERGE" 
              icon={<Briefcase size={16} className="text-blue-400 opacity-40" />} 
              onClick={() => setCurrentView('bids')}
            />
            <StatCard 
              label="IN ESCROW" 
              value={`₹${(totalSecuredVolume / 100000).toFixed(1)}L`} 
              sub="SECURE NPCI DEPOSITS" 
              icon={<ShieldCheck size={16} className="text-blue-400 opacity-40" />} 
              onClick={() => setCurrentView('vault')}
            />
            <StatCard 
              label="BIDS REVIEW" 
              value="12" 
              sub="PENDING SIGN-OFF" 
              icon={<MessageSquare size={16} className="text-blue-400 opacity-40" />} 
              onClick={() => setCurrentView('bids')}
            />
            <StatCard 
              label="TRUST RATING" 
              value={`${Math.round((trustScore / 1000) * 100)}%`} 
              sub={`${governanceTier} GOVERNANCE`} 
              icon={<TrendingUp size={16} className="text-green-400 opacity-40" />} 
              onClick={() => setCurrentView('verification')}
            />
          </>
        ) : (
          <>
            <StatCard 
              label="PIPELINE" 
              value={`₹${(totalSecuredVolume / 10000000).toFixed(2)}Cr`} 
              sub="POTENTIAL GMV" 
              icon={<TrendingUp size={16} className="text-blue-400 opacity-40" />} 
            />
            <StatCard 
              label="LEADS" 
              value={rfqs.length.toString().padStart(2, '0')} 
              sub="CONCIERGE ASSIGNED" 
              icon={<Zap size={16} className="text-yellow-400 opacity-40" />} 
              onClick={() => setCurrentView('bids')}
            />
            <StatCard 
              label="QUALIFIED" 
              value={`${Math.round((trustScore / 1000) * 100)}%`} 
              sub="TRUST RATING" 
              icon={<ShieldCheck size={16} className="text-blue-400 opacity-40" />} 
              onClick={() => setCurrentView('verification')}
            />
            <StatCard 
              label="EARNINGS" 
              value="₹14.2L" 
              sub="SETTLED THIS MONTH" 
              icon={<Activity size={16} className="text-green-400 opacity-40" />} 
              onClick={() => setCurrentView('vault')}
            />
          </>
        )}
      </div>

      {/* 30-DAY B2B TRADE VOLUMES & MILESTONE COMPLETION VELOCITY (RECHARTS) */}
      <TradeAnalyticsChart />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Hub Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {tradeMode === 'consumer' ? (
            /* Requirement Punching Form */
            <div className="registry-card bg-white border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Requirement Punching Form</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Submit your trade necessity for institutional vetting</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-survyx-blue border border-blue-100 rounded-lg text-[9px] font-black uppercase">
                     Expert Guidance Active
                  </div>
               </div>

               <form onSubmit={handlePunchRequirement} className="p-6 sm:p-8 space-y-6">
                  {punchSuccess && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-800 text-xs font-bold">
                      <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                      <span>Requirement punched successfully! Assigned to Officer Priya and logged under Live RFQs.</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        What do you actually want / Problem Statement (PS)?
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400">AI Templates:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setProblemStatement("Procure 5000 Units of High-Voltage Solar Inverter Capacitors (450V DC) with NABL testing certifications and 5-year replacement warranty.");
                            setIndustryType("Renewable Energy Infrastructure");
                            setBudgetIntent("₹35,00,000 - ₹45,00,000");
                          }}
                          className="text-[9px] font-bold text-survyx-blue hover:underline bg-blue-50 px-2 py-0.5 rounded"
                        >
                          Solar Inverters
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProblemStatement("Supply 15 Metric Tons of Primary Foundry Aluminum Ingots (99.7% purity) with batch test certificates and milestone logistics tracking.");
                            setIndustryType("Heavy Manufacturing");
                            setBudgetIntent("₹28,00,000 - ₹38,00,000");
                          }}
                          className="text-[9px] font-bold text-survyx-blue hover:underline bg-blue-50 px-2 py-0.5 rounded"
                        >
                          Aluminum Ingots
                        </button>
                      </div>
                    </div>
                    <textarea 
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                      placeholder="e.g., We need to source 500 units of Tier-1 solar inverters with 10-year warranty sync and onsite commission testing..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs font-medium focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:bg-white outline-none h-28 transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                        Industry Type & Category
                      </label>
                      <select 
                        value={industryType}
                        onChange={(e) => setIndustryType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-survyx-blue"
                      >
                         <option>Renewable Energy Infrastructure</option>
                         <option>Automotive & EV Supply</option>
                         <option>Heavy Manufacturing</option>
                         <option>Consumer Electronics (B2B)</option>
                         <option>Chemicals & Polymers</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                        Budgetary Intent / BOM Estimated
                      </label>
                      <input 
                        type="text" 
                        value={budgetIntent}
                        onChange={(e) => setBudgetIntent(e.target.value)}
                        placeholder="e.g. ₹25,00,000 - ₹40,00,000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-survyx-blue"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <button 
                      type="submit"
                      className="flex-1 w-full bg-survyx-navy text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3 active:scale-98"
                    >
                       Punch Requirement <ArrowRight size={16} />
                    </button>
                    <p className="text-[9px] font-bold text-slate-400 uppercase text-center sm:text-right max-w-[220px] leading-relaxed">
                       Directly routed to <span className="text-survyx-navy font-black">Senior Officer Priya</span> upon submission.
                    </p>
                  </div>
               </form>
            </div>
          ) : (
            /* Provider Hub */
            <div className="registry-card bg-white border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Ecosystem Partner Hub</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Managed Service Catalog & Active Leads</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('bids')}
                    className="bg-survyx-blue text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all"
                  >
                    View All Leads ({rfqs.length})
                  </button>
               </div>
               
               <div className="p-6 space-y-3">
                  {rfqs.slice(0, 3).map((rfq) => (
                    <div key={rfq.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-slate-50 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-survyx-navy group-hover:text-survyx-blue transition-colors">
                             <Zap size={18} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-survyx-navy uppercase tracking-tight">{rfq.title}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                               {rfq.category} • Budget: {rfq.budget} • {rfq.bidsCount} Bids
                             </p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-[8px] font-black uppercase text-green-600 px-2 py-0.5 bg-green-50 border border-green-100 rounded">
                            Verified Match
                          </span>
                          <button 
                            onClick={() => setCurrentView('bids')}
                            className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-survyx-navy transition-colors"
                          >
                             <ArrowUpRight size={15} />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="p-4 border-t border-slate-50 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Leads Verified by SURVYX Concierge Engine</p>
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="registry-card p-6 bg-blue-50/30 border border-blue-100 relative overflow-hidden group">
               <Zap className="absolute -right-4 -top-4 w-24 h-24 text-survyx-blue opacity-5 -rotate-12 group-hover:scale-110 transition-transform" />
               <h4 className="text-xs font-black text-survyx-blue uppercase tracking-widest mb-1.5">Trade Health Analytics</h4>
               <p className="text-[10px] text-slate-500 max-w-[200px] mb-4">Accelerate procurement with unified B2B statutory authenticity checks.</p>
               <button 
                onClick={() => setCurrentView('verification')}
                className="flex items-center gap-2 text-[9px] font-black uppercase text-survyx-blue hover:gap-3 transition-all"
               >
                  Verify Compliance <ArrowRight size={12} />
               </button>
            </div>
            <div className="registry-card p-6 bg-slate-900 text-white relative overflow-hidden group">
               <ShieldCheck className="absolute -right-4 -top-4 w-24 h-24 text-white opacity-5 -rotate-12 group-hover:scale-110 transition-transform" />
               <h4 className="text-xs font-black text-blue-300 uppercase tracking-widest mb-1.5">Escrow Protection Level</h4>
               <p className="text-[10px] text-slate-400 max-w-[200px] mb-4">Dual-key multi-signature settlement vault with instant trade lock triggers.</p>
               <button 
                 onClick={() => setCurrentView('vault')}
                 className="flex items-center gap-2 text-[9px] font-black uppercase text-blue-300 hover:gap-3 transition-all"
               >
                  Manage Vault <ArrowRight size={12} />
               </button>
            </div>
          </div>
        </div>

        {/* Sidebar Concierge & Index */}
        <div className="lg:col-span-4 space-y-6">
           <div className="registry-card bg-white border border-slate-100 shadow-sm p-6">
             <div className="flex items-center justify-between mb-5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Registry Officer</h4>
                <div className="flex items-center gap-1.5 text-[8px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span>Online</span>
                </div>
             </div>
             
             <div className="flex items-center space-x-4 mb-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" alt="Priya" className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Priya Krishnamurthy</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Senior Trade Governance Officer</p>
                </div>
             </div>

             <div className="bg-slate-50 p-4 rounded-xl italic text-[11px] text-slate-600 leading-relaxed mb-5 border border-slate-100">
                "{displayName}, I am monitoring your trade compliance and Escrow status. Once you punch an RFQ or release a milestone, I provide real-time validation."
             </div>

             <button 
               onClick={() => setCurrentView('chat')} 
               className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
             >
                <MessageSquare size={14} /> Chat with Priya
             </button>
           </div>

           <div className="registry-card p-6 bg-white border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-5">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Registry Health Index</h4>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-[8px] font-black uppercase text-survyx-blue border border-blue-100 rounded">
                   {governanceTier} Grade
                </div>
             </div>
             <div className="space-y-5">
                <div className="p-4 bg-survyx-navy text-white rounded-2xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">SURVYX Score™</p>
                      <div className="flex items-end gap-2">
                         <span className="text-4xl font-black tracking-tighter">{trustScore}</span>
                         <span className="text-[10px] font-bold text-blue-400 mb-1.5">/ 1000</span>
                      </div>
                      <p className="text-[9px] font-medium text-slate-400 mt-2">
                        Entity Standing: <span className="text-white font-black">{governanceTier}</span>. Escrow clearance enabled.
                      </p>
                   </div>
                   <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-survyx-blue/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                </div>

                <div>
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verification Progress</span>
                      <span className="text-xs font-black text-slate-900">
                        {verificationStatus === 'verified' ? '100%' : verificationStatus === 'under_review' ? '75%' : '35%'}
                      </span>
                   </div>
                   <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-survyx-blue h-full transition-all duration-500" 
                        style={{ 
                          width: verificationStatus === 'verified' ? '100%' : verificationStatus === 'under_review' ? '75%' : '35%' 
                        }}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">On-time Rate</p>
                      <p className="text-xs font-black text-slate-800 mt-1">99.4%</p>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Dual-Sig Pass</p>
                      <p className="text-xs font-black text-slate-800 mt-1">100%</p>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ 
  label, 
  value, 
  sub, 
  icon, 
  onClick 
}: { 
  label: string; 
  value: string; 
  sub: string; 
  icon: React.ReactNode; 
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`registry-card p-5 bg-white border border-slate-100 shadow-sm relative overflow-hidden group hover:border-survyx-blue transition-all ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
      <div className="absolute top-4 right-4">
         {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-survyx-navy mt-1 tracking-tighter">{value}</p>
      </div>
      <div className="text-[9px] font-black mt-3 text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-survyx-blue transition-colors" />
        {sub}
      </div>
    </div>
  );
}
