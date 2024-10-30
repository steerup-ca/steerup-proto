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

// Investment Allocation Constants and Types
export const INVESTMENT_LIMITS = {
  PLATFORM_MINIMUM: 500,
  NON_ACCREDITED_MAX_PER_STARTUP: 2500,
} as const;

export interface SecurityAllocation {
  startupId: string;
  proportion: number;
  maxPrice: number;
  securityPrice: number;
  maxSecurities: number;
}

export interface AllocationValidationResult {
  isValid: boolean;
  errors: string[];
}

// KYC Types
export enum KYCFormStep {
  PERSONAL_INFO = 'PERSONAL_INFO',
  IDENTITY_VERIFICATION = 'IDENTITY_VERIFICATION',
  FINANCIAL_INFO = 'FINANCIAL_INFO',
  INVESTMENT_EXPERIENCE = 'INVESTMENT_EXPERIENCE',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  REVIEW = 'REVIEW'
}

export interface KYCProgress {
  currentStep: KYCFormStep;
  completedSteps: KYCFormStep[];
  lastUpdated: Timestamp;
}

export interface KYCData {
  id: string;
  userId: string;
  status: KYCStatus;
  progress: KYCProgress;
  submissionDate?: Timestamp;
  expiryDate?: Timestamp;
  lastReviewDate?: Timestamp;
  personalInfo: {
    dateOfBirth: string;
    nationality: string;
    occupation: string;
    employerName?: string;
    taxResidency: string;
    taxIdentificationNumber?: string;
  };
  identityVerification: {
    documentType: 'passport' | 'drivers_license' | 'national_id';
    documentNumber: string;
    documentExpiryDate: string;
    documentImageUrls: string[];
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };
  financialInfo: {
    annualIncome: string;
    sourceOfFunds: string;
    netWorth: string;
    expectedInvestmentRange: string;
  };
  investmentExperience: {
    privateEquityExperience: boolean;
    yearsInvesting: number;
    previousInvestmentTypes: string[];
    averageInvestmentSize: string;
  };
  riskAssessment: {
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentHorizon: string;
    investmentObjectives: string[];
  };
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

export interface AdditionalFundingEntity {
  id: string;
  name: string;
  description: string;
  label: string;
  iconUrl?: string;
  type: 'organization' | 'individual';
  credentials?: string[];
  website?: string;
}

export interface CampaignAdditionalFunding {
  entityId: string;
  amount: number;
  isLocked?: boolean;
}

export interface StartupProportion {
  campaignId: string;
  proportion: number;
}

export interface StartupsSelection {
  id: string;
  title: string;
  description?: string;
  selectionLead: string;
  campaigns: string[];
  startupProportions: StartupProportion[];  // New field for startup proportions
  goal: number;
  currentAmount: number;
  daysLeft: number;
  backersCount: number;
  additionalFunding: CampaignAdditionalFunding[];
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
  };
  additionalFunding: CampaignAdditionalFunding[];
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
  NotVerified = 'Not Verified',
  NeedsReview = 'Needs Review'
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
  kycData?: KYCData;
  kycLastCompletedDate?: Timestamp;
  kycNextReviewDate?: Timestamp;
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
