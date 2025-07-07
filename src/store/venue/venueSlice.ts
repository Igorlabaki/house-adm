import { api } from "../../services/axios";
import { UpdateVenueSchema } from "@schemas/venue/update-venue-params-schema";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CreateVenueFormSchema } from "@schemas/venue/create-venue-params-schema";
import { AttachmentType, ContractType, OwnerType, OwnerVenueType, UserOrganizationType } from "type";
import { UserOrganization } from "@store/auth/authSlice";

export interface Venue {
  name: string;
  email: string;
  id: string;
  city: string;
  cep: string;
  state: string;
  street: string;
  checkIn: string;
  createdAt: Date;
  maxGuest: number;
  checkOut: string;
  streetNumber: string;
  permissions: string[]
  neighborhood: string;
  seasonalFee?: number;
  organizationId: string;
  complement: string | null;
  hasOvernightStay: boolean;
  pricePerDay: number | null;
  pricePerPerson: number | null;
  pricePerPersonDay: number | null;
  pricePerPersonHour: number | null;
  ownerVenue: OwnerVenueType[] | null;
  attachments: AttachmentType[] | null;
  seasonalFeeDates?: { seasonalStartDay: Date, seasonalEndDay: Date }[];
  contracts?: ContractType[];
  pricingModel: "PER_PERSON" | "PER_DAY" | "PER_PERSON_DAY" | "PER_PERSON_HOUR";
}

export interface VenueListDataResponse {
  success: boolean,
  message: string,
  data: {
    venueList: Venue[]
  },
  count: number,
  type: string
}

export interface AnalysisByMonth {
  month: string;
  count: number;
  total: number;
  guestNumber: number;
}
export interface AnalysisTotal {
  count: number;
  total: number;
  guestNumber: number;
}

export interface CreateVenueDataResponse {
  success: boolean,
  message: string,
  data:
  Venue
  ,
  count: number,
  type: string
}

export interface TrafegoCountResponse {
  success: boolean,
  message: string,
  data: {
    all: number;
    sortedSources: { name: string; count: number }[];
  },
  count: number,
  type: string
}
export interface AnalysisResponse {
  success: boolean,
  message: string,
  data: {
    total: AnalysisTotal;
    approved: AnalysisTotal;
    analysisEventsByMonth: AnalysisByMonth[];
    analysisProposalByMonth: AnalysisByMonth[];
  },
  count: number,
  type: string
}

const initialState: {
  error: string,
  loading: boolean,
  venues: Venue[],
  userOrganizationVenues: Venue[],
  venue: Venue,
  eventTrafficNumbers: {
    all: number;
    sortedSources: { name: string; count: number }[];
  },
  proposalTrafficNumbers: {
    all: number;
    sortedSources: { name: string; count: number }[];
  },
  analysis: {
    total: AnalysisTotal,
    approved: AnalysisTotal;
    analysisEventsByMonth: AnalysisByMonth[];
    analysisProposalByMonth: AnalysisByMonth[];
  }
} = {
  venues: [],
  userOrganizationVenues: [],
  analysis: null,
  loading: false,
  eventTrafficNumbers: null,
  proposalTrafficNumbers: null,
  venue: {
    name: "",
    email: "",
    id: "",
    cep: "",
    city: "",
    state: "",
    street: "",
    maxGuest: 0,
    checkIn: "",
    checkOut: "",
    neighborhood: "",
    ownerVenue: null,
    complement: null,
    streetNumber: "",
    pricePerDay: null,
    seasonalFee: null,
    attachments: null,
    organizationId: "",
    pricePerPerson: null,
    createdAt: new Date(),
    seasonalFeeDates: null,
    hasOvernightStay: false,
    pricePerPersonDay: null,
    pricePerPersonHour: null,
    pricingModel: "PER_PERSON",
    permissions: [""]// ou "PER_DAY", dependendo da lógica
  },
  error: "",
};

