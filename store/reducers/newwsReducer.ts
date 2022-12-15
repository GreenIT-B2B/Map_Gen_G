import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newWorkSpace: {
    isModal: false,
    contents: "",
  },
};
const newWorkSpace = createSlice({
  name: "newWorkSpace",
  initialState,
  reducers: {
    newwsRedux(state: any, action) {
      state.newWorkSpace = action.payload;
    },
  },
});
export default newWorkSpace.reducer;
export const { newwsRedux } = newWorkSpace.actions;
