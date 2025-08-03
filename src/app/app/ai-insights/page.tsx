'use client'

import {
  AlertCircle,
  BarChart3,
  Brain,
  CheckCircle,
  DollarSign,
  Lightbulb,
  MessageCircle,
  Send,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  InteractiveButton,
  InteractiveCard,
  InteractiveCardContent,
  InteractiveCardHeader,
  InteractiveCardTitle,
} from '@/components/interactive'
import { InteractiveKPICard } from '@/components/interactive/standardized-interactive'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { AIInsightsService } from '@/services/ai-insights.service'
import type {
  AIInsightsSummary,
  ChatMessage,
  ChatRequest,
  ChatSession,
  CompanyMetrics,
} from '@/types/ai-insights'

// Mock data for development - in production this would come from your backend
const mockCompanyMetrics: CompanyMetrics = {
  retention_rate: 0.82,
  engagement_score: 72,
  productivity_index: 78,
  training_completion_rate: 0.75,
  certification_pass_rate: 0.68,
  skill_gap_score: 65,
  employee_satisfaction: 74,
  revenue_per_employee: 150000,
  time_to_proficiency: 120,
  turnover_cost: 75000,
}

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<AIInsightsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const aiService = new AIInsightsService()

  // Load insights on component mount
  useEffect(() => {
    loadInsights()
    initializeChat()
  }, [])

  const loadInsights = async () => {
    setIsLoading(true)
    try {
      const request = {
        company_id: 'demo-company-123',
        metrics: mockCompanyMetrics,
        industry_context: 'Technology',
        company_size: 'medium' as const,
        priorities: ['retention', 'training'],
      }

      const result = await aiService.generateInsights(request)
      setInsights(result)
    } catch (error) {
      console.error('Failed to load insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const initializeChat = async () => {
    try {
      const session = await aiService.createChatSession('demo-company-123', 'AI Business Insights')
      setChatSession(session)
    } catch (error) {
      console.error('Failed to initialize chat:', error)
    }
  }

  const sendChatMessage = async () => {
    if (!currentMessage.trim() || !chatSession) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setCurrentMessage('')
    setIsChatLoading(true)

    try {
      const chatRequest: ChatRequest = {
        session_id: chatSession.id,
        message: currentMessage,
        context: {
          current_insights: insights || undefined,
        },
      }

      const response = await aiService.chatWithAI(chatRequest)

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
      }

      setChatMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsChatLoading(false)
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'default'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Analyzing Your Business Data</h3>
          <p className="text-muted-foreground">
            AI is processing metrics and generating insights...
          </p>
        </div>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Insights Available</h3>
        <p className="text-muted-foreground mb-4">Unable to generate insights. Please try again.</p>
        <InteractiveButton onClick={loadInsights} effect="scale">
          Retry
        </InteractiveButton>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Business Insights</h1>
          <p className="text-muted-foreground">
            AI-powered recommendations to boost profitability and engagement
          </p>
        </div>
        <InteractiveButton
          onClick={loadInsights}
          variant="outline"
          className="flex items-center gap-2"
          effect="glow"
          intensity="subtle"
        >
          <Brain className="w-4 h-4" />
          Refresh Insights
        </InteractiveButton>
      </div>

      {/* Health Score Overview */}
      <InteractiveCard effect="lift" className="border-2">
        <InteractiveCardHeader>
          <InteractiveCardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Company Health Score
          </InteractiveCardTitle>
          <CardDescription>
            Overall business health based on key performance indicators
          </CardDescription>
        </InteractiveCardHeader>
        <InteractiveCardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div
                className={cn(
                  'text-4xl font-bold',
                  getHealthScoreColor(insights.overall_health_score)
                )}
              >
                {insights.overall_health_score}
              </div>
              <div className="text-sm text-muted-foreground">Health Score</div>
            </div>
            <div className="flex-1 ml-8">
              <Progress value={insights.overall_health_score} className="w-full h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Poor</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-lg font-semibold">
                {(insights.key_metrics.retention_rate * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Retention Rate</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-lg font-semibold">{insights.key_metrics.engagement_score}</div>
              <div className="text-xs text-muted-foreground">Engagement Score</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-lg font-semibold">
                {(insights.key_metrics.training_completion_rate * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Training Completion</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-lg font-semibold">{insights.key_metrics.productivity_index}</div>
              <div className="text-xs text-muted-foreground">Productivity Index</div>
            </div>
          </div>
        </InteractiveCardContent>
      </InteractiveCard>

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="opportunities">Top Opportunities</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="chat">AI Assistant</TabsTrigger>
        </TabsList>

        {/* Top Opportunities */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid gap-4">
            {insights.top_opportunities.map((opportunity) => (
              <InteractiveCard key={opportunity.id} effect="lift" className="p-6" clickable>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      {opportunity.type === 'cost_reduction' && (
                        <TrendingDown className="w-5 h-5 text-green-600" />
                      )}
                      {opportunity.type === 'revenue_increase' && (
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      )}
                      {opportunity.type === 'efficiency_gain' && (
                        <Target className="w-5 h-5 text-purple-600" />
                      )}
                      {opportunity.type === 'risk_mitigation' && (
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                      <Badge variant={getPriorityBadgeVariant(opportunity.priority)}>
                        {opportunity.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${opportunity.estimated_value.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Potential Value</div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{opportunity.description}</p>

                <div className="space-y-2">
                  <h4 className="font-medium">Action Items:</h4>
                  <ul className="space-y-1">
                    {opportunity.action_items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Impact: {opportunity.impact_score}/10</span>
                    <span>Confidence: {(opportunity.confidence * 100).toFixed(0)}%</span>
                    <span>Timeline: {opportunity.timeframe.replace('_', ' ')}</span>
                  </div>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </TabsContent>

        {/* Engagement Recommendations */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4">
            {insights.engagement_recommendations.map((rec) => (
              <Card key={rec.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{rec.title}</h3>
                    <p className="text-muted-foreground mt-2">{rec.description}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {rec.implementation_effort} effort
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-lg font-semibold">{rec.current_metric}</div>
                    <div className="text-xs text-muted-foreground">Current Score</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-lg font-semibold text-green-600">{rec.target_metric}</div>
                    <div className="text-xs text-muted-foreground">Target Score</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-lg font-semibold text-blue-600">
                      {rec.improvement_potential}%
                    </div>
                    <div className="text-xs text-muted-foreground">Improvement</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Resources Needed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.resources_needed.map((resource, index) => (
                        <Badge key={index} variant="secondary">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Success Metrics:</h4>
                    <ul className="text-sm space-y-1">
                      {rec.success_metrics.map((metric, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Target className="w-3 h-3 text-blue-600" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Timeline: {rec.timeline}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Retention Analysis */}
        <TabsContent value="retention" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Retention Analysis</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">
                    {(insights.retention_analysis.current_rate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Current Retention Rate</div>
                </div>
                <div>
                  <div className="text-lg text-muted-foreground">
                    {(insights.retention_analysis.industry_benchmark * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Industry Benchmark</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Risk Segments</h4>
                {insights.retention_analysis.risk_segments.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <div className="font-medium">{segment.segment}</div>
                      <div className="text-sm text-muted-foreground">
                        {segment.size}% of workforce
                      </div>
                    </div>
                    <Badge
                      variant={
                        segment.risk_level === 'high'
                          ? 'destructive'
                          : segment.risk_level === 'medium'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {segment.risk_level} risk
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Intervention Strategies</h4>
              {insights.retention_analysis.intervention_strategies.map((strategy, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium">{strategy.strategy}</h5>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        +{(strategy.expected_impact * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Expected Impact</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Target: {strategy.target_segment}</span>
                    <span>Cost: ${strategy.cost_estimate.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* AI Chat Assistant */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                AI Business Assistant
              </CardTitle>
              <CardDescription>
                Ask questions about your insights and get personalized recommendations
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg">
                {chatMessages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Ask me anything about your business insights!</p>
                    <p className="text-sm mt-2">
                      Try: "How can I improve retention?" or "What should I focus on first?"
                    </p>
                  </div>
                )}

                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] p-3 rounded-lg',
                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        />
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask about your business insights..."
                  className="flex-1 min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendChatMessage()
                    }
                  }}
                />
                <InteractiveButton
                  onClick={sendChatMessage}
                  disabled={!currentMessage.trim() || isChatLoading}
                  className="px-4"
                  effect="scale"
                >
                  <Send className="w-4 h-4" />
                </InteractiveButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
