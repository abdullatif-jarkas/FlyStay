import { TableContainerProps } from "../../types/tables";
import DataTable from "./DataTable";
import TablePagination from "./TablePagination";

function TableContainer<T>({
  title,
  data,
  columns,
  loading = false,
  sorting = [],
  onSortingChange,
  pagination,
  onPageChange,
  emptyMessage = "No data available",
  actions,
  className = "",
}: TableContainerProps<T>) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Section */}
      {(title || actions) && (
        <div className="pt-3 pl-3 flex items-center justify-between">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-8 shadow-sm border border-gray-200 overflow-hidden">
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          sorting={sorting}
          onSortingChange={onSortingChange}
          emptyMessage={emptyMessage}
        />

        {/* Pagination Section */}
        {pagination && onPageChange && (
          <TablePagination
            pagination={pagination}
            onPageChange={onPageChange}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

export default TableContainer;
