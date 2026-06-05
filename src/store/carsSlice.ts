import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Car } from '../types';

interface CarsState {
  cars: Car[];
  total: number;
  page: number;
  selectedCar: Car | null;
  newCarName: string;
  newCarColor: string;
  editCarName: string;
  editCarColor: string;
  isRacing: boolean;
  winner: Car | null;
}

const initialState: CarsState = {
  cars: [],
  total: 0,
  page: 1,
  selectedCar: null,
  newCarName: '',
  newCarColor: '#e74c3c',
  editCarName: '',
  editCarColor: '#e74c3c',
  isRacing: false,
  winner: null,
};

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCars(state, action: PayloadAction<{ cars: Car[]; total: number }>) {
      state.cars = action.payload.cars;
      state.total = action.payload.total;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSelectedCar(state, action: PayloadAction<Car | null>) {
      state.selectedCar = action.payload;
      if (action.payload) {
        state.editCarName = action.payload.name;
        state.editCarColor = action.payload.color;
      }
    },
    setNewCarName(state, action: PayloadAction<string>) {
      state.newCarName = action.payload;
    },
    setNewCarColor(state, action: PayloadAction<string>) {
      state.newCarColor = action.payload;
    },
    setEditCarName(state, action: PayloadAction<string>) {
      state.editCarName = action.payload;
    },
    setEditCarColor(state, action: PayloadAction<string>) {
      state.editCarColor = action.payload;
    },
    setIsRacing(state, action: PayloadAction<boolean>) {
      state.isRacing = action.payload;
    },
    setWinner(state, action: PayloadAction<Car | null>) {
      state.winner = action.payload;
    },
  },
});

export const {
  setCars,
  setPage,
  setSelectedCar,
  setNewCarName,
  setNewCarColor,
  setEditCarName,
  setEditCarColor,
  setIsRacing,
  setWinner,
} = carsSlice.actions;

export default carsSlice.reducer;
