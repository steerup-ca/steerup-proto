import React, { useEffect, useState } from 'react';
import { generateSecurityDocument } from '../utils/pdfGenerator';
import { Timestamp } from 'firebase/firestore';
import { InvestmentStage } from '../types';

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-smoke-light flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-75 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--card-bg-color)] w-full max-w-4xl m-4 flex-col flex rounded-lg shadow-2xl h-[80vh]">
        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
          <h2 className="text-[var(--text-color)] text-[var(--font-size-large)] font-bold">
            {startupName} Security Document
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 bg-[var(--primary-color)] text-[var(--button-text-color)] px-4 py-2 rounded-[var(--button-border-radius)] hover:bg-opacity-90 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--detail-item-bg-color)] transition-all"
            >
              <svg className="w-5 h-5 text-[var(--text-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 p-4 bg-white overflow-hidden">
          {pdfData ? (
            <div className="w-full h-full">
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
            <div className="flex items-center justify-center h-full">
              <p className="text-[var(--text-color)]">Loading document...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityDocumentModal;
