//src/lib/store.ts
'use client';
import { useDispatch } from "react-redux";
import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';


import rootReducer from "./rootReducer";
import { apiSlice } from "@/utils/apiSlice";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV === "development",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
