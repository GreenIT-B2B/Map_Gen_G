import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inputAlertReducer: {
    isModal: false,
    header: "",
    contents: "",
  },
};
const inputAlertReducer = createSlice({
  name: "inputAlertReducer",
  initialState,
  reducers: {
    inputAlertRedux(state: any, action) {
      state.inputAlertReducer = action.payload;
    },
  },
});
export default inputAlertReducer.reducer;
export const { inputAlertRedux } = inputAlertReducer.actions;
