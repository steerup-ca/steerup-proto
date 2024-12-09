import { doc, getDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  StartupsSelection, 
  Campaign, 
  Startup, 
  LeadInvestor, 
  Investment,
  InvestmentType 
} from '../types';

// Helper function to convert object to array
const objectToArray = (obj: any) => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return Object.values(obj);
};

interface FetchSelectionResult {
  selection: StartupsSelection | null;
  campaigns: Campaign[];
  startups: Startup[];
  selectionLead: LeadInvestor | null;
}

export const fetchSelectionData = async (id: string): Promise<FetchSelectionResult> => {
  // Fetch selection
  const selectionRef = doc(db, 'startupsSelections', id);
  const selectionSnap = await getDoc(selectionRef);
  
  if (!selectionSnap.exists()) {
    throw new Error('Selection not found');
  }

  const selectionData = selectionSnap.data();

  // Convert campaigns object to array
  const campaignIds = objectToArray(selectionData.campaigns);
  if (!campaignIds || campaignIds.length === 0) {
    throw new Error('Invalid selection data: missing campaigns array');
  }

  // Fetch campaigns
  const campaignPromises = campaignIds.map(async campaignId => {
    const campaignRef = doc(db, 'campaigns', campaignId);
    const campaignSnap = await getDoc(campaignRef);
    if (!campaignSnap.exists()) return null;
    return { id: campaignSnap.id, ...campaignSnap.data() } as Campaign;
  });

  const campaignsData = (await Promise.all(campaignPromises)).filter((campaign): campaign is Campaign => 
    campaign !== null && 
    campaign.startupId !== undefined && 
    campaign.offeringDetails !== undefined
  );

  if (campaignsData.length === 0) {
    throw new Error('No valid campaigns found for this selection');
  }

  // Format selection data with equal allocation
  const equalProportion = 1 / campaignsData.length;
  const formattedSelection: StartupsSelection = {
    id: selectionSnap.id,
    title: selectionData.title || '',
    description: selectionData.description || '',
    selectionLead: selectionData.selectionLead || '',
    campaigns: campaignsData.map(c => c.id),
    startupProportions: campaignsData.map(c => ({
      campaignId: c.id,
      proportion: equalProportion
    })),
    goal: selectionData.goal || 0,
    currentAmount: selectionData.currentAmount || 0,
    daysLeft: selectionData.daysLeft || 0,
    backersCount: selectionData.backersCount || 0,
    additionalFunding: [],
    investmentType: InvestmentType.EQUITY
  };

  // Fetch startups
  const startupIds = campaignsData.map(campaign => campaign.startupId);
  const startupPromises = startupIds.map(async startupId => {
    const startupRef = doc(db, 'startups', startupId);
    const startupSnap = await getDoc(startupRef);
    if (!startupSnap.exists()) return null;
    return { id: startupSnap.id, ...startupSnap.data() } as Startup;
  });

  const startupsData = (await Promise.all(startupPromises)).filter((startup): startup is Startup => startup !== null);

  if (startupsData.length === 0) {
    throw new Error('No valid startups found for this selection');
  }

  // Fetch selection lead
  let selectionLead: LeadInvestor | null = null;
  if (formattedSelection.selectionLead) {
    const leadRef = doc(db, 'leadInvestors', formattedSelection.selectionLead);
    const leadSnap = await getDoc(leadRef);
    if (leadSnap.exists()) {
      selectionLead = { id: leadSnap.id, ...leadSnap.data() } as LeadInvestor;
    }
  }

  return {
    selection: formattedSelection,
    campaigns: campaignsData,
    startups: startupsData,
    selectionLead
  };
};

export const createInvestment = async (
  userId: string,
  selectionId: string,
  amount: number
): Promise<string> => {
  const newInvestment: Omit<Investment, 'id'> = {
    date: Timestamp.now(),
    amount,
    selectionId,
    userId,
    status: 'completed'
  };

  const docRef = await addDoc(collection(db, 'investments'), newInvestment);
  return docRef.id;
};
