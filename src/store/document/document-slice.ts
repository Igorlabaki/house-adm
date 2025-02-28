import { DocumentType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UpdateDocumentRequestParams } from "@schemas/document/update-document-params-schema";
import { CreateDocumentRequestParams } from "@schemas/document/create-document-params-schema";

const initialState : {
  loading: boolean,
  documents: DocumentType[],
  error: string
} = {
  loading: false,
  documents: [],
  error: "",
};

export const fecthDocuments: any = createAsyncThunk("document/fetchDocuments", 
  async (query:string  ,  { rejectWithValue }) => {
   try {
     const response = await api
     .get(
       `/document/list?${query}`
     )
     .then((response) =>  response.data);
     return response;
   } catch (error: any) {
     return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
   }
 }    
);

const documentListSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    deleteDocument: (state, action) => {},
    createDocument: () => {},
    updateDocument: () => {},
  },
  extraReducers: (builder) => {

    // Fecth Document List
    builder.addCase(fecthDocuments .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthDocuments .fulfilled, (state, action) => {
      state.loading = false;
      state.documents = action.payload.data.documentList;
      state.error = "";
    }),
    builder.addCase(fecthDocuments .rejected, (state, action) => {
      state.loading = false;
      state.documents = state.documents;
      state.error = action.error.message;
    });

    // Create Document Item
    builder.addCase(createDocumentAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createDocumentAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.documents = [...state.documents, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createDocumentAsync.rejected, (state, action) => { 
      state.loading = false;
      state.documents = state.documents;
      state.error = state.error;
    });

    // Update Document Item
    builder.addCase(updateDocumentByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateDocumentByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.documents = state.documents.map((item:DocumentType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateDocumentByIdAsync.rejected, (state, action) => { 
      state.loading = false;
      state.documents = state.documents;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
    

    // Delete Document Item
    builder.addCase(deleteDocumentByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteDocumentByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.documents = state.documents.filter((item:DocumentType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteDocumentByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.documents = state.documents;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createDocumentAsync = createAsyncThunk(
  "document/createDocument",
  async (createDocumentParams: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/document/create`, createDocumentParams, {
        headers: {
          "Content-Type": "multipart/form-data", // Importante para envio de arquivos
        },
      })
        .then((response) => response?.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de imagens");
    }
  }
);

export const updateDocumentByIdAsync = createAsyncThunk(
  "document/updatedDocumentById",
  async (params: UpdateDocumentRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .put(`/document/update`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const deleteDocumentByIdAsync = createAsyncThunk(
  "document/deleteDocumentById",
  async (documentId: string, { rejectWithValue }) => {
    try {
      const response = await api
      .delete(`/document/delete/${documentId}`)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const { createDocument, deleteDocument, updateDocument } = documentListSlice.actions;

export const documentListReducer = documentListSlice.reducer;
