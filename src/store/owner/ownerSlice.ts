import { OwnerType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CreateOwnerFormSchema } from "@schemas/owner/create-owner-params-schema";
import { UpdateOwnerSchema } from "@schemas/owner/update-owner-params-schema";
import { CreateVenueOwnerFormSchema } from "@schemas/owner/create-venue-owner-params-schema";

export interface OwnerListDataResponse {
  success: boolean,
  message: string,
  data:{
    ownerByOrganizationList: OwnerType[]
  },
  count: number,
  type: string
}

export interface OwnerByVenueListDataResponse {
  success: boolean,
  message: string,
  data:{
    ownerByVenueList: OwnerType[]
  },
  count: number,
  type: string
}

export interface CreateOwnerDataResponse {
  success: boolean,
  message: string,
  data: OwnerType,
  count: number,
  type: string
}

const initialState = {
  owner: {},
  error: "",
  loading: false,
  ownersByVenue: [],
  ownersByOrganization: [],
};

export const fecthOwnersByOrganization: any = createAsyncThunk(
  "owner/list",
  async (organizationId: string,  { rejectWithValue }) => {
    try {
      const response = await api
      .get(
        `/owner/listByOrganization?organizationId=${organizationId}`
      )
      .then((response) =>  response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }
);

export const fecthOwnersByVenue: any = createAsyncThunk(
  "owner/listByVenue",
  async ({organizationId,venueId} : {organizationId:string, venueId:string},  { rejectWithValue }) => {
    try {
      const response = await api
      .get(
        `/owner/listByVenue?organizationId=${organizationId}&venueId=${venueId}`
      )
      .then((response) =>  response.data);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }
);

const ownerListSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    deleteOwner: (state, action) => { },
    createOrganizationOwner: () => { },
    createVenueOwner: () => { },
    updateOwner: () => { },
  },
  extraReducers: (builder) => {
    // Fecth Owner List
    builder.addCase(fecthOwnersByOrganization.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthOwnersByOrganization.fulfilled, (state, action:PayloadAction<OwnerListDataResponse>) => {
      state.loading = false;
      state.ownersByOrganization = action.payload.data.ownerByOrganizationList;
      state.error = "";
    }),
      builder.addCase(fecthOwnersByOrganization.rejected, (state, action) => {
        state.loading = false;
        state.ownersByOrganization = [];
        state.error = action.error.message;
      });

    // Fecth Owner List By Venue
    builder.addCase(fecthOwnersByVenue.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthOwnersByVenue.fulfilled, (state, action:PayloadAction<OwnerByVenueListDataResponse>) => {
      state.loading = false;
      state.ownersByVenue = action.payload.data.ownerByVenueList;
      state.error = "";
    }),
      builder.addCase(fecthOwnersByVenue.rejected, (state, action) => {
        state.loading = false;
        state.ownersByVenue = [];
        state.error = action.error.message;
      });

    // Create Owner Item
    builder.addCase(createOrganizationOwnerAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOrganizationOwnerAsync.fulfilled, (state, action: PayloadAction<CreateOwnerDataResponse>) => {
      state.loading = false;
      state.ownersByOrganization = state.ownersByOrganization.concat(action.payload.data);
      state.error = "";
    }),
      builder.addCase(createOrganizationOwnerAsync.rejected, (state, action) => {
        state.loading = false;
        state.ownersByOrganization = state.ownersByOrganization;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Create Owner Item
    builder.addCase(createVenueOwnerAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createVenueOwnerAsync.fulfilled, (state, action: PayloadAction<CreateOwnerDataResponse>) => {
      state.loading = false;
      state.ownersByVenue = [...state.ownersByVenue, action.payload.data];
      state.ownersByOrganization = [...state.ownersByOrganization, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createVenueOwnerAsync.rejected, (state, action) => {
        state.loading = false;
        state.ownersByOrganization = state.ownersByOrganization;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update Owner Item
    builder.addCase(updateOwnerAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOwnerAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.ownersByOrganization = state.ownersByOrganization.map((item: OwnerType) => {
        if (item.id === action.payload.data.id) {
          return (item = { ...action.payload.data });
        } else {
          return item;
        }
      });
      state.ownersByVenue = state.ownersByVenue.map((item: OwnerType) => {
        if (item.id === action.payload.data.id) {
          return (item = { ...action.payload.data });
        } else {
          return item;
        }
      });
      state.error = "";
    }),
      builder.addCase(updateOwnerAsync.rejected, (state, action) => {
        state.loading = false;
        state.ownersByVenue = state.ownersByVenue;
        state.ownersByOrganization = state.ownersByOrganization;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Select Owner Item
    builder.addCase(selectOwnerAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectOwnerAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.owner = action.payload.data.owner
      state.error = "";
    }),
      builder.addCase(selectOwnerAsync.rejected, (state, action) => {
        state.loading = false;
        state.owner = state.owner;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Delete Text Item
    builder.addCase(deleteOwnerAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOwnerAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.ownersByOrganization = state.ownersByOrganization.filter(
        (item: OwnerType) => item.id != action.payload.data.id
      );
      state.ownersByVenue = state.ownersByOrganization.filter(
        (item: OwnerType) => item.id != action.payload.data.id
      );
      state.error = "";
    }),
      builder.addCase(deleteOwnerAsync.rejected, (state, action) => {
        state.loading = false;
        state.ownersByVenue = state.ownersByVenue;
        state.ownersByOrganization = state.ownersByOrganization;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createOrganizationOwnerAsync = createAsyncThunk(
  "owner/createOrganizationOwner",
  async (data: CreateOwnerFormSchema, { rejectWithValue }) => {
    try {
      const newOwner = await api
      .post(`/owner/createOrganizationOwner`, data)
      .then((resp) => {
        return resp.data;
      })
    return newOwner;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
   
  }
);

export const createVenueOwnerAsync = createAsyncThunk(
  "owner/createVenueOwner",
  async (data: CreateVenueOwnerFormSchema, { rejectWithValue }) => {
    try {
      const newOwner = await api
      .post(`/owner/createVenueOwner`, data)
      .then((resp) => {
        return resp.data;
      })
    return newOwner;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
   
  }
);

export const selectOwnerAsync = createAsyncThunk(
  "owner/select",
  async (ownerId: string, { rejectWithValue }) => {
    try {
      const selectedOwner = await api
        .get(`/owner/getById/${ownerId}`)
        .then((resp) => {
          return resp.data;
        })

      return selectedOwner;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao buscar locacao.");
    }
  }
);

export const updateOwnerAsync = createAsyncThunk(
  "owner/updated",
   async (data: UpdateOwnerSchema, { rejectWithValue }) => {
    try {
      const updatedOwner = await api
      .put(
        `/owner/update`,
        data
      )
      .then((resp: { data: any }) => resp.data);

    return updatedOwner;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao atualisar proprietario.");
    }
  }
);

export const deleteOwnerAsync = createAsyncThunk(
  "owner/delete",
  async (ownerId: string, { rejectWithValue }) => {
    try {
      const deletedOwner = await api
        .delete(`/owner/delete/${ownerId}`)
        .then((resp) => {
          return resp.data;
        })

      return deletedOwner;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro deletar proprietario.");
    }
  }
);

export const { createVenueOwner,createOrganizationOwner, deleteOwner, updateOwner } = ownerListSlice.actions;

export const ownerListReducer = ownerListSlice.reducer;
