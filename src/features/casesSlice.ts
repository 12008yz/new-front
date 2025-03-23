import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { casesApi } from '../app/services/cases/CaseServices';
import { Case } from '../app/types';

interface CasesState {
  cases: Case[];
  selectedCase: Case | null;
  loading: boolean;
  error: string | null;
}

const initialState: CasesState = {
  cases: [],
  selectedCase: null,
  loading: false,
  error: null,
};

const casesSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    setCases(state, action: PayloadAction<Case[]>) {
      state.cases = action.payload;
    },
    setSelectedCase(state, action: PayloadAction<Case | null>) {
      state.selectedCase = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(casesApi.endpoints.getCases.matchFulfilled, (state, action) => {
        state.cases = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(casesApi.endpoints.getCases.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load cases';
      })
      .addMatcher(casesApi.endpoints.getCase.matchFulfilled, (state, action) => {
        state.selectedCase = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(casesApi.endpoints.getCase.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load case';
      });
  },
});

export const { setCases, setSelectedCase, setLoading, setError } = casesSlice.actions;

// Селекторы
export const selectCases = (state: { cases: CasesState }) => state.cases.cases;
export const selectSelectedCase = (state: { cases: CasesState }) => state.cases.selectedCase;
export const selectCasesLoading = (state: { cases: CasesState }) => state.cases.loading;
export const selectCasesError = (state: { cases: CasesState }) => state.cases.error;

export default casesSlice.reducer;

export const {
  useGetCasesQuery,
  useGetCaseQuery,
} = casesApi;
