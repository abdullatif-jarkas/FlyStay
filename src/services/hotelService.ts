// Hotel service for handling hotel API calls
import axios from "axios";
import { HotelApiResponse, Hotel } from "../types/hotel";

const BASE_URL = "http://127.0.0.1:8000";

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Create axios instance with default config
const hotelApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// Add auth interceptor
hotelApi.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Hotel filter parameters - aligned with API scope filter method
export interface HotelFilters {
  name?: string; // Hotel name search (LIKE operator)
  rating?: number; // Hotel rating filter (exact match)
  city?: string; // City name filter (LIKE operator through relationship)
  country?: string; // Country name filter (LIKE operator through nested relationship)
}

/**
 * Get all hotels with pagination support
 * @param page - Page number (default: 1)
 * @param filters - Optional filters
 * @returns Promise with hotels response including pagination
 */
export const getAllHotels = async (
  page: number = 1,
  filters?: HotelFilters
): Promise<HotelApiResponse> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
    });

    // Add filters to query params
    if (filters?.name) {
      queryParams.append("name", filters.name);
    }
    if (filters?.rating) {
      queryParams.append("rating", filters.rating.toString());
    }
    if (filters?.city) {
      queryParams.append("city", filters.city);
    }
    if (filters?.country) {
      queryParams.append("country", filters.country);
    }

    const response = await hotelApi.get<HotelApiResponse>(
      `/api/hotel?${queryParams.toString()}`
    );

    if (response.data.status === "success") {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch hotels");
    }
  } catch (error: any) {
    console.error("Error fetching hotels:", error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || "Failed to fetch hotels");
    }

    throw new Error("Network error occurred while fetching hotels");
  }
};

/**
 * Get hotels filtered by rating
 * @param rating - Hotel rating (1-5)
 * @returns Promise with filtered hotels array
 */
export const getHotelsByRating = async (rating: number): Promise<Hotel[]> => {
  try {
    const response = await hotelApi.get<HotelApiResponse>(
      `/api/hotel?rating=${rating}`
    );

    if (response.data.status === "success") {
      const data = response.data.data;
      return Array.isArray(data) ? data : [data];
    } else {
      throw new Error(
        response.data.message || "Failed to fetch hotels by rating"
      );
    }
  } catch (error: any) {
    console.error("Error fetching hotels by rating:", error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || "Failed to fetch hotels by rating"
      );
    }

    throw new Error("Network error occurred while fetching hotels by rating");
  }
};

/**
 * Get hotels filtered by country
 * @param country - Country name
 * @returns Promise with filtered hotels array
 */
export const getHotelsByCountry = async (country: string): Promise<Hotel[]> => {
  try {
    const response = await hotelApi.get<HotelApiResponse>(
      `/api/hotel?country=${encodeURIComponent(country)}`
    );

    if (response.data.status === "success") {
      const data = response.data.data;
      return Array.isArray(data) ? data : [data];
    } else {
      throw new Error(
        response.data.message || "Failed to fetch hotels by country"
      );
    }
  } catch (error: any) {
    console.error("Error fetching hotels by country:", error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || "Failed to fetch hotels by country"
      );
    }

    throw new Error("Network error occurred while fetching hotels by country");
  }
};

/**
 * Get hotels with combined filters
 * @param filters - Object containing name, rating, city, and/or country filters
 * @returns Promise with filtered hotels array
 */
export const getFilteredHotels = async (
  filters: HotelFilters
): Promise<Hotel[]> => {
  try {
    const params = new URLSearchParams();

    if (filters.name) {
      params.append("name", filters.name);
    }

    if (filters.rating) {
      params.append("rating", filters.rating.toString());
    }

    if (filters.city) {
      params.append("city", filters.city);
    }

    if (filters.country) {
      params.append("country", filters.country);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/hotel?${queryString}` : "/api/hotel";

    const response = await hotelApi.get<HotelApiResponse>(endpoint);

    if (response.data.status === "success") {
      const data = response.data.data;
      return Array.isArray(data) ? data : [data];
    } else {
      throw new Error(
        response.data.message || "Failed to fetch filtered hotels"
      );
    }
  } catch (error: any) {
    console.error("Error fetching filtered hotels:", error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || "Failed to fetch filtered hotels"
      );
    }

    throw new Error("Network error occurred while fetching filtered hotels");
  }
};

/**
 * Get hotel by ID
 * @param hotelId - Hotel ID
 * @returns Promise with hotel details
 */
export const getHotelById = async (hotelId: number): Promise<Hotel> => {
  try {
    const response = await hotelApi.get<HotelApiResponse>(
      `/api/hotel/${hotelId}`
    );

    if (response.data.status === "success") {
      const data = response.data.data;
      return Array.isArray(data) ? data[0] : data;
    } else {
      throw new Error(response.data.message || "Failed to fetch hotel details");
    }
  } catch (error: any) {
    console.error("Error fetching hotel details:", error);

    if (error.response?.data) {
      throw new Error(
        error.response.data.message || "Failed to fetch hotel details"
      );
    }

    throw new Error("Network error occurred while fetching hotel details");
  }
};

/**
 * Get unique countries from hotels
 * @returns Promise with countries array
 */
export const getHotelCountries = async (): Promise<string[]> => {
  try {
    const hotels = await getAllHotels();
    console.log("hotels: ", hotels.data);
    const countries = [
      ...new Set(hotels.data.map((hotel) => hotel.country.name)),
    ];
    return countries.sort();
  } catch (error) {
    console.error("Error fetching hotel countries:", error);
    return [];
  }
};

/**
 * Get unique cities from hotels
 * @returns Promise with cities array
 */
export const getHotelCities = async (): Promise<string[]> => {
  try {
    const hotels = await getAllHotels();
    const cities = [...new Set(hotels.data.map((hotel) => hotel.city.name))];
    return cities.sort();
  } catch (error) {
    console.error("Error fetching hotel cities:", error);
    return [];
  }
};

// Export all hotel service functions
export default {
  getAllHotels,
  getHotelsByRating,
  getHotelsByCountry,
  getFilteredHotels,
  getHotelById,
  getHotelCountries,
  getHotelCities,
};
