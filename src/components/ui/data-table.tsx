"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
  OnChangeFn,
  PaginationState,
  ColumnOrderState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { TableInstance, HeaderInstance, ColumnInstance } from "@/types/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  // Server-side props
  enableServerSide?: boolean
  pageCount?: number
  rowCount?: number
  onPaginationChange?: OnChangeFn<PaginationState>
  onSortingChange?: OnChangeFn<SortingState>
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>
  // State
  pagination?: PaginationState
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
  rowSelection?: RowSelectionState
  columnVisibility?: VisibilityState
  columnOrder?: ColumnOrderState
  // UI Configuration
  enableRowSelection?: boolean
  enableColumnVisibility?: boolean
  enableGlobalFilter?: boolean
  enableColumnFilters?: boolean
  enablePagination?: boolean
  enableSorting?: boolean
  pageSizeOptions?: number[]
  className?: string
  // Loading state
  loading?: boolean
  // Custom filter placeholder
  filterPlaceholder?: string
  // No data message
  noDataMessage?: string
  // Action buttons
  actions?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableServerSide = false,
  pageCount = -1,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  onRowSelectionChange,
  onColumnVisibilityChange,
  onColumnOrderChange,
  pagination: controlledPagination,
  sorting: controlledSorting,
  columnFilters: controlledColumnFilters,
  rowSelection: controlledRowSelection,
  columnVisibility: controlledColumnVisibility,
  columnOrder: controlledColumnOrder,
  enableRowSelection = true,
  enableColumnVisibility = true,
  enableGlobalFilter = true,
  enableColumnFilters = true,
  enablePagination = true,
  enableSorting = true,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  loading = false,
  filterPlaceholder = "Filter...",
  noDataMessage = "No results found.",
  actions,
}: DataTableProps<TData, TValue>) {
  // Internal state (used when not server-side controlled)
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([])
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<VisibilityState>({})
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({})
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSizeOptions[0],
  })
  const [internalColumnOrder, setInternalColumnOrder] = React.useState<ColumnOrderState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Use controlled state when provided, otherwise use internal state
  const sorting = controlledSorting ?? internalSorting
  const columnFilters = controlledColumnFilters ?? internalColumnFilters
  const columnVisibility = controlledColumnVisibility ?? internalColumnVisibility
  const rowSelection = controlledRowSelection ?? internalRowSelection
  const pagination = controlledPagination ?? internalPagination
  const columnOrder = controlledColumnOrder ?? internalColumnOrder

  // Add row selection column if enabled
  const enhancedColumns = React.useMemo(() => {
    if (!enableRowSelection) return columns

    const selectionColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }

    return [selectionColumn, ...columns]
  }, [columns, enableRowSelection])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    pageCount: enableServerSide ? pageCount : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting && !enableServerSide ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableColumnFilters && !enableServerSide ? getFilteredRowModel() : undefined,
    onSortingChange: onSortingChange ?? setInternalSorting,
    onColumnFiltersChange: onColumnFiltersChange ?? setInternalColumnFilters,
    onColumnVisibilityChange: onColumnVisibilityChange ?? setInternalColumnVisibility,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    onPaginationChange: onPaginationChange ?? setInternalPagination,
    onColumnOrderChange: onColumnOrderChange ?? setInternalColumnOrder,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: enableRowSelection ? rowSelection : {},
      pagination: enablePagination ? pagination : { pageIndex: 0, pageSize: data.length },
      columnOrder,
      globalFilter,
    },
    manualPagination: enableServerSide,
    manualSorting: enableServerSide,
    manualFiltering: enableServerSide,
    enableRowSelection,
  })

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {enableGlobalFilter && (
            <Input
              placeholder={filterPlaceholder}
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          )}
          {enableColumnVisibility && (
            <ColumnVisibilityDropdown table={table} />
          )}
          {enableRowSelection && Object.keys(rowSelection).length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                {Object.keys(rowSelection).length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.resetRowSelection()}
                className="h-8 px-2 lg:px-3"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left">
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center space-x-2">
                        <SortableHeader header={header} enableSorting={enableSorting} />
                        {enableColumnFilters && header.column.getCanFilter() && (
                          <ColumnFilter column={header.column} />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={enhancedColumns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    row.getIsSelected() && "bg-muted/50"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={enhancedColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  )
}

// Sortable Header Component
function SortableHeader({ header, enableSorting }: { header: HeaderInstance; enableSorting: boolean }) {
  
  if (!enableSorting || !header.column.getCanSort()) {
    return (
      <div className="flex items-center">
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => header.column.toggleSorting()}
    >
      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
      {header.column.getIsSorted() === "desc" ? (
        <ChevronDown className="ml-2 h-4 w-4" />
      ) : header.column.getIsSorted() === "asc" ? (
        <ChevronUp className="ml-2 h-4 w-4" />
      ) : (
        <div className="ml-2 h-4 w-4" />
      )}
    </Button>
  )
}

// Column Filter Component
function ColumnFilter({ column }: { column: ColumnInstance }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
          <div className="space-y-2">
            <h4 className="font-medium">Filter {column.id}</h4>
            <Input
              placeholder={`Filter ${column.id}...`}
              value={(columnFilterValue as string) ?? ""}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className="h-8"
            />
            {columnFilterValue && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => column.setFilterValue("")}
                className="h-8 w-full"
              >
                Clear filter
              </Button>
            )}
          </div>
        </PopoverContent>
    </Popover>
  )
}

// Column Visibility Dropdown
function ColumnVisibilityDropdown({ table }: { table: TableInstance }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          View
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
                {table
          .getAllColumns()
          .filter((column) => typeof column.columnDef.accessorFn !== "undefined" && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Pagination Component
function DataTablePagination({ table, pageSizeOptions }: { table: TableInstance; pageSizeOptions: number[] }) {
  
      return (
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    )
}