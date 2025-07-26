export default function TeamTasksPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Intervention Tasks</h1>
        <p className="text-muted-foreground mt-2">
          Support interventions and manage learner tasks
        </p>
      </div>
      
      {/* Coming soon content */}
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
          <h2 className="text-xl font-semibold">Intervention Tasks</h2>
          <p className="text-muted-foreground max-w-md">
            This section will help you manage support interventions and track learner tasks. 
            Features coming soon!
          </p>
        </div>
      </div>
    </div>
  )
} 