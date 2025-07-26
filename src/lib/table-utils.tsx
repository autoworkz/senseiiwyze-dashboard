import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash, 
  Copy,
  Download,
  ExternalLink,
  Check,
  X,
  Calendar,
  Mail,
  Phone,
  User,
  AlertCircle,
  Clock
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Type definitions for common data patterns
export interface TableAction<TData> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (row: TData) => void
  variant?: "default" | "destructive" | "secondary"
  disabled?: (row: TData) => boolean
  hidden?: (row: TData) => boolean
}

export interface StatusOption {
  value: string | number
  label: string
  color?: "default" | "secondary" | "destructive" | "outline"
  icon?: React.ComponentType<{ className?: string }>
}

export interface AvatarData {
  src?: string
  fallback: string
  name?: string
}

// Utility function to create action columns
export function createActionsColumn<TData>(
  actions: TableAction<TData>[]
): ColumnDef<TData> {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original
      const visibleActions = actions.filter(action => !action.hidden?.(data))

      if (visibleActions.length === 0) return null

      if (visibleActions.length === 1) {
        const action = visibleActions[0]
        const Icon = action.icon
        return (
          <Button
            variant={action.variant === "destructive" ? "destructive" : "ghost"}
            size="sm"
            onClick={() => action.onClick(data)}
            disabled={action.disabled?.(data)}
            className="h-8 w-8 p-0"
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span className="sr-only">{action.label}</span>
          </Button>
        )
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {visibleActions.map((action, index) => {
              const Icon = action.icon
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.onClick(data)}
                  disabled={action.disabled?.(data)}
                  className={cn(
                    action.variant === "destructive" && "text-destructive focus:text-destructive"
                  )}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,
  }
}

// Utility function to create status/badge columns
export function createStatusColumn<TData>(
  accessorKey: keyof TData,
  options: StatusOption[],
  header: string = "Status"
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue }) => {
      const value = getValue() as string | number
      const option = options.find(opt => opt.value === value)
      
      if (!option) return <span className="text-muted-foreground">Unknown</span>

      const Icon = option.icon

      return (
        <Badge variant={option.color || "default"} className="flex items-center gap-1">
          {Icon && <Icon className="h-3 w-3" />}
          {option.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  }
}

// Utility function to create date columns
export function createDateColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  formatString: string = "MMM dd, yyyy",
  includeTime: boolean = false
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue }) => {
      const date = getValue() as Date | string | null
      if (!date) return <span className="text-muted-foreground">—</span>
      
      const dateObj = date instanceof Date ? date : new Date(date)
      const formatted = format(dateObj, includeTime ? `${formatString} HH:mm` : formatString)
      
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatted}</span>
        </div>
      )
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId) as string | Date)
      const dateB = new Date(rowB.getValue(columnId) as string | Date)
      return dateA.getTime() - dateB.getTime()
    },
  }
}

// Utility function to create currency columns
export function createCurrencyColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  currency: string = "USD",
  locale: string = "en-US"
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue }) => {
      const amount = getValue() as number
      if (amount == null) return <span className="text-muted-foreground">—</span>
      
      const formatted = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(amount)
      
      return (
        <span className={cn(
          "font-medium",
          amount < 0 ? "text-destructive" : "text-foreground"
        )}>
          {formatted}
        </span>
      )
    },
    sortingFn: "alphanumeric",
  }
}

// Utility function to create avatar columns
export function createAvatarColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  nameKey?: keyof TData
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue, row }) => {
      const avatar = getValue() as AvatarData | string | null
      const name = nameKey ? (row.getValue(nameKey as string) as string) : undefined
      
      if (typeof avatar === "string") {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            {name && <span>{name}</span>}
          </div>
        )
      }
      
      if (avatar && typeof avatar === "object") {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar.src} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
            {(avatar.name || name) && <span>{avatar.name || name}</span>}
          </div>
        )
      }
      
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          {name && <span>{name}</span>}
        </div>
      )
    },
    enableSorting: false,
  }
}

