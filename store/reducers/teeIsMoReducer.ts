import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teeIsMoReducer: false,
};
const teeIsMoReducer = createSlice({
  name: "teeIsMoReducer",
  initialState,
  reducers: {
    teeIsMoRedux(state: any, action) {
      state.teeIsMoReducer = action.payload;
    },
  },
});
export default teeIsMoReducer.reducer;
export const { teeIsMoRedux } = teeIsMoReducer.actions;
