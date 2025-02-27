import { ContractType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UpdateContractRequestParams } from "@schemas/contract/update-contract-params-schema";
import { CreateContractRequestParams } from "@schemas/contract/create-contract-params-schema";

const initialState = {
  loading: false,
  contracts: [],
  contract: {
    id: "",
    title: "",
    clauses: [],
    contractId: "",
    organizationId: "",
  },
  error: "",
};

export const fecthContracts: any = createAsyncThunk("contract/fetchContracts",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api
        .get(
          `/contract/list?${query}`
        )
        .then((response) => response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }
);

const contractListSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    deleteContract: (state, action) => { },
    createContract: () => { },
    updateContract: () => { },
  },
  extraReducers: (builder) => {

    // Fecth Contract List
    builder.addCase(fecthContracts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthContracts.fulfilled, (state, action) => {
      state.loading = false;
      state.contracts = action.payload.data.contractList;
      state.error = "";
    }),
      builder.addCase(fecthContracts.rejected, (state, action) => {
        state.loading = false;
        state.contracts = state.contracts;
        state.error = action.error.message;
      });

    // Fecth Contract List
    builder.addCase(selectContractAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectContractAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.contract = action.payload.data;
      state.error = "";
    }),
      builder.addCase(selectContractAsync.rejected, (state, action) => {
        state.loading = false;
        state.contracts = state.contracts;
        state.error = action.error.message;
      });

    // Create Contract Item
    builder.addCase(createContractAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createContractAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.contracts = [...state.contracts, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createContractAsync.rejected, (state, action) => {
        state.loading = false;
        state.contracts = state.contracts;
        state.error = state.error;
      });

    // Update Contract Item
    builder.addCase(updateContractByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateContractByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.contract = action.payload.data,
      state.contracts = state.contracts.map((item: ContractType) => {
        if (item.id === action.payload.data.id) {
          return item = { ...action.payload.data }
        } else {
          return item
        }
      });
      state.error = "";
    }),
      builder.addCase(updateContractByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.contracts = state.contracts;
        state.error = "Oops! Something went wrong. Please try again later.";
      });


    // Delete Contract Item
    builder.addCase(deleteContractByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteContractByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.contracts = state.contracts.filter((item: ContractType) => item.id != action.payload.data.id);
      state.error = "";
    }),
      builder.addCase(deleteContractByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.contracts = state.contracts;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createContractAsync = createAsyncThunk(
  "contract/createContract",
  async (params: CreateContractRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
        .post(`/contract/create`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const updateContractByIdAsync = createAsyncThunk(
  "contract/updatedContractById",
  async (params: UpdateContractRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
        .put(`/contract/update`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const selectContractAsync = createAsyncThunk(
  "contract/select",
  async (contractId: string, { rejectWithValue }) => {
    try {
      const selectedContract = await api
        .get(`/contract/getById/${contractId}`)
        .then((resp) => {
          return resp.data;
        })
      return selectedContract;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao buscar locacao.");
    }
  }
);

export const deleteContractByIdAsync = createAsyncThunk(
  "contract/deleteContractById",
  async (contractId: string, { rejectWithValue }) => {
    try {
      const response = await api
        .delete(`/contract/delete/${contractId}`)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const { createContract, deleteContract, updateContract } = contractListSlice.actions;

export const contractListReducer = contractListSlice.reducer;
