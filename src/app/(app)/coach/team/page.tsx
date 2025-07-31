'use client'

import { useSession } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  BookOpen, 
  Target, 
  MessageSquare,
  TrendingUp,
  Award,
  Clock,
  UserCheck,
  BarChart3,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export default function CoachTeamPage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the coach dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Coach Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your team's learning journey and track progress
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Team Settings
        </Button>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              Passed this quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coaching Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="learners">Learners</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Sarah Chen', action: 'completed AWS Cloud Practitioner module', time: '2 hours ago' },
                    { name: 'Marcus Thompson', action: 'achieved 95% on Python assessment', time: '4 hours ago' },
                    { name: 'Lisa Rodriguez', action: 'started Machine Learning path', time: '6 hours ago' },
                    { name: 'David Kim', action: 'earned DevOps certification', time: '1 day ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <UserCheck className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.name}</span>{' '}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Coaching Sessions</CardTitle>
                <CardDescription>Your scheduled 1-on-1s this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { learner: 'Sarah Chen', topic: 'AWS Architecture Review', time: 'Today, 2:00 PM' },
                    { learner: 'Marcus Thompson', topic: 'Career Path Discussion', time: 'Tomorrow, 10:00 AM' },
                    { learner: 'Lisa Rodriguez', topic: 'ML Project Guidance', time: 'Thursday, 3:00 PM' },
                    { learner: 'David Kim', topic: 'Certification Prep', time: 'Friday, 11:00 AM' }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{session.learner}</p>
                        <p className="text-xs text-muted-foreground">{session.topic}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{session.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Schedule New Session
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-24 flex flex-col gap-2">
              <Link href="/coach/team/profile">
                <Users className="h-5 w-5" />
                <span>Team Profile</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex flex-col gap-2">
              <Link href="/coach/team/courses">
                <BookOpen className="h-5 w-5" />
                <span>Manage Courses</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex flex-col gap-2">
              <Link href="/coach/team/tasks">
                <Target className="h-5 w-5" />
                <span>Assign Tasks</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex flex-col gap-2">
              <Link href="/coach/team/messages">
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
              </Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="learners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>All learners assigned to your coaching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Sarah Chen', role: 'Senior Developer', progress: 85, status: 'On Track' },
                  { name: 'Marcus Thompson', role: 'Full Stack Developer', progress: 72, status: 'On Track' },
                  { name: 'Lisa Rodriguez', role: 'Data Scientist', progress: 45, status: 'Needs Support' },
                  { name: 'David Kim', role: 'DevOps Engineer', progress: 90, status: 'Excelling' }
                ].map((learner, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{learner.name}</p>
                      <p className="text-sm text-muted-foreground">{learner.role}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{learner.progress}%</p>
                        <div className="w-32 bg-muted rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${learner.progress}%` }}
                          />
                        </div>
                      </div>
                      <Badge variant={
                        learner.status === 'Excelling' ? 'default' : 
                        learner.status === 'On Track' ? 'secondary' : 
                        'destructive'
                      }>
                        {learner.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Courses</CardTitle>
              <CardDescription>Courses your team is currently enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { course: 'AWS Solutions Architect', enrolled: 12, completed: 8, avgProgress: 75 },
                  { course: 'Python for Data Science', enrolled: 15, completed: 5, avgProgress: 60 },
                  { course: 'Kubernetes Fundamentals', enrolled: 8, completed: 6, avgProgress: 85 },
                  { course: 'Machine Learning Basics', enrolled: 10, completed: 2, avgProgress: 40 }
                ].map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{course.course}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.enrolled} enrolled • {course.completed} completed
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Avg: {course.avgProgress}%</p>
                        <div className="w-32 bg-muted rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${course.avgProgress}%` }}
                          />
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Analytics</CardTitle>
              <CardDescription>Track your team's learning outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Performance chart visualization</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}