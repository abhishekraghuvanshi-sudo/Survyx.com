import React, { useState, useRef, useEffect } from 'react';
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
  AlertCircle,
  Camera,
  Sparkles,
  X,
  RefreshCw,
  Zap,
  Check,
  Building2,
  Calendar,
  DollarSign,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useUserJourney } from '../context/UserJourneyContext';
import { analyzeTradeDocument, DocumentAnalysisResult } from '../services/geminiService';

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  category: 'GST' | 'COI' | 'PAN' | 'INVOICE' | 'LOGISTICS' | 'TEST_REPORT' | 'OTHER';
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: string;
  size: string;
  scannedWithAi?: boolean;
  aiAnalysis?: DocumentAnalysisResult;
  thumbnailUrl?: string;
}

export default function Repository() {
  const { state, uploadVerificationDoc } = useUserJourney();
  const { documents, verificationStatus, euid, profile } = state;

  const [docs, setDocs] = useState<DocumentItem[]>([
    { 
      id: 'doc-gst', 
      name: documents.gst.fileName || 'GST_CERT_27AABCU9603R1ZM.pdf', 
      type: 'application/pdf', 
      category: 'GST', 
      status: documents.gst.status, 
      uploadDate: documents.gst.uploadedAt || '12 May 2024',
      size: documents.gst.fileSize || '1.4 MB',
      scannedWithAi: true,
      aiAnalysis: {
        documentType: 'GST Registration Certificate (REG-06)',
        category: 'GST',
        entityName: profile.businessName || 'SURVYX Solutions Private Limited',
        documentNumber: profile.gstin || '27AABCU9603R1ZM',
        issueDate: '01/07/2017',
        financialValue: 'Statutory Document',
        confidenceScore: 99,
        complianceStatus: 'verified',
        summary: 'Official Certificate of Registration issued under Central Goods and Services Tax Act 2017 with verified jurisdictional office.',
        keyParameters: [
          { label: 'Principal Place of Business', value: 'Verified Registered Address' },
          { label: 'Authorized Signatory', value: profile.authorizedSignatory || 'Verified' },
          { label: 'GSTN Status', value: 'Active & Filing Compliant' }
        ]
      }
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
  const [selectedDocDetails, setSelectedDocDetails] = useState<DocumentItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera & AI Scanner States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<DocumentAnalysisResult | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Stop camera on unmount or close
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setCameraError(null);
    setCapturedImage(null);
    setScanResult(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser environment. You can upload an image file instead.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn("Camera access fallback:", err);
      setCameraError(
        err?.message || "Unable to open live camera stream. You can capture or choose a document photo directly."
      );
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const closeCameraModal = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCapturedImage(null);
    setScanResult(null);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      stopCameraStream();
      analyzeCapturedImage(dataUrl);
    }
  };

  const handleCameraFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setCapturedImage(base64);
        analyzeCapturedImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeCapturedImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeTradeDocument({
        imageBase64: base64Image,
        mimeType: 'image/jpeg',
        rawText: `EUID: ${euid}, Entity: ${profile.businessName}, Category: ${profile.industryCategory}`
      });
      setScanResult(analysis);
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveScannedDocumentToRepository = () => {
    if (!scanResult) return;

    const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const categoryKey: DocumentItem['category'] = scanResult.category || 'OTHER';

    const newDoc: DocumentItem = {
      id: 'scan-' + Math.random().toString(36).substr(2, 9),
      name: `${scanResult.documentType.replace(/\s+/g, '_')}_${now.replace(/\s+/g, '')}.jpg`,
      type: 'image/jpeg',
      category: categoryKey,
      status: scanResult.complianceStatus === 'rejected' ? 'rejected' : 'verified',
      uploadDate: now,
      size: '1.8 MB',
      scannedWithAi: true,
      aiAnalysis: scanResult,
      thumbnailUrl: capturedImage || undefined
    };

    setDocs(prev => [newDoc, ...prev]);

    // Update KYC state if matching
    if (categoryKey === 'GST') {
      uploadVerificationDoc('gst', { name: newDoc.name, size: newDoc.size, documentNumber: scanResult.documentNumber });
    } else if (categoryKey === 'PAN') {
      uploadVerificationDoc('pan', { name: newDoc.name, size: newDoc.size, documentNumber: scanResult.documentNumber });
    } else if (categoryKey === 'COI') {
      uploadVerificationDoc('coi', { name: newDoc.name, size: newDoc.size, documentNumber: scanResult.documentNumber });
    }

    closeCameraModal();
    setSelectedDocDetails(newDoc);
  };

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
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
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
    if (selectedDocDetails?.id === id) {
      setSelectedDocDetails(null);
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

  const verifiedPercent = verificationStatus === 'verified' ? 100 : verificationStatus === 'under_review' ? 75 : 60;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-20"
    >
      {/* Hidden Canvas for Camera Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Institutional Repository</h2>
            <span className="text-[10px] font-black uppercase bg-blue-100 text-survyx-blue px-2.5 py-0.5 rounded-full">
              AI OCR Active
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Statutory archive for entity credentials, commercial invoices, NABL lab test reports, and compliance certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={startCamera}
            className="bg-survyx-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Camera size={16} />
            <span>Scan Document with AI</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 bg-blue-600/10 text-survyx-blue px-4 py-2 rounded-xl border border-blue-500/20">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-survyx-blue">256-Bit Encrypted Vault</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload & Scanner Zone */}
        <div className="lg:col-span-2 space-y-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.webp"
          />

          {/* Dual Action Deposit Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Action 1: Camera Scanner */}
            <div 
              onClick={startCamera}
              className="bg-gradient-to-tr from-survyx-navy to-slate-900 text-white p-6 rounded-3xl border border-white/10 shadow-lg cursor-pointer hover:border-blue-400/50 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-survyx-blue/20 text-blue-400 border border-blue-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <h3 className="text-sm font-black tracking-tight">Camera Vision Scanner</h3>
                  <Sparkles size={13} className="text-blue-400 animate-pulse" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Capture physical paper invoices, GST certificates, or testing reports using your camera. AI automatically extracts GSTIN, amounts, and validates authenticity.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-blue-300">
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
                  Open Camera Scanner <ChevronRight size={13} />
                </span>
                <span className="text-[9px] font-mono bg-white/10 px-2 py-0.5 rounded text-white">Live OCR</span>
              </div>
            </div>

            {/* Action 2: Drag & Drop Upload */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-3xl border-2 border-dashed transition-all flex flex-col justify-between cursor-pointer group ${
                isDragging ? 'border-survyx-blue bg-blue-50/50' : uploadError ? 'border-red-300 bg-red-50/10' : 'border-slate-200 bg-white hover:border-survyx-blue'
              }`}
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-survyx-blue flex items-center justify-center transition-colors">
                  <UploadCloud size={24} />
                </div>
                <h3 className="text-sm font-black text-slate-900 pt-2">Deposit Digital File</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Drag and drop PDF, JPG, or PNG compliance documents from your computer or cloud drive.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="text-[10px] uppercase tracking-wider group-hover:text-survyx-blue">Browse Local Disk</span>
                <span className="text-[9px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">Max 10MB</span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {uploadError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-100/60 rounded-2xl border border-red-200 text-left w-full"
              >
                <div className="flex gap-3">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-red-900 uppercase tracking-widest mb-1">{uploadError.message}</p>
                    <p className="text-[11px] text-red-800 leading-relaxed font-medium">
                      {uploadError.action}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Document Vault List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <Lock size={14} /> Repository Archive ({docs.length} Documents)
              </h3>
              <span className="text-[10px] font-mono text-slate-400">EUID: {euid}</span>
            </div>

            <div className="space-y-3">
              {docs.map(doc => (
                <DocumentListItem 
                  key={doc.id} 
                  doc={doc} 
                  onDelete={() => handleDeleteDoc(doc.id)} 
                  onViewDetails={() => setSelectedDocDetails(doc)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Verification Health */}
          <div className="registry-card p-6 bg-survyx-navy text-white relative overflow-hidden rounded-3xl">
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
                 Entity validation tier: <span className="text-white font-bold uppercase">{state.governanceTier}</span>. Monitored by Officer Arya Sharma.
               </p>
             </div>
             <div className="absolute -right-6 -bottom-6 opacity-10">
                <ShieldCheck size={100} />
             </div>
          </div>

          {/* Checklist */}
          <div className="registry-card p-6 space-y-4 bg-white rounded-3xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Requirement Checklist</h4>
            <div className="space-y-3">
              <CheckItem label="GST Registration Certificate" completed={documents.gst.uploaded} />
              <CheckItem label="PAN Card (Entity / Signatory)" completed={documents.pan.uploaded} pending={!documents.pan.uploaded} />
              <CheckItem label="Certificate of Incorporation (COI)" completed={documents.coi.uploaded} pending={!documents.coi.uploaded} />
              <CheckItem label="Director Identity Proof" completed={verificationStatus === 'verified'} />
              <CheckItem label="Audited Financial Statements" completed={verificationStatus === 'verified'} />
            </div>
          </div>

          {/* Audit Notice */}
          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-5 flex gap-3.5">
             <div className="text-orange-500 mt-0.5 shrink-0">
                <Info size={18} />
             </div>
             <div>
                <p className="text-xs font-bold text-orange-900 uppercase tracking-tight">Officer Arya Sharma Audit</p>
                <p className="text-[11px] text-orange-800 leading-relaxed mt-1">
                  Senior Officer Arya Sharma is reviewing active entity <span className="font-mono font-bold">{state.euid}</span>. Scanned documents undergo instant mathematical and statutory cross-checks.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CAMERA SCANNER MODAL                                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]"
            >
              {/* Header */}
              <div className="p-5 bg-survyx-navy text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Camera size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight">AI Document Scanner</h3>
                    <p className="text-[10px] text-blue-200 font-mono">Live Optical Character Recognition</p>
                  </div>
                </div>
                <button
                  onClick={closeCameraModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {!capturedImage ? (
                  <div className="space-y-4">
                    {/* Live Viewfinder or Fallback */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] flex items-center justify-center border border-slate-800 shadow-inner">
                      {cameraError ? (
                        <div className="text-center p-6 space-y-4 max-w-sm">
                          <AlertCircle size={32} className="text-amber-400 mx-auto" />
                          <div>
                            <p className="text-xs font-bold text-white mb-1">Camera Stream Inaccessible</p>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{cameraError}</p>
                          </div>
                          <button
                            onClick={() => cameraInputRef.current?.click()}
                            className="bg-survyx-blue hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md"
                          >
                            Choose Photo File
                          </button>
                        </div>
                      ) : (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          {/* Viewfinder Target Overlays */}
                          <div className="absolute inset-6 border-2 border-dashed border-blue-400/70 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                            <div className="flex justify-between">
                              <span className="w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                              <span className="w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                            </div>
                            <div className="text-center">
                              <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-mono px-3 py-1 rounded-full border border-white/20 shadow-md">
                                Align Document Edges within Frame
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                              <span className="w-4 h-4 border-b-2 border-r-2 border-blue-400" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Shutter / Upload Buttons */}
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <input
                        type="file"
                        ref={cameraInputRef}
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCameraFileUpload}
                      />

                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
                      >
                        <UploadCloud size={16} />
                        <span>Upload Photo</span>
                      </button>

                      {!cameraError && (
                        <button
                          onClick={capturePhoto}
                          className="px-8 py-3.5 bg-survyx-navy hover:bg-survyx-blue text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center gap-2 active:scale-95"
                        >
                          <Camera size={16} />
                          <span>Capture & Audit</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Captured Preview & Analysis */
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Photo Thumbnail */}
                      <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative aspect-[4/3] flex items-center justify-center">
                        <img 
                          src={capturedImage} 
                          alt="Captured Document" 
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => {
                            setCapturedImage(null);
                            setScanResult(null);
                            startCamera();
                          }}
                          className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1 transition-all"
                        >
                          <RefreshCw size={12} /> Retake
                        </button>
                      </div>

                      {/* AI Parsing Status Box */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-survyx-blue" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                              Officer Arya Vision Engine
                            </span>
                          </div>

                          {isAnalyzing ? (
                            <div className="py-6 space-y-3 text-center">
                              <div className="w-8 h-8 rounded-full border-2 border-survyx-blue border-t-transparent animate-spin mx-auto" />
                              <p className="text-xs font-bold text-slate-700">Extracting Statutory Metadata...</p>
                              <p className="text-[10px] text-slate-400">Verifying seal, GSTIN checksum & signatures</p>
                            </div>
                          ) : scanResult ? (
                            <div className="space-y-2 pt-1 text-xs">
                              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between">
                                <span className="font-bold flex items-center gap-1">
                                  <CheckCircle2 size={13} className="text-emerald-600" />
                                  {scanResult.documentType}
                                </span>
                                <span className="text-[9px] font-mono uppercase bg-emerald-200/60 px-1.5 py-0.5 rounded font-bold">
                                  {scanResult.complianceStatus}
                                </span>
                              </div>
                              <div className="space-y-1 text-slate-600 text-[11px]">
                                <p><strong className="text-slate-900">Entity:</strong> {scanResult.entityName}</p>
                                <p><strong className="text-slate-900">Doc #:</strong> <span className="font-mono">{scanResult.documentNumber}</span></p>
                                {scanResult.financialValue && scanResult.financialValue !== 'N/A' && (
                                  <p><strong className="text-slate-900">Value:</strong> <span className="font-mono font-bold text-survyx-blue">{scanResult.financialValue}</span></p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400">Analysis completed.</p>
                          )}
                        </div>

                        {scanResult && (
                          <div className="pt-2">
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Confidence: {scanResult.confidenceScore}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detailed Analysis Breakdown */}
                    {scanResult && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                          Verification Telemetry
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {scanResult.summary}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {scanResult.keyParameters?.map((param, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200/70 text-[11px]">
                              <span className="text-slate-500 font-medium">{param.label}</span>
                              <span className="font-bold text-slate-900 font-mono">{param.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <button
                  onClick={closeCameraModal}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>

                {scanResult && (
                  <button
                    onClick={saveScannedDocumentToRepository}
                    className="bg-survyx-navy hover:bg-survyx-blue text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Save to Vault & Sync EUID</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* DOCUMENT DETAILS MODAL                                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedDocDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
            >
              <div className="p-5 bg-survyx-navy text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileCheck size={18} className="text-blue-400" />
                  <h3 className="text-sm font-black tracking-tight">{selectedDocDetails.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedDocDetails(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Category:</span>
                    <p className="text-xs font-black text-slate-800">{selectedDocDetails.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
                    <p className="text-xs font-bold text-emerald-600 capitalize">{selectedDocDetails.status}</p>
                  </div>
                </div>

                {selectedDocDetails.aiAnalysis ? (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <p className="text-xs font-black text-survyx-navy uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} className="text-survyx-blue" />
                      Officer Arya Vision Telemetry
                    </p>
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <p><strong>Type:</strong> {selectedDocDetails.aiAnalysis.documentType}</p>
                      <p><strong>Entity:</strong> {selectedDocDetails.aiAnalysis.entityName}</p>
                      <p><strong>Document ID:</strong> <span className="font-mono font-bold">{selectedDocDetails.aiAnalysis.documentNumber}</span></p>
                      <p><strong>Compliance:</strong> <span className="text-emerald-600 font-bold capitalize">{selectedDocDetails.aiAnalysis.complianceStatus}</span></p>
                      {selectedDocDetails.aiAnalysis.financialValue && selectedDocDetails.aiAnalysis.financialValue !== 'N/A' && (
                        <p><strong>Value:</strong> <span className="font-mono font-bold text-survyx-blue">{selectedDocDetails.aiAnalysis.financialValue}</span></p>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                      {selectedDocDetails.aiAnalysis.summary}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Standard registry document uploaded for sovereign entity verification under EUID {euid}.
                  </p>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedDocDetails(null)}
                    className="bg-survyx-navy hover:bg-survyx-blue text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DocumentListItem({ 
  doc, 
  onDelete, 
  onViewDetails 
}: { 
  key?: React.Key; 
  doc: DocumentItem; 
  onDelete: () => void;
  onViewDetails: () => void;
}) {
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
    <div className="registry-card p-4 hover:border-survyx-blue flex items-center justify-between group transition-all bg-white border border-slate-100 shadow-sm rounded-2xl">
      <div className="flex items-center space-x-4">
        <div className={`p-2.5 rounded-xl ${doc.status === 'verified' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'} group-hover:text-survyx-blue transition-colors shrink-0`}>
          <FileText size={18} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
            {doc.scannedWithAi && (
              <span className="text-[8px] font-black uppercase bg-blue-100 text-survyx-blue px-1.5 py-0.2 rounded shrink-0">
                AI Vision
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-mono text-slate-500 font-bold">{doc.category}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[9px] font-mono text-slate-400">{doc.size}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[9px] font-mono text-slate-400">{doc.uploadDate}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${statusStyles[doc.status]}`}>
          {StatusIcon[doc.status]}
          {doc.status}
        </div>
        <button 
          onClick={onViewDetails}
          className="p-1.5 text-slate-400 hover:text-survyx-navy transition-colors rounded-lg hover:bg-slate-100"
          title="View document details & AI telemetry"
        >
          <Eye size={16} />
        </button>
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
