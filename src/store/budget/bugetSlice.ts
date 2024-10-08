import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axios";
import { BugdetType } from "../../type";

const initialState = {
  loading: false,
  orcamentos: [],
  error: "",
};

export const fecthOrcamentos: any  = createAsyncThunk(
  "orcamento/fetchOrcamentos",
  async ({ url }: { url: string | undefined }, { rejectWithValue }) => {
    try {
      const response = await api.get(`https://art56-server-v2.vercel.app/orcamento/list?${url}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erro ao carregar orçamentos");
    }
  }
);

const orcamentoListSlice = createSlice({
  name: "orcamento",
  initialState,
  reducers: {
    deleteOrcamento: (state, action) => {},
    createOrcamento: () => {},
    updateOrcamento: () => {},
  },
  extraReducers: (builder) => {
    // Fecth Orcamento List
    builder.addCase(fecthOrcamentos.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthOrcamentos.fulfilled, (state, action: PayloadAction<BugdetType[]>) => {
      state.loading = false;
      state.orcamentos = action.payload;
      state.error = "";
    }),
      builder.addCase(fecthOrcamentos.rejected, (state, action) => {
        state.loading = false;
        state.orcamentos = [];
        state.error = action.error.message;
    });

    // Create Orcamento Item

    builder.addCase(createOrcamentoValueAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOrcamentoValueAsync.fulfilled, (state, action: PayloadAction<BugdetType[]>) => {
      state.loading = false;
      state.orcamentos = [...state.orcamentos, action.payload];
      state.error = "";
    }),
      builder.addCase(createOrcamentoValueAsync.rejected, (state, action) => {
        state.loading = false;
        state.orcamentos = state.orcamentos;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update Orcamento Item
    builder.addCase(updateOrcamentoByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOrcamentoByIdAsync.fulfilled, (state, action: PayloadAction<BugdetType>) => {
      state.loading = false;
      state.orcamentos = state.orcamentos.map((item: BugdetType) => {
        if (item.id === action.payload.id) {
          return (item = { ...action.payload });
        } else {
          return item;
        }
      });
      state.error = "";
    }),
      builder.addCase(updateOrcamentoByIdAsync.rejected, (state) => {
        state.loading = false;
        state.orcamentos = state.orcamentos;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Delete Orcamento Item
    builder.addCase(deleteOrcamentoByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOrcamentoByIdAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.orcamentos = state.orcamentos.filter(
        (item: BugdetType) => item.id != action.payload
      );
      state.error = "";
    }),
      builder.addCase(deleteOrcamentoByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.orcamentos = state.orcamentos;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createOrcamentoValueAsync = createAsyncThunk(
  "orcamento/createOrcamento",
  async (createValueParams: any) => {
    const newValue = await api
      .post(`https://art56-server-v2.vercel.app/orcamento/create`, createValueParams)
      .then((resp) => {
        return resp.data;
      });
    return newValue;
  }
);

export const updateOrcamentoByIdAsync = createAsyncThunk(
  "orcamento/updatedOrcamento",
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
  "orcamento/deleteOrcamentoById",
  async (orcamentoId: string) => {
    const orcamentoValue = await api
      .delete(`https://art56-server-v2.vercel.app/orcamento/delete/${orcamentoId}`)
      .then((resp: { data: BugdetType }) => resp.data);
    return orcamentoValue.id;
  }
);

export const { createOrcamento, deleteOrcamento, updateOrcamento } = orcamentoListSlice.actions;

export const orcamentoListReducer = orcamentoListSlice.reducer;
