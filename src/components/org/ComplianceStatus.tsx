'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface ComplianceStatusProps {
    data?: any[] | null
    isLoading?: boolean
}

export function ComplianceStatus({ data, isLoading }: ComplianceStatusProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Compliance Status
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

    const complianceItems = [
        { name: 'GDPR Compliance', status: 'compliant', deadline: null },
        { name: 'SOX Training', status: 'warning', deadline: '15 days' },
        { name: 'Security Certifications', status: 'compliant', deadline: null },
        { name: 'Industry Standards', status: 'pending', deadline: '7 days' },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Compliance Status
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {complianceItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {item.status === 'compliant' && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {item.status === 'warning' && (
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                            )}
                            {item.status === 'pending' && (
                                <Clock className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {item.status === 'compliant' && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                    Compliant
                                </Badge>
                            )}
                            {item.status === 'warning' && (
                                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                    {item.deadline} left
                                </Badge>
                            )}
                            {item.status === 'pending' && (
                                <Badge variant="destructive" className="text-xs">
                                    {item.deadline} left
                                </Badge>
                            )}
                        </div>
                    </div>
                ))}

                <div className="pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                        Next audit: Q2 2024 • 2 items need attention
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 