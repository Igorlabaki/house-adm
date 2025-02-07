import { userReducer } from "./user/userSlice";
import { sessionReducer } from "./auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { textListReducer } from "./text/textSlice";
import { venueListReducer } from "./venue/venueSlice";
import { ownerListReducer } from "./owner/ownerSlice";
import { imageListReducer } from "./image/imagesSlice";
import { personListReducer } from "./person/person-slice";
import { optionStateReducer } from "./option/optionSlice";
import { expenseListReducer } from "./expense/expenseSlice";
import { serviceListReducer } from "./service/service-slice";
import { dateEventReducer } from "./dateEvent/dateEventSlice";
import { questionListReducer } from "./question/questionSlice";
import { proposalListReducer } from "./proposal/proposal-slice";
import { orcamentoByIdReducer } from "./orcamento/orcamentoSlice";
import { organizationListReducer } from "./organization/organizationSlice";
import { notificationListReducer } from "./notifications/notificationsSlice";
import { orcamentoAprovadoListReducer } from "./budgetAprovado/bugetAprovadoSlice";
import { scheduleListReducer } from "./schedule/schedule-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    session: sessionReducer,
    textList: textListReducer,
    ownerList: ownerListReducer,
    imageList: imageListReducer,
    venueList: venueListReducer,
    personList: personListReducer,
    optionState: optionStateReducer,
    daveEventList: dateEventReducer,
    expenseList: expenseListReducer,
    serviceList: serviceListReducer,
    proposalList: proposalListReducer,
    questionList: questionListReducer,
    scheduleList: scheduleListReducer,
    orcamentosById: orcamentoByIdReducer,
    notificationList: notificationListReducer,
    organizationList: organizationListReducer,
    orcamentosAprovadoList: orcamentoAprovadoListReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
