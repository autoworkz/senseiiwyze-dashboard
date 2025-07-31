'use client'

import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { useSession } from '@/lib/auth-client'
import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  Target,
  TrendingUp,
  Lightbulb,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
  metadata?: {
    topic?: string
    confidence?: number
    resources?: Array<{
      title: string
      url: string
      type: 'article' | 'video' | 'course' | 'documentation'
    }>
  }
}

interface CoachingSession {
  id: string
  title: string
  timestamp: Date
  messageCount: number
  status: 'active' | 'completed' | 'paused'
}

export default function AICoachPage() {
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentSession, setCurrentSession] = useState<CoachingSession | null>(null)
  const [recentSessions, setRecentSessions] = useState<CoachingSession[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session?.user) {
      setUser({
        role: (session.user.role as User['role']) || 'learner',
        name: session.user.name,
        email: session.user.email
      })
    }
  }, [session])

  // Initialize with welcome message and mock sessions
  useEffect(() => {
    if (user) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'ai',
        content: `Hello ${user.name}! I'm your AI coaching assistant. I'm here to help you with personalized learning guidance, skill development recommendations, and answer any questions about your training journey. What would you like to work on today?`,
        timestamp: new Date(),
        suggestions: [
          "Help me plan my learning path",
          "Review my readiness assessment results",
          "Suggest practice exercises",
          "Explain a technical concept"
        ]
      }

      setMessages([welcomeMessage])

      // Mock recent sessions
      const mockSessions: CoachingSession[] = [
        {
          id: 'session-1',
          title: 'JavaScript Fundamentals Review',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          messageCount: 15,
          status: 'completed'
        },
        {
          id: 'session-2',
          title: 'React Hooks Deep Dive',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          messageCount: 23,
          status: 'completed'
        },
        {
          id: 'session-3',
          title: 'Career Planning Discussion',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          messageCount: 8,
          status: 'completed'
        }
      ]

      setRecentSessions(mockSessions)

      // Create current session
      setCurrentSession({
        id: 'current',
        title: 'New Coaching Session',
        timestamp: new Date(),
        messageCount: 1,
        status: 'active'
      })
    }
  }, [user])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

    // Mock AI responses based on message content
    const responses = {
      default: "I understand you're looking for guidance. Could you provide more specific details about what you'd like to learn or improve? This will help me give you more targeted advice.",
      learning: "Based on your learning style and current progress, I recommend starting with hands-on projects. Here are some specific steps you can take...",
      readiness: "Your readiness assessment shows strong motivation and good foundational skills. Let's focus on areas where you can build confidence quickly.",
      technical: "That's a great technical question! Let me break this down into manageable concepts and provide some practical examples.",
      career: "Career development is about building both technical skills and professional network. Let's create a strategic plan for your goals."
    }

    let responseContent = responses.default
    let suggestions: string[] = []
    let topic = 'general'

    const messageLower = userMessage.toLowerCase()

    if (messageLower.includes('learn') || messageLower.includes('study') || messageLower.includes('practice')) {
      responseContent = responses.learning
      topic = 'learning'
      suggestions = [
        "Show me a project-based learning plan",
        "What are the key concepts I should master?",
        "How can I practice these skills effectively?",
        "Create a study schedule for me"
      ]
    } else if (messageLower.includes('readiness') || messageLower.includes('assessment') || messageLower.includes('score')) {
      responseContent = responses.readiness
      topic = 'readiness'
      suggestions = [
        "How can I improve my readiness score?",
        "What are my strongest areas?",
        "Create an improvement plan",
        "When should I retake the assessment?"
      ]
    } else if (messageLower.includes('javascript') || messageLower.includes('react') || messageLower.includes('code') || messageLower.includes('programming')) {
      responseContent = responses.technical
      topic = 'technical'
      suggestions = [
        "Explain this concept with examples",
        "Show me common patterns",
        "What are best practices?",
        "Give me practice exercises"
      ]
    } else if (messageLower.includes('career') || messageLower.includes('job') || messageLower.includes('promotion')) {
      responseContent = responses.career
      topic = 'career'
      suggestions = [
        "Help me create a career roadmap",
        "What skills are most in-demand?",
        "How can I stand out to employers?",
        "Review my professional development"
      ]
    }

    return {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: responseContent,
      timestamp: new Date(),
      suggestions,
      metadata: {
        topic,
        confidence: 0.85 + Math.random() * 0.1,
        resources: [
          {
            title: "Interactive Coding Exercises",
            url: "#",
            type: "course"
          },
          {
            title: "Best Practices Guide",
            url: "#",
            type: "article"
          }
        ]
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Generate AI response
    const aiResponse = await generateAIResponse(userMessage.content)
    setIsTyping(false)
    setMessages(prev => [...prev, aiResponse])

    // Update current session
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        messageCount: prev.messageCount + 2
      } : null)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatSessionDate = (timestamp: Date) => {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return timestamp.toLocaleDateString()
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
              <Skeleton className="h-96 w-full" />
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
            <CardDescription>Please log in to access AI coaching.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need to be authenticated to chat with your AI coach.
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
        
        <div className="flex-1 flex">
          {/* Sidebar with recent sessions */}
          <div className="w-80 border-r bg-card/50">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Coaching Sessions
              </h2>
            </div>
            
            <div className="p-4">
              {/* Current Session */}
              {currentSession && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Current Session
                  </div>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="size-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{currentSession.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {currentSession.messageCount} messages • {formatSessionDate(currentSession.timestamp)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Recent Sessions */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Recent Sessions
                </div>
                <div className="space-y-2">
                  {recentSessions.map((session) => (
                    <Card key={session.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{session.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {session.messageCount} messages • {formatSessionDate(session.timestamp)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b bg-card/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Learning Coach</h3>
                    <p className="text-xs text-muted-foreground">Always available • Powered by SenseiiWyze AI</p>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Active
                </Badge>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'ai' && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      <div className={`text-xs text-muted-foreground mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                        {formatTimestamp(message.timestamp)}
                        {message.metadata?.confidence && (
                          <span className="ml-2">
                            • {Math.round(message.metadata.confidence * 100)}% confidence
                          </span>
                        )}
                      </div>

                      {/* AI Message Suggestions */}
                      {message.type === 'ai' && message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs text-muted-foreground">Suggested follow-ups:</div>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-1 px-2"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Message Resources */}
                      {message.type === 'ai' && message.metadata?.resources && message.metadata.resources.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground mb-2">Helpful resources:</div>
                          <div className="space-y-1">
                            {message.metadata.resources.map((resource, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <BookOpen className="h-3 w-3 text-muted-foreground" />
                                <a href={resource.url} className="text-primary hover:underline">
                                  {resource.title}
                                </a>
                                <Badge variant="outline" className="text-xs h-4">
                                  {resource.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {message.type === 'user' && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-muted">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-card/50">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Ask your AI coach anything about learning, skills, or career development..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <Alert className="mt-3">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Your AI coach has access to your learning progress, readiness assessment, and personalized recommendations to provide tailored guidance.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}