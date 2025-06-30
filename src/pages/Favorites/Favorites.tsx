import { useState, useEffect } from "react";
import {
  FaHeart,
  FaPlane,
  FaHotel,
  FaCity,
  FaFilter,
  FaSort,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import FavoriteCard from "../../components/Card/FavoriteCard";
import FavoritesSkeleton from "../../components/ui/FavoritesSkeleton";
import {
  favoritesService,
  FavoriteItem,
} from "../../services/favoritesService";

// Types are now imported from the service

type FilterType = "all" | "hotel" | "flight" | "city";
type SortType = "newest" | "oldest" | "name";

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllFavorites();
  }, []);

  const fetchAllFavorites = async () => {
    if (!token) {
      setError("Please login to view your favorites");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const allFavorites = await favoritesService.getAllFavorites();
      setFavorites(allFavorites);
    } catch (err: any) {
      setError("Failed to load favorites");
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (item: FavoriteItem) => {
    if (!token) return;

    try {
      const success = await favoritesService.removeFavorite(item);

      if (success) {
        // Remove from local state
        setFavorites((prev) =>
          prev.filter((fav) => !(fav.id === item.id && fav.type === item.type))
        );
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const filteredAndSortedFavorites = favorites
    .filter((item) => filter === "all" || item.type === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "name":
          const aName =
            a.type === "flight"
              ? (a as FavoriteFlight).flight_number
              : (a as any).name;
          const bName =
            b.type === "flight"
              ? (b as FavoriteFlight).flight_number
              : (b as any).name;
          return aName.localeCompare(bName);
        default:
          return 0;
      }
    });

  const getCategoryCount = (type: FilterType) => {
    if (type === "all") return favorites.length;
    return favorites.filter((item) => item.type === type).length;
  };

  if (loading) {
    return <FavoritesSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FaHeart className="text-3xl text-red-500" />
        <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({getCategoryCount("all")})
            </button>
            <button
              onClick={() => setFilter("hotel")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === "hotel"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaHotel /> Hotels ({getCategoryCount("hotel")})
            </button>
            <button
              onClick={() => setFilter("flight")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === "flight"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaPlane /> Flights ({getCategoryCount("flight")})
            </button>
            <button
              onClick={() => setFilter("city")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === "city"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaCity /> Cities ({getCategoryCount("city")})
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <FaSort className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Favorites Grid */}
      {filteredAndSortedFavorites.length === 0 ? (
        <div className="text-center py-16">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {filter === "all"
              ? "No favorites yet"
              : `No favorite ${filter}s yet`}
          </h3>
          <p className="text-gray-500">
            Start exploring and add items to your favorites to see them here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedFavorites.map((item) => (
            <FavoriteCard
              key={`${item.type}-${item.id}`}
              item={item}
              onRemove={() => removeFavorite(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
