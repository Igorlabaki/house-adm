import { SeasonalFeeType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateSeasonalFeeRequestParams } from "@schemas/seasonalFee/create-seasonal-fee-params-schema";
import { UpdateSeasonalFeeRequestParams } from "@schemas/seasonalFee/update-seasonal-fee-params-schema";



const initialState = {
  loading: false,
  surchargeFees: [],
  error: "",
};

export const fecthSurchargeFees: any = createAsyncThunk("surchargefees/fetchSurchargeFees", 
  async (query:string  ,  { rejectWithValue }) => {
   try {
     const response = await api
     .get(
       `/seasonalfee/list?${query}`
     )
     .then((response) =>  response.data);
     return response;
   } catch (error: any) {
     return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
   }
 }    
);

const surchargefeesListSlice = createSlice({
  name: "surchargefees",
  initialState,
  reducers: {
    deleteSurchargeFees: (state, action) => {},
    createSurchargeFees: () => {},
    updateSurchargeFees: () => {},
  },
  extraReducers: (builder) => {

    // Fecth SurchargeFees List
    builder.addCase(fecthSurchargeFees .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthSurchargeFees .fulfilled, (state, action) => {
      state.loading = false;
      state.surchargeFees = action.payload.data.seasonalfeeList;
      state.error = "";
    }),
    builder.addCase(fecthSurchargeFees .rejected, (state, action) => {
      state.loading = false;
      state.surchargeFees = state.surchargeFees;
      state.error = action.error.message;
    });

    // Create SurchargeFees Item
    builder.addCase(createSurchargeFeesAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createSurchargeFeesAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.surchargeFees = [...state.surchargeFees, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createSurchargeFeesAsync.rejected, (state, action) => { 
      state.loading = false;
      state.surchargeFees = state.surchargeFees;
      state.error = state.error;
    });

    // Update SurchargeFees Item
    builder.addCase(updateSurchargeFeesByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSurchargeFeesByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.surchargeFees = state.surchargeFees.map((item:SeasonalFeeType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateSurchargeFeesByIdAsync.rejected, (state, action) => { 
      state.loading = false;
      state.surchargeFees = state.surchargeFees;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
    

    // Delete SurchargeFees Item
    builder.addCase(deleteSurchargeFeesByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteSurchargeFeesByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.surchargeFees = state.surchargeFees.filter((item:SeasonalFeeType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteSurchargeFeesByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.surchargeFees = state.surchargeFees;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createSurchargeFeesAsync = createAsyncThunk(
  "surchargefees/createSurchargeFees",
  async (params: CreateSeasonalFeeRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .post(`/seasonalfee/create`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }    
);

export const updateSurchargeFeesByIdAsync = createAsyncThunk(
  "surchargefees/updatedSurchargeFeesById",
  async (params: UpdateSeasonalFeeRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .put(`/seasonalfee/update`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const deleteSurchargeFeesByIdAsync = createAsyncThunk(
  "surchargefees/deleteSurchargeFeesById",
  async (surchargefeesId: string, { rejectWithValue }) => {
    try {
      const response = await api
      .delete(`/seasonalfee/delete/${surchargefeesId}`)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const { createSurchargeFees, deleteSurchargeFees, updateSurchargeFees } = surchargefeesListSlice.actions;

export const surchargefeesListReducer = surchargefeesListSlice.reducer;
