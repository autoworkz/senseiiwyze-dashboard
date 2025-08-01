'use client'

import { useSession } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft,
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  Award,
  Plus,
  Search,
  Filter,
  Calendar,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react'
import Link from 'next/link'

export default function TeamCoursesPage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
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
            <CardDescription>Please log in to manage courses.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/coach/team" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Team Courses
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your team's learning paths
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Assign New Course
        </Button>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Across 24 learners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">
              Per active course
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              This quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Course Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Courses</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="library">Course Library</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {[
            {
              title: 'AWS Solutions Architect Professional',
              provider: 'AWS Training',
              enrolled: 12,
              completed: 8,
              avgProgress: 75,
              deadline: '2024-03-15',
              status: 'on-track',
              learners: [
                { name: 'Sarah Chen', progress: 85 },
                { name: 'Marcus Thompson', progress: 72 },
                { name: 'David Kim', progress: 90 },
              ]
            },
            {
              title: 'Kubernetes Security Specialist',
              provider: 'CNCF',
              enrolled: 8,
              completed: 3,
              avgProgress: 45,
              deadline: '2024-04-01',
              status: 'at-risk',
              learners: [
                { name: 'Lisa Rodriguez', progress: 35 },
                { name: 'Emily Watson', progress: 55 },
                { name: 'James Foster', progress: 45 },
              ]
            },
            {
              title: 'Python for Data Engineering',
              provider: 'DataCamp',
              enrolled: 15,
              completed: 10,
              avgProgress: 82,
              deadline: '2024-02-28',
              status: 'on-track',
              learners: [
                { name: 'Alex Kumar', progress: 88 },
                { name: 'Nina Patel', progress: 92 },
                { name: 'Chris Johnson', progress: 78 },
              ]
            }
          ].map((course, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.provider}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={course.status === 'on-track' ? 'default' : 'destructive'}>
                      {course.status === 'on-track' ? 'On Track' : 'At Risk'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Course Stats */}
                  <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                    <div>
                      <p className="text-sm text-muted-foreground">Enrolled</p>
                      <p className="text-lg font-semibold">{course.enrolled}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-lg font-semibold">{course.completed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Progress</p>
                      <p className="text-lg font-semibold">{course.avgProgress}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="text-lg font-semibold flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(course.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Overall Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">{course.avgProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full" 
                        style={{ width: `${course.avgProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Top Learners */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Top Learners</h4>
                    <div className="space-y-2">
                      {course.learners.map((learner, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm">{learner.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${learner.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-10 text-right">
                              {learner.progress}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Learners
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Target className="h-4 w-4 mr-2" />
                      Set Goals
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Completed courses will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Scheduled courses will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Google Cloud Architect', category: 'Cloud', duration: '40 hours', level: 'Advanced' },
              { title: 'DevOps Fundamentals', category: 'DevOps', duration: '20 hours', level: 'Beginner' },
              { title: 'Machine Learning Basics', category: 'AI/ML', duration: '30 hours', level: 'Intermediate' },
              { title: 'Terraform Associate', category: 'Infrastructure', duration: '25 hours', level: 'Intermediate' },
              { title: 'Security Best Practices', category: 'Security', duration: '15 hours', level: 'Beginner' },
              { title: 'React Advanced Patterns', category: 'Frontend', duration: '35 hours', level: 'Advanced' }
            ].map((course, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">{course.title}</CardTitle>
                  <CardDescription>{course.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{course.level}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                  </div>
                  <Button className="w-full" size="sm">
                    Assign to Team
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}