'use client'

import { useSession } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  CreditCard, 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react'
import Link from 'next/link'

export default function BillingPage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading billing information...</p>
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
            <CardDescription>Please log in to access billing information.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Billing & Usage
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription, view usage metrics, and track success-based billing
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Invoice
        </Button>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>Your active subscription and plan details</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Enterprise Pro</h3>
              <p className="text-2xl font-bold text-primary">$299/month</p>
              <p className="text-sm text-muted-foreground">Base platform fee (70%)</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Success Fee</h3>
              <p className="text-2xl font-bold text-orange-600">$128/month</p>
              <p className="text-sm text-muted-foreground">Based on outcomes (30%)</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Total</h3>
              <p className="text-2xl font-bold">$427/month</p>
              <p className="text-sm text-muted-foreground">Current billing cycle</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Next billing date</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                February 28, 2025
              </p>
            </div>
            <div className="space-x-2">
              <Button variant="outline">Change Plan</Button>
              <Button>Manage Subscription</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Success Metrics
            </CardTitle>
            <CardDescription>Performance indicators affecting your success fee</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Certification Pass Rate</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  92%
                </Badge>
                <span className="text-sm text-muted-foreground">Target: 85%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Skill Acquisition Speed</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  2.3x
                </Badge>
                <span className="text-sm text-muted-foreground">Target: 2.0x</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Training Completion Rate</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  78%
                </Badge>
                <span className="text-sm text-muted-foreground">Target: 80%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Readiness Index Accuracy</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  89%
                </Badge>
                <span className="text-sm text-muted-foreground">Target: 87%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usage Overview
            </CardTitle>
            <CardDescription>Current month usage statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Learners</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">247</span>
                <span className="text-sm text-muted-foreground">/ 500 included</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">AI Coaching Sessions</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">1,834</span>
                <span className="text-sm text-muted-foreground">/ unlimited</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Assessments Completed</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">156</span>
                <span className="text-sm text-muted-foreground">this month</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Learning Paths Active</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">89</span>
                <span className="text-sm text-muted-foreground">in progress</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/27</p>
              </div>
            </div>
            <Button variant="outline">Update Payment</Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Guarantee */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Success Guarantee
          </CardTitle>
          <CardDescription>Our commitment to your learning outcomes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">
                  Outcome-Based Refund Policy
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  If learners don't achieve target certification pass rates or skill demonstration, 
                  you're eligible for partial refunds up to 30% of your success fees.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Current Month Status</p>
              <p className="text-green-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Exceeding targets
              </p>
            </div>
            <div>
              <p className="font-medium">Guarantee Period</p>
              <p className="text-muted-foreground">90 days after training completion</p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/help/success-guarantee">
              Learn More About Our Guarantee
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Invoices
          </CardTitle>
          <CardDescription>Your recent billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: 'Jan 28, 2025', amount: '$427.00', status: 'Paid', invoice: 'INV-2025-001' },
              { date: 'Dec 28, 2024', amount: '$395.00', status: 'Paid', invoice: 'INV-2024-012' },
              { date: 'Nov 28, 2024', amount: '$423.00', status: 'Paid', invoice: 'INV-2024-011' },
            ].map((invoice, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{invoice.invoice}</p>
                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{invoice.amount}</span>
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}