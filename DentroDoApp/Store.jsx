// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./features/GlobalSave";
import counterReducer from './features/counterSlice';
import alunoReducer from './features/AlunosSlice'
import locationReducer from './features/LocationSlice'

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    counter: counterReducer,
    alunos: alunoReducer,
    location: locationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);