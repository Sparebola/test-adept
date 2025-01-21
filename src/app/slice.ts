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
  selectedIds: Record<string, boolean>;
}

const initialState: CompaniesState = {
  page: 0,
  isLoading: true,
  isSubload: false,
  loadErrorText: "",
  loadMoreErrorText: "",
  companies: [],
  editId: -1,
  selectedIds: {},
};

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
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

    selectAllCompany: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        const selectedIds = state.selectedIds;
        state.companies.forEach((company) => {
          selectedIds[company.id] = true;
        });
      } else {
        state.selectedIds = {};
      }
    },

    deleteSelectCompany: (state) => {
      state.companies = state.companies.filter((company) => {
        return !state.selectedIds[company.id];
      });
      if (state.selectedIds[state.editId]) state.editId = -1;

      state.selectedIds = {};
    },

    setCompanyChecked: (
      state,
      action: PayloadAction<{ isChecked: boolean; id: number }>
    ) => {
      const { isChecked, id } = action.payload;
      if (isChecked) {
        state.selectedIds[id] = true;
      } else {
        delete state.selectedIds[id];
      }
    },

    addCompany: (state) => {
      const id = getRandomInt(state.companies.length, 1_000_000_000);
      state.companies.unshift({
        id,
        name: "new company",
        adress: "adress",
      });
      state.editId = id;
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
  selectAllCompany,
  setCompanyChecked,
  deleteSelectCompany,
  addCompany,
} = companiesSlice.actions;

export default companiesSlice.reducer;
