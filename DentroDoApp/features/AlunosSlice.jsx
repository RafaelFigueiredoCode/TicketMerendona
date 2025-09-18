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

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log("Todos os dados foram removidos.");
  } catch (e) {
    console.error("Erro ao limpar dados:", e);
  }
};
export const clearTickets = async () => {
  try {
    await AsyncStorage.removeItem("tickets"); // só apaga a chave dos tickets
    console.log("Tickets removidos com sucesso.");
  } catch (e) {
    console.error("Erro ao limpar tickets:", e);
  }
};


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