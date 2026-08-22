import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Gavel, 
  Lock, 
  MessageSquare, 
  ChevronRight, 
  Users, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Zap,
  Box,
  Sparkles,
  Calculator,
  Layers,
  FileCheck2,
  HelpCircle,
  Clock,
  Award,
  Bot
} from 'lucide-react';

export default function Landing({ onGetStarted }: { onGetStarted: () => void }) {
  // Live Escrow Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(2500000);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Renewable Energy');

  const m1 = Math.round(calcAmount * 0.30);
  const m2 = Math.round(calcAmount * 0.40);
  const m3 = Math.round(calcAmount * 0.30);
  const escrowFee = Math.round(calcAmount * 0.0075); // 0.75% institutional escrow protection

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-survyx-blue selection:text-white font-sans">
      {/* Top Banner */}
      <div className="bg-survyx-navy text-slate-300 text-[10px] py-2 px-4 text-center border-b border-white/10 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-white">SURVYX Global B2B Protocol v4.2 Active:</span>
        <span>Over ₹890 Cr in Multi-Signature Escrow Protected Across 45,000+ Verified Entities.</span>
        <button 
          onClick={onGetStarted}
          className="ml-2 underline text-survyx-blue hover:text-white font-bold transition-colors"
        >
          Access Portal →
        </button>
      </div>

      {/* Navigation */}
      <nav className="glass sticky top-0 z-40 px-6 py-4 border-b border-slate-200/60 backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={onGetStarted}>
            <div className="w-10 h-10 bg-survyx-navy rounded-xl flex items-center justify-center font-black text-white shadow-xl group-hover:bg-survyx-blue transition-colors duration-300 text-lg">
              S
            </div>
            <div className="flex flex-col -space-y-0.5">
              <h1 className="text-xl font-black tracking-tighter text-survyx-navy">
                SURVYX<span className="text-survyx-blue">.com</span>
              </h1>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-survyx-blue transition-colors">
                People • Process • Technology
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <a href="#protocol" className="hover:text-survyx-blue transition-colors">The 5 Pillars</a>
            <a href="#calculator" className="hover:text-survyx-blue transition-colors">Escrow Calculator</a>
            <a href="#ai-assistant" className="hover:text-survyx-blue transition-colors flex items-center gap-1">
              <Sparkles size={13} className="text-survyx-blue" />
              AI Trade Copilot
            </a>
            <a href="#shift" className="hover:text-survyx-blue transition-colors">Governance</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onGetStarted} 
              className="hidden sm:block text-[11px] font-bold uppercase tracking-wider text-survyx-navy hover:text-survyx-blue transition-colors px-3 py-2"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-survyx-navy hover:bg-survyx-blue text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center gap-2"
            >
              Enter Hub <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-survyx-blue rounded-full border border-blue-200/60 mb-6 shadow-sm">
                <Sparkles size={13} className="text-survyx-blue" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Global Marketplace to Connect, Consult, Buy, Sell & Grow
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-survyx-navy leading-[0.95] tracking-tighter mb-6">
                Connect. Consult.<br />
                <span className="text-survyx-blue italic">Buy. Sell. Grow.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 mb-10 font-normal leading-relaxed max-w-2xl mx-auto">
                SURVYX is the governed institutional B2B marketplace powering seamless global trade through synchronized <span className="text-survyx-navy font-bold">People, Process, and Technology</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={onGetStarted}
                  className="bg-survyx-navy text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider text-xs hover:bg-survyx-blue transition-all flex items-center justify-center group shadow-xl shadow-blue-900/10 active:scale-95"
                >
                  Enter Marketplace Hub <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('calculator');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white border border-slate-300 text-survyx-navy px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm"
                >
                  <Calculator size={15} className="mr-2 text-survyx-blue" />
                  Simulate Escrow Trade
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="mt-16 pt-10 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-slate-500">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck size={20} className="text-survyx-blue" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-survyx-navy uppercase">MCA & GSTN Audited</p>
                    <p className="text-[9px] text-slate-400">100% Vetted Entities</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Lock size={20} className="text-survyx-blue" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-survyx-navy uppercase">Multi-Sig Escrow</p>
                    <p className="text-[9px] text-slate-400">NPCI / Bank Routed</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Bot size={20} className="text-survyx-blue" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-survyx-navy uppercase">AI Trade Concierge</p>
                    <p className="text-[9px] text-slate-400">Priya Krishnamurthy AI</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Globe size={20} className="text-survyx-blue" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-survyx-navy uppercase">Global Settlement</p>
                    <p className="text-[9px] text-slate-400">Zero Non-Delivery Risk</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)] -z-10 opacity-30" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -z-20" />
      </section>

      {/* The 5 Pillars of SURVYX */}
      <section id="protocol" className="py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-survyx-blue mb-3 block">
              The Comprehensive Ecosystem
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-survyx-navy tracking-tight leading-tight">
              Connect. Consult. Buy. Sell. Grow.
            </h2>
            <p className="text-slate-500 text-base mt-4">
              Everything enterprise buyers and institutional suppliers require to scale securely with people, process, and technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <PillarCard 
              number="01"
              title="Connect"
              subtitle="Verified Network"
              desc="Access 45,000+ verified suppliers and institutional buyers across Renewable Energy, Manufacturing, and Automotive sectors."
              badge="ROC/GSTN Audited"
              icon={<Users className="text-survyx-blue" size={24} />}
            />
            <PillarCard 
              number="02"
              title="Consult"
              subtitle="Specialist Advisory"
              desc="Work with certified Trade Officers and AI Copilots to draft precise BOMs, NABL testing specifications, and price benchmarks."
              badge="1:1 Advisory"
              icon={<MessageSquare className="text-survyx-navy" size={24} />}
            />
            <PillarCard 
              number="03"
              title="Buy"
              subtitle="Governed RFQs"
              desc="Publish technical specifications to receive competitive, verified bids with zero bidding spam or unqualified submissions."
              badge="Dynamic Bidding"
              icon={<Gavel className="text-survyx-blue" size={24} />}
            />
            <PillarCard 
              number="04"
              title="Sell"
              subtitle="Enterprise Demand"
              desc="Unlock high-volume institutional purchase orders with assured payment security guaranteed by multi-signature escrow vaults."
              badge="Guaranteed Liquidity"
              icon={<TrendingUp className="text-survyx-navy" size={24} />}
            />
            <PillarCard 
              number="05"
              title="Grow"
              subtitle="Scalable Vaults"
              desc="Scale your enterprise without credit or default risks through 3-tier milestone releases and automated dispute freeze arbitration."
              badge="SafePay™ Multi-Sig"
              icon={<ShieldCheck className="text-survyx-blue" size={24} />}
            />
          </div>
        </div>
      </section>

      {/* Interactive Escrow Simulator Section */}
      <section id="calculator" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-survyx-blue/20 text-blue-300 rounded-full border border-blue-400/30 text-[10px] font-black uppercase tracking-widest">
                <Lock size={12} /> SafePay™ Escrow Protocol
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Zero Default. Zero Fraud. <br />
                <span className="text-survyx-blue">Governed Milestones.</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                In traditional B2B trade, buyers risk advance payments and suppliers risk non-payment. SURVYX eliminates both through audited 3-tier milestone disbursements.
              </p>

              {/* Amount Slider */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300 uppercase">Simulated Contract Volume:</span>
                  <span className="text-2xl font-black text-blue-400 font-mono">
                    ₹{calcAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="500000" 
                  max="10000000" 
                  step="250000"
                  value={calcAmount} 
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-survyx-blue"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>₹5 Lakhs</span>
                  <span>₹50 Lakhs</span>
                  <span>₹1 Crore</span>
                </div>
              </div>

              <div className="flex gap-4 items-center pt-2">
                <button 
                  onClick={onGetStarted}
                  className="bg-survyx-blue hover:bg-white hover:text-survyx-navy text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  Create Escrow Vault →
                </button>
                <span className="text-[11px] text-slate-400">Estimated Escrow Fee: ₹{escrowFee.toLocaleString('en-IN')} (0.75%)</span>
              </div>
            </div>

            {/* Milestones Visualizer Card */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-lg font-black text-white">3-Stage Milestone Breakdown</h3>
                  <p className="text-xs text-slate-400">Dual-key signature release at each verifiable stage</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-mono font-bold">
                  NPCI Ready
                </span>
              </div>

              <div className="space-y-4">
                <MilestoneVisualRow 
                  step="1"
                  percent="30%"
                  amount={`₹${m1.toLocaleString('en-IN')}`}
                  title="Material Intake & Yard Inspection"
                  desc="Funds unlocked when raw materials are physically verified at the staging yard with NABL test reports."
                  badge="Inspection Verified"
                />
                <MilestoneVisualRow 
                  step="2"
                  percent="40%"
                  amount={`₹${m2.toLocaleString('en-IN')}`}
                  title="Logistics GPS & e-Way Bill Verification"
                  desc="Funds released upon digital transit confirmation and verified GPS handover tracking."
                  badge="e-Way Bill Sync"
                />
                <MilestoneVisualRow 
                  step="3"
                  percent="30%"
                  amount={`₹${m3.toLocaleString('en-IN')}`}
                  title="Final Site QA & Warranty Handover"
                  desc="Disbursed after institutional client sign-off, warranty certificate deposit, and final handover."
                  badge="Final Sign-off"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Emergency Dispute Freeze Available Anytime
                </span>
                <span className="font-mono text-blue-300">Total: ₹{calcAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-survyx-blue/10 rounded-full blur-[140px] -z-10" />
      </section>

      {/* AI Trade Copilot Spotlight Section */}
      <section id="ai-assistant" className="py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 via-survyx-navy to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-survyx-blue/20 text-blue-300 rounded-full border border-blue-400/30 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={12} className="text-survyx-blue" />
                  Integrated AI Assistant
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  Meet Officer Priya Krishnamurthy. <br />
                  <span className="text-survyx-blue">Your AI Trade & Governance Copilot.</span>
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Have questions about structuring an institutional RFQ, NABL test standards, milestone release timings, or supplier KYC? Priya is accessible 24/7 across the entire platform.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Instant RFQ Structuring</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Real-time Escrow Guidance</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>KYC & ROC Compliance Audit</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Dispute Arbitration Help</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const trigger = document.getElementById('survyx-ai-bot-trigger');
                      trigger?.click();
                    }}
                    className="bg-survyx-blue hover:bg-white hover:text-survyx-navy text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
                  >
                    <Bot size={15} />
                    Open AI Trade Copilot
                  </button>
                </div>
              </div>

              {/* Chat Simulation Preview Card */}
              <div className="lg:col-span-6 bg-white text-slate-800 rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-survyx-navy flex items-center justify-center text-white text-xs font-bold">
                      P
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Officer Priya Krishnamurthy</p>
                      <p className="text-[9px] text-slate-400 font-mono">Senior Registry Officer • Live</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-bold uppercase rounded">
                    Active
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-100 p-3 rounded-xl rounded-tr-none max-w-[85%] ml-auto text-slate-700">
                    "I want to procure 10 Tons of primary grade Aluminum Ingots (99.7% pure) with escrow protection."
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl rounded-tl-none max-w-[90%] text-slate-800 space-y-1.5">
                    <p className="font-bold text-survyx-navy">SURVYX Procurement Recommendation:</p>
                    <p>1. I will help you draft <strong>RFQ-8822</strong> under Heavy Manufacturing.</p>
                    <p>2. Recommended Escrow: ₹28,50,000 locked into 30% Material Intake / 40% Transit / 30% QA.</p>
                    <p>3. Matchmaking active across 14 verified foundry suppliers.</p>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 font-mono text-center">
                  Try asking Priya directly via the floating bot icon at the bottom-right!
                </div>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-80 h-80 bg-survyx-blue/10 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-black text-survyx-navy tracking-tight">
            Ready to Experience the Institutional Shift?
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Join thousands of verified businesses moving goods and capital securely with SURVYX.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button 
              onClick={onGetStarted}
              className="bg-survyx-navy hover:bg-survyx-blue text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider text-xs transition-all shadow-xl active:scale-95"
            >
              Access Marketplace Hub →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-slate-600 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-survyx-navy rounded-lg flex items-center justify-center font-black text-white text-sm">
                S
              </div>
              <span className="text-base font-black text-survyx-navy tracking-tight">
                SURVYX<span className="text-survyx-blue">.com</span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-400">Global B2B Managed Marketplace</span>
            </div>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} SURVYX GLOBAL TRADE REGISTRY • All Trade IDs Regulated & Audited.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PillarCard({ number, title, subtitle, desc, badge, icon }: any) {
  return (
    <div className="bg-slate-50 hover:bg-blue-50/40 p-6 rounded-2xl border border-slate-200/80 hover:border-blue-200 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            {icon}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400">{number}</span>
        </div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-survyx-blue mb-1">{subtitle}</p>
        <h3 className="text-xl font-black text-survyx-navy mb-2">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed font-normal">{desc}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200/60">
        <span className="text-[9px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
          {badge}
        </span>
      </div>
    </div>
  );
}

function MilestoneVisualRow({ step, percent, amount, title, desc, badge }: any) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-survyx-blue text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
          {step}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-white">{title}</h4>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
              {badge}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="text-left sm:text-right shrink-0">
        <span className="text-[10px] font-mono text-blue-300">{percent} Allocation</span>
        <p className="text-sm font-black text-white font-mono">{amount}</p>
      </div>
    </div>
  );
}
