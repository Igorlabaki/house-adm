import { AppDispatch } from "..";
import { api } from "../../services/axios";
import { fetchUser } from "@store/user/userSlice";
import { Organization } from "@store/organization/organizationSlice";
import { getUserSave, removeUserSave, storageUserSave } from "storage/storage-user";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAccessTokenSave, removeAccessTokenSave, storageAccessTokenSave } from "storage/storage-access-token";


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

export const authenticateUser: any = createAsyncThunk(
  "auth/authenticate",
  async ({ password, email }: { password: string, email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/authenticate`,
        {
          email,
          password
        }
      ).then((response) => response.data);
      if (response?.session?.user) {
        await storageUserSave(response?.session?.user);
      }

      if (response?.accessToken) {
        await storageAccessTokenSave(response?.accessToken);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);


export const loadAccessTokenFromStorage = createAsyncThunk('auth/accessToken', async () => {
  const accessToken = await getAccessTokenSave();
  if (accessToken) {
    return accessToken
  }
   
  return
});

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    logout: (state) => {
      removeUserSave(); // Remove o usuário do armazenamento
      removeAccessTokenSave(); // Remove o token de acesso do armazenamento
      state.error = null;
      state.loading = false;
      state.accessToken = null; // Limpa o token do estado
      state.session = null; // Limpa a sessão do estado
    },
  },
  extraReducers: (builder) => {
    // Fecth session 
    builder.addCase(authenticateUser.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(authenticateUser.fulfilled, (state, action: PayloadAction<AuthenticateDataResponse>) => {
        state.loading = false;
        state.accessToken = action.payload?.accessToken;
        state.session = action.payload.session;
        state.user = action.payload.session.user;
        state.error = "";
        (dispatch: AppDispatch) => dispatch(fetchUser());
      }),
      builder.addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.accessToken = "";
        state.error = action.payload;
      })
  }
});


export const { logout } = sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;