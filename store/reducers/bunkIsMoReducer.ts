import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bunkIsMoReducer: false,
};
const bunkIsMoReducer = createSlice({
  name: "bunkIsMoReducer",
  initialState,
  reducers: {
    bunkIsMoRedux(state: any, action) {
      state.bunkIsMoReducer = action.payload;
    },
  },
});
export default bunkIsMoReducer.reducer;
export const { bunkIsMoRedux } = bunkIsMoReducer.actions;
