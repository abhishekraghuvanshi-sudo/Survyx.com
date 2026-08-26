import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserJourneyState,
  View,
  VerificationProfile,
  VerificationDocuments,
  VerificationStatus,
  EscrowMilestone,
  EscrowDispute,
  EscrowTransaction,
  RFQItem,
  ChatMessage,
  AppNotification,
  NotificationCategory
} from '../types';
import {
  UserAccount,
  getStoredAccounts,
  saveOrUpdateAccount,
  getActiveSession,
  setActiveSession,
  getRememberedCredentials,
  setRememberedCredentials,
  DEFAULT_ACCOUNTS
} from '../lib/authStorage';

const STORAGE_KEY = 'survyx_user_journey_state_v1';

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    category: 'Escrow Updates',
    title: 'Milestone 2 In-Transit Inspection Triggered',
    description: 'Logistics GPS milestone (40% - ₹5,60,000) for Solar Inverters is ready for tripartite sign-off upon e-Way bill carrier gate-in.',
    timestamp: '10 mins ago',
    read: false,
    priority: 'high',
    referenceId: 'M-02',
    amount: '₹5,60,000',
    targetView: 'vault',
    actionLabel: 'Inspect Milestone 2',
    officerNote: 'Officer Arya Sharma has pre-audited carrier consignment #TR-8819. One signature needed.'
  },
  {
    id: 'notif-2',
    category: 'Marketplace Offers',
    title: 'New Institutional Bid on RFQ-8822',
    description: 'Tata Steel B2B Supply submitted a verified bid of ₹27,80,000 for 10 Tons Aluminum Ingots (99.7% Pure) with 5-day delivery.',
    timestamp: '25 mins ago',
    read: false,
    priority: 'urgent',
    referenceId: 'RFQ-8822',
    amount: '₹27,80,000',
    entityName: 'Tata Steel B2B Supply Ltd',
    targetView: 'bids',
    actionLabel: 'Review Supplier Bid',
    officerNote: 'Supplier holds 980/1000 Trust Score and has executed 42 multi-signature escrow settlements.'
  },
  {
    id: 'notif-3',
    category: 'Registry Alerts',
    title: 'Trust Score Elevated to Gold Tier (742/1000)',
    description: 'Your Sovereign EUID verification level unlocked reduced 0.50% escrow fee structure and instant RFQ matchmaking.',
    timestamp: '1 hour ago',
    read: false,
    priority: 'high',
    referenceId: 'EUID-GOLD',
    targetView: 'verification',
    actionLabel: 'View EUID Badge',
    officerNote: 'Upload Certificate of Incorporation (COI) to unlock Platinum Sovereign Tier.'
  },
  {
    id: 'notif-4',
    category: 'Escrow Updates',
    title: 'Tripartite Escrow Balance Secured (₹14,00,000)',
    description: 'Deposit confirmed by Escrow Trustee Bank. Milestone 1 (30%) was released to staging yard.',
    timestamp: '3 hours ago',
    read: true,
    priority: 'normal',
    referenceId: 'TXN-8812',
    amount: '₹14,00,000',
    targetView: 'vault',
    actionLabel: 'Open Vault Ledger'
  },
  {
    id: 'notif-5',
    category: 'Marketplace Offers',
    title: 'Enterprise RFQ Invitation: Larsen & Toubro',
    description: 'Larsen & Toubro Heavy Infrastructure invited your enterprise to submit quotation for 5,000 Heavy Solar Capacitors.',
    timestamp: '5 hours ago',
    read: true,
    priority: 'high',
    referenceId: 'RFQ-7731',
    amount: '₹42,00,000',
    entityName: 'Larsen & Toubro Ltd',
    targetView: 'bids',
    actionLabel: 'Submit Quote'
  },
  {
    id: 'notif-6',
    category: 'Registry Alerts',
    title: 'GSTN Compliance Verification Cleared',
    description: 'Automated GSTIN reconciliation passed with 100% active filing status and verified principal office.',
    timestamp: 'Yesterday',
    read: true,
    priority: 'normal',
    referenceId: 'GST-27AABCU9603R1ZM',
    targetView: 'repository',
    actionLabel: 'View Tax Certificate'
  }
];

