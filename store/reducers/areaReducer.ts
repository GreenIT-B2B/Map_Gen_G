import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  areaReducer: { ismodal: false, action: "" },
};
const areaReducer = createSlice({
  name: "areaReducer",
  initialState,
  reducers: {
    areaRedux(state: any, action) {
      state.areaReducer = action.payload;
    },
  },
});
export default areaReducer.reducer;
export const { areaRedux } = areaReducer.actions;
