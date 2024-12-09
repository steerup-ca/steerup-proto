import { Timestamp } from 'firebase/firestore';
import { 
  User, 
  KYCStatus, 
  AccreditationStatus 
} from '../types';

export const getMockUser = (): User => ({
  id: 'mock-user-id',
  userId: 'mock-user-id',
  email: 'mock@example.com',
  name: 'Mock User',
  address: {
    street: '123 Mock St',
    city: 'Mock City',
    provinceState: 'Mock State',
    postalCodeZip: '12345',
    country: 'Mock Country'
  },
  kycStatus: KYCStatus.Verified,
  memberSince: Timestamp.now(),
  accreditationStatus: AccreditationStatus.NotAccredited,
  yearlyInvestmentLimit: 100000,
  investedThisYear: 0,
  totalInvestments: 0,
  bankAccounts: [],
  primaryBankAccountId: null
});
