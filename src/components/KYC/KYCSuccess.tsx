import React from 'react';
import { useNavigate } from 'react-router-dom';

const KYCSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6" style={{ color: 'var(--text-color)' }}>
      <div className="rounded-lg p-8 text-center" style={{ backgroundColor: 'var(--card-bg-color)' }}>
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'var(--success-color)' }}
        >
          <svg
            className="w-8 h-8"
            style={{ color: 'var(--button-text-color)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-4">KYC Submission Successful</h1>
        
        <p className="mb-6" style={{ color: 'var(--secondary-color)' }}>
          Your KYC information has been submitted successfully. Our team will review
          your submission and verify your information. This typically takes 1-2
          business days.
        </p>

        <div className="space-y-4">
          <div className="rounded p-4" style={{ backgroundColor: 'var(--detail-item-bg-color)' }}>
            <h3 className="font-medium mb-2">What's Next?</h3>
            <ul className="text-sm list-disc list-inside" style={{ color: 'var(--secondary-color)' }}>
              <li>We'll review your submitted information</li>
              <li>You'll receive an email notification once verified</li>
              <li>You can start investing once your KYC is approved</li>
            </ul>
          </div>

          <button
            onClick={() => navigate('/explore')}
            className="px-6 py-2 rounded transition-colors duration-200"
            style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
          >
            Explore Investment Opportunities
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCSuccess;
