import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mapChangeReducer: "R",
};
const mapChangeReducer = createSlice({
  name: "mapChangeReducer",
  initialState,
  reducers: {
    mapChangeRedux(state: any, action) {
      state.mapChangeReducer = action.payload;
    },
  },
});
export default mapChangeReducer.reducer;
export const { mapChangeRedux } = mapChangeReducer.actions;
