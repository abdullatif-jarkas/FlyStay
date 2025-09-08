import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  SuggestedHotelsState,
  SuggestedHotelsFilters,
  FetchSuggestedHotelsParams,
} from '../types/suggestedHotels';
import { suggestedHotelsService } from '../services/suggestedHotelsService';

export const useSuggestedHotels = () => {
  const [state, setState] = useState<SuggestedHotelsState>({
    hotels: [],
    loading: false,
    error: null,
    pagination: null,
    filters: {},
  });

  const fetchHotels = useCallback(async (params: FetchSuggestedHotelsParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await suggestedHotelsService.fetchSuggestedHotelsWithCache(params);
      
      setState(prev => ({
        ...prev,
        hotels: response.data,
        pagination: response.pagination,
        filters: params.filters || {},
        loading: false,
      }));

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load suggested hotels';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<SuggestedHotelsFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      hotels: [],
      loading: false,
      error: null,
      pagination: null,
      filters: {},
    });
  }, []);

  return {
    ...state,
    fetchHotels,
    updateFilters,
    clearError,
    reset,
  };
};

export default useSuggestedHotels;
