import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  FileText, 
  Building2, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Info,
  Trash2,
  FileCheck,
  Zap,
  Sparkles,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Award
} from 'lucide-react';
import { useUserJourney } from '../context/UserJourneyContext';

export default function Verification() {
  const {
    state,
    setCurrentView,
    updateVerificationProfile,
    uploadVerificationDoc,
    removeVerificationDoc,
    submitVerificationAudit,
    approveVerificationNow,
    resetVerification
  } = useUserJourney();

  const { profile, documents, verificationStatus, auditInfo, trustScore, governanceTier } = state;

  const gstInputRef = useRef<HTMLInputElement>(null);
  const panInputRef = useRef<HTMLInputElement>(null);
  const coiInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (type: 'gst' | 'pan' | 'coi', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadVerificationDoc(type, {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  const triggerUpload = (type: 'gst' | 'pan' | 'coi') => {
    if (type === 'gst') gstInputRef.current?.click();
    if (type === 'pan') panInputRef.current?.click();
    if (type === 'coi') coiInputRef.current?.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-8 pb-20"
    >
      {/* Hidden File Inputs */}
      <input type="file" ref={gstInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload('gst', e)} />
      <input type="file" ref={panInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload('pan', e)} />
      <input type="file" ref={coiInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload('coi', e)} />

      {/* Header & Status Tracker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-survyx-blue">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Network Compliance Registry</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Entity Verification Hub</h2>
          <p className="text-slate-500 text-sm font-medium">Verify your business identity to unlock institutional trade volume & escrow liquidity.</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
           <StatusStep 
              label="Onboarding" 
              status={verificationStatus === 'draft' || verificationStatus === 'unstarted' ? 'active' : 'complete'} 
              icon={<FileText size={14} />} 
           />
           <div className="w-8 h-px bg-slate-200" />
           <StatusStep 
              label="Registry Audit" 
              status={verificationStatus === 'under_review' ? 'active' : verificationStatus === 'verified' ? 'complete' : 'pending'} 
              icon={<Clock size={14} />} 
           />
           <div className="w-8 h-px bg-slate-200" />
           <StatusStep 
              label="Verified" 
              status={verificationStatus === 'verified' ? 'complete' : 'pending'} 
              icon={<CheckCircle2 size={14} />} 
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Area */}
        <div className="lg:col-span-8 space-y-6">

          {/* STATE 1: ONBOARDING / DRAFT */}
          {(verificationStatus === 'draft' || verificationStatus === 'unstarted') && (
             <div className="space-y-6">
                <div className="registry-card bg-white border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-4">
                         <div className="w-9 h-9 bg-survyx-navy text-white rounded-xl flex items-center justify-center font-black text-sm">01</div>
                         <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Institutional Profile</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Basic entity identification & GSTN link</p>
                         </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-blue-50 text-survyx-blue px-2.5 py-1 rounded-md border border-blue-100">
                        Auto-Saved
                      </span>
                   </div>
                   <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">Legal Business Name</label>
                        <input 
                          type="text" 
                          value={profile.businessName}
                          onChange={(e) => updateVerificationProfile({ businessName: e.target.value })}
                          placeholder="As per GST/PAN" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-survyx-blue/10 focus:border-survyx-blue focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">Entity Structure</label>
                        <select 
                          value={profile.entityStructure}
                          onChange={(e) => updateVerificationProfile({ entityStructure: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-survyx-blue/10 focus:border-survyx-blue focus:bg-white focus:outline-none transition-all"
                        >
                          <option>Private Limited Company</option>
                          <option>Public Limited Company</option>
                          <option>Limited Liability Partnership (LLP)</option>
                          <option>Partnership Firm</option>
                          <option>Proprietorship</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">GSTIN (15 Digits)</label>
                        <input 
                          type="text" 
                          value={profile.gstin}
                          onChange={(e) => updateVerificationProfile({ gstin: e.target.value.toUpperCase() })}
                          placeholder="e.g. 27AABCU9603R1ZM" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-survyx-blue/10 focus:border-survyx-blue focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">Company PAN (10 Digits)</label>
                        <input 
                          type="text" 
                          value={profile.pan}
                          onChange={(e) => updateVerificationProfile({ pan: e.target.value.toUpperCase() })}
                          placeholder="e.g. AABCU9603R" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-survyx-blue/10 focus:border-survyx-blue focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">Registered Office Address</label>
                        <input 
                          type="text" 
                          value={profile.officeAddress}
                          onChange={(e) => updateVerificationProfile({ officeAddress: e.target.value })}
                          placeholder="Full legal address with PIN code" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-survyx-blue/10 focus:border-survyx-blue focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                   </div>
                </div>

                <div className="registry-card bg-white border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-4">
                         <div className="w-9 h-9 bg-survyx-navy text-white rounded-xl flex items-center justify-center font-black text-sm">02</div>
                         <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Compliance Documents</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Upload statutory government certificates</p>
                         </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase">
                        {(Object.values(documents) as any[]).filter((d: any) => d.uploaded).length}/3 Uploaded
                      </span>
                   </div>
                   <div className="p-6 space-y-4">
                      <UploadRowItem 
                        title="GST Registration Certificate" 
                        desc="Form GST REG-06 showing active status"
                        id="GST-UPL"
                        doc={documents.gst}
                        onUpload={() => triggerUpload('gst')}
                        onRemove={() => removeVerificationDoc('gst')}
                      />
                      <UploadRowItem 
                        title="PAN Card (Entity/Signatory)" 
                        desc="Clear scan of authorized PAN card"
                        id="PAN-UPL"
                        doc={documents.pan}
                        onUpload={() => triggerUpload('pan')}
                        onRemove={() => removeVerificationDoc('pan')}
                      />
                      <UploadRowItem 
                        title="Certificate of Incorporation (COI)" 
                        desc="Official MCA / ROC certificate or Trade License"
                        id="COI-UPL"
                        doc={documents.coi}
                        onUpload={() => triggerUpload('coi')}
                        onRemove={() => removeVerificationDoc('coi')}
                      />
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between bg-survyx-navy p-6 rounded-2xl text-white shadow-xl shadow-blue-950/20 gap-4">
                   <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/10 rounded-xl">
                         <ShieldCheck size={20} className="text-survyx-blue" />
                      </div>
                      <div>
                         <p className="text-xs font-black uppercase tracking-tight">Registry Declaration</p>
                         <p className="text-[10px] text-slate-400 font-medium">I certify that all documents submitted are valid, unaltered, and legally binding.</p>
                      </div>
                   </div>
                   <button 
                     onClick={submitVerificationAudit}
                     className="w-full sm:w-auto bg-survyx-blue hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-900/40 shrink-0"
                   >
                      Submit For Audit <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
          )}

          {/* STATE 2: UNDER REVIEW */}
          {verificationStatus === 'under_review' && (
             <div className="space-y-6">
                <div className="registry-card p-8 text-center bg-white border border-slate-100 shadow-sm relative overflow-hidden">
                   <div className="w-16 h-16 bg-blue-50 text-survyx-blue rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse border-4 border-blue-100">
                      <Clock size={32} />
                   </div>
                   <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[9px] font-black uppercase tracking-widest inline-block mb-3">
                      Audit In Progress
                   </span>
                   <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">Registry Audit In-Progress</h3>
                   <p className="text-slate-500 max-w-md mx-auto mb-6 text-xs leading-relaxed">
                      Assigned Officer <span className="font-bold text-slate-800">{auditInfo.assignedOfficer}</span> is validating statutory records for <span className="font-bold text-slate-800">{profile.businessName}</span> against MCA-21 and GSTN databases.
                   </p>
                   
                   <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto py-5 border-y border-slate-100 mb-6 bg-slate-50/50 rounded-2xl px-4">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue Pos</p>
                         <p className="text-lg font-black text-slate-900">#{auditInfo.queuePosition}</p>
                      </div>
                      <div className="border-x border-slate-200">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Time</p>
                         <p className="text-lg font-black text-slate-900">{auditInfo.estimatedCompletion}</p>
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Officer</p>
                         <p className="text-xs font-black text-survyx-navy mt-1">Priya K.</p>
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center justify-center gap-3">
                      <button 
                        onClick={() => setCurrentView('chat')}
                        className="bg-survyx-navy hover:bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                      >
                         <MessageSquare size={14} /> Contact Officer Priya
                      </button>
                      <button 
                        onClick={approveVerificationNow}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-green-900/20"
                      >
                         <Sparkles size={14} /> Fast-Track Verification (Instant)
                      </button>
                      <button 
                        onClick={resetVerification}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                      >
                         Edit Application
                      </button>
                   </div>
                </div>

                {/* Live Audit Log */}
                <div className="registry-card p-6 bg-white border border-slate-100 shadow-sm">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <FileCheck size={16} className="text-survyx-blue" />
                     Live Registry Audit Steps
                   </h4>
                   <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100">
                         <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                         <div>
                            <p className="text-xs font-bold text-slate-800">GSTIN Format & Jurisdiction Validation</p>
                            <p className="text-[10px] text-slate-500">Verified active status under Maharashtra Central Zone</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                         <div className="w-4 h-4 rounded-full bg-survyx-blue text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                            ●
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-800">Director / Signatory KYC Cross-Check</p>
                            <p className="text-[10px] text-slate-500">Matching authorized signatory with PAN Database</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 opacity-60">
                         <Clock size={16} className="text-slate-400 shrink-0 mt-0.5" />
                         <div>
                            <p className="text-xs font-bold text-slate-700">NPCI Escrow Authorization Seal</p>
                            <p className="text-[10px] text-slate-400">Final institutional accreditation stamp</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* STATE 3: VERIFIED */}
          {verificationStatus === 'verified' && (
             <div className="space-y-6">
                <div className="registry-card p-8 bg-gradient-to-br from-survyx-navy to-slate-900 text-white rounded-3xl relative overflow-hidden shadow-2xl">
                   <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-2.5 px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={14} /> Tier-1 Platinum Entity
                         </div>
                         <span className="font-mono text-xs text-slate-300">EUID: {state.euid}</span>
                      </div>

                      <div className="flex items-start justify-between gap-6">
                         <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-300">SURVYX Institutional Entity Credential</p>
                            <h3 className="text-2xl font-black tracking-tight mt-1 text-white">{profile.businessName}</h3>
                            <p className="text-xs text-slate-300 mt-2 flex items-center gap-2">
                               <span>GST: {profile.gstin}</span>
                               <span>•</span>
                               <span>PAN: {profile.pan}</span>
                            </p>
                         </div>
                         <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center shrink-0">
                            <Award size={32} className="text-yellow-400" />
                         </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Registry Trust</p>
                            <p className="text-xl font-black text-green-400 font-mono">980 / 1000</p>
                         </div>
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Escrow Limit</p>
                            <p className="text-xl font-black text-white font-mono">UNLIMITED</p>
                         </div>
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Audit Officer</p>
                            <p className="text-xs font-black text-blue-200 mt-1">Priya K.</p>
                         </div>
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                            <p className="text-xs font-black text-green-400 uppercase mt-1">Active Platinum</p>
                         </div>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-4">
                         <button 
                           onClick={() => setCurrentView('dashboard')}
                           className="bg-survyx-blue hover:bg-blue-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2"
                         >
                            Proceed to Dashboard <ArrowRight size={14} />
                         </button>
                         <button 
                           onClick={() => setCurrentView('vault')}
                           className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/20"
                         >
                            Access Escrow Vault
                         </button>
                         <button 
                           onClick={resetVerification}
                           className="text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest px-3 py-3"
                         >
                            Reset Verification State
                         </button>
                      </div>
                   </div>
                   <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                      <ShieldCheck size={260} />
                   </div>
                </div>

                <div className="registry-card p-6 bg-white border border-slate-100 shadow-sm">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">
                     Validated Compliance Documents
                   </h4>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                               <FileCheck size={18} />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-slate-900">GST Registration (GST REG-06)</p>
                               <p className="text-[10px] text-slate-400 font-mono">{documents.gst.fileName || 'GST_REG_27AABCU9603R1ZM.pdf'}</p>
                            </div>
                         </div>
                         <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-100 uppercase">Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                               <FileCheck size={18} />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-slate-900">PAN Card Certificate</p>
                               <p className="text-[10px] text-slate-400 font-mono">{documents.pan.fileName || 'PAN_AABCU9603R.pdf'}</p>
                            </div>
                         </div>
                         <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-100 uppercase">Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                               <FileCheck size={18} />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-slate-900">Certificate of Incorporation</p>
                               <p className="text-[10px] text-slate-400 font-mono">{documents.coi.fileName || 'COI_ROC_U40106MH.pdf'}</p>
                            </div>
                         </div>
                         <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-100 uppercase">Verified</span>
                      </div>
                   </div>
                </div>
             </div>
          )}

        </div>

        {/* Sidebar Guidance & Metrics */}
        <div className="lg:col-span-4 space-y-6">
           <div className="registry-card p-6 bg-survyx-navy text-white rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                 <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1">SURVYX Trust Index</p>
                 <div className="flex items-end gap-2 my-2">
                    <span className="text-4xl font-black font-mono tracking-tight">{trustScore}</span>
                    <span className="text-xs text-slate-400 mb-1.5 font-bold">/ 1000</span>
                 </div>
                 <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden my-3">
                    <div 
                      className="bg-survyx-blue h-full transition-all duration-500" 
                      style={{ width: `${(trustScore / 1000) * 100}%` }}
                    />
                 </div>
                 <p className="text-[10px] text-slate-300 leading-relaxed mt-2">
                   Tier: <span className="font-bold text-white uppercase">{governanceTier}</span>. Complete all verification steps to attain <span className="text-green-300 font-bold">PLATINUM</span> trade standing.
                 </p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-survyx-blue/20 rounded-full blur-2xl" />
           </div>

           <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-survyx-blue">
                    <Info size={16} />
                 </div>
                 <h4 className="text-xs font-black uppercase tracking-tight">Verification Guidelines</h4>
              </div>
              <ul className="space-y-3">
                 <li className="flex gap-2.5 text-[11px] text-slate-300">
                    <CheckCircle2 size={14} className="text-survyx-blue shrink-0 mt-0.5" />
                    <span>Business name must match your GST certificate exactly.</span>
                 </li>
                 <li className="flex gap-2.5 text-[11px] text-slate-300">
                    <CheckCircle2 size={14} className="text-survyx-blue shrink-0 mt-0.5" />
                    <span>Upload clear PDF/JPG scans without password protection.</span>
                 </li>
                 <li className="flex gap-2.5 text-[11px] text-slate-300">
                    <CheckCircle2 size={14} className="text-survyx-blue shrink-0 mt-0.5" />
                    <span>Government registry verification syncs in real-time.</span>
                 </li>
              </ul>
           </div>

           <div className="registry-card p-6 border-dashed border-2 border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-2">
                 <Zap size={14} className="text-amber-500" />
                 <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Why Verify?</h5>
              </div>
              <p className="text-xs font-bold text-slate-800 leading-relaxed">
                 Verified entities receive <span className="text-survyx-blue">3x more trade inquiries</span> and multi-million INR Escrow milestone protections.
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusStep({ label, status, icon }: { label: string, status: 'pending' | 'active' | 'complete', icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
       <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
          status === 'complete' ? 'bg-green-500 text-white shadow-sm' : 
          status === 'active' ? 'bg-survyx-navy text-white shadow-sm' : 
          'bg-slate-100 text-slate-400'
       }`}>
          {status === 'complete' ? <CheckCircle2 size={14} /> : icon}
       </div>
       <span className={`text-[9px] font-black uppercase tracking-widest ${
          status === 'pending' ? 'text-slate-300' : 'text-slate-900'
       }`}>{label}</span>
    </div>
  );
}

function UploadRowItem({ 
  title, 
  desc, 
  id, 
  doc, 
  onUpload, 
  onRemove 
}: { 
  title: string; 
  desc: string; 
  id: string; 
  doc: { uploaded: boolean; fileName?: string; fileSize?: string; status: string }; 
  onUpload: () => void; 
  onRemove: () => void;
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${doc.uploaded ? 'bg-blue-50/30 border-blue-200' : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50'}`}>
       <div className="mb-2 sm:mb-0">
          <div className="flex items-center gap-2">
             <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{title}</p>
             {doc.uploaded && (
                <span className="text-[8px] font-bold uppercase tracking-widest bg-green-100 text-green-700 px-2 py-0.5 rounded">
                   Uploaded
                </span>
             )}
          </div>
          <p className="text-[10px] font-medium text-slate-400 mt-0.5">{desc}</p>
          {doc.uploaded && doc.fileName && (
             <p className="text-[9px] font-mono text-survyx-blue mt-1 font-bold">
               {doc.fileName} ({doc.fileSize || '1.2 MB'})
             </p>
          )}
       </div>
       <div className="flex items-center gap-2">
          {doc.uploaded ? (
             <>
                <button 
                  onClick={onUpload}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-600 hover:text-survyx-blue transition-all"
                >
                   Replace
                </button>
                <button 
                  onClick={onRemove}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  title="Remove document"
                >
                   <Trash2 size={14} />
                </button>
             </>
          ) : (
             <button 
               id={id} 
               onClick={onUpload}
               className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-300 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-700 hover:text-survyx-blue hover:border-survyx-blue transition-all shadow-sm"
             >
                <Upload size={12} />
                Upload File
             </button>
          )}
       </div>
    </div>
  );
}
