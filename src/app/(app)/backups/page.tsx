export default function BackupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backups</h1>
        <p className="text-muted-foreground">Manage your system backups and restore points.</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Daily Backup</h3>
              <p className="text-sm text-muted-foreground">Last run: 2 hours ago</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                Success
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Weekly Backup</h3>
              <p className="text-sm text-muted-foreground">Last run: 1 day ago</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                Success
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Monthly Backup</h3>
              <p className="text-sm text-muted-foreground">Last run: 5 days ago</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
