import { CreateServiceFormData } from "@schemas/service/create-service-params-schema";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UpdateServiceRequestParams } from "@schemas/service/update-service-params-schema";

export interface ServiceType {
  id?: string;
  name: string;
  price: number; 
  venueId: string; 
}

const initialState = {
  loading: false,
  services: [],
  error: "",
};

export const fecthServices: any = createAsyncThunk("service/fetchServices", 
   async (query:string  ,  { rejectWithValue }) => {
    try {
      const response = await api
      .get(
        `/service/list?${query}`
      )
      .then((response) =>  response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }    
);

const serviceListSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    deleteService: (state, action) => {},
    createService: () => {},
    updateService: () => {},
  },
  extraReducers: (builder) => {

    // Fecth Service List
    builder.addCase(fecthServices.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthServices.fulfilled, (state, action) => {
      state.loading = false;
      state.services = action.payload.data.serviceList;
      state.error = "";
    }),
    builder.addCase(fecthServices.rejected, (state, action) => {
      state.loading = false;
      state.services = state.services;
      state.error = action.error.message;
    });

    // Create Service Item
    builder.addCase(createServiceAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createServiceAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.services = [...state.services, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createServiceAsync.rejected, (state, action) => { 
      state.loading = false;
      state.services = state.services;
      state.error = action.error.message;
    });

    // Update Service Item
    builder.addCase(updateServiceByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateServiceByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.services = state.services.map((item:ServiceType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateServiceByIdAsync.rejected, (state, action) => { 
      state.loading = false;
      state.services = state.services;
      state.error = action.error.message;
    });
    

    // Delete Service Item
    builder.addCase(deleteServiceByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteServiceByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.services = state.services.filter((item:ServiceType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteServiceByIdAsync.rejected, (state, action) => {

      state.loading = false;
      state.services = state.services;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createServiceAsync = createAsyncThunk(
  "service/createService",
  async (params: CreateServiceFormData, { rejectWithValue }) => {
    try {
      const response = await api
      .post(`/service/create`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }      
);

export const updateServiceByIdAsync = createAsyncThunk(
  "service/updatedServiceById",
  async (params: UpdateServiceRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .put(`/service/update`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }    
);

export const deleteServiceByIdAsync = createAsyncThunk(
  "service/deleteServiceById",
  async (serviceId: string, { rejectWithValue }) => {
    try {
      const response = await api
      .delete(`/service/delete/${serviceId}`)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const { createService, deleteService, updateService } = serviceListSlice.actions;

export const serviceListReducer = serviceListSlice.reducer;
