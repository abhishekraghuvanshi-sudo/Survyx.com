import React, { useState, useCallback } from 'react';
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

interface Document {
  id: string;
  name: string;
  type: string;
  category: 'GST' | 'COI' | 'PAN' | 'IDENTITY' | 'OTHER';
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: string;
  expiryDate?: string;
}

export default function Repository() {
  const [docs, setDocs] = useState<Document[]>([
    { id: '1', name: 'GST_CERT_2024.pdf', type: 'application/pdf', category: 'GST', status: 'verified', uploadDate: '12 May 2024' },
    { id: '2', name: 'COI_SVX_SOLUTIONS.pdf', type: 'application/pdf', category: 'COI', status: 'pending', uploadDate: '14 May 2024' },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<{ message: string; action: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

    // 3. Simulated Corruption Check (Zero byte files)
    if (file.size === 0) {
      setUploadError({
        message: "Corrupted Data Stream Detected",
        action: "The file appears to be empty or corrupted. Please re-export the document."
      });
      return false;
    }

    return true;
  };

  const processFiles = (files: FileList) => {
    const file = files[0];
    if (file && validateFile(file)) {
      // Simulate successful deposit
      const newDoc: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        category: 'OTHER',
        status: 'pending',
        uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      setDocs(prev => [newDoc, ...prev]);
    }
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
          <p className="text-slate-500 mt-1">Secure vault for entity credentials and compliance documentation.</p>
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
            className={`registry-card p-12 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer group ${isDragging ? 'border-survyx-blue bg-blue-50/50' : uploadError ? 'border-red-300 bg-red-50/10' : 'border-slate-200 bg-white hover:border-survyx-blue'}`}
          >
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-all ${isDragging ? 'bg-survyx-blue text-white' : uploadError ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-survyx-blue'}`}>
              <UploadCloud size={32} />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${uploadError ? 'text-red-900' : 'text-slate-900'}`}>
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
              <div className="mt-8 flex gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="px-3 py-1 bg-slate-100 rounded-full">PDF</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full">JPG</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full">MAX 10MB</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Lock size={14} /> Repository Vault
            </h3>
            <div className="space-y-3">
              {docs.map(doc => (
                <DocumentListItem key={doc.id} doc={doc} />
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
                  <span className="text-xs font-bold font-mono">65%</span>
               </div>
               <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-survyx-blue h-full w-[65%]"></div>
               </div>
               <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                 Entity validation tier will remain <span className="text-white font-bold">TEMPORARY</span> until COI and GST are audited by your Registry Officer.
               </p>
             </div>
             <div className="absolute -right-6 -bottom-6 opacity-10">
                <ShieldCheck size={100} />
             </div>
          </div>

          <div className="registry-card p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Requirement Checklist</h4>
            <div className="space-y-3">
              <CheckItem label="GST Registration Certificate" completed />
              <CheckItem label="Certificate of Incorporation" pending />
              <CheckItem label="PAN Card (Business)" pending />
              <CheckItem label="Director Identity Proof" />
              <CheckItem label="Utility Bill (Office Proof)" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 flex gap-4">
             <div className="text-orange-500 mt-1">
                <Info size={20} />
             </div>
             <div>
                <p className="text-xs font-bold text-orange-900 uppercase tracking-tight">Audit Notice</p>
                <p className="text-[11px] text-orange-800 leading-relaxed mt-1">
                  Priya K. is currently monitoring your uploads. Real-time verification is active for session ID <span className="font-mono">SVX-AUD-991</span>.
                </p>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DocumentListItem({ doc }: { doc: Document, key?: any }) {
  const statusStyles = {
    verified: 'bg-green-50 text-green-700 border-green-100',
    pending: 'bg-blue-50 text-survyx-blue border-blue-100',
    rejected: 'bg-red-50 text-red-700 border-red-100'
  };

  const StatusIcon = {
    verified: <FileCheck size={16} />,
    pending: <Clock size={16} />,
    rejected: <FileWarning size={16} />
  };

  return (
    <div className="registry-card p-4 hover:border-survyx-blue flex items-center justify-between group">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-2xl ${doc.status === 'verified' ? 'bg-green-50' : 'bg-slate-100'} text-slate-400 group-hover:text-survyx-blue transition-colors`}>
          <FileText size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{doc.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-mono text-slate-400">{doc.category}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[9px] font-mono text-slate-400">Uploaded {doc.uploadDate}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${statusStyles[doc.status]}`}>
          {StatusIcon[doc.status]}
          {doc.status}
        </div>
        <button className="p-2 text-slate-300 hover:text-survyx-blue transition-colors rounded-lg hover:bg-slate-50">
          <Eye size={18} />
        </button>
        <button className="p-2 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function CheckItem({ label, completed, pending }: { label: string, completed?: boolean, pending?: boolean }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${completed ? 'bg-green-500 text-white' : pending ? 'bg-blue-100 text-survyx-blue' : 'bg-slate-100 text-slate-300'}`}>
          {completed ? <CheckCircle2 size={12} /> : pending ? <Clock size={12} /> : <div className="w-1 h-1 rounded-full bg-slate-300" />}
        </div>
        <span className={`text-[11px] font-medium transition-colors ${completed ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
      </div>
      {completed && <span className="text-[9px] font-bold text-green-600 uppercase tracking-tighter">Verified</span>}
    </div>
  );
}
