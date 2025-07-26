export default function TaskManagerPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
        <p className="text-muted-foreground mt-2">
          Manage intervention tasks and support workflows for your team
        </p>
      </div>
      
      {/* Coming soon content */}
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-xl font-semibold">Task Management</h2>
          <p className="text-muted-foreground max-w-md">
            Create, assign, and track intervention tasks to support learner success. 
            Advanced task management and workflow automation tools coming soon!
          </p>
        </div>
      </div>
    </div>
  )
} 