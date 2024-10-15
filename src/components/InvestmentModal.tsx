import React from 'react';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'processing' | 'completed' | 'failed';
  amount: number;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose, status, amount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-75 backdrop-blur-sm"></div>
      <div className="relative bg-card-bg-color w-full max-w-lg m-auto flex-col flex rounded-lg shadow-2xl">
        <div className="p-8">
          {status === 'processing' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-primary-color">Processing Investment</h2>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-color mx-auto"></div>
              <p className="mt-6 text-lg">Please wait while we process your investment of ${amount.toLocaleString()}...</p>
            </div>
          )}
          {status === 'completed' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-green-500">Investment Successful!</h2>
              <p className="text-lg mb-8">Your investment of ${amount.toLocaleString()} has been processed successfully.</p>
              <button
                onClick={onClose}
                className="bg-primary-color text-button-text-color py-3 px-6 rounded-full text-lg font-semibold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-opacity-50 transition duration-200"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--button-text-color)',
                  borderRadius: 'var(--button-border-radius)',
                }}
              >
                Close
              </button>
            </div>
          )}
          {status === 'failed' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-red-500">Investment Failed</h2>
              <p className="text-lg mb-4">We're sorry, but there was an error processing your investment of ${amount.toLocaleString()}.</p>
              <p className="text-lg mb-8">Please try again later or contact support if the problem persists.</p>
              <button
                onClick={onClose}
                className="bg-primary-color text-button-text-color py-3 px-6 rounded-full text-lg font-semibold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-opacity-50 transition duration-200"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--button-text-color)',
                  borderRadius: 'var(--button-border-radius)',
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;
