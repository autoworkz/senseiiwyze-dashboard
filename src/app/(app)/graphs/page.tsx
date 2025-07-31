export default function GraphsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Graphs</h1>
        <p className="text-muted-foreground">Visualize your data with interactive charts and graphs.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="mb-4 font-semibold">Revenue Trend</h3>
          <div className="h-64 bg-muted rounded flex items-center justify-center">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="mb-4 font-semibold">User Growth</h3>
          <div className="h-64 bg-muted rounded flex items-center justify-center">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </div>
        <div className="rounded-lg border p-6 md:col-span-2">
          <h3 className="mb-4 font-semibold">Performance Metrics</h3>
          <div className="h-64 bg-muted rounded flex items-center justify-center">
            <p className="text-muted-foreground">Large chart placeholder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
