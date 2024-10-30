import { db } from '../firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { User, AccreditationStatus, KYCStatus, StartupsSelection, Campaign, Startup, LeadInvestor } from '../types';

export const setupTestUser = async (): Promise<User> => {
  const bankAccountId = 'bank-account-1';
  const testUser: User = {
    id: 'test-user-id',
    userId: 'STRUP-123456789',
    email: 'john.doe@example.com',
    name: 'John Doe',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      provinceState: 'ST',
      postalCodeZip: '12345',
      country: 'Canada',
    },
    kycStatus: KYCStatus.Verified,
    memberSince: Timestamp.fromDate(new Date()),
    accreditationStatus: AccreditationStatus.NotAccredited,
    yearlyInvestmentLimit: 10000,
    investedThisYear: 5000,
    totalInvestments: 50000,
    bankAccounts: [
      {
        id: bankAccountId,
        userId: 'test-user-id',
        bankName: 'Example Bank',
        accountNumber: '**** **** **** 1234',
        accountType: 'Checking',
      },
    ],
    primaryBankAccountId: bankAccountId,
  };

  try {
    await setDoc(doc(db, 'users', testUser.id), testUser);
    console.log('Test user data added successfully');
    return testUser;
  } catch (error) {
    console.error('Error adding test user data:', error);
    throw error;
  }
};

export const setupTestStartupsSelection = async (): Promise<void> => {
  const selectionId = 'VpakFLujWsrE7bhjp37X';
  const campaignIds = ['campaign-1', 'campaign-2', 'campaign-3'];
  const startupIds = ['startup-1', 'startup-2', 'startup-3'];
  const leadInvestorId = 'lead-investor-1';

  // Set up lead investor
  const testLeadInvestor: LeadInvestor = {
    id: leadInvestorId,
    name: 'Sarah Chen',
    title: 'Managing Partner',
    company: 'Beyond Capital Ventures',
    photo: 'https://example.com/photo.jpg',
    bio: 'Experienced venture capitalist with focus on AI and blockchain technologies',
    areasOfExpertise: ['Artificial Intelligence', 'Blockchain', 'SaaS', 'FinTech'],
    credentials: ['MBA from Harvard', 'Former Partner at VC Firm'],
    investmentHistory: [
      { companyName: 'TechCo', amount: 1000000 },
      { companyName: 'AIStartup', amount: 750000 }
    ]
  };

  // Set up startups
  const testStartups: Startup[] = [
    {
      id: startupIds[0],
      name: 'AI Analytics Pro',
      description: 'Enterprise AI analytics platform',
      industry: 'Artificial Intelligence',
      foundedYear: '2021',
      location: 'Toronto, ON',
      teamSize: 15,
      imageUrl: 'https://example.com/startup1.jpg',
      fundingStage: 'Series A',
      fundingAmount: 2000000,
      website: 'https://aianalyticspro.com',
      team: [
        { name: 'John Smith', role: 'CEO' },
        { name: 'Jane Doe', role: 'CTO' }
      ],
      metrics: [
        { label: 'ARR', value: '$1.2M' },
        { label: 'Users', value: '5000+' }
      ],
      fundingHistory: [
        { round: 'Seed', amount: '$500K', date: '2021' }
      ]
    },
    {
      id: startupIds[1],
      name: 'BlockChain Solutions',
      description: 'Blockchain infrastructure for financial services',
      industry: 'Blockchain',
      foundedYear: '2020',
      location: 'Vancouver, BC',
      teamSize: 12,
      imageUrl: 'https://example.com/startup2.jpg',
      fundingStage: 'Seed',
      fundingAmount: 1500000,
      website: 'https://blockchainsolutions.com',
      team: [
        { name: 'Mike Johnson', role: 'CEO' }
      ],
      metrics: [
        { label: 'Transactions', value: '1M+' }
      ],
      fundingHistory: [
        { round: 'Pre-seed', amount: '$300K', date: '2020' }
      ]
    },
    {
      id: startupIds[2],
      name: 'Smart Contract Tech',
      description: 'Smart contract automation platform',
      industry: 'Blockchain',
      foundedYear: '2022',
      location: 'Montreal, QC',
      teamSize: 8,
      imageUrl: 'https://example.com/startup3.jpg',
      fundingStage: 'Pre-seed',
      fundingAmount: 750000,
      website: 'https://smartcontracttech.com',
      team: [
        { name: 'Sarah Wilson', role: 'CEO' }
      ],
      metrics: [
        { label: 'Contracts', value: '10K+' }
      ],
      fundingHistory: [
        { round: 'Angel', amount: '$200K', date: '2022' }
      ]
    }
  ];

  // Set up campaigns
  const testCampaigns: Campaign[] = [
    {
      id: campaignIds[0],
      startupId: startupIds[0],
      leadInvestorId: leadInvestorId,
      creation_date: Timestamp.now(),
      steerup_amount: 400000,
      offeringDetails: {
        minAmount: 1000,
        maxAmount: 50000,
        equity: 5,
        valuation: 8000000,
        offeringDocument: 'https://example.com/offering1.pdf'
      },
      additionalFunding: []
    },
    {
      id: campaignIds[1],
      startupId: startupIds[1],
      leadInvestorId: leadInvestorId,
      creation_date: Timestamp.now(),
      steerup_amount: 350000,
      offeringDetails: {
        minAmount: 1000,
        maxAmount: 50000,
        equity: 4,
        valuation: 7000000,
        offeringDocument: 'https://example.com/offering2.pdf'
      },
      additionalFunding: []
    },
    {
      id: campaignIds[2],
      startupId: startupIds[2],
      leadInvestorId: leadInvestorId,
      creation_date: Timestamp.now(),
      steerup_amount: 250000,
      offeringDetails: {
        minAmount: 1000,
        maxAmount: 50000,
        equity: 3,
        valuation: 5000000,
        offeringDocument: 'https://example.com/offering3.pdf'
      },
      additionalFunding: []
    }
  ];

  const testSelection: StartupsSelection = {
    id: selectionId,
    title: 'AI & Blockchain Innovation Portfolio',
    description: 'A curated selection of promising startups in AI and blockchain',
    selectionLead: leadInvestorId,
    campaigns: campaignIds,
    startupProportions: [
      { campaignId: campaignIds[0], proportion: 40 },
      { campaignId: campaignIds[1], proportion: 35 },
      { campaignId: campaignIds[2], proportion: 25 }
    ],
    goal: 1000000,
    currentAmount: 450000,
    daysLeft: 15,
    backersCount: 85,
    additionalFunding: [
      { entityId: 'entity-1', amount: 200000 },
      { entityId: 'entity-2', amount: 150000 }
    ]
  };

  try {
    // Add lead investor
    await setDoc(doc(db, 'leadInvestors', leadInvestorId), testLeadInvestor);
    console.log('Test lead investor data added successfully');

    // Add startups
    for (const startup of testStartups) {
      await setDoc(doc(db, 'startups', startup.id), startup);
    }
    console.log('Test startups data added successfully');

    // Add campaigns
    for (const campaign of testCampaigns) {
      await setDoc(doc(db, 'campaigns', campaign.id), campaign);
    }
    console.log('Test campaigns data added successfully');

    // Add selection
    await setDoc(doc(db, 'startupsSelections', selectionId), testSelection);
    console.log('Test startups selection data added successfully');
  } catch (error) {
    console.error('Error adding test data:', error);
    throw error;
  }
};
