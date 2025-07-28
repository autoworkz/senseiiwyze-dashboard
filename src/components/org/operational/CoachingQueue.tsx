'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

// Mock coaching queue data
const coachingQueue = [
    { name: 'John Doe', riskLevel: 'High', readiness: 45, issues: 3 },
    { name: 'Jane Smith', riskLevel: 'Medium', readiness: 62, issues: 2 },
    { name: 'Bob Johnson', riskLevel: 'High', readiness: 38, issues: 4 },
]

export function CoachingQueue() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Coaching Queue</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Learner</TableHead>
                            <TableHead>Risk Level</TableHead>
                            <TableHead>Readiness</TableHead>
                            <TableHead>Issues</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coachingQueue.map((learner, index) => (
                            <TableRow key={index}>
                                <TableCell>{learner.name}</TableCell>
                                <TableCell>
                                    <Badge variant={learner.riskLevel === 'High' ? 'destructive' : 'secondary'}>{learner.riskLevel}</Badge>
                                </TableCell>
                                <TableCell>{learner.readiness}%</TableCell>
                                <TableCell>{learner.issues}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
} 