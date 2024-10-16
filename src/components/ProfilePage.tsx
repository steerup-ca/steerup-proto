import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, BankAccount, AccreditationStatus, KYCStatus, Address } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { setupTestUser } from '../utils/setupTestData';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isInvestmentVisible, setIsInvestmentVisible] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, 'users', 'test-user-id');
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData({ id: userSnap.id, ...userSnap.data() } as User);
      } else {
        setError('User not found');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Error fetching user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAddTestUser = async () => {
    try {
      await setupTestUser();
      await fetchUserData();
    } catch (err) {
      console.error('Error adding test user:', err);
      setError('Error adding test user. Please try again.');
    }
  };

  // Helper function to mask email
  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name[0]}${name[1]}****@${domain}`;
  };

  // Helper function to mask address
  const maskAddress = (address: Address) => {
    const parts = [address.street, address.city, address.state, address.zipCode, address.country];
    const streetAddress = parts[0].trim();
    const restOfAddress = parts.slice(1).join(', ').trim();
    
    const words = streetAddress.split(' ');
    const maskedStreet = words.map((word: string, index: number) => 
      index === 0 ? word : '*'.repeat(word.length)
    ).join(' ');

    return `${maskedStreet}, ${restOfAddress}`;
  };

  const toggleInvestmentVisibility = () => {
    setIsInvestmentVisible(!isInvestmentVisible);
  };

  const renderTabContent = () => {
    if (!userData) return null;

    switch (activeTab) {
      case 'personal':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <p><strong>Steerup User ID:</strong> {userData.userId}</p>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {maskEmail(userData.email)}</p>
            <p><strong>Address:</strong> {maskAddress(userData.address)}</p>
            <p><strong>KYC Status:</strong> {userData.kycStatus}</p>
            <p><strong>Country:</strong> {userData.address.country}</p>
          </div>
        );
      case 'financial':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Financial Information</h2>
            {userData.bankAccounts.map((account: BankAccount, index: number) => (
              <div key={account.id}>
                <h3 className="text-xl font-semibold mb-2">Bank Account {index + 1}</h3>
                <p><strong>Bank Name:</strong> {account.bankName}</p>
                <p><strong>Account Number:</strong> {account.accountNumber}</p>
                <p><strong>Account Type:</strong> {account.accountType}</p>
              </div>
            ))}
          </div>
        );
      case 'account':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Account Details</h2>
            <p><strong>Member Since:</strong> {userData.memberSince.toDate().toLocaleDateString()}</p>
            <p><strong>Account Type:</strong> Investor</p>
            <div className="flex items-center">
              <p><strong>Total Investments:</strong> </p>
              <button 
                onClick={toggleInvestmentVisibility}
                className="ml-2 px-2 py-1 bg-secondary-color text-button-text-color rounded-full text-sm"
              >
                {isInvestmentVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            <p>{isInvestmentVisible ? `$${userData.totalInvestments.toLocaleString()}` : '********'}</p>
            <p><strong>Accredited Investor Status:</strong> {userData.accreditationStatus}</p>
            {userData.accreditationStatus !== AccreditationStatus.Accredited && (
              <div className="mt-2">
                <Link to="/apply-for-accreditation" className="text-primary-color hover:underline">
                  Apply for Accredited Investor Status
                </Link>
              </div>
            )}
            <p><strong>Yearly Investment Limit:</strong> {userData.accreditationStatus === AccreditationStatus.Accredited ? 'Unlimited' : `$${userData.yearlyInvestmentLimit.toLocaleString()}`}</p>
            <p><strong>Invested This Year:</strong> ${userData.investedThisYear.toLocaleString()}</p>
            <p><strong>Remaining Investment Capacity This Year:</strong> {userData.accreditationStatus === AccreditationStatus.Accredited ? 'Unlimited' : `$${(userData.yearlyInvestmentLimit - userData.investedThisYear).toLocaleString()}`}</p>
            <div className="mt-4 text-sm text-gray-600">
              <p>Note: Investment limits are based on your location and accreditation status. These limits may vary by country and are subject to change based on local regulations.</p>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Documents & Reports</h2>
            <h3 className="text-xl font-semibold mb-2">Tax Reports</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>2023 Tax Report</li>
              <li>2022 Tax Report</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Investment Summaries</h3>
            <ul className="list-disc pl-5">
              <li>2023 Investment Summary</li>
              <li>2022 Investment Summary</li>
              <li>2021 Investment Summary</li>
              <li>All-Time Investment Summary</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={handleAddTestUser}
          className="mt-4 px-4 py-2 bg-primary-color text-button-text-color rounded-full"
        >
          Add Test User
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center">
        <p>No user data available</p>
        <button
          onClick={handleAddTestUser}
          className="mt-4 px-4 py-2 bg-primary-color text-button-text-color rounded-full"
        >
          Add Test User
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background-color text-text-color">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary-color">User Profile</h1>
      
      <div className="flex mb-6">
        <button
          className={`mr-4 px-4 py-2 rounded-full ${activeTab === 'personal' ? 'bg-primary-color text-button-text-color' : 'bg-secondary-color text-text-color'}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal
        </button>
        <button
          className={`mr-4 px-4 py-2 rounded-full ${activeTab === 'financial' ? 'bg-primary-color text-button-text-color' : 'bg-secondary-color text-text-color'}`}
          onClick={() => setActiveTab('financial')}
        >
          Financial
        </button>
        <button
          className={`mr-4 px-4 py-2 rounded-full ${activeTab === 'account' ? 'bg-primary-color text-button-text-color' : 'bg-secondary-color text-text-color'}`}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
        <button
          className={`px-4 py-2 rounded-full ${activeTab === 'documents' ? 'bg-primary-color text-button-text-color' : 'bg-secondary-color text-text-color'}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
      </div>

      <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
