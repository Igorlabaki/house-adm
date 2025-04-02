import { CreateWorkerRequestParams } from "@schemas/worker/create-worker-params-schema";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UpdateWorkerRequestParams } from "@schemas/worker/update-worker-params-schema";


export interface WorkerType {
  id: string;
  name: string;
  rg: string | null;
  proposalId: string;
  attendance: boolean;
  email: string | null;
  type: "WORKER"
}

export interface WorkerListDataResponse {
  success: boolean,
  message: string,
  data: {
    personList: WorkerType[]
  },
  count: number,
  type: string
}

export interface CreateWorkerDataResponse {
  data: WorkerType;
  type: string;
  count: number;
  message: string;
  success: boolean;
}

const initialState: {
  error: string,
  loading: boolean,
  workerList: WorkerType[],
  worker: WorkerType,
} = {
  loading: false,
  workerList: [],
  worker: {
    id: "",
    rg: "",
    name: "",
    email: "",
    proposalId: "",
    type: "WORKER",
    attendance: false,
  },
  error: "",
};

export const fecthWorkers: any = createAsyncThunk(
  "worker/list",
  async (url:string, { rejectWithValue }) => {
    try {
      const response = await api
        .get(
          `/person/list?${url}`
        )
        .then((response) => response.data);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

const workerListSlice = createSlice({
  name: "worker",
  initialState,
  reducers: {
    deleteWorker: (state, action) => { },
    createWorker: () => { },
    updateWorker: () => { },
  },
  extraReducers: (builder) => {
    // Fecth WORKER List
    builder.addCase(fecthWorkers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthWorkers.fulfilled, (state, action: PayloadAction<WorkerListDataResponse>) => {
      state.loading = false;
      state.workerList = action.payload.data.personList;
      state.error = "";
    }),
      builder.addCase(fecthWorkers.rejected, (state, action) => {
        state.loading = false;
        state.workerList = [];
        state.error = action.error.message;
      });

    // Create WORKER Item
    builder.addCase(createWorkerAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createWorkerAsync.fulfilled, (state, action: PayloadAction<CreateWorkerDataResponse>) => {
      state.loading = false;
      state.workerList = [...state.workerList, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createWorkerAsync.rejected, (state, action) => {
        state.loading = false;
        state.workerList = state.workerList;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update WORKER Item
    builder.addCase(updateWorkerAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateWorkerAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.workerList = state.workerList.map((item: WorkerType) => {
        if (item.id === action.payload.data?.id) {
          return (item = { ...action.payload.data });
        } else {
          return item;
        }
      });
      state.worker = action.payload.data,
        state.error = "";
    }),
      builder.addCase(updateWorkerAsync.rejected, (state, action) => {
        state.loading = false;
        state.workerList = state.workerList;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Select WORKER Item
    builder.addCase(selectWorkerAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectWorkerAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.worker = action.payload.data.worker
      state.error = "";
    }),
      builder.addCase(selectWorkerAsync.rejected, (state, action) => {
        state.loading = false;
        state.worker = state.worker;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Delete Text Item
    builder.addCase(deleteWorkerAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteWorkerAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.workerList = state.workerList.filter(
        (item: WorkerType) => item.id != action.payload.data.id
      );
      state.error = "";
    }),
      builder.addCase(deleteWorkerAsync.rejected, (state, action) => {
        state.loading = false;
        state.workerList = state.workerList;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createWorkerAsync = createAsyncThunk(
  "worker/create",
  async (params: CreateWorkerRequestParams, { rejectWithValue }) => {
    try {
      const newWORKER = await api
        .post(`/person/create`, params)
        .then((resp) => {
          return resp.data;
        })
      return newWORKER;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const updateWorkerAsync = createAsyncThunk(
  "worker/updated",
  async (params: UpdateWorkerRequestParams, { rejectWithValue }) => {
    try {
      const newWORKER = await api
        .put(`/person/update`, params)
        .then((resp) => {
          return resp.data;
        })
      return newWORKER;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const selectWorkerAsync = createAsyncThunk(
  "worker/select",
  async (workerId: string, { rejectWithValue }) => {
    try {
      const selectedWORKER = await api
        .get(`/person/getById/${workerId}`)
        .then((resp) => {
          return resp.data;
        })
      return selectedWORKER;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao buscar locacao.");
    }
  }
);

export const deleteWorkerAsync = createAsyncThunk(
  "worker/delete",
  async (workerId: string, { rejectWithValue }) => {
    try {
      const deletedWORKER = await api
        .delete(`/person/delete/${workerId}`)
        .then((resp) => {
          return resp.data;
        })

      return deletedWORKER;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao deletar locacao.");
    }
  }
);

export const { createWorker, deleteWorker, updateWorker } = workerListSlice.actions;

export const workerListReducer = workerListSlice.reducer;
