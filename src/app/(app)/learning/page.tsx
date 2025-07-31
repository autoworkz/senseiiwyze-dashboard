'use client'

import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Play,
  Clock,
  Users,
  Trophy,
  Star,
  ChevronRight,
  Filter,
  Search,
  Plus,
  Target,
  Zap,
  Award,
  TrendingUp,
  CheckCircle,
  Lock,
  PlayCircle,
  FileText,
  Video,
  Code,
  MessageSquare
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
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

interface LearningModule {
  id: string
  title: string
  type: 'video' | 'article' | 'quiz' | 'project' | 'discussion'
  duration: number // in minutes
  completed: boolean
  locked: boolean
  description: string
}

interface LearningPath {
  id: string
  title: string
  description: string
  category: 'technical' | 'leadership' | 'business' | 'design'
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string // e.g., "4-6 weeks"
  modules: LearningModule[]
  enrolled: boolean
  progress: number // percentage
  rating: number
  reviewCount: number
  instructor: string
  skills: string[]
  prerequisites: string[]
  outcomes: string[]
  recommendedFor: string[]
  estimatedHours: number
  enrolledCount: number
  completionRate: number
}

interface PathStats {
  totalPaths: number
  enrolledPaths: number
  completedPaths: number
  totalHoursCompleted: number
  avgCompletionRate: number
  skillsLearned: number
}