const initialProfile: VerificationProfile = {
  businessName: 'KUMAR INDUSTRIAL SOLUTIONS PVT LTD',
  entityStructure: 'Private Limited Company',
  officeAddress: 'Plot 42, MIDC Industrial Area, Phase II, Turbhe, Navi Mumbai - 400705',
  gstin: '27AABCU9603R1ZM',
  pan: 'AABCU9603R',
  authorizedSignatory: 'Abhishek Raghuvanshi',
  contactEmail: 'abhishek.raghuvanshi@survyx.com',
  phone: '+91 98200 12345',
  industryCategory: 'Renewable Energy Infrastructure'
};

const initialDocuments: VerificationDocuments = {
  gst: {
    uploaded: true,
    fileName: 'GST_REG_27AABCU9603R1ZM.pdf',
    fileSize: '1.4 MB',
    uploadedAt: '12 May 2024',
    status: 'verified',
    documentNumber: '27AABCU9603R1ZM'
  },
  pan: {
    uploaded: false,
    fileName: undefined,
    fileSize: undefined,
    uploadedAt: undefined,
    status: 'pending',
    documentNumber: ''
  },
  coi: {
    uploaded: false,
    fileName: undefined,
    fileSize: undefined,
    uploadedAt: undefined,
    status: 'pending',
    documentNumber: ''
  }
};

const initialMilestones: EscrowMilestone[] = [
  {
    id: 'M-01',
    label: 'Material Intake (30%)',
    percentage: 30,
    amount: 420000,
    formattedAmount: '₹4,20,000',
    status: 'Released',
    date: '12 May 2024',
    completed: true,
    active: false,
    signaturesRequired: 2,
    signaturesApproved: 2,
    description: 'Initial raw materials intake and quality confirmation at staging yard'
  },
  {
    id: 'M-02',
    label: 'Logistics Verification (40%)',
    percentage: 40,
    amount: 560000,
    formattedAmount: '₹5,60,000',
    status: 'In Transit Audit',
    date: 'Pending Inspection',
    completed: false,
    active: true,
    signaturesRequired: 2,
    signaturesApproved: 1,
    description: 'GPS-tracked transit handover with digital consignment note (e-Way Bill sync)'
  },
  {
    id: 'M-03',
    label: 'Final Handover & QA (30%)',
    percentage: 30,
    amount: 420000,
    formattedAmount: '₹4,20,000',
    status: 'Locked',
    date: 'Pending Delivery',
    completed: false,
    active: false,
    signaturesRequired: 2,
    signaturesApproved: 0,
    description: 'Institutional site inspection, warranty certificate issuance, and final release'
  }
];

const initialTransactions: EscrowTransaction[] = [
  {
    id: 'TXN-8812',
    type: 'Deposit',
    amount: '+ ₹14,00,000',
    date: '10 May 2024',
    title: 'Escrow Lock for RFQ-8822 (Solar Inverters)',
    status: 'Completed',
    referenceId: 'UTR-HDFC-99821731'
  },
  {
    id: 'TXN-8829',
    type: 'Release',
    amount: '- ₹4,20,000',
    date: '12 May 2024',
    title: 'Milestone 1 Release: Material Intake (30%)',
    status: 'Completed',
    referenceId: 'SURVYX-REL-1049'
  }
];

const initialRFQs: RFQItem[] = [
  {
    id: 'RFQ-8822',
    title: 'Bulk Aluminum Ingots 99.7% Pure',
    category: 'Heavy Manufacturing',
    budget: '₹28,50,000',
    quantity: '10 Tons',
    status: 'Active',
    bidsCount: 14,
    timeRemaining: '4h 12m',
    description: 'Requirement for primary foundry grade aluminum ingots with NABL certified test reports.',
    createdAt: '14 May 2024'
  },
  {
    id: 'RFQ-7731',
    title: 'Heavy Duty Solar Capacitors 450V',
    category: 'Renewable Energy Infrastructure',
    budget: '₹42,00,000',
    quantity: '5000 Units',
    status: 'Active',
    bidsCount: 28,
    timeRemaining: '1d 4h',
    description: 'Industrial grade DC capacitors suitable for 100kW grid-tied solar central inverters.',
    createdAt: '13 May 2024'
  },
  {
    id: 'RFQ-9901',
    title: 'Mild Steel Sheets (IS 2062 Grade E250)',
    category: 'Automotive & EV Supply',
    budget: '₹18,00,000',
    quantity: '100 Sheets',
    status: 'Active',
    bidsCount: 6,
    timeRemaining: '12h 30m',
    description: 'Hot rolled high tensile steel plates with mill test certificates.',
    createdAt: '14 May 2024'
  },
  {
    id: 'RFQ-4491',
    title: 'Industrial Drive Belts (Oil & Heat Resistant)',
    category: 'Heavy Manufacturing',
    budget: '₹6,80,000',
    quantity: '200 Sets',
    status: 'Active',
    bidsCount: 19,
    timeRemaining: '45m',
    description: 'Precision timing belts for high-load conveyor systems with warranty.',
    createdAt: '14 May 2024'
  }
];

