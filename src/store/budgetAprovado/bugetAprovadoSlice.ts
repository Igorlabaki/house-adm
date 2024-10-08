import { createSlice, createAsyncThunk, PayloadAction, configureStore } from "@reduxjs/toolkit";
import { api } from "../../services/axios";
import { BugdetType } from "../../type";

const initialState = {
  loading: false,
  orcamentosAprovado: [],
  error: "",
};


export const fecthOrcamentosAprovados: any = createAsyncThunk(
  "orcamentoAprovado/fetchOrcamentosAprovados",
  async ({url}:{url: string | undefined}) => {
    return api
      .get(
        `https://art56-server-v2.vercel.app/orcamento/listAprovado?${url}`
      )
      .then((response) => response.data.map((value: BugdetType) => value));   
  }
);


const orcamentoAprovadoListSlice = createSlice({
  name: "orcamentoAprovado",
  initialState,
  reducers: {
    deleteOrcamentoAprovado: (state, action) => {},
    createOrcamentoAprovado: () => {},
    updateOrcamentoAprovado: () => {},
  },
  extraReducers: (builder) => {
    // Fecth Orcamento List
    builder.addCase(fecthOrcamentosAprovados.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthOrcamentosAprovados.fulfilled, (state, action) => {
      state.loading = false;
      state.orcamentosAprovado = action.payload;
      state.error = "";
    }),
      builder.addCase(fecthOrcamentosAprovados.rejected, (state, action) => {
        state.loading = false;
        state.orcamentosAprovado = [];
        state.error = action.error.message;
    });

    
  },
});

export const createOrcamentoAprovadoValueAsync = createAsyncThunk(
  "orcamentoAprovado/createOrcamentoAprovado",
  async (createValueParams: BugdetType) => {
    const newValue = await api
      .post(`https://art56-server-v2.vercel.app/orcamento/create`, createValueParams)
      .then((resp) => {
        return resp.data;
      });
    return newValue;
  }
);

export const updateOrcamentoAprovadoByIdAsync = createAsyncThunk(
  "orcamentoAprovado/updatedOrcamentoAprovado",
  async (updateOrcamentoParams: { orcamentoId: string; data: any }) => {
    const updatedOrcamento = await api
      .put(
        `https://art56-server-v2.vercel.app/orcamento/update/${updateOrcamentoParams.orcamentoId}`,
        updateOrcamentoParams.data
      )
      .then((resp: { data: BugdetType }) => resp.data);
    return updatedOrcamento;
  }
);

export const deleteOrcamentoByIdAsync = createAsyncThunk(
  "orcamentoAprovado/deleteOrcamentoAprovadoById",
  async (orcamentoId: string) => {
    const orcamentoValue = await api
      .delete(`https://art56-server-v2.vercel.app/orcamento/delete/${orcamentoId}`)
      .then((resp: { data: BugdetType }) => resp.data);
    return orcamentoValue.id;
  }
);

export const { createOrcamentoAprovado, deleteOrcamentoAprovado, updateOrcamentoAprovado } = orcamentoAprovadoListSlice.actions;

export const orcamentoAprovadoListReducer = orcamentoAprovadoListSlice.reducer;
