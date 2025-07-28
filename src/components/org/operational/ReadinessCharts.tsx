'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

// Mock data for readiness distribution
const readinessData = [
    { level: 'High', value: 45, color: 'bg-green-500' },
    { level: 'Medium', value: 35, color: 'bg-yellow-500' },
    { level: 'Low', value: 20, color: 'bg-red-500' },
]

export function ReadinessCharts() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Readiness Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {readinessData.map((item) => (
                    <div key={item.level} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Badge variant="secondary">{item.level} Readiness</Badge>
                            <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                        <Progress value={item.value} className={`h-2 ${item.color}`} />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
} 