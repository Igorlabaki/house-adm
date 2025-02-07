import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserSave, removeUserSave, storageUserSave } from 'storage/storage-user';

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
    loggedIn: false
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
        state.user = action.payload;
        state.loggedIn = true
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;