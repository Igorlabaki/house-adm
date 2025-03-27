import { ProposalType } from "type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateProposalRequestParamsSchema } from "@schemas/proposal/create-proposal-params-schema";
import { CreateProposaPerDaylRequestchema } from "@schemas/proposal/create-proposal-peer-day-form-schema";
import { UpdateProposalPerDayRequestParamsSchema } from "@schemas/proposal/update-proposal-per-day-params-schema";
import { UpdateProposalPerPersonRequestParamsSchema } from "@schemas/proposal/update-proposal-per-person-params-schema";
import { UpdatePersonalInfoProposalSchema } from "@schemas/proposal/update-personal-info-proposal-params-schema";

const initialState: {
  error: string;
  loading: boolean;
  isModalOpen: boolean;
  proposal: ProposalType;
  proposals: ProposalType[];
  approvedproposals: ProposalType[];
} = {
  loading: false,
  proposals: [],
  approvedproposals: [],
  proposal: {
    id: "",
    completeClientName: "",
    completeCompanyName: "",
    venue: {
      email: "",
      seasonalFeeDates: [],
      permissions: [],
      pricePerPersonDay: 0,
      pricePerPersonHour: 0,
      contracts: [],
      seasonalFee: null,
      name: "",
      id: "",
      organizationId: "",
      cep: "",
      city: "",
      state: "",
      street: "",
      streetNumber: "",
      neighborhood: "",
      hasOvernightStay: false,
      complement: null,
      pricePerDay: null,
      pricePerPerson: null,
      pricingModel: "PER_PERSON",
      checkIn: "",
      createdAt: new Date(),
      ownerVenue: [],
      maxGuest: 0,
      checkOut: "",
    },
    endDate: new Date(),
    email: "",
    cep: "",
    cpf: "",
    cnpj: "",
    street: "",
    streetnumber: "",
    completeName: "",
    paid: false,
    startDate: new Date(),
    venueId: "",
    updatedAt: new Date(),
    createdAt: new Date(),
    whatsapp: "",
    contact: false,
    approved: false,
    basePrice: 0,
    amountPaid: 0,
    description: "",
    totalAmount: 0,
    knowsVenue: false,
    guestNumber: 0,
    extraHoursQty: 0,
    extraHourPrice: 0,
    termsAccepted: false,
    payments: [],
    histories: [],
    personList: [],
    dateEvents: [],
    scheduleList: [],
    proposalServices: [],
    type: "EVENT",
    trafficSource: "OTHER",
  },
  error: "",
  isModalOpen: false
};
export const fecthProposals: any = createAsyncThunk("proposal/fetchProposals",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api
        .get(
          `/proposal/list?${query}`
        )
        .then((response) => response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }
);

export const fecthApprovedProposals: any = createAsyncThunk("proposal/fetchApprovedProposals",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api
        .get(
          `/proposal/list?${query}`
        )
        .then((response) => response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de locacoes");
    }
  }
);

