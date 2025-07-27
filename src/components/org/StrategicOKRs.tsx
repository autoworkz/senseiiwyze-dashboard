'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Target, CheckCircle, Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface StrategicOKRsProps {
    data?: any[] | null
    isLoading?: boolean
}

export function StrategicOKRs({ data, isLoading }: StrategicOKRsProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Strategic OKRs
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardContent>
            </Card>
        )
    }

    const objectives = [
        {
            title: 'Increase Workforce Readiness',
            progress: 87,
            target: 90,
            deadline: 'Q2 2024',
            status: 'on-track'
        },
        {
            title: 'Reduce Training Costs',
            progress: 65,
            target: 75,
            deadline: 'Q3 2024',
            status: 'at-risk'
        },
        {
            title: 'Improve Completion Rate',
            progress: 92,
            target: 85,
            deadline: 'Q1 2024',
            status: 'completed'
        }
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'on-track':
                return 'bg-blue-100 text-blue-800'
            case 'at-risk':
                return 'bg-orange-100 text-orange-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-3 w-3" />
            case 'on-track':
                return <Target className="h-3 w-3" />
            case 'at-risk':
                return <Clock className="h-3 w-3" />
            default:
                return null
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Strategic OKRs
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {objectives.map((objective, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{objective.title}</span>
                                <Badge
                                    variant="secondary"
                                    className={`text-xs ${getStatusColor(objective.status)}`}
                                >
                                    {getStatusIcon(objective.status)}
                                    <span className="ml-1 capitalize">{objective.status.replace('-', ' ')}</span>
                                </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{objective.deadline}</span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{objective.progress}% / {objective.target}%</span>
                            </div>
                            <Progress
                                value={objective.progress}
                                className="h-2"
                            />
                        </div>
                    </div>
                ))}

                <div className="pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                        Q1 Summary: 1 completed, 1 on-track, 1 at-risk • Next review: Board meeting
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 