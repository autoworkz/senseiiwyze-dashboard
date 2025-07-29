export default function InstitutionDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Institution Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">Program Overview</h2>
          <p className="text-muted-foreground">Academic program performance and metrics</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">Student Progress</h2>
          <p className="text-muted-foreground">Track student learning outcomes</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">Placement Outcomes</h2>
          <p className="text-muted-foreground">Job placement and career readiness metrics</p>
        </div>
      </div>
    </div>
  )
}