export default function LearnerDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">My Learning Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">Personal Progress</h2>
          <p className="text-muted-foreground">Track your skill development journey</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">Learning Path</h2>
          <p className="text-muted-foreground">Personalized learning recommendations</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">User Dashboard</h2>
          <p className="text-muted-foreground">Individual performance and achievements</p>
        </div>
      </div>
    </div>
  )
}