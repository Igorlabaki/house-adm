
import { RegisterUserRequestParams } from "@schemas/user/register-user-params-schema";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  users: [],
  selectedUser: null,
  newUser: null,
  error: "",
};

export const fecthUsers: any = createAsyncThunk("user/fetchUser",
  async (query: string, { rejectWithValue }) => {

    try {
      const response = await api
        .get(
          `/user/list?${query}`
        )
        .then((response) => response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }
);

const userListSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {

    // Fecth User List
    builder.addCase(fecthUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload?.data?.userList;
      state.error = "";
    }),
      builder.addCase(fecthUsers.rejected, (state, action) => {
        state.loading = false;
        state.users = state.users;
        state.error = action.error.message;
      });

    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action: any) => {
      state.loading = false;
      state.users = [...state.users, action.payload.data];
      state.selectedUser = action.payload.data
      state.error = "";
    }),
      builder.addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.users = state.users;
        state.error = action.error.message;
      });

    builder.addCase(selectedUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectedUser.fulfilled, (state, action: any) => {
      state.loading = false;
      state.selectedUser = action.payload.data;
    });
    builder.addCase(selectedUser.rejected, (state, action) => {
      state.loading = false;
      state.selectedUser = state.selectedUser;
    });
  },
});

export const selectedUser = createAsyncThunk(
  "user/select",
  async (params: string, { rejectWithValue }) => {
    try {
      const response = await api
        .get(`/user/getById?${params}`)
        .then((response) => response?.data);
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  })

export const registerUser = createAsyncThunk(
  "user/createNewUser",
  async (params: RegisterUserRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
        .post(`/user/createNewUser`, params)
        .then((response) => response?.data);
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  })



export const { } = userListSlice.actions;

export const userListReducer = userListSlice.reducer;
