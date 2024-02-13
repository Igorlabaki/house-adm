import { configureStore } from "@reduxjs/toolkit";
import { textListReducer } from "./text/textSlice";
import { questionListReducer } from "./question/questionSlice";
import { valueListReducer } from "./value/valuesSlice";
import { imageListReducer } from "./image/imagesSlice";
import { orcamentoListReducer } from "./budget/bugetSlice";
import { dateEventReducer } from "./dateEvent/dateEventSlice";

export const store = configureStore({
  reducer: {
    textList: textListReducer,
    valueList: valueListReducer,
    imageList: imageListReducer,
    daveEventList: dateEventReducer,
    questionList: questionListReducer,
    orcamentosList: orcamentoListReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
