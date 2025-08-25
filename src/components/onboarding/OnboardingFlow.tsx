"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { OrganizationStep } from './steps/OrganizationStep';
import { PaymentPlansStep } from './steps/PaymentPlansStep';
import { UserImportStep } from './steps/UserImportStep';
import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingHeader } from './OnboardingHeader';

export interface OnboardingData {
  companyName: string;
  employeeCount: string;
  selectedPlan?: string;
  importMethod?: string;
  userCount?: number;
  // Add more fields as we progress through steps
}

const TOTAL_STEPS = 3;

export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    companyName: '',
    employeeCount: '',
    selectedPlan: '',
    importMethod: '',
    userCount: 0,
  });

  // Handle URL parameters for resuming onboarding
  useEffect(() => {
    const step = searchParams.get('step');
    if (step) {
      const stepNumber = parseInt(step, 10);
      if (stepNumber >= 1 && stepNumber <= TOTAL_STEPS) {
        setCurrentStep(stepNumber);
      }
    }
  }, [searchParams]);

  const handleStepComplete = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
    
    // For payment step, if enterprise plan is selected, skip directly to user import
    if (currentStep === 2 && stepData.selectedPlan === 'enterprise') {
      setCurrentStep(3); // Skip to user import step
      return;
    }
    
    // For payment step with starter/professional, the user will be redirected to Stripe
    // They'll come back via the success page which will redirect to step 3
    if (currentStep === 2 && (stepData.selectedPlan === 'starter' || stepData.selectedPlan === 'professional')) {
      // Don't advance step here - user will be redirected to payment
      return;
    }
    
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      // All steps completed - handle final submission
      handleOnboardingComplete({ ...data, ...stepData });
    }
  };

  const handleOnboardingComplete = (finalData: OnboardingData) => {
    
    // Redirect to main dashboard after successful onboarding
    router.push('/app');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OrganizationStep
            data={data}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <PaymentPlansStep
            data={data}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <UserImportStep
            data={data}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      <div className="relative z-10">
        <OnboardingHeader />
        
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card border rounded-xl shadow-lg"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
