'use client'

import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BrainCircuit, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Target,
  Users,
  BookOpen,
  Zap,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

interface AssessmentQuestion {
  id: string
  category: 'technical' | 'learning' | 'motivation' | 'experience' | 'psychometric'
  question: string
  type: 'multiple-choice' | 'scale' | 'text' | 'checkbox'
  options?: string[]
  required: boolean
}

interface AssessmentResponse {
  questionId: string
  answer: string | string[] | number
}

interface ReadinessResult {
  overallScore: number
  categoryScores: {
    technical: number
    learning: number
    motivation: number
    experience: number
    psychometric: number
  }
  recommendations: string[]
  riskLevel: 'low' | 'medium' | 'high'
  predictedSuccess: number
}

export default function ReadinessAssessmentPage() {
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<AssessmentResponse[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<ReadinessResult | null>(null)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setUser({
        role: (session.user.role as User['role']) || 'learner',
        name: session.user.name,
        email: session.user.email
      })
    }
  }, [session])

  // Mock assessment questions
  const assessmentQuestions: AssessmentQuestion[] = [
    // Technical Skills
    {
      id: 'tech_1',
      category: 'technical',
      question: 'What is your current experience level with the technology you want to learn?',
      type: 'multiple-choice',
      options: ['Complete beginner', 'Some exposure', 'Basic understanding', 'Intermediate', 'Advanced'],
      required: true
    },
    {
      id: 'tech_2',
      category: 'technical',
      question: 'How would you rate your problem-solving abilities?',
      type: 'scale',
      required: true
    },
    {
      id: 'tech_3',
      category: 'technical',
      question: 'Which programming languages are you familiar with? (Select all that apply)',
      type: 'checkbox',
      options: ['JavaScript', 'Python', 'Java', 'C#', 'React', 'Node.js', 'SQL', 'HTML/CSS', 'None'],
      required: true
    },

    // Learning Style
    {
      id: 'learn_1',
      category: 'learning',
      question: 'How do you prefer to learn new technical concepts?',
      type: 'multiple-choice',
      options: [
        'Hands-on practice and coding',
        'Video tutorials and demonstrations',
        'Reading documentation and guides',
        'Interactive courses with exercises',
        'Learning from mentors or peers'
      ],
      required: true
    },
    {
      id: 'learn_2',
      category: 'learning',
      question: 'How many hours per week can you dedicate to focused learning?',
      type: 'multiple-choice',
      options: ['1-3 hours', '4-7 hours', '8-12 hours', '13-20 hours', '20+ hours'],
      required: true
    },
    {
      id: 'learn_3',
      category: 'learning',
      question: 'Rate your ability to learn from failure and debugging challenges',
      type: 'scale',
      required: true
    },

    // Motivation & Goals
    {
      id: 'motiv_1',
      category: 'motivation',
      question: 'What is your primary goal for this training?',
      type: 'multiple-choice',
      options: [
        'Career advancement/promotion',
        'Job transition to tech role',
        'Skill enhancement for current role',
        'Personal interest and growth',
        'Meeting company requirements'
      ],
      required: true
    },
    {
      id: 'motiv_2',
      category: 'motivation',
      question: 'How motivated are you to complete this training program?',
      type: 'scale',
      required: true
    },
    {
      id: 'motiv_3',
      category: 'motivation',
      question: 'Describe what success looks like to you after completing this training',
      type: 'text',
      required: true
    },

    // Experience & Background
    {
      id: 'exp_1',
      category: 'experience',
      question: 'How many years of professional work experience do you have?',
      type: 'multiple-choice',
      options: ['0-1 years', '2-3 years', '4-6 years', '7-10 years', '10+ years'],
      required: true
    },
    {
      id: 'exp_2',
      category: 'experience',
      question: 'Have you completed technical training programs before?',
      type: 'multiple-choice',
      options: ['Never', 'One program', '2-3 programs', '4-5 programs', 'Many programs'],
      required: true
    },

    // Psychometric Indicators
    {
      id: 'psych_1',
      category: 'psychometric',
      question: 'How do you typically handle frustrating technical challenges?',
      type: 'multiple-choice',
      options: [
        'Take breaks and return with fresh perspective',
        'Push through until solved',
        'Seek help from others immediately',
        'Research similar problems online',
        'Sometimes give up if too difficult'
      ],
      required: true
    },
    {
      id: 'psych_2',
      category: 'psychometric',
      question: 'Rate your confidence in learning complex technical concepts',
      type: 'scale',
      required: true
    }
  ]

  const totalSteps = assessmentQuestions.length

  const currentQuestion = assessmentQuestions[currentStep]

  const handleResponse = (answer: string | string[] | number) => {
    const existingIndex = responses.findIndex(r => r.questionId === currentQuestion.id)
    const newResponse: AssessmentResponse = {
      questionId: currentQuestion.id,
      answer
    }

    if (existingIndex >= 0) {
      const newResponses = [...responses]
      newResponses[existingIndex] = newResponse
      setResponses(newResponses)
    } else {
      setResponses([...responses, newResponse])
    }
  }

  const getCurrentResponse = () => {
    return responses.find(r => r.questionId === currentQuestion.id)?.answer
  }

  const canProceed = () => {
    const currentResponse = getCurrentResponse()
    if (!currentQuestion.required) return true
    
    if (currentQuestion.type === 'checkbox') {
      return Array.isArray(currentResponse) && currentResponse.length > 0
    }
    
    return currentResponse !== undefined && currentResponse !== ''
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateReadinessScore = (): ReadinessResult => {
    // Mock calculation - in real app this would be the proprietary algorithm
    const categoryScores = {
      technical: Math.floor(Math.random() * 30) + 60,
      learning: Math.floor(Math.random() * 25) + 70,
      motivation: Math.floor(Math.random() * 20) + 75,
      experience: Math.floor(Math.random() * 35) + 50,
      psychometric: Math.floor(Math.random() * 30) + 65
    }

    const overallScore = Math.round(
      (categoryScores.technical * 0.25 +
       categoryScores.learning * 0.2 +
       categoryScores.motivation * 0.2 +
       categoryScores.experience * 0.15 +
       categoryScores.psychometric * 0.2)
    )

    const riskLevel: 'low' | 'medium' | 'high' = 
      overallScore >= 75 ? 'low' : 
      overallScore >= 50 ? 'medium' : 'high'

    const predictedSuccess = Math.min(overallScore + Math.floor(Math.random() * 10), 95)

    const recommendations = [
      'Focus on hands-on practice with real projects',
      'Join study groups or find an accountability partner',
      'Set up a consistent daily learning schedule',
      'Start with foundational concepts before advanced topics'
    ]

    return {
      overallScore,
      categoryScores,
      recommendations,
      riskLevel,
      predictedSuccess
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const calculatedResult = calculateReadinessScore()
    setResult(calculatedResult)
    setIsSubmitting(false)
  }

  const renderQuestion = () => {
    const currentResponse = getCurrentResponse()

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={currentResponse as string || ''}
            onValueChange={handleResponse}
            className="space-y-3"
          >
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not at all</span>
              <span>Extremely</span>
            </div>
            <RadioGroup
              value={currentResponse?.toString() || ''}
              onValueChange={(value) => handleResponse(parseInt(value))}
              className="flex justify-between"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div key={num} className="flex flex-col items-center space-y-2">
                  <RadioGroupItem value={num.toString()} id={`scale-${num}`} />
                  <Label htmlFor={`scale-${num}`} className="text-xs">
                    {num}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 'checkbox':
        const checkboxResponses = (currentResponse as string[]) || []
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`checkbox-${index}`}
                  checked={checkboxResponses.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleResponse([...checkboxResponses, option])
                    } else {
                      handleResponse(checkboxResponses.filter(r => r !== option))
                    }
                  }}
                />
                <Label htmlFor={`checkbox-${index}`} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'text':
        return (
          <Textarea
            placeholder="Please describe your answer in detail..."
            value={currentResponse as string || ''}
            onChange={(e) => handleResponse(e.target.value)}
            className="min-h-[100px]"
          />
        )

      default:
        return null
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Zap className="h-5 w-5" />
      case 'learning': return <BookOpen className="h-5 w-5" />
      case 'motivation': return <Target className="h-5 w-5" />
      case 'experience': return <Users className="h-5 w-5" />
      case 'psychometric': return <BrainCircuit className="h-5 w-5" />
      default: return <CheckCircle className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'text-blue-500'
      case 'learning': return 'text-green-500'
      case 'motivation': return 'text-purple-500'
      case 'experience': return 'text-orange-500'
      case 'psychometric': return 'text-pink-500'
      default: return 'text-gray-500'
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
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
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
            <CardDescription>Please log in to access the readiness assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need to be authenticated to take the assessment.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Results view
  if (result) {
    const getRiskBadgeVariant = (risk: string) => {
      switch (risk) {
        case 'low': return 'default' as const
        case 'medium': return 'secondary' as const  
        case 'high': return 'destructive' as const
        default: return 'outline' as const
      }
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <GlobalNavigation user={user} variant="sidebar" />
          
          <div className="flex-1">
            <main className="p-8">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <BrainCircuit className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                      Your Readiness Index Results
                    </h1>
                  </div>
                  <p className="text-muted-foreground">
                    Based on our proprietary algorithm with 87% accuracy
                  </p>
                </div>

                {/* Overall Score */}
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary mb-2">
                        {result.overallScore}
                      </div>
                      <div className="text-lg font-medium mb-2">Readiness Index Score</div>
                      <Badge variant={getRiskBadgeVariant(result.riskLevel)} className="mb-4">
                        {result.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Predicted Success Rate: <span className="font-medium">{result.predictedSuccess}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {Object.entries(result.categoryScores).map(([category, score]) => (
                    <Card key={category}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <span className={getCategoryColor(category)}>
                            {getCategoryIcon(category)}
                          </span>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-2">{score}</div>
                        <Progress value={score} className="h-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recommendations */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Personalized Recommendations
                    </CardTitle>
                    <CardDescription>
                      Actions to improve your training success probability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Next Steps
                    </CardTitle>
                    <CardDescription>
                      Ready to start your personalized learning journey?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="flex-1">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Learning Paths
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Users className="h-4 w-4 mr-2" />
                        Connect with Coach
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Target className="h-4 w-4 mr-2" />
                        Retake Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }

  // Introduction screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <GlobalNavigation user={user} variant="sidebar" />
          
          <div className="flex-1">
            <main className="p-8">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <BrainCircuit className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                    Readiness Index Assessment
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8">
                    Discover your training readiness with our AI-powered assessment. 
                    Get personalized insights and recommendations in just 10-15 minutes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        What You'll Get
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Personalized readiness score (0-100)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Category-specific insights
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Success probability prediction
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Tailored learning recommendations
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Assessment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center text-xs">
                            {totalSteps}
                          </span>
                          {totalSteps} carefully designed questions
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          10-15 minutes to complete
                        </li>
                        <li className="flex items-center gap-2">
                          <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                          AI-powered analysis
                        </li>
                        <li className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          87% prediction accuracy
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="mb-8">
                  <BrainCircuit className="h-4 w-4" />
                  <AlertDescription>
                    Your responses are confidential and used only to provide personalized recommendations. 
                    Answer honestly for the most accurate results.
                  </AlertDescription>
                </Alert>

                <div className="text-center">
                  <Button 
                    onClick={() => setHasStarted(true)} 
                    size="lg"
                    className="px-8"
                  >
                    Start Assessment
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }

  // Assessment questions
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <GlobalNavigation user={user} variant="sidebar" />
        
        <div className="flex-1">
          <main className="p-8">
            <div className="max-w-3xl mx-auto">
              {/* Progress Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Readiness Assessment
                  </h1>
                  <Badge variant="outline">
                    Question {currentStep + 1} of {totalSteps}
                  </Badge>
                </div>
                <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Progress: {Math.round((currentStep / totalSteps) * 100)}%</span>
                  <span>~{Math.max(1, totalSteps - currentStep)} questions remaining</span>
                </div>
              </div>

              {/* Question Card */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={getCategoryColor(currentQuestion.category)}>
                      {getCategoryIcon(currentQuestion.category)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {currentQuestion.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-relaxed">
                    {currentQuestion.question}
                  </CardTitle>
                  {currentQuestion.required && (
                    <CardDescription>
                      * This question is required
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {renderQuestion()}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                >
                  {isSubmitting ? (
                    'Calculating Results...'
                  ) : currentStep === totalSteps - 1 ? (
                    'Complete Assessment'
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}