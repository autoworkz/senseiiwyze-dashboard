import { HMRTestComponent } from '@/components/hmr-test-component';

export default function SimpleTest() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">🚀 Docker HMR Testing - UPDATED!</h1>
        <HMRTestComponent />
        <div className="mt-8 p-4 bg-gray-100 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Testing Notes:</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
            <li>✅ Docker HMR working - This page tests HMR speed and stability</li>
            <li>Component state should be preserved during HMR updates</li>
            <li>Changes should reflect instantly without page refresh</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
