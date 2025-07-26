'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronRight, Send, FileText, GitBranch, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Ticket {
  id: string
  title: string
  description: string
  workstream: string
  priority: string
  status: string
  acceptanceCriteria?: string[]
  technicalRequirements?: string[]
  dependencies?: string[]
  metadata?: Record<string, any>
}

interface CompanyStandard {
  id: string
  name: string
  description: string
  requirements: string[]
  category: string
}

// Mock data - replace with actual API call
const mockTickets: Ticket[] = [
  {
    id: 'SENSEI-001',
    title: 'Implement User Authentication',
    description: 'Set up Better Auth with email/password and OAuth providers',
    workstream: 'foundation',
    priority: 'high',
    status: 'in-progress',
    acceptanceCriteria: [
      'Users can sign up with email/password',
      'OAuth login works with Google, GitHub, Discord',
      'Session management is secure',
      'Password reset flow is implemented'
    ],
    technicalRequirements: [
      'Better Auth integration',
      'Resend email service',
      'PostgreSQL database',
      'JWT token management'
    ]
  },
  {
    id: 'SENSEI-002',
    title: 'Create Dashboard Layout',
    description: 'Build responsive dashboard with role-based views',
    workstream: 'ui',
    priority: 'high',
    status: 'pending',
    acceptanceCriteria: [
      'Five different dashboard views (Admin, Corporate, Coach, Learner, Guest)',
      'Responsive design for mobile and desktop',
      'Account switcher component',
      'Real-time data updates'
    ],
    dependencies: ['SENSEI-001']
  }
]

// Mock company standards - replace with actual data
const mockStandards: CompanyStandard[] = [
  {
    id: 'STD-001',
    name: 'Authentication Standards',
    description: 'Security requirements for user authentication',
    requirements: [
      'Multi-factor authentication support',
      'Session timeout after 30 minutes of inactivity',
      'Password complexity requirements',
      'OAuth providers must be whitelisted'
    ],
    category: 'security'
  },
  {
    id: 'STD-002',
    name: 'UI/UX Standards',
    description: 'Design and accessibility requirements',
    requirements: [
      'WCAG 2.1 AA compliance',
      'Mobile-first responsive design',
      'Dark mode support',
      'Loading states for all async operations'
    ],
    category: 'design'
  }
]

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [standards, setStandards] = useState<CompanyStandard[]>(mockStandards)
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set())
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleTicket = (ticketId: string) => {
    const newExpanded = new Set(expandedTickets)
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId)
    } else {
      newExpanded.add(ticketId)
    }
    setExpandedTickets(newExpanded)
  }

  const selectTicket = (ticketId: string) => {
    setSelectedTicket(ticketId)
    const ticket = tickets.find(t => t.id === ticketId)
    if (ticket) {
      // Pre-populate AI prompt with ticket context
      const relevantStandards = standards.filter(s => {
        if (ticket.workstream === 'foundation' && s.category === 'security') return true
        if (ticket.workstream === 'ui' && s.category === 'design') return true
        return false
      })

      const standardsContext = relevantStandards.map(s => 
        `${s.name}: ${s.requirements.join(', ')}`
      ).join('\n')

      setAiPrompt(`Analyze ticket ${ticket.id}: ${ticket.title}

Description: ${ticket.description}

Relevant Company Standards:
${standardsContext}

Please provide:
1. Implementation approach
2. Potential risks or blockers
3. Estimated effort
4. Recommended next steps`)
    }
  }

  const sendToAI = async () => {
    if (!selectedTicket || !aiPrompt) return

    setIsProcessing(true)
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/ai/analyze-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket,
          prompt: aiPrompt,
          standards: standards
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('AI Analysis:', result)
        // Handle the response - update UI, show analysis, etc.
      }
    } catch (error) {
      console.error('Error sending to AI:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />
      case 'in-progress': return <GitBranch className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Ticket Management</h1>
        <p className="text-muted-foreground mt-2">
          Review tickets, cross-reference with standards, and get AI insights
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Tickets</h2>
          {tickets.map((ticket) => {
            const isExpanded = expandedTickets.has(ticket.id)
            const isSelected = selectedTicket === ticket.id

            return (
              <Card 
                key={ticket.id} 
                className={cn(
                  "transition-all",
                  isSelected && "ring-2 ring-primary"
                )}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        {ticket.id}: {ticket.title}
                      </CardTitle>
                      <CardDescription>{ticket.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant="outline">{ticket.workstream}</Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Collapsible open={isExpanded}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTicket(ticket.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 mr-2" />
                          ) : (
                            <ChevronRight className="h-4 w-4 mr-2" />
                          )}
                          View Details
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4 space-y-4">
                        {ticket.acceptanceCriteria && (
                          <div>
                            <h4 className="font-semibold mb-2">Acceptance Criteria</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {ticket.acceptanceCriteria.map((criteria, i) => (
                                <li key={i}>{criteria}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {ticket.technicalRequirements && (
                          <div>
                            <h4 className="font-semibold mb-2">Technical Requirements</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {ticket.technicalRequirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {ticket.dependencies && (
                          <div>
                            <h4 className="font-semibold mb-2">Dependencies</h4>
                            <div className="flex gap-2">
                              {ticket.dependencies.map((dep) => (
                                <Badge key={dep} variant="secondary">{dep}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>

                    <Button
                      size="sm"
                      onClick={() => selectTicket(ticket.id)}
                      variant={isSelected ? 'default' : 'outline'}
                    >
                      Analyze with AI
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* AI Analysis Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription>
                Select a ticket to analyze it against company standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTicket ? (
                <>
                  <div>
                    <Badge variant="outline" className="mb-2">
                      Analyzing: {selectedTicket}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ai-prompt">Analysis Prompt</Label>
                    <Textarea
                      id="ai-prompt"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={10}
                      placeholder="Customize the AI analysis prompt..."
                    />
                  </div>

                  <Button
                    onClick={sendToAI}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Send to AI Model'}
                  </Button>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Select a ticket to begin analysis
                </p>
              )}
            </CardContent>
          </Card>

          {/* Company Standards Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Company Standards</CardTitle>
              <CardDescription>
                Active standards for cross-referencing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {standards.map((standard) => (
                  <div key={standard.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{standard.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {standard.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {standard.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}