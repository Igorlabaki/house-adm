import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axios";
import { QuestionType } from "../../type";

const initialState = {
  loading: false,
  questions: [],
  error: "",
};

export const fecthQuestions : any = createAsyncThunk("question/fetchQuestions", async (query: string | undefined) => {
  return api
    .get(`https://art56-server-v2.vercel.app/question/list/${query ? query : "" }`)
    .then((response) => response.data.map((text: QuestionType) => text));
});

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
      state.questions = action.payload;
      state.error = "";
    }),
    builder.addCase(fecthQuestions .rejected, (state, action) => {
      state.loading = false;
      state.questions = [];
      state.error = action.error.message;
    });

    // Create Question Item
    builder.addCase(createQuestionAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createQuestionAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.questions = [...state.questions, action.payload ];
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
        if(item.id === action.payload.id){
          return item = {...action.payload}
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
      state.questions = state.questions.filter((item:QuestionType) => item.id != action.payload);
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
  async (createQuestionParams: QuestionType) => {     
    const newText = await api.post(
      `https://art56-server-v2.vercel.app/question/create`,createQuestionParams
    ).then((resp) => {
      return resp.data
    })
    return newText;
  }        
);

export const updateQuestionByIdAsync = createAsyncThunk(
  "question/updatedQuestionById",
  async (updateQuestionParams: {questionId: string, data : QuestionType}) => {
    const updatedQuestion = await api.put(
      `https://art56-server-v2.vercel.app/question/update/${updateQuestionParams.questionId}`,
      updateQuestionParams.data
    ).then((resp : {data: QuestionType}) => resp.data)
    return updatedQuestion;
  }
);

export const deleteQuestionByIdAsync = createAsyncThunk(
  "question/deleteQuestionById",
  async (questionId: string) => {
    const deletedQuestion = await api.delete(
      `https://art56-server-v2.vercel.app/question/delete/${questionId}`
    ).then((resp : {data: QuestionType}) => resp.data)
    return deletedQuestion.id;
  }
);

export const { createQuestion, deleteQuestion, updateQuestion } = questionListSlice.actions;

export const questionListReducer = questionListSlice.reducer;
