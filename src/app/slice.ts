import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CompaniesState {
  name: string;
  adress: string;
}

const initialState: CompaniesState[] = Array.from(
  { length: 25 },
  (_value, index) => ({
    name: `Компания ${index}`,
    adress: "адрес",
  })
);

export const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      // state.value += 1;
    },
    decrement: (state) => {
      // state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      // state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } =
  companiesSlice.actions;

export default companiesSlice.reducer;
