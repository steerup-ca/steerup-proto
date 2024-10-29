import React, { useState } from 'react';
import { KYCData } from '../../../types';

interface PersonalInfoStepProps {
  onNext: (data: Partial<KYCData>) => void;
  data: Partial<KYCData>;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ onNext, data }) => {
  const [formData, setFormData] = useState({
    dateOfBirth: data.personalInfo?.dateOfBirth || '',
    nationality: data.personalInfo?.nationality || '',
    occupation: data.personalInfo?.occupation || '',
    employerName: data.personalInfo?.employerName || '',
    taxResidency: data.personalInfo?.taxResidency || '',
    taxIdentificationNumber: data.personalInfo?.taxIdentificationNumber || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      personalInfo: formData,
    });
  };

  const inputStyle = "w-full p-2 border rounded";
  const labelStyle = "block mb-2 font-semibold flex items-center gap-2";
  const optionalBadgeStyle = "text-xs px-2 py-0.5 rounded";

  const OptionalBadge = () => (
    <span 
      className={optionalBadgeStyle}
      style={{ 
        backgroundColor: 'var(--secondary-color)',
        color: 'var(--text-color)',
        opacity: '0.7'
      }}
    >
      Optional
    </span>
  );

  return (
    <div className="bg-card-bg rounded-lg p-6" style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)' }}>
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <p className="mb-6" style={{ color: 'var(--secondary-color)' }}>
        Required information for NI45-110 compliance and account verification.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>
              Date of Birth
              <span className="text-xs" style={{ color: 'var(--secondary-color)' }}>
                (Must be 18+)
              </span>
            </label>
            <input
              type="date"
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </div>

          <div>
            <label className={labelStyle}>Country of Citizenship</label>
            <input
              type="text"
              required
              placeholder="e.g., Canada"
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            />
          </div>

          <div>
            <label className={labelStyle}>Current Occupation</label>
            <input
              type="text"
              required
              placeholder="e.g., Software Engineer"
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
            />
          </div>

          <div>
            <label className={labelStyle}>
              Current Employer
              <OptionalBadge />
            </label>
            <input
              type="text"
              placeholder="e.g., Tech Company Inc."
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.employerName}
              onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
            />
          </div>

          <div>
            <label className={labelStyle}>Country of Tax Residence</label>
            <input
              type="text"
              required
              placeholder="e.g., Canada"
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.taxResidency}
              onChange={(e) => setFormData({ ...formData, taxResidency: e.target.value })}
            />
          </div>

          <div>
            <label className={labelStyle}>
              Tax ID Number (TIN/SIN)
              <OptionalBadge />
            </label>
            <input
              type="text"
              placeholder="e.g., 123-456-789"
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.taxIdentificationNumber}
              onChange={(e) => setFormData({ ...formData, taxIdentificationNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
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

export default PersonalInfoStep;
