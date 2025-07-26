import { useState, useMemo, useCallback } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  ColumnOrderState,
} from "@tanstack/react-table"

interface UseDataTableOptions<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  // Server-side options
  enableServerSide?: boolean
  pageCount?: number
  rowCount?: number
  // Initial state
  initialPagination?: PaginationState
  initialSorting?: SortingState
  initialColumnFilters?: ColumnFiltersState
  initialRowSelection?: RowSelectionState
  initialColumnVisibility?: VisibilityState
  initialColumnOrder?: ColumnOrderState
  // Feature flags
  enableRowSelection?: boolean
  enableColumnVisibility?: boolean
  enableGlobalFilter?: boolean
  enableColumnFilters?: boolean
  enablePagination?: boolean
  enableSorting?: boolean
  // Page size options
  pageSizeOptions?: number[]
  // Loading state
  loading?: boolean
  // Callbacks for server-side
  onServerSideChange?: (state: {
    pagination: PaginationState
    sorting: SortingState
    columnFilters: ColumnFiltersState
    globalFilter: string
  }) => void
}

interface UseDataTableReturn<TData> {
  // Table props
  tableProps: {
    columns: ColumnDef<TData, unknown>[]
    data: TData[]
    enableServerSide: boolean
    pageCount?: number
    rowCount?: number
    onPaginationChange: (pagination: PaginationState) => void
    onSortingChange: (sorting: SortingState) => void
    onColumnFiltersChange: (columnFilters: ColumnFiltersState) => void
    onRowSelectionChange: (rowSelection: RowSelectionState) => void
    onColumnVisibilityChange: (columnVisibility: VisibilityState) => void
    onColumnOrderChange: (columnOrder: ColumnOrderState) => void
    pagination: PaginationState
    sorting: SortingState
    columnFilters: ColumnFiltersState
    rowSelection: RowSelectionState
    columnVisibility: VisibilityState
    columnOrder: ColumnOrderState
    enableRowSelection: boolean
    enableColumnVisibility: boolean
    enableGlobalFilter: boolean
    enableColumnFilters: boolean
    enablePagination: boolean
    enableSorting: boolean
    pageSizeOptions: number[]
    loading: boolean
  }
  // State getters
  state: {
    pagination: PaginationState
    sorting: SortingState
    columnFilters: ColumnFiltersState
    rowSelection: RowSelectionState
    columnVisibility: VisibilityState
    columnOrder: ColumnOrderState
  }
  // State setters
  setPagination: (pagination: PaginationState | ((prev: PaginationState) => PaginationState)) => void
  setSorting: (sorting: SortingState | ((prev: SortingState) => SortingState)) => void
  setColumnFilters: (columnFilters: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void
  setRowSelection: (rowSelection: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => void
  setColumnVisibility: (columnVisibility: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void
  setColumnOrder: (columnOrder: ColumnOrderState | ((prev: ColumnOrderState) => ColumnOrderState)) => void
  // Utility functions
  resetSelection: () => void
  resetFilters: () => void
  resetSorting: () => void
  resetPagination: () => void
  resetAll: () => void
  // Selected data
  selectedData: TData[]
}

export function useDataTable<TData>({
  data,
  columns,
  enableServerSide = false,
  pageCount,
  rowCount,
  initialPagination = { pageIndex: 0, pageSize: 10 },
  initialSorting = [],
  initialColumnFilters = [],
  initialRowSelection = {},
  initialColumnVisibility = {},
  initialColumnOrder = [],
  enableRowSelection = true,
  enableColumnVisibility = true,
  enableGlobalFilter = true,
  enableColumnFilters = true,
  enablePagination = true,
  enableSorting = true,
  pageSizeOptions = [10, 20, 30, 40, 50],
  loading = false,
  onServerSideChange,
}: UseDataTableOptions<TData>): UseDataTableReturn<TData> {
  // State management
  const [pagination, setPagination] = useState<PaginationState>(initialPagination)
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialRowSelection)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility)
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialColumnOrder)
  const [globalFilter, setGlobalFilter] = useState("")

  // Server-side change handler
  const handleServerSideChange = useCallback(() => {
    if (enableServerSide && onServerSideChange) {
      onServerSideChange({
        pagination,
        sorting,
        columnFilters,
        globalFilter,
      })
    }
  }, [enableServerSide, onServerSideChange, pagination, sorting, columnFilters, globalFilter])

  // Call server-side handler when relevant state changes
  useMemo(() => {
    handleServerSideChange()
  }, [handleServerSideChange])

