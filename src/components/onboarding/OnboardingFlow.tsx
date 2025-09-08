"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrganizationStep } from './steps/OrganizationStep';
import { PaymentPlansStep } from './steps/PaymentPlansStep';
import { UserImportStep } from './steps/UserImportStep';
import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingHeader } from './OnboardingHeader';
import { useCompleteOnboarding } from '@/hooks/useCompleteOnboarding';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';

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
const { step: currentStep, isLoading, advanceStep } = useOnboardingFlow();
  const { completeOnboarding } = useCompleteOnboarding();
  const [data, setData] = useState<OnboardingData>({
    companyName: '',
    employeeCount: '',
    selectedPlan: '',
    importMethod: '',
    userCount: 0,
  });

  const handleStepComplete = async (stepData: Partial<OnboardingData>) => {
    if (currentStep < TOTAL_STEPS) {
      setData(prev => ({ ...prev, ...stepData }));
      await advanceStep(); // server updates → UserContext refresh → step advances
    } else {
      await completeOnboarding(); // server sets is_onboarding=false
    }
  };

  const handleBack = () => {
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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Loading onboarding…</p>
      </div>
    );
  }


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
