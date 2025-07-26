"use client"

import { FileText, Calendar, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface DashboardFooterProps {
  lastUpdated?: string
  className?: string
  onGenerateReport?: () => void
  onScheduleReview?: () => void
  onSendFeedback?: () => void
}

function formatLastUpdated(dateString?: string): string {
  if (!dateString) return "Never"
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function DashboardFooter({
  lastUpdated,
  className,
  onGenerateReport,
  onScheduleReview,
  onSendFeedback
}: DashboardFooterProps) {
  return (
    <GlassCard variant="subtle" className={cn("border-0 shadow-sm", className)}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6">
        {/* Last Updated */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Last updated:</span>
          <span className="font-medium text-foreground">
            {formatLastUpdated(lastUpdated)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onGenerateReport}
            className="glass-hover"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          
          <Button
            variant="outline"
            onClick={onScheduleReview}
            className="glass-hover"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Review
          </Button>
          
          <Button
            onClick={onSendFeedback}
            className="glass-hover"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Feedback
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}