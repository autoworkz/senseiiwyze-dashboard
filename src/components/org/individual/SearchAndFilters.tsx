'use client'

import { Search, Filter, Download, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LearnerFilters } from './types'

interface SearchAndFiltersProps {
    filters: LearnerFilters
    onFiltersChange: (filters: Partial<LearnerFilters>) => void
    resultCount: number
    isLoading?: boolean
}

export function SearchAndFilters({
    filters,
    onFiltersChange,
    resultCount,
    isLoading = false
}: SearchAndFiltersProps) {
    const handleSearchChange = (value: string) => {
        onFiltersChange({ search: value })
    }

    const handleDepartmentChange = (value: string) => {
        onFiltersChange({ department: value })
    }

    const handleStatusChange = (value: string) => {
        onFiltersChange({ status: value as any })
    }

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('-')
        onFiltersChange({
            sortBy: sortBy as any,
            sortOrder: sortOrder as 'asc' | 'desc'
        })
    }

    const clearFilters = () => {
        onFiltersChange({
            search: '',
            department: 'all',
            status: 'all',
            sortBy: 'name',
            sortOrder: 'asc'
        })
    }

    const hasActiveFilters = filters.search ||
        filters.department !== 'all' ||
        filters.status !== 'all' ||
        filters.sortBy !== 'name' ||
        filters.sortOrder !== 'asc'

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {/* Main Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, role, email, or department..."
                                value={filters.search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                disabled={isLoading}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Advanced
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                disabled={isLoading}
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Department Filter */}
                        <Select
                            value={filters.department}
                            onValueChange={handleDepartmentChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                <SelectItem value="Engineering">Engineering</SelectItem>
                                <SelectItem value="Product">Product</SelectItem>
                                <SelectItem value="Design">Design</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Sales">Sales</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select
                            value={filters.status}
                            onValueChange={handleStatusChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="ready">Ready for Deployment</SelectItem>
                                <SelectItem value="needs-coaching">Needs Coaching</SelectItem>
                                <SelectItem value="at-risk">At Risk</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort Options */}
                        <Select
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onValueChange={handleSortChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                                <SelectItem value="readiness-desc">Readiness (High-Low)</SelectItem>
                                <SelectItem value="readiness-asc">Readiness (Low-High)</SelectItem>
                                <SelectItem value="lastActivity-desc">Recent Activity</SelectItem>
                                <SelectItem value="trend-desc">Improving First</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters */}
                        <div className="flex items-center gap-2">
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    disabled={isLoading}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {isLoading ? 'Loading...' : `${resultCount} learners found`}
                            </span>
                            {hasActiveFilters && (
                                <Badge variant="secondary" className="text-xs">
                                    Filtered
                                </Badge>
                            )}
                        </div>

                        {/* Active Filter Tags */}
                        {(filters.search || filters.department !== 'all' || filters.status !== 'all') && (
                            <div className="flex items-center gap-1">
                                {filters.search && (
                                    <Badge variant="outline" className="text-xs">
                                        Search: "{filters.search}"
                                    </Badge>
                                )}
                                {filters.department !== 'all' && (
                                    <Badge variant="outline" className="text-xs">
                                        {filters.department}
                                    </Badge>
                                )}
                                {filters.status !== 'all' && (
                                    <Badge variant="outline" className="text-xs">
                                        {filters.status === 'needs-coaching' ? 'Needs Coaching' :
                                            filters.status === 'at-risk' ? 'At Risk' :
                                                filters.status === 'ready' ? 'Ready' :
                                                    filters.status}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 