// Dashboard Statistics TypeScript interfaces

export interface DashboardOverview {
  total_users: number;
  total_customers: number;
  total_hotels: number;
  total_flights: number;
  total_countries: number;
  total_cities: number;
  verified_users: number;
}

export interface TotalBookings {
  flight_bookings: number;
  hotel_bookings: number;
  total: number;
}

export interface BookingsByStatus {
  flight_bookings: {
    [status: string]: number;
  };
  hotel_bookings: {
    [status: string]: number;
  };
}

export interface BookingsTimeframe {
  flight_bookings: number;
  hotel_bookings: number;
}

export interface DashboardBookings {
  total_bookings: TotalBookings;
  bookings_by_status: BookingsByStatus;
  bookings_today: BookingsTimeframe;
  bookings_this_month: BookingsTimeframe;
  bookings_this_year: BookingsTimeframe;
}

export interface TotalRevenue {
  all_time: string;
  today: string;
  this_month: string;
  this_year: string;
}

export interface RevenueByType {
  flight_revenue: string;
  hotel_revenue: string;
}

export interface RevenueByMethod {
  [method: string]: string;
}

export interface MonthlyRevenueTrend {
  month: string;
  month_name: string;
  revenue: number;
}

export interface DashboardRevenue {
  total_revenue: TotalRevenue;
  revenue_by_type: RevenueByType;
  revenue_by_method: RevenueByMethod;
  monthly_revenue_trend: MonthlyRevenueTrend[];
}

export interface PopularDestination {
  city_name: string;
  booking_count: number;
}

export interface PopularDestinations {
  flight_destinations: PopularDestination[];
  hotel_destinations: PopularDestination[];
}

export interface RecentActivity {
  type: "hotel_booking" | "flight_booking";
  id: number;
  user_name: string;
  user_email: string;
  status: string;
  amount: number;
  created_at: string;
}

export interface UsersByRole {
  [role: string]: number;
}

export interface UserAnalytics {
  new_users_last_30_days: number;
  active_users_last_30_days: number;
  users_by_role: UsersByRole;
}

export interface AverageBookingValue {
  flight: string;
  hotel: string;
}

export interface PerformanceMetrics {
  booking_completion_rate: number;
  booking_cancellation_rate: number;
  average_booking_value: AverageBookingValue;
  payment_success_rate: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  bookings: DashboardBookings;
  revenue: DashboardRevenue;
  popular_destinations: PopularDestinations;
  recent_activity: RecentActivity[];
  user_analytics: UserAnalytics;
  performance_metrics: PerformanceMetrics;
}

export interface DashboardApiResponse {
  status: string;
  message: string;
  data: DashboardData;
}

// Chart data interfaces for recharts
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
}

export interface BookingStatusChartData {
  name: string;
  value: number;
  color: string;
}
