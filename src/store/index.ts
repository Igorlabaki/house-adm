import { configureStore } from "@reduxjs/toolkit";
import { textListReducer } from "./text/textSlice";
import { questionListReducer } from "./question/questionSlice";
import { valueListReducer } from "./value/valuesSlice";
import { imageListReducer } from "./image/imagesSlice";
import { orcamentoListReducer } from "./budget/bugetSlice";
import { dateEventReducer } from "./dateEvent/dateEventSlice";
import { orcamentoAprovadoListReducer } from "./budgetAprovado/bugetAprovadoSlice";
import { despesaListReducer } from "./despesa/despesaSlice";
import { orcamentoByIdReducer } from "./orcamento/orcamentoSlice";
import { notificationListReducer } from "./notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    textList: textListReducer,
    despesaList: despesaListReducer,
    valueList: valueListReducer,
    imageList: imageListReducer,
    daveEventList: dateEventReducer,
    questionList: questionListReducer,
    orcamentosList: orcamentoListReducer,
    orcamentosById: orcamentoByIdReducer,
    notificationList: notificationListReducer,
    orcamentosAprovadoList: orcamentoAprovadoListReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
