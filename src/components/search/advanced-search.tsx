"use client"

import * as React from "react"
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  User, 
  FileText, 
  Settings,
  ChevronDown,
  Calendar,
  Tag,
  SortAsc,
  SortDesc,
  Loader2
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export interface SearchFilter {
  id: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'text'
  options?: Array<{ label: string; value: string; icon?: React.ComponentType<{ className?: string }> }>
  value?: string | string[] | { from?: Date; to?: Date }
}

export interface SearchResult {
  id: string
  title: string
  description: string
  type: 'user' | 'document' | 'course' | 'team' | 'setting'
  category?: string
  tags?: string[]
  lastModified?: Date
  url?: string
  relevance?: number
}

export interface SearchSuggestion {
  id: string
  query: string
  type: 'recent' | 'popular' | 'suggested'
  count?: number
}

interface AdvancedSearchProps {
  placeholder?: string
  filters?: SearchFilter[]
  suggestions?: SearchSuggestion[]
  results?: SearchResult[]
  onSearch: (query: string, filters: SearchFilter[]) => void
  onResultClick?: (result: SearchResult) => void
  onSuggestionClick?: (suggestion: SearchSuggestion) => void
  loading?: boolean
  className?: string
}

export function AdvancedSearch({
  placeholder = "Search everything...",
  filters = [],
  suggestions = [],
  results = [],
  onSearch,
  onResultClick,
  onSuggestionClick,
  loading = false,
  className
}: AdvancedSearchProps) {
  const [query, setQuery] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState<SearchFilter[]>(filters)
  const [showFilters, setShowFilters] = React.useState(false)
  const [showResults, setShowResults] = React.useState(false)
  const [sortBy, setSortBy] = React.useState<'relevance' | 'date' | 'title'>('relevance')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')

  const hasActiveFilters = activeFilters.some(filter => 
    filter.value && 
    (Array.isArray(filter.value) ? filter.value.length > 0 : true)
  )

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery ?? query
    if (q.trim() || hasActiveFilters) {
      onSearch(q, activeFilters)
      setShowResults(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
    if (e.key === 'Escape') {
      setShowResults(false)
      setQuery("")
    }
  }

  const updateFilter = (filterId: string, value: any) => {
    setActiveFilters(prev => 
      prev.map(filter => 
        filter.id === filterId ? { ...filter, value } : filter
      )
    )
  }

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.map(filter => 
        filter.id === filterId ? { ...filter, value: undefined } : filter
      )
    )
  }

  const clearAllFilters = () => {
    setActiveFilters(prev => 
      prev.map(filter => ({ ...filter, value: undefined }))
    )
  }

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'course':
        return <FileText className="h-4 w-4" />
      case 'team':
        return <User className="h-4 w-4" />
      case 'setting':
        return <Settings className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4" />
      case 'popular':
        return <Search className="h-4 w-4" />
      case 'suggested':
        return <Search className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const sortedResults = React.useMemo(() => {
    const sorted = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return sortOrder === 'desc' 
            ? (b.relevance || 0) - (a.relevance || 0)
            : (a.relevance || 0) - (b.relevance || 0)
        case 'date':
          const aDate = a.lastModified || new Date(0)
          const bDate = b.lastModified || new Date(0)
          return sortOrder === 'desc' 
            ? bDate.getTime() - aDate.getTime()
            : aDate.getTime() - bDate.getTime()
        case 'title':
          return sortOrder === 'desc'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title)
        default:
          return 0
      }
    })
    return sorted
  }, [results, sortBy, sortOrder])

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          className="pl-9 pr-12"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className={cn(
              "h-4 w-4",
              hasActiveFilters && "text-primary"
            )} />
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {activeFilters.map(filter => {
            if (!filter.value) return null
            
            const displayValue = Array.isArray(filter.value) 
              ? filter.value.join(', ')
              : String(filter.value)
            
            return (
              <Badge key={filter.id} variant="secondary" className="gap-1">
                {filter.label}: {displayValue}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0"
                  onClick={() => removeFilter(filter.id)}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Search Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {filters.map(filter => (
                <div key={filter.id} className="space-y-2">
                  <label className="text-sm font-medium">{filter.label}</label>
                  {filter.type === 'select' && filter.options && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {(typeof filter.value === 'string' ? filter.value : "Select...")}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {filter.options.map(option => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => updateFilter(filter.id, option.value)}
                          >
                            {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  {filter.type === 'multiselect' && filter.options && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {Array.isArray(filter.value) && filter.value.length > 0
                            ? `${filter.value.length} selected`
                            : "Select..."}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {filter.options.map(option => (
                          <DropdownMenuCheckboxItem
                            key={option.value}
                            checked={(filter.value as string[] || []).includes(option.value)}
                            onCheckedChange={(checked) => {
                              const currentValues = (filter.value as string[]) || []
                              const newValues = checked
                                ? [...currentValues, option.value]
                                : currentValues.filter(v => v !== option.value)
                              updateFilter(filter.id, newValues)
                            }}
                          >
                            {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                            {option.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  {filter.type === 'text' && (
                    <Input
                      placeholder="Enter text..."
                      value={(filter.value as string) || ""}
                      onChange={(e) => updateFilter(filter.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All
              </Button>
              <Button onClick={() => handleSearch()}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results/Suggestions */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-40 mt-2 max-h-96 overflow-hidden">
          <Command>
            {query === "" && suggestions.length > 0 ? (
              // Show suggestions when no query
              <CommandList>
                <CommandGroup heading="Recent Searches">
                  {suggestions.filter(s => s.type === 'recent').map(suggestion => (
                    <CommandItem
                      key={suggestion.id}
                      value={suggestion.query}
                      onSelect={() => {
                        setQuery(suggestion.query)
                        onSuggestionClick?.(suggestion)
                        handleSearch(suggestion.query)
                      }}
                    >
                      {getSuggestionIcon(suggestion.type)}
                      <span className="ml-2">{suggestion.query}</span>
                      {suggestion.count && (
                        <Badge variant="secondary" className="ml-auto">
                          {suggestion.count}
                        </Badge>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Popular Searches">
                  {suggestions.filter(s => s.type === 'popular').map(suggestion => (
                    <CommandItem
                      key={suggestion.id}
                      value={suggestion.query}
                      onSelect={() => {
                        setQuery(suggestion.query)
                        onSuggestionClick?.(suggestion)
                        handleSearch(suggestion.query)
                      }}
                    >
                      {getSuggestionIcon(suggestion.type)}
                      <span className="ml-2">{suggestion.query}</span>
                      {suggestion.count && (
                        <Badge variant="secondary" className="ml-auto">
                          {suggestion.count}
                        </Badge>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            ) : (
              // Show search results
              <div>
                <div className="flex items-center justify-between p-3 border-b">
                  <span className="text-sm text-muted-foreground">
                    {results.length} results found
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Sort by {sortBy}
                        {sortOrder === 'desc' ? (
                          <SortDesc className="h-3 w-3" />
                        ) : (
                          <SortAsc className="h-3 w-3" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSortBy('relevance')}>
                        Relevance
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('date')}>
                        Date Modified
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('title')}>
                        Title
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        {sortOrder === 'desc' ? 'Ascending' : 'Descending'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CommandList>
                  <CommandEmpty>No results found</CommandEmpty>
                  {sortedResults.map(result => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => {
                        onResultClick?.(result)
                        setShowResults(false)
                      }}
                      className="flex flex-col items-start p-3 space-y-1"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {getResultIcon(result.type)}
                        <span className="font-medium">{result.title}</span>
                        {result.category && (
                          <Badge variant="outline" className="ml-auto">
                            {result.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {result.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {result.tags && result.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="h-5 text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {result.lastModified && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {result.lastModified.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </div>
            )}
          </Command>
        </Card>
      )}

      {/* Backdrop to close results */}
      {showResults && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  )
}

// Sample data for testing
export const sampleSearchFilters: SearchFilter[] = [
  {
    id: 'type',
    label: 'Content Type',
    type: 'multiselect',
    options: [
      { label: 'Users', value: 'user', icon: User },
      { label: 'Documents', value: 'document', icon: FileText },
      { label: 'Courses', value: 'course', icon: FileText },
      { label: 'Teams', value: 'team', icon: User },
      { label: 'Settings', value: 'setting', icon: Settings },
    ]
  },
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'All Categories', value: 'all' },
      { label: 'Learning', value: 'learning' },
      { label: 'Management', value: 'management' },
      { label: 'Analytics', value: 'analytics' },
      { label: 'Support', value: 'support' },
    ]
  }
]

export const sampleSearchSuggestions: SearchSuggestion[] = [
  { id: '1', query: 'user management', type: 'recent' },
  { id: '2', query: 'react course', type: 'recent' },
  { id: '3', query: 'team dashboard', type: 'popular', count: 45 },
  { id: '4', query: 'settings configuration', type: 'popular', count: 32 },
  { id: '5', query: 'analytics report', type: 'suggested' },
]

export const sampleSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'User Management Dashboard',
    description: 'Manage team members, roles, and permissions across your organization',
    type: 'setting',
    category: 'Management',
    tags: ['users', 'permissions', 'admin'],
    lastModified: new Date('2024-01-15'),
    relevance: 0.95
  },
  {
    id: '2',
    title: 'React Fundamentals Course',
    description: 'Learn the basics of React including components, state, and props',
    type: 'course',
    category: 'Learning',
    tags: ['react', 'javascript', 'frontend'],
    lastModified: new Date('2024-01-10'),
    relevance: 0.87
  },
  {
    id: '3',
    title: 'John Doe',
    description: 'Senior Developer - Engineering Team',
    type: 'user',
    category: 'Team',
    tags: ['developer', 'frontend', 'react'],
    lastModified: new Date('2024-01-12'),
    relevance: 0.76
  }
]