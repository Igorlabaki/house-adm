import { api } from "../../services/axios";
import { NotificationType } from "../../type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationListDataResponse {
  success: boolean,
  message: string,
  data: {
    notificationList: NotificationType[]
  },
  count: number,
  type: string
}

const initialState: { loading: boolean; notifications: NotificationType[]; error: string } = {
  loading: false,
  notifications: [],
  error: "",
};

export const fetchNotificationsList = createAsyncThunk(
  "notification/fetchNotifications",
  async ( query:string  ,  { rejectWithValue }) => {
    try {
      const response = await api
      .get(
        `/notification/list/${query}`
      )
      .then((response) =>  response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
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
    builder.addCase(fetchNotificationsList.fulfilled, (state, action: PayloadAction<NotificationListDataResponse>) => {
      state.loading = false;
      state.notifications = action.payload.data.notificationList; // Carrega a lista completa de notificações
      state.error = "";
    });
    builder.addCase(fetchNotificationsList.rejected, (state, action) => {
      state.loading = false;
      state.notifications = [];
      state.error = action.error.message || "Erro ao carregar orçamentos";
    });
  },
});

export const notificationListReducer = notificationListSlice.reducer;
