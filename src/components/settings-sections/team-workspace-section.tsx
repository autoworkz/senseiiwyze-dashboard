"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Building2,
  UserPlus,
  Crown,
  Shield,
  User,
  MoreHorizontal,
  Settings,
  FolderOpen,
  Plus,
} from "lucide-react"

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@company.com",
    role: "Owner",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@company.com",
    role: "Admin",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@company.com",
    role: "Member",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "pending",
  },
]

const workspaces = [
  {
    id: 1,
    name: "Marketing Team",
    description: "Marketing campaigns and content creation",
    members: 8,
    projects: 12,
    plan: "Pro",
    isActive: true,
  },
  {
    id: 2,
    name: "Development",
    description: "Software development and engineering",
    members: 15,
    projects: 24,
    plan: "Enterprise",
    isActive: true,
  },
  {
    id: 3,
    name: "Design System",
    description: "UI/UX design and brand guidelines",
    members: 5,
    projects: 8,
    plan: "Pro",
    isActive: false,
  },
]

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Owner":
      return <Crown className="h-3 w-3" />
    case "Admin":
      return <Shield className="h-3 w-3" />
    default:
      return <User className="h-3 w-3" />
  }
}

export function TeamWorkspaceSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Teams & Workspaces</h1>
        <p className="text-muted-foreground">Manage your team members, roles, and workspace organization</p>
      </div>

      <Tabs defaultValue="teams" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Management
          </TabsTrigger>
          <TabsTrigger value="workspaces" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Workspaces
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Team Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Team Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">3</div>
                  <div className="text-xs text-muted-foreground">Active Members</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">1</div>
                  <div className="text-xs text-muted-foreground">Pending Invites</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">10</div>
                  <div className="text-xs text-muted-foreground">Member Limit</div>
                </div>
              </CardContent>
            </Card>

            {/* Invite Members */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserPlus className="h-4 w-4" />
                  Invite Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email" className="text-sm">
                      Email Address
                    </Label>
                    <Input id="invite-email" type="email" placeholder="colleague@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-role" className="text-sm">
                      Role
                    </Label>
                    <Select defaultValue="member">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">Send Invite</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Members</CardTitle>
              <CardDescription>Manage existing team members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-foreground">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant={member.status === "active" ? "secondary" : "outline"} className="text-xs">
                        {member.status}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        {getRoleIcon(member.role)}
                        {member.role}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspaces" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Workspace */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Plus className="h-4 w-4" />
                  Create New Workspace
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name" className="text-sm">
                    Workspace Name
                  </Label>
                  <Input id="workspace-name" placeholder="e.g., Marketing Team" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workspace-description" className="text-sm">
                    Description
                  </Label>
                  <Input id="workspace-description" placeholder="Brief description" />
                </div>
                <Button className="w-full">Create Workspace</Button>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Usage & Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">3</div>
                  <div className="text-xs text-muted-foreground">Active Workspaces</div>
                  <div className="text-xs text-muted-foreground">5 workspace limit</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">28</div>
                  <div className="text-xs text-muted-foreground">Total Members</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">44</div>
                  <div className="text-xs text-muted-foreground">Total Projects</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Existing Workspaces */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4" />
                Your Workspaces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground">{workspace.name}</h3>
                          <Badge variant={workspace.isActive ? "secondary" : "outline"} className="text-xs">
                            {workspace.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {workspace.plan}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{workspace.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {workspace.members} members
                          </div>
                          <div className="flex items-center gap-1">
                            <FolderOpen className="h-3 w-3" />
                            {workspace.projects} projects
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Settings
                        </Button>
                        <Button size="sm">Open</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