const proposalListSlice = createSlice({
  name: "proposal",
  initialState,
  reducers: {
    deleteProposal: (state, action) => { },
    createProposal: () => { },
    updateProposal: () => { },
    openModal: (state, action) => {
      state.isModalOpen = true; // Abre o modal
    },
    closeModal: (state) => {
      state.isModalOpen = false; // Fecha o modal
    }
  },
  extraReducers: (builder) => {

    // Fecth Proposal List
    builder.addCase(fecthApprovedProposals.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthApprovedProposals.fulfilled, (state, action) => {
      state.loading = false;
      state.approvedproposals = action.payload.data.proposalList;
      state.error = "";
    }),
      builder.addCase(fecthApprovedProposals.rejected, (state, action) => {
        state.loading = false;
        state.approvedproposals = state.approvedproposals;
        state.error = action.error.message;
      });

    // Fecth Approved Proposal List
    builder.addCase(fecthProposals.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthProposals.fulfilled, (state, action) => {
      state.loading = false;
      state.proposals = action.payload.data.proposalList;
      state.error = "";
    }),
      builder.addCase(fecthProposals.rejected, (state, action) => {
        state.loading = false;
        state.proposals = state.proposals;
        state.error = action.error.message;
      });

    // Fecth Proposal by Id
    builder.addCase(fetchProposalByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProposalByIdAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.proposal = action.payload.data;
      state.error = "";
    }),
      builder.addCase(fetchProposalByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Create Proposal Item
    builder.addCase(createProposalPerPersonAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProposalPerPersonAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.proposals = [...state.proposals, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createProposalPerPersonAsync.rejected, (state, action) => {
        state.loading = false;
        state.proposals = state.proposals;
        state.error = action.error.message;
      });

    // Create Proposal Item
    builder.addCase(createProposalPerDayAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProposalPerDayAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.proposals = [...state.proposals, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createProposalPerDayAsync.rejected, (state, action) => {
        state.loading = false;
        state.proposals = state.proposals;
        state.error = action.error.message;
      });

    // Update Proposal Per Person Item
    builder.addCase(updateProposalPerPersonAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProposalPerPersonAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.proposals = state.proposals.map((item: ProposalType) => {
        if (item.id === action.payload.data.id) {
          return item = { ...action.payload.data }
        } else {
          return item
        }
      });
      state.error = "";
    }),
      builder.addCase(updateProposalPerPersonAsync.rejected, (state, action) => {
        state.loading = false;
        state.proposals = state.proposals;
        state.error = action.error.message;
      });

    // Update Proposal Per Day
    builder.addCase(updateProposalPerDayAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProposalPerDayAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.proposals = state.proposals.map((item: ProposalType) => {
        if (item.id === action.payload.data.id) {
          return item = { ...action.payload.data }
        } else {
          return item
        }
      });
      state.error = "";
    }),
      builder.addCase(updateProposalPerDayAsync.rejected, (state, action) => {
        state.loading = false;
        state.proposals = state.proposals;
        state.error = action.error.message;
      });


    // Delete Proposal Item
    builder.addCase(deleteProposalByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteProposalByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.proposals = state.proposals.filter((item: ProposalType) => item.id != action.payload.data.id);
      state.error = "";
    }),
      builder.addCase(deleteProposalByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.proposals = state.proposals;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createProposalPerPersonAsync = createAsyncThunk(
  "proposal/createProposalPerPeson",
  async (params: CreateProposalRequestParamsSchema, { rejectWithValue }) => {
    try {
      const response = await api
        .post(`/proposal/createPerPerson`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const createProposalPerDayAsync = createAsyncThunk(
  "proposal/createProposalPerDay",
  async (params: CreateProposaPerDaylRequestchema, { rejectWithValue }) => {
    try {
      const response = await api
        .post(`/proposal/createPerDay`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const updateProposalPerPersonAsync = createAsyncThunk(
  "proposal/updatedProposalPerPerson",
  async (params: UpdateProposalPerPersonRequestParamsSchema, { rejectWithValue }) => {
    try {
      const response = await api
        .put(`/proposal/updatePerPerson`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const updateProposalPersonalInfoAsync = createAsyncThunk(
  "proposal/updatedProposalPersonalInfo",
  async (params: UpdatePersonalInfoProposalSchema, { rejectWithValue }) => {
    try {
      const response = await api
        .put(`/proposal/updatePersonalInfo`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const updateProposalPerDayAsync = createAsyncThunk(
  "proposal/updatedProposalPerDay",
  async (params: UpdateProposalPerDayRequestParamsSchema, { rejectWithValue }) => {
    try {
      const response = await api
        .put(`/proposal/updatePerDay`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const fetchProposalByIdAsync = createAsyncThunk(
  "proposal/fetchProposalById",
  async (params: string, { rejectWithValue }) => {
    try {
      const response = await api
        .get(`/proposal/byId/${params}`)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const deleteProposalByIdAsync = createAsyncThunk(
  "proposal/deleteProposalById",
  async (proposalId: string, { rejectWithValue }) => {
    try {
      const response = await api
        .delete(`/proposal/delete/${proposalId}`)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const { createProposal, deleteProposal, updateProposal, openModal, closeModal } = proposalListSlice.actions;

export const proposalListReducer = proposalListSlice.reducer;
