import { VerificationProfile, VerificationStatus } from '../types';

export interface UserAccount {
  id: string;
  email: string;
  phone: string;
  password?: string;
  name: string;
  businessName: string;
  gstin: string;
  pan: string;
  state: string;
  industryCategory: string;
  euid: string;
  role: 'buyer' | 'supplier' | 'admin';
  createdAt: string;
  lastLoginAt: string;
  verificationStatus: VerificationStatus;
  trustScore: number;
  governanceTier: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
  rememberMe?: boolean;
}

const ACCOUNTS_STORAGE_KEY = 'survyx_registered_accounts_v2';
const SESSION_STORAGE_KEY = 'survyx_active_session_v2';
const REMEMBERED_CREDENTIALS_KEY = 'survyx_remembered_credentials_v2';

export const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr_abhishek_01',
    email: 'abhishek.raghuvanshi@survyx.com',
    phone: '+91 98200 12345',
    password: 'password123',
    name: 'Abhishek Raghuvanshi',
    businessName: 'KUMAR INDUSTRIAL SOLUTIONS PVT LTD',
    gstin: '27AABCU9603R1ZM',
    pan: 'AABCU9603R',
    state: 'Maharashtra',
    industryCategory: 'Renewable Energy Infrastructure',
    euid: 'SVX-IND-8829-QL',
    role: 'buyer',
    createdAt: '2024-01-15T10:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
    verificationStatus: 'verified',
    trustScore: 940,
    governanceTier: 'PLATINUM',
    rememberMe: true
  },
  {
    id: 'usr_rajesh_02',
    email: 'rajesh.sharma@solargrid.in',
    phone: '+91 98111 54321',
    password: 'password123',
    name: 'Rajesh Sharma',
    businessName: 'SOLARGRID HIGH-TECH COMPONENTS LTD',
    gstin: '07AAECS1234F1Z5',
    pan: 'AAECS1234F',
    state: 'Delhi NCR',
    industryCategory: 'Renewable Energy Infrastructure',
    euid: 'SVX-IND-4421-SG',
    role: 'supplier',
    createdAt: '2024-02-10T14:30:00.000Z',
    lastLoginAt: '2024-05-10T09:15:00.000Z',
    verificationStatus: 'verified',
    trustScore: 880,
    governanceTier: 'GOLD',
    rememberMe: false
  },
  {
    id: 'usr_pooja_03',
    email: 'pooja.verma@apexauto.co.in',
    phone: '+91 98765 43210',
    password: 'password123',
    name: 'Pooja Verma',
    businessName: 'APEX AUTOMOTIVE PRECISION SYSTEMS',
    gstin: '24AABCA5678K1ZG',
    pan: 'AABCA5678K',
    state: 'Gujarat',
    industryCategory: 'Automotive & EV Supply',
    euid: 'SVX-IND-9912-AP',
    role: 'buyer',
    createdAt: '2024-03-01T11:20:00.000Z',
    lastLoginAt: '2024-05-12T16:40:00.000Z',
    verificationStatus: 'under_review',
    trustScore: 790,
    governanceTier: 'SILVER',
    rememberMe: false
  }
];

/**
 * Get all registered accounts from local storage, initialized with defaults
 */
export function getStoredAccounts(): UserAccount[] {
  try {
    const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored accounts:', e);
  }
  // Initialize with defaults if empty
  saveStoredAccounts(DEFAULT_ACCOUNTS);
  return DEFAULT_ACCOUNTS;
}

/**
 * Save accounts array to local storage
 */
export function saveStoredAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Error saving accounts:', e);
  }
}

/**
 * Add or update an account in local storage
 */
export function saveOrUpdateAccount(account: UserAccount): UserAccount {
  const accounts = getStoredAccounts();
  const index = accounts.findIndex(a => a.id === account.id || a.email.toLowerCase() === account.email.toLowerCase());
  
  if (index >= 0) {
    accounts[index] = { ...accounts[index], ...account, lastLoginAt: new Date().toISOString() };
  } else {
    accounts.unshift({ ...account, lastLoginAt: new Date().toISOString() });
  }

  saveStoredAccounts(accounts);
  return account;
}

/**
 * Get active session
 */
export function getActiveSession(): UserAccount | null {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Error reading active session:', e);
  }
  return null;
}

/**
 * Set active session
 */
export function setActiveSession(account: UserAccount | null): void {
  try {
    if (account) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(account));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Error setting active session:', e);
  }
}

/**
 * Remembered credentials
 */
export function getRememberedCredentials(): { email?: string; password?: string; remember: boolean } | null {
  try {
    const data = localStorage.getItem(REMEMBERED_CREDENTIALS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Error reading remembered credentials:', e);
  }
  return null;
}

export function setRememberedCredentials(creds: { email?: string; password?: string; remember: boolean } | null): void {
  try {
    if (creds && creds.remember) {
      localStorage.setItem(REMEMBERED_CREDENTIALS_KEY, JSON.stringify(creds));
    } else {
      localStorage.removeItem(REMEMBERED_CREDENTIALS_KEY);
    }
  } catch (e) {
    console.warn('Error saving remembered credentials:', e);
  }
}
