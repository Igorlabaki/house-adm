
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalIsOpen: false
};

const optionStateSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    openOptionModal: (state) => {
      state.modalIsOpen = true
    },
    closeOptionModal: (state) => {
      state.modalIsOpen = false
    },
  },
});

export const { openOptionModal, closeOptionModal } = optionStateSlice.actions;

export const optionStateReducer = optionStateSlice.reducer;
