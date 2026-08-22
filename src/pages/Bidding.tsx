import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gavel, Clock, Users, ArrowUpRight, Plus, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useUserJourney } from '../context/UserJourneyContext';
import { RFQItem } from '../types';

export default function Bidding() {
  const { state, punchRequirement } = useUserJourney();
  const { rfqs } = state;

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Heavy Manufacturing');
  const [budget, setBudget] = useState('₹18,00,000');
  const [description, setDescription] = useState('');
  const [bidSubmittedId, setBidSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      punchRequirement({
        title,
        category,
        budget,
        description: description || 'Institutional standard requirement with NABL certified audit.'
      });
      setTitle('');
      setDescription('');
      setShowModal(false);
    }
  };

  const handleBidClick = (id: string) => {
    setBidSubmittedId(id);
    setTimeout(() => setBidSubmittedId(null), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8 pb-20"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2 text-survyx-blue mb-1">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Governed Trading Floor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Live Institutional RFQs</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Verified bidding matrices backed by multi-signature escrow covenants.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-survyx-navy text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Initialize RFQ
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {rfqs.map((rfq) => (
           <BidCard 
             key={rfq.id} 
             rfq={rfq} 
             onBidSubmit={() => handleBidClick(rfq.id)}
             isSubmitted={bidSubmittedId === rfq.id}
           />
         ))}
      </div>

      {/* Initialize RFQ Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-survyx-navy">
                  <Gavel size={20} />
                  <h3 className="text-base font-black uppercase tracking-tight">Create Institutional RFQ</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                    Item / Specification Title
                  </label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Bulk Aluminum Ingots 99.7% Pure"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      Category
                    </label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option>Heavy Manufacturing</option>
                      <option>Renewable Energy Infrastructure</option>
                      <option>Automotive & EV Supply</option>
                      <option>Consumer Electronics (B2B)</option>
                      <option>Chemicals & Polymers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      Budget (INR)
                    </label>
                    <input 
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. ₹20,00,000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                    Requirement Notes / Scope
                  </label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Provide technical specifications, delivery timeline, or required test certifications..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-survyx-navy hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md transition-all"
                  >
                    Publish RFQ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BidCard({ 
  rfq, 
  onBidSubmit, 
  isSubmitted 
}: { 
  key?: React.Key;
  rfq: RFQItem; 
  onBidSubmit: () => void; 
  isSubmitted: boolean;
}) {
  const { title, id, quantity, bidsCount, timeRemaining, category, budget, description } = rfq;

  return (
    <div className="registry-card p-6 sm:p-8 bg-white border border-slate-100 relative overflow-hidden group hover:border-survyx-blue transition-all shadow-sm">
       <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg tracking-widest border border-slate-100">
            {id}
          </span>
          <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
             <Clock size={12} className="text-amber-600" />
             <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">
               Closes in {timeRemaining}
             </span>
          </div>
       </div>

       <div className="mb-2">
         <span className="text-[8px] font-black uppercase tracking-widest text-survyx-blue bg-blue-50 px-2 py-0.5 rounded">
           {category}
         </span>
       </div>

       <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-survyx-blue transition-colors mb-2">
         {title}
       </h4>
       
       <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
         {description || `Institutional requirement: ${quantity}`}
       </p>

       <div className="flex items-center justify-between py-3 border-y border-slate-50 text-xs">
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Budget: </span>
            <span className="font-bold text-slate-800">{budget}</span>
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">BOM Scope: </span>
            <span className="font-bold text-slate-800">{quantity}</span>
          </div>
       </div>
       
       <div className="mt-4 pt-2 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                    SV
                  </div>
                ))}
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-none">
                  {bidsCount} Entities
                </p>
                <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Participating</p>
             </div>
          </div>

          {isSubmitted ? (
            <span className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
              <CheckCircle2 size={12} /> Bid Registered
            </span>
          ) : (
            <button 
              onClick={onBidSubmit}
              className="flex items-center gap-1.5 text-[10px] font-black text-survyx-navy uppercase tracking-widest hover:text-survyx-blue transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              Submit Bid <ArrowUpRight size={14} />
            </button>
          )}
       </div>
    </div>
  );
}