const venueListSlice = createSlice({
  name: "venue",
  initialState,
  reducers: {
    deleteVenue: (state, action) => { },
    createVenue: () => { },
    updateVenue: () => { },
  },
  extraReducers: (builder) => {
    // Fecth Venue List
    builder.addCase(fecthVenues.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthVenues.fulfilled, (state, action: PayloadAction<VenueListDataResponse>) => {
      state.loading = false;
      state.venues = action.payload.data.venueList;
      state.error = "";
    }),
      builder.addCase(fecthVenues.rejected, (state, action) => {
        state.loading = false;
        state.venues = state.venues;
        state.error = action.error.message;
      });

    builder.addCase(fecthUserOrganizationVenues.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthUserOrganizationVenues.fulfilled, (state, action: PayloadAction<VenueListDataResponse>) => {
      state.loading = false;
      state.userOrganizationVenues = action.payload.data.venueList;
      state.error = "";
    }),
      builder.addCase(fecthUserOrganizationVenues.rejected, (state, action) => {
        state.loading = false;
        state.userOrganizationVenues = state.venues;
        state.error = action.error.message;
      });

    // Fecth Traffic numbers
    builder.addCase(getProposalTrafficNumberVenueAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProposalTrafficNumberVenueAsync.fulfilled, (state, action: PayloadAction<TrafegoCountResponse>) => {
      state.loading = false;
      state.proposalTrafficNumbers = action.payload.data;
      state.error = "";
    }),
      builder.addCase(getProposalTrafficNumberVenueAsync.rejected, (state, action) => {
        state.loading = false;
        state.proposalTrafficNumbers = state.proposalTrafficNumbers;
        state.error = action.error.message;
      });

    // Fecth Traffic numbers
    builder.addCase(getEventTrafficNumberVenueAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getEventTrafficNumberVenueAsync.fulfilled, (state, action: PayloadAction<TrafegoCountResponse>) => {
      state.loading = false;
      state.eventTrafficNumbers = action.payload.data;
      state.error = "";
    }),
      builder.addCase(getEventTrafficNumberVenueAsync.rejected, (state, action) => {
        state.loading = false;
        state.eventTrafficNumbers = state.eventTrafficNumbers;
        state.error = action.error.message;
      });

    // Fecth Traffic numbers
    builder.addCase(analysisByMonthVenueAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(analysisByMonthVenueAsync.fulfilled, (state, action: PayloadAction<AnalysisResponse>) => {
      state.loading = false;
      state.analysis = action.payload.data;
      state.error = "";
    }),
      builder.addCase(analysisByMonthVenueAsync.rejected, (state, action) => {
        state.loading = false;
        state.venues = [];
        state.error = action.error.message;
      });

    // Create Venue Item
    builder.addCase(createVenueAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createVenueAsync.fulfilled, (state, action: PayloadAction<CreateVenueDataResponse>) => {
      state.loading = false;
      state.venues = [...state.venues, action.payload.data];
      state.error = "";
    }),
      builder.addCase(createVenueAsync.rejected, (state, action) => {
        state.loading = false;
        state.venues = state.venues;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update Venue Item
    builder.addCase(updateVenueAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateVenueAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.venues = state.venues.map((item: Venue) => {
        if (item.id === action.payload.data.id) {
          return item = { ...action.payload.data };
        } else {
          return item;
        }
      });
      state.venue = action.payload.data,
        state.error = "";
    }),
      builder.addCase(updateVenueAsync.rejected, (state, action) => {
        state.loading = false;
        state.venues = state.venues;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Select Venue Item
    builder.addCase(selectVenueAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectVenueAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.venue = action.payload.data
      state.error = "";
    }),
      builder.addCase(selectVenueAsync.rejected, (state, action) => {
        state.loading = false;
        state.venue = state.venue;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Delete Text Item
    builder.addCase(deleteVenueAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteVenueAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.venues = state.venues.filter(
        (item: Venue) => item.id != action.payload.data.id
      );
      state.error = "";
    }),
      builder.addCase(deleteVenueAsync.rejected, (state, action) => {
        state.loading = false;
        state.venues = state.venues;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const fecthVenues: any = createAsyncThunk(
  "venue/list",
  async (param: string, { rejectWithValue }) => {
    try {
      console.log(`/venue/permittedVenueList?${param}`)
      const response = await api
        .get(
          `/venue/permittedVenueList?${param}`
        )
        .then((response) => response.data);
        console.log(response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const fecthUserOrganizationVenues: any = createAsyncThunk(
  "venue/listuserOrganization",
  async (param: string, { rejectWithValue }) => {
    try {
      const response = await api
        .get(
          `/venue/permittedVenueList?${param}`
        )
        .then((response) => response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);


export const createVenueAsync = createAsyncThunk(
  "venue/create",
  async (params: { organizationId: string, userId: string, data: CreateVenueFormSchema }, { rejectWithValue }) => {
    try {
      const newVenue = await api
        .post(`/venue/create`, params)
        .then((resp) => {
          return resp.data;
        })
      return newVenue;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const getProposalTrafficNumberVenueAsync = createAsyncThunk(
  "venue/proposalTrafficNumbers",
  async (url: string, { rejectWithValue }) => {
    try {
      const response = await api
        .get(`/venue/trafficCount?${url}`)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const getEventTrafficNumberVenueAsync = createAsyncThunk(
  "venue/eventTrafficNumbers",
  async (url: string, { rejectWithValue }) => {
    try {
      const response = await api
        .get(`/venue/trafficCount?${url}`)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const analysisByMonthVenueAsync = createAsyncThunk(
  "venue/analysis",
  async (url: string, { rejectWithValue }) => {
    try {
      const response = await api
        .get(`/venue/analysisByMonth?${url}`)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const selectVenueAsync = createAsyncThunk(
  "venue/select",
  async (params: string, { rejectWithValue }) => {
    try {
      const selectedVenue = await api
        .get(`/venue/getById?${params}`)
        .then((resp) => {
          return resp.data;
        })
      return selectedVenue;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao buscar locacao.");
    }
  }
);

export const updateVenueAsync = createAsyncThunk(
  "venue/updated",
  async (data: UpdateVenueSchema, { rejectWithValue }) => {
    try {
      const updatedVenue = await api
        .put(
          `/venue/update`,
          data
        )
        .then((response) => response.data);
      return updatedVenue
    } catch (error) {

      return rejectWithValue(error.data?.message || "Erro ao deletar locacao.");
    }
  }
);

export const deleteVenueAsync = createAsyncThunk(
  "venue/delete",
  async (venueId: string, { rejectWithValue }) => {
    try {
      const deletedVenue = await api
        .delete(`/venue/delete/${venueId}`)
        .then((resp) => {
          return resp.data;
        })

      return deletedVenue;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao deletar locacao.");
    }
  }
);

export const { createVenue, deleteVenue, updateVenue } = venueListSlice.actions;

export const venueListReducer = venueListSlice.reducer;
