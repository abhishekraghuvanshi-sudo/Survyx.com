import React from 'react';
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
  Box
} from 'lucide-react';

export default function Landing({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="bg-slate-50 min-h-screen selection:bg-survyx-blue selection:text-white font-sans">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 px-6 py-5 border-b border-slate-200/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-9 h-9 bg-survyx-navy rounded-xl flex items-center justify-center font-black text-white shadow-xl group-hover:bg-survyx-blue transition-colors duration-500">S</div>
            <div className="flex flex-col -space-y-1">
              <h1 className="text-xl font-black tracking-tighter text-survyx-navy">SURVYX<span className="text-survyx-blue">.com</span></h1>
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-survyx-blue transition-colors">Global Trade Registry</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#about" className="hover:text-survyx-navy transition-colors">The Protocol</a>
            <a href="#shift" className="hover:text-survyx-navy transition-colors">The Shift</a>
            <a href="#features" className="hover:text-survyx-navy transition-colors">Governance</a>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={onGetStarted} className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-survyx-navy hover:underline">Partner Login</button>
             <button 
              onClick={onGetStarted}
              className="bg-survyx-navy text-white px-7 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Access Hub
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-survyx-blue rounded-full border border-blue-100 mb-8">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Global Trade Protocol v4.0 Active</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-survyx-navy leading-[0.9] tracking-tighter mb-8">
                Connect. Consult.<br />
                <span className="text-survyx-blue italic">Buy. Sell. Grow.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-500 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
                SURVYX is the global marketplace platform to <span className="text-survyx-navy font-bold underline decoration-survyx-blue/30 underline-offset-4">Connect, Consult, Buy, Sell & Grow</span> through synchronized People, Process, and Technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <button 
                  onClick={onGetStarted}
                  className="bg-survyx-navy text-white px-10 py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all flex items-center justify-center group shadow-2xl shadow-slate-300"
                >
                  Enter Marketplace Hub <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} />
                </button>
                <button className="bg-white border border-slate-200 text-survyx-navy px-10 py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-50 transition-all flex items-center justify-center">
                  Consult a Specialist
                </button>
              </div>

              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                <div className="flex flex-col items-center gap-2">
                   <ShieldCheck size={24} />
                   <span className="text-[8px] font-black uppercase tracking-widest">Audited Registry</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <Lock size={24} />
                   <span className="text-[8px] font-black uppercase tracking-widest">Escrow Vault</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <Activity size={24} />
                   <span className="text-[8px] font-black uppercase tracking-widest">Real-time Sync</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <Globe size={24} />
                   <span className="text-[8px] font-black uppercase tracking-widest">Global Reach</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-40" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[120px] -z-20" />
      </section>

      {/* The Institutional Edge */}
      <section id="about" className="py-40 bg-white border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-survyx-blue mb-4 block">The Institutional Edge</span>
              <h2 className="text-5xl md:text-7xl font-black text-survyx-navy tracking-tighter leading-none">Governance Beyond <br /><span className="italic">Trade.</span></h2>
            </div>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
              We believe that global scale is only achievable through the intersection of four critical pillars. We don't just provide a platform; we provide the infrastructure for trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             <ProtocolNode 
                icon={<MessageSquare size={40} className="text-survyx-blue" />}
                title="Consult"
                tagline="Strategic Advisory"
                desc="Strategic trade advisory and market entry support."
             />
             <ProtocolNode 
                icon={<Users size={40} className="text-survyx-navy" />}
                title="People"
                tagline="Vetted Network"
                desc="Vetted global network of verified trade partners."
             />
             <ProtocolNode 
                icon={<Briefcase size={40} className="text-survyx-blue" />}
                title="Process"
                tagline="Governed Flow"
                desc="Managed escrow and end-to-end logistics governance."
             />
             <ProtocolNode 
                icon={<Zap size={40} className="text-survyx-navy" />}
                title="Technology"
                tagline="AI Optimization"
                desc="AI-driven RFQ optimization and risk assessment."
             />
          </div>

          <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative group">
             <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                <div className="text-center lg:text-left">
                   <h3 className="text-2xl font-black tracking-tighter uppercase">SURVYX<span className="text-survyx-blue">.com</span></h3>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Global Trade Registry</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full lg:w-auto">
                   <StatItem label="Active Trades" value="1.2B+" />
                   <StatItem label="Verified Nodes" value="45k+" />
                   <StatItem label="Escrow Secured" value="₹890Cr" />
                   <StatItem label="Trade Speed" value="3x" />
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-survyx-blue/10 rounded-full blur-3xl -z-10 group-hover:bg-survyx-blue/20 transition-colors" />
          </div>
        </div>
      </section>

      {/* The Institutional Shift Section */}
      <section id="shift" className="py-40 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mb-6 block">The Paradigm Evolution</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">The Institutional Shift.</h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
              Why Global Leaders are transitioning from unmanaged directories to a fully-governed trade ecosystem.
            </p>
          </div>

          <div className="bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
             <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10">
                <div className="lg:col-span-4 p-8 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">Core Pillar</div>
                <div className="lg:col-span-4 p-8 border-l border-white/10 text-[10px] font-black uppercase tracking-widest text-red-400">Legacy Platforms</div>
                <div className="lg:col-span-4 p-8 border-l border-white/10 bg-survyx-blue/10 text-[10px] font-black uppercase tracking-widest text-survyx-blue">SURVYX Institutional</div>
             </div>

             <ShiftRow 
                pillar="Risk Mitigation" 
                legacy="Self-service directories with zero liability." 
                survyx={<span>Managed <span className="font-bold underline">SafePay™ Escrow</span> with 100% concierge verification.</span>} 
             />
             <ShiftRow 
                pillar="Trade Intelligence" 
                legacy="Static ratings and unchecked vendor profiles." 
                survyx={<span>Dynamic <span className="font-bold underline">SURVYX Score™</span> based on real-time financial health.</span>} 
             />
             <ShiftRow 
                pillar="Advisory Support" 
                legacy="Automated ticketing and slow email queues." 
                survyx={<span>Direct <span className="font-bold underline">Trade Concierge</span> via exclusive 1:1 managed loops.</span>} 
             />
             <ShiftRow 
                pillar="Logistics Integrity" 
                legacy="Third-party links with fragmented tracking." 
                survyx={<span>End-to-end sync with <span className="font-bold underline">Quality Inspection</span> at every node.</span>} 
             />
          </div>
        </div>

        <div className="absolute -left-64 top-1/4 w-[600px] h-[600px] bg-survyx-blue/5 rounded-full blur-[120px]" />
      </section>

      {/* Global Reach / Features */}
      <section id="features" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
             <div className="relative">
                <div className="aspect-square bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-center p-12 overflow-hidden group">
                   <div className="grid grid-cols-2 gap-4 w-full h-full">
                      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group-hover:-translate-y-2 transition-transform duration-500">
                         <TrendingUp className="text-survyx-blue mb-4" />
                         <p className="text-[8px] font-black uppercase text-slate-300">Volume</p>
                         <p className="text-xl font-black text-survyx-navy">₹12.4M</p>
                      </div>
                      <div className="bg-survyx-navy rounded-3xl p-6 shadow-xl group-hover:translate-y-2 transition-transform duration-500 text-white">
                         <ShieldCheck className="text-blue-400 mb-4" />
                         <p className="text-[8px] font-black uppercase text-slate-400">Security</p>
                         <p className="text-xl font-black">256-BIT</p>
                      </div>
                      <div className="bg-survyx-blue rounded-3xl p-6 shadow-xl group-hover:translate-x-2 transition-transform duration-500 text-white">
                         <Zap className="text-white mb-4" />
                         <p className="text-[8px] font-black uppercase text-blue-200">Speed</p>
                         <p className="text-xl font-black">ZERO LAG</p>
                      </div>
                      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group-hover:-translate-x-2 transition-transform duration-500">
                         <Box className="text-survyx-navy mb-4" />
                         <p className="text-[8px] font-black uppercase text-slate-300">Registry</p>
                         <p className="text-xl font-black">TIER-1</p>
                      </div>
                   </div>
                </div>
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-50 rounded-full flex flex-col items-center justify-center p-8 text-center border border-blue-100 animate-pulse">
                   <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Current Active</p>
                   <p className="text-3xl font-black text-survyx-blue">96.2%</p>
                   <p className="text-[8px] font-black uppercase text-slate-400">Trust Score</p>
                </div>
             </div>

             <div className="space-y-12">
                <div className="max-w-md">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-survyx-blue mb-4 block">Institutional Standards</span>
                   <h2 className="text-4xl font-black text-survyx-navy tracking-tighter leading-[1.1] mb-6">Built for those who <br /><span className="italic">Trade with Intent.</span></h2>
                   <p className="text-slate-500 font-medium leading-relaxed">
                      Every feature in SURVYX is designed to minimize risk and maximize operational speed for institutional-grade business.
                   </p>
                </div>

                <div className="space-y-8">
                   <FeatureRow 
                      icon={<Gavel size={20} />} 
                      title="Direct Bidding Protocols"
                      desc="Place bids and receive offers through a governed portal that verifies both ends of the transaction."
                   />
                   <FeatureRow 
                      icon={<Activity size={20} />} 
                      title="Network Transparency"
                      desc="Access the real-time financial health and reputation scores of every entity in our registry."
                   />
                   <FeatureRow 
                      icon={<MessageSquare size={20} />} 
                      title="Managed Trade Loops"
                      desc="Communication occurs inside exclusive, officer-managed loops with full institutional oversight."
                   />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-40 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="bg-survyx-navy rounded-[3rem] p-16 text-center text-white shadow-2xl relative overflow-hidden group">
            <motion.div
               whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
               transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">Ready for the <br />Institutional Shift?</h2>
              <p className="text-blue-200/60 text-lg mb-12 max-w-xl mx-auto font-medium">
                Join the world's first fully-governed B2B marketplace. Experience trade without the standard risk.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={onGetStarted}
                  className="bg-survyx-blue text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-survyx-navy transition-all transform active:scale-95 shadow-xl shadow-blue-500/20"
                >
                  Apply for Registry
                </button>
                <button className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all">
                  View Demo
                </button>
              </div>
            </motion.div>
            
            {/* Absolute decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-survyx-blue/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -z-10" />
          </div>
        </div>
        
        {/* Animated Lines Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none -z-10">
           {Array.from({length: 10}).map((_, i) => (
             <div key={i} className="h-px w-full bg-slate-900/20 my-20 transform -rotate-12" />
           ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-survyx-navy py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-4">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-9 h-9 bg-survyx-navy rounded-xl flex items-center justify-center font-black text-white">S</div>
                <h1 className="text-2xl font-black tracking-tighter uppercase">SURVYX<span className="text-survyx-blue">.com</span></h1>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed max-w-xs mb-8">
                The global institutional marketplace. A governed ecosystem for the modern era of B2B movement.
              </p>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-survyx-blue hover:bg-blue-50 transition-all cursor-pointer">
                    <Globe size={18} />
                 </div>
                 <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-survyx-blue hover:bg-blue-50 transition-all cursor-pointer">
                    <ShieldCheck size={18} />
                 </div>
              </div>
            </div>
            
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8 px-2 border-l-2 border-slate-100">Platform</h4>
                  <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-slate-400">
                    <li><a href="#" className="hover:text-survyx-blue transition-colors">Bidding</a></li>
                    <li><a href="#" className="hover:text-survyx-blue transition-colors">Escrow</a></li>
                    <li><a href="#" className="hover:text-survyx-blue transition-colors">Registry</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8 px-2 border-l-2 border-slate-100">Governance</h4>
                  <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-slate-400">
                    <li><a href="#" className="hover:text-survyx-blue transition-colors">Compliance</a></li>
                    <li><a href="#" className="hover:text-survyx-blue transition-colors">Audit Access</a></li>
                    <li><a href="#" className="hover:text-survyx-blue transition-colors">Legal Hub</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8 px-2 border-l-2 border-slate-100">Corporate</h4>
                  <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-slate-400">
                    <li><a href="#" className="hover:text-survyx-blue transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-survyx-blue transition-colors">Partners</a></li>
                    <li><a href="#" className="hover:text-survyx-blue transition-colors">Contact</a></li>
                  </ul>
               </div>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">© 2024 SURVYX • ALL TRADE IDS REGULATED</p>
             <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-300">
                <span className="hover:text-survyx-blue cursor-pointer">Privacy Protocol</span>
                <span className="hover:text-survyx-blue cursor-pointer">Terms of Trade</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProtocolNode({ icon, title, tagline, desc }: any) {
  return (
    <div className="group p-10 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-500 flex flex-col h-full">
       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-10 group-hover:scale-110 transition-transform duration-500">
          {icon}
       </div>
       <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">{tagline}</span>
       <h3 className="text-3xl font-black text-survyx-navy mb-6 tracking-tighter uppercase">{title}</h3>
       <p className="text-slate-500 text-sm leading-relaxed font-medium">
          {desc}
       </p>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center lg:text-left">
       <p className="text-4xl font-black tracking-tighter mb-1">{value}</p>
       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function ShiftRow({ pillar, legacy, survyx }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
       <div className="lg:col-span-4 p-8 flex flex-col justify-center">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Institutional Pillar</span>
          <p className="text-xl font-bold tracking-tight text-white">{pillar}</p>
       </div>
       <div className="lg:col-span-4 p-8 border-l border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
          <p className="text-sm text-slate-400 italic">"{legacy}"</p>
       </div>
       <div className="lg:col-span-4 p-8 border-l border-white/5 bg-survyx-blue/5 flex items-center justify-between">
          <p className="text-sm font-medium text-blue-200">{survyx}</p>
          <ArrowUpRight size={16} className="text-survyx-blue opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>
    </div>
  );
}

function FeatureRow({ icon, title, desc }: any) {
   return (
      <div className="flex gap-6 group hover:translate-x-2 transition-transform duration-500">
         <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-survyx-navy group-hover:bg-survyx-blue group-hover:text-white transition-colors">
            {icon}
         </div>
         <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-survyx-navy mb-1">{title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium uppercase tracking-tight">{desc}</p>
         </div>
      </div>
   );
}

