import React from 'react';
import { motion } from 'motion/react';
import { Send, MoreVertical, ShieldCheck } from 'lucide-react';

interface ChatProps {
  messages: any[];
  input: string;
  setInput: (v: string) => void;
  sendMessage: () => void;
  isTyping: boolean;
  key?: React.Key;
}

export default function Chat({ messages, input, setInput, sendMessage, isTyping }: ChatProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="registry-card h-[calc(100vh-160px)] md:h-[calc(100vh-220px)] flex flex-col overflow-hidden shadow-2xl border-2 border-survyx-navy/10 bg-white"
    >
      <div className="p-5 bg-survyx-navy text-white flex justify-between items-center shadow-lg relative z-10">
         <div className="flex items-center space-x-4">
            <div className="relative">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" className="w-11 h-11 rounded-2xl bg-white/10 p-0.5 border border-white/20 shadow-inner" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-survyx-navy animate-pulse" />
            </div>
            <div>
               <p className="text-sm font-bold tracking-tight">Officer Priya</p>
               <div className="flex items-center gap-1.5 opacity-60">
                  <ShieldCheck size={10} />
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em]">Registry SecureLine Online</p>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all">Audit Log</button>
            <MoreVertical size={20} className="opacity-40" />
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30">
         {messages.map((m, i) => (
           <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm ${m.role === 'user' ? 'bg-survyx-blue text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                 <p className="text-sm leading-relaxed antialiased font-medium">{m.content}</p>
                 <div className={`flex items-center gap-2 mt-2 font-bold uppercase tracking-[0.1em] text-[8px] ${m.role === 'user' ? 'text-white/40' : 'text-slate-300'}`}>
                    <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span>{m.role === 'user' ? 'Encrypted' : 'Registry Official'}</span>
                 </div>
              </div>
           </div>
         ))}
         {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white p-5 rounded-3xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-3">
                <div className="flex gap-1">
                   <span className="w-1.5 h-1.5 bg-survyx-blue rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                   <span className="w-1.5 h-1.5 bg-survyx-blue rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                   <span className="w-1.5 h-1.5 bg-survyx-blue rounded-full animate-bounce"></span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priya is analyzing registry data...</span>
             </div>
           </div>
         )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
         <div className="flex space-x-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              type="text" 
              placeholder="Instruct Officer Priya (e.g., 'Draft RFQ', 'Release Milestone')..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-survyx-blue focus:bg-white focus:outline-none transition-all placeholder:text-slate-400" 
            />
            <button 
              onClick={sendMessage} 
              className="bg-survyx-navy text-white p-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-black transition-all group"
            >
               <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
         </div>
      </div>
    </motion.div>
  );
}
