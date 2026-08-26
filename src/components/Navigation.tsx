import React from 'react';

export function NavButton({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number | string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${active ? 'bg-survyx-blue text-white shadow-lg shadow-blue-900/50' : 'text-blue-100/60 hover:bg-white/5'}`}
    >
      <div className="flex items-center space-x-4">
        {icon}
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {badge !== undefined && Number(badge) > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
          {badge}
        </span>
      )}
    </button>
  );
}

export function MobileNavBtn({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number | string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center space-y-1 relative ${active ? 'text-survyx-blue' : 'text-slate-400'}`}>
      <div className="relative">
        {icon}
        {badge !== undefined && Number(badge) > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}
