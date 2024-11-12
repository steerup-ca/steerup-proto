import React, { useEffect, useState } from 'react';
import { generateSecurityDocument } from '../utils/pdfGenerator';
import { Timestamp } from 'firebase/firestore';
import { InvestmentStage } from '../types';
import '../styles/DetailPage.css';

interface SecurityDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  startupName: string;
}

const SecurityDocumentModal: React.FC<SecurityDocumentModalProps> = ({ 
  isOpen, 
  onClose, 
  documentUrl,
  startupName
}) => {
  const [pdfData, setPdfData] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const data = generateSecurityDocument({
          id: 'demo-id',
          userId: 'demo-user',
          selectionId: 'demo-selection',
          startupId: 'demo-startup',
          investmentDate: Timestamp.now(),
          amount: 50000,
          type: 'equity',
          terms: {
            equity: {
              percentageOwned: 2.5,
              shareClass: 'Common'
            }
          },
          status: 'active',
          performance: {
            currentValue: 55000,
            roi: 10,
            lastValuationDate: Timestamp.now()
          },
          tracking: {
            currentStage: InvestmentStage.PERFORMANCE_TRACKING,
            lastUpdated: Timestamp.now(),
            stages: []
          }
        }, startupName);

        setPdfData(data);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }

      return () => {
        setPdfData(null);
      };
    }
  }, [isOpen, startupName]);

  const handleDownload = () => {
    if (pdfData) {
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = `${startupName.replace(/\s+/g, '-').toLowerCase()}-security-document.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ height: '80vh', maxHeight: '80vh' }}>
        <div style={{ 
          padding: 'var(--spacing-medium)',
          borderBottom: '1px solid var(--secondary-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ 
            color: 'var(--text-color)',
            fontSize: 'var(--font-size-large)',
            fontWeight: 'bold'
          }}>
            {startupName} Security Document
          </h2>
          <div style={{ display: 'flex', gap: 'var(--spacing-small)' }}>
            <button
              onClick={handleDownload}
              className="primary-button"
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 1rem'
              }}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download
            </button>
            <button
              onClick={onClose}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                color: 'var(--text-color)',
                transition: 'background-color 0.2s',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--detail-item-bg-color)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div style={{ 
          flex: 1,
          padding: 'var(--spacing-medium)',
          backgroundColor: 'white',
          overflow: 'hidden',
          height: 'calc(100% - 4rem)'
        }}>
          {pdfData ? (
            <div style={{ width: '100%', height: '100%' }}>
              <embed
                src={pdfData + '#toolbar=0&navpanes=0&scrollbar=0'}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{
                  border: 'none',
                  backgroundColor: 'white',
                  overflow: 'hidden'
                }}
              />
            </div>
          ) : (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <p style={{ color: 'var(--text-color)' }}>Loading document...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityDocumentModal;
