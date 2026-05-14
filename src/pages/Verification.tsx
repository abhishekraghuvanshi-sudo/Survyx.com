import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  FileText, 
  Building2, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';

export default function Verification() {
  const [step, setStep] = React.useState(1);
  const [status] = React.useState<'pending' | 'review' | 'verified'>('pending');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-10 pb-20"
    >
      {/* Header & Status Tracker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-survyx-blue">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Network Compliance</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Entity Verification Hub</h2>
          <p className="text-slate-500 text-sm font-medium">Verify your business identity to unlock institutional trade volume.</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
           <StatusStep 
              label="Onboarding" 
              status={status === 'pending' ? 'active' : 'complete'} 
              icon={<FileText size={14} />} 
           />
           <div className="w-8 h-px bg-slate-100" />
           <StatusStep 
              label="Registry Audit" 
              status={status === 'review' ? 'active' : status === 'verified' ? 'complete' : 'pending'} 
              icon={<Clock size={14} />} 
           />
           <div className="w-8 h-px bg-slate-100" />
           <StatusStep 
              label="Verified" 
              status={status === 'verified' ? 'active' : 'pending'} 
              icon={<CheckCircle2 size={14} />} 
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Form/Upload Area */}
        <div className="lg:col-span-8 space-y-8">
           {status === 'pending' && (
             <div className="space-y-8">
                <div className="registry-card bg-white border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-survyx-navy text-white rounded-xl flex items-center justify-center font-black">01</div>
                         <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Institutional Profile</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Basic entity identification</p>
                         </div>
                      </div>
                   </div>
                   <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Legal Business Name" placeholder="As per GST/PAN" />
                      <InputField label="Entity Structure" placeholder="e.g. Private Limited" />
                      <InputField label="Registered Office Address" placeholder="Full legal address" className="md:col-span-2" />
                   </div>
                </div>

                <div className="registry-card bg-white border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-survyx-navy text-white rounded-xl flex items-center justify-center font-black">02</div>
                         <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Compliance Documents</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Upload verified government records</p>
                         </div>
                      </div>
                   </div>
                   <div className="p-8 space-y-6">
                      <UploadRow 
                         title="GST Registration Certificate" 
                         desc="Latest GST filing or registration copy (PDF/JPG)"
                         id="GST-UPL"
                      />
                      <UploadRow 
                         title="PAN Card (Entity/Individual)" 
                         desc="Clear scan of the business or authorized signatory PAN"
                         id="PAN-UPL"
                      />
                      <UploadRow 
                         title="Certificate of Incorporation (COI)" 
                         desc="Official ROC document or business license"
                         id="COI-UPL"
                      />
                   </div>
                </div>

                <div className="flex items-center justify-between bg-survyx-navy p-8 rounded-3xl text-white shadow-2xl shadow-blue-900/10">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl">
                         <ShieldCheck size={24} className="text-survyx-blue" />
                      </div>
                      <div>
                         <p className="text-sm font-black uppercase tracking-tight">Registry Declaration</p>
                         <p className="text-[10px] text-slate-400 font-medium">I certify that all documents provided are true and legally binding.</p>
                      </div>
                   </div>
                   <button className="bg-survyx-blue hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 group">
                      Initial Audit <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
           )}

           {status === 'review' && (
              <div className="registry-card p-12 text-center bg-white border border-slate-100 shadow-sm">
                 <div className="w-20 h-20 bg-blue-50 text-survyx-blue rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Clock size={40} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">Registry Audit In-Progress</h3>
                 <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
                    Our compliance officers are currently validating your PAN and GST records against government databases. This typicality takes 4-6 business hours.
                 </p>
                 <div className="flex items-center justify-center gap-8 py-6 border-y border-slate-50 mb-8">
                    <div className="text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue Position</p>
                       <p className="text-xl font-bold text-slate-900">#42</p>
                    </div>
                    <div className="w-px h-10 bg-slate-100" />
                    <div className="text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Completion</p>
                       <p className="text-xl font-bold text-slate-900">Today, 4:00 PM</p>
                    </div>
                 </div>
                 <button className="text-survyx-blue font-black text-[10px] uppercase tracking-[0.2em] hover:underline">
                    Contact Assigned Registry Officer
                 </button>
              </div>
           )}
        </div>

        {/* Sidebar Guidance */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <Info size={24} className="text-survyx-blue" />
                 </div>
                 <h4 className="text-lg font-black tracking-tight mb-4 uppercase">Verification <br />Guideline</h4>
                 <ul className="space-y-4">
                    <li className="flex gap-3 text-xs text-slate-400">
                       <CheckCircle2 size={14} className="text-survyx-blue shrink-0 mt-0.5" />
                       Ensure documents are not password protected.
                    </li>
                    <li className="flex gap-3 text-xs text-slate-400">
                       <CheckCircle2 size={14} className="text-survyx-blue shrink-0 mt-0.5" />
                       Business name must exactly match your Trade License.
                    </li>
                    <li className="flex gap-3 text-xs text-slate-400">
                       <CheckCircle2 size={14} className="text-survyx-blue shrink-0 mt-0.5" />
                       PAN should be visible and unedited.
                    </li>
                 </ul>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-survyx-blue/10 rounded-full blur-3xl" />
           </div>

           <div className="registry-card p-8 border-dashed border-2 border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                 <AlertCircle size={18} className="text-slate-400" />
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Why Verify?</h5>
              </div>
              <p className="text-sm font-bold text-slate-800 tracking-tight leading-relaxed">
                 Verified nodes get <span className="text-survyx-blue">3x more trade visibility</span> and access to SURVYX Institutional Liquidity pools.
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusStep({ label, status, icon }: { label: string, status: 'pending' | 'active' | 'complete', icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
       <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          status === 'complete' ? 'bg-green-500 text-white' : 
          status === 'active' ? 'bg-survyx-navy text-white' : 
          'bg-slate-100 text-slate-400'
       }`}>
          {status === 'complete' ? <CheckCircle2 size={14} /> : icon}
       </div>
       <span className={`text-[10px] font-black uppercase tracking-widest ${
          status === 'pending' ? 'text-slate-300' : 'text-slate-900'
       }`}>{label}</span>
    </div>
  );
}

function InputField({ label, placeholder, className }: { label: string, placeholder: string, className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type="text" 
        placeholder={placeholder} 
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-survyx-blue/10 focus:border-survyx-blue focus:bg-white focus:outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  );
}

function UploadRow({ title, desc, id }: { title: string, desc: string, id: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-2xl gap-4 group hover:bg-slate-50 transition-all">
       <div>
          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</p>
          <p className="text-[10px] font-medium text-slate-400 mt-1">{desc}</p>
       </div>
       <button id={id} className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-survyx-blue hover:border-survyx-blue transition-all">
          <Upload size={14} />
          Upload
       </button>
    </div>
  );
}
