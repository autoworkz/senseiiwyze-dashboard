'use client'

import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HelpCircle, Book, MessageCircle, Video, Search, ExternalLink, Lightbulb, FileText } from 'lucide-react'
import Link from 'next/link'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

export default function HelpPage() {
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (session?.user) {
      setUser({
        role: (session.user.role as User['role']) || 'learner',
        name: session.user.name,
        email: session.user.email
      })
    }
  }, [session])

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
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
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
            <CardDescription>Please log in to access the help center.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need to be authenticated to view this page.
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
                    Help Center
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Get support, find answers, and learn how to make the most of SenseiiWyze
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Book Demo
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search help articles, guides, and FAQs..."
                    className="pl-10 text-base h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>New to SenseiiWyze? Start here</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Essential guides for first-time users
                    </div>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        Setting up your account
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        Understanding the Readiness Index
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        Taking your first assessment
                      </li>
                    </ul>
                    <Button variant="outline" size="sm" className="w-full">
                      View Getting Started Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-primary" />
                    User Guides
                  </CardTitle>
                  <CardDescription>Detailed documentation by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Role-specific guides and tutorials
                    </div>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        Admin user management
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        Corporate dashboard usage
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        Learner progress tracking
                      </li>
                    </ul>
                    <Button variant="outline" size="sm" className="w-full">
                      Browse User Guides
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Common Questions
                  </CardTitle>
                  <CardDescription>Frequently asked questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Quick answers to common questions
                    </div>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        How accurate is the Readiness Index?
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        What is success-based pricing?
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        How do I invite team members?
                      </li>
                    </ul>
                    <Button variant="outline" size="sm" className="w-full">
                      View All FAQs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Help Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Video Tutorials</CardTitle>
                  <CardDescription>Step-by-step video guides</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border border-dashed rounded">
                      <Video className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Platform Overview</div>
                        <div className="text-xs text-muted-foreground">5 min introduction video</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border border-dashed rounded">
                      <Video className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Setting Up Teams</div>
                        <div className="text-xs text-muted-foreground">8 min tutorial for admins</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 p-3 border border-dashed rounded">
                      <Video className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Using Analytics</div>
                        <div className="text-xs text-muted-foreground">12 min deep dive</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      View All Videos
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>Technical and API documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border border-dashed rounded">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">API Reference</div>
                        <div className="text-xs text-muted-foreground">Integration documentation</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border border-dashed rounded">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Security Guide</div>
                        <div className="text-xs text-muted-foreground">Data protection and compliance</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 p-3 border border-dashed rounded">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Migration Guide</div>
                        <div className="text-xs text-muted-foreground">Moving from other platforms</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      Browse Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
                <CardDescription>Get personalized support from our team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-dashed rounded">
                    <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-sm font-medium mb-2">Live Chat</div>
                    <div className="text-xs text-muted-foreground mb-3">
                      Get instant help from our support team
                    </div>
                    <Button size="sm" className="w-full">
                      Start Chat
                    </Button>
                  </div>

                  <div className="text-center p-4 border border-dashed rounded">
                    <Video className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-sm font-medium mb-2">Schedule Demo</div>
                    <div className="text-xs text-muted-foreground mb-3">
                      Book a personalized platform walkthrough
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Book Demo
                    </Button>
                  </div>

                  <div className="text-center p-4 border border-dashed rounded">
                    <HelpCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-sm font-medium mb-2">Submit Ticket</div>
                    <div className="text-xs text-muted-foreground mb-3">
                      Create a support request for complex issues
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Create Ticket
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    Current user role: <span className="font-medium">{user.role}</span> | 
                    Response time: Within 2 hours during business hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}