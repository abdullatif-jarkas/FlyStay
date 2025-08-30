import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SectionState {
  activeSection: string;
}

const initialState: SectionState = {
  activeSection: "profile", // القيمة الافتراضية
};

const sectionSlice = createSlice({
  name: "section",
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<string>) => {
      state.activeSection = action.payload;
    },
  },
});

export const { setActiveSection } = sectionSlice.actions;
export default sectionSlice.reducer;
