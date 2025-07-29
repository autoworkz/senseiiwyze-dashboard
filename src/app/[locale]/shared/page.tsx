"use client"

import { useState as _useState } from 'react'
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowRight, Users, BarChart3, User } from "lucide-react"
import { getCurrentUser as _getCurrentUser } from "@/lib/auth"
import { getDefaultDashboardRoute } from "@/lib/navigation-config"

export default function LegacyDashboardPage() {
  const router = useRouter()

  // Mock user for demo purposes
  const user = { role: 'executive', name: 'Demo User' }

  const handleRedirect = (path: string) => {
    router.push(path)
  }

  const getRecommendedDashboard = () => {
    return getDefaultDashboardRoute(user.role)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Migration Notice</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            The legacy dashboard has been reorganized into role-specific dashboards for better user experience.
          </p>
          <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
            Legacy Dashboard - Deprecated
          </Badge>
        </div>

        {/* New Dashboard Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              New B2B2C Dashboard Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Executive Dashboard */}
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Executive
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Strategic oversight for C-suite leadership
                  </p>
                  <div className="space-y-1 text-xs">
                    <p>• Financial performance</p>
                    <p>• Strategic OKRs</p>
                    <p>• Risk management</p>
                    <p>• Board presentations</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleRedirect('/org')}
                  >
                    Go to Executive
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Team Dashboard */}
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Team management and coordination
                  </p>
                  <div className="space-y-1 text-xs">
                    <p>• User management</p>
                    <p>• Team analytics</p>
                    <p>• Curriculum oversight</p>
                    <p>• Intervention tasks</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleRedirect('/team')}
                  >
                    Go to Team
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Personal Dashboard */}
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Individual learning and development
                  </p>
                  <div className="space-y-1 text-xs">
                    <p>• Personal overview</p>
                    <p>• Goals & objectives</p>
                    <p>• Skill development</p>
                    <p>• Performance review</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleRedirect('/me')}
                  >
                    Go to Personal
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Migration Status */}
        <Card>
          <CardHeader>
            <CardTitle>Migration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">User Management (/dashboard/users → /team/users)</span>
                <Badge variant="secondary">✅ Migrated</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Analytics (/dashboard/analytics → Role-specific)</span>
                <Badge variant="outline">🚧 In Progress</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Program Readiness (/dashboard/program-readiness → /org/readiness)</span>
                <Badge variant="outline">⏳ Planned</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Skills Tracking (/dashboard/skills → /me/skills)</span>
                <Badge variant="outline">⏳ Planned</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Action */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Recommended for Your Role</h3>
            <p className="text-muted-foreground mb-4">
              Based on your role ({user.role}), we recommend using the Executive dashboard.
            </p>
            <Button
              size="lg"
              onClick={() => handleRedirect(getRecommendedDashboard())}
            >
              Go to Recommended Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}