import React, { useState } from 'react';
import { BankAccount } from '../types';

interface AddBankAccountModalProps {
  onClose: () => void;
  onSave: (newBankAccount: Omit<BankAccount, 'id' | 'userId'>) => void;
}

const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({ onClose, onSave }) => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBankAccount = {
      bankName,
      accountNumber,
      accountType,
    };
    onSave(newBankAccount);
  };

  const inputStyle = "w-full p-2 border rounded";
  const labelStyle = "block mb-2 font-semibold";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)' }}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Add Bank Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="bankName" className={labelStyle}>Bank Name</label>
              <input
                type="text"
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className={inputStyle}
                style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="accountNumber" className={labelStyle}>Account Number</label>
              <input
                type="text"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className={inputStyle}
                style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="accountType" className={labelStyle}>Account Type</label>
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className={inputStyle}
                style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
                required
              >
                <option value="">Select account type</option>
                <option value="Checking">Checking</option>
                <option value="Savings">Savings</option>
                <option value="Investment">Investment</option>
              </select>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="mr-4 px-6 py-2 rounded transition-colors duration-200"
                style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--button-text-color)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded transition-colors duration-200"
                style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
              >
                Add Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBankAccountModal;
