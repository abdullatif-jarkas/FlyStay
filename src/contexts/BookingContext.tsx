import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

// Booking interfaces based on API response
export interface HotelBookingAPI {
  id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  booking_date: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  duration: string;
  user_Info: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    phone_number: string;
  };
  Room: {
    id: number;
    hotel_id: number;
    room_type: string;
    price_per_night: string;
    capacity: number;
    description: string;
  };
  Payments: any[];
}

export interface BookingContextType {
  hotelBookings: HotelBookingAPI[];
  addHotelBooking: (booking: HotelBookingAPI) => void;
  updateBookingStatus: (bookingId: number, status: 'pending' | 'confirmed' | 'cancelled') => void;
  removeBooking: (bookingId: number) => void;
  getBookingById: (bookingId: number) => HotelBookingAPI | undefined;
  refreshBookings: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [hotelBookings, setHotelBookings] = useState<HotelBookingAPI[]>([]);

  const addHotelBooking = useCallback((booking: HotelBookingAPI) => {
    setHotelBookings(prev => {
      // Check if booking already exists
      const existingIndex = prev.findIndex(b => b.id === booking.id);
      if (existingIndex !== -1) {
        // Update existing booking
        const updated = [...prev];
        updated[existingIndex] = booking;
        return updated;
      } else {
        // Add new booking
        return [booking, ...prev];
      }
    });
    
    toast.success(`Hotel booking ${booking.status === 'pending' ? 'created' : 'updated'} successfully!`);
  }, []);

  const updateBookingStatus = useCallback((bookingId: number, status: 'pending' | 'confirmed' | 'cancelled') => {
    setHotelBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status }
          : booking
      )
    );

    const statusMessages = {
      confirmed: 'Booking confirmed successfully!',
      cancelled: 'Booking cancelled',
      pending: 'Booking status updated to pending'
    };

    toast.success(statusMessages[status]);
  }, []);

  const removeBooking = useCallback((bookingId: number) => {
    setHotelBookings(prev => prev.filter(booking => booking.id !== bookingId));
    toast.info('Booking removed');
  }, []);

  const getBookingById = useCallback((bookingId: number) => {
    return hotelBookings.find(booking => booking.id === bookingId);
  }, [hotelBookings]);

  const refreshBookings = useCallback(() => {
    // This would typically fetch bookings from API
    // For now, we'll just trigger a re-render
    setHotelBookings(prev => [...prev]);
  }, []);

  const value: BookingContextType = {
    hotelBookings,
    addHotelBooking,
    updateBookingStatus,
    removeBooking,
    getBookingById,
    refreshBookings,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
