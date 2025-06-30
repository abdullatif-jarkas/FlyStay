import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

// Types for different favorite items
export interface FavoriteHotel {
  id: number;
  name: string;
  address?: string;
  city: string;
  rating?: number;
  image?: string;
  created_at: string;
  type: 'hotel';
}

export interface FavoriteFlight {
  id: number;
  airline: string;
  flight_number: string;
  departure_airport: {
    name: string;
    IATA_code: string;
  };
  arrival_airport: {
    name: string;
    IATA_code: string;
  };
  departure_time: string;
  arrival_time: string;
  created_at: string;
  type: 'flight';
}

export interface FavoriteCity {
  id: number;
  name: string;
  country: string;
  image?: string;
  created_at: string;
  type: 'city';
}

export type FavoriteItem = FavoriteHotel | FavoriteFlight | FavoriteCity;

// API Service Class
export class FavoritesService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
  }

  // Fetch all favorites
  async getAllFavorites(): Promise<FavoriteItem[]> {
    const allFavorites: FavoriteItem[] = [];

    try {
      // Fetch favorites from different endpoints
      const [hotelsRes, flightsRes, citiesRes] = await Promise.allSettled([
        this.getFavoriteHotels(),
        this.getFavoriteFlights(),
        this.getFavoriteCities(),
      ]);

      // Process hotels
      if (hotelsRes.status === "fulfilled") {
        allFavorites.push(...hotelsRes.value);
      }

      // Process flights
      if (flightsRes.status === "fulfilled") {
        allFavorites.push(...flightsRes.value);
      }

      // Process cities
      if (citiesRes.status === "fulfilled") {
        allFavorites.push(...citiesRes.value);
      }

      // If no favorites found from API, return mock data for demonstration
      if (allFavorites.length === 0) {
        return this.getMockFavorites();
      }

      return allFavorites;
    } catch (error) {
      console.error("Error fetching all favorites:", error);
      return this.getMockFavorites();
    }
  }

  // Fetch favorite hotels
  async getFavoriteHotels(): Promise<FavoriteHotel[]> {
    try {
      const response = await axios.get(`${BASE_URL}/user/favorite-hotels`, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.status === "success") {
        return response.data.data.map((hotel: any) => ({
          ...hotel,
          type: "hotel" as const,
        }));
      }
      return [];
    } catch (error) {
      console.log("Favorite hotels API not available");
      return [];
    }
  }

  // Fetch favorite flights
  async getFavoriteFlights(): Promise<FavoriteFlight[]> {
    try {
      const response = await axios.get(`${BASE_URL}/user/favorite-flights`, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.status === "success") {
        return response.data.data.map((flight: any) => ({
          ...flight,
          type: "flight" as const,
        }));
      }
      return [];
    } catch (error) {
      console.log("Favorite flights API not available");
      return [];
    }
  }

  // Fetch favorite cities
  async getFavoriteCities(): Promise<FavoriteCity[]> {
    try {
      const response = await axios.get(`${BASE_URL}/user/favorite-cities`, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.status === "success") {
        return response.data.data.map((city: any) => ({
          ...city,
          type: "city" as const,
        }));
      }
      return [];
    } catch (error) {
      console.log("Favorite cities API not available");
      return [];
    }
  }

  // Remove favorite item
  async removeFavorite(item: FavoriteItem): Promise<boolean> {
    try {
      let endpoint = "";
      switch (item.type) {
        case "hotel":
          endpoint = `${BASE_URL}/user/favorite-hotels/${item.id}`;
          break;
        case "flight":
          endpoint = `${BASE_URL}/user/favorite-flights/${item.id}`;
          break;
        case "city":
          endpoint = `${BASE_URL}/user/favorite-cities/${item.id}`;
          break;
      }

      await axios.delete(endpoint, {
        headers: this.getAuthHeaders(),
      });

      return true;
    } catch (error) {
      console.log("API endpoint not available, removing from local state only");
      return true; // Return true to allow local state removal
    }
  }

  // Add favorite item
  async addFavorite(itemType: 'hotel' | 'flight' | 'city', itemId: number): Promise<boolean> {
    try {
      let endpoint = "";
      switch (itemType) {
        case "hotel":
          endpoint = `${BASE_URL}/user/favorite-hotels`;
          break;
        case "flight":
          endpoint = `${BASE_URL}/user/favorite-flights`;
          break;
        case "city":
          endpoint = `${BASE_URL}/user/favorite-cities`;
          break;
      }

      await axios.post(endpoint, { item_id: itemId }, {
        headers: this.getAuthHeaders(),
      });

      return true;
    } catch (error) {
      console.log("Add favorite API not available");
      return false;
    }
  }

  // Mock data for demonstration
  private getMockFavorites(): FavoriteItem[] {
    return [
      {
        id: 1,
        name: "Grand Hotel Plaza",
        city: "New York",
        address: "123 Broadway, NY",
        rating: 4,
        created_at: "2024-01-15T10:30:00Z",
        type: "hotel",
      },
      {
        id: 2,
        name: "Luxury Resort & Spa",
        city: "Miami",
        address: "456 Ocean Drive, FL",
        rating: 5,
        created_at: "2024-01-18T14:20:00Z",
        type: "hotel",
      },
      {
        id: 2,
        airline: "Emirates",
        flight_number: "EK123",
        departure_airport: {
          name: "Dubai International Airport",
          IATA_code: "DXB",
        },
        arrival_airport: {
          name: "John F. Kennedy International Airport",
          IATA_code: "JFK",
        },
        departure_time: "2024-02-20T14:30:00Z",
        arrival_time: "2024-02-20T22:45:00Z",
        created_at: "2024-01-20T08:15:00Z",
        type: "flight",
      },
      {
        id: 3,
        airline: "British Airways",
        flight_number: "BA456",
        departure_airport: {
          name: "London Heathrow Airport",
          IATA_code: "LHR",
        },
        arrival_airport: {
          name: "Los Angeles International Airport",
          IATA_code: "LAX",
        },
        departure_time: "2024-03-15T09:00:00Z",
        arrival_time: "2024-03-15T17:30:00Z",
        created_at: "2024-01-22T12:45:00Z",
        type: "flight",
      },
      {
        id: 3,
        name: "Paris",
        country: "France",
        created_at: "2024-01-25T16:20:00Z",
        type: "city",
      },
      {
        id: 4,
        name: "Tokyo",
        country: "Japan",
        created_at: "2024-01-28T09:10:00Z",
        type: "city",
      },
    ];
  }
}

// Export a singleton instance
export const favoritesService = new FavoritesService();
