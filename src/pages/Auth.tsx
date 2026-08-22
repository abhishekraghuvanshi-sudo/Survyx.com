import React, { useState, useEffect } from 'react';
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
  Chrome, 
  CheckCircle2, 
  Sparkles, 
  KeyRound, 
  Users, 
  RefreshCw, 
  Briefcase, 
  Shield, 
  Globe2,
  Check,
  Smartphone
} from 'lucide-react';
import { useUserJourney } from '../context/UserJourneyContext';
import { UserAccount, getRememberedCredentials, setRememberedCredentials, DEFAULT_ACCOUNTS } from '../lib/authStorage';

interface AuthProps {
  onLogin: (email: string, passwordOrName?: string, customData?: Partial<UserAccount>) => void;
  onBack: () => void;
}

export default function Auth({ onLogin, onBack }: AuthProps) {
  const { registerUser, registeredAccounts, switchAccount } = useUserJourney();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [method, setMethod] = useState<'email' | 'phone'>('email');

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
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
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<'buyer' | 'supplier'>('buyer');

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
      // Default to primary enterprise email
      setEmail('abhishek.raghuvanshi@survyx.com');
      setPassword('password123');
    }
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setOtpSent(true);
    setOtpTimer(30);
    setSuccessMsg('SURVYX-AUTH: Verification OTP sent via SMS. Enter 123456 to verify.');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (method === 'email') {
      if (!email.trim()) {
        setError('Please provide your professional email address.');
        return;
      }
      if (!password) {
        setError('Please enter your account access password.');
        return;
      }

      // Save remembered credentials if checked
      setRememberedCredentials({
        email: email.trim(),
        password: rememberMe ? password : '',
        remember: rememberMe
      });

      // Call onLogin
      onLogin(email.trim(), password, { rememberMe });
    } else {
      // Phone method
      if (!phone.trim()) {
        setError('Please provide your registered mobile number.');
        return;
      }
      if (!otpSent) {
        handleSendOtp();
        return;
      }
      if (otpValue !== '123456' && otpValue.length < 4) {
        setError('Invalid OTP. Use test OTP: 123456');
        return;
      }

      onLogin(phone.trim(), 'Mobile Sign In', { phone: phone.trim(), rememberMe });
    }
  };

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
      setError('Please provide a valid corporate email address.');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 10) {
      setError('Please enter a valid 10-digit business phone number.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Register user through context
    const res = registerUser({
      name: regName.trim(),
      businessName: regBusinessName.trim().toUpperCase(),
      gstin: regGstin.trim().toUpperCase() || '27AABCU9603R1ZM',
      state: regState,
      industryCategory: regIndustry,
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim(),
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
      setSuccessMsg(`Welcome ${res.account.name}! Entity data saved to encrypted registry.`);
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
    onLogin(account.email, account.password || 'password123', account);
  };

  const handleSocialLogin = (provider: 'Google' | 'LinkedIn') => {
    const defaultEmail = provider === 'Google' 
      ? 'abhishek.raghuvanshi@survyx.com' 
      : 'abhishek.linkedin@survyx.com';

    onLogin(defaultEmail, `${provider} SSO User`, {
      name: 'Abhishek Raghuvanshi',
      businessName: 'KUMAR INDUSTRIAL SOLUTIONS PVT LTD',
      industryCategory: 'Renewable Energy Infrastructure',
      role: 'buyer'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Top Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 bg-white/80 hover:bg-white text-slate-600 hover:text-survyx-navy px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-all font-bold text-xs uppercase tracking-widest backdrop-blur-sm active:scale-95"
        >
          <ChevronLeft size={16} />
          <span>Marketplace Home</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10">
        <div className="mx-auto w-14 h-14 bg-survyx-navy rounded-2xl flex items-center justify-center font-black text-white shadow-xl mb-4 border border-white/20 text-2xl">
          S
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-survyx-navy tracking-tight">
          SURVYX<span className="text-survyx-blue">.com</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">
          {mode === 'login' ? 'Institutional Access & Saved Registry Portal' : 'Register New Enterprise Entity'}
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
              <span className="font-bold text-[11px]">256-Bit Encrypted Registry Storage Active</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
              Protocol v4.2
            </span>
          </div>

          {/* Mode Switcher: Sign In vs Register */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button 
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
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
              onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
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

          {/* Quick Demo 1-Click Accounts Bar */}
          {mode === 'login' && (
            <div className="mb-6 bg-blue-50/60 border border-blue-100 rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-survyx-navy flex items-center gap-1.5">
                  <Sparkles size={12} className="text-survyx-blue" />
                  Quick 1-Click Verified Logins:
                </span>
                <span className="text-[9px] font-bold text-blue-600">Pre-authenticated</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEFAULT_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickLogin(acc)}
                    className="text-left p-2 bg-white hover:bg-survyx-navy hover:text-white border border-blue-200/80 rounded-xl transition-all group shadow-sm active:scale-95"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-slate-900 group-hover:text-white truncate">
                        {acc.name.split(' ')[0]}
                      </p>
                      <span className="text-[8px] font-mono px-1 bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white rounded">
                        {acc.role}
                      </span>
                    </div>
                    <p className="text-[8px] text-slate-500 group-hover:text-slate-300 truncate font-mono mt-0.5">
                      {acc.businessName.split(' ')[0]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <div>
              {/* Method Switcher: Email vs Phone */}
              <div className="flex p-1 bg-slate-100/80 rounded-xl mb-5">
                <button 
                  type="button"
                  onClick={() => { setMethod('email'); setError(''); }}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                    method === 'email' ? 'bg-white text-survyx-navy shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Corporate Email
                </button>
                <button 
                  type="button"
                  onClick={() => { setMethod('phone'); setError(''); }}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                    method === 'phone' ? 'bg-white text-survyx-navy shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Mobile OTP
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {method === 'email' ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">
                        Registered Business Mobile
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1 group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-survyx-blue">
                            <Smartphone size={16} />
                          </div>
                          <input
                            type="tel"
                            placeholder="+91 98200 12345"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:bg-white outline-none transition-all"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpSent && otpTimer > 0}
                          className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-survyx-navy text-xs font-bold rounded-xl transition-all shrink-0 active:scale-95 disabled:opacity-60"
                        >
                          {otpSent ? (otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Resend OTP') : 'Send OTP'}
                        </button>
                      </div>
                    </div>

                    {otpSent && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Enter 6-Digit OTP
                          </label>
                          <button
                            type="button"
                            onClick={() => setOtpValue('123456')}
                            className="text-[9px] font-bold text-survyx-blue hover:underline bg-blue-50 px-2 py-0.5 rounded"
                          >
                            Auto-fill Test OTP (123456)
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="123456"
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value)}
                          className="block w-full text-center tracking-[0.5em] py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-mono font-bold focus:ring-2 focus:ring-survyx-blue/20 focus:border-survyx-blue focus:bg-white outline-none"
                        />
                      </motion.div>
                    )}
                  </>
                )}

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-survyx-blue focus:ring-survyx-blue border-slate-300"
                    />
                    <span className="text-xs text-slate-600 font-medium">Save login & entity data on this device</span>
                  </label>
                </div>

                {/* Error / Success messages */}
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-bold border border-red-100 animate-shake">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl flex items-center gap-2 text-xs font-bold border border-emerald-100">
                    <CheckCircle2 size={15} className="shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-survyx-navy hover:bg-slate-900 text-white rounded-xl shadow-xl shadow-blue-900/10 transition-all font-black uppercase tracking-wider text-xs group active:scale-98"
                >
                  <span>{method === 'email' ? 'Validate Access & Enter Hub' : (otpSent ? 'Verify OTP & Access Hub' : 'Send Verification OTP')}</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={15} />
                </button>
              </form>

              {/* SSO Social Logins */}
              <div className="mt-6">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
                    <span className="bg-white px-3 text-slate-400">Institutional SSO Hub</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-xs font-bold text-slate-700 active:scale-95"
                  >
                    <Chrome size={15} className="text-red-500" />
                    <span>Google Workspace</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleSocialLogin('LinkedIn')}
                    className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-xs font-bold text-slate-700 active:scale-95"
                  >
                    <Linkedin size={15} className="text-blue-600" />
                    <span>LinkedIn SSO</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* REGISTRATION FORM */}
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
                <AuthInput 
                  label="Business GSTIN (15 Digits)" 
                  placeholder="27AABCU9603R1ZM"
                  value={regGstin}
                  onChange={(e: any) => setRegGstin(e.target.value.toUpperCase())}
                />
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AuthInput 
                  label="Official Corporate Email" 
                  icon={<Mail size={16} />} 
                  placeholder="name@company.com" 
                  type="email"
                  value={regEmail}
                  onChange={(e: any) => setRegEmail(e.target.value)}
                  required
                />
                <AuthInput 
                  label="Direct Phone Number" 
                  icon={<Phone size={16} />} 
                  placeholder="+91 98200 XXXXX" 
                  type="tel"
                  value={regPhone}
                  onChange={(e: any) => setRegPhone(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AuthInput 
                  label="Create Password" 
                  placeholder="••••••••" 
                  type="password"
                  value={regPassword}
                  onChange={(e: any) => setRegPassword(e.target.value)}
                  required
                />
                <AuthInput 
                  label="Confirm Password" 
                  placeholder="••••••••" 
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e: any) => setRegConfirmPassword(e.target.value)}
                  required
                />
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
                <span>Register Entity & Save Credentials</span>
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
              }}
              className="text-xs font-bold text-survyx-blue hover:underline uppercase tracking-wider"
            >
              {mode === 'login' ? "Need a new Enterprise Account? Register Entity" : "Already have a registered account? Sign In"}
            </button>
          </div>
        </motion.div>

        {/* Saved Session Info Bar */}
        <div className="mt-4 flex items-center justify-between text-slate-500 text-[10px] px-2 font-mono">
          <span>SURVYX Multi-Sig Registry ID Auth</span>
          <span>Encrypted Session Storage Active</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
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
                    Enter your registered corporate email. Officer Priya will issue an instant statutory OTP link to reset your credentials.
                  </p>
                  <AuthInput
                    label="Corporate Email"
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
