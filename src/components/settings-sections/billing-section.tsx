"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Download, Calendar, DollarSign, TrendingUp, AlertCircle, Check } from "lucide-react"

const billingHistory = [
  {
    id: 1,
    date: "2024-01-15",
    description: "Pro Plan - Monthly",
    amount: "$29.00",
    status: "paid",
    invoice: "INV-2024-001",
  },
  {
    id: 2,
    date: "2023-12-15",
    description: "Pro Plan - Monthly",
    amount: "$29.00",
    status: "paid",
    invoice: "INV-2023-012",
  },
  {
    id: 3,
    date: "2023-11-15",
    description: "Pro Plan - Monthly",
    amount: "$29.00",
    status: "paid",
    invoice: "INV-2023-011",
  },
]

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["Up to 3 team members", "5 projects", "Basic support"],
    current: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    features: ["Up to 10 team members", "Unlimited projects", "Priority support", "Advanced analytics"],
    current: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    features: ["Unlimited team members", "Unlimited projects", "24/7 support", "Custom integrations", "SSO"],
    current: false,
  },
]

export function BillingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">Pro Plan</h3>
                <Badge>Current</Badge>
              </div>
              <p className="text-muted-foreground">$29.00 per month • Next billing: Feb 15, 2024</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <Button variant="outline">Change Plan</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">7</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
              <div className="text-xs text-muted-foreground mt-1">3 remaining</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">24</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
              <div className="text-xs text-muted-foreground mt-1">Unlimited</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
              <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that best fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-lg p-6 flex flex-col ${
                  plan.current ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-auto"
                  variant={plan.current ? "secondary" : "default"}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-foreground">•••• •••• •••• 4242</div>
                <div className="text-sm text-muted-foreground">Expires 12/2027</div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 sm:mt-0 bg-transparent">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>Download invoices and view payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.map((item, index) => (
              <div key={item.id}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{item.description}</div>
                      <div className="text-sm text-muted-foreground">{item.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="text-right">
                      <div className="font-medium text-foreground">{item.amount}</div>
                      <Badge variant="secondary" className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {index < billingHistory.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Alert */}
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 dark:text-orange-100">Approaching Team Limit</h4>
              <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">
                You&apos;re using 7 of 10 team member slots. Consider upgrading to Enterprise for unlimited members.
              </p>
              <Button size="sm" className="mt-3">
                Upgrade Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
