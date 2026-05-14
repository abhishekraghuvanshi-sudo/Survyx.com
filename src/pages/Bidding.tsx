import React from 'react';
import { motion } from 'motion/react';
import { Gavel, Clock, Users, ArrowUpRight } from 'lucide-react';

export default function Bidding() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8"
    >
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Governed Trade Portal</h2>
          <p className="text-sm text-slate-500">Live institutional RFQs and bidding matrices.</p>
        </div>
        <button className="bg-survyx-navy text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all">
          + Initialize RFQ
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <BidCard title="Bulk Aluminum Ingots" id="RFQ-8822" quantity="10 Tons" bids={14} time="4h 12m" />
         <BidCard title="Heavy Duty Capacitors" id="RFQ-7731" quantity="5000 Units" bids={28} time="1d 4h" />
         <BidCard title="Mild Steel Sheets" id="RFQ-9901" quantity="100 Sheets" bids={6} time="12h 30m" />
         <BidCard title="Industrial Belts" id="RFQ-4491" quantity="200 Sets" bids={19} time="45m" />
      </div>
    </motion.div>
  );
}

function BidCard({ title, id, quantity, bids, time }: any) {
  return (
    <div className="registry-card p-8 bg-white border border-slate-100 relative overflow-hidden group hover:border-survyx-blue transition-all">
       <div className="flex justify-between items-start mb-6">
          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg tracking-widest border border-slate-100">{id}</span>
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
             <Clock size={12} className="text-orange-600" />
             <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Closes in {time}</span>
          </div>
       </div>
       <h4 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-survyx-blue transition-colors mb-2">{title}</h4>
       <p className="text-xs text-slate-500">Requirement: <span className="font-bold text-slate-700">{quantity}</span></p>
       
       <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />
                ))}
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-none">{bids} Entities</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Participating</p>
             </div>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-bold text-survyx-navy uppercase tracking-widest hover:text-survyx-blue transition-colors">
            Submit Bid <ArrowUpRight size={14} />
          </button>
       </div>
    </div>
  );
}
