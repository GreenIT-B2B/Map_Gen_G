import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  guideReducer: 99,
};
const guideReducer = createSlice({
  name: "guideReducer",
  initialState,
  reducers: {
    guideRedux(state: any, action) {
      state.guideReducer = action.payload;
    },
  },
});
export default guideReducer.reducer;
export const { guideRedux } = guideReducer.actions;
