export default function EnterpriseDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Enterprise Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">Organization Overview</h2>
          <p className="text-muted-foreground">Team readiness and organizational insights</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">Program Readiness</h2>
          <p className="text-muted-foreground">Training program effectiveness and ROI</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">Training Programs</h2>
          <p className="text-muted-foreground">Manage and track training initiatives</p>
        </div>
      </div>
    </div>
  )
}