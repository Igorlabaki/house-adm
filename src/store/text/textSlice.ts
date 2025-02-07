import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateTextFormData } from "@schemas/text/create-text-params-schema";
import { UpdateTextRequestParams } from "@schemas/text/update-text-params-schema";

interface TextType {
  id?: string;
  area: string;
  text: string;
  position: number;
  title: string | null;
}

const initialState = {
  loading: false,
  texts: [],
  error: "",
};

export const fecthTexts: any = createAsyncThunk("text/fetchTexts", 
   async (query:string  ,  { rejectWithValue }) => {

    try {
      const response = await api
      .get(
        `/text/list?${query}`
      )
      .then((response) =>  response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }    
);

const textListSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    deleteText: (state, action) => {},
    createText: () => {},
    updateText: () => {},
  },
  extraReducers: (builder) => {

    // Fecth Text List
    builder.addCase(fecthTexts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthTexts.fulfilled, (state, action) => {
      state.loading = false;
      state.texts = action.payload.data.textList;
      state.error = "";
    }),
    builder.addCase(fecthTexts.rejected, (state, action) => {
      state.loading = false;
      state.texts = state.texts;
      state.error = action.error.message;
    });

    // Create Text Item
    builder.addCase(createTextAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createTextAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.texts = [...state.texts, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createTextAsync.rejected, (state, action) => { 
      state.loading = false;
      state.texts = state.texts;
      state.error = action.error.message;
    });

    // Update Text Item
    builder.addCase(updateTextByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTextByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.texts = state.texts.map((item:TextType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateTextByIdAsync.rejected, (state, action) => { 
      state.loading = false;
      state.texts = state.texts;
      state.error = action.error.message;
    });
    

    // Delete Text Item
    builder.addCase(deleteTextByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTextByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.texts = state.texts.filter((item:TextType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteTextByIdAsync.rejected, (state, action) => {

      state.loading = false;
      state.texts = state.texts;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createTextAsync = createAsyncThunk(
  "text/createText",
  async (params: CreateTextFormData, { rejectWithValue }) => {
    try {
      const response = await api
      .post(`/text/create`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }      
);

export const updateTextByIdAsync = createAsyncThunk(
  "text/updatedTextById",
  async (params: UpdateTextRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .put(`/text/update`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }    
);

export const deleteTextByIdAsync = createAsyncThunk(
  "text/deleteTextById",
  async (textId: string, { rejectWithValue }) => {
    try {
      const response = await api
      .delete(`/text/delete/${textId}`)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const { createText, deleteText, updateText } = textListSlice.actions;

export const textListReducer = textListSlice.reducer;
