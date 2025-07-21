import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Step3Props {
  // Add props interface as needed
}

const Step3: React.FC<Step3Props> = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Step 3</h1>
          <p className="text-lg text-gray-600">
            This is Step 3 of the process.
          </p>
        </div>
        
        {/* Add your Step 3 content here */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-gray-700 mb-4">
            Congratulations! You've reached the final step of our multi-step process. Here you can add any content specific to Step 3.
          </p>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-start">
          <Link href="/step2">
            <Button variant="outline" className="px-6 py-2">
              Previous
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Step3;
