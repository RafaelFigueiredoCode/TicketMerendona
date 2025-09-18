// locationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    isInAllowedRegion: false,
    hasVerifiedLocation: false, // <- novo
  },
  reducers: {
    setInAllowedRegion(state, action) {
      state.isInAllowedRegion = action.payload;
      if (action.payload) {
        state.hasVerifiedLocation = true; // se passou, fica salvo
      }
    },
    resetVerification(state) {
      state.hasVerifiedLocation = false;
    }
  }
});

export const { setInAllowedRegion, resetVerification } = locationSlice.actions;
export default locationSlice.reducer;