// Main Components
export { DataTable } from "@/components/ui/data-table"

// Hooks
export {
  useDataTable,
  useClientSideDataTable,
  useServerSideDataTable,
} from "@/hooks/use-data-table"

// Utility Functions
export {
  createActionsColumn,
  createStatusColumn,
  createDateColumn,
  createCurrencyColumn,
  createAvatarColumn,
  createBooleanColumn,
  createEmailColumn,
  createPhoneColumn,
  createLinkColumn,
  createProgressColumn,
  createNumberColumn,
  createTextColumn,
  commonActions,
  statusPresets,
} from "@/lib/table-utils"

// Types
export type {
  TableAction,
  StatusOption,
  AvatarData,
} from "@/lib/table-utils"

export type {
  TableInstance,
  HeaderInstance,
  ColumnInstance,
  RowInstance,
  CellInstance,
} from "@/types/table"

// Re-export TanStack Table types that are commonly used
export type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  ColumnOrderState,
} from "@tanstack/react-table"