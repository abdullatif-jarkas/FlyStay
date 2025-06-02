import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

// Home & Main Pages
const Home = lazy(() => import("./pages/Home/Home"));
const Error = lazy(() => import("./pages/Error/Error"));
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs"));
const CustomerService = lazy(
  () => import("./pages/CustomerService/CustomerService")
);

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

export const routes = createBrowserRouter([
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
  // Auth Routes
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
]);
