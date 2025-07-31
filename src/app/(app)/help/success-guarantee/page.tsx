'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Target,
  TrendingUp,
  Users,
  Shield,
  Award,
  FileText,
  Calculator
} from 'lucide-react'
import Link from 'next/link'

export default function SuccessGuaranteePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/billing" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Billing
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Success Guarantee Program
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Our commitment to your learning outcomes with measurable results
        </p>
      </div>

      {/* Main Guarantee Card */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle>Our Promise to You</CardTitle>
          </div>
          <CardDescription>
            We stand behind our Readiness Index algorithm and coaching effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2 text-green-900 dark:text-green-100">
              30% Success Fee Refund Guarantee
            </h3>
            <p className="text-green-700 dark:text-green-300">
              If your learners don't achieve the target certification pass rates or 
              skill demonstration benchmarks, you're eligible for partial refunds up 
              to 30% of your success fees.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How the Guarantee Works</CardTitle>
          <CardDescription>
            Simple, transparent process with clear metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Set Target Metrics</h4>
                  <p className="text-sm text-muted-foreground">
                    Define success criteria at enrollment (e.g., 85% pass rate)
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Track Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor real-time performance through your dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Measure Outcomes</h4>
                  <p className="text-sm text-muted-foreground">
                    Evaluate results 90 days after training completion
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Receive Refund</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatic credit applied if targets aren't met
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Covered Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Covered Success Metrics</CardTitle>
          <CardDescription>
            Performance indicators included in our guarantee
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Certification Pass Rate</h4>
                  <p className="text-sm text-muted-foreground">
                    First-attempt pass rate for industry certifications
                  </p>
                  <Badge variant="secondary" className="mt-1">Target: 85%</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Skill Acquisition Speed</h4>
                  <p className="text-sm text-muted-foreground">
                    Time to proficiency vs. industry average
                  </p>
                  <Badge variant="secondary" className="mt-1">Target: 2.0x faster</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Training Completion Rate</h4>
                  <p className="text-sm text-muted-foreground">
                    Percentage of enrolled learners who complete
                  </p>
                  <Badge variant="secondary" className="mt-1">Target: 80%</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Readiness Index Accuracy</h4>
                  <p className="text-sm text-muted-foreground">
                    Our algorithm's prediction accuracy
                  </p>
                  <Badge variant="secondary" className="mt-1">Target: 87%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eligibility Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Eligibility Requirements</CardTitle>
          <CardDescription>
            Conditions for guarantee activation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Minimum 20 learners enrolled in the program</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Learners complete Readiness Index assessment before training</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">AI coaching features actively used during training</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">90-day measurement period after training completion</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Enterprise or Team plan subscription</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refund Calculation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Refund Calculation
          </CardTitle>
          <CardDescription>
            How we calculate your success fee refund
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-6 rounded-lg space-y-4">
            <div className="font-mono text-sm space-y-2">
              <p>Target Achievement = (Actual Rate / Target Rate) × 100</p>
              <p>Refund Percentage = (100 - Target Achievement) × 0.3</p>
              <p>Refund Amount = Success Fees × Refund Percentage</p>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Example:</h4>
              <div className="text-sm space-y-1">
                <p>• Target Pass Rate: 85%</p>
                <p>• Actual Pass Rate: 75%</p>
                <p>• Achievement: (75/85) × 100 = 88.2%</p>
                <p>• Refund: (100 - 88.2) × 0.3 = 3.54%</p>
                <p className="font-semibold">• Credit: 3.54% of success fees</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="space-y-2 mt-2 text-sm">
                <li>• Guarantee applies only to the success fee portion (30%) of your subscription</li>
                <li>• Maximum refund capped at 30% of success fees paid during the measurement period</li>
                <li>• Refunds issued as account credits, not cash refunds</li>
                <li>• Credits must be used within 12 months of issuance</li>
                <li>• Program modifications may void guarantee eligibility</li>
                <li>• SenseiiWyze reserves the right to audit training data</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
            <p className="text-primary-foreground/90">
              Join companies achieving 2-3x faster skill acquisition with our guaranteed outcomes
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Schedule Demo
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}