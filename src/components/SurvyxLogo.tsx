import React from 'react';

interface SurvyxLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'color';
  showText?: boolean;
  className?: string;
  subtitle?: string;
  showMarketplaceBadge?: boolean;
  badgeText?: string;
}

export default function SurvyxLogo({
  size = 'md',
  variant = 'light',
  showText = true,
  className = '',
  subtitle,
  showMarketplaceBadge = true,
  badgeText = 'B2B MARKETPLACE & ESCROW'
}: SurvyxLogoProps) {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
    xl: 'w-16 h-16'
  }[size];

  const brandTextSize = {
    sm: 'text-base leading-none',
    md: 'text-xl leading-none',
    lg: 'text-2xl leading-none',
    xl: 'text-3xl leading-none'
  }[size];

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Precision Engineered Sovereign Vault & Interlocking B2B Escrow Nexus SVG Logo */}
      <div className={`relative ${iconDimensions} shrink-0`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xl transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-2xl"
          role="img"
          aria-label="SURVYX Sovereign B2B Marketplace & Escrow Protocol Logo"
        >
          <defs>
            {/* Outer Hexagonal Shield - Deep Royal to Electric Azure Gradient */}
            <linearGradient id="svxG_ShieldFacetTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="35%" stopColor="#2563EB" />
              <stop offset="75%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            <linearGradient id="svxG_ShieldFacetBottom" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0C4A6E" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Inner Vault Depth Gradient */}
            <linearGradient id="svxG_VaultCavity" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#080D1A" : "#050914"} />
              <stop offset="50%" stopColor={isDark ? "#0F172A" : "#0A1128"} />
              <stop offset="100%" stopColor={isDark ? "#1E293B" : "#080D1A"} />
            </linearGradient>

            {/* Radiant High-Tension 'S' Monogram Ribbon */}
            <linearGradient id="svxG_SRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="25%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* 24K Sovereign Trust Crown Gradient */}
            <linearGradient id="svxG_GoldCrown" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Inflow / Outflow Beam Gradients */}
            <linearGradient id="svxG_InflowBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* Ambient Cyan Aura Filter */}
            <filter id="svxCoreGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ========================================================= */}
          {/* LAYER 1: 12-POINT SOVEREIGN HEXAGONAL FORTRESS SHIELD */}
          {/* ========================================================= */}
          <polygon
            points="60,3 107,27 107,93 60,117 13,93 13,27"
            fill="url(#svxG_ShieldFacetTop)"
            stroke="#93C5FD"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Chamfered Edge Faceting for 3D Optical Dimension */}
          <polygon
            points="60,3 107,27 60,60 13,27"
            fill="white"
            fillOpacity="0.08"
          />
          <polygon
            points="107,27 107,93 60,60"
            fill="black"
            fillOpacity="0.18"
          />
          <polygon
            points="60,117 13,93 60,60"
            fill="url(#svxG_ShieldFacetBottom)"
            fillOpacity="0.85"
          />

          {/* Inner Inset Vault Body with Precision Bevel */}
          <polygon
            points="60,11 99,31 99,89 60,109 21,89 21,31"
            fill="url(#svxG_VaultCavity)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
          />

          {/* Precision Micro Grid Lines inside Vault (Sovereign Governance Matrix) */}
          <path
            d="M60 12 L60 108 M22 60 L98 60 M34 37 L86 83 M86 37 L34 83"
            stroke="#1E3A8A"
            strokeWidth="0.8"
            strokeOpacity="0.4"
            strokeDasharray="2 3"
          />

          {/* ========================================================= */}
          {/* LAYER 2: BILATERAL B2B ESCROW FLOW ARROWS */}
          {/* ========================================================= */}
          {/* Top-Right Inflow Arrow: Buyer Procurement & Escrow Deposit */}
          <g>
            <path
              d="M74 27 L92 27 L92 45"
              stroke="#38BDF8"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="90"
              y1="29"
              x2="72"
              y2="47"
              stroke="#38BDF8"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="72" cy="47" r="2" fill="#38BDF8" />
          </g>

          {/* Bottom-Left Outflow Arrow: Milestone Inspection & Seller Release */}
          <g>
            <path
              d="M46 93 L28 93 L28 75"
              stroke="#06B6D4"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="30"
              y1="91"
              x2="48"
              y2="73"
              stroke="#06B6D4"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="48" cy="73" r="2" fill="#06B6D4" />
          </g>

          {/* ========================================================= */}
          {/* LAYER 3: THE HIGH-TENSION ARCHITECTURAL 'S' MONOGRAM */}
          {/* ========================================================= */}
          {/* Glowing Drop Silhouette */}
          <path
            d="M84 36 C84 25 72 22 60 22 C45 22 36 30 36 42 C36 57 65 54 65 65 C65 77 55 82 45 82 C32 82 26 74 26 63"
            stroke="#0284C7"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />

          {/* Main Primary S-Curve Ribbon */}
          <path
            d="M84 36 C84 25 72 22 60 22 C45 22 36 30 36 42 C36 57 65 54 65 65 C65 77 55 82 45 82 C32 82 26 74 26 63"
            stroke="url(#svxG_SRibbon)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#svxCoreGlow)"
          />

          {/* Top High-Gloss Reflex Spine */}
          <path
            d="M82 34 C82 27 72 24 60 24 C49 24 40 29 39 38"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* ========================================================= */}
          {/* LAYER 4: CENTRAL CRYPTOGRAPHIC VAULT ESCROW CORE */}
          {/* ========================================================= */}
          <g filter="url(#svxCoreGlow)">
            {/* Outer Escrow Lock Orbit Ring */}
            <circle cx="60" cy="60" r="9" fill="#050914" stroke="#38BDF8" strokeWidth="2.2" />
            <circle cx="60" cy="60" r="4.5" fill="#38BDF8" />
            {/* Center Photon Sparkle */}
            <circle cx="58.5" cy="58.5" r="1.5" fill="#FFFFFF" />
          </g>

          {/* ========================================================= */}
          {/* LAYER 5: 24K SOVEREIGN TRUST GOLD CROWN APEX */}
          {/* ========================================================= */}
          <g>
            {/* Apex Diamond Facet */}
            <polygon
              points="60,7 65,15 60,13 55,15"
              fill="url(#svxG_GoldCrown)"
              stroke="#FFFBEB"
              strokeWidth="0.8"
            />
            {/* Center Gold Sovereign Trust Pip */}
            <circle cx="60" cy="14" r="3.2" fill="url(#svxG_GoldCrown)" stroke="#FFFBEB" strokeWidth="1" />
            <circle cx="59.2" cy="13.2" r="0.9" fill="#FFFFFF" />
          </g>

          {/* Biometric Verification Anchor Vertices */}
          <circle cx="21" cy="46" r="2.2" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="0.8" />
          <circle cx="99" cy="74" r="2.2" fill="#38BDF8" stroke="#1E3A8A" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Primary Brand Typography & Tagline Lockup */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <div className="flex items-baseline tracking-tight">
              <span
                className={`font-black uppercase ${brandTextSize} ${
                  isDark ? 'text-slate-900' : 'text-white'
                }`}
                style={{ letterSpacing: '-0.03em' }}
              >
                SURVYX
              </span>
              <span 
                className={`font-black ${brandTextSize} bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 bg-clip-text text-transparent`}
                style={{ letterSpacing: '-0.02em' }}
              >
                .com
              </span>
            </div>

            {showMarketplaceBadge && (
              <span className={`text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border transition-all ${
                isDark 
                  ? 'bg-blue-50 text-survyx-blue border-blue-200 shadow-2xs font-mono' 
                  : 'bg-blue-500/20 text-blue-300 border-blue-400/30 shadow-2xs font-mono'
              }`}>
                {badgeText}
              </span>
            )}
          </div>

          <span
            className={`text-[8.5px] font-extrabold uppercase tracking-[0.18em] transition-colors mt-0.5 ${
              isDark ? 'text-slate-500' : 'text-blue-200/90'
            }`}
          >
            {subtitle || 'Zero-Default B2B Marketplace & Escrow Protocol'}
          </span>
        </div>
      )}
    </div>
  );
}
