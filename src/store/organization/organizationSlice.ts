import { OwnerType } from "type";
import { api } from "../../services/axios";
import { CreateVenueDataResponse, Venue } from "@store/venue/venueSlice";
import { CreateVenueFormSchema } from "@schemas/venue/create-venue-params-schema";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface OrganizationListDataResponse {
  success: boolean,
  message: string,
  data: {
    organizationList: Organization[]
  },
  count: number,
  type: string
}

export interface CreateOrganizationDataResponse {
  success: boolean,
  message: string,
  data:Organization,
  count: number,
  type: string
}

export interface SelectedOrganizationDataResponse {
  success: boolean,
  message: string,
  data: Organization,
  count: number,
  type: string
}

interface UpdateOrganizationRequestParams {
  name: string,
  userId: string
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tikTokUrl: string;
  url: string;
  logoUrl: string;
  venues: Venue[];
  owners: OwnerType[];
}

export interface CreateOrganizationDTO {
  name: string;
  userId: string;
  whatsappNumber?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  email: string;
  url?: string;
  facebookUrl?: string;
  logoFile?: string | File;
}

export interface UpdateOrganizationDTO {
  organizationId: string;
  name: string;
  whatsappNumber?: string
  tiktokUrl?: string
  instagramUrl?: string
  email: string
  url?: string
  facebookUrl?: string
  logoFile?: string | File;
}

const initialState = {
  loading: false,
  organizations: [],
  organization: {
    id: "",
    name: "",
    venues: [],
    owners: []
  },
  error: "",
};

export const fecthOrganizations: any = createAsyncThunk(
  "organization/list",
  async (query: string | undefined , { rejectWithValue }) => {
    try {
      const response = await api
        .get(
          `/organization/list?${query}`
        )
        .then((response) => response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

const organizationListSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    deleteOrganization: (state, action) => { },
    createOrganization: () => { },
    updateOrganization: () => { },
  },
  extraReducers: (builder) => {
    // Fecth Organization List
    builder.addCase(fecthOrganizations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthOrganizations.fulfilled, (state, action: PayloadAction<OrganizationListDataResponse>) => {
      state.loading = false;
      state.organizations = action.payload.data.organizationList;
      state.error = "";
    }),
      builder.addCase(fecthOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.organizations = [];
        state.error = action.error.message;
      });

    // Create Organization Item
    builder.addCase(createOrganizationAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOrganizationAsync.fulfilled, (state, action: PayloadAction<CreateOrganizationDataResponse>) => {
      state.loading = false;
      state.organizations = [...state.organizations, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createOrganizationAsync.rejected, (state, action) => {
        state.loading = false;
        state.organizations = state.organizations;
        state.error = action.payload as string;
      });

    // Update Organization Item
    builder.addCase(updateOrganizationAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOrganizationAsync.fulfilled, (state, action: PayloadAction<CreateOrganizationDataResponse>) => {
      state.loading = false;
      state.organizations = state.organizations.map((item: Organization) => {
        if (item.id === action.payload.data.id) {
          return (item = { ...action.payload.data });
        } else {
          return item;
        }
      });
      state.organization = action.payload.data;
      state.error = "";
    }),
      builder.addCase(updateOrganizationAsync.rejected, (state, action) => {
        state.loading = false;
        state.organizations = state.organizations;
        state.error = `Esta organizacao ${action.payload as string}`;
      });

    // Update Organization Item
    builder.addCase(selectOrganizationAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectOrganizationAsync.fulfilled, (state, action: PayloadAction<SelectedOrganizationDataResponse>) => {
      state.loading = false;
      state.organization = action.payload.data;
      state.error = "";
    }),
      builder.addCase(selectOrganizationAsync.rejected, (state, action) => {
        state.loading = false;
        state.organizations = state.organizations;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

      // Create Venue Item
    builder.addCase(createOrganizationVenueAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOrganizationVenueAsync.fulfilled, (state, action: PayloadAction<CreateVenueDataResponse>) => {
      state.loading = false;
      state.organization.venues = [...state.organization.venues, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createOrganizationVenueAsync.rejected, (state, action) => {
        state.loading = false;
        state.organization.venues = state.organization.venues;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Delete Text Item
    builder.addCase(deleteOrganizationAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOrganizationAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.organizations = state.organizations.filter(
        (item: Organization) => item.id != action.payload
      );
      state.error = "";
    }),
      builder.addCase(deleteOrganizationAsync.rejected, (state, action) => {
        state.loading = false;
        state.organizations = state.organizations;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createOrganizationAsync = createAsyncThunk(
  "organization/create",
  async (params: CreateOrganizationDTO, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Adiciona todos os campos do DTO ao FormData, exceto logoFile
      Object.entries(params).forEach(([key, value]) => {
        if (key !== 'logoFile' && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      console.log(params.logoFile)
      // Adiciona o arquivo se existir
      if (params.logoFile) {
        formData.append('file', {
          uri: params.logoFile,
          name: 'logo.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const response = await api.post(`/organization/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar organizacao");
    }
  }
);

export const createOrganizationVenueAsync = createAsyncThunk(
  "organization/createVenue",
  async (params: {organizationId: string,userId: string, data: CreateVenueFormSchema}, { rejectWithValue }) => {
    try {
      const newVenue = await api
      .post(`/venue/create`, params)
      .then((resp) => {
        return resp.data;
      })
    return newVenue;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
   
  }
);

export const selectOrganizationAsync = createAsyncThunk(
  "organization/select",
  async (params: string, { rejectWithValue }) => {
    try {
      const selectedOrganization = await api
        .get(`/organization/getById?${params}`)
        .then((resp) => {
          return resp.data;
        })
      return selectedOrganization;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const updateOrganizationAsync = createAsyncThunk(
  "organization/updated",
  async (params: UpdateOrganizationDTO, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      // Adiciona todos os campos do DTO ao FormData, exceto logoFile
      Object.entries(params).forEach(([key, value]) => {
        if (key !== 'logoFile' && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      // Adiciona o arquivo se existir
      if (params.logoFile) {
        formData.append('file', {
          uri: typeof params.logoFile === 'string' ? params.logoFile : (params.logoFile as any).uri,
          name: (params.logoFile as any).name || 'logo.jpg',
          type: 'image/jpeg',
        } as any);
      }
      console.log(params.organizationId, "organizationId")
      const response = await api.put(`/organization/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const deleteOrganizationAsync = createAsyncThunk(
  "organization/delete",
  async (organizationId: string, { rejectWithValue }) => {
    try {
      const deletedOrganization = await api
        .delete(`/organization/delete/${organizationId}`)
        .then((resp: { data: any }) => resp.data);

      return deletedOrganization.id;
    } catch (error) {

      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const { createOrganization, deleteOrganization, updateOrganization } = organizationListSlice.actions;

export const organizationListReducer = organizationListSlice.reducer;
