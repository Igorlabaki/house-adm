import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axios";
import { BugdetType, NotificationType } from "../../type";

const initialState: { loading: boolean; notifications: NotificationType[]; error: string } = {
  loading: false,
  notifications: [],
  error: "",
};

export const fetchNotificationsList = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`https://art56-server-v2.vercel.app/notification/list`);
      return response.data; // Supondo que seja uma lista de notificações
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erro ao carregar orçamentos");
    }
  }
);

const notificationListSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    deleteNotification: (state, action) => {},
    createNotification: () => {},
    updateNotification: () => {},
  },
  extraReducers: (builder) => {
    // Fetch Notification List
    builder.addCase(fetchNotificationsList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchNotificationsList.fulfilled, (state, action: PayloadAction<NotificationType[]>) => {
      state.loading = false;
      state.notifications = action.payload; // Carrega a lista completa de notificações
      state.error = "";
    });
    builder.addCase(fetchNotificationsList.rejected, (state, action) => {
      state.loading = false;
      state.notifications = [];
      state.error = action.error.message || "Erro ao carregar orçamentos";
    });

    // Create Notification Item
    builder.addCase(createNotificationValueAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createNotificationValueAsync.fulfilled, (state, action: PayloadAction<NotificationType[]>) => {
      state.loading = false;
      state.notifications = [...state.notifications, ...action.payload]; // Adiciona a lista recebida ao estado atual
      state.error = "";
    });
    builder.addCase(createNotificationValueAsync.rejected, (state) => {
      state.loading = false;
      state.error = "Oops! Something went wrong. Please try again later.";
    });

    // Delete Notification Item
    builder.addCase(deleteNotificationByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteNotificationByIdAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.notifications = state.notifications.filter(
        (item: NotificationType) => item.id !== action.payload
      );
      state.error = "";
    });
    builder.addCase(deleteNotificationByIdAsync.rejected, (state) => {
      state.loading = false;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createNotificationValueAsync = createAsyncThunk(
  "notification/createNotification",
  async (createValueParams: any) => {
    const newValues = await api
      .post(`https://art56-server-v2.vercel.app/notification/create`, createValueParams)
      .then((resp) => resp.data);
    return newValues; // Supondo que seja uma lista de notificações
  }
);

export const deleteNotificationByIdAsync = createAsyncThunk(
  "notification/deleteNotificationById",
  async (notificationId: string) => {
    const notificationValue = await api
      .delete(`https://art56-server-v2.vercel.app/notification/delete/${notificationId}`)
      .then((resp: { data: BugdetType }) => resp.data);
    return notificationValue.id;
  }
);

export const notificationListReducer = notificationListSlice.reducer;
