import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axios";

interface DespesaType {
  id?: string;
  descricao: string;
  Despesa: string;
  valor: number;
  tipo: string;
  categoria: string;
  recorrente: boolean;
  orcamentoId?: string;
}

const initialState = {
  loading: false,
  despesas: [],
  error: "",
};

export const fecthDespesas: any = createAsyncThunk("despesa/fetchDespesas", async (query: string | undefined) => {
  return api
    .get(`https://art56-server-v2.vercel.app/despesa/list/${query ? query : "" }`)
    .then((response) => response.data.map((Despesa: DespesaType) => Despesa));
});

const despesaListSlice = createSlice({
  name: "despesa",
  initialState,
  reducers: {
    deleteDespesa: (state, action) => {},
    createDespesa: () => {},
    updateDespesa: () => {},
  },
  extraReducers: (builder) => {

    // Fecth Despesa List
    builder.addCase(fecthDespesas.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthDespesas.fulfilled, (state, action) => {
      state.loading = false;
      state.despesas = action.payload;
      state.error = "";
    }),
    builder.addCase(fecthDespesas.rejected, (state, action) => {
      state.loading = false;
      state.despesas = [];
      state.error = action.error.message;
    });

    // Create Despesa Item
    builder.addCase(createDespesaAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createDespesaAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.despesas = [...state.despesas, action.payload ];
      state.error = "";
    }),
    builder.addCase(createDespesaAsync.rejected, (state, action) => { 
      state.loading = false;
      state.despesas = state.despesas;
      state.error = "Oops! Something went wrong. Please try again later.";
    });

    // Update Despesa Item
    builder.addCase(updateDespesaByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateDespesaByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.despesas = state.despesas.map((item:DespesaType) => {
        if(item.id === action.payload.id){
          return item = {...action.payload}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateDespesaByIdAsync.rejected, (state, action) => { 
 
      state.loading = false;
      state.despesas = state.despesas;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
    

    // Delete Despesa Item
    builder.addCase(deleteDespesaByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteDespesaByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.despesas = state.despesas.filter((item:DespesaType) => item.id != action.payload);
      state.error = "";
    }),
    builder.addCase(deleteDespesaByIdAsync.rejected, (state, action) => {

      state.loading = false;
      state.despesas = state.despesas;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createDespesaAsync = createAsyncThunk(
  "despesa/createDespesa",
  async (createDespesaParams: DespesaType) => {
    const newDespesa = await api.post(
      `https://art56-server-v2.vercel.app/despesa/create`,createDespesaParams
    ).then((resp) => {
      return resp.data
    })

    return newDespesa;
  }        
);

export const updateDespesaByIdAsync = createAsyncThunk(
  "despesa/updatedDespesaById",
  async (updateDespesaParams: {DespesaId:string, data : DespesaType}) => {
    const updatedDespesa = await api.put(
      `https://art56-server-v2.vercel.app/despesa/update/${updateDespesaParams.DespesaId}`,
      updateDespesaParams.data
    ).then((resp : {data: DespesaType}) => resp.data)
    return updatedDespesa;
  }
);

export const deleteDespesaByIdAsync = createAsyncThunk(
  "despesa/deleteDespesaById",
  async (DespesaId: string) => {
    const deletedDespesa = await api.delete(
      `https://art56-server-v2.vercel.app/despesa/delete/${DespesaId}`
    ).then((resp : {data: DespesaType}) => resp.data)
    return deletedDespesa.id;
  }
);

export const { createDespesa, deleteDespesa, updateDespesa } = despesaListSlice.actions;

export const despesaListReducer = despesaListSlice.reducer;
