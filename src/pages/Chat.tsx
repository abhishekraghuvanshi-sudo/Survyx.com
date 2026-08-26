import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  FileText,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Clock,
  ExternalLink,
  MessageSquare,
  Shield,
  Layers,
  Inbox,
  Filter,
  CheckCheck,
  Trash2,
  Eye,
  Info,
  DollarSign,
  Tag,
  Briefcase
} from 'lucide-react';
import { useUserJourney } from '../context/UserJourneyContext';
import { getAryaResponse } from '../services/geminiService';
import { AppNotification, NotificationCategory, NotificationPriority, View } from '../types';

const QUICK_CHIPS = [
  "Draft an RFQ for 10 Tons Aluminum Ingots (99.7% Pure)",
  "How does 3-tier Escrow (30-40-30) protect against non-delivery?",
  "What is the status of Milestone 2 logistics verification?",
  "Review Tata Steel's ₹27.8L bid on RFQ-8822",
  "How do I upgrade from Gold to Platinum Registry tier?"
];

export default function Chat() {
  const { 
    state, 
    setCurrentView, 
    sendMessage, 
    addOfficerMessage, 
    clearChat,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification
  } = useUserJourney();

  const { 
    messages, 
    notifications = [], 
    euid, 
    verificationStatus, 
    profile, 
    totalSecuredVolume, 
    dispute, 
    trustScore,
    governanceTier 
  } = state;

  // View mode: 'chat' | 'notifications' | 'split'
  const [activeTab, setActiveTab] = useState<'chat' | 'notifications'>('chat');
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'ALL'>('ALL');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const escrowCount = notifications.filter(n => n.category === 'Escrow Updates').length;
  const registryCount = notifications.filter(n => n.category === 'Registry Alerts').length;
  const marketplaceCount = notifications.filter(n => n.category === 'Marketplace Offers').length;

  useEffect(() => {
    if (scrollRef.current && activeTab === 'chat') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeTab]);

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
Governance Tier: ${governanceTier}
Verification Status: ${verificationStatus} (Trust Score: ${trustScore}/1000)
Escrow Secured Volume: ₹${totalSecuredVolume.toLocaleString('en-IN')}
Dispute Active: ${dispute.isActive ? `Yes (${dispute.caseId} - ${dispute.reason})` : 'No'}
Active Unread Notifications: ${unreadCount}
`;

      const response = await getAryaResponse(text, context);
      addOfficerMessage(response);
    } catch (err) {
      addOfficerMessage("Officer Arya Sharma here. I am reviewing the statutory registry records for your company. How may I assist your trade governance further?");
    } finally {
      setIsTyping(false);
    }
  };

  const handleAskAryaAboutNotification = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    setActiveTab('chat');
    const prompt = `Officer Arya, please analyze this alert regarding "${notif.title}" (Ref: ${notif.referenceId || 'N/A'}, Category: ${notif.category}). What statutory compliance steps or trade actions should I take?`;
    handleSend(prompt);
  };

  const handleExecuteNotificationAction = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.targetView) {
      setCurrentView(notif.targetView);
    }
  };

  const copyText = (txt: string, i: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    const matchesCategory = selectedCategory === 'ALL' || n.category === selectedCategory;
    const matchesUnread = !filterUnreadOnly || !n.read;
    const matchesSearch = !searchQuery || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.referenceId && n.referenceId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.entityName && n.entityName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesUnread && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="registry-card h-[calc(100vh-140px)] md:h-[calc(100vh-165px)] flex flex-col overflow-hidden shadow-2xl border border-slate-200 bg-white rounded-3xl"
    >
      {/* Top Header & Tab Navigation Bar */}
      <div className="p-4 sm:p-5 bg-survyx-navy text-white flex flex-wrap justify-between items-center gap-3 shadow-lg relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-survyx-blue to-cyan-400 p-0.5 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
                alt="Officer Arya Sharma" 
                className="w-full h-full object-cover rounded-2xl" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-survyx-navy" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold tracking-tight">Officer Arya Sharma</p>
              <span className="text-[8px] font-black uppercase bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded">
                Trade Concierge & Registry
              </span>
            </div>
            <div className="flex items-center gap-1.5 opacity-80">
              <ShieldCheck size={11} className="text-blue-300" />
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-200">
                Sovereign EUID: {euid} • {governanceTier} Tier
              </p>
            </div>
          </div>
        </div>

        {/* Dual Mode Switcher: Live Concierge vs Notifications Feed */}
        <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'chat'
                ? 'bg-survyx-blue text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare size={14} />
            <span>Officer Arya</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative ${
              activeTab === 'notifications'
                ? 'bg-survyx-blue text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bell size={14} />
            <span>Alerts Feed</span>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Aux Controls */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-[9px] font-bold text-slate-300 uppercase">Trust Score:</span>
            <span className="text-xs font-black text-cyan-300">{trustScore}/1000</span>
          </div>

          {activeTab === 'chat' ? (
            <button 
              onClick={clearChat}
              className="text-[9px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all flex items-center gap-1 text-slate-200 hover:text-white"
              title="Reset Chat History"
            >
              <RefreshCw size={11} /> Reset
            </button>
          ) : (
            <button 
              onClick={markAllNotificationsAsRead}
              className="text-[9px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all flex items-center gap-1 text-slate-200 hover:text-white"
              title="Mark All Notifications as Read"
            >
              <CheckCheck size={12} /> Mark Read
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: NOTIFICATIONS FEED                                                */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/60">
          {/* Sub-Header / Category Filter Navigation */}
          <div className="p-4 bg-white border-b border-slate-200/80 shadow-sm space-y-3">
            {/* Top Bar: Counts & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Inbox size={16} className="text-survyx-blue" />
                  Institutional Alerts & Trade Notifications
                </h3>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {filteredNotifications.length} Active
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    filterUnreadOnly
                      ? 'bg-blue-50 text-survyx-blue border-blue-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {filterUnreadOnly ? 'Showing Unread' : 'Filter Unread'}
                </button>

                <button
                  onClick={markAllNotificationsAsRead}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <CheckCheck size={13} />
                  <span>Mark All Read</span>
                </button>
              </div>
            </div>

            {/* Category Pills Bar: All, Escrow Updates, Registry Alerts, Marketplace Offers */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              <CategoryPill
                label="All Alerts"
                count={notifications.length}
                active={selectedCategory === 'ALL'}
                onClick={() => setSelectedCategory('ALL')}
                icon={<Layers size={13} />}
                color="blue"
              />

              <CategoryPill
                label="Escrow Updates"
                count={escrowCount}
                active={selectedCategory === 'Escrow Updates'}
                onClick={() => setSelectedCategory('Escrow Updates')}
                icon={<Lock size={13} />}
                color="indigo"
              />

              <CategoryPill
                label="Registry Alerts"
                count={registryCount}
                active={selectedCategory === 'Registry Alerts'}
                onClick={() => setSelectedCategory('Registry Alerts')}
                icon={<ShieldCheck size={13} />}
                color="purple"
              />

              <CategoryPill
                label="Marketplace Offers"
                count={marketplaceCount}
                active={selectedCategory === 'Marketplace Offers'}
                onClick={() => setSelectedCategory('Marketplace Offers')}
                icon={<Briefcase size={13} />}
                color="amber"
              />
            </div>
          </div>

          {/* Notifications List Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-survyx-blue flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">All Registry & Escrow Alerts Cleared</p>
                  <p className="text-xs text-slate-400 mt-1">
                    No active notifications found for category "{selectedCategory}".
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedCategory('ALL'); setFilterUnreadOnly(false); }}
                  className="text-xs font-bold text-survyx-blue hover:underline pt-2"
                >
                  View All Notifications
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notif) => (
                  <NotificationCard
                    key={notif.id}
                    notif={notif}
                    onMarkRead={() => markNotificationAsRead(notif.id)}
                    onDismiss={() => dismissNotification(notif.id)}
                    onAskArya={() => handleAskAryaAboutNotification(notif)}
                    onAction={() => handleExecuteNotificationAction(notif)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: LIVE CONCIERGE (OFFICER ARYA SHARMA CHAT)                         */}
      {/* ========================================================================= */}
      {activeTab === 'chat' && (
        <>
          {/* Urgent Notifications Alert Bar */}
          {unreadCount > 0 && (
            <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <p className="text-xs text-slate-700 font-medium">
                  <strong className="text-slate-900 font-bold">{unreadCount} unread alert{unreadCount > 1 ? 's' : ''}</strong> pending in your Escrow & Marketplace Feed.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('notifications')}
                className="text-xs font-black uppercase text-survyx-blue hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                <span>View Feed</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div ref={scrollRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m, i) => {
              const isUser = m.role === 'user';
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] sm:max-w-[80%] p-4 rounded-2xl shadow-sm space-y-2.5 ${
                    isUser 
                      ? 'bg-survyx-navy text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}>
                    <p className="text-xs sm:text-sm leading-relaxed font-medium whitespace-pre-wrap">{m.content}</p>
                    
                    {!isUser && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {m.content.toLowerCase().includes('escrow') && (
                            <button 
                              onClick={() => setCurrentView('vault')}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-survyx-blue text-[9px] font-black uppercase rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Lock size={10} /> Escrow Vault
                            </button>
                          )}
                          {m.content.toLowerCase().includes('rfq') && (
                            <button 
                              onClick={() => setCurrentView('bids')}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-survyx-blue text-[9px] font-black uppercase rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Gavel size={10} /> RFQ Marketplace
                            </button>
                          )}
                          {m.content.toLowerCase().includes('verification') && (
                            <button 
                              onClick={() => setCurrentView('verification')}
                              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[9px] font-black uppercase rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Building2 size={10} /> KYC Registry
                            </button>
                          )}
                          {m.content.toLowerCase().includes('document') && (
                            <button 
                              onClick={() => setCurrentView('repository')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-lg transition-colors flex items-center gap-1"
                            >
                              <FileText size={10} /> Repository
                            </button>
                          )}
                        </div>
                        <button 
                          onClick={() => copyText(m.content, i)}
                          className="text-[9px] font-mono text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors ml-auto"
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
                    Officer Arya is querying sovereign registry records & trade ledger...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
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

          {/* Chat Input */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex space-x-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text" 
                placeholder="Instruct Officer Arya (e.g., 'Analyze Milestone 2 release terms', 'Draft RFQ for 5000 Solar Inverters')..." 
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
        </>
      )}
    </motion.div>
  );
}

/* ========================================================================= */
/* SUB-COMPONENTS: CATEGORY PILL & NOTIFICATION CARD                         */
/* ========================================================================= */

function CategoryPill({
  label,
  count,
  active,
  onClick,
  icon,
  color
}: {
  key?: React.Key;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  color: 'blue' | 'indigo' | 'purple' | 'amber';
}) {
  const activeStyles = {
    blue: 'bg-survyx-blue text-white shadow-sm border-survyx-blue',
    indigo: 'bg-indigo-600 text-white shadow-sm border-indigo-600',
    purple: 'bg-purple-600 text-white shadow-sm border-purple-600',
    amber: 'bg-amber-600 text-white shadow-sm border-amber-600'
  }[color];

  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
        active
          ? activeStyles
          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
      }`}
    >
      <span className={active ? 'text-white' : 'text-slate-500'}>{icon}</span>
      <span>{label}</span>
      <span className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full ${
        active ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
      }`}>
        {count}
      </span>
    </button>
  );
}

function NotificationCard({
  notif,
  onMarkRead,
  onDismiss,
  onAskArya,
  onAction
}: {
  key?: React.Key;
  notif: AppNotification;
  onMarkRead: () => void;
  onDismiss: () => void;
  onAskArya: () => void;
  onAction: () => void;
}) {
  const categoryConfig = {
    'Escrow Updates': {
      badgeBg: 'bg-blue-50 text-survyx-blue border-blue-200',
      icon: <Lock size={14} className="text-survyx-blue" />,
      accentBorder: 'border-l-4 border-l-survyx-blue'
    },
    'Registry Alerts': {
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <ShieldCheck size={14} className="text-purple-600" />,
      accentBorder: 'border-l-4 border-l-purple-600'
    },
    'Marketplace Offers': {
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Briefcase size={14} className="text-amber-600" />,
      accentBorder: 'border-l-4 border-l-amber-500'
    }
  }[notif.category];

  const priorityStyles = {
    urgent: 'bg-red-100 text-red-700 border-red-200 font-black',
    high: 'bg-amber-100 text-amber-800 border-amber-200 font-bold',
    normal: 'bg-slate-100 text-slate-600 border-slate-200 font-medium'
  }[notif.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-sm hover:shadow-md ${
        categoryConfig.accentBorder
      } ${!notif.read ? 'bg-blue-50/20 border-blue-200/80 ring-1 ring-blue-500/10' : 'border-slate-200/80'}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left Info Zone */}
        <div className="space-y-2 flex-1">
          {/* Header Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${categoryConfig.badgeBg}`}>
              {categoryConfig.icon}
              {notif.category}
            </span>

            {notif.priority !== 'normal' && (
              <span className={`text-[9px] uppercase px-2 py-0.5 rounded-md border ${priorityStyles}`}>
                {notif.priority} Priority
              </span>
            )}

            {notif.referenceId && (
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                {notif.referenceId}
              </span>
            )}

            <span className="text-[10px] text-slate-400 font-medium ml-auto flex items-center gap-1">
              <Clock size={11} /> {notif.timestamp}
            </span>
          </div>

          {/* Title & Entity */}
          <div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              {!notif.read && <span className="w-2 h-2 rounded-full bg-survyx-blue shrink-0" />}
              {notif.title}
            </h4>
            {notif.entityName && (
              <p className="text-xs font-bold text-slate-600 mt-0.5 flex items-center gap-1">
                <Building2 size={12} className="text-slate-400" />
                <span>{notif.entityName}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {notif.description}
          </p>

          {/* Monetary Highlight */}
          {notif.amount && (
            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-mono font-black text-survyx-blue">
              <DollarSign size={12} />
              <span>Amount: {notif.amount}</span>
            </div>
          )}

          {/* Officer Arya Note Box */}
          {notif.officerNote && (
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 flex items-start gap-2 mt-2">
              <Sparkles size={13} className="text-survyx-blue shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-bold">Officer Arya Insight: </strong>
                <span>{notif.officerNote}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions Cluster */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onAskArya}
              className="bg-survyx-navy hover:bg-survyx-blue text-white px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Consult Officer Arya regarding this alert"
            >
              <Sparkles size={12} />
              <span>Ask Arya</span>
            </button>

            {notif.actionLabel && notif.targetView && (
              <button
                onClick={onAction}
                className="bg-survyx-blue hover:bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm active:scale-95"
              >
                <span>{notif.actionLabel}</span>
                <ChevronRight size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            {!notif.read ? (
              <button
                onClick={onMarkRead}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
                title="Mark as read"
              >
                <Check size={12} /> Mark Read
              </button>
            ) : (
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <Check size={12} /> Read
              </span>
            )}

            <button
              onClick={onDismiss}
              className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors"
              title="Dismiss notification"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
