import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  btnModalReducer: {},
};
const btnModalReducer = createSlice({
  name: "btnModalReducer",
  initialState,
  reducers: {
    btnModalRedux(state: any, action) {
      state.btnModalReducer = action.payload;
    },
  },
});
export default btnModalReducer.reducer;
export const { btnModalRedux } = btnModalReducer.actions;
