import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Step1Props = Record<string, never>;

const Step1: React.FC<Step1Props> = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Step 1</h1>
          <p className="text-lg text-muted-foreground">
            This is Step 1 of the process.
          </p>
        </div>
        
        {/* Add your Step 1 content here */}
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <p className="text-card-foreground mb-4">
            Welcome to the first step of our multi-step process. Here you can add any content specific to Step 1.
          </p>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-end">
          <Link href="/step2">
            <Button className="px-6 py-2">
              Next
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Step1;
