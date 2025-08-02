'use client'

import { useSession } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  Target,
  Activity,
  Calendar,
  Download,
  Filter
} from 'lucide-react'

export default function AnalyticsPage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
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
            <CardDescription>Please log in to access analytics.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <PageContainer maxWidth="7xl" className="space-y-8">
      <PageHeader 
        title="Analytics & Insights"
        description="Track performance, measure success, and optimize learning outcomes"
      >
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </PageHeader>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">-2%</span> from target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3x</div>
            <p className="text-xs text-muted-foreground">
              Faster than industry average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Track skill acquisition and certification success over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Performance chart visualization</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Teams</CardTitle>
                <CardDescription>Teams with highest readiness scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Engineering', 'Data Science', 'Product', 'Design'].map((team, index) => (
                    <div key={team} className="flex items-center justify-between">
                      <span className="font-medium">{team}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${90 - index * 5}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {90 - index * 5}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Categories</CardTitle>
                <CardDescription>Progress by skill domain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { skill: 'Cloud Computing', progress: 85 },
                    { skill: 'Machine Learning', progress: 72 },
                    { skill: 'DevOps', progress: 90 },
                    { skill: 'Data Engineering', progress: 78 }
                  ].map((item) => (
                    <div key={item.skill} className="flex items-center justify-between">
                      <span className="font-medium">{item.skill}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {item.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                User activity and participation rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Engagement chart visualization</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Outcomes</CardTitle>
              <CardDescription>
                Certification pass rates and skill demonstration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Outcomes chart visualization</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ROI Analysis</CardTitle>
              <CardDescription>
                Return on training investment and cost savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">342%</p>
                    <p className="text-sm text-muted-foreground">ROI on Training</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">$1.2M</p>
                    <p className="text-sm text-muted-foreground">Cost Savings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">45 days</p>
                    <p className="text-sm text-muted-foreground">Time to Productivity</p>
                  </div>
                </div>
                
                <div className="h-[300px] bg-muted/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">ROI trend visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Time Range Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Time Period
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Last 7 days</Button>
              <Button variant="outline" size="sm">Last 30 days</Button>
              <Button variant="outline" size="sm">Last 90 days</Button>
              <Button variant="outline" size="sm">Custom</Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </PageContainer>
  )
}