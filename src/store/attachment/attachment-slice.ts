import { AttachmentType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { UpdateAttachmentRequestParams } from "@schemas/attachment/update-attachment-params-schema";
import { CreateAttachmentFormData } from "@schemas/attachment/create-attachment-params-schema";

const initialState = {
  loading: false,
  attachments: [],
  error: "",
};

export const fecthAttachments: any = createAsyncThunk("attachment/fetchAttachment", 
  async (query:string  ,  { rejectWithValue }) => {
   try {
     const response = await api
     .get(
       `/attachment/list?${query}`
     )
     .then((response) =>  response.data);
     return response;
   } catch (error: any) {
     return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
   }
 }    
);

const attachmentStateSlice = createSlice({
  name: "attachment",
  initialState,
  reducers: {
    deleteAttachment: (state, action) => {},
    createAttachment: () => {},
    updateAttachment: () => {},
  },
  extraReducers: (builder) => {

    // Fecth Attachment List
    builder.addCase(fecthAttachments .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthAttachments .fulfilled, (state, action) => {
      state.loading = false;
      state.attachments = action.payload.data.attachmentList;
      state.error = "";
    }),
    builder.addCase(fecthAttachments .rejected, (state, action) => {
      state.loading = false;
      state.attachments = state.attachments;
      state.error = action.error.message;
    });

    // Create Attachment Item
    builder.addCase(createAttachmentAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createAttachmentAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.attachments = [...state.attachments, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createAttachmentAsync.rejected, (state, action) => { 
      state.loading = false;
      state.attachments = state.attachments;
      state.error = state.error;
    });

    // Update Attachment Item
    builder.addCase(updateAttachmentByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateAttachmentByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.attachments= state.attachments.map((item:AttachmentType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateAttachmentByIdAsync.rejected, (state, action) => { 
      state.loading = false;
      state.attachments = state.attachments;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
    

    // Delete Attachment Item
    builder.addCase(deleteAttachmentByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteAttachmentByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.attachments = state.attachments.filter((item:AttachmentType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteAttachmentByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.attachments = state.attachments;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createAttachmentAsync = createAsyncThunk(
  "attachment/createAttachment",
  async (params: CreateAttachmentFormData, { rejectWithValue }) => {
    try {
      const response = await api
      .post(`/attachment/create`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }    
);

export const updateAttachmentByIdAsync = createAsyncThunk(
  "attachment/updatedAttachmentById",
  async (params: UpdateAttachmentRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .put(`/attachment/update`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const deleteAttachmentByIdAsync = createAsyncThunk(
  "attachment/deleteAttachmentById",
  async (attachmentId: string, { rejectWithValue }) => {
    try {
      const response = await api
      .delete(`/attachment/delete/${attachmentId}`)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const { createAttachment, deleteAttachment, updateAttachment } = attachmentStateSlice.actions;

export const attachmentStateReducer = attachmentStateSlice.reducer;
