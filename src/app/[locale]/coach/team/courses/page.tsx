export default function TeamCoursesPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Curriculum</h1>
        <p className="text-muted-foreground mt-2">
          Manage courses and learning content for your team
        </p>
      </div>
      
      {/* Coming soon content */}
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <h2 className="text-xl font-semibold">Curriculum Management</h2>
          <p className="text-muted-foreground max-w-md">
            Create, organize, and manage learning modules and courses for your learners. 
            Course builder and content management tools coming soon!
          </p>
        </div>
      </div>
    </div>
  )
} 