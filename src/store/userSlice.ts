import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = "admin" | "flight_agent" | "hotel_agent" | "customer" | "finance_officer" | null | string;

interface UserState {
  // id: number | null;
  // name: string | null;
  role: Role;
  // isAuthenticated: boolean;
}

const initialState: UserState = {
  // id: null,
  // name: null,
  role: localStorage.getItem("role") || null,
  // isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      // state.id = action.payload.id;
      // state.name = action.payload.name;
      state.role = action.payload.role;
      // state.isAuthenticated = true;
    },
    logout(state) {
      // state.id = null;
      // state.name = null;
      state.role = null;
      // state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
