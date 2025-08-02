"use client"

import * as React from "react"
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Bell,
  User,
  Mail,
  Calendar,
  Settings,
  Download
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  user?: {
    name: string
    avatar?: string
  }
  action?: {
    label: string
    onClick: () => void
  }
  category?: 'system' | 'user' | 'task' | 'security'
}

// Enhanced Toast Functions
export const showSuccessToast = (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
  toast.success(title, {
    description: message,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    duration: 5000,
  })
}

export const showErrorToast = (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
  toast.error(title, {
    description: message,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    duration: 8000,
  })
}

export const showWarningToast = (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
  toast.warning(title, {
    description: message,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    duration: 6000,
  })
}

export const showInfoToast = (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
  toast.info(title, {
    description: message,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    duration: 4000,
  })
}

export const showCustomToast = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  const icon = {
    success: <CheckCircle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />
  }[notification.type]

  toast.custom((t) => (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-sm font-medium">{notification.title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => toast.dismiss(t)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">
          {notification.message}
        </CardDescription>
        {notification.user && (
          <div className="flex items-center gap-2 mt-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
              <AvatarFallback className="text-xs">
                {notification.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{notification.user.name}</span>
          </div>
        )}
        {notification.action && (
          <Button
            size="sm"
            className="mt-3"
            onClick={() => {
              notification.action!.onClick()
              toast.dismiss(t)
            }}
          >
            {notification.action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  ), {
    duration: 6000,
  })
}

// Notification Bell Component
interface NotificationBellProps {
  notifications: Notification[]
  onNotificationRead: (id: string) => void
  onNotificationDelete: (id: string) => void
  onMarkAllRead: () => void
  className?: string
}

export function NotificationBell({
  notifications,
  onNotificationRead,
  onNotificationDelete,
  onMarkAllRead,
  className
}: NotificationBellProps) {
  const unreadCount = notifications.filter(n => !n.read).length
  
  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'user':
        return <User className="h-4 w-4" />
      case 'task':
        return <Calendar className="h-4 w-4" />
      case 'security':
        return <Settings className="h-4 w-4" />
      case 'system':
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'text-success'
      case 'error':
        return 'text-destructive'
      case 'warning':
        return 'text-warning'
      case 'info':
      default:
        return 'text-info'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              className="text-xs h-auto p-1"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-3 space-y-1 cursor-pointer"
                onClick={() => !notification.read && onNotificationRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={cn("flex-shrink-0", getTypeColor(notification.type))}>
                      {getCategoryIcon(notification.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "text-sm truncate",
                          !notification.read && "font-medium"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      onNotificationDelete(notification.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                  <span>{formatTime(notification.timestamp)}</span>
                  {notification.user && (
                    <div className="flex items-center gap-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                        <AvatarFallback className="text-xs">
                          {notification.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{notification.user.name}</span>
                    </div>
                  )}
                </div>
                
                {notification.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-1 h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      notification.action!.onClick()
                    }}
                  >
                    {notification.action.label}
                  </Button>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-muted-foreground">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Sample notifications for testing
export const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Training Completed',
    message: 'You have successfully completed the React Fundamentals course',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    read: false,
    category: 'task',
    action: {
      label: 'View Certificate',
      onClick: () => console.log('View certificate')
    }
  },
  {
    id: '2',
    type: 'info',
    title: 'New Team Member',
    message: 'Sarah Johnson has joined your team',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    read: false,
    category: 'user',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://avatar.vercel.sh/sarah'
    }
  },
  {
    id: '3',
    type: 'warning',
    title: 'Security Alert',
    message: 'Unusual login activity detected from new location',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    read: true,
    category: 'security',
    action: {
      label: 'Review Activity',
      onClick: () => console.log('Review activity')
    }
  },
  {
    id: '4',
    type: 'error',
    title: 'Payment Failed',
    message: 'Monthly subscription payment could not be processed',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    read: true,
    category: 'system',
    action: {
      label: 'Update Payment',
      onClick: () => console.log('Update payment')
    }
  }
]