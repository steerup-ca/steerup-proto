import { Timestamp } from 'firebase/firestore';

// Investment Stage Types
export enum InvestmentStage {
  PLEDGE = 'PLEDGE',
  CUSTODIAN = 'CUSTODIAN',
  CAMPAIGN_SUCCESS = 'CAMPAIGN_SUCCESS',
  CAMPAIGN_FAILURE = 'CAMPAIGN_FAILURE',
  FUNDS_INVESTED = 'FUNDS_INVESTED',
  REFUND = 'REFUND',
  PERFORMANCE_TRACKING = 'PERFORMANCE_TRACKING',
  EXIT = 'EXIT'
}

export interface FundsTransferProgress {
  totalAmount: number;
  transferredAmount: number;
  lastTransferDate: Timestamp;
  transferHistory: {
    amount: number;
    date: Timestamp;
    description: string;
  }[];
}

export interface InvestmentStageDetail {
  stage: InvestmentStage;
  status: 'pending' | 'active' | 'completed' | 'failed';
  timestamp?: Timestamp;
  message: string;
  details?: string;
  fundsProgress?: FundsTransferProgress;
}

export interface InvestmentTracking {
  currentStage: InvestmentStage;
  stages: InvestmentStageDetail[];
  lastUpdated: Timestamp;
}

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

// Additional funding interface that maintains backward compatibility
export interface AdditionalFunding {
  name: string;
  description: string;
  amount: number;
  iconUrl?: string;
  type?: 'organization' | 'individual';
  id?: string;
  credentials?: string[];
  website?: string;
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
  additionalFunding: AdditionalFunding[];
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

export interface PortfolioInvestment {
  id: string;
  userId: string;
  selectionId: string;
  startupId: string;
  investmentDate: Timestamp;
  amount: number;
  type: 'equity' | 'debt';
  terms: {
    equity?: {
      percentageOwned: number;
      shareClass: string;
    };
    debt?: {
      interestRate: number;
      maturityDate: Timestamp;
      paymentSchedule: 'monthly' | 'quarterly' | 'annually';
    };
  };
  status: 'active' | 'exited' | 'defaulted';
  performance: {
    currentValue: number;
    roi: number;
    lastValuationDate: Timestamp;
  };
  tracking: InvestmentTracking;
}

export interface PortfolioSummary {
  totalInvested: number;
  totalValue: number;
  totalRoi: number;
  investmentCount: number;
  equityInvestments: number;
  debtInvestments: number;
  activeInvestments: number;
  exitedInvestments: number;
}

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
  userId: string;
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
