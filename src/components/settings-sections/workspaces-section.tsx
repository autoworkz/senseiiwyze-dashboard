"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Settings, Users, FolderOpen } from "lucide-react"

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

export function WorkspacesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Workspaces</h1>
        <p className="text-muted-foreground">Organize your teams and projects into separate workspaces</p>
      </div>

      {/* Create Workspace */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Workspace
          </CardTitle>
          <CardDescription>Set up a new workspace for your team or project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input id="workspace-name" placeholder="e.g., Marketing Team" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-description">Description</Label>
              <Input id="workspace-description" placeholder="Brief description of the workspace" />
            </div>
          </div>
          <div className="mt-4">
            <Button>Create Workspace</Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Workspaces */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Your Workspaces
          </CardTitle>
          <CardDescription>Manage your existing workspaces</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="border border-border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{workspace.name}</h3>
                      <Badge variant={workspace.isActive ? "secondary" : "outline"}>
                        {workspace.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{workspace.plan}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{workspace.description}</p>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {workspace.members} members
                      </div>
                      <div className="flex items-center gap-1">
                        <FolderOpen className="h-4 w-4" />
                        {workspace.projects} projects
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button size="sm">Open Workspace</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workspace Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Usage & Limits</CardTitle>
          <CardDescription>Current usage across all workspaces</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">3</div>
              <div className="text-sm text-muted-foreground">Active Workspaces</div>
              <div className="text-xs text-muted-foreground mt-1">5 workspace limit</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">28</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
              <div className="text-xs text-muted-foreground mt-1">Across all workspaces</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">44</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
              <div className="text-xs text-muted-foreground mt-1">Unlimited on Pro+</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
