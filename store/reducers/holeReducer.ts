import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  holeReducer: {},
};
const holeReducer = createSlice({
  name: "holeReducer",
  initialState,
  reducers: {
    holeRedux(state: any, action) {
      state.holeReducer = action.payload;
    },
  },
});
export default holeReducer.reducer;
export const { holeRedux } = holeReducer.actions;
