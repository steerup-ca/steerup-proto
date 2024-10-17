import { db } from '../firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { User, AccreditationStatus, KYCStatus } from '../types';

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
