import React from 'react';

interface SurvyxLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'color';
  showText?: boolean;
  className?: string;
  subtitle?: string;
  showMarketplaceBadge?: boolean;
}

export default function SurvyxLogo({
  size = 'md',
  variant = 'light',
  showText = true,
  className = '',
  subtitle,
  showMarketplaceBadge = true
}: SurvyxLogoProps) {
  const iconSize = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
    xl: 'w-16 h-16'
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }[size];

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geometric Marketplace & Escrow Shield SVG Logo */}
      <div className={`relative ${iconSize} shrink-0`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Primary Saphire & Cobalt Gradient */}
            <linearGradient id="svxGradShield" x1="15%" y1="5%" x2="85%" y2="95%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="35%" stopColor="#2563EB" />
              <stop offset="75%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Glowing Trade Nexus Line */}
            <linearGradient id="svxGradTradeLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Gold Assurance Pip Gradient */}
            <linearGradient id="svxGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Dark Shield Interior Gradient */}
            <linearGradient id="svxGradInner" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#0F172A" : "#0A0F1D"} />
              <stop offset="100%" stopColor={isDark ? "#1E293B" : "#0F172A"} />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="svxGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Shield Hexagon with Chamfered Precision Geometry */}
          <polygon
            points="60,6 108,32 108,88 60,114 12,88 12,32"
            fill="url(#svxGradShield)"
            stroke="#60A5FA"
            strokeWidth="1.5"
          />

          {/* Inner Shield Cavity */}
          <polygon
            points="60,14 100,36 100,84 60,106 20,84 20,36"
            fill="url(#svxGradInner)"
          />

          {/* Bilateral Trade Arrows & Escrow S-Monogram Nexus */}
          {/* Top-Right Market Offer Inflow Arrow */}
          <path
            d="M74 34 L88 34 L88 48"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M86 36 L68 54"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />

          {/* Bottom-Left Settlement Outflow Arrow */}
          <path
            d="M46 86 L32 86 L32 72"
            stroke="#06B6D4"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M34 84 L52 66"
            stroke="#06B6D4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />

          {/* Bold Central S-Curve Connecting Buyer, Escrow Vault & Seller */}
          <path
            d="M80 40 C80 30 68 26 60 26 C46 26 40 34 40 44 C40 58 64 56 64 64 C64 74 54 78 46 78 C36 78 30 72 30 62"
            stroke="url(#svxGradTradeLine)"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center Escrow Cryptographic Vault Nexus Core */}
          <circle cx="60" cy="60" r="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
          <circle cx="60" cy="60" r="3" fill="#38BDF8" />

          {/* Top Gold Verification Badge Node */}
          <circle cx="60" cy="18" r="3.5" fill="url(#svxGradGold)" />
          {/* Left & Right Trade Nodes */}
          <circle cx="28" cy="46" r="2.5" fill="#60A5FA" />
          <circle cx="92" cy="74" r="2.5" fill="#38BDF8" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="flex items-baseline">
              <span
                className={`font-black tracking-tight uppercase ${textSize} ${
                  isDark ? 'text-slate-900' : 'text-white'
                }`}
              >
                SURVYX
              </span>
              <span className={`font-black text-survyx-blue ${textSize}`}>.com</span>
            </div>

            {showMarketplaceBadge && (
              <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
                isDark 
                  ? 'bg-blue-50 text-survyx-blue border-blue-200' 
                  : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
              }`}>
                B2B MARKETPLACE
              </span>
            )}
          </div>

          <span
            className={`text-[8px] font-extrabold uppercase tracking-[0.18em] ${
              isDark ? 'text-slate-500' : 'text-blue-200/80'
            }`}
          >
            {subtitle || 'Verified B2B Trade & Escrow Protocol'}
          </span>
        </div>
      )}
    </div>
  );
}
