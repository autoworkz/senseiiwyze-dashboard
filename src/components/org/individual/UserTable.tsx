'use client'

import { useState } from 'react'
import { MoreHorizontal, MessageSquare, Calendar, BookOpen, User } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { IndividualLearner } from './types'
import { getReadinessColor, getStatusBadgeClasses, getStatusLabel } from '@/utils/readinessColors'
import { TrendIcon, getTrendLabel } from '@/utils/trendIcon'

interface UserTableProps {
    learners: IndividualLearner[]
    selectedLearners: string[]
    onLearnerSelect: (learnerId: string) => void
    onSelectAll: (selected: boolean) => void
    onLearnerClick: (learner: IndividualLearner) => void
    isLoading?: boolean
}

export function UserTable({
    learners,
    selectedLearners,
    onLearnerSelect,
    onSelectAll,
    onLearnerClick,
    isLoading = false
}: UserTableProps) {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)

    const isAllSelected = learners.length > 0 && selectedLearners.length === learners.length
    const isPartiallySelected = selectedLearners.length > 0 && selectedLearners.length < learners.length

    const formatLastActivity = (activity: string) => {
        // Simple formatter - in real app would use proper date formatting
        return activity
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg animate-pulse">
                        <div className="h-10 w-10 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-1/4"></div>
                            <div className="h-3 bg-muted rounded w-1/6"></div>
                        </div>
                        <div className="h-4 bg-muted rounded w-20"></div>
                        <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (learners.length === 0) {
        return (
            <div className="text-center py-12">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No learners found</h3>
                <p className="text-sm text-muted-foreground">
                    Try adjusting your search criteria or filters to find learners.
                </p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12">
                        <Checkbox
                            checked={isAllSelected}
                            ref={(el) => {
                                if (el) (el as any).indeterminate = isPartiallySelected
                            }}
                            onCheckedChange={onSelectAll}
                            aria-label="Select all learners"
                        />
                    </TableHead>
                    <TableHead>Learner</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Overall Readiness</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="w-12"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {learners.map((learner) => {
                    const isSelected = selectedLearners.includes(learner.id)
                    const isHovered = hoveredRow === learner.id

                    return (
                        <TableRow
                            key={learner.id}
                            className={`cursor-pointer transition-colors ${isSelected ? 'bg-muted/50' : ''
                                } ${isHovered ? 'bg-muted/30' : ''} hover:bg-muted/40`}
                            onMouseEnter={() => setHoveredRow(learner.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                        >
                            <TableCell>
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => onLearnerSelect(learner.id)}
                                    aria-label={`Select ${learner.name}`}
                                />
                            </TableCell>

                            <TableCell>
                                <div
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => onLearnerClick(learner)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={learner.avatar} alt={learner.name} />
                                        <AvatarFallback className="text-sm font-medium">
                                            {getInitials(learner.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-foreground hover:text-primary transition-colors">
                                            {learner.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{learner.role}</div>
                                        {learner.manager && (
                                            <div className="text-xs text-muted-foreground">
                                                Reports to: {learner.manager}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <span className="text-sm text-muted-foreground">{learner.department}</span>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-3 min-w-[120px]">
                                    <Progress
                                        value={learner.overallReadiness}
                                        className="w-16 h-2"
                                    />
                                    <span className={`font-medium text-sm ${getReadinessColor(learner.overallReadiness)}`}>
                                        {learner.overallReadiness}%
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <TrendIcon
                                        trend={learner.trend}
                                        className="h-3 w-3"
                                    />
                                    <span className="sr-only">{getTrendLabel(learner.trend)}</span>
                                </div>
                            </TableCell>

                            <TableCell>
                                <Badge className={getStatusBadgeClasses(learner.status)}>
                                    {getStatusLabel(learner.status)}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {formatLastActivity(learner.lastActivity)}
                                </span>
                            </TableCell>

                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            aria-label={`Actions for ${learner.name}`}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => onLearnerClick(learner)}
                                            className="flex items-center gap-2"
                                        >
                                            <User className="h-4 w-4" />
                                            View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link href={`/user-dashboard/${learner.id}/program-readiness`} passHref>
                                                <a className="flex items-center gap-2 w-full">
                                                    <BookOpen className="h-4 w-4" />
                                                    Individual Program Readiness Snapshot
                                                </a>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Schedule Coaching
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            Assign Training
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            Send Message
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
