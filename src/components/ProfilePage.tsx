import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, BankAccount, AccreditationStatus, KYCStatus, Address, Investment } from '../types';
import { doc, getDoc, collection, query, where, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import EditProfileModal from './EditProfileModal';
import AddBankAccountModal from './AddBankAccountModal';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isInvestmentVisible, setIsInvestmentVisible] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddBankAccountModalOpen, setIsAddBankAccountModalOpen] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, 'users', 'test-user-id');
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        console.log('User data found:', userSnap.data());
        const user = { id: userSnap.id, ...userSnap.data() } as User;
        
        // Fetch all investments for the user
        const investmentsQuery = query(
          collection(db, 'investments'),
          where('userId', '==', user.id)
        );

        const investmentsSnap = await getDocs(investmentsQuery);
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1).getTime();
        const endOfYear = new Date(currentYear + 1, 0, 1).getTime();

        const investedThisYear = investmentsSnap.docs.reduce((total, doc) => {
          const investment = doc.data() as Investment;
          const investmentDate = investment.date.toDate().getTime();
          if (investment.status === 'completed' && investmentDate >= startOfYear && investmentDate < endOfYear) {
            return total + investment.amount;
          }
          return total;
        }, 0);

        console.log('Invested this year:', investedThisYear);

        // Update user's investedThisYear in the database
        await updateDoc(userRef, { investedThisYear });

        // Update local state
        setUserData({ ...user, investedThisYear });
      } else {
        console.log('User not found');
        setError('User not found in the database');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      if (err instanceof Error) {
        setError(`Error fetching user data: ${err.message}`);
      } else {
        setError('An unknown error occurred while fetching user data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSaveProfile = async (updatedUser: User) => {
    try {
      const userRef = doc(db, 'users', updatedUser.id);
      await updateDoc(userRef, {
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
      });
      setUserData(updatedUser);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating user profile:', err);
      // You might want to show an error message to the user here
    }
  };

  const handleAddBankAccount = async (newBankAccount: Omit<BankAccount, 'id' | 'userId'>) => {
    if (!userData) return;

    try {
      const userRef = doc(db, 'users', userData.id);
      const newBankAccountWithId: BankAccount = {
        ...newBankAccount,
        id: `bank-account-${Date.now()}`, // Generate a unique ID
        userId: userData.id,
      };

      const updatedBankAccounts = [...userData.bankAccounts, newBankAccountWithId];
      const updatedPrimaryBankAccountId = userData.primaryBankAccountId || newBankAccountWithId.id;

      await updateDoc(userRef, {
        bankAccounts: updatedBankAccounts,
        primaryBankAccountId: updatedPrimaryBankAccountId,
      });

      setUserData({
        ...userData,
        bankAccounts: updatedBankAccounts,
        primaryBankAccountId: updatedPrimaryBankAccountId,
      });

      setIsAddBankAccountModalOpen(false);
    } catch (err) {
      console.error('Error adding bank account:', err);
      // You might want to show an error message to the user here
    }
  };

  const handleSetPrimaryAccount = async (accountId: string) => {
    if (!userData) return;

    try {
      const userRef = doc(db, 'users', userData.id);
      await updateDoc(userRef, {
        primaryBankAccountId: accountId,
      });

      setUserData({
        ...userData,
        primaryBankAccountId: accountId,
      });
    } catch (err) {
      console.error('Error setting primary account:', err);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return <div className="text-center py-8" style={{ fontSize: 'var(--font-size-large)' }}>Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500" style={{ fontSize: 'var(--font-size-large)' }}>{error}</div>;
  }

  if (!userData) {
    return <div className="text-center py-8" style={{ fontSize: 'var(--font-size-large)' }}>No user data available</div>;
  }

  const InfoItem: React.FC<{ label: string; value: string | number; note?: string; children?: React.ReactNode }> = ({ label, value, note, children }) => (
    <div className="mb-3 p-3 rounded" style={{ backgroundColor: 'var(--detail-item-bg-color)' }}>
      <span className="font-semibold" style={{ fontSize: 'var(--font-size-small)', color: 'var(--text-color)' }}>{label}:</span>
      <span className="ml-2" style={{ fontSize: 'var(--font-size-medium)', color: 'var(--text-color)' }}>{value}</span>
      {note && <p className="mt-1" style={{ fontSize: 'var(--font-size-xsmall)', color: 'var(--secondary-color)' }}>{note}</p>}
      {children}
    </div>
  );

  const ButtonStyle = {
    backgroundColor: 'var(--primary-color)',
    color: 'var(--button-text-color)',
    borderRadius: 'var(--button-border-radius)',
    padding: '0.5rem 1rem',
    fontSize: 'var(--font-size-small)',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.1s',
    ':hover': {
      filter: 'brightness(110%)',
      transform: 'scale(1.05)',
    },
  };

  const amountLeftToInvest = Math.max(0, userData.yearlyInvestmentLimit - userData.investedThisYear);
  const isInvestmentLimitReached = amountLeftToInvest === 0;

  return (
    <div className="container mx-auto px-4 py-8" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <h1 className="text-3xl font-bold mb-6" style={{ fontSize: 'var(--font-size-xlarge)', color: 'var(--text-color)' }}>User Profile</h1>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('personal')}
          style={{
            ...ButtonStyle,
            backgroundColor: activeTab === 'personal' ? 'var(--primary-color)' : 'var(--secondary-color)',
          }}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab('bank')}
          style={{
            ...ButtonStyle,
            backgroundColor: activeTab === 'bank' ? 'var(--primary-color)' : 'var(--secondary-color)',
          }}
        >
          Bank Information
        </button>
        <button
          onClick={() => setActiveTab('investment-summary')}
          style={{
            ...ButtonStyle,
            backgroundColor: activeTab === 'investment-summary' ? 'var(--primary-color)' : 'var(--secondary-color)',
          }}
        >
          Investment Summary
        </button>
        <button
          onClick={() => setActiveTab('investment-reports')}
          style={{
            ...ButtonStyle,
            backgroundColor: activeTab === 'investment-reports' ? 'var(--primary-color)' : 'var(--secondary-color)',
          }}
        >
          Investment Reports
        </button>
      </div>

      <div className="bg-card-bg-color p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-bg-color)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)' }}>
        {activeTab === 'personal' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold" style={{ fontSize: 'var(--font-size-large)', color: 'var(--text-color)' }}>Personal Information</h2>
              <button
                onClick={() => setIsEditModalOpen(true)}
                style={{...ButtonStyle, backgroundColor: 'var(--secondary-color)'}}
              >
                Edit Profile
              </button>
            </div>
            <InfoItem label="Name" value={userData.name} />
            <InfoItem label="Email" value={userData.email} />
            <InfoItem label="Address" value={`${userData.address.street}, ${userData.address.city}, ${userData.address.provinceState} ${userData.address.postalCodeZip}, ${userData.address.country}`} />
            <InfoItem label="Accreditation Status" value={userData.accreditationStatus}>
              {userData.accreditationStatus !== AccreditationStatus.Accredited && (
                <button
                  onClick={() => {/* TODO: Implement apply for accredited investor logic */}}
                  style={{
                    ...ButtonStyle,
                    backgroundColor: 'var(--success-color)',
                    marginLeft: '1rem',
                    opacity: userData.accreditationStatus === AccreditationStatus.Pending ? 0.5 : 1,
                    cursor: userData.accreditationStatus === AccreditationStatus.Pending ? 'not-allowed' : 'pointer',
                  }}
                  disabled={userData.accreditationStatus === AccreditationStatus.Pending}
                >
                  {userData.accreditationStatus === AccreditationStatus.Pending ? 'Application Pending' : 'Apply for Accredited Investor Status'}
                </button>
              )}
            </InfoItem>
            <InfoItem label="KYC Status" value={userData.kycStatus} />
            <InfoItem label="Member Since" value={userData.memberSince.toDate().toLocaleDateString()} />
            <InfoItem label="Yearly Investment Limit" value={`$${userData.yearlyInvestmentLimit.toLocaleString()}`} />
            <InfoItem label="Invested This Year" value={`$${userData.investedThisYear.toLocaleString()}`} />
            <InfoItem 
              label="Amount Left to Invest This Year" 
              value={`$${amountLeftToInvest.toLocaleString()}`}
              note={isInvestmentLimitReached ? "You have reached your yearly investment limit." : ""}
            />
            <InfoItem label="Total Investments" value={`$${userData.totalInvestments.toLocaleString()}`} />
          </div>
        )}

        {activeTab === 'bank' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold" style={{ fontSize: 'var(--font-size-large)', color: 'var(--text-color)' }}>Bank Information</h2>
              <button
                onClick={() => setIsAddBankAccountModalOpen(true)}
                style={{...ButtonStyle, backgroundColor: 'var(--success-color)'}}
              >
                Add Bank Account
              </button>
            </div>
            {userData.bankAccounts.length > 0 ? (
              userData.bankAccounts.map((account: BankAccount, index: number) => (
                <div key={account.id} className="mb-4 p-4 rounded" style={{ backgroundColor: 'var(--detail-item-bg-color)' }}>
                  <h3 className="text-xl font-semibold mb-2" style={{ fontSize: 'var(--font-size-medium)', color: 'var(--text-color)' }}>
                    Account {index + 1}
                    {account.id === userData.primaryBankAccountId && (
                      <span className="ml-2 px-2 py-1 bg-green-500 text-white rounded-full text-xs">Primary</span>
                    )}
                  </h3>
                  <InfoItem label="Bank Name" value={account.bankName} />
                  <InfoItem label="Account Number" value={account.accountNumber} />
                  <InfoItem label="Account Type" value={account.accountType} />
                  <button
                    onClick={() => handleSetPrimaryAccount(account.id)}
                    style={{
                      ...ButtonStyle,
                      backgroundColor: 'var(--secondary-color)',
                      opacity: account.id === userData.primaryBankAccountId ? 0.5 : 1,
                      cursor: account.id === userData.primaryBankAccountId ? 'not-allowed' : 'pointer',
                    }}
                    disabled={account.id === userData.primaryBankAccountId}
                  >
                    {account.id === userData.primaryBankAccountId ? 'Primary Account' : 'Set as Primary Account'}
                  </button>
                </div>
              ))
            ) : (
              <p style={{ fontSize: 'var(--font-size-medium)', color: 'var(--text-color)' }}>No bank accounts added yet.</p>
            )}
          </div>
        )}

        {activeTab === 'investment-summary' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontSize: 'var(--font-size-large)', color: 'var(--text-color)' }}>Investment Summary</h2>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontSize: 'var(--font-size-medium)', color: 'var(--text-color)' }}>Overall Investment Summary</h3>
              <InfoItem label="Total Investments" value={`$${userData.totalInvestments.toLocaleString()}`} />
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontSize: 'var(--font-size-medium)', color: 'var(--text-color)' }}>Yearly Investment Summary</h3>
              {/* TODO: Implement logic to show sum of investments for every year */}
              <p style={{ fontSize: 'var(--font-size-medium)', color: 'var(--text-color)' }}>Yearly investment summary to be implemented...</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontSize: 'var(--font-size-medium)', color: 'var(--text-color)' }}>Current Year Investment Summary</h3>
              <InfoItem label="Yearly Investment Limit" value={`$${userData.yearlyInvestmentLimit.toLocaleString()}`} />
              <InfoItem label="Invested This Year" value={`$${userData.investedThisYear.toLocaleString()}`} />
              <InfoItem 
                label="Amount Left to Invest This Year" 
                value={`$${amountLeftToInvest.toLocaleString()}`}
                note={isInvestmentLimitReached ? "You have reached your yearly investment limit." : ""}
              />
            </div>
          </div>
        )}

        {activeTab === 'investment-reports' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontSize: 'var(--font-size-large)', color: 'var(--text-color)' }}>Investment Reports</h2>
            {/* TODO: Implement logic to fetch and display PDF reports */}
            <p style={{ fontSize: 'var(--font-size-medium)', color: 'var(--text-color)' }}>Tax and investment reports will be listed here as PDF files for each year.</p>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          user={userData}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {isAddBankAccountModalOpen && (
        <AddBankAccountModal
          onClose={() => setIsAddBankAccountModalOpen(false)}
          onSave={handleAddBankAccount}
        />
      )}
    </div>
  );
};

export default ProfilePage;
