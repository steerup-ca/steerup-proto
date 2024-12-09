import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { LeadInvestor } from '../types';

export const getLeadInvestorById = async (id: string): Promise<LeadInvestor | null> => {
  try {
    const leadInvestorDoc = await getDoc(doc(db, 'leadInvestors', id));
    if (leadInvestorDoc.exists()) {
      return {
        id: leadInvestorDoc.id,
        ...leadInvestorDoc.data()
      } as LeadInvestor;
    }
    return null;
  } catch (error) {
    console.error('Error fetching lead investor:', error);
    return null;
  }
};

export const getAllLeadInvestors = async (): Promise<LeadInvestor[]> => {
  try {
    const leadInvestorsSnapshot = await getDocs(collection(db, 'leadInvestors'));
    return leadInvestorsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LeadInvestor[];
  } catch (error) {
    console.error('Error fetching lead investors:', error);
    return [];
  }
};
