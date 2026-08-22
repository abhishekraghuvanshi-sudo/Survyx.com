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
  ChatMessage
} from '../types';

const STORAGE_KEY = 'survyx_user_journey_state_v1';

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
    role: 'priya',
    content: "Greetings Abhishek. I am Priya Krishnamurthy, your assigned Senior Registry Officer at SURVYX. I am monitoring your trade compliance and Escrow Vault. How may I assist your business operations today?",
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
    assignedOfficer: 'Priya Krishnamurthy',
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
  messages: initialMessages,
  unreadMessagesCount: 0,

  trustScore: 742,
  governanceTier: 'GOLD'
};

interface UserJourneyContextType {
  state: UserJourneyState;
  
  // Navigation & Auth
  setCurrentView: (view: View) => void;
  setTradeMode: (mode: 'consumer' | 'provider') => void;
  toggleTradeMode: () => void;
  loginUser: (email: string, name?: string) => void;
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

  // Chat Actions
  sendMessage: (content: string) => void;
  addOfficerMessage: (content: string) => void;
  clearChat: () => void;

  // Global reset
  resetAllJourneyData: () => void;
}

const UserJourneyContext = createContext<UserJourneyContextType | undefined>(undefined);

export const UserJourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserJourneyState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          profile: { ...defaultState.profile, ...(parsed.profile || {}) },
          documents: { ...defaultState.documents, ...(parsed.documents || {}) },
          auditInfo: { ...defaultState.auditInfo, ...(parsed.auditInfo || {}) },
          dispute: { ...defaultState.dispute, ...(parsed.dispute || {}) }
        };
      }
    } catch (e) {
      console.warn('Error reading UserJourney state from localStorage:', e);
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

  const loginUser = useCallback((email: string, name?: string) => {
    setState(prev => ({
      ...prev,
      user: {
        email,
        name: name || email.split('@')[0] || 'Abhishek'
      },
      currentView: 'dashboard'
    }));
  }, []);

  const logoutUser = useCallback(() => {
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
    setCurrentView,
    setTradeMode,
    toggleTradeMode,
    loginUser,
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
    sendMessage,
    addOfficerMessage,
    clearChat,
    resetAllJourneyData
  }), [
    state,
    setCurrentView,
    setTradeMode,
    toggleTradeMode,
    loginUser,
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
