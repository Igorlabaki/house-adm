

import { UserPermissionType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UpdateUserPermissionRequestParams } from "@schemas/user-permission/update-user-permission-params-schema";
import { CreateUserPermissionRequestParams } from "@schemas/user-permission/create-user-permission-params-schema";

const initialState: {
  error: string;
  loading: boolean;
  userPermission: UserPermissionType;
  userPermissions: UserPermissionType[] | [],
  userPermissionsByVenue: UserPermissionType[] | [],
} = {
  error: "",
  loading: false,
  userPermissions: [],
  userPermission: null,
  userPermissionsByVenue: [],
};

export const fecthUserPermission: any = createAsyncThunk("userpermission/fetchUserPermission",
  async (query: string, { rejectWithValue }) => {

    try {
      const response = await api
        .get(
          `/userPermission/list?${query}`
        )
        .then((response) => response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }
);

const userPermissionListState = createSlice({
  name: "userpermission",
  initialState,
  reducers: {
    deleteUserPermission: (state, action) => { },
    createUserPermission: () => { },
    updateUserPermission: () => { },
  },
  extraReducers: (builder) => {

    // Fecth UserPermission List
    builder.addCase(fecthUserPermission.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthUserPermission.fulfilled, (state, action) => {
      state.loading = false;
      state.userPermissions = action.payload.data.userPermissionList;
      /* state.organizations = action.payload.data.userPermissionList.map((item: UserPermissionType) => item?.organization); */
      /* state.userPermissions = action.payload.data.userPermissionList.flatMap((item: UserPermissionType) => item?.userPermissions); */
      state.error = "";
    }),
      builder.addCase(fecthUserPermission.rejected, (state, action) => {
        state.loading = false;
        state.userPermissions = state.userPermissions;
        state.error = action.error.message;
      });

/*     // Fecth UserPermission List
    builder.addCase(fecthUserPermissionByOrganizationId.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthUserPermissionByOrganizationId.fulfilled, (state, action) => {
      state.loading = false;
      state.userPermissionsByOrganization = action.payload.data.userPermissionByOrganizationList;
      state.error = "";
    }),
      builder.addCase(fecthUserPermissionByOrganizationId.rejected, (state, action) => {
        state.loading = false;
        state.userPermissionsByOrganization = state.userPermissionsByOrganization;
        state.error = action.error.message;
      });
 */
    // Create UserPermission Item

    builder.addCase(createUserPermissionAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createUserPermissionAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.userPermissions = [...state.userPermissions, action.payload.data ];
      state.userPermission = action.payload.data;
      state.error = "";
    }),
      builder.addCase(createUserPermissionAsync.rejected, (state, action) => {
        state.loading = false;
        state.userPermission = state.userPermission;
        state.error = action.error.message;
      });


    builder.addCase(selectUserPermissionAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectUserPermissionAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.userPermission = action.payload.data;
      state.error = "";

    }),
      builder.addCase(selectUserPermissionAsync.rejected, (state, action) => {
        state.loading = false;
        state.userPermission = state.userPermission;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update UserPermission Item
    builder.addCase(updateUserPermissionAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserPermissionAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.userPermissions = state.userPermissions.map((item) => {
        if (item?.id === action.payload.data?.id) {
          return item = { ...action.payload.data }
        } else {
          return item
        }
      })
      state.userPermission = action.payload?.data;
      state.error = "";
    }),
      builder.addCase(updateUserPermissionAsync.rejected, (state, action) => {
        state.loading = false;
        state.userPermissions = state.userPermissions;
        state.error = action.error.message;
      });


    // Delete UserPermission Item
    builder.addCase(deleteUserPermissionByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUserPermissionByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.userPermissions = state.userPermissions?.filter((item: UserPermissionType) => item?.id != action.payload.data?.id);
      state.error = "";
    }),
      builder.addCase(deleteUserPermissionByIdAsync.rejected, (state, action) => {

        state.loading = false;
        state.userPermissions = state.userPermissions;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createUserPermissionAsync = createAsyncThunk(
  "userPermission/createUserPermission",
  async (params: CreateUserPermissionRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
        .post(`/userPermission/create`, params
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

export const selectUserPermissionAsync = createAsyncThunk(
  "userPermission/select",
  async (params: string, { rejectWithValue }) => {
    try {
      const selectedUserPermission = await api
        .get(`/userPermission/getById?${params}`)
        .then((resp) => {
          return resp.data;
        })
      return selectedUserPermission;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const updateUserPermissionAsync = createAsyncThunk(
  "userPermission/updatedUserPermission",
  async (params: UpdateUserPermissionRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
        .put(`/userPermission/update`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const deleteUserPermissionByIdAsync = createAsyncThunk(
  "userPermission/deleteUserPermissionById",
  async (userpermissionId: string, { rejectWithValue }) => {
    try {
      const response = await api
        .delete(`/userPermission/delete/${userpermissionId}`)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const { createUserPermission, deleteUserPermission, updateUserPermission } = userPermissionListState.actions;

export const userPermissionStateReducer = userPermissionListState.reducer;
