import React from 'react';
import '../styles/theme.css';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'processing' | 'completed' | 'failed';
  amount: number;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose, status, amount }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {status === 'processing' && (
          <div className="text-center">
            <h2 className="heading-large" style={{ color: 'var(--primary-color)' }}>
              Processing Investment
            </h2>
            <div className="loading-spinner" />
            <p className="text-large" style={{ color: 'var(--text-color)' }}>
              Please wait while we process your investment of ${amount.toLocaleString()}...
            </p>
          </div>
        )}

        {status === 'completed' && (
          <div className="text-center">
            <h2 className="heading-large" style={{ color: 'var(--success-color)' }}>
              Investment Successful!
            </h2>
            <p className="text-large" style={{ color: 'var(--text-color)' }}>
              Your investment of ${amount.toLocaleString()} has been processed successfully.
            </p>
            <button onClick={onClose} className="primary-button">
              Close
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center">
            <h2 className="heading-large" style={{ color: 'var(--error-color)' }}>
              Investment Failed
            </h2>
            <p className="text-large" style={{ color: 'var(--text-color)' }}>
              We're sorry, but there was an error processing your investment of ${amount.toLocaleString()}.
            </p>
            <p className="text-large" style={{ color: 'var(--text-color)' }}>
              Please try again later or contact support if the problem persists.
            </p>
            <button onClick={onClose} className="primary-button">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentModal;
