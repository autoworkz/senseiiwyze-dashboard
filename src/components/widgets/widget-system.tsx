"use client"

import * as React from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Settings, X, Plus, BarChart3, Users, TrendingUp, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Widget Configuration
export interface WidgetConfig {
  id: string
  type: string
  title: string
  description?: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  position?: { x: number; y: number }
  settings?: Record<string, any>
}

export interface WidgetType {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType<{ config: WidgetConfig; onUpdate: (config: WidgetConfig) => void }>
  defaultSize: 'sm' | 'md' | 'lg' | 'xl'
  defaultSettings?: Record<string, any>
}

// Predefined widget sizes
const WIDGET_SIZES = {
  sm: "col-span-1 row-span-1",
  md: "col-span-2 row-span-1", 
  lg: "col-span-2 row-span-2",
  xl: "col-span-4 row-span-2"
}

// Sample Widget Components
function MetricsWidget({ config, onUpdate }: { config: WidgetConfig; onUpdate: (config: WidgetConfig) => void }) {
  const { settings = {} } = config
  const value = settings.value || "1,234"
  const label = settings.label || "Total Users"
  const trend = settings.trend || "+12%"

  return (
    <div className="space-y-2">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm text-green-600 font-medium">{trend}</div>
    </div>
  )
}

function ChartWidget({ config, onUpdate }: { config: WidgetConfig; onUpdate: (config: WidgetConfig) => void }) {
  return (
    <div className="space-y-4">
      <div className="h-32 bg-accent/20 rounded-lg flex items-center justify-center">
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-sm text-muted-foreground">Sample chart data</div>
    </div>
  )
}

function TeamWidget({ config, onUpdate }: { config: WidgetConfig; onUpdate: (config: WidgetConfig) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="h-4 w-4" />
        </div>
        <div>
          <div className="font-medium">Team Status</div>
          <div className="text-sm text-muted-foreground">8 members online</div>
        </div>
      </div>
    </div>
  )
}

// Default widget types
const DEFAULT_WIDGET_TYPES: WidgetType[] = [
  {
    id: 'metrics',
    name: 'Metrics',
    description: 'Display key performance metrics',
    icon: TrendingUp,
    component: MetricsWidget,
    defaultSize: 'sm',
    defaultSettings: { value: "1,234", label: "Total Users", trend: "+12%" }
  },
  {
    id: 'chart',
    name: 'Chart',
    description: 'Data visualization charts',
    icon: BarChart3,
    component: ChartWidget,
    defaultSize: 'lg'
  },
  {
    id: 'team',
    name: 'Team Status',
    description: 'Team member status and activity',
    icon: Users,
    component: TeamWidget,
    defaultSize: 'md'
  }
]

// Sortable Widget Component
function SortableWidget({ 
  widget, 
  onUpdate, 
  onRemove, 
  isDragging = false 
}: { 
  widget: WidgetConfig | string
  onUpdate: (config: WidgetConfig) => void
  onRemove: (id: string) => void
  isDragging?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Find widget type
  const widgetType = DEFAULT_WIDGET_TYPES.find(type => type.id === widget.type)
  if (!widgetType) return null

  const WidgetComponent = widgetType.component

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        WIDGET_SIZES[widget.size],
        "relative",
        (isDragging || isSortableDragging) && "opacity-50"
      )}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 cursor-grab"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Widget Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onUpdate({ ...widget, size: 'sm' })}>
                    Small Size
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdate({ ...widget, size: 'md' })}>
                    Medium Size
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdate({ ...widget, size: 'lg' })}>
                    Large Size
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdate({ ...widget, size: 'xl' })}>
                    Extra Large
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onRemove(widget.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    Remove Widget
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <WidgetComponent config={widget} onUpdate={onUpdate} />
        </CardContent>
      </Card>
    </div>
  )
}

// Widget Dashboard Component
interface WidgetDashboardProps {
  widgets: WidgetConfig[] | T[] | WidgetConfig[]
  onWidgetsChange: (widgets: WidgetConfig[]) => void
  availableWidgets?: WidgetType[] | WidgetType
  editable?: boolean
  className?: string
}

export function WidgetDashboard({
  widgets,
  onWidgetsChange,
  availableWidgets = DEFAULT_WIDGET_TYPES,
  editable = true,
  className
}: WidgetDashboardProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setIsDragging(false)

    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex(widget => widget.id === active.id)
      const newIndex = widgets.findIndex(widget => widget.id === over?.id)
      
      onWidgetsChange(arrayMove(widgets, oldIndex, newIndex))
    }
  }

  const addWidget = (widgetType: WidgetType) => {
    const newWidget: WidgetConfig = {
      id: `${widgetType.id}-${Date.now()}`,
      type: widgetType.id,
      title: widgetType.name,
      size: widgetType.defaultSize,
      settings: widgetType.defaultSettings || {}
    }
    
    onWidgetsChange([...widgets, newWidget])
  }

  const updateWidget = (updatedWidget: WidgetConfig) => {
    onWidgetsChange(
      widgets.map(widget => 
        widget.id === updatedWidget.id ? updatedWidget : widget
      )
    )
  }

  const removeWidget = (widgetId: string) => {
    onWidgetsChange(widgets.filter(widget => widget.id !== widgetId))
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Add Widget Controls */}
      {editable && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Add Widget:</span>
          {availableWidgets.map((widgetType: WidgetType) => (
            <Button
              key={widgetType.id}
              variant="outline"
              size="sm"
              onClick={() => addWidget(widgetType)}
              className="gap-2"
            >
              <widgetType.icon className="h-4 w-4" />
              {widgetType.name}
            </Button>
          ))}
        </div>
      )}

      {/* Widget Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-4 gap-4 auto-rows-min">
            {widgets.map(widget => (
              <SortableWidget
                key={widget.id}
                widget={widget}
                onUpdate={updateWidget}
                onRemove={removeWidget}
                isDragging={isDragging}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty State */}
      {widgets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No widgets added yet</div>
          {editable && availableWidgets.length > 0 && (
            <Button onClick={() => addWidget(availableWidgets[0])} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Widget
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Hook for managing widget state
export function useWidgetDashboard(initialWidgets: WidgetConfig[] = []) {
  const [widgets, setWidgets] = React.useState<WidgetConfig[]>(initialWidgets)

  const addWidget = (widgetType: WidgetType) => {
    const newWidget: WidgetConfig = {
      id: `${widgetType.id}-${Date.now()}`,
      type: widgetType.id,
      title: widgetType.name,
      size: widgetType.defaultSize,
      settings: widgetType.defaultSettings || {}
    }
    
    setWidgets(prev => [...prev, newWidget])
  }

  const updateWidget = (updatedWidget: WidgetConfig) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === updatedWidget.id ? updatedWidget : widget
      )
    )
  }

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId))
  }

  const reorderWidgets = (newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets)
  }

  return {
    widgets,
    setWidgets,
    addWidget,
    updateWidget,
    removeWidget,
    reorderWidgets
  }
}