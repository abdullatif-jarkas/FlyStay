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
    "Accept": "application/json",
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

// Hotel filter parameters
export interface HotelFilters {
  rating?: number;
  country?: string;
}

/**
 * Get all hotels
 * @returns Promise with hotels array
 */
export const getAllHotels = async (): Promise<Hotel[]> => {
  try {
    const response = await hotelApi.get<HotelApiResponse>("/api/hotel");

    if (response.data.status === "success") {
      // Handle both single hotel and array of hotels
      const data = response.data.data;
      return Array.isArray(data) ? data : [data];
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
    const response = await hotelApi.get<HotelApiResponse>(`/api/hotel?rating=${rating}`);

    if (response.data.status === "success") {
      const data = response.data.data;
      return Array.isArray(data) ? data : [data];
    } else {
      throw new Error(response.data.message || "Failed to fetch hotels by rating");
    }
  } catch (error: any) {
    console.error("Error fetching hotels by rating:", error);
    
    if (error.response?.data) {
      throw new Error(error.response.data.message || "Failed to fetch hotels by rating");
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
    const response = await hotelApi.get<HotelApiResponse>(`/api/hotel?country=${encodeURIComponent(country)}`);

    if (response.data.status === "success") {
      const data = response.data.data;
      return Array.isArray(data) ? data : [data];
    } else {
      throw new Error(response.data.message || "Failed to fetch hotels by country");
    }
  } catch (error: any) {
    console.error("Error fetching hotels by country:", error);
    
    if (error.response?.data) {
      throw new Error(error.response.data.message || "Failed to fetch hotels by country");
    }
    
    throw new Error("Network error occurred while fetching hotels by country");
  }
};

/**
 * Get hotels with combined filters
 * @param filters - Object containing rating and/or country filters
 * @returns Promise with filtered hotels array
 */
export const getFilteredHotels = async (filters: HotelFilters): Promise<Hotel[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.rating) {
      params.append('rating', filters.rating.toString());
    }
    
    if (filters.country) {
      params.append('country', filters.country);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/hotel?${queryString}` : '/api/hotel';
    
    const response = await hotelApi.get<HotelApiResponse>(endpoint);

    if (response.data.status === "success") {
      const data = response.data.data;
      return Array.isArray(data) ? data : [data];
    } else {
      throw new Error(response.data.message || "Failed to fetch filtered hotels");
    }
  } catch (error: any) {
    console.error("Error fetching filtered hotels:", error);
    
    if (error.response?.data) {
      throw new Error(error.response.data.message || "Failed to fetch filtered hotels");
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
    const response = await hotelApi.get<HotelApiResponse>(`/api/hotel/${hotelId}`);

    if (response.data.status === "success") {
      const data = response.data.data;
      return Array.isArray(data) ? data[0] : data;
    } else {
      throw new Error(response.data.message || "Failed to fetch hotel details");
    }
  } catch (error: any) {
    console.error("Error fetching hotel details:", error);
    
    if (error.response?.data) {
      throw new Error(error.response.data.message || "Failed to fetch hotel details");
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
    const countries = [...new Set(hotels.map(hotel => hotel.country.name))];
    return countries.sort();
  } catch (error) {
    console.error("Error fetching hotel countries:", error);
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
};
