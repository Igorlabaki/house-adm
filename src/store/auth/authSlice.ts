import { AppDispatch } from "..";
import { api } from "../../services/axios";
import { fetchUser } from "@store/user/userSlice";
import { Organization } from "@store/organization/organizationSlice";
import { getUserSave, removeUserSave, storageUserSave } from "storage/storage-user";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAccessTokenSave, removeAccessTokenSave, storageAccessTokenSave } from "storage/storage-access-token";
import { authService } from "../../services/auth.service";
import { StoredToken, RegisterGoogleUserRequestParams } from "../../types/auth.types";


export interface AuthenticateDataResponse {
  accessToken: string,
  session: {
    user: User,
    expiresAt: Date,
    isValid: boolean,
  }
}

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  avatarUrl: string;
  userOrganizations: UserOrganization[]
}

export interface UserOrganization {
  id: string;
  userId: string;
  joinedAt: Date;
  organizationId: string;
  role: "ADMIN" | "USER";
  organization: Organization;
}

const initialState = {
  error: "",
  user: null,
  session: null,
  loading: false,
  accessToken: null,
};

export const authenticateUser = createAsyncThunk(
  "auth/authenticate",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await authService.authenticate(email, password);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Erro ao autenticar usuário");
    }
  }
);

export const loadSession = createAsyncThunk(
  'auth/loadSession', 
  async () => {
    const tokenData = await getAccessTokenSave();
    if (tokenData?.accessToken && tokenData.session) {
      return tokenData;
    }
    return null;
  }
);

export const googleAuth = createAsyncThunk(
  "auth/googleAuth",
  async (params: RegisterGoogleUserRequestParams, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register/google', params);
      const { accessToken, session } = response.data;
      
      await storageAccessTokenSave(accessToken);
      
      return { accessToken, session };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Erro ao autenticar com Google");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.error = null;
      state.loading = false;
      state.accessToken = null;
      state.session = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(authenticateUser.fulfilled, (state, action: PayloadAction<StoredToken>) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.session = action.payload.session;
        state.user = action.payload.session.user;
        state.error = "";
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.accessToken = null;
        state.error = action.payload as string;
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.accessToken = action.payload.accessToken;
          state.session = action.payload.session;
          state.user = action.payload.session.user;
          state.error = "";
        }
      })
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.session = action.payload.session;
        state.error = "";
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.accessToken = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;