import React, { useState } from 'react';
import { KYCData } from '../../../types';

interface IdentityVerificationStepProps {
  onNext: (data: Partial<KYCData>) => void;
  onBack: () => void;
  data: Partial<KYCData>;
}

const IdentityVerificationStep: React.FC<IdentityVerificationStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    documentType: data.identityVerification?.documentType || 'passport',
    documentNumber: data.identityVerification?.documentNumber || '',
    documentExpiryDate: data.identityVerification?.documentExpiryDate || '',
    documentImageUrls: data.identityVerification?.documentImageUrls || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      identityVerification: {
        ...formData,
        verificationStatus: 'pending',
      },
    });
  };

  const inputStyle = "w-full p-2 border rounded";
  const labelStyle = "block mb-2 font-semibold";

  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)' }}>
      <h2 className="text-xl font-semibold mb-4">Identity Verification</h2>
      <p style={{ color: 'var(--secondary-color)' }} className="mb-6">
        Please provide a valid government-issued ID to verify your identity.
        This helps us comply with regulatory requirements and protect against fraud.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className={labelStyle}>Document Type</label>
            <select
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.documentType}
              onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
            >
              <option value="passport">Passport</option>
              <option value="drivers_license">Driver's License</option>
              <option value="national_id">National ID</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Document Number</label>
            <input
              type="text"
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.documentNumber}
              onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
            />
          </div>

          <div>
            <label className={labelStyle}>Document Expiry Date</label>
            <input
              type="date"
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.documentExpiryDate}
              onChange={(e) => setFormData({ ...formData, documentExpiryDate: e.target.value })}
            />
          </div>

          <div>
            <label className={labelStyle}>Upload Document Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData({
                  ...formData,
                  documentImageUrls: files.map(file => URL.createObjectURL(file)),
                });
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded transition-colors duration-200"
            style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--button-text-color)' }}
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded transition-colors duration-200"
            style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdentityVerificationStep;
