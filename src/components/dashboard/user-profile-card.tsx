"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface UserProfileData {
  full_name: string
  employee_id: string
  department: string
  position: string
  manager_name: string
  start_date: string
  avatar_url?: string | null
  employment_status: "active" | "inactive" | "pending"
  program_readiness: "ready" | "in_progress" | "not_ready"
}

interface UserProfileCardProps {
  user: UserProfileData
  className?: string
}

const statusVariants = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-red-100 text-red-800 border-red-200", 
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  not_ready: "bg-red-100 text-red-800 border-red-200"
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function UserProfileCard({ user, className }: UserProfileCardProps) {
  return (
    <GlassCard variant="default" className={cn("h-fit", className)}>
      <GlassCardHeader className="text-center pb-2">
        <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-white/20">
          <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {getInitials(user.full_name)}
          </AvatarFallback>
        </Avatar>
        
        <h2 className="text-2xl font-bold text-foreground">
          {user.full_name}
        </h2>
        
        <div className="flex gap-2 justify-center mt-3">
          <Badge 
            variant="outline" 
            className={cn("text-xs font-medium", statusVariants[user.employment_status])}
          >
            {user.employment_status.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge 
            variant="outline"
            className={cn("text-xs font-medium", statusVariants[user.program_readiness])}
          >
            {user.program_readiness.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </GlassCardHeader>

      <GlassCardContent className="space-y-4">
        <div className="space-y-3">
          <InfoItem label="Employee ID" value={user.employee_id} />
          <InfoItem label="Department" value={user.department} />
          <InfoItem label="Position" value={user.position} />
          <InfoItem label="Manager" value={user.manager_name} />
          <InfoItem label="Start Date" value={formatDate(user.start_date)} />
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

interface InfoItemProps {
  label: string
  value: string
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm font-medium text-muted-foreground">{label}:</span>
      <span className="text-sm text-foreground text-right font-medium max-w-[60%]">
        {value}
      </span>
    </div>
  )
}