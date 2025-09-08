import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  FaUsers,
  FaHotel,
  FaPlane,
  FaDollarSign,
  FaCalendarAlt,
  FaChartLine,
  FaGlobe,
  FaUserCheck,
  FaSpinner,
  FaSync,
  FaArrowUp,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DashboardData,
  DashboardApiResponse,
  RevenueChartData,
  BookingStatusChartData,
} from "../../types/dashboard";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await axios.get<DashboardApiResponse>(
          "http://127.0.0.1:8000/api/dashboard/statistics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          setDashboardData(response.data.data);
          if (isRefresh) {
            toast.success("Dashboard data refreshed successfully");
          }
        } else {
          throw new Error(
            response.data.message || "Failed to fetch dashboard data"
          );
        }
      } catch (err: unknown) {
        console.error("Error fetching dashboard statistics:", err);
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to load dashboard data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardStats(true);
  };

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      fetchDashboardStats();
    } else {
      setError("Authentication required");
      setLoading(false);
    }
  }, [token, fetchDashboardStats]);

  // Format currency
  const formatCurrency = (amount: string | number): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <FaCheckCircle className="w-4 h-4" />;
      case "pending":
        return <FaClock className="w-4 h-4" />;
      case "cancelled":
      case "failed":
        return <FaTimesCircle className="w-4 h-4" />;
      default:
        return <FaExclamationCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationCircle className="text-4xl text-red-600 mb-4 mx-auto" />
          <p className="text-lg text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchDashboardStats()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">No dashboard data available</p>
      </div>
    );
  }

  // Prepare chart data
  const revenueChartData: RevenueChartData[] =
    dashboardData.revenue.monthly_revenue_trend.map((item) => ({
      month: item.month_name,
      revenue: item.revenue,
    }));

  // Prepare booking status chart data
  const flightBookingStatusData: BookingStatusChartData[] = Object.entries(
    dashboardData.bookings.bookings_by_status.flight_bookings
  ).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color:
      status === "confirmed"
        ? "#10B981"
        : status === "pending"
        ? "#F59E0B"
        : "#EF4444",
  }));

  const hotelBookingStatusData: BookingStatusChartData[] = Object.entries(
    dashboardData.bookings.bookings_by_status.hotel_bookings
  ).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color:
      status === "confirmed"
        ? "#10B981"
        : status === "pending"
        ? "#F59E0B"
        : "#EF4444",
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome to your admin dashboard overview
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSync className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaUsers className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.overview.total_users.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {dashboardData.overview.total_customers} customers
              </p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaDollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboardData.revenue.total_revenue.all_time)}
              </p>
              <p className="text-xs text-gray-500">
                {formatCurrency(dashboardData.revenue.total_revenue.today)}{" "}
                today
              </p>
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaCalendarAlt className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.bookings.total_bookings.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {dashboardData.bookings.total_bookings.flight_bookings} flights,{" "}
                {dashboardData.bookings.total_bookings.hotel_bookings} hotels
              </p>
            </div>
          </div>
        </div>

        {/* Hotels & Flights */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaGlobe className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Destinations</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.overview.total_hotels +
                  dashboardData.overview.total_flights}
              </p>
              <p className="text-xs text-gray-500">
                {dashboardData.overview.total_hotels} hotels,{" "}
                {dashboardData.overview.total_flights} flights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </h3>
            <FaChartLine className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Booking Status
            </h3>
            <FaCalendarAlt className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hotel Bookings */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Hotel Bookings
              </h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={hotelBookingStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {hotelBookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {hotelBookingStatusData.map((entry, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span>
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flight Bookings */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Flight Bookings
              </h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={flightBookingStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {flightBookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {flightBookingStatusData.map((entry, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span>
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Booking Completion Rate */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.performance_metrics.booking_completion_rate.toFixed(
                  1
                )}
                %
              </p>
            </div>
            <div className="flex-shrink-0">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${dashboardData.performance_metrics.booking_completion_rate}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Cancellation Rate */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Cancellation Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.performance_metrics.booking_cancellation_rate.toFixed(
                  1
                )}
                %
              </p>
            </div>
            <div className="flex-shrink-0">
              <FaTimesCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    dashboardData.performance_metrics.booking_cancellation_rate,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Payment Success Rate */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Payment Success
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.performance_metrics.payment_success_rate.toFixed(
                  1
                )}
                %
              </p>
            </div>
            <div className="flex-shrink-0">
              <FaDollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${dashboardData.performance_metrics.payment_success_rate}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Average Booking Value */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg. Booking Value
              </p>
              <p className="text-lg font-bold text-gray-900">
                Hotel:{" "}
                {formatCurrency(
                  dashboardData.performance_metrics.average_booking_value.hotel
                )}
              </p>
              <p className="text-sm text-gray-600">
                Flight:{" "}
                {formatCurrency(
                  dashboardData.performance_metrics.average_booking_value.flight
                )}
              </p>
            </div>
            <div className="flex-shrink-0">
              <FaChartLine className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Popular Destinations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Popular Destinations
            </h3>
            <FaGlobe className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaHotel className="mr-2 text-blue-600" />
                Hotel Destinations
              </h4>
              <div className="space-y-2">
                {dashboardData.popular_destinations.hotel_destinations
                  .slice(0, 5)
                  .map((dest, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">
                        {dest.city_name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {dest.booking_count} bookings
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaPlane className="mr-2 text-green-600" />
                Flight Destinations
              </h4>
              <div className="space-y-2">
                {dashboardData.popular_destinations.flight_destinations
                  .slice(0, 5)
                  .map((dest, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">
                        {dest.city_name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {dest.booking_count} bookings
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <FaClock className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {dashboardData.recent_activity
              .slice(0, 6)
              .map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === "hotel_booking" ? (
                      <FaHotel className="h-4 w-4 text-blue-600 mt-1" />
                    ) : (
                      <FaPlane className="h-4 w-4 text-green-600 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user_name}</span>{" "}
                      made a {activity.type.replace("_", " ")}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {getStatusIcon(activity.status)}
                          <span className="ml-1">{activity.status}</span>
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(activity.amount)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* User Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              User Analytics
            </h3>
            <FaUsers className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {/* New Users */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Users (30 days)</span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 mr-2">
                  {dashboardData.user_analytics.new_users_last_30_days}
                </span>
                <FaArrowUp className="h-3 w-3 text-green-600" />
              </div>
            </div>

            {/* Active Users */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Active Users (30 days)
              </span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 mr-2">
                  {dashboardData.user_analytics.active_users_last_30_days}
                </span>
                <FaUserCheck className="h-3 w-3 text-blue-600" />
              </div>
            </div>

            {/* User Roles Breakdown */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Users by Role
              </h4>
              <div className="space-y-2">
                {Object.entries(dashboardData.user_analytics.users_by_role).map(
                  ([role, count]) => (
                    <div
                      key={role}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-gray-600 capitalize">
                        {role.replace("_", " ")}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {count}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
