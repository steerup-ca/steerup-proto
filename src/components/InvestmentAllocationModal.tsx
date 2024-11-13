import React, { useState, useEffect } from 'react';
import { 
  User, 
  StartupsSelection, 
  Campaign, 
  SecurityAllocation,
  AllocationValidationResult,
  Startup,
  InvestmentType
} from '../types';
import {
  validateInvestmentAllocations,
  calculateInvestmentAllocations,
  calculateMinimumViableInvestment
} from '../utils/investmentAllocation';

interface InvestmentAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (amount: number) => void;
  user: User;
  selection: StartupsSelection;
  campaigns: Campaign[];
  startups: Startup[];
}

const InvestmentAllocationModal: React.FC<InvestmentAllocationModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  user,
  selection,
  campaigns,
  startups
}) => {
  const minimumInvestment = calculateMinimumViableInvestment(campaigns, selection);
  const [amount, setAmount] = useState<number>(minimumInvestment);
  const [allocations, setAllocations] = useState<SecurityAllocation[]>([]);
  const [validationResult, setValidationResult] = useState<AllocationValidationResult>({ 
    isValid: false, 
    errors: [] 
  });

  // Calculate step value for the input
  const getStepValue = (): number => {
    if (selection.investmentType === InvestmentType.DEBT) {
      return 100;
    }
    // For equity, use the minimum amount from the first campaign
    const firstCampaign = campaigns[0];
    return firstCampaign?.offeringDetails?.minAmount || 100;
  };

  // Update allocations and validation whenever amount changes
  useEffect(() => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      setValidationResult({ isValid: false, errors: ['Invalid investment amount'] });
      return;
    }

    console.log('Validating investment:', {
      amount,
      selection,
      campaigns,
      investmentType: selection.investmentType
    });

    const validation = validateInvestmentAllocations(user, selection, campaigns, amount);
    console.log('Validation result:', validation);
    setValidationResult(validation);
    
    if (validation.isValid) {
      const newAllocations = calculateInvestmentAllocations(user, selection, campaigns, amount);
      console.log('New allocations:', newAllocations);
      setAllocations(newAllocations);
    } else {
      setAllocations([]);
    }
  }, [amount, user, selection, campaigns]);

  // Helper function to get startup name
  const getStartupName = (startupId: string): string => {
    const startup = startups.find(s => s.id === startupId);
    return startup?.name || 'Unknown';
  };

  // Calculate total actual investment based on allocations
  const totalActualInvestment = allocations.reduce((sum, a) => sum + (a.maxPrice || 0), 0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(e.target.value);
    if (!isNaN(newAmount) && newAmount >= 0) {
      setAmount(newAmount);
    }
  };

  if (!isOpen) return null;

  const isDebt = selection.investmentType === InvestmentType.DEBT;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-75 backdrop-blur-sm"></div>
      <div className="relative bg-card-bg-color w-full max-w-lg m-auto flex-col flex rounded-lg shadow-2xl">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-primary-color">
            {isDebt ? 'Lending' : 'Investment'} Allocation
          </h2>
          
          {/* Minimum Investment Info */}
          <div className="mb-6 p-4 bg-secondary-bg-color rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Minimum {isDebt ? 'Lending' : 'Investment'} Required</h3>
            <p className="text-sm mb-2">
              The minimum {isDebt ? 'lending amount' : 'investment'} for this selection is ${minimumInvestment.toLocaleString()}.
            </p>
            {!isDebt && (
              <>
                <p className="text-sm opacity-75">
                  This amount covers the minimum security price for each startup in the selection:
                </p>
                <ul className="text-sm mt-2 space-y-1 opacity-75">
                  {campaigns.map(campaign => (
                    <li key={campaign.id}>
                      • {getStartupName(campaign.startupId)}: ${campaign.offeringDetails.minAmount.toLocaleString()} per security
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Investment Amount Input */}
          <div className="mb-6">
            <label className="block text-lg mb-2">
              {isDebt ? 'Lending' : 'Investment'} Amount ($)
            </label>
            <input
              type="number"
              min={minimumInvestment}
              step={getStepValue()}
              value={amount}
              onChange={handleAmountChange}
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
                {validationResult.errors.map((error, index) => {
                  // Replace startup IDs with names in error messages
                  let errorMessage = error;
                  campaigns.forEach(campaign => {
                    const startupName = getStartupName(campaign.startupId);
                    errorMessage = errorMessage.replace(campaign.startupId, startupName);
                  });
                  return <li key={index} className="text-red-600">{errorMessage}</li>;
                })}
              </ul>
            </div>
          )}

          {/* Allocations Display */}
          {validationResult.isValid && allocations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">
                {isDebt ? 'Lending' : 'Investment'} Breakdown
              </h3>
              <div className="space-y-4">
                {allocations.map((allocation) => {
                  if (!allocation?.startupId) return null;

                  const campaign = campaigns.find(c => c.startupId === allocation.startupId);
                  const startupName = getStartupName(allocation.startupId);
                  const targetProportion = campaign && selection.goal > 0 
                    ? (campaign.steerup_amount / selection.goal) * 100 
                    : 0;
                  const actualProportion = totalActualInvestment > 0 
                    ? ((allocation.maxPrice || 0) / totalActualInvestment) * 100 
                    : 0;

                  return (
                    <div key={allocation.startupId} className="p-4 bg-secondary-bg-color rounded-lg">
                      <h4 className="font-semibold">{startupName}</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>Target Proportion:</div>
                        <div>{targetProportion.toFixed(1)}%</div>
                        <div>Actual Proportion:</div>
                        <div>{actualProportion.toFixed(1)}%</div>
                        {!isDebt && (
                          <>
                            <div>Securities:</div>
                            <div>{allocation.maxSecurities.toLocaleString()} @ ${allocation.securityPrice.toLocaleString()}</div>
                          </>
                        )}
                        <div>Total Amount:</div>
                        <div>${(allocation.maxPrice || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
                <div className="p-4 bg-primary-color bg-opacity-10 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-semibold">Total {isDebt ? 'Lending' : 'Investment'}:</div>
                    <div className="font-semibold">${totalActualInvestment.toLocaleString()}</div>
                  </div>
                </div>
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
