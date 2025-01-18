import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Companies {
  name: string;
  adress: string;
}

export interface CompaniesState {
  page: number;
  isLoading: boolean;
  isSubload: boolean;
  loadErrorText: string;
  subloadErrorText: string;
  companies: Companies[];
}

const initialState: CompaniesState = {
  page: 0,
  isLoading: true,
  isSubload: false,
  loadErrorText: "",
  subloadErrorText: "",
  companies: [],
};

export const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setSubload: (state, action: PayloadAction<boolean>) => {
      state.isSubload = action.payload;
    },

    setLoadErrorText: (state, action: PayloadAction<string>) => {
      state.loadErrorText = action.payload;
    },

    setSubloadErrorText: (state, action: PayloadAction<string>) => {
      state.subloadErrorText = action.payload;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    addCompanies: (state, action: PayloadAction<Companies[]>) => {
      state.companies.push(...action.payload);
    },
  },
});

export const {
  setLoading,
  setSubload,
  setLoadErrorText,
  setSubloadErrorText,
  setPage,
  addCompanies,
} = companiesSlice.actions;

export default companiesSlice.reducer;
