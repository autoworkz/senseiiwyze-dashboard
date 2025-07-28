'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDataStore } from '@/stores/data-store'
import { useEffect } from 'react'

export function TeamReadinessSnapshotCard() {
    const { teamReadiness, loading, fetchTeamReadiness } = useDataStore((state) => ({
        teamReadiness: state.organization.teamReadiness,
        loading: state.loading.organization.teamReadiness,
        fetchTeamReadiness: state.fetchTeamReadiness,
    }))

    // Fetch data on mount if not available
    useEffect(() => {
        if (!teamReadiness && !loading) {
            fetchTeamReadiness()
        }
    }, [teamReadiness, loading, fetchTeamReadiness])

    if (loading) {
        return <Skeleton className="h-[140px] w-full" />
    }

    if (!teamReadiness) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Team Readiness Snapshot</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground">
                        No readiness data available
                    </div>
                </CardContent>
            </Card>
        )
    }

    const { readyForDeployment, needsCoaching, avgReadiness } = teamReadiness

    return (
        <Card>
            <CardHeader>
                <CardTitle>Team Readiness Snapshot</CardTitle>
                <p className="text-sm text-muted-foreground">Quick operational overview</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <SnapshotStat
                        value={`${readyForDeployment}%`}
                        label="Ready for Deployment"
                        accent="green"
                    />
                    <SnapshotStat
                        value={`${needsCoaching}%`}
                        label="Need Coaching"
                        accent="amber"
                    />
                    <SnapshotStat
                        value={`${avgReadiness}%`}
                        label="Avg. Readiness"
                    />
                </div>
            </CardContent>
        </Card>
    )
}

function SnapshotStat({
    value,
    label,
    accent,
}: {
    value: string
    label: string
    accent?: 'green' | 'amber'
}) {
    const accentClasses =
        accent === 'green'
            ? 'text-green-600'
            : accent === 'amber'
                ? 'text-amber-600'
                : 'text-foreground'

    return (
        <div>
            <div className={`text-2xl font-bold ${accentClasses}`}>{value}</div>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    )
} 