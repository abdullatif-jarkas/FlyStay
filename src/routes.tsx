import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import FlightAdmin from "./pages/Admin/FlightAdmin/FlightAdmin";

// Layouts
const Layout = lazy(() => import("./layouts/Layout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));

// Home & Main Pages
const Home = lazy(() => import("./pages/Home/Home"));
const Error = lazy(() => import("./pages/Error/Error"));
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs"));
const CustomerService = lazy(
  () => import("./pages/CustomerService/CustomerService")
);

// Admin Pages
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const Hotels = lazy(() => import("./pages/Admin/Hotels/Hotels"));
const Permissions = lazy(() => import("./pages/Admin/Permissions/Permissions"));
const Roles = lazy(() => import("./pages/Admin/Roles/Roles"));
const Airports = lazy(() => import("./pages/Admin/Airports/Airports"));
const Cities = lazy(() => import("./pages/Admin/Cities/Cities"));

// Auth Pages
const Login = lazy(() => import("./pages/Auth/Login/Login"));
const Register = lazy(() => import("./pages/Auth/Register/Register"));
const ForgotPassword = lazy(
  () => import("./pages/Auth/ForgotPassword/ForgotPassword")
);
const ResetPassword = lazy(
  () => import("./pages/Auth/ResetPassword/ResetPassword")
);

// Hotel Pages
const Hotel = lazy(() => import("./pages/Hotel/Hotel"));
const HotelSearchResult = lazy(() => import("./pages/Hotel/HotelSearchResult"));
const HotelFavorites = lazy(() => import("./pages/Hotel/HotelFavorites"));
const HotelInfo = lazy(() => import("./pages/Hotel/HotelInfo"));
const HotelPayment = lazy(() => import("./pages/Hotel/HotelPayment"));

// Flight Pages
const Flight = lazy(() => import("./pages/Flight/Flight"));
const FlightSearchResult = lazy(
  () => import("./pages/Flight/FlightSearchResult")
);
const FlightPurchase = lazy(() => import("./pages/Flight/FlightPurchase"));
const FlightFavorites = lazy(() => import("./pages/Flight/FlightFavorites"));

// User Pages
const Profile = lazy(() => import("./pages/User/Profile"));
const Settings = lazy(() => import("./pages/User/Settings"));
const Payments = lazy(() => import("./pages/User/Payments"));

// Favorites Page
const Favorites = lazy(() => import("./pages/Favorites/Favorites"));

export const routes = createBrowserRouter([
  //* Public Rotues
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        ),
      },
      // Hotel Routes
      {
        path: "hotel",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Hotel />
              </Suspense>
            ),
          },
          {
            path: "search",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <HotelSearchResult />
              </Suspense>
            ),
          },
          {
            path: "favorites",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <HotelFavorites />
              </Suspense>
            ),
          },
          {
            path: ":hotelId",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <HotelInfo />
              </Suspense>
            ),
          },
          {
            path: ":hotelId/payment",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <HotelPayment />
              </Suspense>
            ),
          },
        ],
      },
      // Flight Routes
      {
        path: "flight",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Flight />
              </Suspense>
            ),
          },
          {
            path: "search",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <FlightSearchResult />
              </Suspense>
            ),
          },
          {
            path: "purchase/:flightId",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <FlightPurchase />
              </Suspense>
            ),
          },
          {
            path: "favorites",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <FlightFavorites />
              </Suspense>
            ),
          },
        ],
      },
      // Unified Favorites Route
      {
        path: "favorites",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Favorites />
          </Suspense>
        ),
      },
      // User Routes
      {
        path: "user",
        children: [
          {
            path: "profile",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "settings",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Settings />
              </Suspense>
            ),
          },
          {
            path: "payments",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Payments />
              </Suspense>
            ),
          },
        ],
      },
      // Info Pages
      {
        path: "about-us",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AboutUs />
          </Suspense>
        ),
      },
      // Customer Service
      {
        path: "customer-service",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CustomerService />
          </Suspense>
        ),
      },
      // 404 Route
      {
        path: "*",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Error />
          </Suspense>
        ),
      },
    ],
  },
  //? Auth Routes
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: "reset-password",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ResetPassword />
          </Suspense>
        ),
      },
    ],
  },
  //^ Admin Routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "permissions",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Permissions />
          </Suspense>
        ),
      },
      {
        path: "roles",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Roles />
          </Suspense>
        ),
      },
      {
        path: "airports",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Airports />
          </Suspense>
        ),
      },
      {
        path: "hotels",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Hotels />
          </Suspense>
        ),
      },
      {
        path: "cities",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Cities />
          </Suspense>
        ),
      },
      {
        path: "flights",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <FlightAdmin />
          </Suspense>
        ),
      },
    ],
  },
]);
