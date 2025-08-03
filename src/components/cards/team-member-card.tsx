"use client"

import * as React from "react"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  MoreHorizontal,
  MessageSquare,
  UserPlus,
  Shield,
  Award,
  Clock,
  TrendingUp
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  department: string
  location?: string
  joinDate: string
  status: 'online' | 'away' | 'busy' | 'offline'
  phone?: string
  timezone?: string
  
  // Performance metrics
  completedTasks?: number
  totalTasks?: number
  rating?: number
  level?: string
  
  // Skills/badges
  skills?: string[]
  badges?: Array<{
    id: string
    name: string
    icon?: React.ComponentType<{ className?: string }>
    color?: string
  }>
  
  // Recent activity
  lastActive?: string
  currentProject?: string
}

interface TeamMemberCardProps {
  member: TeamMember
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  showMetrics?: boolean
  showActivity?: boolean
  onClick?: () => void
  onMessage?: () => void
  onCall?: () => void
  onAssign?: () => void
  className?: string
}

// Status indicator component
function StatusIndicator({ status }: { status: TeamMember['status'] }) {
  const statusConfig = {
    online: { color: "bg-green-500", label: "Online" },
    away: { color: "bg-yellow-500", label: "Away" },
    busy: { color: "bg-red-500", label: "Busy" },
    offline: { color: "bg-gray-400", label: "Offline" }
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-2 w-2 rounded-full", config.color)} />
      <span className="text-sm text-muted-foreground">{config.label}</span>
    </div>
  )
}

// Performance metrics component
function PerformanceMetrics({ member }: { member: TeamMember }) {
  if (!member.completedTasks && !member.rating) return null

  const completionRate = member.totalTasks 
    ? Math.round((member.completedTasks! / member.totalTasks) * 100)
    : 0

  return (
    <div className="space-y-3">
      {member.totalTasks && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tasks Completed</span>
            <span className="font-medium">{member.completedTasks}/{member.totalTasks}</span>
          </div>
          <Progress value={completionRate} className="h-1.5" />
        </div>
      )}
      
      {member.rating && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Rating</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{member.rating.toFixed(1)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Skills and badges component
function SkillsAndBadges({ member }: { member: TeamMember }) {
  if (!member.skills?.length && !member.badges?.length) return null

  return (
    <div className="space-y-3">
      {member.skills && member.skills.length > 0 && (
        <div className="space-y-1">
          <span className="text-sm font-medium text-muted-foreground">Skills</span>
          <div className="flex flex-wrap gap-1">
            {member.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {member.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{member.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {member.badges && member.badges.length > 0 && (
        <div className="space-y-1">
          <span className="text-sm font-medium text-muted-foreground">Achievements</span>
          <div className="flex gap-1">
            {member.badges.slice(0, 3).map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs"
                style={{ backgroundColor: badge.color && `${badge.color}15` }}
              >
                {badge.icon && <badge.icon className="h-3 w-3" />}
                <span>{badge.name}</span>
              </div>
            ))}
            {member.badges.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{member.badges.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function TeamMemberCard({
  member,
  variant = 'default',
  showActions = true,
  showMetrics = true,
  showActivity = true,
  onClick,
  onMessage,
  onCall,
  onAssign,
  className,
}: TeamMemberCardProps) {
  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const joinDate = new Date(member.joinDate)
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  })

  if (variant === 'compact') {
    return (
      <Card 
        className={cn(
          "cursor-pointer transition-all hover:shadow-md",
          onClick && "hover:bg-accent/50",
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-sm">{initials}</AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background",
                member.status === 'online' && "bg-green-500",
                member.status === 'away' && "bg-yellow-500", 
                member.status === 'busy' && "bg-red-500",
                member.status === 'offline' && "bg-gray-400"
              )} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{member.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{member.role}</p>
            </div>

            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onMessage}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </DropdownMenuItem>
                  {member.phone && (
                    <DropdownMenuItem onClick={onCall}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={onAssign}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-lg",
        onClick && "cursor-pointer hover:bg-accent/50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background",
                member.status === 'online' && "bg-green-500",
                member.status === 'away' && "bg-yellow-500",
                member.status === 'busy' && "bg-red-500", 
                member.status === 'offline' && "bg-gray-400"
              )} />
            </div>
            
            <div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {member.department}
                </Badge>
                {member.level && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {member.level}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onMessage}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </DropdownMenuItem>
                {member.phone && (
                  <DropdownMenuItem onClick={onCall}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onAssign}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign Task
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{member.email}</span>
          </div>
          
          {member.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{member.phone}</span>
            </div>
          )}
          
          {member.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{member.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Joined {formatDate(joinDate)}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <StatusIndicator status={member.status} />
          {member.lastActive && showActivity && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Active {member.lastActive}</span>
            </div>
          )}
        </div>

        {/* Current Project */}
        {member.currentProject && showActivity && (
          <div className="rounded-lg bg-accent/50 p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">Working on</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {member.currentProject}
            </p>
          </div>
        )}

        {/* Performance Metrics */}
        {showMetrics && variant === 'detailed' && (
          <PerformanceMetrics member={member} />
        )}

        {/* Skills and Badges */}
        {variant === 'detailed' && (
          <SkillsAndBadges member={member} />
        )}

        {/* Quick Actions */}
        {showActions && variant === 'detailed' && (
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={onMessage} className="flex-1 gap-2">
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
            {member.phone && (
              <Button size="sm" variant="outline" onClick={onCall} className="flex-1 gap-2">
                <Phone className="h-4 w-4" />
                Call
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}