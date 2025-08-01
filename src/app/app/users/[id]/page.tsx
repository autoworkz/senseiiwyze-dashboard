'use client'

import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Clock,
  Edit,
  Settings,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  readinessScore: number
  lastActive: string
  avatar?: string
  phone?: string
  location?: string
  joinDate: string
  completedCourses: number
  totalCourses: number
  currentLearningPath?: string
  skillAreas: string[]
}

interface CurrentUser {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

// Mock users data (same as in users page)
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'admin',
    status: 'active',
    readinessScore: 92,
    lastActive: '2 hours ago',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: '2023-01-15',
    completedCourses: 12,
    totalCourses: 15,
    currentLearningPath: 'AI/ML Engineering',
    skillAreas: ['Machine Learning', 'Python', 'Data Science', 'Leadership']
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    email: 'marcus.thompson@company.com',
    role: 'learner',
    status: 'active',
    readinessScore: 78,
    lastActive: '1 day ago',
    phone: '+1 (555) 234-5678',
    location: 'Austin, TX',
    joinDate: '2023-03-22',
    completedCourses: 8,
    totalCourses: 12,
    currentLearningPath: 'Full Stack Development',
    skillAreas: ['React', 'Node.js', 'TypeScript', 'Database Design']
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@company.com',
    role: 'executive',
    status: 'active',
    readinessScore: 85,
    lastActive: '3 hours ago',
    phone: '+1 (555) 345-6789',
    location: 'New York, NY',
    joinDate: '2022-11-08',
    completedCourses: 15,
    totalCourses: 18,
    currentLearningPath: 'Strategic Leadership',
    skillAreas: ['Leadership', 'Strategy', 'Communication', 'Team Management']
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'worker',
    status: 'inactive',
    readinessScore: 45,
    lastActive: '1 week ago',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA',
    joinDate: '2023-06-10',
    completedCourses: 3,
    totalCourses: 10,
    currentLearningPath: 'DevOps Fundamentals',
    skillAreas: ['Docker', 'AWS', 'CI/CD']
  },
  {
    id: '5',
    name: 'Emily Johnson',
    email: 'emily.johnson@company.com',
    role: 'learner',
    status: 'pending',
    readinessScore: 0,
    lastActive: 'Never',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, IL',
    joinDate: '2024-01-20',
    completedCourses: 0,
    totalCourses: 8,
    currentLearningPath: 'Frontend Development',
    skillAreas: ['HTML', 'CSS', 'JavaScript']
  },
  {
    id: '6',
    name: 'Alex Rivera',
    email: 'alex.rivera@company.com',
    role: 'frontliner',
    status: 'active',
    readinessScore: 67,
    lastActive: '5 minutes ago',
    phone: '+1 (555) 678-9012',
    location: 'Miami, FL',
    joinDate: '2023-08-14',
    completedCourses: 6,
    totalCourses: 9,
    currentLearningPath: 'Customer Success',
    skillAreas: ['Communication', 'CRM', 'Problem Solving', 'Sales']
  }
]

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.id as string
  const { data: session, isPending } = useSession()
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [user, setUser] = useState<User | null>(null)

  // Helper function to get user initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Get status badge variant
  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
      case 'inactive':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  // Get readiness score color
  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600' 
    return 'text-red-600'
  }

  useEffect(() => {
    if (session?.user) {
      setCurrentUser({
        role: (session.user.role as CurrentUser['role']) || 'learner',
        name: session.user.name,
        email: session.user.email
      })
    }
  }, [session])

  useEffect(() => {
    // Find user by ID from mock data
    const foundUser = mockUsers.find(u => u.id === userId)
    setUser(foundUser || null)
  }, [userId])

  if (isPending) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view user profiles.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/app/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>User Not Found</CardTitle>
            <CardDescription>The user with ID "{userId}" could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/app/users">Return to Users List</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completionPercentage = Math.round((user.completedCourses / user.totalCourses) * 100)

  return (
    <div className="p-8">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/app/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">User Profile</h1>
            <p className="text-muted-foreground mt-2">
              Detailed view of {user.name}'s learning journey and progress
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getReadinessColor(user.readinessScore)}`}>
                    {user.readinessScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">Readiness Score</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{user.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Progress
              </CardTitle>
              <CardDescription>Current learning path and course completion status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Learning Path */}
              {user.currentLearningPath && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Current Learning Path</h4>
                    <Badge variant="outline">{user.currentLearningPath}</Badge>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.completedCourses} of {user.totalCourses} courses completed ({completionPercentage}%)
                  </p>
                </div>
              )}

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-2xl font-bold">{user.completedCourses}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-2xl font-bold">{user.totalCourses - user.completedCourses}</p>
                        <p className="text-xs text-muted-foreground">In Progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-2xl font-bold">{user.readinessScore}</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p className="font-medium">{user.lastActive}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(user.status)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>Areas of focus and competency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skillAreas.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Manage Access
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Assign Course
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}