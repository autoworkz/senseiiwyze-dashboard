'use client'

import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreHorizontal,
  TrendingUp,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Star,
  Target,
  BookOpen,
  Mail,
  Phone,
  Calendar,
  Activity,
  Settings
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'learner' | 'coach' | 'admin' | 'manager'
  avatar?: string
  department: string
  joinedDate: string
  lastActive: string
  readinessScore: number
  coursesCompleted: number
  coursesInProgress: number
  certifications: number
  status: 'active' | 'inactive' | 'at-risk' | 'excelling'
  coachId?: string
  coachName?: string
  learningPath: string
  progressPercentage: number
}

interface TeamStats {
  totalMembers: number
  activeMembers: number
  atRiskMembers: number
  avgReadinessScore: number
  avgProgressPercentage: number
  totalCertifications: number
  monthlyCompletions: number
}

export default function TeamManagementPage() {
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    if (session?.user) {
      setUser({
        role: (session.user.role as User['role']) || 'learner',
        name: session.user.name,
        email: session.user.email
      })
    }
  }, [session])

  // Mock team data
  useEffect(() => {
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice.johnson@company.com',
        role: 'learner',
        department: 'Engineering',
        joinedDate: '2024-01-15',
        lastActive: '2 hours ago',
        readinessScore: 85,
        coursesCompleted: 12,
        coursesInProgress: 3,
        certifications: 4,
        status: 'excelling',
        coachId: 'coach-1',
        coachName: 'Sarah Chen',
        learningPath: 'Full-Stack Development',
        progressPercentage: 78
      },
      {
        id: '2',
        name: 'Marcus Thompson',
        email: 'marcus.thompson@company.com',
        role: 'learner',
        department: 'Product',
        joinedDate: '2024-02-20',
        lastActive: '1 day ago',
        readinessScore: 42,
        coursesCompleted: 3,
        coursesInProgress: 2,
        certifications: 1,
        status: 'at-risk',
        coachId: 'coach-2',
        coachName: 'David Wilson',
        learningPath: 'Data Analytics',
        progressPercentage: 23
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        role: 'learner',
        department: 'Marketing',
        joinedDate: '2023-11-10',
        lastActive: '3 hours ago',
        readinessScore: 72,
        coursesCompleted: 8,
        coursesInProgress: 4,
        certifications: 3,
        status: 'active',
        coachId: 'coach-1',
        coachName: 'Sarah Chen',
        learningPath: 'Digital Marketing Analytics',
        progressPercentage: 65
      },
      {
        id: '4',
        name: 'James Park',
        email: 'james.park@company.com',
        role: 'coach',
        department: 'Learning & Development',
        joinedDate: '2023-08-01',
        lastActive: '30 minutes ago',
        readinessScore: 95,
        coursesCompleted: 25,
        coursesInProgress: 1,
        certifications: 8,
        status: 'active',
        learningPath: 'Leadership & Coaching',
        progressPercentage: 92
      },
      {
        id: '5',
        name: 'Lisa Wang',
        email: 'lisa.wang@company.com',
        role: 'learner',
        department: 'Engineering',
        joinedDate: '2024-03-05',
        lastActive: '5 days ago',
        readinessScore: 38,
        coursesCompleted: 1,
        coursesInProgress: 1,
        certifications: 0,
        status: 'inactive',
        coachId: 'coach-2',
        coachName: 'David Wilson',
        learningPath: 'DevOps Fundamentals',
        progressPercentage: 15
      }
    ]

    const mockStats: TeamStats = {
      totalMembers: mockTeamMembers.length,
      activeMembers: mockTeamMembers.filter(m => m.status === 'active' || m.status === 'excelling').length,
      atRiskMembers: mockTeamMembers.filter(m => m.status === 'at-risk' || m.status === 'inactive').length,
      avgReadinessScore: Math.round(mockTeamMembers.reduce((sum, m) => sum + m.readinessScore, 0) / mockTeamMembers.length),
      avgProgressPercentage: Math.round(mockTeamMembers.reduce((sum, m) => sum + m.progressPercentage, 0) / mockTeamMembers.length),
      totalCertifications: mockTeamMembers.reduce((sum, m) => sum + m.certifications, 0),
      monthlyCompletions: mockTeamMembers.reduce((sum, m) => sum + m.coursesCompleted, 0)
    }

    setTeamMembers(mockTeamMembers)
    setTeamStats(mockStats)
  }, [])

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'excelling': return 'default' as const
      case 'active': return 'secondary' as const
      case 'at-risk': return 'destructive' as const
      case 'inactive': return 'outline' as const
      default: return 'outline' as const
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excelling': return <Star className="h-3 w-3" />
      case 'active': return <CheckCircle className="h-3 w-3" />
      case 'at-risk': return <AlertTriangle className="h-3 w-3" />
      case 'inactive': return <Clock className="h-3 w-3" />
      default: return <Activity className="h-3 w-3" />
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <div className="w-64 border-r bg-card">
            <div className="p-6 border-b">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          <div className="flex-1 p-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access team management.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need to be authenticated to manage your team.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <GlobalNavigation user={user} variant="sidebar" />
        
        <div className="flex-1">
          <main className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Team Management
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Oversee your team's learning progress and performance
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Team Settings
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            {teamStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{teamStats.totalMembers}</div>
                    <p className="text-xs text-muted-foreground">
                      +2 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{teamStats.activeMembers}</div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((teamStats.activeMembers / teamStats.totalMembers) * 100)}% engagement rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Readiness</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{teamStats.avgReadinessScore}</div>
                    <p className="text-xs text-muted-foreground">
                      +5 points this month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{teamStats.totalCertifications}</div>
                    <p className="text-xs text-muted-foreground">
                      +3 this month
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* At-Risk Alert */}
            {teamStats && teamStats.atRiskMembers > 0 && (
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{teamStats.atRiskMembers} team members</strong> need immediate attention. 
                  Consider scheduling coaching sessions or adjusting their learning paths.
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Team Members</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="coaches">Coaches</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Progress Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Team Progress Overview
                      </CardTitle>
                      <CardDescription>Average progress across all learning paths</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Overall Progress</span>
                            <span>{teamStats?.avgProgressPercentage}%</span>
                          </div>
                          <Progress value={teamStats?.avgProgressPercentage} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{teamStats?.activeMembers}</div>
                            <div className="text-muted-foreground">On Track</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">{teamStats?.atRiskMembers}</div>
                            <div className="text-muted-foreground">At Risk</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Recent Achievements
                      </CardTitle>
                      <CardDescription>Latest completions and certifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>AJ</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Alice Johnson</div>
                            <div className="text-xs text-muted-foreground">Completed React Advanced Patterns</div>
                          </div>
                          <Badge variant="default" className="text-xs">
                            Certificate
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>ER</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Emily Rodriguez</div>
                            <div className="text-xs text-muted-foreground">Finished Google Analytics 4</div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Course
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>JP</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium">James Park</div>
                            <div className="text-xs text-muted-foreground">Earned Coaching Excellence Badge</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Badge
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                {/* Search and Filters */}
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search team members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="learner">Learner</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="excelling">Excelling</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Team Members List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members ({filteredMembers.length})</CardTitle>
                    <CardDescription>
                      Manage your team members and track their progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredMembers.map((member) => (
                        <div key={member.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-foreground">{member.name}</h4>
                                  <Badge variant={getStatusBadgeVariant(member.status)} className="text-xs">
                                    {getStatusIcon(member.status)}
                                    {member.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                  <span>{member.department}</span>
                                  <span>•</span>
                                  <span>Last active: {member.lastActive}</span>
                                  {member.coachName && (
                                    <>
                                      <span>•</span>
                                      <span>Coach: {member.coachName}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <div className="text-lg font-bold text-primary">{member.readinessScore}</div>
                                <div className="text-xs text-muted-foreground">Readiness</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold">{member.coursesCompleted}</div>
                                <div className="text-xs text-muted-foreground">Completed</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold">{member.certifications}</div>
                                <div className="text-xs text-muted-foreground">Certificates</div>
                              </div>
                              <div className="w-32">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span>{member.progressPercentage}%</span>
                                </div>
                                <Progress value={member.progressPercentage} className="h-2" />
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Check-in
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    View Learning Path
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Manage Member
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <div className="mt-3 text-sm">
                            <span className="text-muted-foreground">Learning Path: </span>
                            <span className="font-medium">{member.learningPath}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Distribution</CardTitle>
                      <CardDescription>Team readiness score distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">High Performers (80+)</span>
                          <span className="text-sm font-medium">
                            {teamMembers.filter(m => m.readinessScore >= 80).length} members
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Good Progress (60-79)</span>
                          <span className="text-sm font-medium">
                            {teamMembers.filter(m => m.readinessScore >= 60 && m.readinessScore < 80).length} members
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Needs Support (40-59)</span>
                          <span className="text-sm font-medium">
                            {teamMembers.filter(m => m.readinessScore >= 40 && m.readinessScore < 60).length} members
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-destructive">At Risk (&lt; 40)</span>
                          <span className="text-sm font-medium text-destructive">
                            {teamMembers.filter(m => m.readinessScore < 40).length} members
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Department Breakdown</CardTitle>
                      <CardDescription>Team members by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['Engineering', 'Product', 'Marketing', 'Learning & Development'].map((dept) => {
                          const deptMembers = teamMembers.filter(m => m.department === dept)
                          const avgScore = deptMembers.length > 0 
                            ? Math.round(deptMembers.reduce((sum, m) => sum + m.readinessScore, 0) / deptMembers.length)
                            : 0
                          
                          return (
                            <div key={dept} className="flex justify-between items-center">
                              <div>
                                <span className="text-sm font-medium">{dept}</span>
                                <div className="text-xs text-muted-foreground">
                                  Avg Score: {avgScore}
                                </div>
                              </div>
                              <span className="text-sm">{deptMembers.length} members</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="coaches" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Coach Overview</CardTitle>
                    <CardDescription>Performance and capacity of your coaching team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamMembers.filter(m => m.role === 'coach').map((coach) => {
                        const assignedLearners = teamMembers.filter(m => m.coachId === coach.id)
                        const avgScore = assignedLearners.length > 0
                          ? Math.round(assignedLearners.reduce((sum, m) => sum + m.readinessScore, 0) / assignedLearners.length)
                          : 0

                        return (
                          <div key={coach.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {coach.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{coach.name}</h4>
                                  <p className="text-sm text-muted-foreground">{coach.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 text-center">
                                <div>
                                  <div className="text-lg font-bold">{assignedLearners.length}</div>
                                  <div className="text-xs text-muted-foreground">Learners</div>
                                </div>
                                <div>
                                  <div className="text-lg font-bold">{avgScore}</div>
                                  <div className="text-xs text-muted-foreground">Avg Score</div>
                                </div>
                                <div>
                                  <div className="text-lg font-bold">{coach.certifications}</div>
                                  <div className="text-xs text-muted-foreground">Certificates</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}