  // Enhanced handlers that work with server-side
  const handlePaginationChange = useCallback((newPagination: PaginationState) => {
    setPagination(newPagination)
  }, [])

  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting)
  }, [])

  const handleColumnFiltersChange = useCallback((newColumnFilters: ColumnFiltersState) => {
    setColumnFilters(newColumnFilters)
  }, [])

  const handleRowSelectionChange = useCallback((newRowSelection: RowSelectionState) => {
    setRowSelection(newRowSelection)
  }, [])

  const handleColumnVisibilityChange = useCallback((newColumnVisibility: VisibilityState) => {
    setColumnVisibility(newColumnVisibility)
  }, [])

  const handleColumnOrderChange = useCallback((newColumnOrder: ColumnOrderState) => {
    setColumnOrder(newColumnOrder)
  }, [])

  // Utility functions
  const resetSelection = useCallback(() => {
    setRowSelection({})
  }, [])

  const resetFilters = useCallback(() => {
    setColumnFilters([])
    setGlobalFilter("")
  }, [])

  const resetSorting = useCallback(() => {
    setSorting([])
  }, [])

  const resetPagination = useCallback(() => {
    setPagination(initialPagination)
  }, [initialPagination])

  const resetAll = useCallback(() => {
    resetSelection()
    resetFilters()
    resetSorting()
    resetPagination()
    setColumnVisibility(initialColumnVisibility)
    setColumnOrder(initialColumnOrder)
  }, [resetSelection, resetFilters, resetSorting, resetPagination, initialColumnVisibility, initialColumnOrder])

  // Get selected data
  const selectedData = useMemo(() => {
    const selectedRowIndices = Object.keys(rowSelection).filter(key => rowSelection[key])
    return selectedRowIndices.map(index => data[parseInt(index)]).filter(Boolean)
  }, [rowSelection, data])

  // Table props
  const tableProps = useMemo(
    () => ({
      columns,
      data,
      enableServerSide,
      pageCount,
      rowCount,
      onPaginationChange: handlePaginationChange,
      onSortingChange: handleSortingChange,
      onColumnFiltersChange: handleColumnFiltersChange,
      onRowSelectionChange: handleRowSelectionChange,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      onColumnOrderChange: handleColumnOrderChange,
      pagination,
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      columnOrder,
      enableRowSelection,
      enableColumnVisibility,
      enableGlobalFilter,
      enableColumnFilters,
      enablePagination,
      enableSorting,
      pageSizeOptions,
      loading,
    }),
    [
      columns,
      data,
      enableServerSide,
      pageCount,
      rowCount,
      handlePaginationChange,
      handleSortingChange,
      handleColumnFiltersChange,
      handleRowSelectionChange,
      handleColumnVisibilityChange,
      handleColumnOrderChange,
      pagination,
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      columnOrder,
      enableRowSelection,
      enableColumnVisibility,
      enableGlobalFilter,
      enableColumnFilters,
      enablePagination,
      enableSorting,
      pageSizeOptions,
      loading,
    ]
  )

  return {
    tableProps,
    state: {
      pagination,
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      columnOrder,
    },
    setPagination,
    setSorting,
    setColumnFilters,
    setRowSelection,
    setColumnVisibility,
    setColumnOrder,
    resetSelection,
    resetFilters,
    resetSorting,
    resetPagination,
    resetAll,
    selectedData,
  }
}

// Additional utility hooks for common patterns

// Hook for server-side data fetching
export function useServerSideDataTable<TData>({
  columns,
  fetchData,
  initialPageSize = 10,
  enableRowSelection = true,
  enableColumnVisibility = true,
  enableGlobalFilter = true,
  enableColumnFilters = true,
  enablePagination = true,
  enableSorting = true,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: {
  columns: ColumnDef<TData, unknown>[]
  fetchData: (params: {
    pagination: PaginationState
    sorting: SortingState
    columnFilters: ColumnFiltersState
    globalFilter: string
  }) => Promise<{
    data: TData[]
    pageCount: number
    rowCount: number
  }>
  initialPageSize?: number
  enableRowSelection?: boolean
  enableColumnVisibility?: boolean
  enableGlobalFilter?: boolean
  enableColumnFilters?: boolean
  enablePagination?: boolean
  enableSorting?: boolean
  pageSizeOptions?: number[]
}) {
  const [data, setData] = useState<TData[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleServerSideChange = useCallback(
    async (state: {
      pagination: PaginationState
      sorting: SortingState
      columnFilters: ColumnFiltersState
      globalFilter: string
    }) => {
      try {
        setLoading(true)
        const result = await fetchData(state)
        setData(result.data)
        setPageCount(result.pageCount)
        setRowCount(result.rowCount)
      } catch (error) {
        console.error("Error fetching table data:", error)
      } finally {
        setLoading(false)
      }
    },
    [fetchData]
  )

  const table = useDataTable({
    data,
    columns,
    enableServerSide: true,
    pageCount,
    rowCount,
    initialPagination: { pageIndex: 0, pageSize: initialPageSize },
    enableRowSelection,
    enableColumnVisibility,
    enableGlobalFilter,
    enableColumnFilters,
    enablePagination,
    enableSorting,
    pageSizeOptions,
    loading,
    onServerSideChange: handleServerSideChange,
  })

  return {
    ...table,
    loading,
    refetch: () => handleServerSideChange({
      pagination: table.state.pagination,
      sorting: table.state.sorting,
      columnFilters: table.state.columnFilters,
      globalFilter: "",
    }),
  }
}

// Hook for client-side data table with easy column definitions
export function useClientSideDataTable<TData>({
  data,
  columns,
  enableRowSelection = true,
  enableColumnVisibility = true,
  enableGlobalFilter = true,
  enableColumnFilters = true,
  enablePagination = true,
  enableSorting = true,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  enableRowSelection?: boolean
  enableColumnVisibility?: boolean
  enableGlobalFilter?: boolean
  enableColumnFilters?: boolean
  enablePagination?: boolean
  enableSorting?: boolean
  initialPageSize?: number
  pageSizeOptions?: number[]
}) {
  return useDataTable({
    data,
    columns,
    enableServerSide: false,
    initialPagination: { pageIndex: 0, pageSize: initialPageSize },
    enableRowSelection,
    enableColumnVisibility,
    enableGlobalFilter,
    enableColumnFilters,
    enablePagination,
    enableSorting,
    pageSizeOptions,
    loading: false,
  })
}