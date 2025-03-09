'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Third-party Imports
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef } from '@tanstack/react-table'
import {
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import classnames from 'classnames'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Type for state package data
export interface StatePackage {
  stateCode: string
  stateName: string
  packages: number
  averageDays: number
}

// Declare module for custom filter types
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Fuzzy filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Column Definitions
const columnHelper = createColumnHelper<StatePackage>()

interface StatePackagesTableProps {
  stateData: StatePackage[]
  title?: string
  subheader?: string
}

const StatePackagesTable = ({ stateData, title = 'State Package Distribution', subheader = 'Number of packages by state' }: StatePackagesTableProps) => {
  // States
  const [sorting, setSorting] = useState<SortingState>([{ id: 'packages', desc: true }]) // Default sort by packages descending
  const [data] = useState(stateData)
  const [rowsPerPage, setRowsPerPage] = useState<number>(50)
  const [page, setPage] = useState<number>(0)

  const columns = useMemo<ColumnDef<StatePackage, any>[]>(
    () => [
      columnHelper.accessor('stateName', {
        header: 'Estado',
        cell: ({ row }) => <Typography>{row.original.stateName}</Typography>
      }),
      columnHelper.accessor('averageDays', {
        header: 'Prazo Médio',
        cell: ({ row }) => (
          <Typography fontWeight="bold" color="primary">
            {row.original.averageDays.toLocaleString()}
          </Typography>
        )
      }),
      columnHelper.accessor('packages', {
        header: 'Pacotes',
        cell: ({ row }) => (
          <Typography fontWeight="bold" color="primary">
            {row.original.packages.toLocaleString()}
          </Typography>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      sorting,
      pagination: {
        pageIndex: page,
        pageSize: rowsPerPage
      }
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Box sx={{ height: "400px", overflowY: "auto" }}>
      <div className="overflow-y-auto">
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} style={{ width: header.column.getSize() }}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={classnames({
                            "flex items-center": header.column.getIsSorted(),
                            "cursor-pointer select-none": header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className="ri-arrow-up-s-line text-xl" />,
                            desc: <i className="ri-arrow-down-s-line text-xl" />
                          }[header.column.getIsSorted() as "asc" | "desc"] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {table.getRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className="text-center">
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </Box>
  );
}

export default StatePackagesTable 