"use client";

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const stepNames = [
  'Organization Details',
  'Choose Plan',
  'Import Users'
];

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="w-full">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <div className="relative">
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-colors",
                    isCompleted 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : isCurrent 
                        ? "bg-custom-blue border-custom-blue text-custom-blue-foreground"
                        : "bg-background border-muted-foreground text-muted-foreground"
                  )}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </motion.div>
                
                {/* Connecting Line */}
                {index < totalSteps - 1 && (
                  <div
                    className={cn(
                      "absolute top-1/2 left-full w-16 h-0.5 -translate-y-1/2 ml-2",
                      stepNumber < currentStep ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
              
              {/* Step Name */}
              <div className="ml-3">
                <p className={cn(
                  "text-sm font-medium",
                  (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                )}>
                  {stepNames[index]}
                </p>
                <p className="text-xs text-muted-foreground">
                  Step {stepNumber} of {totalSteps}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-primary to-custom-blue h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
