import React from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';
import { HotelPaginationProps } from '../../types/hotel';


const HotelPagination: React.FC<HotelPaginationProps> = ({
  currentPage,
  totalPages,
  totalResults,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  onGoToPage,
  loading = false,
}) => {
  // Don't show pagination if there's only one page or no results
  if (totalPages <= 1 || totalResults === 0) {
    return null;
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex flex-col justify-center sm:flex-row items-center justify-between">
        {/* Pagination controls */}
        <div className="flex items-center space-x-1">
          {/* First page button */}
          <button
            onClick={() => onGoToPage(1)}
            disabled={!hasPrevPage || loading}
            className={`
              relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium
              ${!hasPrevPage || loading
                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }
            `}
            title="First page"
          >
            <FaAngleDoubleLeft className="h-3 w-3" />
          </button>

          {/* Previous page button */}
          <button
            onClick={onPrevPage}
            disabled={!hasPrevPage || loading}
            className={`
              relative inline-flex items-center px-2 py-2 border text-sm font-medium
              ${!hasPrevPage || loading
                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }
            `}
            title="Previous page"
          >
            <FaChevronLeft className="h-3 w-3" />
          </button>

          {/* Page numbers */}
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onGoToPage(page as number)}
                  disabled={loading}
                  className={`
                    relative inline-flex items-center px-4 py-2 border text-sm font-medium
                    ${currentPage === page
                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                      : loading
                      ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }
                  `}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Next page button */}
          <button
            onClick={onNextPage}
            disabled={!hasNextPage || loading}
            className={`
              relative inline-flex items-center px-2 py-2 border text-sm font-medium
              ${!hasNextPage || loading
                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }
            `}
            title="Next page"
          >
            <FaChevronRight className="h-3 w-3" />
          </button>

          {/* Last page button */}
          <button
            onClick={() => onGoToPage(totalPages)}
            disabled={!hasNextPage || loading}
            className={`
              relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium
              ${!hasNextPage || loading
                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }
            `}
            title="Last page"
          >
            <FaAngleDoubleRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-3 flex justify-center">
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
            Loading hotels...
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelPagination;
