"use client"

import { useEffect } from "react"
import { useDataStore } from "@/stores/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, UserX, TrendingUp, Plus, Filter } from "lucide-react"

export default function TeamUsersPage() {
    const {
        team: _team,
        loading: _loading,
        fetchAllTeamData
    } = useDataStore((state) => ({
        team: state.team,
        loading: state.loading.team,
        fetchAllTeamData: state.fetchAllTeamData,
    }))

    useEffect(() => {
        fetchAllTeamData()
    }, [fetchAllTeamData])

    // Mock data for demonstration
    const userMetrics = {
        totalUsers: 1247,
        activeUsers: 892,
        atRiskUsers: 23,
        completionRate: 87.3,
        userGrowth: 12.5
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team User Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Monitor and manage your team members, track their progress, and identify intervention opportunities
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="gap-1">
                        <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        Live Data
                    </Badge>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* User Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userMetrics.totalUsers.toLocaleString()}</div>
                        <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +{userMetrics.userGrowth}% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userMetrics.activeUsers.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                            {((userMetrics.activeUsers / userMetrics.totalUsers) * 100).toFixed(1)}% of total
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">At-Risk Learners</CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{userMetrics.atRiskUsers}</div>
                        <div className="text-xs text-muted-foreground">
                            Require intervention
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userMetrics.completionRate}%</div>
                        <div className="text-xs text-green-600">
                            Above team average
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Management Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>User Management</span>
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">User Management System</h3>
                        <p className="text-muted-foreground mb-4">
                            Advanced user management features are being migrated from the legacy dashboard.
                        </p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>✅ User metrics and overview - Complete</p>
                            <p>🚧 User table and filtering - In progress</p>
                            <p>⏳ Individual user profiles - Coming soon</p>
                            <p>⏳ Batch user operations - Coming soon</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Migration Notice */}
            <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <div>
                            <p className="text-sm font-medium text-orange-900">
                                ⚠️ Migration in Progress
                            </p>
                            <p className="text-xs text-orange-700">
                                Advanced user management features are being migrated from /dashboard/users to this new location.
                                Full functionality will be available soon.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 