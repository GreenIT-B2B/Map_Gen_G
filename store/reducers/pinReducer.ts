import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pinReducer: {},
};
const pinReducer = createSlice({
  name: "pinReducer",
  initialState,
  reducers: {
    pinRedux(state: any, action) {
      state.pinReducer = action.payload;
    },
  },
});
export default pinReducer.reducer;
export const { pinRedux } = pinReducer.actions;
