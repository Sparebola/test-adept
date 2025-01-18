import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./store";
import {
  addCompanies,
  Companies,
  setLoadErrorText,
  setLoading,
  setPage,
  setSubload,
  setSubloadErrorText,
} from "./slice";

const limit = 25;

const fetchLoad = async (page: number) => {
  const companies: Companies[] = [];
  for (let index = 1; index <= limit; index++) {
    companies.push({
      name: `Компания ${page * limit + index}`,
      adress: "адрес",
    });
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  return { companies, nextPage: page + 1 };
};

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
}>();

export const subloadCompanies = createAppAsyncThunk(
  "companies/subloadCompanies",
  async (_, { dispatch, getState, signal }) => {
    const state = getState();
    const page = state.companies.page;

    try {
      dispatch(setSubload(true));
      dispatch(setSubloadErrorText(""));

      const result = await fetchLoad(page);
      // Эмуляция: при аборте fetch выкидывает ошибку (поддержку сигнала в fetchLoad делать лень)
      signal.throwIfAborted();

      dispatch(setPage(result.nextPage));
      dispatch(addCompanies(result.companies));
      dispatch(setSubloadErrorText("")); // Из-за синхронной эмуляции
    } catch {
      dispatch(setSubloadErrorText("client error"));
    } finally {
      dispatch(setSubload(false));
    }
  },
  {
    condition: (_, { getState }) => {
      const { companies } = getState();
      if (companies.isSubload) {
        // повторный вызов IntersectionObserver
        return false;
      }
    },
  }
);

export const loadCompanies = createAppAsyncThunk(
  "companies/loadCompanies",
  async (_, { dispatch, signal }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setLoadErrorText(""));

      const result = await fetchLoad(0);
      // Эмуляция: при аборте fetch выкидывает ошибку (поддержку сигнала в fetchLoad делать лень)
      signal.throwIfAborted();

      dispatch(setPage(result.nextPage));
      dispatch(addCompanies(result.companies));
      dispatch(setLoadErrorText("")); // Из-за синхронной эмуляции
    } catch {
      dispatch(setLoadErrorText("client error"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);
