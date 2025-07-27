/**
 * Zustand Usage Examples
 * 
 * Demonstrates proper usage of the new Zustand data store
 * following official best practices.
 */

'use client';

import React, { useEffect } from 'react';
import { useDataStore } from '@/stores/data-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Trash2 } from 'lucide-react';

// ===== CEO DASHBOARD EXAMPLE =====
export function CEODashboardExample() {
    const personal = useDataStore((state) => state.personal);
    const loading = useDataStore((state) => state.loading.personal);
    const fetchAllPersonalData = useDataStore((state) => state.fetchAllPersonalData);
    const invalidatePersonalData = useDataStore((state) => state.invalidatePersonalData);
    const getSkillFitProgress = useDataStore((state) => state.getSkillFitProgress);

    // Auto-fetch on mount
    useEffect(() => {
        fetchAllPersonalData();
    }, [fetchAllPersonalData]);

    const skillFitProgress = getSkillFitProgress();
    const isLoading = Object.values(loading).some(Boolean);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    CEO Dashboard Data
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchAllPersonalData()}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            Refresh
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => invalidatePersonalData()}
                        >
                            <Trash2 className="h-4 w-4" />
                            Invalidate
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Skill Fit Progress */}
                <div>
                    <h3 className="font-medium mb-2">Skill Fit Progress</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{skillFitProgress.current}%</span>
                        <Badge variant={skillFitProgress.status === 'improving' ? 'default' :
                            skillFitProgress.status === 'declining' ? 'destructive' : 'secondary'}>
                            {skillFitProgress.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {skillFitProgress.trend > 0 ? '+' : ''}{skillFitProgress.trend}%
                        </span>
                    </div>
                </div>

                {/* Loading States */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(loading).map(([key, isLoading]) => (
                        <div key={key} className="flex items-center gap-2">
                            <Badge variant={isLoading ? 'default' : 'secondary'}>
                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : '✓'}
                                {key}
                            </Badge>
                        </div>
                    ))}
                </div>

                {/* Data Preview */}
                <div className="space-y-2">
                    <h3 className="font-medium">Data Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>Metrics: {personal.metrics ? '✓ Loaded' : '⏳ Loading...'}</div>
                        <div>Goals: {personal.goals ? '✓ Loaded' : '⏳ Loading...'}</div>
                        <div>Game Stats: {personal.gameStats ? '✓ Loaded' : '⏳ Loading...'}</div>
                        <div>Learning: {personal.learning ? '✓ Loaded' : '⏳ Loading...'}</div>
                        <div>Interventions: {personal.interventions.length} items</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ===== WORKER DASHBOARD EXAMPLE =====
export function WorkerDashboardExample() {
    const team = useDataStore((state) => state.team);
    const loading = useDataStore((state) => state.loading.team);
    const fetchAllTeamData = useDataStore((state) => state.fetchAllTeamData);
    const invalidateTeamData = useDataStore((state) => state.invalidateTeamData);
    const getAtRiskLearners = useDataStore((state) => state.getAtRiskLearners);

    // Auto-fetch with filters
    useEffect(() => {
        fetchAllTeamData({ status: 'active' });
    }, [fetchAllTeamData]);

    const atRiskLearners = getAtRiskLearners();
    const isLoading = Object.values(loading).some(Boolean);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Worker Dashboard Data
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchAllTeamData({ status: 'active' })}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        Refresh Team Data
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Team Stats */}
                {team.stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{team.stats.totalLearners}</div>
                            <div className="text-sm text-muted-foreground">Total Learners</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{team.stats.averageSkillFit}%</div>
                            <div className="text-sm text-muted-foreground">Avg Skill Fit</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{atRiskLearners.length}</div>
                            <div className="text-sm text-muted-foreground">At Risk</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{team.stats.weeklyActive}</div>
                            <div className="text-sm text-muted-foreground">Weekly Active</div>
                        </div>
                    </div>
                )}

                {/* Learners Info */}
                {team.learners && (
                    <div>
                        <h3 className="font-medium mb-2">Learners Data</h3>
                        <div className="text-sm text-muted-foreground">
                            {team.learners.data.length} learners loaded
                            (Page {team.learners.pagination.page} of {Math.ceil(team.learners.pagination.total / team.learners.pagination.limit)})
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ===== DATA STALENESS EXAMPLE =====
export function DataStalenessExample() {
    const isDataStale = useDataStore((state) => state.isDataStale);
    const invalidateAllData = useDataStore((state) => state.invalidateAllData);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Data Staleness Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-lg font-bold">
                            {isDataStale('personal', 'metrics') ? '🔴 Stale' : '🟢 Fresh'}
                        </div>
                        <div className="text-sm text-muted-foreground">Personal Metrics</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold">
                            {isDataStale('team', 'stats') ? '🔴 Stale' : '🟢 Fresh'}
                        </div>
                        <div className="text-sm text-muted-foreground">Team Stats</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold">
                            {isDataStale('organization', 'kpis') ? '🔴 Stale' : '🟢 Fresh'}
                        </div>
                        <div className="text-sm text-muted-foreground">Organization KPIs</div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => invalidateAllData()}
                    >
                        Invalidate All Data
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// ===== INDIVIDUAL DATA HOOKS EXAMPLE =====
export function IndividualDataExample() {
    // Example of fetching individual data types
    const metrics = useDataStore((state) => state.personal.metrics);
    const isLoadingMetrics = useDataStore((state) => state.loading.personal.metrics);
    const fetchMetrics = useDataStore((state) => state.fetchPersonalMetrics);
    const invalidateMetrics = useDataStore((state) => state.invalidatePersonalData);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Individual Data Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={() => fetchMetrics()}
                        disabled={isLoadingMetrics}
                    >
                        {isLoadingMetrics ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch Metrics'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => invalidateMetrics(['metrics'])}
                    >
                        Invalidate Metrics
                    </Button>
                </div>

                {metrics && (
                    <div className="space-y-2">
                        <h3 className="font-medium">Personal Metrics</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Skill Fit: {metrics.skillFit}%</div>
                            <div>Game Index: {metrics.gameIndex}</div>
                            <div>Grit Score: {metrics.gritScore}</div>
                            <div>Overall Progress: {metrics.overallProgress}%</div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ===== MAIN DEMO COMPONENT =====
export function ZustandUsageDemo() {
    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Zustand Store Usage Examples</h1>
                <p className="text-muted-foreground">
                    Demonstrates proper usage of the new Zustand data store following official best practices.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CEODashboardExample />
                <WorkerDashboardExample />
                <DataStalenessExample />
                <IndividualDataExample />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Key Zustand Patterns Used</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li>• <strong>Selective Subscriptions:</strong> Only subscribe to the data you need</li>
                        <li>• <strong>Async Actions:</strong> Data fetching directly in store actions</li>
                        <li>• <strong>Staleness Checking:</strong> Automatic data freshness validation</li>
                        <li>• <strong>Granular Invalidation:</strong> Invalidate specific data types</li>
                        <li>• <strong>Built-in Persistence:</strong> Timestamps persist across sessions</li>
                        <li>• <strong>Permission Integration:</strong> Better Auth permissions checked within actions</li>
                        <li>• <strong>Simple State Management:</strong> No complex caching logic, just Zustand best practices</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
} 