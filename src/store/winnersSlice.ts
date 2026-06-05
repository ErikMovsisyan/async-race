import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { WinnerFull, SortField, SortOrder } from '../types';

interface WinnersState {
  winners: WinnerFull[];
  total: number;
  page: number;
  sortField: SortField;
  sortOrder: SortOrder;
}

const initialState: WinnersState = {
  winners: [],
  total: 0,
  page: 1,
  sortField: 'wins',
  sortOrder: 'DESC',
};

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setWinners(state, action: PayloadAction<{ winners: WinnerFull[]; total: number }>) {
      state.winners = action.payload.winners;
      state.total = action.payload.total;
    },
    setWinnersPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSortField(state, action: PayloadAction<SortField>) {
      state.sortField = action.payload;
    },
    setSortOrder(state, action: PayloadAction<SortOrder>) {
      state.sortOrder = action.payload;
    },
  },
});

export const { setWinners, setWinnersPage, setSortField, setSortOrder } = winnersSlice.actions;
export default winnersSlice.reducer;
