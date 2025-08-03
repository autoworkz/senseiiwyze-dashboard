import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  DollarSign,
  MessageCircle,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Suspense } from 'react'
import { AIInsightsChat } from '@/components/ai-insights/ai-insights-chat'
import { EngagementRecommendations } from '@/components/ai-insights/engagement-recommendations'
import { InsightsOverview } from '@/components/ai-insights/insights-overview'
import { ProfitabilityInsights } from '@/components/ai-insights/profitability-insights'
import { RetentionAnalysis } from '@/components/ai-insights/retention-analysis'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AIInsightsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Business Insights</h1>
          <p className="text-muted-foreground">
            AI-powered recommendations to increase profitability, engagement, and retention
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Last updated: Today
          </Badge>
          <Button variant="outline" size="sm">
            <Brain className="w-4 h-4 mr-2" />
            Regenerate Insights
          </Button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company Health Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">82/100</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +5 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$1.2M</div>
            <p className="text-xs text-muted-foreground">Annual opportunity identified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">23</div>
            <p className="text-xs text-muted-foreground">
              <AlertTriangle className="inline w-3 h-3 mr-1" />
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority Actions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">7</div>
            <p className="text-xs text-muted-foreground">High-impact recommendations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="chat">
            <MessageCircle className="w-4 h-4 mr-2" />
            AI Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Suspense fallback={<div>Loading insights...</div>}>
            <InsightsOverview />
          </Suspense>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-6">
          <Suspense fallback={<div>Loading profitability insights...</div>}>
            <ProfitabilityInsights />
          </Suspense>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Suspense fallback={<div>Loading engagement recommendations...</div>}>
            <EngagementRecommendations />
          </Suspense>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <Suspense fallback={<div>Loading retention analysis...</div>}>
            <RetentionAnalysis />
          </Suspense>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Business Advisor
              </CardTitle>
              <CardDescription>
                Chat with our AI to get personalized insights and recommendations for your specific
                challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading AI chat...</div>}>
                <AIInsightsChat />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
