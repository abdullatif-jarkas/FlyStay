import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./store";
import { BookingProvider } from "./contexts/BookingContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <FavoritesProvider>
        <BookingProvider>
          <Toaster position="bottom-right" richColors expand={true} />
          <RouterProvider router={routes} />
        </BookingProvider>
      </FavoritesProvider>
    </Provider>
  </StrictMode>
);
