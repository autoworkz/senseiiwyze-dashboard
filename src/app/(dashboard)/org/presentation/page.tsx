export default function PresentationModePage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Presentation Mode</h1>
        <p className="text-muted-foreground mt-2">
          Executive presentation tools and boardroom-ready displays
        </p>
      </div>
      
      {/* Coming soon content */}
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
          <h2 className="text-xl font-semibold">Presentation Mode</h2>
          <p className="text-muted-foreground max-w-md">
            Create executive summaries, boardroom presentations, and high-level KPI displays. 
            Interactive presentation tools and export features coming soon!
          </p>
        </div>
      </div>
    </div>
  )
} 