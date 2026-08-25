import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, RefreshCw, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

interface SessionCountdownTimerProps {
  initialDurationSeconds?: number;
  warnThresholdSeconds?: number;
  onSessionExpired: () => void;
  className?: string;
}

export default function SessionCountdownTimer({
  initialDurationSeconds = 15 * 60, // 15 minutes default institutional session
  warnThresholdSeconds = 3 * 60,    // Warn when <= 3 minutes left
  onSessionExpired,
  className = ''
}: SessionCountdownTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    // Check if there is an active session expiry timestamp in sessionStorage
    const storedExpiry = sessionStorage.getItem('survyx_session_expiry_ts');
    if (storedExpiry) {
      const remaining = Math.max(0, Math.floor((parseInt(storedExpiry, 10) - Date.now()) / 1000));
      return remaining > 0 ? remaining : initialDurationSeconds;
    }
    const expiry = Date.now() + initialDurationSeconds * 1000;
    sessionStorage.setItem('survyx_session_expiry_ts', expiry.toString());
    return initialDurationSeconds;
  });

  const [isRenewing, setIsRenewing] = useState(false);
  const [showRenewSuccess, setShowRenewSuccess] = useState(false);

  // Extend / Reset session
  const extendSession = useCallback((addedMinutes = 15) => {
    setIsRenewing(true);
    setTimeout(() => {
      const newExpiry = Date.now() + addedMinutes * 60 * 1000;
      sessionStorage.setItem('survyx_session_expiry_ts', newExpiry.toString());
      setSecondsRemaining(addedMinutes * 60);
      setIsRenewing(false);
      setShowRenewSuccess(true);
      setTimeout(() => setShowRenewSuccess(false), 3000);
    }, 400);
  }, []);

  // Activity listeners to optionally extend session on user interactions if within critical window
  useEffect(() => {
    const handleUserActivity = () => {
      const storedExpiry = sessionStorage.getItem('survyx_session_expiry_ts');
      if (storedExpiry) {
        const remaining = Math.floor((parseInt(storedExpiry, 10) - Date.now()) / 1000);
        // If expired, trigger logout
        if (remaining <= 0) {
          onSessionExpired();
        }
      }
    };

    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [onSessionExpired]);

  // Main countdown timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      const storedExpiry = sessionStorage.getItem('survyx_session_expiry_ts');
      if (storedExpiry) {
        const remaining = Math.max(0, Math.floor((parseInt(storedExpiry, 10) - Date.now()) / 1000));
        setSecondsRemaining(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          sessionStorage.removeItem('survyx_session_expiry_ts');
          onSessionExpired();
        }
      } else {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            onSessionExpired();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onSessionExpired]);

  // Format mm:ss
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWarning = secondsRemaining <= warnThresholdSeconds;
  const isUrgent = secondsRemaining <= 60;

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Visual Header Pill Badge */}
      <div 
        className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all ${
          isUrgent
            ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm shadow-rose-200/50 animate-pulse'
            : isWarning
            ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm shadow-amber-200/40'
            : 'bg-slate-100/90 border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
        title={`Session Expiry: ${formattedTime} remaining. Click 'Extend' to renew token.`}
      >
        <div className="flex items-center gap-1.5">
          {isUrgent ? (
            <AlertCircle size={13} className="text-rose-600 shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
          ) : isWarning ? (
            <AlertTriangle size={13} className="text-amber-600 shrink-0" />
          ) : (
            <Clock size={13} className="text-slate-400 shrink-0" />
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono uppercase tracking-wider font-semibold text-slate-400">
                Session:
              </span>
              <span className={`font-mono text-[11px] font-black tracking-tight ${
                isUrgent ? 'text-rose-700 font-bold' : isWarning ? 'text-amber-800 font-bold' : 'text-slate-800'
              }`}>
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Extend Button */}
        <button
          onClick={() => extendSession(15)}
          disabled={isRenewing}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 ${
            isUrgent
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : isWarning
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-xs'
          }`}
          title="Extend session by +15 minutes"
        >
          <RefreshCw size={9} className={isRenewing ? 'animate-spin' : ''} />
          <span>Extend</span>
        </button>
      </div>

      {/* Floating Warning Banner when expiring soon (<= 3 mins) */}
      <AnimatePresence>
        {isWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-amber-200 p-3.5 z-50 pointer-events-auto"
          >
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900">Registry Session Expiring</h4>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {formattedTime}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Your encrypted multi-signature session will time out for security compliance. Extend now to avoid losing unsubmitted RFQ drafts.
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={() => extendSession(15)}
                    className="flex-1 py-1.5 px-3 bg-survyx-navy hover:bg-survyx-blue text-white rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <RefreshCw size={11} className={isRenewing ? 'animate-spin' : ''} />
                    <span>Renew Session (+15m)</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Renewed confirmation toast */}
      <AnimatePresence>
        {showRenewSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-12 right-0 bg-emerald-900 text-emerald-100 text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-lg flex items-center gap-1.5 border border-emerald-700 z-50 pointer-events-none"
          >
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>Registry session extended by 15 mins</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
