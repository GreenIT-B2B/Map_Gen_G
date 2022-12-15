import { createSlice } from "@reduxjs/toolkit";
interface CodivSelectReducer {
  cgDiv: string;
  coDiv: string;
  coName: string;
  courData: [];
  pinClrF: string;
  pinClrS: string;
  pinClrT: string;
  updateDatetime: string;
  useYn: string;
}
const initialState: CodivSelectReducer = {
  cgDiv: "",
  coDiv: "",
  coName: "",
  courData: [],
  pinClrF: "",
  pinClrS: "",
  pinClrT: "",
  updateDatetime: "",
  useYn: "",
};
const codivSelectReducer = createSlice({
  name: "codivSelectReducer",
  initialState,
  reducers: {
    codivSelectRedux(state: any, action) {
      state.codivSelectReducer = action.payload;
    },
  },
});
export default codivSelectReducer.reducer;
export const { codivSelectRedux } = codivSelectReducer.actions;
