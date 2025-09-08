import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  getAllHotels,
  getHotelCountries,
  getHotelCities,
  HotelFilters,
} from "../services/hotelService";
import { HotelState } from "../types/hotel";

export const useHotels = () => {
  const [state, setState] = useState<HotelState>({
    hotels: [],
    loading: false,
    error: null,
    countries: [],
    cities: [],
    filters: {},
    // Pagination initial state
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  /**
   * Fetch all hotels with pagination
   */
  const fetchHotels = useCallback(
    async (page: number = 1, filters?: HotelFilters) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const response = await getAllHotels(page, filters);
        const hotels = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setState((prev) => ({
          ...prev,
          loading: false,
          hotels,
          error: null,
          // Update pagination state
          currentPage: response.pagination?.current_page || 1,
          totalPages: response.pagination?.total_pages || 1,
          totalResults: hotels.length,
          hasNextPage:
            (response.pagination?.current_page || 1) <
            (response.pagination?.total_pages || 1),
          hasPrevPage: (response.pagination?.current_page || 1) > 1,
        }));

        return hotels;
      } catch (error: any) {
        const errorMessage = error.message || "Failed to fetch hotels";

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          hotels: [],
        }));

        toast.error(errorMessage);
        return [];
      }
    },
    []
  );

  /**
   * Fetch hotels with filters and pagination
   */
  const fetchFilteredHotels = useCallback(
    async (filters: HotelFilters, page: number = 1) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        filters,
      }));

      try {
        // Use getAllHotels with filters and pagination
        const response = await getAllHotels(page, filters);
        const hotels = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setState((prev) => ({
          ...prev,
          loading: false,
          hotels,
          error: null,
          // Update pagination state
          currentPage: response.pagination?.current_page || 1,
          totalPages: response.pagination?.total_pages || 1,
          totalResults: hotels.length,
          hasNextPage:
            (response.pagination?.current_page || 1) <
            (response.pagination?.total_pages || 1),
          hasPrevPage: (response.pagination?.current_page || 1) > 1,
        }));

        // Show success message if filters are applied
        if (filters.rating || filters.country) {
          const filterMessages = [];
          if (filters.rating)
            filterMessages.push(`${filters.rating} star rating`);
          if (filters.country)
            filterMessages.push(`country: ${filters.country}`);
          toast.success(
            `Found ${hotels.length} hotels with ${filterMessages.join(" and ")}`
          );
        }

        return hotels;
      } catch (error: any) {
        const errorMessage = error.message || "Failed to fetch filtered hotels";

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          hotels: [],
          // Reset pagination on error
          currentPage: 1,
          totalPages: 1,
          totalResults: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }));

        toast.error(errorMessage);
        return [];
      }
    },
    []
  );

  /**
   * Fetch available countries
   */
  const fetchCountries = useCallback(async () => {
    try {
      const countries = await getHotelCountries();

      setState((prev) => ({
        ...prev,
        countries,
      }));

      return countries;
    } catch (error: any) {
      console.error("Error fetching countries:", error);
      return [];
    }
  }, []);

  /**
   * Fetch available cities
   */
  const fetchCities = useCallback(async () => {
    try {
      const cities = await getHotelCities();

      setState((prev) => ({
        ...prev,
        cities,
      }));

      return cities;
    } catch (error: any) {
      console.error("Error fetching cities:", error);
      return [];
    }
  }, []);

  /**
   * Apply filters
   */
  const applyFilters = useCallback(
    async (newFilters: HotelFilters) => {
      await fetchFilteredHotels(newFilters);
    },
    [fetchFilteredHotels]
  );

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      filters: {},
    }));

    await fetchHotels();
    toast.info("Filters cleared, showing all hotels");
  }, [fetchHotels]);

  /**
   * Filter by name
   */
  const filterByName = useCallback(
    async (name: string) => {
      const newFilters = name.trim()
        ? { ...state.filters, name }
        : { ...state.filters };
      if (!name.trim()) {
        const { name: _, ...filtersWithoutName } = newFilters;
        await applyFilters(filtersWithoutName);
      } else {
        await applyFilters(newFilters);
      }
    },
    [state.filters, applyFilters]
  );

  /**
   * Filter by rating
   */
  const filterByRating = useCallback(
    async (rating: number) => {
      const newFilters = { ...state.filters, rating };
      await applyFilters(newFilters);
    },
    [state.filters, applyFilters]
  );

  /**
   * Filter by city
   */
  const filterByCity = useCallback(
    async (city: string) => {
      const newFilters = { ...state.filters, city };
      await applyFilters(newFilters);
    },
    [state.filters, applyFilters]
  );

  /**
   * Filter by country
   */
  const filterByCountry = useCallback(
    async (country: string) => {
      const newFilters = { ...state.filters, country };
      await applyFilters(newFilters);
    },
    [state.filters, applyFilters]
  );

  /**
   * Remove name filter
   */
  const removeNameFilter = useCallback(async () => {
    const { name, ...newFilters } = state.filters;
    await applyFilters(newFilters);
  }, [state.filters, applyFilters]);

  /**
   * Remove rating filter
   */
  const removeRatingFilter = useCallback(async () => {
    const { rating, ...newFilters } = state.filters;
    await applyFilters(newFilters);
  }, [state.filters, applyFilters]);

  /**
   * Remove city filter
   */
  const removeCityFilter = useCallback(async () => {
    const { city, ...newFilters } = state.filters;
    await applyFilters(newFilters);
  }, [state.filters, applyFilters]);

  /**
   * Remove country filter
   */
  const removeCountryFilter = useCallback(async () => {
    const { country, ...newFilters } = state.filters;
    await applyFilters(newFilters);
  }, [state.filters, applyFilters]);

  /**
   * Refresh hotels
   */
  const refreshHotels = useCallback(async () => {
    if (Object.keys(state.filters).length > 0) {
      await fetchFilteredHotels(state.filters);
    } else {
      await fetchHotels(state.currentPage);
    }
  }, [state.filters, state.currentPage, fetchFilteredHotels, fetchHotels]);

  /**
   * Go to next page
   */
  const goToNextPage = useCallback(async () => {
    if (state.hasNextPage) {
      const nextPage = state.currentPage + 1;
      if (Object.keys(state.filters).length > 0) {
        await fetchFilteredHotels(state.filters, nextPage);
      } else {
        await fetchHotels(nextPage);
      }
    }
  }, [
    state.hasNextPage,
    state.currentPage,
    state.filters,
    fetchFilteredHotels,
    fetchHotels,
  ]);

  /**
   * Go to previous page
   */
  const goToPrevPage = useCallback(async () => {
    if (state.hasPrevPage) {
      const prevPage = state.currentPage - 1;
      if (Object.keys(state.filters).length > 0) {
        await fetchFilteredHotels(state.filters, prevPage);
      } else {
        await fetchHotels(prevPage);
      }
    }
  }, [
    state.hasPrevPage,
    state.currentPage,
    state.filters,
    fetchFilteredHotels,
    fetchHotels,
  ]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback(
    async (page: number) => {
      if (page >= 1 && page <= state.totalPages) {
        if (Object.keys(state.filters).length > 0) {
          await fetchFilteredHotels(state.filters, page);
        } else {
          await fetchHotels(page);
        }
      }
    },
    [state.totalPages, state.filters, fetchFilteredHotels, fetchHotels]
  );

  /**
   * Initialize hotels, countries, and cities on mount
   */
  useEffect(() => {
    fetchHotels();
    fetchCountries();
    fetchCities();
  }, [fetchHotels, fetchCountries, fetchCities]);

  return {
    // State
    hotels: state.hotels,
    loading: state.loading,
    error: state.error,
    countries: state.countries,
    cities: state.cities,
    filters: state.filters,

    // Pagination state
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    totalResults: state.totalResults,
    hasNextPage: state.hasNextPage,
    hasPrevPage: state.hasPrevPage,

    // Actions
    fetchHotels,
    fetchFilteredHotels,
    fetchCountries,
    fetchCities,
    applyFilters,
    clearFilters,
    filterByName,
    filterByRating,
    filterByCity,
    filterByCountry,
    removeNameFilter,
    removeRatingFilter,
    removeCityFilter,
    removeCountryFilter,
    refreshHotels,

    // Pagination actions
    goToNextPage,
    goToPrevPage,
    goToPage,

    // Computed properties
    hasFilters: Object.keys(state.filters).length > 0,
    hotelCount: state.hotels.length,
    isLoading: state.loading,
    hasError: !!state.error,
  };
};
