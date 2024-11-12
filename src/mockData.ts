import { StartupsSelection, LeadInvestor, Startup, Campaign, InvestmentType, Founder } from './types';

export const mockFounders: { [key: string]: Founder } = {
  'founder1': {
    id: 'founder1',
    name: 'John Doe',
    photo: 'https://i.pravatar.cc/150?u=john',
    title: 'CEO & Game Designer',
    bio: 'Veteran game designer with 10+ years of experience in AAA studios',
    linkedIn: 'https://linkedin.com/in/johndoe',
    twitter: '@johndoe',
    education: [
      {
        institution: 'University of Montreal',
        degree: 'Bachelor',
        field: 'Computer Science',
        yearCompleted: '2012'
      }
    ],
    previousStartups: [
      {
        name: 'GameStudio X',
        role: 'Lead Designer',
        yearStarted: '2015',
        yearEnded: '2019',
        exitType: 'acquisition',
        exitValue: 2000000,
        description: 'Mobile game studio acquired by major publisher'
      }
    ],
    areasOfExpertise: ['Game Design', 'Team Leadership', 'Product Strategy'],
    yearsOfExperience: 10,
    achievements: ['Best Mobile Game 2018', 'Innovation Award 2019'],
    speakingEngagements: ['GDC 2019', 'Montreal Games Summit 2020']
  },
  'founder2': {
    id: 'founder2',
    name: 'Jane Smith',
    photo: 'https://i.pravatar.cc/150?u=jane',
    title: 'CTO',
    bio: 'Technical leader with expertise in game engine development',
    linkedIn: 'https://linkedin.com/in/janesmith',
    education: [
      {
        institution: 'McGill University',
        degree: 'Master',
        field: 'Computer Engineering',
        yearCompleted: '2014'
      }
    ],
    previousStartups: [
      {
        name: 'TechEngine Labs',
        role: 'Co-founder & CTO',
        yearStarted: '2016',
        yearEnded: '2020',
        exitType: 'acquisition',
        exitValue: 3000000,
        description: 'Game engine technology company'
      }
    ],
    areasOfExpertise: ['Game Engine Development', 'Systems Architecture', 'Team Management'],
    yearsOfExperience: 8,
    achievements: ['Tech Innovation Award 2019', 'Patent holder for game rendering technology'],
    patents: ['Dynamic Rendering System US10234567']
  },
  'founder3': {
    id: 'founder3',
    name: 'Alice Johnson',
    photo: 'https://i.pravatar.cc/150?u=alice',
    title: 'Creative Director',
    bio: 'Award-winning narrative designer and creative director',
    linkedIn: 'https://linkedin.com/in/alicejohnson',
    twitter: '@alicegames',
    education: [
      {
        institution: 'York University',
        degree: 'Bachelor',
        field: 'Creative Writing',
        yearCompleted: '2013'
      }
    ],
    previousStartups: [
      {
        name: 'StoryForge Games',
        role: 'Creative Director',
        yearStarted: '2017',
        yearEnded: '2020',
        exitType: 'ongoing',
        description: 'Narrative-focused indie game studio'
      }
    ],
    areasOfExpertise: ['Narrative Design', 'Creative Direction', 'Game Writing'],
    yearsOfExperience: 9,
    achievements: ['Best Narrative Design 2019', 'Writers Guild Award 2020'],
    publications: ['The Art of Interactive Storytelling', 'Gaming Narratives Quarterly']
  }
};

export const mockLeadInvestors: { [key: string]: LeadInvestor } = {
  'lead1': {
    id: 'lead1',
    name: 'Pascal Nataf',
    photo: 'https://i.pravatar.cc/150?u=pascal',
    title: 'Gaming Industry Expert',
    bio: 'Co-founder and investor in indie video game studios.',
    credentials: ['Gaming Industry Veteran', '15+ Years Experience'],
    areasOfExpertise: ['Game Development', 'Studio Management'],
    company: 'Indie Game Studios',
    investmentHistory: [
      { companyName: 'GameStudio A', amount: 500000 },
      { companyName: 'GameStudio B', amount: 750000 }
    ]
  },
  'lead2': {
    id: 'lead2',
    name: 'Sarah Chen',
    photo: 'https://i.pravatar.cc/150?u=sarah',
    title: 'Tech Startup Advisor',
    bio: 'Experienced in SaaS and fintech ventures.',
    credentials: ['Former VC Partner', 'Tech Startup Founder'],
    areasOfExpertise: ['SaaS', 'Fintech', 'Growth Strategy'],
    company: 'TechVentures Inc',
    investmentHistory: [
      { companyName: 'TechCo A', amount: 1000000 },
      { companyName: 'TechCo B', amount: 1500000 }
    ]
  }
};