// Utility function to create boolean columns
export function createBooleanColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  trueLabel: string = "Yes",
  falseLabel: string = "No"
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue }) => {
      const value = getValue() as boolean
      return (
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span>{trueLabel}</span>
            </>
          ) : (
            <>
              <X className="h-4 w-4 text-red-600" />
              <span>{falseLabel}</span>
            </>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as boolean
      return value.includes(rowValue.toString())
    },
  }
}

// Utility function to create email columns
export function createEmailColumn<TData>(
  accessorKey: keyof TData,
  header: string = "Email"
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue }) => {
      const email = getValue() as string
      if (!email) return <span className="text-muted-foreground">—</span>
      
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a
            href={`mailto:${email}`}
            className="text-primary hover:underline"
          >
            {email}
          </a>
        </div>
      )
    },
  }
}

// Utility function to create phone columns
export function createPhoneColumn<TData>(
  accessorKey: keyof TData,
  header: string = "Phone"
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue }) => {
      const phone = getValue() as string
      if (!phone) return <span className="text-muted-foreground">—</span>
      
      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a
            href={`tel:${phone}`}
            className="text-primary hover:underline"
          >
            {phone}
          </a>
        </div>
      )
    },
  }
}

// Utility function to create link columns
export function createLinkColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  external: boolean = false
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue }) => {
      const url = getValue() as string
      if (!url) return <span className="text-muted-foreground">—</span>
      
      return (
        <div className="flex items-center gap-2">
          {external ? (
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
          <a
            href={url}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="text-primary hover:underline"
          >
            {external ? new URL(url).hostname : "View"}
          </a>
        </div>
      )
    },
    enableSorting: false,
  }
}

// Utility function to create progress/percentage columns
export function createProgressColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  max: number = 100
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue }) => {
      const value = getValue() as number
      if (value == null) return <span className="text-muted-foreground">—</span>
      
      const percentage = Math.min((value / max) * 100, 100)
      
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  }
}

// Utility function to create number columns with formatting
export function createNumberColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  options?: Intl.NumberFormatOptions
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue }) => {
      const value = getValue() as number
      if (value == null) return <span className="text-muted-foreground">—</span>
      
      const formatted = new Intl.NumberFormat("en-US", options).format(value)
      
      return <span className="font-medium">{formatted}</span>
    },
    sortingFn: "alphanumeric",
  }
}

// Common action presets
export const commonActions = {
  view: <TData,>(onClick: (row: TData) => void): TableAction<TData> => ({
    label: "View",
    icon: Eye,
    onClick,
  }),
  
  edit: <TData,>(onClick: (row: TData) => void): TableAction<TData> => ({
    label: "Edit",
    icon: Edit,
    onClick,
  }),
  
  delete: <TData,>(onClick: (row: TData) => void): TableAction<TData> => ({
    label: "Delete",
    icon: Trash,
    onClick,
    variant: "destructive" as const,
  }),
  
  copy: <TData,>(onClick: (row: TData) => void): TableAction<TData> => ({
    label: "Copy",
    icon: Copy,
    onClick,
  }),
  
  download: <TData,>(onClick: (row: TData) => void): TableAction<TData> => ({
    label: "Download",
    icon: Download,
    onClick,
  }),
}

// Common status presets
export const statusPresets = {
  active: {
    value: "active",
    label: "Active",
    color: "default" as const,
    icon: Check,
  },
  
  inactive: {
    value: "inactive",
    label: "Inactive",
    color: "secondary" as const,
    icon: X,
  },
  
  pending: {
    value: "pending",
    label: "Pending",
    color: "outline" as const,
    icon: Clock,
  },
  
  error: {
    value: "error",
    label: "Error",
    color: "destructive" as const,
    icon: AlertCircle,
  },
}

// Quick column creator for simple text columns
export function createTextColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  options?: {
    enableSorting?: boolean
    enableFilter?: boolean
    className?: string
    transform?: (value: string) => string
  }
): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue }) => {
      const value = getValue() as string
      if (!value) return <span className="text-muted-foreground">—</span>
      
      const displayed = options?.transform ? options.transform(value) : value
      
      return <span className={options?.className}>{displayed}</span>
    },
    enableSorting: options?.enableSorting ?? true,
    enableHiding: true,
  }
}