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
  isNewRegistration?: boolean;
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

/**
 * Find account by email or phone
 */
export function findAccountByIdentifier(identifier: string): UserAccount | undefined {
  if (!identifier) return undefined;
  const accounts = getStoredAccounts();
  const clean = identifier.trim().toLowerCase();
  const digitsOnly = clean.replace(/\D/g, '');

  return accounts.find(a => {
    const accEmail = a.email.toLowerCase();
    const accDigits = a.phone.replace(/\D/g, '');
    return accEmail === clean || (digitsOnly.length >= 8 && accDigits.includes(digitsOnly));
  });
}

/**
 * Strict authentication check
 */
export function authenticateCredentials(identifier: string, password?: string): {
  success: boolean;
  account?: UserAccount;
  error?: string;
  requiresRegistration?: boolean;
} {
  if (!identifier || !identifier.trim()) {
    return { success: false, error: 'Please enter your corporate email or registered mobile number.' };
  }

  const account = findAccountByIdentifier(identifier);
  if (!account) {
    return {
      success: false,
      error: `No registered entity found for "${identifier}". Please register your enterprise entity first.`,
      requiresRegistration: true
    };
  }

  if (password) {
    // If account has a password, check it
    if (account.password && account.password !== password) {
      return {
        success: false,
        error: 'Incorrect access password for this entity account. Please verify credentials or reset password.'
      };
    }
  }

  // Update last login
  const updated = saveOrUpdateAccount({
    ...account,
    lastLoginAt: new Date().toISOString()
  });

  setActiveSession(updated);

  return {
    success: true,
    account: updated
  };
}

/**
 * Register and save a new entity account
 */
export function registerNewEntity(data: {
  name: string;
  businessName: string;
  gstin?: string;
  pan?: string;
  state?: string;
  industryCategory?: string;
  email: string;
  phone?: string;
  password?: string;
  role?: 'buyer' | 'supplier';
}): { success: boolean; account?: UserAccount; error?: string } {
  if (!data.name || !data.name.trim()) {
    return { success: false, error: 'Authorized Signatory Full Name is required.' };
  }
  if (!data.businessName || !data.businessName.trim()) {
    return { success: false, error: 'Legal Business Name is required.' };
  }
  if (!data.email || !data.email.includes('@')) {
    return { success: false, error: 'A valid corporate email address is required.' };
  }
  if (!data.password || data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const cleanEmail = data.email.trim().toLowerCase();
  const existing = findAccountByIdentifier(cleanEmail);
  if (existing) {
    return {
      success: false,
      error: `An entity is already registered with ${cleanEmail}. Please sign in with your credentials.`
    };
  }

  const stateCode = (data.state || 'MH').substring(0, 2).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const cleanGstin = (data.gstin || '27AABCU9603R1ZM').toUpperCase();
  const pan = cleanGstin.length >= 12 ? cleanGstin.substring(2, 12) : (data.pan || 'AABCU9603R');

  const newAccount: UserAccount = {
    id: `usr_${Date.now()}_${randomNum}`,
    email: cleanEmail,
    phone: data.phone ? data.phone.trim() : '+91 98200 00000',
    password: data.password,
    name: data.name.trim(),
    businessName: data.businessName.trim().toUpperCase(),
    gstin: cleanGstin,
    pan: pan,
    state: data.state || 'Maharashtra',
    industryCategory: data.industryCategory || 'Renewable Energy Infrastructure',
    euid: `SVX-IND-${randomNum}-${stateCode}`,
    role: data.role || 'buyer',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    verificationStatus: 'under_review',
    trustScore: 800,
    governanceTier: 'SILVER',
    rememberMe: true
  };

  saveOrUpdateAccount(newAccount);
  setActiveSession(newAccount);

  return {
    success: true,
    account: newAccount
  };
}
