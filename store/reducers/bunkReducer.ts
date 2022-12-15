import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bunkReducer: { hole: "", save: "", group: 99 },
};
const bunkReducer = createSlice({
  name: "bunkReducer",
  initialState,
  reducers: {
    bunkRedux(state: any, action) {
      state.bunkReducer = action.payload;
    },
  },
});
export default bunkReducer.reducer;
export const { bunkRedux } = bunkReducer.actions;
