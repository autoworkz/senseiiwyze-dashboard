'use client';

import { useState } from 'react';

export function HMRTestComponent() {
  const [count, setCount] = useState(0);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [hmrTestResults, setHmrTestResults] = useState<string[]>([]);

  const handleClick = () => {
    setCount(prev => prev + 1);
    setTimestamp(Date.now());
    setHmrTestResults(prev => [...prev, `Update ${prev.length + 1} at ${new Date().toLocaleTimeString()}`]);
  };

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg m-4">
      <h2 className="text-xl font-bold text-red-800 mb-4">HMR Test Component v1.3 🔥 SENTRY CONFLICT TEST!</h2>
      <div className="space-y-4">
        <p className="text-gray-700">Count: {count}</p>
        <p className="text-gray-700">Last Update: {new Date(timestamp).toLocaleTimeString()}</p>
        <button 
          onClick={handleClick}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Increment Counter
        </button>
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          <p className="text-yellow-800 text-sm">
            ⚡ This component will be modified to test HMR performance
          </p>
          {hmrTestResults.length > 0 && (
            <div className="mt-2">
              <p className="text-yellow-700 font-semibold text-xs">HMR Test Log:</p>
              <ul className="text-xs text-yellow-600 space-y-1">
                {hmrTestResults.slice(-3).map((result, index) => (
                  <li key={index}>• {result}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
