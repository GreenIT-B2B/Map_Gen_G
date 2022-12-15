import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuSelectReducer: {},
};
const menuSelectReducer = createSlice({
  name: "menuSelectReducer",
  initialState,
  reducers: {
    menuSelectRedux(state: any, action) {
      state.menuSelectReducer = action.payload;
    },
  },
});
export default menuSelectReducer.reducer;
export const { menuSelectRedux } = menuSelectReducer.actions;
