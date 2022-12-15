import { createSlice } from "@reduxjs/toolkit";

type SearchReducer = {
  searchReducer: string;
};

const initialState: SearchReducer = {
  searchReducer: "",
};
const searchReducer = createSlice({
  name: "searchReducer",
  initialState,
  reducers: {
    searchRedux(state: any, action) {
      state.searchReducer = action.payload;
    },
  },
});
export default searchReducer.reducer;
export const { searchRedux } = searchReducer.actions;
