import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Lock, 
  Gavel, 
  Building2, 
  CheckCircle2, 
  Copy, 
  Check,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useUserJourney } from '../context/UserJourneyContext';
import { getPriyaResponse } from '../services/geminiService';

const QUICK_CHIPS = [
  "Draft an RFQ for 10 Tons Aluminum Ingots (99.7% Pure)",
  "How does 3-tier Escrow (30-40-30) protect against non-delivery?",
  "What documents are missing for Platinum Verification?",
  "How do I trigger an emergency trade lock or dispute?"
];

export default function Chat() {
  const { state, setCurrentView, sendMessage, addOfficerMessage, clearChat } = useUserJourney();
  const { messages, euid, verificationStatus, profile, totalSecuredVolume, dispute, trustScore } = state;

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || input.trim();
    if (!text || isTyping) return;

    setInput('');
    sendMessage(text);
    setIsTyping(true);

    try {
      const context = `
User: ${profile.authorizedSignatory} (${profile.businessName})
EUID: ${euid}
Verification Status: ${verificationStatus} (Trust Score: ${trustScore}/1000)
Escrow Secured Volume: ₹${totalSecuredVolume.toLocaleString('en-IN')}
Dispute Active: ${dispute.isActive ? `Yes (${dispute.caseId} - ${dispute.reason})` : 'No'}
`;

      const response = await getPriyaResponse(text, context);
      addOfficerMessage(response);
    } catch (err) {
      addOfficerMessage("Officer Priya here. I am reviewing the statutory registry records for your company. How may I assist your trade governance further?");
    } finally {
      setIsTyping(false);
    }
  };

  const copyText = (txt: string, i: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="registry-card h-[calc(100vh-160px)] md:h-[calc(100vh-190px)] flex flex-col overflow-hidden shadow-2xl border border-slate-200 bg-white rounded-3xl"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 bg-survyx-navy text-white flex justify-between items-center shadow-lg relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-survyx-blue to-cyan-400 p-0.5 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
                alt="Officer Priya" 
                className="w-full h-full object-cover rounded-2xl" 
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-survyx-navy" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold tracking-tight">Officer Priya Krishnamurthy</p>
              <span className="text-[8px] font-black uppercase bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded">
                Senior Trade Official
              </span>
            </div>
            <div className="flex items-center gap-1.5 opacity-80">
              <ShieldCheck size={11} className="text-blue-300" />
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-200">
                Registry SecureLine • EUID: {euid}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-[9px] font-bold text-slate-300 uppercase">Trust:</span>
            <span className="text-xs font-black text-survyx-blue">{trustScore}/1000</span>
          </div>
          <button 
            onClick={clearChat}
            className="text-[9px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all flex items-center gap-1 text-slate-200 hover:text-white"
            title="Reset Chat History"
          >
            <RefreshCw size={11} /> Reset
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((m, i) => {
          const isUser = m.role === 'user';
          return (
            <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] sm:max-w-[78%] p-4 rounded-2xl shadow-sm space-y-2 ${
                isUser 
                  ? 'bg-survyx-navy text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
              }`}>
                <p className="text-xs sm:text-sm leading-relaxed font-medium whitespace-pre-wrap">{m.content}</p>
                
                {!isUser && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-2">
                      {m.content.toLowerCase().includes('escrow') && (
                        <button 
                          onClick={() => setCurrentView('vault')}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-survyx-blue text-[9px] font-black uppercase rounded transition-colors flex items-center gap-1"
                        >
                          <Lock size={10} /> Escrow Vault
                        </button>
                      )}
                      {m.content.toLowerCase().includes('rfq') && (
                        <button 
                          onClick={() => setCurrentView('bids')}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-survyx-blue text-[9px] font-black uppercase rounded transition-colors flex items-center gap-1"
                        >
                          <Gavel size={10} /> RFQ Portal
                        </button>
                      )}
                      {m.content.toLowerCase().includes('verification') && (
                        <button 
                          onClick={() => setCurrentView('verification')}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[9px] font-black uppercase rounded transition-colors flex items-center gap-1"
                        >
                          <Building2 size={10} /> KYC Registry
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={() => copyText(m.content, i)}
                      className="text-[9px] font-mono text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
                    >
                      {copiedIdx === i ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                      <span>{copiedIdx === i ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                <div className={`flex items-center gap-2 pt-1 font-bold uppercase tracking-[0.1em] text-[8px] ${
                  isUser ? 'text-white/50' : 'text-slate-400'
                }`}>
                  <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>•</span>
                  <span>{isUser ? 'Authorized Signatory' : 'Senior Registry Official'}</span>
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-survyx-blue rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-survyx-blue rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-survyx-blue rounded-full animate-bounce"></span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Officer Priya is analyzing statutory records & trade ledger...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
        {QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            disabled={isTyping}
            className="shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-survyx-navy text-[10px] font-medium rounded-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex space-x-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text" 
            placeholder="Instruct Officer Priya (e.g., 'Draft RFQ for 5000 Solar Inverters', 'Explain Escrow Milestone 2 release')..." 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-xs sm:text-sm focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:bg-white focus:outline-none transition-all placeholder:text-slate-400" 
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-survyx-navy text-white px-5 py-3 rounded-xl shadow-md hover:bg-survyx-blue transition-all group disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
          >
            <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
