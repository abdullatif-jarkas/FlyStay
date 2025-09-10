// Room-related TypeScript interfaces

export interface Hotel {
  id: number;
  name: string;
  city: {
    id: number;
    name: string;
  };
  country: {
    id: number;
    name: string;
    iso2: string;
  };
}

export interface RoomImage {
  id: number;
  url: string;
  alt?: string;
  is_primary?: boolean;
  created_at: string;
}

export interface Room {
  id: number;
  hotel_id: number;
  hotel: Hotel;
  room_type: string;
  price_per_night: number;
  capacity: number;
  images?: RoomImage[];
  created_at: string;
  updated_at?: string;
}

// Form data interfaces
export interface CreateRoomFormData {
  hotel_id: string;
  room_type: string;
  price_per_night: string;
  capacity: string;
  images: File[];
}

export interface EditRoomFormData {
  hotel_id: string;
  room_type: string;
  price_per_night: string;
  capacity: string;
}

export interface UpdateRoomImagesFormData {
  new_photos: File[];
  deleted_photos: number[];
}

// API response interfaces
export interface RoomApiResponse {
  status: string;
  message?: string;
  data: Room | Room[];
  pagination?: {
    current_page: number;
    total_pages: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export interface HotelsApiResponse {
  status: string;
  message?: string;
  data: Hotel[];
  pagination?: {
    current_page: number;
    total_pages: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

// Modal props interfaces
export interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  room: Room | null;
}

export interface ShowRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: number | null;
}

export interface DeleteRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  room: Room | null;
}

export interface UpdateRoomImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  room: Room | null;
}

// Utility types
export type RoomFormErrors = {
  [K in keyof CreateRoomFormData]?: string;
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

// Room type options
export const ROOM_TYPES = [
  { value: 'single', label: 'Single Room' },
  { value: 'double', label: 'Double Room' },
  { value: 'Suite', label: 'Suite' },
] as const;

export type RoomType = typeof ROOM_TYPES[number]['value'];
