import { configureStore } from "@reduxjs/toolkit";
import vacationsReducer from "./vacationsSlice";

export const store = configureStore({
  reducer: {
    vacations: vacationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
