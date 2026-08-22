export type View = 'landing' | 'auth' | 'dashboard' | 'bids' | 'vault' | 'verification' | 'chat' | 'repository';

export type VerificationStatus = 'unstarted' | 'draft' | 'under_review' | 'verified' | 'rejected';

export interface VerificationProfile {
  businessName: string;
  entityStructure: string;
  officeAddress: string;
  gstin: string;
  pan: string;
  authorizedSignatory: string;
  contactEmail: string;
  phone: string;
  industryCategory: string;
}

export interface VerificationDoc {
  uploaded: boolean;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  status: 'pending' | 'verified' | 'rejected';
  documentNumber?: string;
}

export interface VerificationDocuments {
  gst: VerificationDoc;
  pan: VerificationDoc;
  coi: VerificationDoc;
}

export interface VerificationAuditInfo {
  submittedAt: string | null;
  queuePosition: number;
  estimatedCompletion: string;
  assignedOfficer: string;
  officerRole: string;
  auditNotes: string[];
  complianceScore: number;
}

export interface EscrowMilestone {
  id: string;
  label: string;
  percentage: number;
  amount: number;
  formattedAmount: string;
  status: 'Released' | 'In Transit Audit' | 'Locked' | 'Disputed';
  date: string;
  completed: boolean;
  active: boolean;
  signaturesRequired: number;
  signaturesApproved: number;
  description?: string;
}

export interface EscrowDispute {
  isActive: boolean;
  caseId?: string;
  reason?: string;
  openedAt?: string;
  status?: 'Open' | 'Under Mediation' | 'Resolved';
  officerNotes?: string;
}

export interface EscrowTransaction {
  id: string;
  type: 'Deposit' | 'Release' | 'Hold' | 'Dispute' | 'Settlement';
  amount: string;
  date: string;
  title: string;
  status: 'Completed' | 'Pending' | 'In Review' | 'Flagged';
  referenceId: string;
}

export interface RFQItem {
  id: string;
  title: string;
  category: string;
  budget: string;
  quantity: string;
  status: 'Active' | 'Under Review' | 'Closed';
  bidsCount: number;
  timeRemaining: string;
  description: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'priya';
  content: string;
  timestamp: string;
}

export interface UserJourneyState {
  // Navigation & User
  currentView: View;
  euid: string;
  tradeMode: 'consumer' | 'provider';
  user: { email: string; name: string } | null;

  // Vendor / Entity Verification Flow
  verificationStatus: VerificationStatus;
  verificationStep: number;
  profile: VerificationProfile;
  documents: VerificationDocuments;
  auditInfo: VerificationAuditInfo;

  // Escrow Vault Flow
  totalSecuredVolume: number;
  milestones: EscrowMilestone[];
  dispute: EscrowDispute;
  transactions: EscrowTransaction[];

  // RFQs & Bidding Flow
  rfqs: RFQItem[];

  // Chat Flow
  messages: ChatMessage[];
  unreadMessagesCount: number;

  // Trust & Health
  trustScore: number;
  governanceTier: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
}