const initialMessages: ChatMessage[] = [
  {
    role: 'officer',
    content: "Greetings. I am Officer Arya Sharma, your assigned Senior Registry Officer at SURVYX. I am monitoring your trade compliance, active RFQs, and Escrow Vault. How may I assist your business operations today?",
    timestamp: new Date().toISOString()
  }
];

const defaultState: UserJourneyState = {
  currentView: 'landing',
  euid: 'SVX-IND-8829-QL',
  tradeMode: 'consumer',
  user: null,

  verificationStatus: 'draft',
  verificationStep: 1,
  profile: initialProfile,
  documents: initialDocuments,
  auditInfo: {
    submittedAt: null,
    queuePosition: 42,
    estimatedCompletion: 'Today, 4:00 PM',
    assignedOfficer: 'Officer Arya Sharma',
    officerRole: 'Senior Registry Compliance Officer',
    auditNotes: [
      'GSTIN format verified against GSTN portal',
      'Pending PAN and Certificate of Incorporation scans'
    ],
    complianceScore: 78
  },

  totalSecuredVolume: 12420500,
  milestones: initialMilestones,
  dispute: {
    isActive: false
  },
  transactions: initialTransactions,

  rfqs: initialRFQs,
  notifications: initialNotifications,
  messages: initialMessages,
  unreadMessagesCount: 0,

  trustScore: 742,
  governanceTier: 'GOLD'
};

interface UserJourneyContextType {
  state: UserJourneyState;
  activeAccount: UserAccount | null;
  registeredAccounts: UserAccount[];
  
  // Navigation & Auth
  setCurrentView: (view: View) => void;
  setTradeMode: (mode: 'consumer' | 'provider') => void;
  toggleTradeMode: () => void;
  loginUser: (identifierOrEmail: string, passwordOrName?: string, customData?: Partial<UserAccount>) => { success: boolean; message?: string; account?: UserAccount };
  registerUser: (accountData: Partial<UserAccount>) => { success: boolean; message?: string; account?: UserAccount };
  switchAccount: (accountId: string) => void;
  logoutUser: () => void;

  // Vendor / Entity Verification Actions
  updateVerificationProfile: (data: Partial<VerificationProfile>) => void;
  setVerificationStep: (step: number) => void;
  uploadVerificationDoc: (category: 'gst' | 'pan' | 'coi', fileData: { name: string; size?: string; documentNumber?: string }) => void;
  removeVerificationDoc: (category: 'gst' | 'pan' | 'coi') => void;
  submitVerificationAudit: () => void;
  approveVerificationNow: () => void;
  resetVerification: () => void;

  // Escrow Vault Actions
  releaseMilestone: (milestoneId: string) => void;
  signMilestone: (milestoneId: string) => void;
  raiseDispute: (reason: string) => void;
  resolveDispute: () => void;
  depositFunds: (amount: number, label: string) => void;
  resetEscrow: () => void;

  // RFQ Actions
  punchRequirement: (req: { title: string; category: string; budget: string; description: string }) => void;

  // Notifications Actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Chat Actions
  sendMessage: (content: string) => void;
  addOfficerMessage: (content: string) => void;
  clearChat: () => void;

  // Global reset
  resetAllJourneyData: () => void;
}

const UserJourneyContext = createContext<UserJourneyContextType | undefined>(undefined);

