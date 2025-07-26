export default function MessageCenterPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Message Center</h1>
        <p className="text-muted-foreground mt-2">
          Communication hub for team collaboration and learner support
        </p>
      </div>
      
      {/* Coming soon content */}
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <h2 className="text-xl font-semibold">Message Center</h2>
          <p className="text-muted-foreground max-w-md">
            Send messages, announcements, and collaborate with your team and learners. 
            Real-time messaging and notification system coming soon!
          </p>
        </div>
      </div>
    </div>
  )
} 