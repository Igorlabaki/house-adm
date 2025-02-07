import { QuestionType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateQuestionFormData } from "zod/zodTypes/createQuestionFormZodType";
import { UpdateQuestionRequestParams } from "@schemas/question/update-question-params-schema";

const initialState = {
  loading: false,
  questions: [],
  error: "",
};

export const fecthQuestions: any = createAsyncThunk("question/fetchQuestions", 
  async (query:string  ,  { rejectWithValue }) => {
   try {
     const response = await api
     .get(
       `/question/list?${query}`
     )
     .then((response) =>  response.data);
     return response;
   } catch (error: any) {
     return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
   }
 }    
);

const questionListSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    deleteQuestion: (state, action) => {},
    createQuestion: () => {},
    updateQuestion: () => {},
  },
  extraReducers: (builder) => {

    // Fecth Question List
    builder.addCase(fecthQuestions .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthQuestions .fulfilled, (state, action) => {
      state.loading = false;
      state.questions = action.payload.data.questionList;
      state.error = "";
    }),
    builder.addCase(fecthQuestions .rejected, (state, action) => {
      state.loading = false;
      state.questions = state.questions;
      state.error = action.error.message;
    });

    // Create Question Item
    builder.addCase(createQuestionAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createQuestionAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.questions = [...state.questions, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createQuestionAsync.rejected, (state, action) => { 
      state.loading = false;
      state.questions = state.questions;
      state.error = state.error;
    });

    // Update Question Item
    builder.addCase(updateQuestionByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateQuestionByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.questions = state.questions.map((item:QuestionType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateQuestionByIdAsync.rejected, (state, action) => { 
      state.loading = false;
      state.questions = state.questions;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
    

    // Delete Question Item
    builder.addCase(deleteQuestionByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteQuestionByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.questions = state.questions.filter((item:QuestionType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteQuestionByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.questions = state.questions;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createQuestionAsync = createAsyncThunk(
  "question/createQuestion",
  async (params: CreateQuestionFormData, { rejectWithValue }) => {
    try {
      const response = await api
      .post(`/question/create`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }    
);

export const updateQuestionByIdAsync = createAsyncThunk(
  "question/updatedQuestionById",
  async (params: UpdateQuestionRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .put(`/question/update`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const deleteQuestionByIdAsync = createAsyncThunk(
  "question/deleteQuestionById",
  async (questionId: string, { rejectWithValue }) => {
    try {
      const response = await api
      .delete(`/question/delete/${questionId}`)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const { createQuestion, deleteQuestion, updateQuestion } = questionListSlice.actions;

export const questionListReducer = questionListSlice.reducer;
