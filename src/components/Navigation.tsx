import React from 'react';

export function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all ${active ? 'bg-survyx-blue text-white shadow-lg shadow-blue-900/50' : 'text-blue-100/60 hover:bg-white/5'}`}
    >
      {icon}
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

export function MobileNavBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center space-y-1 ${active ? 'text-survyx-blue' : 'text-slate-400'}`}>
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}
