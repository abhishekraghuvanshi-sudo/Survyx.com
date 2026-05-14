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
  Bell
} from 'lucide-react';

import { getPriyaResponse } from './services/geminiService';
import { NavButton, MobileNavBtn } from './components/Navigation';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Bidding from './pages/Bidding';
import Vault from './pages/Vault';
import Repository from './pages/Repository';
import Verification from './pages/Verification';
import Chat from './pages/Chat';

// --- Types ---
export type View = 'landing' | 'auth' | 'dashboard' | 'bids' | 'vault' | 'verification' | 'chat' | 'repository';

interface Message {
  role: 'user' | 'priya';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [currentView, setCurrentView] = React.useState<View>('landing');
  const [user, setUser] = React.useState<{ email: string } | null>(null);
  const [euid] = React.useState('SVX-IND-8829-QL');
  const [tradeMode, setTradeMode] = React.useState<'consumer' | 'provider'>('consumer');
  
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: 'priya',
      content: "Greetings. I am Priya, your assigned Registry Officer. I have pre-validated your Tier-1 certification status. How can I assist your trade governance today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getPriyaResponse(input, `User EUID: ${euid}, View: ${currentView}`);
    setMessages(prev => [...prev, { role: 'priya', content: response, timestamp: new Date() }]);
    setIsTyping(false);
  };

  if (currentView === 'landing' && !user) {
    return <Landing onGetStarted={() => setCurrentView('auth')} />;
  }

  if (currentView === 'auth' || (!user && currentView !== 'landing')) {
    return (
      <Auth 
        onLogin={(email) => {
          setUser({ email });
          setCurrentView('dashboard');
        }} 
        onBack={() => setCurrentView('landing')} 
      />
    );
  }

  return (
    <div className="min-h-screen pb-28 md:pb-0 md:pl-64 bg-slate-50/50 selection:bg-survyx-blue selection:text-white">
      {/* Top Header (Desktop) - Match Screenshot */}
      <header className="hidden md:flex fixed top-0 right-0 left-64 h-16 bg-white border-b border-slate-100 z-30 px-8 items-center justify-between">
        <div className="flex items-center space-x-2">
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">SURVYX.com</span>
        </div>
        <div className="flex items-center gap-6">
           <button className="text-slate-400 hover:text-survyx-navy transition-colors relative">
             <Bell size={18} />
             <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
           </button>
           <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
             <div className="text-right">
                <p className="text-[11px] font-black text-slate-900 leading-none">Abhishek</p>
                <button onClick={() => { setUser(null); setCurrentView('landing'); }} className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 hover:text-red-500">Sign Out</button>
             </div>
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abhishek" className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200" />
           </div>
        </div>
      </header>

      {/* Sidebar Navigation - Match Screenshot Style */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-survyx-navy text-white flex-col z-50">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center space-x-3 mb-10 px-2">
            <div className="w-9 h-9 bg-survyx-blue rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-blue-500/20 text-lg">S</div>
            <div className="flex flex-col -space-y-1">
              <h1 className="text-xl font-black tracking-tighter uppercase">SURVYX<span className="text-survyx-blue">.com</span></h1>
              <span className="text-[7px] font-black uppercase tracking-[0.1em] text-blue-300">Global Hub Status</span>
            </div>
          </div>
          
          <nav className="space-y-1 flex-1">
            <NavButton active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<LayoutDashboard size={18}/>} label="Dashboard" />
            <NavButton active={currentView === 'bids'} onClick={() => setCurrentView('bids')} icon={<Gavel size={18}/>} label="RFQ Portal" />
            <NavButton active={currentView === 'vault'} onClick={() => setCurrentView('vault')} icon={<ShieldCheck size={18}/>} label="Escrow Management" />
            <NavButton active={currentView === 'chat'} onClick={() => setCurrentView('chat')} icon={<MessageSquare size={18}/>} label="Trade Concierge" />
            <NavButton active={currentView === 'verification'} onClick={() => setCurrentView('verification')} icon={<Building2 size={18}/>} label="Network Registry" />
            
            <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
               <NavButton active={currentView === 'repository'} onClick={() => setCurrentView('repository')} icon={<User size={18}/>} label="My Profile" />
               <NavButton active={false} onClick={() => {}} icon={<Settings size={18}/>} label="Settings" />
            </div>
          </nav>

          <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
             <button 
                onClick={() => setTradeMode(prev => prev === 'consumer' ? 'provider' : 'consumer')}
                className="w-full bg-white/5 hover:bg-white/10 px-4 py-3 rounded-xl flex items-center justify-between group transition-all"
             >
                <div className="flex flex-col items-start">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Hub Context</span>
                   <span className="text-[8px] font-bold uppercase text-survyx-blue">{tradeMode === 'consumer' ? 'Consumer Mode' : 'Provider Mode'}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                   <ChevronDown size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                </div>
             </button>

             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-3">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Trust Profile</p>
                   <ShieldCheck size={12} className="text-survyx-blue" />
                </div>
                <div className="flex items-end justify-between">
                   <p className="text-2xl font-black text-white italic tracking-tighter">96.2%</p>
                   <div className="px-1.5 py-0.5 bg-green-500 text-white rounded text-[7px] font-black uppercase tracking-widest">Verified</div>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-6 py-10 md:px-10 md:pt-24 min-h-screen">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && <Dashboard key="dashboard" setView={setCurrentView} euid={euid} mode={tradeMode} />}
          {currentView === 'bids' && <Bidding key="bids" />}
          {currentView === 'vault' && <Vault key="vault" />}
          {currentView === 'repository' && <Repository key="repository" />}
          {currentView === 'verification' && <Verification key="verification" />}
          {currentView === 'chat' && (
            <Chat 
              key="chat" 
              messages={messages} 
              input={input} 
              setInput={setInput} 
              sendMessage={sendMessage} 
              isTyping={isTyping}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-slate-200 px-6 py-4 pb-8 flex justify-between items-center md:hidden z-50">
        <MobileNavBtn active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<LayoutDashboard size={20}/>} label="Hub" />
        <MobileNavBtn active={currentView === 'bids'} onClick={() => setCurrentView('bids')} icon={<Gavel size={20}/>} label="Trade" />
        <div className="relative">
          <button 
            onClick={() => setCurrentView('chat')}
            className={`-translate-y-12 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all ${currentView === 'chat' ? 'bg-survyx-blue text-white ring-8 ring-survyx-slate' : 'bg-survyx-navy text-white hover:scale-105'}`}
          >
            <MessageSquare size={24} />
          </button>
        </div>
        <MobileNavBtn active={currentView === 'vault'} onClick={() => setCurrentView('vault')} icon={<Lock size={20}/>} label="Vault" />
        <MobileNavBtn active={currentView === 'repository'} onClick={() => setCurrentView('repository')} icon={<FileText size={20}/>} label="Docs" />
      </nav>
    </div>
  );
}

