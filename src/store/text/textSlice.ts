import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axios";

interface TextType {
  id?: string;
  area: string;
  text: string;
  position: number;
  titulo: string | null;
}

const initialState = {
  loading: false,
  texts: [],
  error: "",
};

export const fecthTexts: any = createAsyncThunk("text/fetchTexts", async (query: string | undefined) => {
  return api
    .get(`https://art56-server-v2.vercel.app/text/list/${query ? query : "" }`)
    .then((response) => response.data.map((text: TextType) => text));
});

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
      state.texts = action.payload;
      state.error = "";
    }),
    builder.addCase(fecthTexts.rejected, (state, action) => {
      state.loading = false;
      state.texts = [];
      state.error = action.error.message;
    });

    // Create Text Item
    builder.addCase(createTextAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createTextAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.texts = [...state.texts, action.payload ];
      state.error = "";
    }),
    builder.addCase(createTextAsync.rejected, (state, action) => { 
      state.loading = false;
      state.texts = state.texts;
      state.error = "Oops! Something went wrong. Please try again later.";
    });

    // Update Text Item
    builder.addCase(updateTextByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTextByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.texts = state.texts.map((item:TextType) => {
        if(item.id === action.payload.id){
          return item = {...action.payload}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateTextByIdAsync.rejected, (state, action) => { 
 
      state.loading = false;
      state.texts = state.texts;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
    

    // Delete Text Item
    builder.addCase(deleteTextByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTextByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.texts = state.texts.filter((item:TextType) => item.id != action.payload);
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
  async (createTextParams: TextType) => {
    const newText = await api.post(
      `https://art56-server-v2.vercel.app/text/create`,createTextParams
    ).then((resp) => {
      return resp.data
    })

    return newText;
  }        
);

export const updateTextByIdAsync = createAsyncThunk(
  "text/updatedTextById",
  async (updateTextParams: {textId:string, data : TextType}) => {
    const updatedText = await api.put(
      `https://art56-server-v2.vercel.app/text/update/${updateTextParams.textId}`,
      updateTextParams.data
    ).then((resp : {data: TextType}) => resp.data)
    return updatedText;
  }
);

export const deleteTextByIdAsync = createAsyncThunk(
  "text/deleteTextById",
  async (textId: string) => {
    const deletedText = await api.delete(
      `https://art56-server-v2.vercel.app/text/delete/${textId}`
    ).then((resp : {data: TextType}) => resp.data)
    return deletedText.id;
  }
);

export const { createText, deleteText, updateText } = textListSlice.actions;

export const textListReducer = textListSlice.reducer;
