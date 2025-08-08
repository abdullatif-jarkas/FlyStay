import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  getAllHotels,
  getFilteredHotels,
  getHotelCountries,
  HotelFilters,
} from "../services/hotelService";
import { Hotel } from "../types/hotel";

export interface HotelState {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
  countries: string[];
  filters: HotelFilters;
}

export const useHotels = () => {
  const [state, setState] = useState<HotelState>({
    hotels: [],
    loading: false,
    error: null,
    countries: [],
    filters: {},
  });

  /**
   * Fetch all hotels
   */
  const fetchHotels = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const hotels = await getAllHotels();
      
      setState((prev) => ({
        ...prev,
        loading: false,
        hotels,
        error: null,
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
  }, []);

  /**
   * Fetch hotels with filters
   */
  const fetchFilteredHotels = useCallback(async (filters: HotelFilters) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      filters,
    }));

    try {
      const hotels = await getFilteredHotels(filters);
      
      setState((prev) => ({
        ...prev,
        loading: false,
        hotels,
        error: null,
      }));

      // Show success message if filters are applied
      if (filters.rating || filters.country) {
        const filterMessages = [];
        if (filters.rating) filterMessages.push(`${filters.rating} star rating`);
        if (filters.country) filterMessages.push(`country: ${filters.country}`);
        toast.success(`Found ${hotels.length} hotels with ${filterMessages.join(' and ')}`);
      }

      return hotels;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch filtered hotels";
      
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        hotels: [],
      }));

      toast.error(errorMessage);
      return [];
    }
  }, []);

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
   * Remove rating filter
   */
  const removeRatingFilter = useCallback(async () => {
    const { rating, ...newFilters } = state.filters;
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
      await fetchHotels();
    }
  }, [state.filters, fetchFilteredHotels, fetchHotels]);

  /**
   * Initialize hotels and countries on mount
   */
  useEffect(() => {
    fetchHotels();
    fetchCountries();
  }, [fetchHotels, fetchCountries]);

  return {
    // State
    hotels: state.hotels,
    loading: state.loading,
    error: state.error,
    countries: state.countries,
    filters: state.filters,
    
    // Actions
    fetchHotels,
    fetchFilteredHotels,
    fetchCountries,
    applyFilters,
    clearFilters,
    filterByRating,
    filterByCountry,
    removeRatingFilter,
    removeCountryFilter,
    refreshHotels,
    
    // Computed properties
    hasFilters: Object.keys(state.filters).length > 0,
    hotelCount: state.hotels.length,
    isLoading: state.loading,
    hasError: !!state.error,
  };
};
