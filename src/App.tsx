import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
  AlertCircle,
  LogOut,
  Users,
  Sparkles,
  Plus,
  Shield,
  Check
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
    activeAccount,
    registeredAccounts,
    setCurrentView,
    loginUser,
    switchAccount,
    logoutUser,
    setTradeMode
  } = useUserJourney();

  const { currentView, user, profile, trustScore, verificationStatus, tradeMode, euid } = state;
  const [showAccountMenu, setShowAccountMenu] = useState(false);

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
          onLogin={(email, passwordOrName, customData) => {
            loginUser(email, passwordOrName, customData);
          }} 
          onBack={() => setCurrentView('landing')} 
        />
        <SurvyxAiBot />
      </>
    );
  }

  const displayName = profile.authorizedSignatory || user?.name || 'Abhishek Raghuvanshi';
  const displayFirstName = displayName.split(' ')[0];
  const trustPercent = `${Math.round((trustScore / 1000) * 100)}%`;

  return (
    <div className="min-h-screen pb-28 md:pb-0 md:pl-64 bg-slate-50/50 selection:bg-survyx-blue selection:text-white font-sans">
      {/* Top Header (Desktop) */}
      <header className="hidden md:flex fixed top-0 right-0 left-64 h-16 bg-white/95 backdrop-blur-md border-b border-slate-100 z-30 px-8 items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center space-x-3">
           <span className="text-[11px] font-black text-survyx-navy tracking-tight uppercase">SURVYX.com</span>
           <span className="text-slate-300">/</span>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
             EUID: {euid}
           </span>
           <span className="text-slate-300">/</span>
           <span className="text-[11px] font-black text-slate-700 truncate max-w-xs">
             {profile.businessName}
           </span>
        </div>

        <div className="flex items-center gap-5">
           {/* Active Session Storage Indicator */}
           <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-200/60">
             <ShieldCheck size={13} className="text-emerald-600" />
             <span>Registry Session Saved</span>
           </div>

           <button 
             onClick={() => setCurrentView('chat')}
             className="text-slate-400 hover:text-survyx-navy transition-colors relative p-2 rounded-lg hover:bg-slate-50"
             title="Trade Concierge Notifications"
           >
             <Bell size={18} />
             <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-survyx-blue rounded-full border-2 border-white" />
           </button>

           {/* Account & Profile Trigger */}
           <div className="relative">
             <button
               onClick={() => setShowAccountMenu(!showAccountMenu)}
               className="flex items-center gap-3 pl-4 border-l border-slate-100 hover:opacity-90 transition-all text-left"
             >
               <div className="text-right">
                  <p className="text-[11px] font-black text-slate-900 leading-none">{displayFirstName}</p>
                  <p className="text-[8px] font-bold text-survyx-blue uppercase tracking-wider mt-0.5">
                    {activeAccount?.role || 'Buyer'} Account
                  </p>
               </div>
               <img 
                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} 
                 alt={displayName}
                 className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200" 
               />
               <ChevronDown size={14} className="text-slate-400" />
             </button>

             {/* Account Switcher Dropdown */}
             <AnimatePresence>
               {showAccountMenu && (
                 <>
                   <div 
                     className="fixed inset-0 z-40" 
                     onClick={() => setShowAccountMenu(false)} 
                   />
                   <motion.div
                     initial={{ opacity: 0, y: 8, scale: 0.96 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 8, scale: 0.96 }}
                     className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-xs"
                   >
                     <div className="pb-3 border-b border-slate-100">
                       <div className="flex items-center justify-between mb-1">
                         <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Current Entity Session</span>
                         <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                       </div>
                       <p className="text-xs font-black text-slate-900">{displayName}</p>
                       <p className="text-[10px] text-slate-500 font-medium truncate">{profile.businessName}</p>
                       <p className="text-[10px] font-mono text-slate-400 mt-1">{user?.email}</p>
                     </div>

                     {/* Saved accounts to switch */}
                     <div className="py-3 border-b border-slate-100">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                           <Users size={11} /> Saved Accounts ({registeredAccounts.length})
                         </span>
                       </div>
                       <div className="space-y-1.5 max-h-44 overflow-y-auto">
                         {registeredAccounts.map((acc) => {
                           const isCurrent = acc.email.toLowerCase() === user?.email.toLowerCase();
                           return (
                             <button
                               key={acc.id}
                               onClick={() => {
                                 switchAccount(acc.id);
                                 setShowAccountMenu(false);
                               }}
                               className={`w-full text-left p-2 rounded-xl border flex items-center justify-between transition-all ${
                                 isCurrent 
                                   ? 'bg-blue-50/70 border-blue-200 text-survyx-navy font-bold' 
                                   : 'bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-700'
                               }`}
                             >
                               <div className="truncate mr-2">
                                 <p className="text-[11px] font-bold truncate leading-tight">{acc.name}</p>
                                 <p className="text-[9px] text-slate-500 truncate">{acc.businessName}</p>
                               </div>
                               {isCurrent ? (
                                 <Check size={13} className="text-survyx-blue shrink-0" />
                               ) : (
                                 <span className="text-[8px] font-black uppercase tracking-wider text-blue-600 shrink-0">Switch</span>
                               )}
                             </button>
                           );
                         })}
                       </div>
                     </div>

                     <div className="pt-2 flex flex-col gap-1">
                       <button
                         onClick={() => {
                           setShowAccountMenu(false);
                           setCurrentView('verification');
                         }}
                         className="flex items-center gap-2 p-2 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors"
                       >
                         <Building2 size={14} className="text-slate-400" />
                         <span>Manage Entity Profile</span>
                       </button>

                       <button
                         onClick={() => {
                           setShowAccountMenu(false);
                           setCurrentView('auth');
                         }}
                         className="flex items-center gap-2 p-2 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors"
                       >
                         <Plus size={14} className="text-slate-400" />
                         <span>Add Another Entity</span>
                       </button>

                       <button
                         onClick={() => {
                           setShowAccountMenu(false);
                           logoutUser();
                         }}
                         className="flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
                       >
                         <LogOut size={14} />
                         <span>Sign Out & Clear Session</span>
                       </button>
                     </div>
                   </motion.div>
                 </>
               )}
             </AnimatePresence>
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
