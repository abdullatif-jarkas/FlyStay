import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { BookingContextType, BookingProviderProps, HotelBookingAPI } from '../types/bookingsSection';


const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

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
