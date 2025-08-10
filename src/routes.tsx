// routes.tsx
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

// Lazy Import Helper
const lazyImport = (path: string) => lazy(() => import(path));

// Layouts
const Layout = lazyImport("./layouts/Layout");
const AuthLayout = lazyImport("./layouts/AuthLayout");
const AdminLayout = lazyImport("./layouts/AdminLayout");

// Pages
const Home = lazyImport("./pages/Home/Home");
const Error = lazyImport("./pages/Error/Error");
const AboutUs = lazyImport("./pages/AboutUs/AboutUs");
const CustomerService = lazyImport("./pages/CustomerService/CustomerService");

// Auth Pages
const Login = lazyImport("./pages/Auth/Login/Login");
const Register = lazyImport("./pages/Auth/Register/Register");
const ForgotPassword = lazyImport("./pages/Auth/ForgotPassword/ForgotPassword");
const ResetPassword = lazyImport("./pages/Auth/ResetPassword/ResetPassword");

// Hotel Pages
const Hotel = lazyImport("./pages/Hotel/Hotel");
const HotelSearchResult = lazyImport("./pages/Hotel/HotelSearchResult");
const HotelFavorites = lazyImport("./pages/Hotel/HotelFavorites");
const HotelDetails = lazyImport("./pages/Hotel/HotelDetails");
const RoomDetails = lazyImport("./pages/Hotel/RoomDetails");
const HotelPayment = lazyImport("./pages/Hotel/HotelPayment");

// Flight Pages
const Flight = lazyImport("./pages/Flight/Flight");
const FlightSearchResult = lazyImport("./pages/Flight/FlightSearchResult");
const FlightPurchase = lazyImport("./pages/Flight/FlightPurchase");
const FlightFavorites = lazyImport("./pages/Flight/FlightFavorites");

// User Pages
const Profile = lazyImport("./pages/User/Profile");
const Settings = lazyImport("./pages/User/Settings");
const Payments = lazyImport("./pages/User/Payments");

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
          { index: true, element: withSuspense(<Hotel />) },
          { path: "search", element: withSuspense(<HotelSearchResult />) },
          { path: "favorites", element: withSuspense(<HotelFavorites />) },
          { path: ":hotelId", element: withSuspense(<HotelDetails />) },
          {
            path: ":hotelId/room/:roomId",
            element: withSuspense(<RoomDetails />),
          },
          { path: ":hotelId/payment", element: withSuspense(<HotelPayment />) },
        ],
      },
      {
        path: "flight",
        children: [
          { index: true, element: withSuspense(<Flight />) },
          { path: "search", element: withSuspense(<FlightSearchResult />) },
          {
            path: "purchase/:flightId",
            element: withSuspense(<FlightPurchase />),
          },
          { path: "favorites", element: withSuspense(<FlightFavorites />) },
        ],
      },
      { path: "favorites", element: withSuspense(<Favorites />) },
      {
        path: "user",
        children: [
          { path: "profile", element: withSuspense(<Profile />) },
          { path: "settings", element: withSuspense(<Settings />) },
          { path: "payments", element: withSuspense(<Payments />) },
        ],
      },
      { path: "about-us", element: withSuspense(<AboutUs />) },
      { path: "customer-service", element: withSuspense(<CustomerService />) },
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
    ],
  },
  {
    path: "/admin",
    element: withSuspense(<AdminLayout />),
    children: [
      { index: true, element: withSuspense(<Dashboard />) },
      { path: "permissions", element: withSuspense(<Permissions />) },
      { path: "roles", element: withSuspense(<Roles />) },
      { path: "users", element: withSuspense(<Users />) },
      { path: "airports", element: withSuspense(<Airports />) },
      { path: "hotels", element: withSuspense(<Hotels />) },
      { path: "rooms", element: withSuspense(<Rooms />) },
      { path: "cities", element: withSuspense(<Cities />) },
      { path: "flights", element: withSuspense(<FlightAdmin />) },
      { path: "flight-cabins", element: withSuspense(<FlightCabins />) },
    ],
  },
]);
