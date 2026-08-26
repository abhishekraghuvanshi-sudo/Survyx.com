import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2, 
  Sparkles, 
  KeyRound, 
  Users, 
  RefreshCw, 
  Briefcase, 
  Shield, 
  Globe2,
  Check,
  Smartphone,
  BadgeCheck,
  Award,
  Hash,
  ExternalLink,
  MessageSquare,
  Clock,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { useUserJourney } from '../context/UserJourneyContext';
import { UserAccount, getRememberedCredentials, setRememberedCredentials, DEFAULT_ACCOUNTS } from '../lib/authStorage';
import SurvyxLogo from '../components/SurvyxLogo';

// Authentic Google Multi-Color SVG Icon
function GoogleIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳', placeholder: '98200 12345' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸', placeholder: '555 123 4567' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', placeholder: '7911 123456' },
  { code: '+971', country: 'UAE', flag: '🇦🇪', placeholder: '50 123 4567' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', placeholder: '8123 4567' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', placeholder: '151 2345678' }
];

interface AuthProps {
  onLogin: (email: string, passwordOrName?: string, customData?: Partial<UserAccount>) => { success?: boolean; error?: string; account?: UserAccount; requiresRegistration?: boolean } | void;
  onBack: () => void;
}

export default function Auth({ onLogin, onBack }: AuthProps) {
  const { registerUser, registeredAccounts, loginUser } = useUserJourney();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  // Authentication Method: 'gmail' | 'phone' | 'email'
  const [authMethod, setAuthMethod] = useState<'gmail' | 'phone' | 'email'>('gmail');

  // Gmail / Google ID State
  const [gmailId, setGmailId] = useState('abhishek.raghuvanshi@gmail.com');
  const [showGoogleAccountModal, setShowGoogleAccountModal] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');
  const [googleCustomCompany, setGoogleCustomCompany] = useState('');
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  // Phone & OTP Login State
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('98200 12345');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('482915');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [smsToast, setSmsToast] = useState<{ show: boolean; code: string; phone: string } | null>(null);

  // Email / Password Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [unregisteredEmail, setUnregisteredEmail] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Registration State
  const [regName, setRegName] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regGstin, setRegGstin] = useState('');
  const [regState, setRegState] = useState('Maharashtra');
  const [regIndustry, setRegIndustry] = useState('Renewable Energy Infrastructure');
  const [regEmail, setRegEmail] = useState('');
  const [regCountryCode, setRegCountryCode] = useState('+91');
  const [regPhone, setRegPhone] = useState('');
  const [regPhoneVerified, setRegPhoneVerified] = useState(false);
  const [regPhoneOtpSent, setRegPhoneOtpSent] = useState(false);
  const [regPhoneOtpDigits, setRegPhoneOtpDigits] = useState(['', '', '', '', '', '']);
  const [regGeneratedOtp, setRegGeneratedOtp] = useState('592814');
  const [regOtpTimer, setRegOtpTimer] = useState(30);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<'buyer' | 'supplier'>('buyer');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Registration Success Modal State
  const [registeredAccount, setRegisteredAccount] = useState<UserAccount | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // OTP Input refs
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const regOtpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load remembered credentials on mount
  useEffect(() => {
    const remembered = getRememberedCredentials();
    if (remembered && remembered.email) {
      setEmail(remembered.email);
      if (remembered.password) {
        setPassword(remembered.password);
      }
      setRememberMe(true);
    } else {
      setEmail('abhishek.raghuvanshi@survyx.com');
      setPassword('password123');
    }
  }, []);

  // OTP Countdown timer for Login
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  // OTP Countdown timer for Registration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (regPhoneOtpSent && regOtpTimer > 0 && !regPhoneVerified) {
      interval = setInterval(() => {
        setRegOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [regPhoneOtpSent, regOtpTimer, regPhoneVerified]);

  // -------------------------------------------------------------
  // GMAIL / GOOGLE LOGIN HANDLERS
  // -------------------------------------------------------------
  const handleGmailSignIn = (selectedGmail: string, displayName?: string, companyName?: string) => {
    setError('');
    setIsGoogleSigningIn(true);
    
    setTimeout(() => {
      const cleanEmail = selectedGmail.trim().toLowerCase();
      const userName = displayName || (cleanEmail.includes('abhishek') 
        ? 'Abhishek Raghuvanshi' 
        : cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()));
      
      const bName = companyName || (cleanEmail.includes('abhishek')
        ? 'KUMAR INDUSTRIAL SOLUTIONS PVT LTD'
        : `${userName.split(' ')[0].toUpperCase()} ENTERPRISES PVT LTD`);

      const res = loginUser(cleanEmail, 'Google Workspace SSO User', {
        name: userName,
        businessName: bName,
        industryCategory: 'Renewable Energy Infrastructure',
        role: 'buyer',
        email: cleanEmail,
        isNewRegistration: true
      });

      setIsGoogleSigningIn(false);
      setShowGoogleAccountModal(false);

      if (res && !res.success) {
        setError(res.error || 'Google Authentication failed. Please try again.');
      }
    }, 600);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleCustomEmail || !googleCustomEmail.includes('@')) {
      setError('Please enter a valid Gmail or Google Workspace email address.');
      return;
    }
    handleGmailSignIn(
      googleCustomEmail, 
      googleCustomName || undefined, 
      googleCustomCompany || undefined
    );
  };

  // -------------------------------------------------------------
  // PHONE OTP LOGIN HANDLERS
  // -------------------------------------------------------------
  const handleSendPhoneOtp = () => {
    const rawDigits = phone.replace(/\D/g, '');
    if (rawDigits.length < 8) {
      setError('Please enter a valid contact number (at least 8-10 digits).');
      return;
    }
    setError('');
    setIsSendingOtp(true);

    // Generate random 6-digit OTP
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);

    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
      setOtpTimer(30);
      setOtpDigits(['', '', '', '', '', '']);
      
      // Dispatch simulated SMS banner
      const fullPhone = `${countryCode} ${phone.trim()}`;
      setSmsToast({ show: true, code: newCode, phone: fullPhone });
      setSuccessMsg(`SURVYX-AUTH: SMS OTP sent to ${fullPhone}. Code: ${newCode}`);
      
      // Focus first digit box
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }, 600);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    // Only allow numbers
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newDigits = [...otpDigits];

    if (cleanVal.length > 1) {
      // Handle paste
      const pastedChars = cleanVal.slice(0, 6).split('');
      pastedChars.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pastedChars.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance to next box
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillOtp = (codeToFill: string) => {
    const chars = codeToFill.split('');
    setOtpDigits(chars);
    setError('');
  };

  const handleVerifyPhoneOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullEnteredOtp = otpDigits.join('');
    if (fullEnteredOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP sent via SMS.');
      return;
    }

    if (fullEnteredOtp !== generatedOtp && fullEnteredOtp !== '123456' && fullEnteredOtp !== '482915') {
      setError(`Invalid OTP. Please enter the statutory OTP: ${generatedOtp}`);
      return;
    }

    const fullPhone = `${countryCode} ${phone.trim()}`;
    // Check if phone matches an existing account
    const accounts = registeredAccounts;
    const cleanDigits = phone.replace(/\D/g, '');
    const matched = accounts.find(a => a.phone.replace(/\D/g, '').includes(cleanDigits));

    if (matched) {
      loginUser(matched.email, 'Mobile Sign In', { phone: fullPhone, rememberMe });
    } else {
      // Auto-register a verified mobile entity session
      loginUser(fullPhone, 'Mobile Sign In', {
        name: `Contact Signatory (${phone.slice(-4)})`,
        businessName: 'INDUSTRIAL COMMERCE ENTERPRISE',
        phone: fullPhone,
        email: `auth.${cleanDigits}@survyx.com`,
        role: 'buyer',
        isNewRegistration: true,
        rememberMe
      });
    }
  };

  // -------------------------------------------------------------
  // REGISTRATION PHONE OTP HANDLERS
  // -------------------------------------------------------------
  const handleSendRegPhoneOtp = () => {
    const cleanDigits = regPhone.replace(/\D/g, '');
    if (cleanDigits.length < 8) {
      setError('Please enter a valid 10-digit direct phone number.');
      return;
    }
    setError('');
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setRegGeneratedOtp(newCode);
    setRegPhoneOtpSent(true);
    setRegOtpTimer(30);
    setRegPhoneOtpDigits(['', '', '', '', '', '']);
    
    const fullPhone = `${regCountryCode} ${regPhone.trim()}`;
    setSmsToast({ show: true, code: newCode, phone: fullPhone });
    setSuccessMsg(`SMS OTP sent to ${fullPhone}. Code: ${newCode}`);

    setTimeout(() => {
      regOtpInputRefs.current[0]?.focus();
    }, 100);
  };

  const handleRegOtpDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    const newDigits = [...regPhoneOtpDigits];

    if (cleanVal.length > 1) {
      const pastedChars = cleanVal.slice(0, 6).split('');
      pastedChars.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setRegPhoneOtpDigits(newDigits);
      const nextIdx = Math.min(pastedChars.length, 5);
      regOtpInputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setRegPhoneOtpDigits(newDigits);

    if (cleanVal && index < 5) {
      regOtpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyRegPhoneOtp = () => {
    const entered = regPhoneOtpDigits.join('');
    if (entered === regGeneratedOtp || entered === '123456' || entered === '592814') {
      setRegPhoneVerified(true);
      setError('');
      setSuccessMsg('✓ Mobile contact number verified successfully via SMS OTP!');
    } else {
      setError(`Invalid OTP. Enter the statutory SMS code: ${regGeneratedOtp}`);
    }
  };

  // -------------------------------------------------------------
  // TRADITIONAL EMAIL / PASSWORD LOGIN HANDLER
  // -------------------------------------------------------------
  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUnregisteredEmail(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please provide your professional email address.');
      return;
    }
    if (!password) {
      setError('Please enter your account access password.');
      return;
    }

    const res = loginUser(cleanEmail, password, { rememberMe });
    if (res && !res.success) {
      setError(res.error || 'Authentication failed. Please verify credentials or register.');
      if (res.requiresRegistration) {
        setUnregisteredEmail(cleanEmail);
      }
      return;
    }

    if (rememberMe) {
      setRememberedCredentials({
        email: cleanEmail,
        password: password,
        remember: true
      });
    }
  };

  // -------------------------------------------------------------
  // REGISTRATION FORM SUBMIT HANDLER
  // -------------------------------------------------------------
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regName.trim()) {
      setError('Please enter the Authorized Signatory Full Name.');
      return;
    }
    if (!regBusinessName.trim()) {
      setError('Please enter your Legal Business Name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Please provide a valid corporate email address or Gmail ID.');
      return;
    }
    if (!regPhone.trim() || regPhone.replace(/\D/g, '').length < 8) {
      setError('Please enter a valid business contact number.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify confirmation password.');
      return;
    }
    if (!agreedTerms) {
      setError('Please accept the SURVYX Institutional Governance & Escrow Covenants.');
      return;
    }

    const cleanGstin = regGstin.trim().toUpperCase() || '27AABCU9603R1ZM';
    const pan = cleanGstin.length >= 12 ? cleanGstin.substring(2, 12) : 'AABCU9603R';
    const fullPhone = `${regCountryCode} ${regPhone.trim()}`;

    const res = registerUser({
      name: regName.trim(),
      businessName: regBusinessName.trim().toUpperCase(),
      gstin: cleanGstin,
      pan: pan,
      state: regState,
      industryCategory: regIndustry,
      email: regEmail.trim().toLowerCase(),
      phone: fullPhone,
      password: regPassword,
      role: regRole,
      rememberMe: true
    });

    if (res.success && res.account) {
      setRememberedCredentials({
        email: res.account.email,
        password: regPassword,
        remember: true
      });
      setRegisteredAccount(res.account);
      setShowSuccessModal(true);
    } else {
      setError(res.message || 'Registration could not be completed.');
      if (res.alreadyExists) {
        setEmail(regEmail.trim().toLowerCase());
      }
    }
  };

  const handleQuickLogin = (account: UserAccount) => {
    setEmail(account.email);
    setPassword(account.password || 'password123');
    setRememberedCredentials({
      email: account.email,
      password: account.password || 'password123',
      remember: true
    });
    loginUser(account.email, account.password || 'password123', account);
  };

  const switchToRegisterWithEmail = (prefillEmail: string) => {
    setRegEmail(prefillEmail);
    setMode('register');
    setError('');
    setUnregisteredEmail(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Top Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Simulated Live SMS Notification Toast */}
      <AnimatePresence>
        {smsToast && smsToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-blue-500/40 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
                  <Smartphone size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-300">SURVYX-SECURE-SMS</span>
                    <span className="text-[9px] text-slate-400 font-mono">Just now</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-0.5">
                    Your verification OTP for <strong>{smsToast.phone}</strong> is:
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSmsToast(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between bg-slate-800/80 rounded-xl p-2.5 border border-slate-700">
              <span className="text-lg font-mono font-black text-amber-400 tracking-[0.3em]">
                {smsToast.code}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (mode === 'login' && authMethod === 'phone') {
                    handleAutoFillOtp(smsToast.code);
                  } else if (mode === 'register') {
                    setRegPhoneOtpDigits(smsToast.code.split(''));
                  }
                  setSmsToast(null);
                }}
                className="px-2.5 py-1 bg-survyx-blue hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all shadow-xs"
              >
                Auto-fill Code
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 bg-white/90 hover:bg-white text-slate-600 hover:text-survyx-navy px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-all font-bold text-xs uppercase tracking-widest backdrop-blur-sm active:scale-95"
        >
          <ChevronLeft size={16} />
          <span>Marketplace Home</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10 flex flex-col items-center">
        <div className="mb-3">
          <SurvyxLogo size="lg" variant="dark" subtitle="India's Sovereign B2B Marketplace & Escrow Protocol" />
        </div>
        <p className="mt-1 text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">
          {mode === 'login' ? 'Institutional Access & Multi-Factor Authentication' : 'Register New Enterprise Entity'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <motion.div 
          layout
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl shadow-slate-200/60 relative"
        >
          {/* Status feedback bar */}
          <div className="mb-6 flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span className="font-bold text-[11px]">256-Bit Encrypted Sovereign Registry Auth Active</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              {registeredAccounts.length} Verified Entities
            </span>
          </div>

          {/* Mode Switcher: Sign In vs Register */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button 
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); setUnregisteredEmail(null); }}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                mode === 'login' 
                  ? 'bg-survyx-navy text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <KeyRound size={14} />
              <span>Sign In</span>
            </button>
            <button 
              onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); setUnregisteredEmail(null); }}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                mode === 'register' 
                  ? 'bg-survyx-navy text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 size={14} />
              <span>Register Entity</span>
            </button>
          </div>

          {/* LOGIN VIEW */}
          {mode === 'login' && (
            <div>
              {/* Top Auth Method Selector: Gmail ID vs Contact No. OTP vs Corporate Email */}
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('gmail'); setError(''); setUnregisteredEmail(null); }}
                  className={`py-2 px-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    authMethod === 'gmail'
                      ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 ring-1 ring-blue-500/20'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <GoogleIcon size={14} />
                  <span className="truncate">Gmail / Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAuthMethod('phone'); setError(''); setUnregisteredEmail(null); }}
                  className={`py-2 px-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    authMethod === 'phone'
                      ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 ring-1 ring-blue-500/20'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Smartphone size={14} className="text-survyx-blue" />
                  <span className="truncate">Contact No. OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAuthMethod('email'); setError(''); setUnregisteredEmail(null); }}
                  className={`py-2 px-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    authMethod === 'email'
                      ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 ring-1 ring-blue-500/20'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Mail size={14} className="text-slate-600" />
                  <span className="truncate">Corporate Email</span>
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* METHOD 1: GMAIL ID / GOOGLE LOGIN */}
              {/* ------------------------------------------------------------- */}
              {authMethod === 'gmail' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50/80 via-white to-slate-50 rounded-2xl border border-blue-100 shadow-xs">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center shrink-0">
                        <GoogleIcon size={22} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Google / Gmail ID Single Sign-On
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          One-tap authenticated institutional access via Google Identity Protocol.
                        </p>
                      </div>
                    </div>

                    {/* Primary Google Login Button */}
                    <button
                      type="button"
                      disabled={isGoogleSigningIn}
                      onClick={() => setShowGoogleAccountModal(true)}
                      className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 rounded-xl shadow-md font-bold text-xs uppercase tracking-wider transition-all group active:scale-98"
                    >
                      <GoogleIcon size={18} />
                      <span>{isGoogleSigningIn ? 'Verifying with Google...' : 'Sign in with Google / Gmail ID'}</span>
                    </button>
                  </div>

                  {/* Fast 1-Click Saved Google / Gmail Profiles */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Sparkles size={11} className="text-amber-500" />
                        Quick Select Gmail Account:
                      </span>
                      <span className="text-[9px] font-bold text-survyx-blue">Instant Clearance</span>
                    </div>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleGmailSignIn('abhishek.raghuvanshi@gmail.com', 'Abhishek Raghuvanshi', 'KUMAR INDUSTRIAL SOLUTIONS PVT LTD')}
                        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 rounded-xl transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            AR
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-survyx-navy">
                              Abhishek Raghuvanshi
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              abhishek.raghuvanshi@gmail.com
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black text-survyx-blue uppercase tracking-wider bg-white px-2 py-1 rounded-lg border border-blue-100 group-hover:bg-survyx-blue group-hover:text-white transition-colors">
                          Select →
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleGmailSignIn('rajesh.sharma.b2b@gmail.com', 'Rajesh Sharma', 'SOLARGRID HIGH-TECH COMPONENTS LTD')}
                        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 rounded-xl transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            RS
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-survyx-navy">
                              Rajesh Sharma (Supplier)
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              rajesh.sharma.b2b@gmail.com
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black text-survyx-blue uppercase tracking-wider bg-white px-2 py-1 rounded-lg border border-blue-100 group-hover:bg-survyx-blue group-hover:text-white transition-colors">
                          Select →
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Custom Gmail ID Manual Input */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowGoogleAccountModal(true)}
                      className="w-full py-2.5 text-center text-xs font-bold text-slate-600 hover:text-survyx-blue hover:underline bg-slate-100/60 rounded-xl transition-colors"
                    >
                      + Use another Gmail address / Custom Google Workspace ID
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* METHOD 2: CONTACT NO. THROUGH OTP VERIFICATION */}
              {/* ------------------------------------------------------------- */}
              {authMethod === 'phone' && (
                <form onSubmit={handleVerifyPhoneOtpLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                      Business Contact Number
                    </label>
                    <div className="flex gap-2">
                      {/* Country Code Dropdown */}
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="py-3 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue outline-none shrink-0"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>

                      {/* Phone Input */}
                      <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-survyx-blue">
                          <Smartphone size={16} />
                        </div>
                        <input
                          type="tel"
                          placeholder="98200 12345"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setOtpSent(false);
                          }}
                          required
                          className="block w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:bg-white outline-none transition-all"
                        />
                      </div>

                      {/* Send / Resend OTP Button */}
                      <button
                        type="button"
                        onClick={handleSendPhoneOtp}
                        disabled={isSendingOtp || (otpSent && otpTimer > 0)}
                        className="px-4 py-3 bg-survyx-navy hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 active:scale-95 disabled:opacity-60 shadow-sm"
                      >
                        {isSendingOtp 
                          ? 'Sending...' 
                          : (otpSent ? (otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Resend OTP') : 'Send OTP')}
                      </button>
                    </div>
                  </div>

                  {/* 6-Digit OTP Verification Box */}
                  {otpSent && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <MessageSquare size={14} className="text-survyx-blue" />
                          <span>Enter 6-Digit SMS Verification OTP:</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAutoFillOtp(generatedOtp)}
                          className="text-[10px] font-black uppercase tracking-wider text-survyx-blue bg-white hover:bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 shadow-2xs transition-colors"
                        >
                          Auto-fill ({generatedOtp})
                        </button>
                      </div>

                      {/* 6 Segmented Digit Boxes */}
                      <div className="flex justify-between gap-1.5 sm:gap-2">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (otpInputRefs.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-11 h-12 text-center text-lg font-mono font-black bg-white border-2 border-slate-200 focus:border-survyx-blue focus:ring-2 focus:ring-survyx-blue/20 rounded-xl outline-none shadow-xs text-slate-900"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          OTP expires in 10 minutes
                        </span>
                        {otpTimer > 0 ? (
                          <span className="text-blue-600 font-bold">Resend available in {otpTimer}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendPhoneOtp}
                            className="text-survyx-blue font-bold hover:underline"
                          >
                            Resend SMS OTP
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Quick Preset Phone Numbers for Testing */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                      Test with Demo Enterprise Numbers:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPhone('98200 12345');
                          setOtpSent(false);
                        }}
                        className="text-left p-1.5 bg-white border border-slate-200 rounded-lg text-[10px] hover:border-blue-400 transition-colors"
                      >
                        <p className="font-bold text-slate-800">+91 98200 12345</p>
                        <p className="text-[9px] text-slate-500">Abhishek (Buyer)</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhone('98111 54321');
                          setOtpSent(false);
                        }}
                        className="text-left p-1.5 bg-white border border-slate-200 rounded-lg text-[10px] hover:border-blue-400 transition-colors"
                      >
                        <p className="font-bold text-slate-800">+91 98111 54321</p>
                        <p className="text-[9px] text-slate-500">Rajesh (Supplier)</p>
                      </button>
                    </div>
                  </div>

                  {/* Verify & Access Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-survyx-navy hover:bg-slate-900 text-white rounded-xl shadow-xl shadow-blue-900/10 transition-all font-black uppercase tracking-wider text-xs group active:scale-98"
                  >
                    <span>{otpSent ? 'Verify OTP & Enter Marketplace' : 'Send SMS Verification OTP'}</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={15} />
                  </button>
                </form>
              )}

              {/* ------------------------------------------------------------- */}
              {/* METHOD 3: TRADITIONAL CORPORATE EMAIL & PASSWORD */}
              {/* ------------------------------------------------------------- */}
              {authMethod === 'email' && (
                <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
                  <AuthInput 
                    label="Professional Email" 
                    icon={<Mail size={16} />} 
                    placeholder="name@company.com" 
                    type="email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    required
                  />

                  <div>
                    <div className="flex justify-between items-center mb-1 ml-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Access Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-[10px] font-bold text-survyx-blue hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-survyx-blue">
                        <Lock size={16} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:bg-white outline-none transition-all"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-survyx-blue focus:ring-survyx-blue border-slate-300"
                      />
                      <span className="text-xs text-slate-600 font-medium">Save login credentials on this workstation</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-survyx-navy hover:bg-slate-900 text-white rounded-xl shadow-xl shadow-blue-900/10 transition-all font-black uppercase tracking-wider text-xs group active:scale-98"
                  >
                    <span>Validate Credentials & Enter Hub</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={15} />
                  </button>
                </form>
              )}

              {/* Error Callout */}
              {error && (
                <div className="mt-4 bg-rose-50 text-rose-700 p-3.5 rounded-2xl border border-rose-200 space-y-2">
                  <div className="flex items-start gap-2 text-xs font-bold">
                    <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                  {unregisteredEmail && (
                    <div className="pt-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => switchToRegisterWithEmail(unregisteredEmail)}
                        className="text-[11px] font-black uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <span>Register Entity with this Email</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {successMsg && (
                <div className="mt-4 bg-emerald-50 text-emerald-700 p-3 rounded-xl flex items-center gap-2 text-xs font-bold border border-emerald-100">
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* REGISTRATION FORM (WITH PHONE OTP VERIFICATION) */}
          {/* ------------------------------------------------------------- */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setRegRole('buyer')}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                    regRole === 'buyer' ? 'bg-white text-survyx-navy shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Procurement Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('supplier')}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                    regRole === 'supplier' ? 'bg-white text-survyx-navy shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Institutional Supplier
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AuthInput 
                  label="Signatory Full Name" 
                  placeholder="e.g. Abhishek Raghuvanshi"
                  value={regName}
                  onChange={(e: any) => setRegName(e.target.value)}
                  required
                />
                <AuthInput 
                  label="Legal Business Name" 
                  placeholder="e.g. KUMAR INDUSTRIAL SOLUTIONS PVT LTD"
                  value={regBusinessName}
                  onChange={(e: any) => setRegBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <AuthInput 
                    label="Business GSTIN (15 Digits)" 
                    placeholder="27AABCU9603R1ZM"
                    value={regGstin}
                    onChange={(e: any) => setRegGstin(e.target.value.toUpperCase())}
                  />
                  {regGstin.length >= 12 && (
                    <div className="mt-1 flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                      <span className="text-slate-400">PAN Auto-detected:</span>
                      <span className="font-bold text-survyx-navy bg-slate-100 px-1 py-0.5 rounded">
                        {regGstin.substring(2, 12)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">
                    State / Region
                  </label>
                  <select
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="block w-full py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue outline-none"
                  >
                    <option value="Maharashtra">Maharashtra (MIDC / Mumbai / Pune)</option>
                    <option value="Delhi NCR">Delhi NCR (Gurugram / Noida)</option>
                    <option value="Gujarat">Gujarat (Ahmedabad / Surat)</option>
                    <option value="Karnataka">Karnataka (Bengaluru / Peenya)</option>
                    <option value="Tamil Nadu">Tamil Nadu (Chennai / Coimbatore)</option>
                    <option value="Telangana">Telangana (Hyderabad)</option>
                    <option value="Other Region">Other National Industrial Zone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">
                  Primary Industry Sector
                </label>
                <select
                  value={regIndustry}
                  onChange={(e) => setRegIndustry(e.target.value)}
                  className="block w-full py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue outline-none"
                >
                  <option value="Renewable Energy Infrastructure">Renewable Energy Infrastructure (Solar, Wind, Battery)</option>
                  <option value="Heavy Manufacturing">Heavy Manufacturing & Foundry Materials</option>
                  <option value="Automotive & EV Supply">Automotive & Electric Vehicle Precision Supply</option>
                  <option value="Industrial Electricals">Industrial Electricals & Switchgears</option>
                  <option value="Chemical & Polymers">Specialty Chemicals & Industrial Polymers</option>
                </select>
              </div>

              {/* Official Email / Gmail */}
              <div>
                <AuthInput 
                  label="Corporate Email or Gmail ID" 
                  icon={<Mail size={16} />} 
                  placeholder="name@company.com or user@gmail.com" 
                  type="email"
                  value={regEmail}
                  onChange={(e: any) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              {/* Direct Phone Number with Live OTP Verification */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Direct Contact Number <span className="text-red-500">*</span>
                  </label>
                  {regPhoneVerified && (
                    <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle size={12} />
                      Phone Verified via OTP
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <select
                    value={regCountryCode}
                    onChange={(e) => setRegCountryCode(e.target.value)}
                    className="py-3 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>

                  <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-survyx-blue">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      placeholder="98200 12345"
                      value={regPhone}
                      onChange={(e) => {
                        setRegPhone(e.target.value);
                        setRegPhoneVerified(false);
                      }}
                      required
                      className="block w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:bg-white outline-none transition-all"
                    />
                  </div>

                  {!regPhoneVerified && (
                    <button
                      type="button"
                      onClick={handleSendRegPhoneOtp}
                      className="px-3.5 py-3 bg-blue-50 hover:bg-blue-100 text-survyx-blue border border-blue-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 active:scale-95"
                    >
                      {regPhoneOtpSent ? 'Resend' : 'Verify via OTP'}
                    </button>
                  )}
                </div>

                {/* Inline OTP entry for registration */}
                {regPhoneOtpSent && !regPhoneVerified && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 text-[11px]">Enter SMS OTP:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setRegPhoneOtpDigits(regGeneratedOtp.split(''));
                        }}
                        className="text-[9px] font-black text-survyx-blue bg-white px-2 py-0.5 rounded border border-blue-200"
                      >
                        Auto-fill ({regGeneratedOtp})
                      </button>
                    </div>

                    <div className="flex gap-1.5 justify-between">
                      {regPhoneOtpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (regOtpInputRefs.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleRegOtpDigitChange(idx, e.target.value)}
                          className="w-9 h-10 text-center text-base font-mono font-bold bg-white border border-slate-300 focus:border-survyx-blue rounded-lg outline-none"
                        />
                      ))}
                      <button
                        type="button"
                        onClick={handleVerifyRegPhoneOtp}
                        className="px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shrink-0 shadow-xs"
                      >
                        Confirm
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <AuthInput 
                    label="Create Password (min 6 chars)" 
                    placeholder="••••••••" 
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e: any) => setRegPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-700"
                  >
                    {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <AuthInput 
                  label="Confirm Password" 
                  placeholder="••••••••" 
                  type={showRegPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e: any) => setRegConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-left">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-survyx-blue focus:ring-survyx-blue border-slate-300 shrink-0"
                  />
                  <span className="text-[11px] text-slate-600 leading-snug">
                    I confirm authority as designated signatory and agree to SURVYX Multi-Sig Escrow Covenants and Statutory Verification Protocols.
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-bold border border-red-100">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-survyx-navy hover:bg-slate-900 text-white rounded-xl shadow-xl shadow-blue-900/10 transition-all font-black uppercase tracking-wider text-xs group active:scale-98"
              >
                <span>Register Entity, Save Data & Enter Hub</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={15} />
              </button>
            </form>
          )}

          {/* Footer toggle */}
          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
                setSuccessMsg('');
                setUnregisteredEmail(null);
              }}
              className="text-xs font-bold text-survyx-blue hover:underline uppercase tracking-wider"
            >
              {mode === 'login' ? "Need a new Enterprise Account? Register Entity" : "Already have a registered account? Sign In"}
            </button>
          </div>
        </motion.div>

        {/* Registered Entities Table / Storage Preview */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Users size={13} className="text-slate-400" />
              Registered Accounts in Database ({registeredAccounts.length}):
            </span>
            <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Persistent Storage
            </span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {registeredAccounts.map(acc => (
              <div 
                key={acc.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-5 h-5 rounded-md bg-survyx-navy text-white text-[9px] font-black flex items-center justify-center shrink-0">
                    {acc.name.charAt(0)}
                  </div>
                  <div className="truncate text-left">
                    <p className="text-[11px] font-bold text-slate-800 truncate">{acc.businessName}</p>
                    <p className="text-[9px] text-slate-500 font-mono truncate">{acc.email} • {acc.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className="px-2 py-1 bg-white hover:bg-survyx-blue hover:text-white border border-slate-200 text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors shrink-0 shadow-2xs"
                >
                  Sign In
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Session Info Bar */}
        <div className="mt-4 flex items-center justify-between text-slate-500 text-[10px] px-2 font-mono">
          <span>SURVYX Multi-Sig Registry ID Auth</span>
          <span>Google SSO & SMS OTP Gateway</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* GOOGLE / GMAIL ACCOUNT SELECTOR MODAL */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {showGoogleAccountModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <GoogleIcon size={24} />
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Sign in with Google</h3>
                    <p className="text-[11px] text-slate-500">to continue to SURVYX Marketplace</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGoogleAccountModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Account List */}
              <div className="space-y-2 mb-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                  Choose an account:
                </p>

                <button
                  type="button"
                  onClick={() => handleGmailSignIn('abhishek.raghuvanshi@survyx.com', 'Abhishek Raghuvanshi', 'KUMAR INDUSTRIAL SOLUTIONS PVT LTD')}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-blue-50/70 hover:border-blue-300 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    AR
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-survyx-navy">Abhishek Raghuvanshi</p>
                    <p className="text-[11px] text-slate-500 font-mono">abhishek.raghuvanshi@survyx.com</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGmailSignIn('abhishek.raghuvanshi@gmail.com', 'Abhishek Raghuvanshi', 'KUMAR INDUSTRIAL SOLUTIONS PVT LTD')}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-blue-50/70 hover:border-blue-300 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    AR
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-survyx-navy">Abhishek (Personal Gmail)</p>
                    <p className="text-[11px] text-slate-500 font-mono">abhishek.raghuvanshi@gmail.com</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGmailSignIn('rajesh.sharma.b2b@gmail.com', 'Rajesh Sharma', 'SOLARGRID HIGH-TECH COMPONENTS LTD')}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-blue-50/70 hover:border-blue-300 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    RS
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-survyx-navy">Rajesh Sharma</p>
                    <p className="text-[11px] text-slate-500 font-mono">rajesh.sharma.b2b@gmail.com</p>
                  </div>
                </button>
              </div>

              {/* Custom Gmail Form */}
              <div className="border-t border-slate-100 pt-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 ml-1">
                  Or enter any Gmail address:
                </p>
                <form onSubmit={handleCustomGoogleSubmit} className="space-y-2.5">
                  <input
                    type="email"
                    placeholder="your.name@gmail.com"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Full Name (Optional)"
                      value={googleCustomName}
                      onChange={(e) => setGoogleCustomName(e.target.value)}
                      className="block w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Company Name (Optional)"
                      value={googleCustomCompany}
                      onChange={(e) => setGoogleCustomCompany(e.target.value)}
                      className="block w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-survyx-navy hover:bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Authenticate with this Google ID</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* REGISTRATION SUCCESS MODAL */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {showSuccessModal && registeredAccount && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-survyx-blue" />
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4 border border-emerald-200 shadow-lg shadow-emerald-500/10">
                  <BadgeCheck size={36} />
                </div>
                
                <h3 className="text-xl font-black text-survyx-navy">
                  Entity Successfully Registered & Authenticated!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your business credentials and verified phone number are saved to the encrypted registry database.
                </p>

                {/* Generated Identity Clearance Card */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Official Registry EUID:
                    </span>
                    <span className="text-xs font-mono font-black text-survyx-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {registeredAccount.euid}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Legal Entity</span>
                      <p className="font-bold text-slate-800 text-[11px] truncate">{registeredAccount.businessName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Signatory</span>
                      <p className="font-bold text-slate-800 text-[11px] truncate">{registeredAccount.name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Contact Phone</span>
                      <p className="font-mono text-emerald-700 font-bold text-[10px] truncate">{registeredAccount.phone}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Trust Score</span>
                      <p className="font-black text-emerald-600 text-[11px]">800 / 1000 (SILVER)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuccessModal(false);
                    }}
                    className="flex-1 py-3.5 px-4 bg-survyx-navy hover:bg-survyx-blue text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 transition-colors"
                  >
                    <span>Enter Marketplace Hub Now</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* FORGOT PASSWORD MODAL */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {showForgotPassword && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-survyx-blue flex items-center justify-center font-bold">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-survyx-navy">Reset Access Password</h3>
                  <p className="text-xs text-slate-500">SURVYX Registry Security Verification</p>
                </div>
              </div>

              {!resetSent ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enter your registered corporate email or Gmail ID. Officer Priya will issue an instant statutory OTP link to reset your credentials.
                  </p>
                  <AuthInput
                    label="Corporate Email or Gmail ID"
                    placeholder="name@company.com"
                    type="email"
                    value={resetEmail}
                    onChange={(e: any) => setResetEmail(e.target.value)}
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (resetEmail.includes('@')) {
                          setResetSent(true);
                        }
                      }}
                      className="flex-1 py-2.5 px-4 bg-survyx-navy hover:bg-survyx-blue text-white text-xs font-bold rounded-xl"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <Check size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Reset Token Dispatched</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Check inbox for {resetEmail}. Demo password reset to: <strong className="text-survyx-navy">password123</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSent(false);
                    }}
                    className="w-full py-2.5 bg-survyx-navy text-white text-xs font-bold rounded-xl"
                  >
                    Return to Login
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AuthInput({ label, icon, placeholder, type = 'text', value, onChange, required = false }: any) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-survyx-blue transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3.5'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:bg-white outline-none transition-all`}
        />
      </div>
    </div>
  );
}
