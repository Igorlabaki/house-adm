import { api } from "../../services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ImageType } from "../../type";

const initialState = {
  loading: false,
  images: [],
  error: "",
};

export const fecthImages: any = createAsyncThunk(
  "image/fetchImages",
  async (query: string | undefined) => {
    return api
      .get(
        `https://art56-server-v2.vercel.app/image/list/${query ? query : ""}`
      )
      .then((response) => response.data.map((value: ImageType) => value));
  }
);

const imageListSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    deleteImage: (state, action) => {},
    createImage: () => {},
    updateImage: () => {},
  },
  extraReducers: (builder) => {
    // Fecth Image List
    builder.addCase(fecthImages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fecthImages.fulfilled, (state, action) => {
      state.loading = false;
      state.images = action.payload;
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
    builder.addCase(createImageAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.images = [...state.images, action.payload];
      state.error = "";
    }),
      builder.addCase(createImageAsync.rejected, (state, action) => {
        state.loading = false;
        state.images = state.images;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Update Image Item
    builder.addCase(updateImageByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateImageByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.images = state.images.map((item: ImageType) => {
        if (item.id === action.payload.id) {
          return (item = { ...action.payload });
        } else {
          return item;
        }
      });
      state.error = "";
    }),
      builder.addCase(updateImageByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.images = state.images;
        state.error = "Oops! Something went wrong. Please try again later.";
      });

    // Delete Image Item
    builder.addCase(deleteImageByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteImageByIdAsync.fulfilled, (state, action: any) => {
      state.loading = false;
      state.images = state.images.filter(
        (item: ImageType) => item.id != action.payload
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
  async (createImageParams: ImageType) => {
    const newImage = await api
      .post(`https://art56-server-v2.vercel.app/image/create`, createImageParams)
      .then((resp) => {
        return resp.data;
      });

    return newImage;
  }
);

export const updateImageByIdAsync = createAsyncThunk(
  "image/updatedImageById",
  async (updateImageParams: { imageId: string; data: ImageType }) => {
    const updatedImage = await api
      .put(
        `https://art56-server-v2.vercel.app/image/update/${updateImageParams.imageId}`,
        updateImageParams.data
      )
      .then((resp: { data: ImageType }) => resp.data);
    return updatedImage;
  }
);

export const deleteImageByIdAsync = createAsyncThunk(
  "image/deleteImageById",
  async (imageId: string) => {
    const deletedImage = await api
      .delete(`https://art56-server-v2.vercel.app/image/delete/${imageId}`)
      .then((resp: { data: ImageType }) => resp.data);
    return deletedImage.id;
  }
);

export const { createImage, deleteImage, updateImage } = imageListSlice.actions;

export const imageListReducer = imageListSlice.reducer;
