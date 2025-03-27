import { SeasonalFeeType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateSeasonalFeeRequestParams } from "@schemas/seasonalFee/create-seasonal-fee-params-schema";
import { UpdateSeasonalFeeRequestParams } from "@schemas/seasonalFee/update-seasonal-fee-params-schema";



const initialState = {
  loading: false,
  discountFees: [],
  error: "",
};

export const fecthDiscountFees: any = createAsyncThunk("discountfees/fetchDiscountFees", 
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

const discountfeesListSlice = createSlice({
  name: "discountfees",
  initialState,
  reducers: {
    deleteDiscountFees: (state, action) => {},
    createDiscountFees: () => {},
    updateDiscountFees: () => {},
  },
  extraReducers: (builder) => {

    // Fecth DiscountFees List
    builder.addCase(fecthDiscountFees .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthDiscountFees .fulfilled, (state, action) => {
      state.loading = false;
      state.discountFees = action.payload.data.seasonalfeeList;
      state.error = "";
    }),
    builder.addCase(fecthDiscountFees .rejected, (state, action) => {
      state.loading = false;
      state.discountFees = state.discountFees;
      state.error = action.error.message;
    });

    // Create DiscountFees Item
    builder.addCase(createDiscountFeesAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createDiscountFeesAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.discountFees = [...state.discountFees, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createDiscountFeesAsync.rejected, (state, action) => { 
      state.loading = false;
      state.discountFees = state.discountFees;
      state.error = state.error;
    });

    // Update DiscountFees Item
    builder.addCase(updateDiscountFeesByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateDiscountFeesByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.discountFees = state.discountFees.map((item:SeasonalFeeType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateDiscountFeesByIdAsync.rejected, (state, action) => { 
      state.loading = false;
      state.discountFees = state.discountFees;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
    

    // Delete DiscountFees Item
    builder.addCase(deleteDiscountFeesByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteDiscountFeesByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.discountFees = state.discountFees.filter((item:SeasonalFeeType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteDiscountFeesByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.discountFees = state.discountFees;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createDiscountFeesAsync = createAsyncThunk(
  "discountfees/createDiscountFees",
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

export const updateDiscountFeesByIdAsync = createAsyncThunk(
  "discountfees/updatedDiscountFeesById",
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

export const deleteDiscountFeesByIdAsync = createAsyncThunk(
  "discountfees/deleteDiscountFeesById",
  async (discountfeesId: string, { rejectWithValue }) => {
    try {
      const response = await api
      .delete(`/seasonalfee/delete/${discountfeesId}`)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const { createDiscountFees, deleteDiscountFees, updateDiscountFees } = discountfeesListSlice.actions;

export const discountfeesListReducer = discountfeesListSlice.reducer;
