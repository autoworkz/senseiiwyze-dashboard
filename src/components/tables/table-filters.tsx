"use client"

import * as React from "react"
import { CalendarIcon, Check, Plus, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

// Filter Types
export interface FilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface FilterConfig {
  id: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number'
  placeholder?: string
  options?: FilterOption[]
  min?: number
  max?: number
}

export interface FilterValue {
  id: string
  value: any
  label?: string
}

interface TableFiltersProps {
  filters: FilterConfig[]
  values: FilterValue[]
  onChange: (values: FilterValue[]) => void
  className?: string
}

export function TableFilters({ filters, values, onChange, className }: TableFiltersProps) {
  const updateFilter = (filterId: string, value: any, label?: string) => {
    const newValues = values.filter(f => f.id !== filterId)
    if (value !== undefined && value !== null && value !== '') {
      newValues.push({ id: filterId, value, label })
    }
    onChange(newValues)
  }

  const removeFilter = (filterId: string) => {
    onChange(values.filter(f => f.id !== filterId))
  }

  const clearAllFilters = () => {
    onChange([])
  }

  const activeFilters = values.filter(f => f.value !== undefined && f.value !== null && f.value !== '')

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <FilterControl
            key={filter.id}
            filter={filter}
            value={values.find(v => v.id === filter.id)?.value}
            onChange={(value, label) => updateFilter(filter.id, value, label)}
          />
        ))}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => {
            const config = filters.find(f => f.id === filter.id)
            return (
              <Badge key={filter.id} variant="secondary" className="gap-1">
                <span className="font-medium">{config?.label}:</span>
                <span>{filter.label || String(filter.value)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => removeFilter(filter.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}

interface FilterControlProps {
  filter: FilterConfig
  value: any
  onChange: (value: any, label?: string) => void
key?: string;
}

function FilterControl({ filter, value, onChange }: FilterControlProps) {
  const [open, setOpen] = React.useState(false)

  switch (filter.type) {
    case 'text':
      return (
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor={filter.id} className="text-xs font-medium">
            {filter.label}
          </Label>
          <Input
            id={filter.id}
            placeholder={filter.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-[150px]"
          />
        </div>
      )

    case 'number':
      return (
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor={filter.id} className="text-xs font-medium">
            {filter.label}
          </Label>
          <Input
            id={filter.id}
            type="number"
            placeholder={filter.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            min={filter.min}
            max={filter.max}
            className="h-8 w-[120px]"
          />
        </div>
      )

    case 'select':
      return (
        <div className="flex flex-col space-y-1.5">
          <Label className="text-xs font-medium">{filter.label}</Label>
          <Select value={value || ''} onValueChange={(val) => {
            const option = filter.options?.find(opt => opt.value === val)
            onChange(val, option?.label)
          }}>
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )

    case 'multiselect':
      const selectedValues = Array.isArray(value) ? value : []
      return (
        <div className="flex flex-col space-y-1.5">
          <Label className="text-xs font-medium">{filter.label}</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="h-8 w-[200px] justify-between"
              >
                {selectedValues.length > 0
                  ? `${selectedValues.length} selected`
                  : filter.placeholder}
                <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search options..." />
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {filter.options?.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          const newValues = selectedValues.includes(option.value)
                            ? selectedValues.filter(v => v !== option.value)
                            : [...selectedValues, option.value]
                          const labels = newValues
                            .map(v => filter.options?.find(opt => opt.value === v)?.label)
                            .filter(Boolean)
                          onChange(newValues, labels.join(', '))
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )

    case 'date':
      return (
        <div className="flex flex-col space-y-1.5">
          <Label className="text-xs font-medium">{filter.label}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 w-[150px] justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "MMM dd, yyyy") : filter.placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )

    case 'daterange':
      const [from, to] = Array.isArray(value) ? value : [null, null]
      return (
        <div className="flex flex-col space-y-1.5">
          <Label className="text-xs font-medium">{filter.label}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 w-[200px] justify-start text-left font-normal",
                  !from && !to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {from && to
                  ? `${format(new Date(from), "MMM dd")} - ${format(new Date(to), "MMM dd")}`
                  : from
                  ? format(new Date(from), "MMM dd, yyyy")
                  : filter.placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={from && to ? { from: new Date(from), to: new Date(to) } : undefined}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onChange([range.from.toISOString(), range.to.toISOString()])
                  } else if (range?.from) {
                    onChange([range.from.toISOString(), null])
                  } else {
                    onChange([null, null])
                  }
                }}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )

    default:
      return null
  }
}