"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Activity, 
  Settings, 
  BarChart3, 
  Clock,
  ChevronLeft,
  Edit2,
  Save,
  X
} from "lucide-react"
import Link from "next/link"

interface UserDetails {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "user" | "guest"
  status: "active" | "inactive" | "suspended"
  department: string
  joinDate: string
  lastActive: string
  programReadiness: number
  completedModules: number
  totalModules: number
  activityHistory: Activity[]
  permissions: string[]
}

interface Activity {
  id: string
  action: string
  timestamp: string
  details?: string
}

// Mock data generator
const generateMockUser = (id: string): UserDetails => {
  const names = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Charlie Wilson"]
  const departments = ["Engineering", "Marketing", "Sales", "Support", "Operations"]
  const randomIndex = parseInt(id) % names.length

  return {
    id,
    name: names[randomIndex] || "User " + id,
    email: names[randomIndex]?.toLowerCase().replace(" ", ".") + "@example.com" || `user${id}@example.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    role: randomIndex === 0 ? "admin" : randomIndex === 4 ? "guest" : "user",
    status: randomIndex === 2 ? "inactive" : randomIndex === 4 ? "suspended" : "active",
    department: departments[randomIndex] || "General",
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    lastActive: randomIndex === 0 ? "2 hours ago" : randomIndex === 1 ? "5 minutes ago" : "3 days ago",
    programReadiness: Math.floor(Math.random() * 40) + 60,
    completedModules: Math.floor(Math.random() * 8) + 4,
    totalModules: 12,
    activityHistory: [
      { id: "1", action: "Completed Module 5", timestamp: "2 hours ago", details: "Advanced Features" },
      { id: "2", action: "Updated profile", timestamp: "1 day ago" },
      { id: "3", action: "Joined team meeting", timestamp: "3 days ago", details: "Q4 Planning" },
      { id: "4", action: "Submitted feedback", timestamp: "1 week ago" },
      { id: "5", action: "Started Module 4", timestamp: "2 weeks ago", details: "Core Concepts" }
    ],
    permissions: ["view_dashboard", "edit_profile", "view_reports", randomIndex === 0 ? "manage_users" : ""]
      .filter(Boolean)
  }
}

export default function UserDetailPage() {
  const params = useParams()
  const userId = params?.id as string
  
  const [user, setUser] = useState<UserDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<UserDetails>>({})

  useEffect(() => {
    if (!userId) return;
    
    // Simulate loading user data
    setTimeout(() => {
      const userData = generateMockUser(userId)
      setUser(userData)
      setEditedUser(userData)
      setIsLoading(false)
    }, 1000)
  }, [userId])
  
  if (!userId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Invalid User ID</h2>
          <p className="text-muted-foreground mt-2">No user ID provided.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/users/list">Back to Users</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (user) {
      setEditedUser(user)
    }
  }

  const handleSave = () => {
    // Simulate saving
    if (user && editedUser) {
      setUser({ ...user, ...editedUser })
      setIsEditing(false)
    }
  }

  const getStatusBadge = (status: UserDetails["status"]) => {
    const variants: Record<UserDetails["status"], "default" | "secondary" | "destructive"> = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive"
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const getRoleBadge = (role: UserDetails["role"]) => {
    const variants: Record<UserDetails["role"], "default" | "secondary" | "outline"> = {
      admin: "default",
      user: "secondary",
      guest: "outline"
    }
    return <Badge variant={variants[role]}>{role}</Badge>
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">User not found</h2>
          <p className="text-muted-foreground mt-2">The user with ID {userId} does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/users/list">Back to Users</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/users/list">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        <p className="text-muted-foreground">
          View and manage user information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile</CardTitle>
              {!isEditing ? (
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {!isEditing ? (
                <>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </>
              ) : (
                <div className="w-full space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2 mt-2">
                {getStatusBadge(user.status)}
                {getRoleBadge(user.role)}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Department:</span>
                {!isEditing ? (
                  <span className="font-medium">{user.department}</span>
                ) : (
                  <Select
                    value={editedUser.department}
                    onValueChange={(value) => setEditedUser({ ...editedUser, department: value })}
                  >
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined:</span>
                <span className="font-medium">{user.joinDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last Active:</span>
                <span className="font-medium">{user.lastActive}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Program Readiness</span>
                <span className="text-sm text-muted-foreground">{user.programReadiness}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${user.programReadiness}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {user.completedModules} of {user.totalModules} modules completed
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    User actions and engagement history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.activityHistory.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 last:pb-0 last:border-0 border-b">
                        <div className="rounded-full bg-secondary p-2">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          {activity.details && (
                            <p className="text-sm text-muted-foreground">{activity.details}</p>
                          )}
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Permissions</CardTitle>
                  <CardDescription>
                    Manage user access and capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="role">User Role</Label>
                      <Select value={user.role} disabled={!isEditing}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="guest">Guest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Active Permissions</Label>
                      <div className="flex flex-wrap gap-2">
                        {user.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary">
                            {permission.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage user account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Account Status</p>
                        <p className="text-sm text-muted-foreground">
                          Control user access to the platform
                        </p>
                      </div>
                      <Select value={user.status} disabled={!isEditing}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="mr-2 h-4 w-4" />
                        Send Password Reset
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Export User Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-destructive">
                        <User className="mr-2 h-4 w-4" />
                        Delete User Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}