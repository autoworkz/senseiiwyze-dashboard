// Type-safe wrapper interfaces for TanStack Table
export interface TableInstance<TData = unknown> {
  getHeaderGroups(): Array<{
    id: string
    headers: HeaderInstance<TData>[]
  }>
  getRowModel(): {
    rows: RowInstance<TData>[]
  }
  getFilteredRowModel(): {
    rows: RowInstance<TData>[]
  }
  getFilteredSelectedRowModel(): {
    rows: RowInstance<TData>[]
  }
  getState(): {
    pagination: { pageIndex: number; pageSize: number }
    sorting: Array<{ id: string; desc: boolean }>
    columnFilters: Array<{ id: string; value: unknown }>
    rowSelection: Record<string, boolean>
    columnVisibility: Record<string, boolean>
  }
  setPageSize(size: number): void
  setPageIndex(index: number): void
  previousPage(): void
  nextPage(): void
  getCanPreviousPage(): boolean
  getCanNextPage(): boolean
  getPageCount(): number
  resetRowSelection(): void
  getAllColumns(): ColumnInstance<TData>[]
  toggleAllPageRowsSelected(selected?: boolean): void
}

export interface HeaderInstance<TData = unknown> {
  id: string
  isPlaceholder: boolean
  column: ColumnInstance<TData>
  getContext(): unknown
}

export interface ColumnInstance<TData = unknown> {
  id: string
  getCanSort(): boolean
  getCanFilter(): boolean
  getCanHide(): boolean
  getIsVisible(): boolean
  toggleVisibility(visible?: boolean): void
  getIsSorted(): false | "asc" | "desc"
  toggleSorting(desc?: boolean): void
  getFilterValue(): unknown
  setFilterValue(value: unknown): void
  columnDef: {
    header: unknown
    accessorFn?: (data: TData) => unknown
  }
}

export interface RowInstance<TData = unknown> {
  id: string
  original: TData
  getIsSelected(): boolean
  toggleSelected(selected?: boolean): void
  getVisibleCells(): CellInstance<TData>[]
}

export interface CellInstance<TData = unknown> {
  id: string
  column: ColumnInstance<TData>
  getContext(): unknown
}