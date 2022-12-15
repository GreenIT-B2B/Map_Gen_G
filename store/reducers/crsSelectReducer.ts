import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  crsSelectReducer: {},
};
const crsSelectReducer = createSlice({
  name: "crsSelectReducer",
  initialState,
  reducers: {
    crsSelectRedux(state: any, action) {
      state.crsSelectReducer = action.payload;
    },
  },
});
export default crsSelectReducer.reducer;
export const { crsSelectRedux } = crsSelectReducer.actions;
