import React, { useState, useEffect } from 'react';
import { 
  User, 
  StartupsSelection, 
  Campaign, 
  SecurityAllocation,
  AllocationValidationResult
} from '../types';
import {
  validateInvestmentAllocations,
  calculateInvestmentAllocations
} from '../utils/investmentAllocation';

interface InvestmentAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (amount: number) => void;
  user: User;
  selection: StartupsSelection;
  campaigns: Campaign[];
}

const InvestmentAllocationModal: React.FC<InvestmentAllocationModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  user,
  selection,
  campaigns
}) => {
  const [amount, setAmount] = useState<number>(500);
  const [allocations, setAllocations] = useState<SecurityAllocation[]>([]);
  const [validationResult, setValidationResult] = useState<AllocationValidationResult>({ 
    isValid: false, 
    errors: [] 
  });

  useEffect(() => {
    if (amount) {
      const validation = validateInvestmentAllocations(user, selection, campaigns, amount);
      setValidationResult(validation);
      
      if (validation.isValid) {
        const newAllocations = calculateInvestmentAllocations(user, selection, campaigns, amount);
        setAllocations(newAllocations);
      }
    }
  }, [amount, user, selection, campaigns]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-75 backdrop-blur-sm"></div>
      <div className="relative bg-card-bg-color w-full max-w-lg m-auto flex-col flex rounded-lg shadow-2xl">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-primary-color">Investment Allocation</h2>
          
          {/* Investment Amount Input */}
          <div className="mb-6">
            <label className="block text-lg mb-2">Investment Amount ($)</label>
            <input
              type="number"
              min="500"
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-3 border rounded-lg bg-input-bg-color text-lg"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--input-bg-color)',
              }}
            />
          </div>

          {/* Validation Errors */}
          {validationResult.errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-100 rounded-lg">
              <h3 className="text-red-700 font-semibold mb-2">Validation Errors:</h3>
              <ul className="list-disc pl-5">
                {validationResult.errors.map((error, index) => (
                  <li key={index} className="text-red-600">{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Allocations Display */}
          {validationResult.isValid && allocations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Investment Breakdown</h3>
              <div className="space-y-4">
                {allocations.map((allocation) => {
                  const campaign = campaigns.find(c => c.startupId === allocation.startupId);
                  return (
                    <div key={allocation.startupId} className="p-4 bg-secondary-bg-color rounded-lg">
                      <h4 className="font-semibold">{campaign?.startupId}</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>Proportion:</div>
                        <div>{(allocation.proportion * 100).toFixed(1)}%</div>
                        <div>Amount:</div>
                        <div>${allocation.maxPrice.toFixed(2)}</div>
                        <div>Securities:</div>
                        <div>{allocation.maxSecurities} @ ${allocation.securityPrice}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="py-3 px-6 rounded-full text-lg font-semibold border border-primary-color text-primary-color hover:bg-primary-color hover:text-white transition duration-200"
              style={{
                borderColor: 'var(--primary-color)',
                color: 'var(--primary-color)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => onProceed(amount)}
              disabled={!validationResult.isValid}
              className="bg-primary-color text-button-text-color py-3 px-6 rounded-full text-lg font-semibold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-opacity-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'var(--button-text-color)',
                borderRadius: 'var(--button-border-radius)',
              }}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentAllocationModal;
