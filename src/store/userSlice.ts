import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = "admin" | "flight_agent" | "hotel_agent" | "customer" | "finance_officer" | null | string;

interface UserState {
  role: Role;
}

const initialState: UserState = {
  role: localStorage.getItem("role") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.role = action.payload.role;
    },
    logout(state) {
      state.role = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
