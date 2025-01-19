import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Company {
  id: number;
  name: string;
  adress: string;
}

export interface CompaniesState {
  page: number;
  isLoading: boolean;
  isSubload: boolean;
  loadErrorText: string;
  loadMoreErrorText: string;
  companies: Company[];
  editId: number;
  // selectedIds: Map<number, boolean>;
}

const initialState: CompaniesState = {
  page: 0,
  isLoading: true,
  isSubload: false,
  loadErrorText: "",
  loadMoreErrorText: "",
  companies: [],
  editId: -1,
  // selectedIds: new Map<number, boolean>(),
};

const getCompanyIndexById = (id: number, companies: Company[]) =>
  companies.findIndex((company) => company.id === id);

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
      state.loadMoreErrorText = action.payload;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    addCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies.push(...action.payload);
    },

    setEditId: (state, action: PayloadAction<number>) => {
      state.editId = action.payload;
    },

    setEditCompanyName: (state, action: PayloadAction<string>) => {
      const index = getCompanyIndexById(state.editId, state.companies);
      state.companies[index].name = action.payload;
    },

    setEditCompanyAdress: (state, action: PayloadAction<string>) => {
      const index = getCompanyIndexById(state.editId, state.companies);
      state.companies[index].adress = action.payload;
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
  setEditCompanyName,
  setEditCompanyAdress,
  setEditId,
} = companiesSlice.actions;

export default companiesSlice.reducer;
