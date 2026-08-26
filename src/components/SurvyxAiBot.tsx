import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  Gavel, 
  Building2, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useUserJourney } from '../context/UserJourneyContext';
import { getAryaResponse } from '../services/geminiService';

const SUGGESTED_PROMPTS = [
  {
    icon: <Gavel size={13} className="text-blue-500" />,
    label: "Draft RFQ for Solar Inverters",
    prompt: "Can you help me structure an institutional RFQ for 5000 units of heavy duty solar capacitors with NABL testing requirements?"
  },
  {
    icon: <ShieldCheck size={13} className="text-emerald-500" />,
    label: "Explain Escrow Milestones",
    prompt: "How does the Survyx 3-tier milestone Escrow (30%-40%-30%) protect my company from supplier non-delivery?"
  },
  {
    icon: <Building2 size={13} className="text-purple-500" />,
    label: "Entity Verification Requirements",
    prompt: "What documents do I need to upload to achieve Platinum Trust Clearance and unlock unlimited vault volume?"
  },
  {
    icon: <Lock size={13} className="text-amber-500" />,
    label: "Dispute Arbitration Process",
    prompt: "What is the procedure if delivered raw materials fail QA testing at the staging yard?"
  }
];

export default function SurvyxAiBot() {
  const { 
    state, 
    setCurrentView, 
    sendMessage, 
    addOfficerMessage,
    punchRequirement
  } = useUserJourney();

  const { 
    messages, 
    profile, 
    euid, 
    tradeMode, 
    trustScore, 
    verificationStatus, 
    totalSecuredVolume,
    currentView 
  } = state;

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isLoading) return;

    // Add user message to context
    sendMessage(query);
    setInputValue('');
    setIsLoading(true);

    // Build context object
    const sessionContext = `
User Profile:
- Business: ${profile.businessName}
- EUID: ${euid}
- Signatory: ${profile.authorizedSignatory}
- Industry: ${profile.industryCategory}
- Verification: ${verificationStatus.toUpperCase()} (Trust Score: ${trustScore}/1000)
- Trade Mode: ${tradeMode === 'consumer' ? 'Procurement Buyer' : 'Supplier/Vendor'}
- Total Secured Vault Volume: ₹${totalSecuredVolume.toLocaleString('en-IN')}
- Current View: ${currentView}
`;

    try {
      const reply = await getAryaResponse(query, sessionContext);
      addOfficerMessage(reply);
    } catch (err) {
      addOfficerMessage("Officer Arya Sharma here. I am monitoring your trade ledger and registry status. Let me know if you would like me to assist with RFQ structuring or Escrow compliance.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleActionClick = (actionType: string) => {
    if (actionType === 'vault') {
      setCurrentView('vault');
      setIsOpen(false);
    } else if (actionType === 'rfqs' || actionType === 'bids') {
      setCurrentView('bids');
      setIsOpen(false);
    } else if (actionType === 'verification') {
      setCurrentView('verification');
      setIsOpen(false);
    } else if (actionType === 'dashboard') {
      setCurrentView('dashboard');
      setIsOpen(false);
    }
  };

  return (
    <div id="survyx-ai-bot-container" className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="survyx-ai-bot-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 bg-survyx-navy hover:bg-slate-900 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl shadow-blue-900/30 border border-white/20 transition-all"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-survyx-blue to-cyan-400 flex items-center justify-center text-white shadow-md">
                <Sparkles size={16} className="animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-survyx-navy rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-black tracking-tight text-white flex items-center gap-1.5">
                Survyx AI Copilot
                <span className="bg-survyx-blue text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">Live</span>
              </span>
              <span className="text-[9px] font-medium text-slate-300">Trade, RFQ & Escrow Guide</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* AI Bot Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="survyx-ai-bot-window"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300 ${
              isExpanded 
                ? 'w-[95vw] md:w-[720px] h-[85vh] max-w-4xl' 
                : 'w-[95vw] sm:w-[420px] h-[600px] max-h-[90vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-survyx-navy text-white p-4 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-survyx-blue to-cyan-500 p-0.5 shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
                      alt="Officer Arya" 
                      className="w-full h-full object-cover rounded-2xl" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-survyx-navy rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black tracking-tight text-white">Officer Arya Sharma</h3>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 text-[8px] font-mono font-bold">SVX-402</span>
                  </div>
                  <p className="text-[10px] text-blue-200/80 font-medium">Senior Registry & Escrow Governance Officer</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  title="Close Assistant"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Context Header Strip */}
            <div className="bg-slate-50 border-b border-slate-200/70 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-slate-600 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-survyx-navy">{euid}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 truncate max-w-[150px]">{profile.businessName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Trust:</span>
                <span className="font-bold text-survyx-blue">{trustScore}/1000</span>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
              {messages.map((msg, idx) => {
                const isOfficer = msg.role !== 'user';
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isOfficer ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-start gap-2 max-w-[90%]">
                      {isOfficer && (
                        <div className="w-6 h-6 rounded-lg bg-survyx-navy text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-1">
                          A
                        </div>
                      )}
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm group relative ${
                          isOfficer
                            ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                            : 'bg-survyx-navy text-white rounded-tr-sm'
                        }`}
                      >
                        <div className="whitespace-pre-line">
                          {msg.content}
                        </div>

                        {/* Quick action buttons if AI mentioned certain domains */}
                        {isOfficer && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                            {msg.content.toLowerCase().includes('escrow') && (
                              <button
                                onClick={() => handleActionClick('vault')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-survyx-blue text-[9px] font-black uppercase rounded-md transition-colors"
                              >
                                <Lock size={10} /> Open Vault
                              </button>
                            )}
                            {msg.content.toLowerCase().includes('rfq') && (
                              <button
                                onClick={() => handleActionClick('bids')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-survyx-blue text-[9px] font-black uppercase rounded-md transition-colors"
                              >
                                <Gavel size={10} /> RFQ Portal
                              </button>
                            )}
                            {msg.content.toLowerCase().includes('verification') && (
                              <button
                                onClick={() => handleActionClick('verification')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[9px] font-black uppercase rounded-md transition-colors"
                              >
                                <Building2 size={10} /> KYC Registry
                              </button>
                            )}
                            <button
                              onClick={() => handleCopyText(msg.content, idx)}
                              className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 text-slate-400 hover:text-slate-700 text-[9px] font-mono transition-colors"
                              title="Copy response"
                            >
                              {copiedIndex === idx ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                              <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                );
              })}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-6 h-6 rounded-lg bg-survyx-navy text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-1">
                    A
                  </div>
                  <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-sm text-xs text-slate-500 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-survyx-blue animate-ping" />
                    <span>Officer Arya is checking the trade ledger & registry...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Pill Section */}
            <div className="p-2.5 bg-white border-t border-slate-100 shrink-0">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1 flex items-center gap-1">
                <Sparkles size={11} className="text-survyx-blue" />
                Instant Trade Intelligence
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {SUGGESTED_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    disabled={isLoading}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 text-slate-700 hover:text-survyx-navy text-[10px] font-medium rounded-xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white border-t border-slate-200/80 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-end gap-2 bg-slate-50 border border-slate-200 focus-within:border-survyx-blue focus-within:ring-2 focus-within:ring-survyx-blue/10 rounded-2xl p-2 transition-all"
              >
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Officer Arya about RFQ specs, Escrow status, KYC or dispute locks..."
                  rows={isExpanded ? 2 : 1}
                  className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 resize-none outline-none max-h-24 px-1 py-1"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 rounded-xl bg-survyx-navy hover:bg-survyx-blue text-white disabled:opacity-30 disabled:hover:bg-survyx-navy transition-all shrink-0 active:scale-95 shadow-md"
                  title="Send message"
                >
                  <Send size={14} />
                </button>
              </form>
              <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 px-1 mt-1.5">
                <span>Press Enter to send • Shift+Enter for newline</span>
                <span>SURVYX Protocol v4.2</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
