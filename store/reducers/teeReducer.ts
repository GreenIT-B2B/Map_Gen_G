import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teeReducer: {
    // seq: 0,
    // clr: "#FF0000",
    // nm: "블랙티",
    // nmSec: "asdasdfasdfdasdsadasdasd",
  },
};
const teeReducer = createSlice({
  name: "teeReducer",
  initialState,
  reducers: {
    teeRedux(state: any, action) {
      state.teeReducer = action.payload;
    },
  },
});
export default teeReducer.reducer;
export const { teeRedux } = teeReducer.actions;