export default function LearningPathsPage() {
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [pathStats, setPathStats] = useState<PathStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterLevel, setFilterLevel] = useState<string>('all')
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

  // Mock learning paths data
  useEffect(() => {
    const mockLearningPaths: LearningPath[] = [
      {
        id: '1',
        title: 'Full-Stack JavaScript Development',
        description: 'Master modern web development with React, Node.js, and cloud deployment. Build real-world applications from frontend to backend.',
        category: 'technical',
        level: 'intermediate',
        duration: '8-10 weeks',
        enrolled: true,
        progress: 65,
        rating: 4.8,
        reviewCount: 247,
        instructor: 'Sarah Chen',
        skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript'],
        prerequisites: ['Basic JavaScript', 'HTML/CSS fundamentals'],
        outcomes: ['Build full-stack applications', 'Deploy to cloud platforms', 'Modern development workflows'],
        recommendedFor: ['Frontend developers', 'Backend developers', 'Career changers'],
        estimatedHours: 120,
        enrolledCount: 1250,
        completionRate: 78,
        modules: [
          {
            id: 'm1',
            title: 'Modern JavaScript Fundamentals',
            type: 'video',
            duration: 45,
            completed: true,
            locked: false,
            description: 'ES6+ features, async/await, modules'
          },
          {
            id: 'm2',
            title: 'React Foundations',
            type: 'video',
            duration: 60,
            completed: true,
            locked: false,
            description: 'Components, hooks, state management'
          },
          {
            id: 'm3',
            title: 'Portfolio Project: Task Manager',
            type: 'project',
            duration: 180,
            completed: false,
            locked: false,
            description: 'Build a complete React application'
          },
          {
            id: 'm4',
            title: 'Node.js Backend Development',
            type: 'video',
            duration: 90,
            completed: false,
            locked: true,
            description: 'REST APIs, database integration'
          }
        ]
      },
      {
        id: '2',
        title: 'Data Science with Python',
        description: 'Learn data analysis, machine learning, and visualization with Python. Perfect for beginners entering the data field.',
        category: 'technical',
        level: 'beginner',
        duration: '6-8 weeks',
        enrolled: true,
        progress: 25,
        rating: 4.6,
        reviewCount: 189,
        instructor: 'Dr. Michael Park',
        skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn'],
        prerequisites: ['Basic programming concepts'],
        outcomes: ['Analyze real datasets', 'Build ML models', 'Create visualizations'],
        recommendedFor: ['Analysts', 'Students', 'Career changers'],
        estimatedHours: 80,
        enrolledCount: 890,
        completionRate: 82,
        modules: [
          {
            id: 'm5',
            title: 'Python Programming Basics',
            type: 'video',
            duration: 40,
            completed: true,
            locked: false,
            description: 'Variables, functions, control structures'
          },
          {
            id: 'm6',
            title: 'Data Manipulation with Pandas',
            type: 'video',
            duration: 55,
            completed: false,
            locked: false,
            description: 'DataFrames, cleaning, transformation'
          }
        ]
      },
      {
        id: '3',
        title: 'Digital Marketing Analytics',
        description: 'Master Google Analytics, data-driven marketing strategies, and ROI optimization for modern digital campaigns.',
        category: 'business',
        level: 'intermediate',
        duration: '4-5 weeks',
        enrolled: false,
        progress: 0,
        rating: 4.7,
        reviewCount: 156,
        instructor: 'Emily Rodriguez',
        skills: ['Google Analytics', 'SEO', 'PPC', 'Social Media Analytics', 'Conversion Optimization'],
        prerequisites: ['Basic marketing knowledge'],
        outcomes: ['Optimize marketing campaigns', 'Measure ROI effectively', 'Data-driven decisions'],
        recommendedFor: ['Marketers', 'Business analysts', 'Entrepreneurs'],
        estimatedHours: 60,
        enrolledCount: 445,
        completionRate: 85,
        modules: []
      },
      {
        id: '4',
        title: 'Leadership in Tech Organizations',
        description: 'Develop essential leadership skills for managing technical teams, driving innovation, and scaling engineering organizations.',
        category: 'leadership',
        level: 'advanced',
        duration: '6-7 weeks',
        enrolled: false,
        progress: 0,
        rating: 4.9,
        reviewCount: 98,
        instructor: 'James Wilson',
        skills: ['Team Leadership', 'Technical Strategy', 'Communication', 'Project Management', 'Mentoring'],
        prerequisites: ['3+ years tech experience', 'Team lead experience helpful'],
        outcomes: ['Lead technical teams', 'Drive strategic initiatives', 'Develop talent'],
        recommendedFor: ['Senior engineers', 'Team leads', 'Aspiring CTOs'],
        estimatedHours: 90,
        enrolledCount: 234,
        completionRate: 91,
        modules: []
      },
      {
        id: '5',
        title: 'UX/UI Design Fundamentals',
        description: 'Learn user-centered design principles, prototyping, and modern design tools to create exceptional user experiences.',
        category: 'design',
        level: 'beginner',
        duration: '5-6 weeks',
        enrolled: true,
        progress: 100,
        rating: 4.5,
        reviewCount: 203,
        instructor: 'Lisa Wang',
        skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing'],
        prerequisites: ['Creative interest', 'Basic computer skills'],
        outcomes: ['Design user interfaces', 'Conduct user research', 'Create design systems'],
        recommendedFor: ['Designers', 'Product managers', 'Developers'],
        estimatedHours: 75,
        enrolledCount: 567,
        completionRate: 76,
        modules: []
      }
    ]

    const mockStats: PathStats = {
      totalPaths: mockLearningPaths.length,
      enrolledPaths: mockLearningPaths.filter(p => p.enrolled).length,
      completedPaths: mockLearningPaths.filter(p => p.progress === 100).length,
      totalHoursCompleted: 195, // Mock hours
      avgCompletionRate: Math.round(mockLearningPaths.reduce((sum, p) => sum + p.completionRate, 0) / mockLearningPaths.length),
      skillsLearned: 18 // Mock count
    }

    setLearningPaths(mockLearningPaths)
    setPathStats(mockStats)
  }, [])

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = filterCategory === 'all' || path.category === filterCategory
    const matchesLevel = filterLevel === 'all' || path.level === filterLevel
    
    let matchesStatus = true
    if (filterStatus === 'enrolled') matchesStatus = path.enrolled
    else if (filterStatus === 'completed') matchesStatus = path.progress === 100
    else if (filterStatus === 'available') matchesStatus = !path.enrolled

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Code className="h-4 w-4" />
      case 'leadership': return <Users className="h-4 w-4" />
      case 'business': return <TrendingUp className="h-4 w-4" />
      case 'design': return <Star className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'text-blue-500'
      case 'leadership': return 'text-purple-500'
      case 'business': return 'text-green-500'
      case 'design': return 'text-pink-500'
      default: return 'text-gray-500'
    }
  }

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'beginner': return 'secondary' as const
      case 'intermediate': return 'default' as const
      case 'advanced': return 'destructive' as const
      default: return 'outline' as const
    }
  }

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'article': return <FileText className="h-4 w-4" />
      case 'quiz': return <Target className="h-4 w-4" />
      case 'project': return <Code className="h-4 w-4" />
      case 'discussion': return <MessageSquare className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
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
            <CardDescription>Please log in to access learning paths.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need to be authenticated to view your learning journey.
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
                    Learning Paths
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Structured learning journeys tailored to your career goals
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Path
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            {pathStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Paths</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pathStats.totalPaths}</div>
                    <p className="text-xs text-muted-foreground">
                      Available learning paths
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pathStats.enrolledPaths}</div>
                    <p className="text-xs text-muted-foreground">
                      Currently active paths
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pathStats.completedPaths}</div>
                    <p className="text-xs text-muted-foreground">
                      Successfully finished
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hours Completed</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pathStats.totalHoursCompleted}</div>
                    <p className="text-xs text-muted-foreground">
                      Total learning time
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Readiness Alert */}
            <Alert className="mb-6">
              <Zap className="h-4 w-4" />
              <AlertDescription>
                Based on your <strong>Readiness Index</strong>, we recommend starting with 
                <strong> Full-Stack JavaScript Development</strong> for optimal success probability (87%).
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="all-paths" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all-paths">All Paths</TabsTrigger>
                <TabsTrigger value="my-paths">My Learning</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all-paths" className="space-y-6">
                {/* Search and Filters */}
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search learning paths, skills, or topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Paths</SelectItem>
                      <SelectItem value="enrolled">Enrolled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Learning Paths Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPaths.map((path) => (
                    <Card key={path.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={getCategoryColor(path.category)}>
                                {getCategoryIcon(path.category)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {path.category}
                              </Badge>
                              <Badge variant={getLevelBadgeVariant(path.level)} className="text-xs">
                                {path.level}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg leading-tight mb-2">
                              {path.title}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {path.description}
                            </CardDescription>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{path.rating}</span>
                              <span>({path.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Progress for enrolled paths */}
                          {path.enrolled && (
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Progress</span>
                                <span>{path.progress}%</span>
                              </div>
                              <Progress value={path.progress} className="h-2" />
                            </div>
                          )}

                          {/* Skills */}
                          <div>
                            <div className="text-sm font-medium mb-2">Skills you'll learn:</div>
                            <div className="flex flex-wrap gap-1">
                              {path.skills.slice(0, 4).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {path.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{path.skills.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Path Details */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {path.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {path.enrolledCount}
                              </span>
                              <span>{path.completionRate}% completion rate</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="pt-2">
                            {path.enrolled ? (
                              path.progress === 100 ? (
                                <Button variant="outline" className="w-full">
                                  <Trophy className="h-4 w-4 mr-2" />
                                  Completed
                                </Button>
                              ) : (
                                <Button className="w-full">
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Continue Learning
                                </Button>
                              )
                            ) : (
                              <Button variant="outline" className="w-full">
                                <Play className="h-4 w-4 mr-2" />
                                Enroll Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="my-paths" className="space-y-6">
                {/* Current Learning Paths */}
                <div className="space-y-6">
                  {learningPaths.filter(p => p.enrolled).map((path) => (
                    <Card key={path.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {path.title}
                              <Badge variant={getLevelBadgeVariant(path.level)} className="text-xs">
                                {path.level}
                              </Badge>
                            </CardTitle>
                            <CardDescription>{path.description}</CardDescription>
                          </div>
                          <Button>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Overall Progress */}
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Overall Progress</span>
                              <span>{path.progress}%</span>
                            </div>
                            <Progress value={path.progress} className="h-2" />
                          </div>

                          {/* Module Progress */}
                          {path.modules.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-3">Modules ({path.modules.length})</div>
                              <div className="space-y-2">
                                {path.modules.map((module, index) => (
                                  <div key={module.id} className="flex items-center gap-3 p-2 border rounded">
                                    <div className="flex items-center gap-2">
                                      {module.completed ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      ) : module.locked ? (
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <PlayCircle className="h-4 w-4 text-primary" />
                                      )}
                                      <span className={`text-sm ${getCategoryColor(path.category)}`}>
                                        {getModuleIcon(module.type)}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">{module.title}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {module.description} • {module.duration} min
                                      </div>
                                    </div>
                                    {!module.locked && !module.completed && (
                                      <Button size="sm" variant="ghost">
                                        Start
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recommended" className="space-y-6">
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    These paths are recommended based on your Readiness Index, career goals, and skill gaps.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {learningPaths.filter(p => !p.enrolled && (p.level === 'intermediate' || p.category === 'technical')).map((path) => (
                    <Card key={path.id} className="border-primary/20 bg-primary/5">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="default" className="text-xs">
                                Recommended
                              </Badge>
                              <Badge variant={getLevelBadgeVariant(path.level)} className="text-xs">
                                {path.level}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg leading-tight mb-2">
                              {path.title}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {path.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium mb-2">Why recommended:</div>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              <li>• Matches your technical background</li>
                              <li>• Aligns with career advancement goals</li>
                              <li>• High success rate for similar profiles</li>
                            </ul>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-2">Skills you'll learn:</div>
                            <div className="flex flex-wrap gap-1">
                              {path.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Button className="w-full">
                            <Award className="h-4 w-4 mr-2" />
                            Start Recommended Path
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {learningPaths.filter(p => p.progress === 100).map((path) => (
                    <Card key={path.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <Badge variant="default" className="text-xs">
                                Completed
                              </Badge>
                            </div>
                            <CardTitle className="text-lg leading-tight mb-2">
                              {path.title}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {path.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium mb-2">Skills mastered:</div>
                            <div className="flex flex-wrap gap-1">
                              {path.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Award className="h-4 w-4 mr-2" />
                              View Certificate
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Star className="h-4 w-4 mr-2" />
                              Rate Course
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}