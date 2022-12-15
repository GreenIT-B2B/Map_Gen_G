import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  holeSelectReducer: {},
};
const holeSelectReducer = createSlice({
  name: "holeSelectReducer",
  initialState,
  reducers: {
    holeSelectRedux(state: any, action) {
      state.holeSelectReducer = action.payload;
    },
  },
});
export default holeSelectReducer.reducer;
export const { holeSelectRedux } = holeSelectReducer.actions;
