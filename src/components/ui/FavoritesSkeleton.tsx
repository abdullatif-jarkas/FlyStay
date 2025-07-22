const FavoritesSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-48 h-8 bg-gray-300 rounded animate-pulse"></div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Category Filters Skeleton */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-24 h-10 bg-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
          </div>

          {/* Sort Options Skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-300"></div>
            
            {/* Content Skeleton */}
            <div className="p-4">
              <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-2/3 h-4 bg-gray-200 rounded mb-4"></div>
              
              {/* Footer Skeleton */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesSkeleton;
