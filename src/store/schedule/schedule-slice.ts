import { api } from "../../services/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CreateScheduleRequestParams } from "@schemas/schedule/create-schedule-params-schema";
import { UpdateScheduleRequestParams } from "@schemas/schedule/update-schedule-params-schema";

export interface Schedule {
  id: string;
  name: string;
  endHour: Date;
  startHour: Date;
  proposalId: string;
  workerNumber: number;
  description: string | null;
}

export interface scheduleListDataResponse {
  success: boolean,
  message: string,
  data: {
    scheduleList: Schedule[]
  },
  count: number,
  type: string
}

export interface CreatescheduleDataResponse {
  success: boolean,
  message: string,
  data: Schedule,
  count: number,
  type: string
}

const initialState: {
  error: string,
  loading: boolean,
  schedules: Schedule[],
  schedule: Schedule,
} = {
  loading: false,
  schedules: [],
  schedule: {
    id: "",
    name: "",
    endHour: null,
    proposalId: "",
    startHour: null,
    description: "",
    workerNumber: 0,
  },
  error: "",
};

export const fecthScheduleList: any = createAsyncThunk(
  "schedule/list",
  async ({ url }: { url: string | undefined }, { rejectWithValue }) => {

    try {
      const response = await api
        .get(
          `/schedule/list?${url}`
        )
        .then((response) => response.data);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

const scheduleListSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    deleteschedule: (state, action) => { },
    createschedule: () => { },
    updateschedule: () => { },
  },
  extraReducers: (builder) => {
    // Fecth schedule List
    builder.addCase(fecthScheduleList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthScheduleList.fulfilled, (state, action: PayloadAction<scheduleListDataResponse>) => {
      state.loading = false;
      state.schedules = action.payload.data.scheduleList;
      state.error = "";
    }),
      builder.addCase(fecthScheduleList.rejected, (state, action) => {
        state.loading = false;
        state.schedules = [];
        state.error = action.error.message;
      });

    // Create schedule Item
    builder.addCase(createScheduleAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createScheduleAsync.fulfilled, (state, action: PayloadAction<CreatescheduleDataResponse>) => {
      state.loading = false;
      state.schedules = [...state.schedules, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createScheduleAsync.rejected, (state, action) => {
        state.loading = false;
        state.schedules = state.schedules;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update schedule Item
    builder.addCase(updateScheduleAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateScheduleAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.schedules = state.schedules.map((item: Schedule) => {
        if (item.id === action.payload.data.id) {
          return (item = { ...action.payload.data });
        } else {
          return item;
        }
      });
      state.schedule = action.payload.data,
        state.error = "";
    }),
      builder.addCase(updateScheduleAsync.rejected, (state, action) => {
        state.loading = false;
        state.schedules = state.schedules;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Select schedule Item
    builder.addCase(selectScheduleAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectScheduleAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.schedule = action.payload.data.schedule
      state.error = "";
    }),
      builder.addCase(selectScheduleAsync.rejected, (state, action) => {
        state.loading = false;
        state.schedule = state.schedule;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Delete Text Item
    builder.addCase(deleteScheduleAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteScheduleAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.schedules = state.schedules.filter(
        (item: Schedule) => item.id != action.payload.data.id
      );
      state.error = "";
    }),
      builder.addCase(deleteScheduleAsync.rejected, (state, action) => {
        state.loading = false;
        state.schedules = state.schedules;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createScheduleAsync = createAsyncThunk(
  "schedule/create",
  async (params: CreateScheduleRequestParams, { rejectWithValue }) => {
    try {
      const newschedule = await api
        .post(`/schedule/create`, params)
        .then((resp) => {
          return resp.data;
        })
      return newschedule;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const selectScheduleAsync = createAsyncThunk(
  "schedule/select",
  async (scheduleId: string, { rejectWithValue }) => {
    try {
      const selectedschedule = await api
        .get(`/schedule/getById/${scheduleId}`)
        .then((resp) => {
          return resp.data;
        })
      return selectedschedule;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao buscar locacao.");
    }
  }
);

export const updateScheduleAsync = createAsyncThunk(
  "schedule/updated",
  async (data: UpdateScheduleRequestParams, { rejectWithValue }) => {
    try {
      const updatedschedule = await api
        .put(
          `/schedule/update`,
          data
        )
        .then((resp) => resp.data);
      return updatedschedule
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao deletar locacao.");
    }
  }
);

export const deleteScheduleAsync = createAsyncThunk(
  "schedule/delete",
  async (scheduleId: string, { rejectWithValue }) => {
    try {
      const deletedschedule = await api
        .delete(`/schedule/delete/${scheduleId}`)
        .then((resp) => {
          return resp.data;
        })

      return deletedschedule;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao deletar locacao.");
    }
  }
);

export const { createschedule, deleteschedule, updateschedule } = scheduleListSlice.actions;

export const scheduleListReducer = scheduleListSlice.reducer;
