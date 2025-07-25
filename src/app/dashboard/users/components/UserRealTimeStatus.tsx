"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, WifiOff, Clock, UserCheck, UserX } from "lucide-react"
import { UserStatus } from '@/stores/users-store'

interface UserRealTimeStatusProps {
  userId: string
  initialStatus: UserStatus
  onStatusChange?: (status: UserStatus) => void
  className?: string
}

export function UserRealTimeStatus({ 
  userId, 
  initialStatus, 
  onStatusChange,
  className = "" 
}: UserRealTimeStatusProps) {
  const [status, setStatus] = useState<UserStatus>(initialStatus)
  const [isOnline, setIsOnline] = useState(false)
  const [lastSeen, setLastSeen] = useState<Date>(new Date())
  const [isConnected, setIsConnected] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random status changes
      const random = Math.random()
      if (random > 0.95) {
        const newStatus = random > 0.98 ? UserStatus.SUSPENDED : UserStatus.ACTIVE
        setStatus(newStatus)
        onStatusChange?.(newStatus)
      }

      // Simulate online/offline status
      setIsOnline(Math.random() > 0.3)
      
      // Update last seen
      if (isOnline) {
        setLastSeen(new Date())
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isOnline, onStatusChange])

  // Simulate WebSocket connection
  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setIsConnected(true)
    }, 1000)

    return () => clearTimeout(connectTimeout)
  }, [])

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'active': return <UserCheck className="h-4 w-4" />
      case 'suspended': return <UserX className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Real-time Status</CardTitle>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-gray-400" />
            )}
            <Badge 
              variant="outline" 
              className={getStatusColor(status)}
            >
              {getStatusIcon(status)}
              <span className="ml-1">{status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Connection:</span>
            <span className={isOnline ? "text-green-600" : "text-gray-500"}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last seen:</span>
            <span className="text-muted-foreground">
              {lastSeen.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Real-time:</span>
            <span className={isConnected ? "text-green-600" : "text-gray-500"}>
              {isConnected ? "Connected" : "Connecting..."}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 