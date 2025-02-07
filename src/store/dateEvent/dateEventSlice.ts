import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axios";
import { DateEventType } from "../../type";
import { CreateSameDayDateRequestParmsSchema } from "@schemas/dateEvent/create-same-day-data-event-form-zod-schema";
import { CreateeOvernigthDateRequestParmsSchema } from "@schemas/dateEvent/create-overnigth-data-event-request-zod-schema";
import { UpdateSameDayDateEventSchema } from "@schemas/dateEvent/update-same-day-date-event-params-schema";
import { UpdateOverNigthDateEventSchema } from "@schemas/dateEvent/overnigth-date-event-params-schema";


const initialState = {
  error: "",
  loading: false,
  dateEvents: [],
  isModalOpen: false,
};

interface DateEventProps{
  type:string;
  title:string;
  endDate:Date;          
  venueId:string;
  startDate: string;
  proposalId:string;   
  notifications: Notification[]
}


export const fecthDateEvents: any = createAsyncThunk("dateEvent/fetchDateEvents", 
  async (query:string  ,  { rejectWithValue }) => {
   try {
     const response = await api
     .get(
       `/dateEvent/list?${query}`
     )
     .then((response) =>  response.data);
     return response;
   } catch (error: any) {
     return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
   }
 }    
);
const dateEventListSlice = createSlice({
  name: "dateEvent",
  initialState,
  reducers: {
    deleteDateEvent: (state, action) => {},
    createDateEvent: () => {},
    updateDateEvent: () => {},
    openDataEventModal: (state, action) => {
      state.isModalOpen = true; // Abre o modal
    },
    closeDataEventModal: (state) => {
      state.isModalOpen = false; // Fecha o modal
    }
  },
  extraReducers: (builder) => {

    // Fecth DateEvent List
    builder.addCase(fecthDateEvents .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthDateEvents .fulfilled, (state, action) => {
      state.loading = false;
      state.dateEvents = action.payload.data.dateEventList;
      state.error = "";
    }),
    builder.addCase(fecthDateEvents .rejected, (state, action) => {
      state.loading = false;
      state.dateEvents = [];
      state.error = action.error.message;
    });

    // Create DateEvent Item
    builder.addCase(createSameDayDateEventAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createSameDayDateEventAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.dateEvents = [...state.dateEvents, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createSameDayDateEventAsync.rejected, (state, action) => { 
      state.loading = false;
      state.dateEvents = state.dateEvents;
      state.error = "Oops! Something went wrong. Please try again later.";
    });

    // Create DateEvent Item
    builder.addCase(createOverNigthDateEventAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOverNigthDateEventAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.dateEvents = [...state.dateEvents, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createOverNigthDateEventAsync.rejected, (state, action) => { 
      state.loading = false;
      state.dateEvents = state.dateEvents;
      state.error = "Oops! Something went wrong. Please try again later.";
    });

    // Update DateEvent Item
    builder.addCase(updateSameDayDateEventAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSameDayDateEventAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.dateEvents = state.dateEvents.map((item:DateEventType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateOverNightDateEventAsync.rejected, (state, action) => { 
      state.loading = false;
      state.dateEvents = state.dateEvents;
      state.error = "Oops! Something went wrong. Please try again later.";
    });

    // Update DateEvent Item
    builder.addCase(updateOverNightDateEventAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOverNightDateEventAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.dateEvents = state.dateEvents.map((item:DateEventType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateSameDayDateEventAsync.rejected, (state, action) => { 
      state.loading = false;
      state.dateEvents = state.dateEvents;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
    

    // Delete DateEvent Item
    builder.addCase(deleteDateEventByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteDateEventByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.dateEvents = state.dateEvents.filter((item:DateEventType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteDateEventByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.dateEvents = state.dateEvents;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createSameDayDateEventAsync = createAsyncThunk(
  "dateEvent/createSameDayDateEvent",
  async (createSameDayDateEventParams: CreateSameDayDateRequestParmsSchema, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/dateEvent/createSameDay`,createSameDayDateEventParams
      ).then((resp) => {
        return resp.data
      })
      return response;
    } catch (error) {

      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const createOverNigthDateEventAsync = createAsyncThunk(
  "dateEvent/createOverNigthDateEvent",
  async (createOverNigthDateEventParams: CreateeOvernigthDateRequestParmsSchema, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/dateEvent/createOvernigth`,createOverNigthDateEventParams
      ).then((resp) => {
        return resp.data
      })
      return response;
    } catch (error) {

      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const updateSameDayDateEventAsync = createAsyncThunk(
  "dateEvent/updateSameDayDateEvent",
  async (updateSameDayDateEventParams: UpdateSameDayDateEventSchema, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/dateEvent/updateSameDay`,updateSameDayDateEventParams
      ).then((resp) => {
        return resp.data
      })
      return response;
    } catch (error) {

      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const updateOverNightDateEventAsync = createAsyncThunk(
  "dateEvent/updateOverNightDateEvent",
  async (updateOverNightDateEventParams: UpdateOverNigthDateEventSchema, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/dateEvent/updateOverNight`,updateOverNightDateEventParams
      ).then((resp) => {
        return resp.data
      })
      return response;
    } catch (error) {

      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);


export const deleteDateEventByIdAsync = createAsyncThunk(
  "dateEvent/deleteDateEventById",
  async (dateEventId: string, { rejectWithValue }) => {
    try {
      const response = await api
        .delete(`/dateEvent/delete/${dateEventId}`)
        .then((resp: { data: any }) => resp.data);

      return response;
    } catch (error) {

      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);


export const getDateEventByDateAsync = createAsyncThunk(
  "dateEvent/getDateEventByDate",
  async (dateEventId: string) => {
    const deletedDateEvent = await api.delete(
      `/dateEvent/delete/${dateEventId}`
    ).then((resp : {data: DateEventType}) => resp.data)
    return deletedDateEvent.id;
  }
);

export const { createDateEvent, deleteDateEvent, updateDateEvent,closeDataEventModal, openDataEventModal } = dateEventListSlice.actions;

export const dateEventReducer = dateEventListSlice.reducer;
