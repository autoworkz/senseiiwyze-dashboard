export default function CoachDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Coach Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">My Learners</h2>
          <p className="text-muted-foreground">Track progress of assigned learners</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">Team Management</h2>
          <p className="text-muted-foreground">Coordinate team learning activities</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">Coaching Insights</h2>
          <p className="text-muted-foreground">Performance metrics and recommendations</p>
        </div>
      </div>
    </div>
  )
}