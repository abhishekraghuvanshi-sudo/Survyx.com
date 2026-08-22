import React from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ShieldCheck, 
  Gavel, 
  Lock, 
  MessageSquare, 
  LayoutDashboard,
  ArrowRight,
  FileText,
  User,
  Settings,
  ChevronDown,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

import { UserJourneyProvider, useUserJourney } from './context/UserJourneyContext';
import { NavButton, MobileNavBtn } from './components/Navigation';
import SurvyxAiBot from './components/SurvyxAiBot';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Bidding from './pages/Bidding';
import Vault from './pages/Vault';
import Repository from './pages/Repository';
import Verification from './pages/Verification';
import Chat from './pages/Chat';

function AppContent() {
  const {
    state,
    setCurrentView,
    loginUser,
    logoutUser,
    setTradeMode
  } = useUserJourney();

  const { currentView, user, profile, trustScore, verificationStatus, tradeMode, euid } = state;

  if (currentView === 'landing' && !user) {
    return (
      <>
        <Landing onGetStarted={() => setCurrentView('auth')} />
        <SurvyxAiBot />
      </>
    );
  }

  if (currentView === 'auth' || (!user && currentView !== 'landing')) {
    return (
      <>
        <Auth 
          onLogin={(email) => {
            loginUser(email);
          }} 
          onBack={() => setCurrentView('landing')} 
        />
        <SurvyxAiBot />
      </>
    );
  }

  const displayName = profile.authorizedSignatory.split(' ')[0] || user?.name || 'Abhishek';
  const trustPercent = `${Math.round((trustScore / 1000) * 100)}%`;

  return (
    <div className="min-h-screen pb-28 md:pb-0 md:pl-64 bg-slate-50/50 selection:bg-survyx-blue selection:text-white">
      {/* Top Header (Desktop) */}
      <header className="hidden md:flex fixed top-0 right-0 left-64 h-16 bg-white border-b border-slate-100 z-30 px-8 items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center space-x-3">
           <span className="text-[11px] font-black text-survyx-navy tracking-tight uppercase">SURVYX.com</span>
           <span className="text-slate-300">/</span>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">EUID: {euid}</span>
        </div>
        <div className="flex items-center gap-6">
           <button 
             onClick={() => setCurrentView('chat')}
             className="text-slate-400 hover:text-survyx-navy transition-colors relative p-2 rounded-lg hover:bg-slate-50"
             title="Notifications & Alerts"
           >
             <Bell size={18} />
             <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-survyx-blue rounded-full border-2 border-white" />
           </button>
           <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
             <div className="text-right">
                <p className="text-[11px] font-black text-slate-900 leading-none">{displayName}</p>
                <button 
                  onClick={logoutUser} 
                  className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 hover:text-red-500 transition-colors"
                >
                  Sign Out
                </button>
             </div>
             <img 
               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} 
               alt={displayName}
               className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200" 
             />
           </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-survyx-navy text-white flex-col z-50">
        <div className="p-6 flex flex-col h-full">
          <div 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center space-x-3 mb-8 px-2 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-survyx-blue rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-blue-500/20 text-lg group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col -space-y-1">
              <h1 className="text-xl font-black tracking-tighter uppercase">SURVYX<span className="text-survyx-blue">.com</span></h1>
              <span className="text-[7px] font-black uppercase tracking-[0.1em] text-blue-300">Global Hub Status</span>
            </div>
          </div>
          
          <nav className="space-y-1 flex-1">
            <NavButton 
              active={currentView === 'dashboard'} 
              onClick={() => setCurrentView('dashboard')} 
              icon={<LayoutDashboard size={18}/>} 
              label="Dashboard" 
            />
            <NavButton 
              active={currentView === 'bids'} 
              onClick={() => setCurrentView('bids')} 
              icon={<Gavel size={18}/>} 
              label="RFQ Portal" 
            />
            <NavButton 
              active={currentView === 'vault'} 
              onClick={() => setCurrentView('vault')} 
              icon={<ShieldCheck size={18}/>} 
              label="Escrow Vault" 
            />
            <NavButton 
              active={currentView === 'chat'} 
              onClick={() => setCurrentView('chat')} 
              icon={<MessageSquare size={18}/>} 
              label="Trade Concierge" 
            />
            <NavButton 
              active={currentView === 'verification'} 
              onClick={() => setCurrentView('verification')} 
              icon={<Building2 size={18}/>} 
              label="Entity Registry" 
            />
            
            <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
               <NavButton 
                 active={currentView === 'repository'} 
                 onClick={() => setCurrentView('repository')} 
                 icon={<FileText size={18}/>} 
                 label="Repository" 
               />
            </div>
          </nav>

          <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
             <button 
                onClick={() => setTradeMode(tradeMode === 'consumer' ? 'provider' : 'consumer')}
                className="w-full bg-white/5 hover:bg-white/10 px-4 py-3 rounded-xl flex items-center justify-between group transition-all text-left"
             >
                <div className="flex flex-col items-start">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Hub Context</span>
                   <span className="text-[8px] font-bold uppercase text-survyx-blue">
                     {tradeMode === 'consumer' ? 'Procurement Lead' : 'Service Provider'}
                   </span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                   <ChevronDown size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                </div>
             </button>

             <div 
               onClick={() => setCurrentView('verification')}
               className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 cursor-pointer transition-all"
             >
                <div className="flex items-center justify-between mb-3">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Trust Profile</p>
                   <ShieldCheck size={12} className="text-survyx-blue" />
                </div>
                <div className="flex items-end justify-between">
                   <p className="text-2xl font-black text-white italic tracking-tighter">{trustPercent}</p>
                   <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest flex items-center gap-1 ${
                     verificationStatus === 'verified'
                       ? 'bg-green-500 text-white'
                       : verificationStatus === 'under_review'
                       ? 'bg-blue-500 text-white'
                       : 'bg-amber-500 text-white'
                   }`}>
                     {verificationStatus === 'verified' && <CheckCircle2 size={9} />}
                     {verificationStatus === 'under_review' && <Clock size={9} />}
                     {verificationStatus === 'verified' ? 'Verified' : verificationStatus === 'under_review' ? 'In Audit' : 'Draft'}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:px-10 md:pt-24 min-h-screen">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && <Dashboard key="dashboard" />}
          {currentView === 'bids' && <Bidding key="bids" />}
          {currentView === 'vault' && <Vault key="vault" />}
          {currentView === 'repository' && <Repository key="repository" />}
          {currentView === 'verification' && <Verification key="verification" />}
          {currentView === 'chat' && <Chat key="chat" />}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-slate-200 px-6 py-4 pb-8 flex justify-between items-center md:hidden z-50">
        <MobileNavBtn 
          active={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')} 
          icon={<LayoutDashboard size={20}/>} 
          label="Hub" 
        />
        <MobileNavBtn 
          active={currentView === 'bids'} 
          onClick={() => setCurrentView('bids')} 
          icon={<Gavel size={20}/>} 
          label="Trade" 
        />
        <div className="relative">
          <button 
            onClick={() => setCurrentView('chat')}
            className={`-translate-y-6 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all ${
              currentView === 'chat' 
                ? 'bg-survyx-blue text-white ring-8 ring-slate-100' 
                : 'bg-survyx-navy text-white hover:scale-105'
            }`}
          >
            <MessageSquare size={24} />
          </button>
        </div>
        <MobileNavBtn 
          active={currentView === 'vault'} 
          onClick={() => setCurrentView('vault')} 
          icon={<Lock size={20}/>} 
          label="Vault" 
        />
        <MobileNavBtn 
          active={currentView === 'repository'} 
          onClick={() => setCurrentView('repository')} 
          icon={<FileText size={20}/>} 
          label="Docs" 
        />
      </nav>

      {/* Omnipresent Survyx AI Assistant Bot */}
      <SurvyxAiBot />
    </div>
  );
}

export default function App() {
  return (
    <UserJourneyProvider>
      <AppContent />
    </UserJourneyProvider>
  );
}
