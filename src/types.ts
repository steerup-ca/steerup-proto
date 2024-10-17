import { Timestamp } from 'firebase/firestore';

// Existing types...

export interface InvestmentHistoryItem {
  companyName: string;
  amount: number;
}

export interface LeadInvestor {
  id: string;
  name: string;
  photo: string;
  title: string;
  bio: string;
  credentials: string[];
  areasOfExpertise: string[];
  company: string;
  investmentHistory: InvestmentHistoryItem[];
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface FundingRound {
  round: string;
  amount: string;
  date: string;
}

export interface Startup {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  foundedYear: string;
  location: string;
  team: TeamMember[];
  metrics: Metric[];
  fundingHistory: FundingRound[];
  industry: string;
  fundingStage: string;
  fundingAmount: number;
  teamSize: number;
  website: string;
}

export interface StartupsSelection {
  id: string;
  title: string;
  description?: string;
  selectionLead: string;
  campaigns: string[];
  goal: number;
  currentAmount: number;
  daysLeft: number;
  backersCount: number;
  additionalFunding: {
    name: string;
    description: string;
    amount: number;
  }[];
}

export interface Campaign {
  id: string;
  startupId: string;
  leadInvestorId: string;
  creation_date: Timestamp;
  steerup_amount: number;
  offeringDetails: {
    minAmount: number;
    maxAmount: number;
    equity: number;
    valuation: number;
    offeringDocument: string;
  }
}

// Updated and new types...

export enum KYCStatus {
  Verified = 'Verified',
  Pending = 'Pending',
  NotVerified = 'Not Verified'
}

export enum AccreditationStatus {
  NotAccredited = 'Not Accredited',
  Accredited = 'Accredited',
  Pending = 'Pending'
}

export interface Address {
  street: string;
  city: string;
  provinceState: string;
  postalCodeZip: string;
  country: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
}

export interface User {
  id: string;
  userId: string; // Steerup User ID (e.g., STRUP-123456789)
  email: string;
  name: string;
  address: Address;
  kycStatus: KYCStatus;
  memberSince: Timestamp;
  accreditationStatus: AccreditationStatus;
  yearlyInvestmentLimit: number;
  investedThisYear: number;
  totalInvestments: number;
  bankAccounts: BankAccount[];
  primaryBankAccountId: string | null;
}

export interface Investment {
  id: string;
  userId: string;
  selectionId: string;
  date: Timestamp;
  amount: number;
  status: 'processing' | 'completed' | 'failed';
}

export interface TaxReport {
  id: string;
  userId: string;
  year: number;
  fileUrl: string;
  generatedDate: Timestamp;
}

export interface InvestmentSummary {
  id: string;
  userId: string;
  year: number | 'all-time';
  totalAmount: number;
  numberOfInvestments: number;
  generatedDate: Timestamp;
}

export {};
