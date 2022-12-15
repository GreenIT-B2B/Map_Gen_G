import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  compInfoReducer: {},
};
const compInfoReducer = createSlice({
  name: "compInfoReducer",
  initialState,
  reducers: {
    compInfoRedux(state: any, action) {
      state.compInfoReducer = action.payload;
    },
  },
});
export default compInfoReducer.reducer;
export const { compInfoRedux } = compInfoReducer.actions;
