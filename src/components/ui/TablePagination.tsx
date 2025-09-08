import React from "react";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { TablePaginationProps } from "../../types/tables";

const TablePagination: React.FC<TablePaginationProps> = ({
  pagination,
  onPageChange,
  loading = false,
  showInfo = true,
}) => {
  const {
    current_page,
    total_pages,
    next_page_url,
    prev_page_url,
    total,
    per_page,
    from,
    to,
  } = pagination;

  const canGoPrevious = prev_page_url !== null && !loading;
  const canGoNext = next_page_url !== null && !loading;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= total_pages && !loading) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, current_page - delta);
      i <= Math.min(total_pages - 1, current_page + delta);
      i++
    ) {
      range.push(i);
    }

    if (current_page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current_page + delta < total_pages - 1) {
      rangeWithDots.push("...", total_pages);
    } else if (total_pages > 1) {
      rangeWithDots.push(total_pages);
    }

    return rangeWithDots;
  };

  if (total_pages <= 1) {
    return null;
  }

  return (
    <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      {/* Info Section */}
      {showInfo && total && per_page && from && to && (
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{from}</span> to{" "}
          <span className="font-medium">{to}</span> of{" "}
          <span className="font-medium">{total}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={current_page === 1 || loading}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to first page"
        >
          <FiChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => handlePageChange(current_page - 1)}
          disabled={!canGoPrevious}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to previous page"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => {
            if (page === "...") {
              return (
                <span key={index} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === current_page;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                disabled={loading}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-500 text-white"
                    : "text-gray-700 hover:bg-gray-50 border border-gray-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => handlePageChange(current_page + 1)}
          disabled={!canGoNext}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to next page"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => handlePageChange(total_pages)}
          disabled={current_page === total_pages || loading}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to last page"
        >
          <FiChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
