import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./store";
import { BookingProvider } from "./contexts/BookingContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BookingProvider>
        <Toaster position="bottom-right" richColors expand={true} />
        <RouterProvider router={routes} />
      </BookingProvider>
    </Provider>
  </StrictMode>
);