export const UserJourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registeredAccounts, setRegisteredAccounts] = useState<UserAccount[]>(() => {
    return getStoredAccounts();
  });

  const [activeAccount, setActiveAccountState] = useState<UserAccount | null>(() => {
    return getActiveSession();
  });

  const [state, setState] = useState<UserJourneyState>(() => {
    const active = getActiveSession();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = {
          ...defaultState,
          ...parsed,
          profile: { ...defaultState.profile, ...(parsed.profile || {}) },
          documents: { ...defaultState.documents, ...(parsed.documents || {}) },
          auditInfo: { ...defaultState.auditInfo, ...(parsed.auditInfo || {}) },
          dispute: { ...defaultState.dispute, ...(parsed.dispute || {}) }
        };

        // If active session exists, ensure profile & user are synchronized with active account
        if (active) {
          merged.user = { email: active.email, name: active.name };
          merged.euid = active.euid || merged.euid;
          merged.trustScore = active.trustScore || merged.trustScore;
          merged.governanceTier = active.governanceTier || merged.governanceTier;
          merged.verificationStatus = active.verificationStatus || merged.verificationStatus;
          merged.profile = {
            ...merged.profile,
            businessName: active.businessName || merged.profile.businessName,
            gstin: active.gstin || merged.profile.gstin,
            pan: active.pan || merged.profile.pan,
            authorizedSignatory: active.name || merged.profile.authorizedSignatory,
            contactEmail: active.email || merged.profile.contactEmail,
            phone: active.phone || merged.profile.phone,
            industryCategory: active.industryCategory || merged.profile.industryCategory
          };
        }

        return merged;
      }
    } catch (e) {
      console.warn('Error reading UserJourney state from localStorage:', e);
    }

    if (active) {
      return {
        ...defaultState,
        user: { email: active.email, name: active.name },
        euid: active.euid,
        trustScore: active.trustScore,
        governanceTier: active.governanceTier,
        verificationStatus: active.verificationStatus,
        profile: {
          ...defaultState.profile,
          businessName: active.businessName,
          gstin: active.gstin,
          pan: active.pan,
          authorizedSignatory: active.name,
          contactEmail: active.email,
          phone: active.phone,
          industryCategory: active.industryCategory
        }
      };
    }

    return defaultState;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Error persisting UserJourney state to localStorage:', e);
    }
  }, [state]);

  // Refresh registered accounts whenever storage updates
  const refreshAccountsList = useCallback(() => {
    setRegisteredAccounts(getStoredAccounts());
  }, []);

  // --- Navigation & Auth Handlers ---
  const setCurrentView = useCallback((view: View) => {
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  const setTradeMode = useCallback((mode: 'consumer' | 'provider') => {
    setState(prev => ({ ...prev, tradeMode: mode }));
  }, []);

  const toggleTradeMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      tradeMode: prev.tradeMode === 'consumer' ? 'provider' : 'consumer'
    }));
  }, []);

  const loginUser = useCallback((identifierOrEmail: string, passwordOrName?: string, customData?: Partial<UserAccount>) => {
    const cleanId = (identifierOrEmail || '').trim().toLowerCase();
    const cleanDigits = cleanId.replace(/\D/g, '');
    const accounts = getStoredAccounts();
    
    // Find matching registered account
    const matchedAccount = accounts.find(a => {
      const accEmail = a.email.toLowerCase();
      const accDigits = a.phone.replace(/\D/g, '');
      return accEmail === cleanId || (cleanDigits.length >= 8 && accDigits.includes(cleanDigits)) || a.id === identifierOrEmail;
    });

    // If entity is not registered in the system
    if (!matchedAccount) {
      // If explicit custom registration was passed (e.g. from OAuth or forced admin), we can allow, otherwise reject
      if (customData?.isNewRegistration) {
        // Proceed with registration flow
      } else {
        return {
          success: false,
          error: `No registered entity found for "${identifierOrEmail}". Please register your enterprise entity first before entering.`,
          requiresRegistration: true
        };
      }
    }

    // Password validation for registered accounts
    if (matchedAccount && passwordOrName && matchedAccount.password) {
      // Check password if it's not a direct quick switch or mobile token
      if (passwordOrName !== matchedAccount.password && passwordOrName !== 'Mobile Sign In' && !passwordOrName.includes('SSO User')) {
        return {
          success: false,
          error: 'Incorrect access password for this registered entity. Please verify your credentials or reset your password.'
        };
      }
    }

    const currentAcc: UserAccount = matchedAccount || {
      id: `usr_${Date.now()}`,
      email: cleanId.includes('@') ? cleanId : `${cleanId}@survyx.com`,
      phone: customData?.phone || '+91 98200 12345',
      password: customData?.password || passwordOrName || 'password123',
      name: customData?.name || 'Enterprise Signatory',
      businessName: customData?.businessName || 'NEW INDUSTRIAL SOLUTIONS LTD',
      gstin: customData?.gstin || '27AABCU9603R1ZM',
      pan: customData?.pan || 'AABCU9603R',
      state: customData?.state || 'Maharashtra',
      industryCategory: customData?.industryCategory || 'Renewable Energy Infrastructure',
      euid: customData?.euid || `SVX-IND-${Math.floor(1000 + Math.random() * 9000)}-MH`,
      role: customData?.role || 'buyer',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      verificationStatus: customData?.verificationStatus || 'verified',
      trustScore: customData?.trustScore || 850,
      governanceTier: customData?.governanceTier || 'GOLD',
      rememberMe: customData?.rememberMe ?? true
    };

    const updatedAccount: UserAccount = {
      ...currentAcc,
      ...customData,
      lastLoginAt: new Date().toISOString()
    };

    // Save to persistent storage and active session
    saveOrUpdateAccount(updatedAccount);
    setActiveSession(updatedAccount);
    setActiveAccountState(updatedAccount);
    setRegisteredAccounts(getStoredAccounts());

    // Update global state
    setState(prev => ({
      ...prev,
      user: {
        email: updatedAccount.email,
        name: updatedAccount.name
      },
      euid: updatedAccount.euid,
      trustScore: updatedAccount.trustScore,
      governanceTier: updatedAccount.governanceTier,
      verificationStatus: updatedAccount.verificationStatus,
      profile: {
        ...prev.profile,
        businessName: updatedAccount.businessName,
        gstin: updatedAccount.gstin,
        pan: updatedAccount.pan,
        authorizedSignatory: updatedAccount.name,
        contactEmail: updatedAccount.email,
        phone: updatedAccount.phone,
        industryCategory: updatedAccount.industryCategory
      },
      currentView: 'dashboard'
    }));

    return { success: true, account: updatedAccount };
  }, []);

  const registerUser = useCallback((accountData: Partial<UserAccount>) => {
    const cleanEmail = (accountData.email || '').trim().toLowerCase();
    const accounts = getStoredAccounts();

    if (!accountData.name || !accountData.name.trim()) {
      return { success: false, message: 'Authorized Signatory Full Name is required.' };
    }
    if (!accountData.businessName || !accountData.businessName.trim()) {
      return { success: false, message: 'Legal Business Name is required.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'A valid corporate email address is required.' };
    }
    if (!accountData.password || accountData.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: `An entity is already registered with email "${cleanEmail}". Please sign in with your credentials.`,
        alreadyExists: true,
        account: existing
      };
    }

    const stateCode = (accountData.state || 'MH').substring(0, 2).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const cleanGstin = (accountData.gstin || '27AABCN1234F1Z1').toUpperCase();
    const pan = cleanGstin.length >= 12 ? cleanGstin.substring(2, 12) : (accountData.pan || 'AABCN1234F');

    const newAccount: UserAccount = {
      id: `usr_${Date.now()}_${randomNum}`,
      email: cleanEmail,
      phone: accountData.phone ? accountData.phone.trim() : '+91 98200 00000',
      password: accountData.password,
      name: accountData.name.trim(),
      businessName: accountData.businessName.trim().toUpperCase(),
      gstin: cleanGstin,
      pan: pan,
      state: accountData.state || 'Maharashtra',
      industryCategory: accountData.industryCategory || 'Renewable Energy Infrastructure',
      euid: `SVX-IND-${randomNum}-${stateCode}`,
      role: accountData.role || 'buyer',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      verificationStatus: 'under_review',
      trustScore: 800,
      governanceTier: 'SILVER',
      rememberMe: accountData.rememberMe ?? true
    };

    saveOrUpdateAccount(newAccount);
    setActiveSession(newAccount);
    setActiveAccountState(newAccount);
    setRegisteredAccounts(getStoredAccounts());

    setState(prev => ({
      ...prev,
      user: {
        email: newAccount.email,
        name: newAccount.name
      },
      euid: newAccount.euid,
      trustScore: newAccount.trustScore,
      governanceTier: newAccount.governanceTier,
      verificationStatus: newAccount.verificationStatus,
      profile: {
        ...prev.profile,
        businessName: newAccount.businessName,
        gstin: newAccount.gstin,
        pan: newAccount.pan,
        authorizedSignatory: newAccount.name,
        contactEmail: newAccount.email,
        phone: newAccount.phone,
        industryCategory: newAccount.industryCategory
      },
      currentView: 'dashboard',
      messages: [
        ...prev.messages,
        {
          role: 'priya',
          content: `Welcome to SURVYX Global Marketplace, ${newAccount.name}. Your institutional entity "${newAccount.businessName}" has been successfully recorded in the encrypted registry with Registry EUID: ${newAccount.euid}. I am your dedicated Trade & Escrow Compliance Officer.`,
          timestamp: new Date().toISOString()
        }
      ]
    }));

    return { success: true, message: 'Entity registered and authenticated successfully.', account: newAccount };
  }, []);

  const switchAccount = useCallback((accountId: string) => {
    const accounts = getStoredAccounts();
    const target = accounts.find(a => a.id === accountId || a.email.toLowerCase() === accountId.toLowerCase());
    if (target) {
      setActiveSession(target);
      setActiveAccountState(target);
      setState(prev => ({
        ...prev,
        user: { email: target.email, name: target.name },
        euid: target.euid,
        trustScore: target.trustScore,
        governanceTier: target.governanceTier,
        verificationStatus: target.verificationStatus,
        profile: {
          ...prev.profile,
          businessName: target.businessName,
          gstin: target.gstin,
          pan: target.pan,
          authorizedSignatory: target.name,
          contactEmail: target.email,
          phone: target.phone,
          industryCategory: target.industryCategory
        },
        currentView: 'dashboard'
      }));
    }
  }, []);

  const logoutUser = useCallback(() => {
    setActiveSession(null);
    setActiveAccountState(null);
    setState(prev => ({
      ...prev,
      user: null,
      currentView: 'landing'
    }));
  }, []);

  // --- Vendor / Entity Verification Handlers ---
  const updateVerificationProfile = useCallback((data: Partial<VerificationProfile>) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...data
      }
    }));
  }, []);

  const setVerificationStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, verificationStep: step }));
  }, []);

  const uploadVerificationDoc = useCallback((category: 'gst' | 'pan' | 'coi', fileData: { name: string; size?: string; documentNumber?: string }) => {
    setState(prev => {
      const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const updatedDocs: VerificationDocuments = {
        ...prev.documents,
        [category]: {
          uploaded: true,
          fileName: fileData.name,
          fileSize: fileData.size || '1.2 MB',
          uploadedAt: now,
          status: 'pending',
          documentNumber: fileData.documentNumber || (category === 'gst' ? prev.profile.gstin : category === 'pan' ? prev.profile.pan : 'U40106MH2020PTC342119')
        }
      };

      // Recalculate trust and notes
      const uploadedCount = Object.values(updatedDocs).filter(d => d.uploaded).length;
      const newScore = Math.min(950, 740 + uploadedCount * 50);

      return {
        ...prev,
        documents: updatedDocs,
        trustScore: newScore,
        auditInfo: {
          ...prev.auditInfo,
          auditNotes: [
            `Uploaded ${category.toUpperCase()} document: ${fileData.name}`,
            ...prev.auditInfo.auditNotes
          ]
        }
      };
    });
  }, []);

  const removeVerificationDoc = useCallback((category: 'gst' | 'pan' | 'coi') => {
    setState(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [category]: {
          uploaded: false,
          fileName: undefined,
          fileSize: undefined,
          uploadedAt: undefined,
          status: 'pending',
          documentNumber: ''
        }
      }
    }));
  }, []);

  const submitVerificationAudit = useCallback(() => {
    setState(prev => {
      const now = new Date().toLocaleString();
      return {
        ...prev,
        verificationStatus: 'under_review',
        trustScore: 860,
        auditInfo: {
          ...prev.auditInfo,
          submittedAt: now,
          queuePosition: 42,
          estimatedCompletion: 'Today in 4 hours'
        },
        messages: [
          ...prev.messages,
          {
            role: 'priya',
            content: `Audit Request Logged: Your compliance bundle for "${prev.profile.businessName}" has been placed into the Registry queue (#42). I am reviewing the documents against ROC and GSTN records.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
  }, []);

  const approveVerificationNow = useCallback(() => {
    setState(prev => ({
      ...prev,
      verificationStatus: 'verified',
      trustScore: 980,
      governanceTier: 'PLATINUM',
      documents: {
        gst: { ...prev.documents.gst, status: 'verified', uploaded: true, fileName: prev.documents.gst.fileName || 'GST_CERT_VERIFIED.pdf' },
        pan: { ...prev.documents.pan, status: 'verified', uploaded: true, fileName: prev.documents.pan.fileName || 'PAN_CARD_VERIFIED.pdf' },
        coi: { ...prev.documents.coi, status: 'verified', uploaded: true, fileName: prev.documents.coi.fileName || 'COI_ROC_VERIFIED.pdf' }
      },
      auditInfo: {
        ...prev.auditInfo,
        queuePosition: 0,
        estimatedCompletion: 'Verified',
        complianceScore: 98,
        auditNotes: [
          'Full KYC & Registry clearance issued by Officer Priya Krishnamurthy',
          'All statutory documents validated against MCA & GSTN APIs',
          ...prev.auditInfo.auditNotes
        ]
      },
      messages: [
        ...prev.messages,
        {
          role: 'priya',
          content: `Congratulations! Entity verification for ${prev.profile.businessName} (EUID: ${prev.euid}) has been officially APPROVED. Full institutional liquidity pools and zero-limit escrow are now unlocked.`,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  }, []);

  const resetVerification = useCallback(() => {
    setState(prev => ({
      ...prev,
      verificationStatus: 'draft',
      verificationStep: 1,
      trustScore: 742,
      governanceTier: 'GOLD',
      auditInfo: defaultState.auditInfo
    }));
  }, []);

  // --- Escrow Vault Handlers ---
  const signMilestone = useCallback((milestoneId: string) => {
    setState(prev => {
      const updatedMilestones = prev.milestones.map(m => {
        if (m.id === milestoneId) {
          const newApproved = Math.min(m.signaturesRequired, m.signaturesApproved + 1);
          return {
            ...m,
            signaturesApproved: newApproved
          };
        }
        return m;
      });

      return {
        ...prev,
        milestones: updatedMilestones
      };
    });
  }, []);

  const releaseMilestone = useCallback((milestoneId: string) => {
    setState(prev => {
      let releasedAmount = 0;
      let milestoneLabel = '';
      const updatedMilestones = prev.milestones.map(m => {
        if (m.id === milestoneId) {
          releasedAmount = m.amount;
          milestoneLabel = m.label;
          return {
            ...m,
            status: 'Released' as const,
            completed: true,
            active: false,
            signaturesApproved: m.signaturesRequired,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          };
        }
        return m;
      });

      // Activate the next milestone if available
      const nextIndex = updatedMilestones.findIndex(m => !m.completed && m.status === 'Locked');
      if (nextIndex !== -1) {
        updatedMilestones[nextIndex].status = 'In Transit Audit';
        updatedMilestones[nextIndex].active = true;
      }

      const newTxn: EscrowTransaction = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Release',
        amount: `- ₹${releasedAmount.toLocaleString('en-IN')}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        title: `Milestone Release: ${milestoneLabel}`,
        status: 'Completed',
        referenceId: `SURVYX-SETTLE-${Math.floor(100000 + Math.random() * 900000)}`
      };

      return {
        ...prev,
        milestones: updatedMilestones,
        transactions: [newTxn, ...prev.transactions],
        messages: [
          ...prev.messages,
          {
            role: 'priya',
            content: `Escrow Release Authorized: ₹${releasedAmount.toLocaleString('en-IN')} for "${milestoneLabel}" has been securely disbursed via NPCI Escrow Route. Reference: ${newTxn.referenceId}.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
  }, []);

  const raiseDispute = useCallback((reason: string) => {
    setState(prev => {
      const caseId = `DISP-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTxn: EscrowTransaction = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Dispute',
        amount: '₹5,60,000 (Hold)',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        title: `Trade Lock Triggered: Case #${caseId}`,
        status: 'In Review',
        referenceId: caseId
      };

      const updatedMilestones = prev.milestones.map(m => {
        if (m.active) {
          return {
            ...m,
            status: 'Disputed' as const
          };
        }
        return m;
      });

      return {
        ...prev,
        milestones: updatedMilestones,
        dispute: {
          isActive: true,
          caseId,
          reason,
          openedAt: new Date().toLocaleString(),
          status: 'Under Mediation',
          officerNotes: 'Registry Officer Priya Krishnamurthy is mediating between Buyer & Supplier.'
        },
        transactions: [newTxn, ...prev.transactions],
        messages: [
          ...prev.messages,
          {
            role: 'priya',
            content: `EMERGENCY TRADE LOCK: Dispute case #${caseId} registered for reason: "${reason}". Active escrow milestones are locked under Multi-Sig Mediation protocol. No funds can move until mutual sign-off.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
  }, []);

  const resolveDispute = useCallback(() => {
    setState(prev => {
      const updatedMilestones = prev.milestones.map(m => {
        if (m.status === 'Disputed') {
          return {
            ...m,
            status: 'In Transit Audit' as const,
            active: true
          };
        }
        return m;
      });

      return {
        ...prev,
        milestones: updatedMilestones,
        dispute: {
          isActive: false,
          status: 'Resolved'
        },
        messages: [
          ...prev.messages,
          {
            role: 'priya',
            content: `Dispute Case #${prev.dispute.caseId || 'DISP-8821'} has been officially RESOLVED and closed following mediation terms. Escrow operational state restored.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
  }, []);

  const depositFunds = useCallback((amount: number, label: string) => {
    setState(prev => {
      const newTxn: EscrowTransaction = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Deposit',
        amount: `+ ₹${amount.toLocaleString('en-IN')}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        title: `Escrow Deposit: ${label}`,
        status: 'Completed',
        referenceId: `UTR-INWARD-${Math.floor(10000000 + Math.random() * 90000000)}`
      };

      return {
        ...prev,
        totalSecuredVolume: prev.totalSecuredVolume + amount,
        transactions: [newTxn, ...prev.transactions],
        messages: [
          ...prev.messages,
          {
            role: 'priya',
            content: `Escrow Inward Received: ₹${amount.toLocaleString('en-IN')} locked for "${label}". Funds allocated into 3-tier milestone structure.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
  }, []);

  const resetEscrow = useCallback(() => {
    setState(prev => ({
      ...prev,
      totalSecuredVolume: 12420500,
      milestones: initialMilestones,
      dispute: { isActive: false },
      transactions: initialTransactions
    }));
  }, []);

  // --- RFQ Handlers ---
  const punchRequirement = useCallback((req: { title: string; category: string; budget: string; description: string }) => {
    setState(prev => {
      const newRFQ: RFQItem = {
        id: `RFQ-${Math.floor(1000 + Math.random() * 9000)}`,
        title: req.title,
        category: req.category,
        budget: req.budget || '₹15,00,000 - ₹30,00,000',
        quantity: 'As Specified in BOM',
        status: 'Active',
        bidsCount: 0,
        timeRemaining: '2d 00h',
        description: req.description,
        createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      return {
        ...prev,
        rfqs: [newRFQ, ...prev.rfqs],
        messages: [
          ...prev.messages,
          {
            role: 'priya',
            content: `Requirement Punch Acknowledged: Generated institutional RFQ ${newRFQ.id} for "${req.title}". Matchmaking active across verified ecosystem partners.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
  }, []);

  // --- Notification Handlers ---
  const markNotificationAsRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: (prev.notifications || initialNotifications).map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: (prev.notifications || initialNotifications).map(n => ({ ...n, read: true }))
    }));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: (prev.notifications || initialNotifications).filter(n => n.id !== id)
    }));
  }, []);

  const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...(prev.notifications || initialNotifications)]
    }));
  }, []);

  // --- Chat Handlers ---
  const sendMessage = useCallback((content: string) => {
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          role: 'user',
          content,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  }, []);

  const addOfficerMessage = useCallback((content: string) => {
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          role: 'priya',
          content,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  }, []);

  const clearChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: initialMessages
    }));
  }, []);

  const resetAllJourneyData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }, []);

  const contextValue = useMemo(() => ({
    state,
    activeAccount,
    registeredAccounts,
    setCurrentView,
    setTradeMode,
    toggleTradeMode,
    loginUser,
    registerUser,
    switchAccount,
    logoutUser,
    updateVerificationProfile,
    setVerificationStep,
    uploadVerificationDoc,
    removeVerificationDoc,
    submitVerificationAudit,
    approveVerificationNow,
    resetVerification,
    releaseMilestone,
    signMilestone,
    raiseDispute,
    resolveDispute,
    depositFunds,
    resetEscrow,
    punchRequirement,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    addNotification,
    sendMessage,
    addOfficerMessage,
    clearChat,
    resetAllJourneyData
  }), [
    state,
    activeAccount,
    registeredAccounts,
    setCurrentView,
    setTradeMode,
    toggleTradeMode,
    loginUser,
    registerUser,
    switchAccount,
    logoutUser,
    updateVerificationProfile,
    setVerificationStep,
    uploadVerificationDoc,
    removeVerificationDoc,
    submitVerificationAudit,
    approveVerificationNow,
    resetVerification,
    releaseMilestone,
    signMilestone,
    raiseDispute,
    resolveDispute,
    depositFunds,
    resetEscrow,
    punchRequirement,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    addNotification,
    sendMessage,
    addOfficerMessage,
    clearChat,
    resetAllJourneyData
  ]);

  return (
    <UserJourneyContext.Provider value={contextValue}>
      {children}
    </UserJourneyContext.Provider>
  );
};

export const useUserJourney = () => {
  const context = useContext(UserJourneyContext);
  if (!context) {
    throw new Error('useUserJourney must be used within a UserJourneyProvider');
  }
  return context;
};
