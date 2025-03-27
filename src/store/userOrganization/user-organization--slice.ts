
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserOrganizationType, UserPermissionsType } from "../../type"
import { CreateUserOrganizationParamsSchema } from "@schemas/userOrganization/create-user-organization-params-schema";
import { UpdateUserOrganizationRequestParams } from "@schemas/userOrganization/update-user-organization-params-schema";
import { CreateOrganizationDataResponse, Organization, SelectedOrganizationDataResponse } from "@store/organization/organizationSlice";
import { string } from "zod";
import { Venue, VenueListDataResponse } from "@store/venue/venueSlice";


const initialState: {
  error: string;
  loading: boolean;
  userOrganization: UserOrganizationType;
  userOrganizations: UserOrganizationType[] | [],
  userOrganizationsByOrganization: UserOrganizationType[] | [],
} = {
  error: "",
  loading: false,
  userOrganizations: [],
  userOrganization: null,
  userOrganizationsByOrganization: [],
};

export const fecthUserOrganization: any = createAsyncThunk("userorganization/fetchUserOrganization",
  async (query: string, { rejectWithValue }) => {

    try {
      const response = await api
        .get(
          `/userOrganization/list?${query}`
        )
        .then((response) => response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }
);

export const fecthUserOrganizationByOrganizationId: any = createAsyncThunk("userorganization/fetchUserOrganizationByOrganization",
  async (query: string, { rejectWithValue }) => {

    try {
      const response = await api
        .get(
          `/userOrganization/byOrganizationlist?${query}`
        )
        .then((response) => response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }
);

const userorganizationListSlice = createSlice({
  name: "userorganization",
  initialState,
  reducers: {
    deleteUserOrganization: (state, action) => { },
    createUserOrganization: () => { },
    updateUserOrganization: () => { },
  },
  extraReducers: (builder) => {

    // Fecth UserOrganization List
    builder.addCase(fecthUserOrganization.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthUserOrganization.fulfilled, (state, action) => {
      state.loading = false;
      state.userOrganizations = action.payload.data.userOrganizationList;
      /* state.organizations = action.payload.data.userOrganizationList.map((item: UserOrganizationType) => item?.organization); */
      /* state.userPermissions = action.payload.data.userOrganizationList.flatMap((item: UserOrganizationType) => item?.userPermissions); */
      state.error = "";
    }),
      builder.addCase(fecthUserOrganization.rejected, (state, action) => {
        state.loading = false;
        state.userOrganizations = state.userOrganizations;
        state.error = action.error.message;
      });

    // Fecth UserOrganization List
    builder.addCase(fecthUserOrganizationByOrganizationId.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthUserOrganizationByOrganizationId.fulfilled, (state, action) => {
      state.loading = false;
      state.userOrganizationsByOrganization = action.payload.data.userOrganizationByOrganizationList;
      state.error = "";
    }),
      builder.addCase(fecthUserOrganizationByOrganizationId.rejected, (state, action) => {
        state.loading = false;
        state.userOrganizationsByOrganization = state.userOrganizationsByOrganization;
        state.error = action.error.message;
      });

    // Create UserOrganization Item
    builder.addCase(createUserOrganizationAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createUserOrganizationAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.userOrganizationsByOrganization = action.payload.data;
      state.error = "";
    }),
      builder.addCase(createUserOrganizationAsync.rejected, (state, action) => {
        state.loading = false;
        state.userOrganizationsByOrganization = state.userOrganizations;
        state.error = action.error.message;
      });


    builder.addCase(selectUserOrganizationAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectUserOrganizationAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.userOrganization = action.payload.data;
      state.error = "";

    }),
      builder.addCase(selectUserOrganizationAsync.rejected, (state, action) => {
        state.loading = false;
        state.userOrganization = state.userOrganization;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update UserOrganization Item
    builder.addCase(updateUserOrganizationAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserOrganizationAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.userOrganizations = state.userOrganizations.map((item) => {
        if (item?.id === action.payload.data?.id) {
          return item = { ...action.payload.data }
        } else {
          return item
        }
      });
      state.userOrganizationsByOrganization = state.userOrganizationsByOrganization.map((item) => {
        if (item?.id === action?.payload?.data?.id) {
          return item = { ...action.payload?.data }
        } else {
          return item
        }
      });
      state.userOrganization = action.payload?.data;
      state.error = "";
    }),
      builder.addCase(updateUserOrganizationAsync.rejected, (state, action) => {
        state.loading = false;
        state.userOrganizations = state.userOrganizations;
        state.error = action.error.message;
      });


    // Delete UserOrganization Item
    builder.addCase(deleteUserOrganizationByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUserOrganizationByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.userOrganizations = state.userOrganizations?.filter((item: UserOrganizationType) => item?.id != action.payload.data?.id);
      state.error = "";
    }),
      builder.addCase(deleteUserOrganizationByIdAsync.rejected, (state, action) => {

        state.loading = false;
        state.userOrganizations = state.userOrganizations;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createUserOrganizationAsync = createAsyncThunk(
  "userOrganization/createUserOrganization",
  async (params: CreateUserOrganizationParamsSchema, { rejectWithValue }) => {
    try {
      const response = await api
        .post(`/userOrganization/create`, params
        )
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const selectUserOrganizationAsync = createAsyncThunk(
  "userOrganization/select",
  async (params: string, { rejectWithValue }) => {
    try {
      const selectedUserOrganization = await api
        .get(`/userOrganization/getById?${params}`)
        .then((resp) => {
          return resp.data;
        })
      return selectedUserOrganization;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const updateUserOrganizationAsync = createAsyncThunk(
  "userorganization/updatedUserOrganization",
  async (params: UpdateUserOrganizationRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
        .put(`/userOrganization/update`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const deleteUserOrganizationByIdAsync = createAsyncThunk(
  "userorganization/deleteUserOrganizationById",
  async (userorganizationId: string, { rejectWithValue }) => {
    try {
      const response = await api
        .delete(`/userorganization/delete/${userorganizationId}`)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const { createUserOrganization, deleteUserOrganization, updateUserOrganization } = userorganizationListSlice.actions;

export const userorganizationListReducer = userorganizationListSlice.reducer;
