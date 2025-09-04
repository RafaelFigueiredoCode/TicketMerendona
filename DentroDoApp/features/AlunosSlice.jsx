import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadAlunos = createAsyncThunk(
  "alunos/load",
  async () => {
    const jsonValue = await AsyncStorage.getItem("alunos");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  }
);

export const saveAlunos = createAsyncThunk(
  "alunos/save",
  async (alunos) => {
    await AsyncStorage.setItem("alunos", JSON.stringify(alunos));
    return alunos;
  }
);

const alunosSlice = createSlice({
  name: "alunos",
  initialState: {
    alunos: [],
  },
  reducers: {
    adicionarAluno: (state, action) => {
      state.alunos.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAlunos.fulfilled, (state, action) => {
      state.alunos = action.payload;
    });
  },
});

export const { adicionarAluno } = alunosSlice.actions;
export default alunosSlice.reducer;