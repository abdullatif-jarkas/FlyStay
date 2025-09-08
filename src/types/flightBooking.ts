export interface FlightBookingResponse {
  status: string;
  message: string;
  data: Array<{
    id: number;
    user_id: number;
    flight_cabins_id: number;
    booking_date: string;
    seat_number: number;
    status: string;
  }>;
  errors?: {
    flight_cabins_id?: string[];
  };
}