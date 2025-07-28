'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { IndividualLearner, LearnerFilters } from './types'
import { SummaryStatsCards } from './SummaryStatsCards'
import { SearchAndFilters } from './SearchAndFilters'
import { UserTable } from './UserTable'
import { mockLearners, calculateSummaryStats } from '@/services/mockLearnerData'

// Default filter state
const defaultFilters: LearnerFilters = {
    search: '',
    department: 'all',
    status: 'all',
    readinessRange: { min: 0, max: 100 },
    sortBy: 'name',
    sortOrder: 'asc'
}

export function IndividualTrackingDashboard() {
    const [filters, setFilters] = useState<LearnerFilters>(defaultFilters)
    const [selectedTab, setSelectedTab] = useState('all')
    const [selectedLearners, setSelectedLearners] = useState<string[]>([])
    const [selectedLearner, setSelectedLearner] = useState<IndividualLearner | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Filter and sort learners
    const filteredLearners = useMemo(() => {
        let filtered = [...mockLearners]

        // Apply search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase()
            filtered = filtered.filter(learner =>
                learner.name.toLowerCase().includes(searchTerm) ||
                learner.role.toLowerCase().includes(searchTerm) ||
                learner.email.toLowerCase().includes(searchTerm) ||
                learner.department.toLowerCase().includes(searchTerm)
            )
        }

        // Apply department filter
        if (filters.department !== 'all') {
            filtered = filtered.filter(learner => learner.department === filters.department)
        }

        // Apply status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(learner => learner.status === filters.status)
        }

        // Apply tab filter
        if (selectedTab !== 'all') {
            filtered = filtered.filter(learner => {
                switch (selectedTab) {
                    case 'ready':
                        return learner.status === 'ready'
                    case 'coaching':
                        return learner.status === 'needs-coaching'
                    case 'at-risk':
                        return learner.status === 'at-risk' || learner.status === 'critical'
                    default:
                        return true
                }
            })
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue: any, bValue: any

            switch (filters.sortBy) {
                case 'name':
                    aValue = a.name
                    bValue = b.name
                    break
                case 'readiness':
                    aValue = a.overallReadiness
                    bValue = b.overallReadiness
                    break
                case 'lastActivity':
                    // Simple string comparison for demo - would use proper date parsing in real app
                    aValue = a.lastActivity
                    bValue = b.lastActivity
                    break
                case 'trend':
                    const trendOrder = { up: 3, stable: 2, down: 1 }
                    aValue = trendOrder[a.trend]
                    bValue = trendOrder[b.trend]
                    break
                default:
                    return 0
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase()
                bValue = bValue.toLowerCase()
            }

            if (filters.sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
        })

        return filtered
    }, [filters, selectedTab, mockLearners])

    // Calculate stats for current filtered view
    const currentStats = useMemo(() => {
        return calculateSummaryStats(filteredLearners)
    }, [filteredLearners])

    // Tab counts
    const tabCounts = useMemo(() => {
        const allLearners = filters.search || filters.department !== 'all' || filters.status !== 'all'
            ? filteredLearners
            : mockLearners

        return {
            all: allLearners.length,
            ready: allLearners.filter(l => l.status === 'ready').length,
            coaching: allLearners.filter(l => l.status === 'needs-coaching').length,
            atRisk: allLearners.filter(l => l.status === 'at-risk' || l.status === 'critical').length
        }
    }, [filteredLearners, filters, mockLearners])

    // Handle filter changes
    const handleFiltersChange = (newFilters: Partial<LearnerFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }

    // Handle learner selection
    const handleLearnerSelect = (learnerId: string) => {
        setSelectedLearners(prev =>
            prev.includes(learnerId)
                ? prev.filter(id => id !== learnerId)
                : [...prev, learnerId]
        )
    }

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedLearners(filteredLearners.map(l => l.id))
        } else {
            setSelectedLearners([])
        }
    }

    const handleLearnerClick = (learner: IndividualLearner) => {
        setSelectedLearner(learner)
    }

    const handleBulkAction = (action: string) => {
        console.log(`Performing ${action} on`, selectedLearners)
        // Implement bulk actions here
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                    Individual Tracking
                </h2>
                <p className="text-muted-foreground">
                    Detailed learner readiness tracking and personalized coaching recommendations
                </p>
            </div>

            {/* Summary Statistics */}
            <SummaryStatsCards stats={currentStats} isLoading={isLoading} />

            {/* Search and Filters */}
            <SearchAndFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                resultCount={filteredLearners.length}
                isLoading={isLoading}
            />

            {/* Tab Navigation */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <div className="flex items-center justify-between">
                    <TabsList className="grid grid-cols-4 w-fit">
                        <TabsTrigger value="all">All Users ({tabCounts.all})</TabsTrigger>
                        <TabsTrigger value="ready">Ready ({tabCounts.ready})</TabsTrigger>
                        <TabsTrigger value="coaching">Needs Coaching ({tabCounts.coaching})</TabsTrigger>
                        <TabsTrigger value="at-risk">At Risk ({tabCounts.atRisk})</TabsTrigger>
                    </TabsList>

                    {/* Bulk Actions */}
                    {selectedLearners.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {selectedLearners.length} selected
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBulkAction('schedule-coaching')}
                            >
                                Schedule Coaching
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBulkAction('assign-training')}
                            >
                                Assign Training
                            </Button>
                        </div>
                    )}
                </div>

                <TabsContent value={selectedTab} className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>
                                    {selectedTab === 'all' && 'All Learners'}
                                    {selectedTab === 'ready' && 'Ready for Deployment'}
                                    {selectedTab === 'coaching' && 'Needs Coaching'}
                                    {selectedTab === 'at-risk' && 'At Risk'}
                                </span>
                                {selectedLearners.length === 0 && (
                                    <div className="flex items-center gap-2">
                                        <Checkbox />
                                        <span className="text-sm text-muted-foreground">Select All</span>
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UserTable
                                learners={filteredLearners}
                                selectedLearners={selectedLearners}
                                onLearnerSelect={handleLearnerSelect}
                                onSelectAll={handleSelectAll}
                                onLearnerClick={handleLearnerClick}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Individual Learner Detail Sheet */}
            <Sheet open={!!selectedLearner} onOpenChange={() => setSelectedLearner(null)}>
                <SheetContent className="w-full sm:max-w-2xl">
                    {selectedLearner && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">Individual Profile</h3>
                                <p className="text-sm text-muted-foreground">
                                    Detailed view coming soon - will match MagicPatterns design
                                </p>
                                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                    <h4 className="font-medium">{selectedLearner.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedLearner.role} • {selectedLearner.department}
                                    </p>
                                    <p className="text-lg font-semibold mt-2">
                                        {selectedLearner.overallReadiness}% Ready
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
} 