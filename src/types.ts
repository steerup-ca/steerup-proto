import { Timestamp } from 'firebase/firestore';

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

export {};