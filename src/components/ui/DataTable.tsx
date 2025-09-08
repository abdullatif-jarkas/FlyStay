import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { LuChevronsLeftRight } from "react-icons/lu";
import { DataTableProps } from "../../types/tables";

function DataTable<T>({
  data,
  columns,
  loading = false,
  sorting = [],
  onSortingChange,
  emptyMessage = "No data available",
  className = "",
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
  });

  if (loading) {
    return (
      <div className="bg-white rounded-8 shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-8 shadow-sm border border-gray-200 overflow-hidden ${className}`}
      role="region"
      aria-label="Data table"
    >
      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200"
          role="table"
          aria-label={`Table with ${data.length} rows`}
        >
          <thead className="bg-primary-500" role="rowgroup">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} role="row">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();
                  const headerContent = flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  );

                  return (
                    <th
                      key={header.id}
                      className={`px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider ${
                        canSort
                          ? "cursor-pointer select-none hover:bg-primary-600 transition-colors focus:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
                          : ""
                      }`}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      role={canSort ? "columnheader button" : "columnheader"}
                      tabIndex={canSort ? 0 : -1}
                      onKeyDown={
                        canSort
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }
                          : undefined
                      }
                      aria-sort={
                        canSort
                          ? sortDirection === "asc"
                            ? "ascending"
                            : sortDirection === "desc"
                            ? "descending"
                            : "none"
                          : undefined
                      }
                      aria-label={
                        canSort
                          ? `${headerContent}, sortable column, currently ${
                              sortDirection === "asc"
                                ? "sorted ascending"
                                : sortDirection === "desc"
                                ? "sorted descending"
                                : "not sorted"
                            }`
                          : `${headerContent}, column header`
                      }
                    >
                      <div className="flex items-center gap-2">
                        {headerContent}
                        {canSort && (
                          <span className="flex-shrink-0" aria-hidden="true">
                            {sortDirection === "asc" ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : sortDirection === "desc" ? (
                              <FiChevronDown className="w-4 h-4" />
                            ) : (
                              <LuChevronsLeftRight className="w-4 h-4 opacity-50" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200" role="rowgroup">
            {table.getRowModel().rows.length === 0 ? (
              <tr role="row">
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500 text-sm"
                  role="cell"
                  aria-label="No data available"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-primary-400/10 transition-colors focus-within:bg-primary-400/10`}
                  role="row"
                  aria-rowindex={index + 2}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      role="cell"
                      aria-describedby={
                        cellIndex === 0
                          ? `row-${index + 1}-description`
                          : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
