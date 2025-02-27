import { ClauseType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { UpdateClauseRequestParams } from "@schemas/clause/update-clause-params-schema";
import { CreateClauseRequestParams } from "@schemas/clause/create-clause-params-schema";

const initialState = {
  loading: false,
  clauses: [],
  error: "",
};

export const fecthClauses: any = createAsyncThunk("clause/fetchClauses", 
  async (query:string  ,  { rejectWithValue }) => {
   try {
     const response = await api
     .get(
       `/clause/list?${query}`
     )
     .then((response) =>  response.data);
     return response;
   } catch (error: any) {
     return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
   }
 }    
);

const clauseListSlice = createSlice({
  name: "clause",
  initialState,
  reducers: {
    deleteClause: (state, action) => {},
    createClause: () => {},
    updateClause: () => {},
  },
  extraReducers: (builder) => {

    // Fecth Clause List
    builder.addCase(fecthClauses .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthClauses .fulfilled, (state, action) => {
      state.loading = false;
      state.clauses = action.payload.data.clauseList;
      state.error = "";
    }),
    builder.addCase(fecthClauses .rejected, (state, action) => {
      state.loading = false;
      state.clauses = state.clauses;
      state.error = action.error.message;
    });

    // Create Clause Item
    builder.addCase(createClauseAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createClauseAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.clauses = [...state.clauses, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createClauseAsync.rejected, (state, action) => { 
      state.loading = false;
      state.clauses = state.clauses;
      state.error = state.error;
    });

    // Update Clause Item
    builder.addCase(updateClauseByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateClauseByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.clauses = state.clauses.map((item:ClauseType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateClauseByIdAsync.rejected, (state, action) => { 
      state.loading = false;
      state.clauses = state.clauses;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
    

    // Delete Clause Item
    builder.addCase(deleteClauseByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteClauseByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.clauses = state.clauses.filter((item:ClauseType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteClauseByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.clauses = state.clauses;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createClauseAsync = createAsyncThunk(
  "clause/createClause",
  async (params: CreateClauseRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .post(`/clause/create`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }    
);

export const updateClauseByIdAsync = createAsyncThunk(
  "clause/updatedClauseById",
  async (params: UpdateClauseRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .put(`/clause/update`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const deleteClauseByIdAsync = createAsyncThunk(
  "clause/deleteClauseById",
  async (clauseId: string, { rejectWithValue }) => {
    try {
      const response = await api
      .delete(`/clause/delete/${clauseId}`)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const { createClause, deleteClause, updateClause } = clauseListSlice.actions;

export const clauseListReducer = clauseListSlice.reducer;
