import { CreateGuestRequestParams } from "@schemas/guest/create-guest-params-schema";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UpdateGuestRequestParams } from "@schemas/guest/update-guest-params-schema";

export interface GuestType {
  id: string;
  name: string;
  rg: string | null;
  proposalId: string;
  attendance: boolean;
  email: string | null;
  type: "GUEST"
}

export interface GuestListDataResponse {
  success: boolean,
  message: string,
  data: {
    personList: GuestType[]
  },
  count: number,
  type: string
}

export interface CreateGuestDataResponse {
  data: GuestType;
  type: string;
  count: number;
  message: string;
  success: boolean;
}

const initialState: {
  error: string,
  loading: boolean,
  guestList: GuestType[],
  guest: GuestType,
} = {
  loading: false,
  guestList: [],
  guest: {
    id: "",
    rg: "",
    name: "",
    email: "",
    proposalId: "",
    type: "GUEST",
    attendance: false,
  },
  error: "",
};

export const fecthGuests: any = createAsyncThunk(
  "guest/list",
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

const guestListSlice = createSlice({
  name: "guest",
  initialState,
  reducers: {
    deleteGuest: (state, action) => { },
    createGuest: () => { },
    updateGuest: () => { },
  },
  extraReducers: (builder) => {
    // Fecth GUEST List
    builder.addCase(fecthGuests.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthGuests.fulfilled, (state, action: PayloadAction<GuestListDataResponse>) => {
      state.loading = false;
      state.guestList = action.payload.data.personList;
      state.error = "";
    }),
      builder.addCase(fecthGuests.rejected, (state, action) => {
        state.loading = false;
        state.guestList = [];
        state.error = action.error.message;
      });

    // Create GUEST Item
    builder.addCase(createGuestAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createGuestAsync.fulfilled, (state, action: PayloadAction<CreateGuestDataResponse>) => {
      state.loading = false;
      state.guestList = [...state.guestList, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createGuestAsync.rejected, (state, action) => {
        state.loading = false;
        state.guestList = state.guestList;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update GUEST Item
    builder.addCase(updateGuestAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateGuestAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.guestList = state.guestList.map((item: GuestType) => {
        if (item.id === action.payload.data?.id) {
          return (item = { ...action.payload.data });
        } else {
          return item;
        }
      });
      state.guest = action.payload.data,
        state.error = "";
    }),
      builder.addCase(updateGuestAsync.rejected, (state, action) => {
        state.loading = false;
        state.guestList = state.guestList;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Select GUEST Item
    builder.addCase(selectGuestAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectGuestAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.guest = action.payload.data.guest
      state.error = "";
    }),
      builder.addCase(selectGuestAsync.rejected, (state, action) => {
        state.loading = false;
        state.guest = state.guest;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Delete Text Item
    builder.addCase(deleteGuestAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteGuestAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.guestList = state.guestList.filter(
        (item: GuestType) => item.id != action.payload.data.id
      );
      state.error = "";
    }),
      builder.addCase(deleteGuestAsync.rejected, (state, action) => {
        state.loading = false;
        state.guestList = state.guestList;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createGuestAsync = createAsyncThunk(
  "guest/create",
  async (params: CreateGuestRequestParams, { rejectWithValue }) => {
    try {
      const newGUEST = await api
        .post(`/person/create`, params)
        .then((resp) => {
          return resp.data;
        })
      return newGUEST;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const updateGuestAsync = createAsyncThunk(
  "guest/updated",
  async (params: UpdateGuestRequestParams, { rejectWithValue }) => {
    try {
      const newGUEST = await api
        .put(`/person/update`, params)
        .then((resp) => {
          return resp.data;
        })
      return newGUEST;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const selectGuestAsync = createAsyncThunk(
  "guest/select",
  async (guestId: string, { rejectWithValue }) => {
    try {
      const selectedGUEST = await api
        .get(`/person/getById/${guestId}`)
        .then((resp) => {
          return resp.data;
        })
      return selectedGUEST;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao buscar locacao.");
    }
  }
);

export const deleteGuestAsync = createAsyncThunk(
  "guest/delete",
  async (guestId: string, { rejectWithValue }) => {
    try {
      const deletedGUEST = await api
        .delete(`/person/delete/${guestId}`)
        .then((resp) => {
          return resp.data;
        })

      return deletedGUEST;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao deletar locacao.");
    }
  }
);

export const { createGuest, deleteGuest, updateGuest } = guestListSlice.actions;

export const guestListReducer = guestListSlice.reducer;
