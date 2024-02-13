import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axios";
import { DateEventType } from "../../type";

const initialState = {
  loading: false,
  dateEvents: [],
  error: "",
};

export const fecthDateEvents : any = createAsyncThunk("question/fetchDateEvents", async (query: string | undefined) => {
  return api
    .get(`https://art56-server-v2.vercel.app/dateEvent/list/${query ? query : "" }`)
    .then((response) => response.data.map((text: DateEventType) => text));
});

const dateEventListSlice = createSlice({
  name: "dateEvent",
  initialState,
  reducers: {
    deleteDateEvent: (state, action) => {},
    createDateEvent: () => {},
    updateDateEvent: () => {},
  },
  extraReducers: (builder) => {

    // Fecth DateEvent List
    builder.addCase(fecthDateEvents .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthDateEvents .fulfilled, (state, action) => {
      state.loading = false;
      state.dateEvents = action.payload;
      state.error = "";
    }),
    builder.addCase(fecthDateEvents .rejected, (state, action) => {
      state.loading = false;
      state.dateEvents = [];
      state.error = action.error.message;
    });

    // Create DateEvent Item
    builder.addCase(createDateEventAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createDateEventAsync.fulfilled, (state,action: any) => {
      console.log(action)
      state.loading = false;
      state.dateEvents = [...state.dateEvents, action.payload ];
      state.error = "";
    }),
    builder.addCase(createDateEventAsync.rejected, (state, action) => { 
      state.loading = false;
      state.dateEvents = state.dateEvents;
      state.error = "Oops! Something went wrong. Please try again later.";
    });

    // Update DateEvent Item
    builder.addCase(updateDateEventByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateDateEventByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.dateEvents = state.dateEvents.map((item:DateEventType) => {
        if(item.id === action.payload.id){
          return item = {...action.payload}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateDateEventByIdAsync.rejected, (state, action) => { 
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
      state.dateEvents = state.dateEvents.filter((item:DateEventType) => item.id != action.payload);
      state.error = "";
    }),
    builder.addCase(deleteDateEventByIdAsync.rejected, (state, action) => {
      console.log(action.payload)
      state.loading = false;
      state.dateEvents = state.dateEvents;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createDateEventAsync = createAsyncThunk(
  "dateEvent/createDateEvent",
  async (createDateEventParams: DateEventType) => {
    const dateEvent = await api.post(
      `https://art56-server-v2.vercel.app/dateEvent/create`,createDateEventParams
    ).then((resp) => {
      return resp.data
    })
    return dateEvent;
  }        
);

export const updateDateEventByIdAsync = createAsyncThunk(
  "dateEvent/updatedDateEventById",
  async (updateDateEventParams: {dateEventId: string, data : DateEventType}) => {
    const updatedDateEvent = await api.put(
      `https://art56-server-v2.vercel.app/dateEvent/update/${updateDateEventParams.dateEventId}`,
      updateDateEventParams.data
    ).then((resp : {data: DateEventType}) => resp.data)
    return updatedDateEvent;
  }
);

export const deleteDateEventByIdAsync = createAsyncThunk(
  "dateEvent/deleteDateEventById",
  async (dateEventId: string) => {
    const deletedDateEvent = await api.delete(
      `https://art56-server-v2.vercel.app/dateEvent/delete?dataEventId=${dateEventId}`
    ).then((resp : {data: DateEventType}) => resp.data)
    return deletedDateEvent.id;
  }
);

export const getDateEventByDateAsync = createAsyncThunk(
  "dateEvent/getDateEventByDate",
  async (dateEventId: string) => {
    const deletedDateEvent = await api.delete(
      `https://art56-server-v2.vercel.app/dateEvent/delete/${dateEventId}`
    ).then((resp : {data: DateEventType}) => resp.data)
    return deletedDateEvent.id;
  }
);

export const { createDateEvent, deleteDateEvent, updateDateEvent } = dateEventListSlice.actions;

export const dateEventReducer = dateEventListSlice.reducer;
