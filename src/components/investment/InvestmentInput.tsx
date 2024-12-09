import React, { useState } from 'react';
import { INVESTMENT_LIMITS } from '../../types';

interface InvestmentInputProps {
  investmentAmount: number;
  onInvestmentChange: (amount: number) => void;
  maxAmount: number;
}

const InvestmentInput: React.FC<InvestmentInputProps> = ({
  investmentAmount,
  onInvestmentChange,
  maxAmount
}) => {
  const [inputValue, setInputValue] = useState(investmentAmount.toString());
  const STEP_AMOUNT = 500;

  const handleInvestmentChange = (newAmount: number) => {
    if (newAmount >= INVESTMENT_LIMITS.PLATFORM_MINIMUM && newAmount <= maxAmount) {
      onInvestmentChange(newAmount);
      setInputValue(newAmount.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue) || 0;
    let finalValue = numValue;
    
    if (finalValue < INVESTMENT_LIMITS.PLATFORM_MINIMUM) {
      finalValue = INVESTMENT_LIMITS.PLATFORM_MINIMUM;
    } else if (finalValue > maxAmount) {
      finalValue = maxAmount;
    }
    
    handleInvestmentChange(finalValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div className="w-full">
      <div 
        className="flex items-center"
        style={{ 
          color: 'var(--text-color)',
          backgroundColor: 'var(--input-bg-color)',
          borderRadius: '4px',
          height: '45px',
          position: 'relative'
        }}
      >
        <span className="pl-4">$</span>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            width: '100%',
            textAlign: 'center',
            color: 'inherit',
            fontSize: '1.25rem',
            fontWeight: '600',
            paddingRight: '40px'
          }}
        />
        <div className="flex flex-col gap-1 absolute right-2">
          <button 
            onClick={() => handleInvestmentChange(investmentAmount + STEP_AMOUNT)}
            style={{
              color: 'var(--text-color)',
              padding: '2px',
              opacity: investmentAmount >= maxAmount ? '0.5' : '1',
              transition: 'opacity 0.2s'
            }}
            disabled={investmentAmount >= maxAmount}
            aria-label="Increase amount"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </button>
          <button 
            onClick={() => handleInvestmentChange(investmentAmount - STEP_AMOUNT)}
            style={{
              color: 'var(--text-color)',
              padding: '2px',
              opacity: investmentAmount <= INVESTMENT_LIMITS.PLATFORM_MINIMUM ? '0.5' : '1',
              transition: 'opacity 0.2s'
            }}
            disabled={investmentAmount <= INVESTMENT_LIMITS.PLATFORM_MINIMUM}
            aria-label="Decrease amount"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentInput;
