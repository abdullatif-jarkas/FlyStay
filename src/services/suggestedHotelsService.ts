import axios from 'axios';
import {
  SuggestedHotelsResponse,
  FetchSuggestedHotelsParams,
  SUGGESTED_HOTELS_ENDPOINTS,
} from '../types/suggestedHotels';

const API_BASE_URL = 'http://127.0.0.1:8000';

class SuggestedHotelsService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };
  }

  async fetchSuggestedHotels({
    cityId,
    page = 1,
    per_page = 10,
    filters = {},
  }: FetchSuggestedHotelsParams): Promise<SuggestedHotelsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
      });

      // Add filters to params
      if (filters.rating) {
        params.append('rating', filters.rating.toString());
      }
      if (filters.price_range?.min) {
        params.append('price_min', filters.price_range.min.toString());
      }
      if (filters.price_range?.max) {
        params.append('price_max', filters.price_range.max.toString());
      }
      if (filters.sort_by) {
        params.append('sort_by', filters.sort_by);
      }
      if (filters.sort_order) {
        params.append('sort_order', filters.sort_order);
      }

      const url = `${API_BASE_URL}${SUGGESTED_HOTELS_ENDPOINTS.GET_BY_CITY(cityId)}?${params}`;
      
      const response = await axios.get<SuggestedHotelsResponse>(url, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching suggested hotels:', error);
      throw this.handleApiError(error);
    }
  }

  private handleApiError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Failed to fetch suggested hotels';
      return new Error(message);
    }
    return new Error('An unexpected error occurred');
  }

  // Cache management for better performance
  private static cache = new Map<string, { data: SuggestedHotelsResponse; timestamp: number }>();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async fetchSuggestedHotelsWithCache(params: FetchSuggestedHotelsParams): Promise<SuggestedHotelsResponse> {
    const cacheKey = JSON.stringify(params);
    const cached = SuggestedHotelsService.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < SuggestedHotelsService.CACHE_DURATION) {
      return cached.data;
    }

    const data = await this.fetchSuggestedHotels(params);
    SuggestedHotelsService.cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  }

  static clearCache() {
    SuggestedHotelsService.cache.clear();
  }
}

export const suggestedHotelsService = new SuggestedHotelsService();
export default suggestedHotelsService;
