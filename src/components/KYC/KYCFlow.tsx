import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KYCFormStep, KYCStatus, KYCData } from '../../types';
import PersonalInfoStep from './steps/PersonalInfoStep';
import IdentityVerificationStep from './steps/IdentityVerificationStep';
import FinancialInfoStep from './steps/FinancialInfoStep';
import InvestmentExperienceStep from './steps/InvestmentExperienceStep';
import RiskAssessmentStep from './steps/RiskAssessmentStep';
import ReviewStep from './steps/ReviewStep';

const steps = [
  { id: KYCFormStep.PERSONAL_INFO, label: 'Personal Information', shortLabel: 'Personal' },
  { id: KYCFormStep.IDENTITY_VERIFICATION, label: 'Identity Verification', shortLabel: 'Identity' },
  { id: KYCFormStep.FINANCIAL_INFO, label: 'Financial Information', shortLabel: 'Financial' },
  { id: KYCFormStep.INVESTMENT_EXPERIENCE, label: 'Investment Experience', shortLabel: 'Experience' },
  { id: KYCFormStep.RISK_ASSESSMENT, label: 'Risk Assessment', shortLabel: 'Risk' },
  { id: KYCFormStep.REVIEW, label: 'Review', shortLabel: 'Review' },
];

const KYCFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<KYCFormStep>(KYCFormStep.PERSONAL_INFO);
  const [formData, setFormData] = useState<Partial<KYCData>>({});
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    setProgress(((currentStepIndex + 1) / steps.length) * 100);
  }, [currentStep]);

  const handleNext = (stepData: Partial<KYCData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement API call to save KYC data
      navigate('/kyc/success');
    } catch (error) {
      console.error('Error submitting KYC:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case KYCFormStep.PERSONAL_INFO:
        return <PersonalInfoStep onNext={handleNext} data={formData} />;
      case KYCFormStep.IDENTITY_VERIFICATION:
        return <IdentityVerificationStep onNext={handleNext} onBack={handleBack} data={formData} />;
      case KYCFormStep.FINANCIAL_INFO:
        return <FinancialInfoStep onNext={handleNext} onBack={handleBack} data={formData} />;
      case KYCFormStep.INVESTMENT_EXPERIENCE:
        return <InvestmentExperienceStep onNext={handleNext} onBack={handleBack} data={formData} />;
      case KYCFormStep.RISK_ASSESSMENT:
        return <RiskAssessmentStep onNext={handleNext} onBack={handleBack} data={formData} />;
      case KYCFormStep.REVIEW:
        return <ReviewStep onSubmit={handleSubmit} onBack={handleBack} data={formData} />;
      default:
        return null;
    }
  };

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6" style={{ color: 'var(--text-color)' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Know Your Customer (KYC)</h1>
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card-bg-color)' }}>
          {/* Mobile Timeline */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{steps[currentStepIndex].shortLabel}</span>
            </div>
            <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--progress-bg-color)' }}>
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: 'var(--primary-color)'
                }}
              />
            </div>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Progress Line */}
              <div 
                className="absolute top-4 left-0 right-0 h-0.5"
                style={{ backgroundColor: 'var(--progress-bg-color)' }}
              />
              <div 
                className="absolute top-4 left-0 h-0.5 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  width: `${progress}%`
                }}
              />

              {/* Steps */}
              <div className="relative z-10 grid grid-cols-6 gap-0">
                {steps.map((step, index) => {
                  const isActive = currentStepIndex >= index;
                  const isCurrent = currentStepIndex === index;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-all duration-300"
                        style={{
                          backgroundColor: isActive ? 'var(--primary-color)' : 'var(--progress-bg-color)',
                          border: isCurrent ? '2px solid var(--primary-color)' : 'none',
                          padding: isCurrent ? '2px' : '0'
                        }}
                      >
                        <span className="text-sm">{index + 1}</span>
                      </div>
                      <div className="text-center min-h-[40px]">
                        <span 
                          className="text-sm transition-all duration-300 leading-tight block"
                          style={{
                            color: isActive ? 'var(--text-color)' : 'var(--secondary-color)',
                            fontWeight: isCurrent ? '600' : '400'
                          }}
                        >
                          {step.shortLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default KYCFlow;
