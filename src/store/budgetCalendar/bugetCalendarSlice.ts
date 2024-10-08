import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axios";
import { BugdetType } from "../../type";

const initialState = {
  loading: false,
  orcamentosCalendar: [],
  error: "",
};

export const fecthOrcamentosCalendar = createAsyncThunk(
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

const orcamentoCalendarListSlice = createSlice({
  name: "orcamentoCalendar",
  initialState,
  reducers: {
    deleteOrcamento: (state, action) => {},
    createOrcamento: () => {},
    updateOrcamento: () => {},
  },
  extraReducers: (builder) => {
    // Fecth Orcamento List
    builder.addCase(fecthOrcamentosCalendar.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthOrcamentosCalendar.fulfilled, (state, action: PayloadAction<BugdetType[]>) => {
      state.loading = false;
      state.orcamentosCalendar = action.payload;
      state.error = "";
    }),
      builder.addCase(fecthOrcamentosCalendar.rejected, (state, action) => {
        state.loading = false;
        state.orcamentosCalendar = [];
        state.error = action.error.message;
    });
  },
});

export const orcamentoCalendarListReducer = orcamentoCalendarListSlice.reducer;
