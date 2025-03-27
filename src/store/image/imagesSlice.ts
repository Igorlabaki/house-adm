import { ImageType } from "../../type";
import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UpdateImageRequestParams } from "@schemas/image/update-image-in-db-params-schema";

const initialState = {
  loading: false,
  images: [],
  error: "",
};


export const fecthImages: any = createAsyncThunk("image/fetchImages",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api
        .get(
          `/image/list?${query}`
        )
        .then((response) => response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Erro ao buscar lista de imagens");
    }
  }
);

const imageListSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    deleteImage: (state, action) => { },
    createImage: () => { },
    updateImage: () => { },
  },
  extraReducers: (builder) => {
    // Fecth Image List
    builder.addCase(fecthImages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthImages.fulfilled, (state, action) => {
      state.loading = false;
      state.images = action.payload.data.imageList;
      state.error = "";
    }),
      builder.addCase(fecthImages.rejected, (state, action) => {
        state.loading = false;
        state.images = [];
        state.error = action.error.message;
      });

    // Create Image Item
    builder.addCase(createImageAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createImageAsync?.fulfilled, (state, action: any) => {
      state.loading = false;
      state.images = [...state.images, action?.payload?.data];
      state.error = "";
    }),
      builder.addCase(createImageAsync.rejected, (state, action) => {
        state.loading = false;
        state.images = state?.images;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update Image Item
    builder.addCase(updateImageByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateImageByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.images = state.images.map((item: ImageType) => {
        if (item.id === action?.payload?.data?.id) {
          return (item = { ...action?.payload?.data });
        } else {
          return item;
        }
      });
      state.error = "";
    }),
      builder.addCase(updateImageByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.images = state?.images;
        state.error = "Oops! Something went wrong. Please try again later.";
      });


    // Update Image Item
    builder.addCase(updateImageInfoByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateImageInfoByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.images = state.images.map((item: ImageType) => {
        if (item.id === action?.payload?.data?.id) {
          return (item = { ...action?.payload?.data });
        } else {
          return item;
        }
      });
      state.error = "";
    }),
      builder.addCase(updateImageInfoByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.images = state?.images;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Delete Image Item
    builder.addCase(deleteImageByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteImageByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.images = state.images.filter(
        (item: ImageType) => item.id != action.payload?.data?.id
      );
      state.error = "";
    }),
      builder.addCase(deleteImageByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.images = state.images;
        state.error = "Oops! Something went wrong. Please try again later.";
      });
  },
});

export const createImageAsync = createAsyncThunk(
  "image/createImage",
  async (createImageParams: FormData, { rejectWithValue }) => {

    try {
      const response = await api.post(`/image/upload`, createImageParams, {
        timeout: 0,
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

export const updateImageByIdAsync = createAsyncThunk(
  "image/updatedImageById",
  async (params: FormData, { rejectWithValue }) => {
    try {
      const response = await api
        .put(`/image/update`, params, {
          headers: {
            "Content-Type": "multipart/form-data", // Importante para envio de arquivos
          },
        })
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const updateImageInfoByIdAsync = createAsyncThunk(
  "image/updatedImageInfoById",
  async (params: UpdateImageRequestParams, { rejectWithValue }) => {
    try {
      const response = await api
        .put(`/image/update`, params)
        .then((resp) => {
          return resp.data;
        })
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }
  }
);

export const deleteImageByIdAsync = createAsyncThunk(
  "image/deleteImageById",
  async (imageId: string, { rejectWithValue }) => {
    try {
      const response = await api
        .delete(`/image/delete/${imageId}`)
        .then((resp: { data: any }) => resp.data);

      return response;
    } catch (error) {

      return rejectWithValue(error.data?.message || "Erro ao autenticar usuario");
    }

  }
);

export const { createImage, deleteImage, updateImage } = imageListSlice.actions;

export const imageListReducer = imageListSlice.reducer;
