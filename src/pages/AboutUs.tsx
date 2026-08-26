import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Building2, 
  Globe2, 
  Sparkles, 
  Award, 
  Scale, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  FileText, 
  Check, 
  TrendingUp, 
  Cpu, 
  ShieldAlert, 
  Layers, 
  ChevronRight,
  ExternalLink,
  Bot
} from 'lucide-react';
import SurvyxLogo from '../components/SurvyxLogo';
import { useUserJourney } from '../context/UserJourneyContext';

export default function AboutUs({ onBackToHub }: { key?: React.Key; onBackToHub?: () => void }) {
  const { setCurrentView, state } = useUserJourney();
  const { user } = state;

  const handleAction = () => {
    if (onBackToHub) {
      onBackToHub();
    } else if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('auth');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-16 pb-24 text-slate-800"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-survyx-navy text-white p-8 sm:p-14 shadow-2xl border border-white/10">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} className="text-survyx-blue" />
            Institutional Trade Infrastructure
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            The Trust & Settlement Protocol for <span className="text-survyx-blue">Global B2B Trade</span>.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            SURVYX is an institutional-grade B2B trade network built to eliminate counterfeit transactions, payment fraud, and delivery non-compliance in enterprise commerce. We unite <strong>sovereign entity verification (EUID)</strong>, <strong>3-tier cryptographic milestone escrow</strong>, and <strong>statutory ledger AI governance</strong> into a unified operating standard.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleAction}
              className="bg-survyx-blue hover:bg-blue-600 text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95"
            >
              {user ? 'Return to Registry Hub' : 'Register Your Entity'}
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => {
                const trigger = document.getElementById('survyx-ai-bot-trigger');
                trigger?.click();
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3.5 rounded-xl border border-white/15 transition-all flex items-center gap-2"
            >
              <Bot size={15} className="text-survyx-blue" />
              Consult Officer Arya Sharma
            </button>
          </div>
        </div>

        {/* Ambient background grid & glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
          <SurvyxLogo size="xl" showText={false} />
        </div>
      </section>

      {/* Core Institutional Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          value="₹450M+" 
          label="Vault Volume Secured" 
          subtext="Under multi-milestone custody"
          icon={<Lock size={18} className="text-survyx-blue" />}
        />
        <StatCard 
          value="12,400+" 
          label="Verified Enterprises" 
          subtext="GSTN & ROC validated"
          icon={<Building2 size={18} className="text-emerald-500" />}
        />
        <StatCard 
          value="99.98%" 
          label="Dispute Resolution Rate" 
          subtext="Arbitrated by statutory SLA"
          icon={<Scale size={18} className="text-purple-500" />}
        />
        <StatCard 
          value="0.00%" 
          label="Unchecked Default Loss" 
          subtext="Protected by 3-tier Escrow"
          icon={<ShieldCheck size={18} className="text-amber-500" />}
        />
      </section>

      {/* The Problem We Solve */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
        <div className="max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-survyx-blue">Market Breakdown</p>
          <h2 className="text-2xl sm:text-3xl font-black text-survyx-navy tracking-tight mt-1">
            Bridging the Global $2.5 Trillion Enterprise Trust Deficit
          </h2>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Traditional B2B procurement is plagued by unverified brokers, delayed wire settlements, opaque quality certifications, and bilateral non-delivery risks. SURVYX replaces manual mistrust with mathematically enforced milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-900">Legacy Trade Blindspots</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unverified PDF invoices, phantom suppliers, and unbacked advance payments result in billions lost to industrial supply chain fraud annually.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-survyx-blue flex items-center justify-center font-bold">
              <Layers size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-900">The SURVYX Solution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every participant receives an immutable Enterprise Unique Identifier (EUID). Capital is locked into tripartite milestone vaults (30% Intake / 40% Transit / 30% QA).
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-900">AI-Powered Compliance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time computer vision document scanning and statutory auditing conducted by Officer Arya Sharma to ensure instant regulatory validity.
            </p>
          </div>
        </div>
      </section>

      {/* The 4 Architectural Pillars */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-survyx-blue">Technical Foundation</p>
          <h2 className="text-3xl font-black text-survyx-navy tracking-tight">Four Pillars of Sovereign Trade</h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Engineered from first principles to exceed statutory banking and commercial regulatory frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PillarBlock 
            number="01"
            title="Sovereign Identity Protocol (EUID)"
            subtitle="Government-Grade Entity Validation"
            desc="Every business undergoes direct integration audits against GSTN, Ministry of Corporate Affairs (MCA), and IEC import-export databases. Only verified corporate signatories are granted trading keys."
            badge="MCA21 & GSTN Synchronized"
            icon={<Building2 size={22} className="text-survyx-blue" />}
          />

          <PillarBlock 
            number="02"
            title="3-Tier Cryptographic Escrow"
            subtitle="Zero Counterparty Settlement Risk"
            desc="Buyer funds are locked in RBI-compliant custodial trust accounts. 30% is released upon certified raw material intake, 40% upon dispatch with verified Bill of Lading, and 30% upon final NABL QA signoff."
            badge="Tripartite Escrow Mandate"
            icon={<Lock size={22} className="text-emerald-500" />}
          />

          <PillarBlock 
            number="03"
            title="Optical Document Scanner & OCR"
            subtitle="Automated Statutory Ingestion"
            desc="Built-in camera telemetry uses deep document models to parse Invoices, Test Certificates, PAN, and COI instantly, extracting entity IDs, tax amounts, and compliance signatures automatically."
            badge="Real-time Vision OCR"
            icon={<FileText size={22} className="text-purple-500" />}
          />

          <PillarBlock 
            number="04"
            title="Officer Arya Sharma & Arbitration"
            subtitle="Autonomous Trade Concierge & Governance"
            desc="24/7 AI Officer assists with institutional RFQ drafting, NABL test specification audits, dispute locks, and statutory mediation with formal legal case records."
            badge="Survyx AI Copilot v4.2"
            icon={<Bot size={22} className="text-amber-500" />}
          />
        </div>
      </section>

      {/* Governance & Compliance Standards */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-survyx-blue">Regulatory Rigor</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Statutory Governance & Security
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Compliant with national and international commercial trade regulations.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-emerald-400">
            <CheckCircle2 size={14} />
            <span>ISO 27001 / SOC-2 Type II Certified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CompliancePill title="RBI Escrow Norms" desc="Full adherence to nodal account mandates" />
          <CompliancePill title="256-Bit TLS & At-Rest" desc="End-to-end cryptographic state encryption" />
          <CompliancePill title="GSTN Direct API" desc="Live tax filing and verification health check" />
          <CompliancePill title="Statutory Dispute SLA" desc="Binding 48-hour arbitration resolution window" />
        </div>
      </section>

      {/* Leadership & Advisory */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-survyx-blue">Our Governance Team</p>
          <h2 className="text-2xl sm:text-3xl font-black text-survyx-navy tracking-tight">Executive Leadership & Advisory</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <LeaderCard 
            name="Vikramaditya Sen"
            role="Chief Executive Officer"
            background="Ex-Managing Director, Global Supply Chain Infrastructure"
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
          />
          <LeaderCard 
            name="Meera Chandrasekaran"
            role="Chief Regulatory Officer"
            background="Former Senior Counsel, Institutional Banking & Escrow Governance"
            image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
          />
          <LeaderCard 
            name="Rohan Deshmukh"
            role="Head of Cryptographic Systems"
            background="Specialist in Distributed Settlement Ledgers & Multi-Party Escrow"
            image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
          />
          <LeaderCard 
            name="Officer Arya Sharma"
            role="Head of AI Trade Concierge"
            background="Autonomous Multi-Modal Compliance & RFQ Structuring Lead"
            image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
            isAi
          />
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-survyx-navy to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Start Trading with Total Escrow Certainty.
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            Register your entity profile today to receive your official EUID and unlock institutional procurement.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleAction}
            className="bg-survyx-blue hover:bg-white hover:text-survyx-navy text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            {user ? 'Enter Hub' : 'Register Now'}
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </motion.div>
  );
}

function StatCard({ value, label, subtext, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-2xl sm:text-3xl font-black text-survyx-navy font-mono tracking-tight">{value}</span>
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      </div>
      <div>
        <p className="text-xs font-black text-slate-900">{label}</p>
        <p className="text-[10px] text-slate-500 font-medium">{subtext}</p>
      </div>
    </div>
  );
}

function PillarBlock({ number, title, subtitle, desc, badge, icon }: any) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between group hover:border-survyx-blue transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            {icon}
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">{number}</span>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-survyx-blue">{subtitle}</p>
          <h3 className="text-lg font-black text-survyx-navy mt-0.5">{title}</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-normal">{desc}</p>
      </div>
      <div className="pt-4 mt-4 border-t border-slate-100">
        <span className="text-[9px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
          {badge}
        </span>
      </div>
    </div>
  );
}

function CompliancePill({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
        <Check size={14} className="text-emerald-400 shrink-0" />
        <span>{title}</span>
      </div>
      <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
    </div>
  );
}

function LeaderCard({ name, role, background, image, isAi }: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col">
      <div className="h-44 overflow-hidden relative bg-slate-100">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        {isAi && (
          <div className="absolute top-3 right-3 bg-survyx-navy/90 backdrop-blur-sm text-blue-300 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border border-white/20 flex items-center gap-1">
            <Sparkles size={10} className="text-survyx-blue" />
            AI Official
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h4 className="text-sm font-black text-slate-900">{name}</h4>
          <p className="text-[10px] font-bold text-survyx-blue uppercase tracking-wider">{role}</p>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">{background}</p>
      </div>
    </div>
  );
}
