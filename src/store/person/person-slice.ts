import { CreatePersonRequestParams } from "@schemas/person/create-person-params-schema";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UpdatePersonRequestParams } from "@schemas/person/update-guest-params-schema";


export interface Person {
  id: string;
  name: string;
  rg: string | null;
  proposalId: string;
  attendance: boolean;
  email: string | null;
  type: "PERSON" | "WORKER"
}

export interface PERSONListDataResponse {
  success: boolean,
  message: string,
  data: {
    personList: Person[]
  },
  count: number,
  type: string
}

export interface CreatePERSONDataResponse {
  data:Person;
  type: string;
  count: number;
  message: string;
  success: boolean;
}

const initialState: {
  error: string,
  loading: boolean,
  people: Person[],
  person: Person,
} = {
  loading: false,
  people: [],
  person: {
    id: "",
    rg: "",
    name: "",
    email: "",
    proposalId: "",
    type: "PERSON",
    attendance: false,
  },
  error: "",
};

export const fecthPERSONByUserEmail: any = createAsyncThunk(
  "person/list",
  async ({ url }: { url: string | undefined }, { rejectWithValue }) => {

    try {
      const response = await api
        .get(
          `/person/list?${url}`
        )
        .then((response) => response.data);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

const personListSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    deletePerson: (state, action) => { },
    createPerson: () => { },
    updatePerson: () => { },
  },
  extraReducers: (builder) => {
    // Fecth PERSON List
    builder.addCase(fecthPERSONByUserEmail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthPERSONByUserEmail.fulfilled, (state, action: PayloadAction<PERSONListDataResponse>) => {
      state.loading = false;
      state.people = action.payload.data.personList;
      state.error = "";
    }),
      builder.addCase(fecthPERSONByUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.people = [];
        state.error = action.error.message;
      });

    // Create PERSON Item
    builder.addCase(createPersonAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPersonAsync.fulfilled, (state, action: PayloadAction<CreatePERSONDataResponse>) => {
      state.loading = false;
      state.people = [...state.people, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createPersonAsync.rejected, (state, action) => {
        state.loading = false;
        state.people = state.people;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update PERSON Item
    builder.addCase(updatePersonAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePersonAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.people = state.people.map((item: Person) => {
        if (item.id === action.payload.data?.id) {
          return (item = { ...action.payload.data });
        } else {
          return item;
        }
      });
      state.person = action.payload.data,
        state.error = "";
    }),
      builder.addCase(updatePersonAsync.rejected, (state, action) => {
        state.loading = false;
        state.people = state.people;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Select PERSON Item
    builder.addCase(selectPersonAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectPersonAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.person = action.payload.data.person
      state.error = "";
    }),
      builder.addCase(selectPersonAsync.rejected, (state, action) => {
        state.loading = false;
        state.person = state.person;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Delete Text Item
    builder.addCase(deletePersonAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePersonAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.people = state.people.filter(
        (item: Person) => item.id != action.payload.data.id
      );
      state.error = "";
    }),
      builder.addCase(deletePersonAsync.rejected, (state, action) => {
        state.loading = false;
        state.people = state.people;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createPersonAsync = createAsyncThunk(
  "person/create",
  async (params: CreatePersonRequestParams, { rejectWithValue }) => {
    try {
      const newPERSON = await api
        .post(`/person/create`, params)
        .then((resp) => {
          return resp.data;
        })
      return newPERSON;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const updatePersonAsync = createAsyncThunk(
  "person/updated",
  async (params: UpdatePersonRequestParams, { rejectWithValue }) => {
    try {
      const newPERSON = await api
        .put(`/person/update`, params)
        .then((resp) => {
          return resp.data;
        })
      return newPERSON;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const selectPersonAsync = createAsyncThunk(
  "person/select",
  async (personId: string, { rejectWithValue }) => {
    try {
      const selectedPERSON = await api
        .get(`/person/getById/${personId}`)
        .then((resp) => {
          return resp.data;
        })
      return selectedPERSON;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao buscar locacao.");
    }
  }
);

export const deletePersonAsync = createAsyncThunk(
  "person/delete",
  async (personId: string, { rejectWithValue }) => {
    try {
      const deletedPERSON = await api
        .delete(`/person/delete/${personId}`)
        .then((resp) => {
          return resp.data;
        })

      return deletedPERSON;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao deletar locacao.");
    }
  }
);

export const { createPerson, deletePerson, updatePerson } = personListSlice.actions;

export const personListReducer = personListSlice.reducer;
