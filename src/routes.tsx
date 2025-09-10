// routes.tsx
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Lazy Import Helper
const lazyImport = (path: string) => lazy(() => import(path));

// Layouts
const Layout = lazyImport("./layouts/Layout");
const AuthLayout = lazyImport("./layouts/AuthLayout");
const DashLayout = lazyImport("./layouts/DashLayout");

// Pages
const Home = lazyImport("./pages/Home/Home");
const Error = lazyImport("./pages/Error/Error");

// Auth Pages
const Login = lazyImport("./pages/Auth/Login/Login");
const Register = lazyImport("./pages/Auth/Register/Register");
const ForgotPassword = lazyImport("./pages/Auth/ForgotPassword/ForgotPassword");
const ResetPassword = lazyImport("./pages/Auth/ResetPassword/ResetPassword");
const AuthCallback = lazyImport("./pages/Auth/AuthCallback/AuthCallback");

// Hotel Pages
const Hotel = lazyImport("./pages/Hotel/Hotel");
const HotelDetails = lazyImport("./pages/Hotel/HotelDetails");
const RoomDetails = lazyImport("./pages/Hotel/RoomDetails");

// Flight Pages
const Flight = lazyImport("./pages/Flight/Flight");
const FlightPurchase = lazyImport("./pages/Flight/FlightPurchase");

// User Pages
const Profile = lazyImport("./pages/User/Profile");

// Favorites
const Favorites = lazyImport("./pages/Favorites/Favorites");

// Admin Pages
const Dashboard = lazyImport("./pages/Admin/Dashboard");
const Hotels = lazyImport("./pages/Admin/Hotels/Hotels");
const Rooms = lazyImport("./pages/Admin/Rooms/Rooms");
const Permissions = lazyImport("./pages/Admin/Permissions/Permissions");
const Roles = lazyImport("./pages/Admin/Roles/Roles");
const Users = lazyImport("./pages/Admin/Users/Users");
const Airports = lazyImport("./pages/Admin/Airports/Airports");
const Cities = lazyImport("./pages/Admin/Cities/Cities");
const FlightCabins = lazyImport("./pages/Admin/FlightCabins/FlightCabins");
const FlightAdmin = lazyImport("./pages/Admin/FlightAdmin/FlightAdmin");
const AdminPayments = lazyImport("./pages/Admin/Payments/Payments");
const FlightBookings = lazyImport("./pages/Admin/FlightBookings");
const HotelBookings = lazyImport("./pages/Admin/HotelBookings");

const allAuthUsers = [
  "admin",
  "finance_officer",
  "hotel_agent",
  "flight_agent",
  "customer",
];
const adminOnly = ["admin"];
const financeAndAdmin = ["admin", "finance_officer"];
const flightAndAdmin = ["admin", "flight_agent"];
const hotelAndAdmin = ["admin", "hotel_agent"];
const managersOnly = ["admin","finance_officer","hotel_agent","flight_agent"];

// Wrapper Component
const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<LoadingSpinner />}>{element}</Suspense>
);

// Router
export const routes = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<Layout />),
    children: [
      { index: true, element: withSuspense(<Home />) },
      {
        path: "hotel",
        children: [
          {
            index: true,
            element: withSuspense(
              <ProtectedRoute allowedRoles={allAuthUsers}>
                <Hotel />
              </ProtectedRoute>
            ),
          },
          {
            path: ":hotelId",
            element: withSuspense(
              <ProtectedRoute allowedRoles={allAuthUsers}>
                <HotelDetails />
              </ProtectedRoute>
            ),
          },
          {
            path: ":hotelId/room/:roomId",
            element: withSuspense(
              <ProtectedRoute allowedRoles={allAuthUsers}>
                <RoomDetails />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "flight",
        children: [
          {
            index: true,
            element: withSuspense(
              <ProtectedRoute allowedRoles={allAuthUsers}>
                <Flight />
              </ProtectedRoute>
            ),
          },
          {
            path: "purchase/:flightId",
            element: withSuspense(
              <ProtectedRoute allowedRoles={allAuthUsers}>
                <FlightPurchase />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "favorites",
        element: withSuspense(
          <ProtectedRoute allowedRoles={allAuthUsers}>
            <Favorites />
          </ProtectedRoute>
        ),
      },
      {
        path: "user",
        children: [
          {
            path: "profile",
            element: withSuspense(
              <ProtectedRoute allowedRoles={allAuthUsers}>
                <Profile />
              </ProtectedRoute>
            ),
          },
        ],
      },
      { path: "*", element: withSuspense(<Error />) },
    ],
  },
  {
    path: "auth",
    element: withSuspense(<AuthLayout />),
    children: [
      { path: "login", element: withSuspense(<Login />) },
      { path: "register", element: withSuspense(<Register />) },
      { path: "forgot-password", element: withSuspense(<ForgotPassword />) },
      { path: "reset-password", element: withSuspense(<ResetPassword />) },
      { path: "callback", element: withSuspense(<AuthCallback />) },
    ],
  },
  {
    path: "/admin",
    element: withSuspense(
      <ProtectedRoute
        allowedRoles={managersOnly}
      >
        <DashLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<Dashboard />) },
      {
        path: "permissions",
        element: withSuspense(
          <ProtectedRoute allowedRoles={adminOnly}>
            <Permissions />
          </ProtectedRoute>
        ),
      },
      {
        path: "roles",
        element: withSuspense(
          <ProtectedRoute allowedRoles={adminOnly}>
            <Roles />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: withSuspense(
          <ProtectedRoute allowedRoles={adminOnly}>
            <Users />
          </ProtectedRoute>
        ),
      },
      { path: "airports", element: withSuspense(<Airports />) },
      { path: "hotels", element: withSuspense(<Hotels />) },
      { path: "rooms", element: withSuspense(<Rooms />) },
      { path: "cities", element: withSuspense(<Cities />) },
      { path: "flights", element: withSuspense(<FlightAdmin />) },
      { path: "flight-cabins", element: withSuspense(<FlightCabins />) },
      {
        path: "payments",
        element: withSuspense(
          <ProtectedRoute allowedRoles={financeAndAdmin}>
            <AdminPayments />
          </ProtectedRoute>
        ),
      },
      {
        path: "flight-bookings",
        element: withSuspense(
          <ProtectedRoute allowedRoles={flightAndAdmin}>
            <FlightBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "hotel-bookings",
        element: withSuspense(
          <ProtectedRoute allowedRoles={hotelAndAdmin}>
            <HotelBookings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
