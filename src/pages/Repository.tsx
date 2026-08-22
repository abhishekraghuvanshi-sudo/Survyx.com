import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, 
  FileText, 
  FileCheck, 
  FileWarning, 
  Lock, 
  ShieldCheck, 
  Info, 
  Trash2, 
  ExternalLink, 
  ChevronRight, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useUserJourney } from '../context/UserJourneyContext';

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  category: 'GST' | 'COI' | 'PAN' | 'IDENTITY' | 'OTHER';
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: string;
  size: string;
}

export default function Repository() {
  const { state, uploadVerificationDoc } = useUserJourney();
  const { documents, verificationStatus } = state;

  const [docs, setDocs] = useState<DocumentItem[]>([
    { 
      id: 'doc-gst', 
      name: documents.gst.fileName || 'GST_CERT_27AABCU9603R1ZM.pdf', 
      type: 'application/pdf', 
      category: 'GST', 
      status: documents.gst.status, 
      uploadDate: documents.gst.uploadedAt || '12 May 2024',
      size: documents.gst.fileSize || '1.4 MB'
    },
    { 
      id: 'doc-coi', 
      name: documents.coi.fileName || 'COI_SVX_SOLUTIONS.pdf', 
      type: 'application/pdf', 
      category: 'COI', 
      status: documents.coi.status, 
      uploadDate: documents.coi.uploadedAt || '14 May 2024',
      size: documents.coi.fileSize || '2.1 MB'
    },
    ...(documents.pan.uploaded ? [{
      id: 'doc-pan',
      name: documents.pan.fileName || 'PAN_CARD_AABCU9603R.pdf',
      type: 'application/pdf',
      category: 'PAN' as const,
      status: documents.pan.status,
      uploadDate: documents.pan.uploadedAt || '14 May 2024',
      size: documents.pan.fileSize || '1.1 MB'
    }] : [])
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<{ message: string; action: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    setUploadError(null);

    // 1. Size Validation (Max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError({
        message: "File size exceeds Institutional Limit (10MB)",
        action: "Please compress your document or select a lower resolution scan."
      });
      return false;
    }

    // 2. Type Validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError({
        message: "Unsupported Registry Format",
        action: "The archive only accepts PDF, JPG, or PNG files for compliance auditing."
      });
      return false;
    }

    return true;
  };

  const processFiles = (files: FileList) => {
    const file = files[0];
    if (file && validateFile(file)) {
      const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const newDoc: DocumentItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        category: file.name.toLowerCase().includes('pan') ? 'PAN' : file.name.toLowerCase().includes('coi') ? 'COI' : 'OTHER',
        status: 'pending',
        uploadDate: now,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };

      setDocs(prev => [newDoc, ...prev]);

      if (file.name.toLowerCase().includes('pan')) {
        uploadVerificationDoc('pan', { name: file.name, size: newDoc.size });
      } else if (file.name.toLowerCase().includes('coi')) {
        uploadVerificationDoc('coi', { name: file.name, size: newDoc.size });
      }
    }
  };

  const handleDeleteDoc = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const verifiedPercent = verificationStatus === 'verified' ? 100 : verificationStatus === 'under_review' ? 75 : 60;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Institutional Repository</h2>
          <p className="text-slate-500 mt-1">Secure vault for entity credentials, licenses, and compliance documentation.</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-600/10 text-survyx-blue px-4 py-2 rounded-2xl border border-blue-500/20">
           <ShieldCheck size={16} />
           <span className="text-[10px] font-bold uppercase tracking-widest text-survyx-blue">256-Bit Encrypted Session</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`registry-card p-10 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer group ${isDragging ? 'border-survyx-blue bg-blue-50/50' : uploadError ? 'border-red-300 bg-red-50/10' : 'border-slate-200 bg-white hover:border-survyx-blue'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragging ? 'bg-survyx-blue text-white' : uploadError ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-survyx-blue'}`}>
              <UploadCloud size={28} />
            </div>
            <h3 className={`text-base font-bold mb-1.5 ${uploadError ? 'text-red-900' : 'text-slate-900'}`}>
              {uploadError ? 'Deposit Failure' : 'Registry Deposit Zone'}
            </h3>
            <p className={`text-xs max-w-xs mx-auto leading-relaxed ${uploadError ? 'text-red-700 font-bold' : 'text-slate-500'}`}>
              {uploadError ? uploadError.message : <>Drag and drop your compliance documents here or <span className="text-survyx-blue font-bold group-hover:underline">browse files</span>.</>}
            </p>
            
            <AnimatePresence>
              {uploadError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-red-100/50 rounded-2xl border border-red-200 text-left max-w-sm w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-3">
                    <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-red-900 uppercase tracking-widest mb-1">Corrective Action Required</p>
                      <p className="text-[11px] text-red-800 leading-relaxed font-medium">
                        {uploadError.action}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!uploadError && (
              <div className="mt-6 flex gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">PDF</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">JPG</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">MAX 10MB</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
              <Lock size={14} /> Repository Vault ({docs.length} Documents)
            </h3>
            <div className="space-y-3">
              {docs.map(doc => (
                <DocumentListItem key={doc.id} doc={doc} onDelete={() => handleDeleteDoc(doc.id)} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="registry-card p-6 bg-survyx-navy text-white relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-4">Verification Health</h4>
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs">Compliance Audit</span>
                  <span className="text-xs font-bold font-mono">{verifiedPercent}%</span>
               </div>
               <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-survyx-blue h-full transition-all duration-500"
                    style={{ width: `${verifiedPercent}%` }}
                  />
               </div>
               <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                 Entity validation tier: <span className="text-white font-bold uppercase">{state.governanceTier}</span>. Monitored by Officer Priya Krishnamurthy.
               </p>
             </div>
             <div className="absolute -right-6 -bottom-6 opacity-10">
                <ShieldCheck size={100} />
             </div>
          </div>

          <div className="registry-card p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Requirement Checklist</h4>
            <div className="space-y-3">
              <CheckItem label="GST Registration Certificate" completed={documents.gst.uploaded} />
              <CheckItem label="PAN Card (Entity / Signatory)" completed={documents.pan.uploaded} pending={!documents.pan.uploaded} />
              <CheckItem label="Certificate of Incorporation (COI)" completed={documents.coi.uploaded} pending={!documents.coi.uploaded} />
              <CheckItem label="Director Identity Proof" completed={verificationStatus === 'verified'} />
              <CheckItem label="Audited Financial Statements" completed={verificationStatus === 'verified'} />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-5 flex gap-3.5">
             <div className="text-orange-500 mt-0.5 shrink-0">
                <Info size={18} />
             </div>
             <div>
                <p className="text-xs font-bold text-orange-900 uppercase tracking-tight">Audit Notice</p>
                <p className="text-[11px] text-orange-800 leading-relaxed mt-1">
                  Senior Officer Priya K. is monitoring active session <span className="font-mono font-bold">{state.euid}</span>. Real-time verification is synchronized.
                </p>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DocumentListItem({ doc, onDelete }: { key?: React.Key; doc: DocumentItem; onDelete: () => void }) {
  const statusStyles = {
    verified: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-blue-50 text-survyx-blue border-blue-200',
    rejected: 'bg-red-50 text-red-700 border-red-200'
  };

  const StatusIcon = {
    verified: <FileCheck size={14} />,
    pending: <Clock size={14} />,
    rejected: <FileWarning size={14} />
  };

  return (
    <div className="registry-card p-4 hover:border-survyx-blue flex items-center justify-between group transition-all bg-white border border-slate-100 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className={`p-2.5 rounded-xl ${doc.status === 'verified' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'} group-hover:text-survyx-blue transition-colors`}>
          <FileText size={18} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900">{doc.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-mono text-slate-500 font-bold">{doc.category}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[9px] font-mono text-slate-400">{doc.size}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[9px] font-mono text-slate-400">{doc.uploadDate}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${statusStyles[doc.status]}`}>
          {StatusIcon[doc.status]}
          {doc.status}
        </div>
        <button 
          onClick={onDelete}
          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          title="Delete document"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function CheckItem({ label, completed, pending }: { label: string; completed?: boolean; pending?: boolean }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2.5">
        <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${completed ? 'bg-green-500 text-white' : pending ? 'bg-blue-100 text-survyx-blue' : 'bg-slate-100 text-slate-300'}`}>
          {completed ? <CheckCircle2 size={10} /> : pending ? <Clock size={10} /> : <div className="w-1 h-1 rounded-full bg-slate-300" />}
        </div>
        <span className={`text-xs transition-colors ${completed ? 'font-bold text-slate-900' : 'text-slate-500'}`}>{label}</span>
      </div>
      {completed && <span className="text-[8px] font-black text-green-600 uppercase tracking-tighter">Verified</span>}
    </div>
  );
}
