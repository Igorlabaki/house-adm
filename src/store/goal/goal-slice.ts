import { GoalType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { UpdateGoalRequestParams } from "@schemas/goal/update-goal-params-schema";
import { CreateGoalRequestParams } from "@schemas/goal/create-goal-params-schema";

const initialState = {
  loading: false,
  goals: [],
  error: "",
};

export const fecthGoals: any = createAsyncThunk("goal/fetchGoals", 
  async (query:string  ,  { rejectWithValue }) => {
   try {
     const response = await api
     .get(
       `/goal/list?${query}`
     )
     .then((response) =>  response.data);
      return response;
   } catch (error: any) {

     return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
   }
 }    
);

const goalListSlice = createSlice({
  name: "goal",
  initialState,
  reducers: {
    deleteGoal: (state, action) => {},
    createGoal: () => {},
    updateGoal: () => {},
  },
  extraReducers: (builder) => {

    // Fecth Goal List
    builder.addCase(fecthGoals .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthGoals .fulfilled, (state, action) => {
      state.loading = false;
      state.goals = action.payload.data.goalList;
      state.error = "";
    }),
    builder.addCase(fecthGoals .rejected, (state, action) => {
      state.loading = false;
      state.goals = state.goals;
      state.error = action.error.message;
    });

    // Create Goal Item
    builder.addCase(createGoalAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createGoalAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.goals = [...state.goals, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createGoalAsync.rejected, (state, action) => { 
      state.loading = false;
      state.goals = state.goals;
      state.error = state.error;
    });

    // Update Goal Item
    builder.addCase(updateGoalByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateGoalByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.goals = state.goals.map((item: GoalType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateGoalByIdAsync.rejected, (state, action) => { 
      state.loading = false;
      state.goals = state.goals;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
    

    // Delete Goal Item
    builder.addCase(deleteGoalByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteGoalByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.goals = state.goals.filter((item:GoalType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteGoalByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.goals = state.goals;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createGoalAsync = createAsyncThunk(
  "goal/createGoal",
  async (params: CreateGoalRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .post(`/goal/create`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }    
);

export const updateGoalByIdAsync = createAsyncThunk(
  "goal/updatedGoalById",
  async (params: UpdateGoalRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .put(`/goal/update`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const deleteGoalByIdAsync = createAsyncThunk(
  "goal/deleteGoalById",
  async (goalId: string, { rejectWithValue }) => {
    try {
      const response = await api
      .delete(`/goal/delete/${goalId}`)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const { createGoal, deleteGoal, updateGoal } = goalListSlice.actions;

export const goalStateReducer = goalListSlice.reducer;
