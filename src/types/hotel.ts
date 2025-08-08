// Hotel-related TypeScript interfaces

export interface Country {
  id: number;
  name: string;
  iso2: string;
}

export interface City {
  id: number;
  name: string;
  country: {
    id: number;
    name: string;
  };
}

export interface HotelImage {
  id: number;
  url: string;
  alt?: string;
  is_primary?: boolean;
  created_at: string;
  image_path: string;
  imageable_type?: string;
}

export interface Room {
  id: number;
  hotel_id: number;
  room_type: string;
  price_per_night: string; // decimal as string
  capacity: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Hotel {
  id: number;
  name: string;
  address?: string;
  city: City;
  country: Country;
  city_id: number;
  rating: number;
  description: string;
  images?: HotelImage[];
  rooms?: Room[];
  created_at: string;
  updated_at?: string;
}

// Form data interfaces
export interface CreateHotelFormData {
  name: string;
  city_id: string;
  rating: string;
  description: string;
  images: File[];
}

export interface EditHotelFormData {
  name: string;
  city_id: string;
  rating: string;
  description: string;
}

export interface UpdateHotelImagesFormData {
  new_photos: File[];
  deleted_photos: number[];
}

// API response interfaces
export interface HotelApiResponse {
  status: string;
  message?: string;
  data: Hotel | Hotel[];
  pagination?: {
    current_page: number;
    total_pages: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export interface CitiesApiResponse {
  status: string;
  message?: string;
  data: City[];
  pagination?: {
    current_page: number;
    total_pages: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

// Modal props interfaces
export interface CreateHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface EditHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hotel: Hotel | null;
}

export interface ShowHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: number | null;
}

export interface DeleteHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hotel: Hotel | null;
}

export interface UpdateHotelImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hotel: Hotel | null;
}

// Utility types
export type HotelFormErrors = {
  [K in keyof CreateHotelFormData]?: string;
} & {
  general?: string;
};

export interface ImagePreview {
  file: File;
  url: string;
  id?: string;
}

export interface DeleteImageConfirmation {
  id: number;
  url: string;
  confirmed: boolean;
}
