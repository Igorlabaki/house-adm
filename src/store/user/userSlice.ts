import { api } from 'services/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UpdateUserRequestParams } from '@schemas/user/update-user-params-schema';
import { getUserSave, removeUserSave, storageUserSave } from 'storage/storage-user';
import { storageAccessTokenSave } from 'storage/storage-access-token';

// Ação assíncrona para buscar o usuário do AsyncStorage
export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const user = await getUserSave();

  return user || null;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    loggedIn: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loggedIn = false
      removeUserSave();
    },
    setUser: (state, action) => {
      state.user = action.payload;
      storageUserSave(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.loggedIn = true;
        } else {
          state.user = null;
          state.loggedIn = false;
        }
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      });

    builder.addCase(updateUserAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.user = action.payload.data || state.user;
    });
    builder.addCase(updateUserAsync.rejected, (state, action) => {
      state.loading = false;
      state.user = state.user;
    });
  },
});

export const updateUserAsync = createAsyncThunk(
  "user/updated",
  async (params: FormData, { rejectWithValue }) => {
    try {
      const response = await api
        .put(`/user/update`, params, {
          headers: {
            "Content-Type": "multipart/form-data", // Importante para envio de arquivos
          },
        })
        .then((response) => response?.data);
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  })

export const { logout, setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;