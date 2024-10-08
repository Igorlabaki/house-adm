import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axios";

interface ValueType {
  id?: string;
  valor: number;
  titulo: string | null;
}

const initialState = {
  loading: false,
  values: [],
  error: "",
};

export const fecthValues: any = createAsyncThunk(
  "value/fetchValues",
  async (query: string | undefined) => {
    return api
      .get(
        `https://art56-server-v2.vercel.app/value/list/${query ? query : ""}`
      )
      .then((response) => response.data.map((value: ValueType) => value));
  }
);

const valueListSlice = createSlice({
  name: "value",
  initialState,
  reducers: {
    deleteValue: (state, action) => {},
    createValue: () => {},
    updateValue: () => {},
  },
  extraReducers: (builder) => {
    // Fecth Value List
    builder.addCase(fecthValues.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthValues.fulfilled, (state, action) => {
      state.loading = false;
      state.values = action.payload;
      state.error = "";
    }),
      builder.addCase(fecthValues.rejected, (state, action) => {
        state.loading = false;
        state.values = [];
        state.error = action.error.message;
      });

    // Create Value Item
    builder.addCase(createValueAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createValueAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.values = [...state.values, action.payload];
      state.error = "";
    }),
      builder.addCase(createValueAsync.rejected, (state, action) => {
        state.loading = false;
        state.values = state.values;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update Value Item
    builder.addCase(updateValueByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateValueByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.values = state.values.map((item: ValueType) => {
        if (item.id === action.payload.id) {
          return (item = { ...action.payload });
        } else {
          return item;
        }
      });
      state.error = "";
    }),
      builder.addCase(updateValueByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.values = state.values;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Delete Text Item
    builder.addCase(deleteValueByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteValueByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.values = state.values.filter(
        (item: ValueType) => item.id != action.payload
      );
      state.error = "";
    }),
      builder.addCase(deleteValueByIdAsync.rejected, (state, action) => {              
        state.loading = false;
        state.values = state.values;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createValueAsync = createAsyncThunk(
  "value/createValue",
  async (createValueParams: ValueType) => {
    const newValue = await api
      .post(`https://art56-server-v2.vercel.app/value/create`, createValueParams)
      .then((resp) => {
        return resp.data;
      })

    return newValue;
  }
);

export const updateValueByIdAsync = createAsyncThunk(
  "value/updatedValueById",
  async (updateValueParams: { valueId: string; data: ValueType }) => {
    const updatedValue = await api
      .put(
        `https://art56-server-v2.vercel.app/value/update/${updateValueParams.valueId}`,
        updateValueParams.data
      )
      .then((resp: { data: ValueType }) => resp.data);
    return updatedValue;
  }
);

export const deleteValueByIdAsync = createAsyncThunk(
  "value/deleteValueById",
  async (valueId: string) => {
    const deletedValue = await api
      .delete(`https://art56-server-v2.vercel.app/value/delete/${valueId}`)
      .then((resp: { data: ValueType }) => resp.data);
    return deletedValue.id;
  }
);

export const { createValue, deleteValue, updateValue } = valueListSlice.actions;

export const valueListReducer = valueListSlice.reducer;
