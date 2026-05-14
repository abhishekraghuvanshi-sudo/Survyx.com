import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  ChevronLeft,
  Building2,
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  Linkedin,
  Chrome
} from 'lucide-react';

interface AuthProps {
  onLogin: (email: string) => void;
  onBack: () => void;
}

export default function Auth({ onLogin, onBack }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'email' && (!email || !password)) {
      setError('Please provide valid registry credentials.');
      return;
    }
    if (method === 'phone' && !phone) {
       setError('Please provide a registered mobile number.');
       return;
    }
    setError('');
    // Mock successful login
    onLogin(email || phone);
  };

  return (
    <div className="min-h-screen bg-survyx-slate flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="absolute top-8 left-8">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-survyx-navy transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ChevronLeft size={16} />
          <span>Marketplace Home</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 bg-survyx-navy rounded-2xl flex items-center justify-center font-black text-white shadow-xl mb-6">S</div>
        <h2 className="text-3xl font-black text-survyx-navy tracking-tighter">
          {mode === 'login' ? 'Institutional Access' : 'Business Registration'}
        </h2>
        <p className="mt-2 text-sm text-slate-500 uppercase tracking-widest font-bold">
          {mode === 'login' ? 'Access your Global Marketplace Hub' : 'Register your entity on the SURVYX Platform'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          layout
          className="registry-card p-8 bg-white border-2 border-slate-100 shadow-xl"
        >
          {/* Method Switcher */}
          {mode === 'login' && (
            <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
              <button 
                onClick={() => setMethod('email')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${method === 'email' ? 'bg-white text-survyx-navy shadow-sm' : 'text-slate-400'}`}
              >
                Email
              </button>
              <button 
                onClick={() => setMethod('phone')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${method === 'phone' ? 'bg-white text-survyx-navy shadow-sm' : 'text-slate-400'}`}
              >
                Phone
              </button>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                   <AuthInput label="Legal Business Name" icon={<Building2 size={18} />} placeholder="e.g. KUMAR INDUSTRIAL SOLUTIONS" />
                   <AuthInput label="Business GSTIN" icon={<FileText size={18} />} placeholder="Enter 15-digit GSTIN" />
                   <div className="grid grid-cols-2 gap-4">
                     <AuthInput label="State" placeholder="e.g. Maharashtra" />
                     <AuthInput label="Business Type" placeholder="e.g. Manufacturing" />
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {method === 'email' ? (
              <AuthInput 
                label="Professional Email" 
                icon={<Mail size={18} />} 
                placeholder="name@business.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <AuthInput 
                label="Registered Mobile" 
                icon={<Phone size={18} />} 
                placeholder="+91 XXXXX XXXXX" 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            )}

            {mode === 'login' && method === 'email' && (
              <div className="relative">
                <AuthInput 
                  label="Access Password" 
                  icon={<Lock size={18} />} 
                  placeholder="••••••••" 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-3.5 text-slate-400 hover:text-survyx-blue"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-bold border border-red-100">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 bg-survyx-navy text-white rounded-2xl shadow-xl hover:bg-black transition-all font-bold uppercase tracking-widest text-xs group"
              >
                {mode === 'login' ? 'Validate Access' : 'Initialize Registration'}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </button>
            </div>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                <span className="bg-white px-4 text-slate-400">Secure SSO Hub</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => onLogin('google-user@survyx.com')}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-xs font-bold text-slate-600 active:scale-95"
              >
                <Chrome size={16} className="text-red-500" />
                <span>Google</span>
              </button>
              <button 
                type="button"
                onClick={() => onLogin('linkedin-user@survyx.com')}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-xs font-bold text-slate-600 active:scale-95"
              >
                <Linkedin size={16} className="text-blue-600" />
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs font-bold text-survyx-blue hover:underline uppercase tracking-widest"
            >
              {mode === 'login' ? "Don't have a Registry ID? Register Entity" : "Already registered? Sign In"}
            </button>
          </div>
        </motion.div>

        <div className="mt-8 flex items-center justify-center space-x-2 text-slate-400">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">256-Bit Encrypted Marketplace Session</span>
        </div>
      </div>
    </div>
  );
}

function AuthInput({ label, icon, placeholder, type = 'text', value, onChange }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-survyx-blue transition-colors">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-survyx-blue focus:border-survyx-blue focus:bg-white outline-none transition-all"
        />
      </div>
    </div>
  );
}

