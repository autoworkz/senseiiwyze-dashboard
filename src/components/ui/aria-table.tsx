import * as React from "react"
import { useTable, useTableCell, useTableColumnHeader, useTableRow, useTableRowGroup, useTableSelectAllCheckbox, useTableSelectionCheckbox } from "@react-aria/table"
import { useTableState } from "@react-stately/table"
import { useFocusRing } from "@react-aria/focus"
import { mergeProps } from "@react-aria/utils"
import { TableProps } from "@react-types/table"
import { GridNode } from "@react-stately/grid"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { AriaCheckbox } from "./aria-checkbox"

export interface AriaTableProps<T> extends TableProps<T> {
  className?: string
  /**
   * Whether the table should be compact
   */
  isCompact?: boolean
  /**
   * Whether to show borders
   */
  showBorders?: boolean
  /**
   * Whether to show striped rows
   */
  isStriped?: boolean
}

function AriaTable<T extends object>({
  className,
  isCompact = false,
  showBorders = true,
  isStriped = false,
  ...props
}: AriaTableProps<T>) {
  const state = useTableState(props)
  const ref = React.useRef<HTMLTableElement>(null)
  const { collection } = state
  const { gridProps } = useTable(props, state, ref)

  return (
    <div className="relative w-full overflow-auto">
      <table
        {...gridProps}
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm",
          {
            "border-collapse border border-border": showBorders,
          },
          className
        )}
      >
        <TableRowGroup type="thead">
          {collection.headerRows.map((headerRow) => (
            <TableHeaderRow
              key={headerRow.key}
              item={headerRow}
              state={state}
              isCompact={isCompact}
              showBorders={showBorders}
            />
          ))}
        </TableRowGroup>
        <TableRowGroup type="tbody">
          {[...collection.body.childNodes].map((row) => (
            <TableRow
              key={row.key}
              item={row}
              state={state}
              isCompact={isCompact}
              showBorders={showBorders}
              isStriped={isStriped}
            />
          ))}
        </TableRowGroup>
      </table>
    </div>
  )
}

interface TableRowGroupProps {
  type: "thead" | "tbody" | "tfoot"
  children: React.ReactNode
}

function TableRowGroup({ type, children }: TableRowGroupProps) {
  const { rowGroupProps } = useTableRowGroup()

  return React.createElement(
    type,
    {
      ...rowGroupProps,
      className: cn({
        "[&_tr]:border-b": type === "tbody",
        "border-b": type === "thead",
      }),
    },
    children
  )
}

interface TableHeaderRowProps<T> {
  item: GridNode<T>
  state: ReturnType<typeof useTableState>
  isCompact: boolean
  showBorders: boolean
}

function TableHeaderRow<T>({ item, state, isCompact, showBorders }: TableHeaderRowProps<T>) {
  const ref = React.useRef<HTMLTableRowElement>(null)
  const { rowProps } = useTableRow({ node: item }, state, ref)

  return (
    <tr {...rowProps} ref={ref} className="border-b transition-colors hover:bg-muted/50">
      {[...item.childNodes].map((cell) => (
        <TableColumnHeader
          key={cell.key}
          column={cell}
          state={state}
          isCompact={isCompact}
          showBorders={showBorders}
        />
      ))}
    </tr>
  )
}

interface TableColumnHeaderProps<T> {
  column: GridNode<T>
  state: ReturnType<typeof useTableState>
  isCompact: boolean
  showBorders: boolean
}

function TableColumnHeader<T>({ column, state, isCompact, showBorders }: TableColumnHeaderProps<T>) {
  const ref = React.useRef<HTMLTableCellElement>(null)
  const { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref)
  const { isFocusVisible, focusProps } = useFocusRing()
  const mergedProps = mergeProps(columnHeaderProps, focusProps)

  const allowsSorting = column.props?.allowsSorting
  const sortDirection = state.sortDescriptor?.column === column.key ? state.sortDescriptor.direction : undefined

  return (
    <th
      {...mergedProps}
      ref={ref}
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        {
          "h-8 px-1": isCompact,
          "border-r border-border": showBorders,
          "cursor-pointer hover:bg-muted/50": allowsSorting,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2": isFocusVisible,
        }
      )}
    >
      <div className="flex items-center space-x-2">
        {column.props?.isSelectionCell ? (
          <SelectAllCheckbox state={state} />
        ) : (
          <>
            <span>{column.rendered}</span>
            {allowsSorting && (
              <span className="ml-2 flex-shrink-0">
                {sortDirection === "ascending" ? (
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                ) : sortDirection === "descending" ? (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronsUpDown className="h-4 w-4" aria-hidden="true" />
                )}
              </span>
            )}
          </>
        )}
      </div>
    </th>
  )
}

interface SelectAllCheckboxProps {
  state: ReturnType<typeof useTableState>
}

function SelectAllCheckbox({ state }: SelectAllCheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null)
  const { checkboxProps } = useTableSelectAllCheckbox(state, ref)

  return (
    <AriaCheckbox
      {...checkboxProps}
      ref={ref}
      size="sm"
    />
  )
}

interface TableRowProps<T> {
  item: GridNode<T>
  state: ReturnType<typeof useTableState>
  isCompact: boolean
  showBorders: boolean
  isStriped: boolean
}

function TableRow<T>({ item, state, isCompact, showBorders, isStriped }: TableRowProps<T>) {
  const ref = React.useRef<HTMLTableRowElement>(null)
  const { rowProps } = useTableRow({ node: item }, state, ref)
  const isSelected = state.selectionManager.isSelected(item.key)

  return (
    <tr
      {...rowProps}
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        {
          "bg-muted/25": isStriped && Number(item.key) % 2 === 1,
          "bg-muted": isSelected,
        }
      )}
      data-state={isSelected ? "selected" : undefined}
    >
      {[...item.childNodes].map((cell) => (
        <TableCell
          key={cell.key}
          cell={cell}
          state={state}
          isCompact={isCompact}
          showBorders={showBorders}
        />
      ))}
    </tr>
  )
}

interface TableCellProps<T> {
  cell: GridNode<T>
  state: ReturnType<typeof useTableState>
  isCompact: boolean
  showBorders: boolean
}

function TableCell<T>({ cell, state, isCompact, showBorders }: TableCellProps<T>) {
  const ref = React.useRef<HTMLTableCellElement>(null)
  const { gridCellProps } = useTableCell({ node: cell }, state, ref)
  const { isFocusVisible, focusProps } = useFocusRing()
  const mergedProps = mergeProps(gridCellProps, focusProps)

  return (
    <td
      {...mergedProps}
      ref={ref}
      className={cn(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        {
          "p-1": isCompact,
          "border-r border-border": showBorders,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2": isFocusVisible,
        }
      )}
    >
      {cell.props?.isSelectionCell ? (
        <SelectionCheckbox cell={cell} state={state} />
      ) : (
        cell.rendered
      )}
    </td>
  )
}

interface SelectionCheckboxProps<T> {
  cell: GridNode<T>
  state: ReturnType<typeof useTableState>
}

function SelectionCheckbox<T>({ cell, state }: SelectionCheckboxProps<T>) {
  const ref = React.useRef<HTMLInputElement>(null)
  const { checkboxProps } = useTableSelectionCheckbox(
    { key: cell.parentKey! },
    state,
    ref
  )

  return (
    <AriaCheckbox
      {...checkboxProps}
      ref={ref}
      size="sm"
    />
  )
}

export { AriaTable }
export type { AriaTableProps }
