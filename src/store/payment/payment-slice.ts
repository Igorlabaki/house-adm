import { PaymentType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UpdatePaymentRequestParamsSchema } from "@schemas/payment/update-payment-request-params";
import { CreatePaymentRequestParamsSchema } from "@schemas/payment/create-payment-request-params";

const initialState = {
  loading: false,
  payments: [],
  error: "",
};

export const fecthPayments: any = createAsyncThunk("payment/fetchPayments",
  async (query: string, { rejectWithValue }) => {

    try {
      const response = await api
        .get(
          `/payment/list?${query}`
        )
        .then((response) => response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }
);

const paymentListSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    deletePayment: (state, action) => { },
    createPayment: () => { },
    updatePayment: () => { },
  },
  extraReducers: (builder) => {

    // Fecth Payment List
    builder.addCase(fecthPayments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthPayments.fulfilled, (state, action) => {
      state.loading = false;
      state.payments = action.payload.data.paymentList;
      state.error = "";
    }),
      builder.addCase(fecthPayments.rejected, (state, action) => {
        state.loading = false;
        state.payments = state.payments;
        state.error = action.error.message;
      });

    // Create Payment Item
    builder.addCase(createPaymentWithImageAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPaymentWithImageAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.payments = [...state.payments, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createPaymentWithImageAsync.rejected, (state, action) => {
        state.loading = false;
        state.payments = state.payments;
        state.error = action.error.message;
      });

    // Create Payment Item
    builder.addCase(createPaymentWhitoutImageAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPaymentWhitoutImageAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.payments = [...state.payments, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createPaymentWhitoutImageAsync.rejected, (state, action) => {
        state.loading = false;
        state.payments = state.payments;
        state.error = action.error.message;
      });

    // Update Payment Item
    builder.addCase(updatePaymentAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePaymentAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.payments = state.payments.map((item: PaymentType) => {
        if (item.id === action.payload.data.id) {
          return item = { ...action.payload.data }
        } else {
          return item
        }
      });
      state.error = "";
    }),
      builder.addCase(updatePaymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.payments = state.payments;
        state.error = action.error.message;
      });


    // Delete Payment Item
    builder.addCase(deletePaymentByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePaymentByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.payments = state.payments.filter((item: PaymentType) => item.id != action.payload.data.id);
      state.error = "";
    }),
      builder.addCase(deletePaymentByIdAsync.rejected, (state, action) => {

        state.loading = false;
        state.payments = state.payments;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createPaymentWithImageAsync = createAsyncThunk(
  "payment/createPaymentWithImage",
  async (params: FormData, { rejectWithValue }) => {
    try {
      const response = await api
        .post(`/payment/create`, params, {
          headers: {
            "Content-Type": "multipart/form-data", // Importante para envio de arquivos
          },
        })
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const createPaymentWhitoutImageAsync = createAsyncThunk(
  "payment/createPaymentWithoutImage",
  async (params: CreatePaymentRequestParamsSchema, { rejectWithValue }) => {
    try {
      const response = await api
        .post(`/payment/create`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const updatePaymentAsync = createAsyncThunk(
  "payment/updatedPayment",
  async (params: UpdatePaymentRequestParamsSchema, { rejectWithValue }) => {
    try {
      const response = await api
        .put(`/payment/update`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const deletePaymentByIdAsync = createAsyncThunk(
  "payment/deletePaymentById",
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const response = await api
        .delete(`/payment/delete/${paymentId}`)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const { createPayment, deletePayment, updatePayment } = paymentListSlice.actions;

export const paymentListReducer = paymentListSlice.reducer;
