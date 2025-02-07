import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axios";
import { BugdetType, DateEventType, Pagamento } from "../../type";

const initialState = {
  loading: false,
  orcamento: {} as BugdetType | null,
  error: "",
};

// Async thunk para buscar orçamento pelo ID
export const fetchOrcamentoById = createAsyncThunk(
  "orcamento/fetchOrcamentoById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`https://art56-server-v2.vercel.app/orcamento/getById/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erro ao carregar orçamento");
    }
  }
);

// Async thunk para atualizar orçamento pelo ID
export const updateOrcamentoByIdAsync = createAsyncThunk(
  "orcamento/updateOrcamento",
  async ({ orcamentoId, data }: { orcamentoId: string; data: any }) => {
    const response = await api.put(
      `https://art56-server-v2.vercel.app/orcamento/update/${orcamentoId}`,
      data
    );
    return response.data;
  }
);

// Async thunk para deletar orçamento pelo ID
export const deleteOrcamentoByIdAsync = createAsyncThunk(
  "orcamento/deleteOrcamentoById",
  async (orcamentoId: string) => {
    await api.delete(`https://art56-server-v2.vercel.app/orcamento/delete/${orcamentoId}`);
    return orcamentoId;
  }
);

// Async thunk para deletar orçamento pelo ID
export const deletePagamentoOrcamentoByIdAsync = createAsyncThunk(
  "orcamento/deletePagamentoOrcamentoById",
  async (pagamentoId: string) => {
    const pagamentoDeleted = await api.delete(`https://art56-server-v2.vercel.app/pagamento/delete/${pagamentoId}`);

    return pagamentoDeleted
  }
);

export const deleteDateOrcamentoByIdAsync = createAsyncThunk(
  "orcamento/deleteDateOrcamentoById",
  async (dateEvent: string) => {
    const pagamentoDeleted = await api.delete(`https://art56-server-v2.vercel.app/dateEvent/delete/${dateEvent}`);
    return pagamentoDeleted
  }
);

// Slice para orçamento
const orcamentoByIdSlice = createSlice({
  name: "orcamento",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Orçamento
    builder.addCase(fetchOrcamentoById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrcamentoById.fulfilled, (state, action: PayloadAction<BugdetType>) => {
      state.loading = false;
      state.orcamento = action.payload;
      state.error = "";
    });
    builder.addCase(fetchOrcamentoById.rejected, (state, action) => {
      state.loading = false;
      state.orcamento = null;
      state.error = action.payload as string;
    });

    // delete pagamento Orçamento
    builder.addCase(deletePagamentoOrcamentoByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePagamentoOrcamentoByIdAsync.fulfilled, (state, action: PayloadAction<Pagamento>) => {
      state.loading = false;
      state.orcamento = {
        ...state.orcamento,
        pagamentos: state.orcamento.pagamentos.filter((item:Pagamento) => item.id != action.payload.id)
      };
      state.error = "";
    });
    builder.addCase(deletePagamentoOrcamentoByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.orcamento = null;
      state.error = action.payload as string;
    });

    // delete pagamento Orçamento
    builder.addCase(deleteDateOrcamentoByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteDateOrcamentoByIdAsync.fulfilled, (state, action: PayloadAction<DateEventType>) => {
      state.loading = false;
      state.orcamento = {
        ...state.orcamento,
        Data: state.orcamento.Data.filter((item:DateEventType) => item.id != action.payload.id)
      };
      state.error = "";
    });
    builder.addCase(deleteDateOrcamentoByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.orcamento = null;
      state.error = action.payload as string;
    });

    // Update Orçamento
    builder.addCase(updateOrcamentoByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOrcamentoByIdAsync.fulfilled, (state, action: PayloadAction<BugdetType>) => {
      state.loading = false;
      state.orcamento = action.payload;
      state.error = "";
    });
    builder.addCase(updateOrcamentoByIdAsync.rejected, (state) => {
      state.loading = false;
      state.error = "Erro ao atualizar orçamento.";
    });

    // Delete Orçamento
    builder.addCase(deleteOrcamentoByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOrcamentoByIdAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.orcamento = null;
      state.error = "";
    });
    builder.addCase(deleteOrcamentoByIdAsync.rejected, (state) => {
      state.loading = false;
      state.error = "Erro ao deletar orçamento.";
    });
  },
});

export const orcamentoByIdReducer = orcamentoByIdSlice.reducer;