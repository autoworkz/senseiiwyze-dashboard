'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// Mock user data
const users = [
    { name: 'Alice Johnson', role: 'Developer', readiness: 85, status: 'Ready' },
    { name: 'Bob Smith', role: 'Designer', readiness: 72, status: 'Needs Coaching' },
    { name: 'Charlie Brown', role: 'Manager', readiness: 92, status: 'Ready' },
    { name: 'David Wilson', role: 'Developer', readiness: 68, status: 'At Risk' },
]

export function UserReadinessTable() {
    const [search, setSearch] = useState('')

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Readiness</CardTitle>
            </CardHeader>
            <CardContent>
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4"
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Readiness</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.readiness}%</TableCell>
                                <TableCell>
                                    <Badge variant={user.status === 'Ready' ? 'default' : user.status === 'Needs Coaching' ? 'secondary' : 'destructive'}>
                                        {user.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
} 