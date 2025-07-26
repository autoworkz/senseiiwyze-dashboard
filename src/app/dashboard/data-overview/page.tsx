import { DataOverview } from '@/components/dashboard/data-overview'

// Sample data for demonstration
const sampleData = [
  { id: '1', name: 'John Smith', progress: 92, status: 'ready' as const },
  { id: '2', name: 'Sarah Johnson', progress: 78, status: 'ready' as const },
  { id: '3', name: 'Michael Brown', progress: 45, status: 'coaching' as const },
  { id: '4', name: 'Emily Davis', progress: 88, status: 'ready' as const },
  { id: '5', name: 'David Wilson', progress: 65, status: 'ready' as const },
  { id: '6', name: 'Jessica Taylor', progress: 32, status: 'coaching' as const },
  { id: '7', name: 'Daniel Martinez', progress: 95, status: 'ready' as const },
  { id: '8', name: 'Olivia Anderson', progress: 82, status: 'ready' as const },
  { id: '9', name: 'James Thomas', progress: 71, status: 'ready' as const },
  { id: '10', name: 'Sophia White', progress: 29, status: 'coaching' as const },
]

export default function DataOverviewPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Data Overview Dashboard</h1>
      
      <div className="grid gap-8">
        <DataOverview 
          title="Program Readiness" 
          description="Track user progress and readiness status"
          data={sampleData}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{sampleData.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ready for Deployment</p>
                <p className="text-2xl font-bold">
                  {sampleData.filter(item => item.status === 'ready').length} 
                  <span className="text-sm text-muted-foreground ml-1">
                    ({Math.round(sampleData.filter(item => item.status === 'ready').length / sampleData.length * 100)}%)
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Needs Coaching</p>
                <p className="text-2xl font-bold">
                  {sampleData.filter(item => item.status === 'coaching').length}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({Math.round(sampleData.filter(item => item.status === 'coaching').length / sampleData.length * 100)}%)
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Progress</p>
                <p className="text-2xl font-bold">
                  {Math.round(sampleData.reduce((acc, item) => acc + item.progress, 0) / sampleData.length)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Progress Distribution</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-muted-foreground">90-100%</p>
                  <p className="text-sm font-medium">
                    {sampleData.filter(item => item.progress >= 90 && item.progress <= 100).length} users
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-primary w-[${sampleData.filter(item => item.progress >= 90 && item.progress <= 100).length / sampleData.length * 100}%]`}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-muted-foreground">70-89%</p>
                  <p className="text-sm font-medium">
                    {sampleData.filter(item => item.progress >= 70 && item.progress < 90).length} users
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-primary w-[${sampleData.filter(item => item.progress >= 70 && item.progress < 90).length / sampleData.length * 100}%]`}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-muted-foreground">50-69%</p>
                  <p className="text-sm font-medium">
                    {sampleData.filter(item => item.progress >= 50 && item.progress < 70).length} users
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-primary w-[${sampleData.filter(item => item.progress >= 50 && item.progress < 70).length / sampleData.length * 100}%]`}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-muted-foreground">30-49%</p>
                  <p className="text-sm font-medium">
                    {sampleData.filter(item => item.progress >= 30 && item.progress < 50).length} users
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-primary w-[${sampleData.filter(item => item.progress >= 30 && item.progress < 50).length / sampleData.length * 100}%]`}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-muted-foreground">0-29%</p>
                  <p className="text-sm font-medium">
                    {sampleData.filter(item => item.progress >= 0 && item.progress < 30).length} users
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-primary w-[${sampleData.filter(item => item.progress >= 0 && item.progress < 30).length / sampleData.length * 100}%]`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}