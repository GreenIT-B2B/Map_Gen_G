import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  areltReducer: { isModal: false, contents: "" },
};
const areltReducer = createSlice({
  name: "areltReducer",
  initialState,
  reducers: {
    areltRedux(state: any, action) {
      state.areltReducer = action.payload;
    },
  },
});
export default areltReducer.reducer;
export const { areltRedux } = areltReducer.actions;
