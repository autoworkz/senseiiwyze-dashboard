import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Step2Props {
  // Add props interface as needed
}

const Step2: React.FC<Step2Props> = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Step 2</h1>
          <p className="text-lg text-muted-foreground">
            This is Step 2 of the process.
          </p>
        </div>
        
        {/* Add your Step 2 content here */}
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <p className="text-card-foreground mb-4">
            You're now in the second step of our multi-step process. Here you can add any content specific to Step 2.
          </p>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Link href="/step1">
            <Button variant="outline" className="px-6 py-2">
              Previous
            </Button>
          </Link>
          <Link href="/step3">
            <Button className="px-6 py-2">
              Next
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Step2;
