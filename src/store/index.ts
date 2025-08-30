import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import sectionReducer from "./sectionSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    section: sectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
