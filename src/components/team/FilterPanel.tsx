'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'

interface FilterState {
  search?: string
  status?: string
  riskLevel?: string
  skillFit?: string
  showAtRiskOnly?: boolean
}

interface FilterPanelProps {
  onFiltersChange: (filters: FilterState) => void
  activeFilters: FilterState
}

export function FilterPanel({ onFiltersChange, activeFilters }: FilterPanelProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...activeFilters, search: value })
  }

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...activeFilters, status })
  }

  const handleRiskLevelChange = (riskLevel: string) => {
    onFiltersChange({ ...activeFilters, riskLevel })
  }

  const handleSkillFitChange = (skillFit: string) => {
    onFiltersChange({ ...activeFilters, skillFit })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      riskLevel: 'all',
      skillFit: 'all',
      showAtRiskOnly: false,
    })
  }

  const hasActiveFilters = Object.values(activeFilters).some(value => 
    value !== '' && value !== 'all' && value !== false
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Learners</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={activeFilters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={activeFilters.status || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Risk Level Filter */}
        <div className="space-y-2">
          <Label>Risk Level</Label>
          <Select value={activeFilters.riskLevel || 'all'} onValueChange={handleRiskLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="All risk levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Skill Fit Filter */}
        <div className="space-y-2">
          <Label>Skill Fit Range</Label>
          <Select value={activeFilters.skillFit || 'all'} onValueChange={handleSkillFitChange}>
            <SelectTrigger>
              <SelectValue placeholder="All skill fits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ranges</SelectItem>
              <SelectItem value="high">80-100%</SelectItem>
              <SelectItem value="medium">60-79%</SelectItem>
              <SelectItem value="low">Below 60%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* At Risk Only Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="at-risk-only"
            checked={activeFilters.showAtRiskOnly || false}
            onCheckedChange={(checked) => 
              onFiltersChange({ ...activeFilters, showAtRiskOnly: checked === true })
            }
          />
          <Label htmlFor="at-risk-only" className="text-sm">
            Show at-risk learners only
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}
