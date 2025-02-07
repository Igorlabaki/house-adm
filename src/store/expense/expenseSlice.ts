import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateExpenseRequestData } from "@schemas/expense/create-expense-request-params-schema";
import { UpdateExpenseRequestSchema } from "@schemas/expense/update-expense-request-params-schema";

export interface ExpenseType {
  id?: string;
  name: string;
  amount: number; 
  venueId: string;
  paymentDate: Date;
  recurring: boolean;
  description: string;
  type: "WEEKLY" |"BIWEEKLY" |"MONTHLY" |"ANNUAL" |"SPORADIC";
  category:  "TAX" | "INVESTMENT" | "MAINTENANCE" | "ADVERTISING";
}

const initialState = {
  loading: false,
  expenses: [],
  error: "",
};

export const fecthExpenses: any = createAsyncThunk("expense/fetchExpenses", 
   async (query:string  ,  { rejectWithValue }) => {
    try {
      const response = await api
      .get(
        `/expense/list?${query}`
      )
      .then((response) =>  response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }    
);

const expenseListSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    deleteExpense: (state, action) => {},
    createExpense: () => {},
    updateExpense: () => {},
  },
  extraReducers: (builder) => {

    // Fecth Expense List
    builder.addCase(fecthExpenses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthExpenses.fulfilled, (state, action) => {
      state.loading = false;
      state.expenses = action.payload.data.expenseList;
      state.error = "";
    }),
    builder.addCase(fecthExpenses.rejected, (state, action) => {
      state.loading = false;
      state.expenses = state.expenses;
      state.error = action.error.message;
    });

    // Create Expense Item
    builder.addCase(createExpenseAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createExpenseAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.expenses = [...state.expenses, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createExpenseAsync.rejected, (state, action) => { 
      state.loading = false;
      state.expenses = state.expenses;
      state.error = action.error.message;
    });

    // Update Expense Item
    builder.addCase(updateExpenseByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateExpenseByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.expenses = state.expenses.map((item:ExpenseType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateExpenseByIdAsync.rejected, (state, action) => { 
      state.loading = false;
      state.expenses = state.expenses;
      state.error = action.error.message;
    });
    

    // Delete Expense Item
    builder.addCase(deleteExpenseByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteExpenseByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.expenses = state.expenses.filter((item:ExpenseType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteExpenseByIdAsync.rejected, (state, action) => {

      state.loading = false;
      state.expenses = state.expenses;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createExpenseAsync = createAsyncThunk(
  "expense/createExpense",
  async (params: CreateExpenseRequestData, { rejectWithValue }) => {
    try {
      const response = await api
      .post(`/expense/create`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }      
);

export const updateExpenseByIdAsync = createAsyncThunk(
  "expense/updatedExpenseById",
  async (params: UpdateExpenseRequestSchema, { rejectWithValue }) => {
    try {
      const response = await api
      .put(`/expense/update`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }    
);

export const deleteExpenseByIdAsync = createAsyncThunk(
  "expense/deleteExpenseById",
  async (expenseId: string, { rejectWithValue }) => {
    try {
      const response = await api
      .delete(`/expense/delete/${expenseId}`)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const { createExpense, deleteExpense, updateExpense } = expenseListSlice.actions;

export const expenseListReducer = expenseListSlice.reducer;
