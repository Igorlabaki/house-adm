import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axios";

interface DespesaType {
  id?: string;
  descricao: string;
  valor: number;
  tipo: string;
  dataPagamento: string;
  categoria: string;
  recorrente: boolean;
  orcamentoId?: string;
}

interface DespesaState {
  loading: boolean;
  despesas: {
    recorrentes: {
      total: number;
      list: DespesaType[];
    };
    naoRecorrentes: {
      total: number;
      list: DespesaType[];
    };
  };
  error: string;
}

const initialState: DespesaState = {
  loading: false,
  despesas: {
    recorrentes: {
      total: 0,
      list: [],
    },
    naoRecorrentes: {
      total: 0,
      list: [],
    },
  },
  error: "",
};

export const fetchDespesas : any = createAsyncThunk<DespesaState['despesas'], string | undefined>(
  "despesa/fetchDespesas",
  async (query: string | undefined) => {
    return api
      .get(`https://art56-server-v2.vercel.app/despesa/list?query=${query ? query : ""}`)
      .then((response) => response.data);
  }
);

const despesaListSlice = createSlice({
  name: "despesa",
  initialState,
  reducers: {
    deleteDespesa: (state, action: PayloadAction<string>) => {
    },
    createDespesa: () => {},
    updateDespesa: () => {},
  },
  extraReducers: (builder) => {
    // Fetch Despesa List
    builder.addCase(fetchDespesas.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDespesas.fulfilled, (state, action: PayloadAction<DespesaState['despesas']>) => {
      state.loading = false;
      state.despesas = action.payload; // Atualiza o estado com as despesas agrupadas
      state.error = "";
    });
    builder.addCase(fetchDespesas.rejected, (state, action) => {
      state.loading = false;
      state.despesas = initialState.despesas; // Reseta as despesas em caso de erro
      state.error = action.error.message || "Error fetching despesas";
    });

    // Create Despesa Item
    builder.addCase(createDespesaAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createDespesaAsync.fulfilled, (state, action: PayloadAction<DespesaType>) => {
      state.loading = false;
      const newDespesa = action.payload;

      // Adiciona nova despesa à lista correta
      if (newDespesa.recorrente) {
        state.despesas.recorrentes.list.push(newDespesa);
        state.despesas.recorrentes.total += newDespesa.valor;
      } else {
        state.despesas.naoRecorrentes.list.push(newDespesa);
        state.despesas.naoRecorrentes.total += newDespesa.valor;
      }

      state.error = "";
    });
    builder.addCase(createDespesaAsync.rejected, (state) => {
      state.loading = false;
      state.error = "Oops! Something went wrong. Please try again later.";
    });

    // Update Despesa Item
    builder.addCase(updateDespesaByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateDespesaByIdAsync.fulfilled, (state, action: PayloadAction<DespesaType>) => {
      state.loading = false;
      const updatedDespesa = action.payload;

      // Atualiza a despesa na lista correta
      if (updatedDespesa.recorrente) {
        state.despesas.recorrentes.list = state.despesas.recorrentes.list.map((item) => {
          return item.id === updatedDespesa.id ? { ...updatedDespesa } : item;
        });
        state.despesas.recorrentes.total = state.despesas.recorrentes.list.reduce((total, despesa) => total + despesa.valor, 0);
      } else {
        state.despesas.naoRecorrentes.list = state.despesas.naoRecorrentes.list.map((item) => {
          return item.id === updatedDespesa.id ? { ...updatedDespesa } : item;
        });
        state.despesas.naoRecorrentes.total = state.despesas.naoRecorrentes.list.reduce((total, despesa) => total + despesa.valor, 0);
      }

      state.error = "";
    });
    builder.addCase(updateDespesaByIdAsync.rejected, (state) => {
      state.loading = false;
      state.error = "Oops! Something went wrong. Please try again later.";
    });

    // Delete Despesa Item
    builder.addCase(deleteDespesaByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteDespesaByIdAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      const deletedDespesaId = action.payload;

      // Remove a despesa da lista correta
      state.despesas.recorrentes.list = state.despesas.recorrentes.list.filter(item => item.id !== deletedDespesaId);
      state.despesas.naoRecorrentes.list = state.despesas.naoRecorrentes.list.filter(item => item.id !== deletedDespesaId);

      // Recalcula os totais
      state.despesas.recorrentes.total = state.despesas.recorrentes.list.reduce((total, despesa) => total + despesa.valor, 0);
      state.despesas.naoRecorrentes.total = state.despesas.naoRecorrentes.list.reduce((total, despesa) => total + despesa.valor, 0);

      state.error = "";
    });
    builder.addCase(deleteDespesaByIdAsync.rejected, (state) => {
      state.loading = false;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createDespesaAsync = createAsyncThunk(
  "despesa/createDespesa",
  async (createDespesaParams: DespesaType) => {
    const newDespesa = await api.post(
      `https://art56-server-v2.vercel.app/despesa/create`, createDespesaParams
    ).then((resp) => {
      return resp.data;
    });
    return newDespesa;
  }        
);

export const updateDespesaByIdAsync = createAsyncThunk(
  "despesa/updatedDespesaById",
  async (updateDespesaParams: { despesaId: string, data: DespesaType }) => {
    const updatedDespesa = await api.put(
      `https://art56-server-v2.vercel.app/despesa/update/${updateDespesaParams.despesaId}`,
      updateDespesaParams.data
    ).then((resp: { data: DespesaType }) => resp.data);
    return updatedDespesa;
  }
);

export const deleteDespesaByIdAsync = createAsyncThunk(
  "despesa/deleteDespesaById",
  async (DespesaId: string) => {
    const deletedDespesa = await api.delete(
      `https://art56-server-v2.vercel.app/despesa/delete/${DespesaId}`
    ).then((resp: { data: DespesaType }) => resp.data);
    return deletedDespesa.id;
  }
);

export const { createDespesa, deleteDespesa, updateDespesa } = despesaListSlice.actions;

export const despesaListReducer = despesaListSlice.reducer;