export const mockStartups: { [key: string]: Startup } = {
  'startup1': {
    id: 'startup1',
    name: 'Two Tiny Dice',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    description: 'Two Tiny Dice creates innovative, story-rich gaming experiences.',
    foundedYear: '2020',
    location: 'Montreal, Canada',
    founders: ['founder1', 'founder2'],
    team: [
      { name: 'John Doe', role: 'CEO' },
      { name: 'Jane Smith', role: 'CTO' }
    ],
    metrics: [
      { label: 'Monthly Users', value: '50K+' },
      { label: 'Revenue Growth', value: '200%' }
    ],
    fundingHistory: [
      { round: 'Seed', amount: '$500K', date: '2021' }
    ],
    industry: 'Gaming',
    fundingStage: 'Series A',
    fundingAmount: 1000000,
    teamSize: 15,
    website: 'https://twotinydice.com'
  },
  'startup2': {
    id: 'startup2',
    name: 'Unreliable Narrators',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    description: 'Passionate narrative video game creators focused on storytelling.',
    foundedYear: '2019',
    location: 'Toronto, Canada',
    founders: ['founder3'],
    team: [
      { name: 'Alice Johnson', role: 'Creative Director' },
      { name: 'Bob Wilson', role: 'Technical Lead' }
    ],
    metrics: [
      { label: 'Games Published', value: '3' },
      { label: 'Average Rating', value: '4.8/5' }
    ],
    fundingHistory: [
      { round: 'Pre-seed', amount: '$250K', date: '2020' }
    ],
    industry: 'Gaming',
    fundingStage: 'Seed',
    fundingAmount: 750000,
    teamSize: 10,
    website: 'https://unreliablenarrators.com'
  }
};

export const mockCampaigns: { [key: string]: Campaign } = {
  'campaign1': {
    id: 'campaign1',
    startupId: 'startup1',
    leadInvestorId: 'lead1',
    creation_date: new Date() as any,
    steerup_amount: 500000,
    offeringDetails: {
      minAmount: 100000,
      maxAmount: 1000000,
      equity: 10,
      valuation: 5000000,
      offeringDocument: 'https://example.com/offering1.pdf'
    },
    additionalFunding: []
  },
  'campaign2': {
    id: 'campaign2',
    startupId: 'startup2',
    leadInvestorId: 'lead2',
    creation_date: new Date() as any,
    steerup_amount: 750000,
    offeringDetails: {
      minAmount: 150000,
      maxAmount: 1500000,
      equity: 15,
      valuation: 7500000,
      offeringDocument: 'https://example.com/offering2.pdf'
    },
    additionalFunding: []
  }
};

export const mockSelections: StartupsSelection[] = [
  {
    id: 'selection1',
    title: 'Indie Gaming Portfolio',
    description: 'A curated selection of promising indie game studios',
    selectionLead: 'lead1',
    campaigns: ['campaign1'],
    startupProportions: [{ campaignId: 'campaign1', proportion: 1 }],
    goal: 1000000,
    currentAmount: 500000,
    daysLeft: 30,
    backersCount: 50,
    additionalFunding: [],
    investmentType: InvestmentType.EQUITY
  },
  {
    id: 'selection2',
    title: 'Game Studio Growth Fund',
    description: 'Debt financing for established game studios',
    selectionLead: 'lead2',
    campaigns: ['campaign2'],
    startupProportions: [{ campaignId: 'campaign2', proportion: 1 }],
    goal: 2000000,
    currentAmount: 1000000,
    daysLeft: 45,
    backersCount: 75,
    additionalFunding: [],
    investmentType: InvestmentType.DEBT,
    debtTerms: {
      interestRate: 9.5,
      maturityMonths: 36,
      paymentSchedule: 'quarterly'
    }
  }
];
