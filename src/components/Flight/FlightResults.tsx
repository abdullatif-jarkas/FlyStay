import { useState } from 'react';
import { 
  FaSort, 
  FaSortUp, 
  FaSortDown, 
  FaSpinner,
  FaExclamationTriangle,
  FaPlane
} from 'react-icons/fa';
import { FlightResultsProps, SORT_OPTIONS } from '../../types/flight';
import FlightCard from './FlightCard';

const FlightResults: React.FC<FlightResultsProps> = ({
  flights,
  loading,
  error,
  sortBy,
  onSortChange,
  onFlightSelect,
  onViewDetails,
  onAddToFavorites,
  pagination
}) => {
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);

  const handleFlightSelect = (flight: any) => {
    setSelectedFlightId(flight.id);
    onFlightSelect(flight);
  };

  const getSortIcon = (sortOption: string) => {
    if (sortBy !== sortOption) return <FaSort className="text-gray-400" />;
    return sortOption.includes('_asc') ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FaSpinner className="text-4xl text-primary-500 animate-spin mb-4" />
        <p className="text-gray-600">Searching for flights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Error</h3>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FaPlane className="text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Flights Found</h3>
        <p className="text-gray-600 text-center max-w-md">
          We couldn't find any flights matching your search criteria. 
          Try adjusting your filters or search parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {flights.length} Flight{flights.length !== 1 ? 's' : ''} Found
          </h2>
          {pagination && (
            <span className="text-sm text-gray-500">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={handleFlightSelect}
            onViewDetails={onViewDetails}
            onAddToFavorites={onAddToFavorites}
            isSelected={selectedFlightId === flight.id}
            isFavorite={false} // This would come from a favorites context/state
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-6">
          <button
            onClick={() => pagination.onPageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
              const pageNum = Math.max(1, pagination.current_page - 2) + i;
              if (pageNum > pagination.total_pages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => pagination.onPageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    pageNum === pagination.current_page
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => pagination.onPageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.total_pages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Results Summary */}
      {pagination && (
        <div className="text-center text-sm text-gray-500 py-4">
          Showing {((pagination.current_page - 1) * 10) + 1} to {Math.min(pagination.current_page * 10, pagination.total_results)} of {pagination.total_results} results
        </div>
      )}
    </div>
  );
};

export default FlightResults;
