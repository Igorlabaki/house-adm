import { ContactType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UpdateContactRequestParams } from "@schemas/contact/update-contact-params-schema";
import { CreateContactRequestParams } from "@schemas/contact/create-contact-params-schema";

const initialState = {
  loading: false,
  contacts: [],
  error: "",
};

export const fecthContacts: any = createAsyncThunk("contact/fetchContacts", 
  async (query:string  ,  { rejectWithValue }) => {
   try {
     const response = await api
     .get(
       `/contact/list?${query}`
     )
     .then((response) =>  response.data);
     return response;
   } catch (error: any) {
     return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
   }
 }    
);

const contactListSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    deleteContact: (state, action) => {},
    createContact: () => {},
    updateContact: () => {},
  },
  extraReducers: (builder) => {

    // Fecth Contact List
    builder.addCase(fecthContacts .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthContacts .fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = action.payload.data.contactList;
      state.error = "";
    }),
    builder.addCase(fecthContacts .rejected, (state, action) => {
      state.loading = false;
      state.contacts = state.contacts;
      state.error = action.error.message;
    });

    // Create Contact Item
    builder.addCase(createContactAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createContactAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.contacts = [...state.contacts, action.payload.data ];
      state.error = "";
    }),
    builder.addCase(createContactAsync.rejected, (state, action) => { 
      state.loading = false;
      state.contacts = state.contacts;
      state.error = state.error;
    });

    // Update Contact Item
    builder.addCase(updateContactByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateContactByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.contacts = state.contacts.map((item:ContactType) => {
        if(item.id === action.payload.data.id){
          return item = {...action.payload.data}
        }else{
          return item
        }
      });
      state.error = "";
    }),
    builder.addCase(updateContactByIdAsync.rejected, (state, action) => { 
      state.loading = false;
      state.contacts = state.contacts;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
    

    // Delete Contact Item
    builder.addCase(deleteContactByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteContactByIdAsync.fulfilled, (state,action: any) => {
      state.loading = false;
      state.contacts = state.contacts.filter((item:ContactType) => item.id != action.payload.data.id);
      state.error = "";
    }),
    builder.addCase(deleteContactByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.contacts = state.contacts;
      state.error = "Oops! Something went wrong. Please try again later.";
    });
  },
});

export const createContactAsync = createAsyncThunk(
  "contact/createContact",
  async (params: CreateContactRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .post(`/contact/create`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }    
);

export const updateContactByIdAsync = createAsyncThunk(
  "contact/updatedContactById",
  async (params: UpdateContactRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
      .put(`/contact/update`, params)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const deleteContactByIdAsync = createAsyncThunk(
  "contact/deleteContactById",
  async (contactId: string, { rejectWithValue }) => {
    try {
      const response = await api
      .delete(`/contact/delete/${contactId}`)
      .then((resp) => {
        return resp.data;
      })
    return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }   
);

export const { createContact, deleteContact, updateContact } = contactListSlice.actions;

export const contactListReducer = contactListSlice.reducer;
