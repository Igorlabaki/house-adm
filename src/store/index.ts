import { userReducer } from "./user/userSlice";
import { authReducer } from "./auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { textListReducer } from "./text/textSlice";
import { venueListReducer } from "./venue/venueSlice";
import { ownerListReducer } from "./owner/ownerSlice";
import { imageListReducer } from "./image/imagesSlice";
import { guestListReducer } from "./guest/guest-slice";
import { optionStateReducer } from "./option/optionSlice";
import { clauseListReducer } from "./clause/clause-slice";
import { expenseListReducer } from "./expense/expenseSlice";
import { serviceListReducer } from "./service/service-slice";
import { userListReducer } from "./userList/user-list-slice";
import { contactListReducer } from "./contact/contact-slice";
import { dateEventReducer } from "./dateEvent/dateEventSlice";
import { questionListReducer } from "./question/questionSlice";
import { documentListReducer } from "./document/document-slice";
import { scheduleListReducer } from "./schedule/schedule-slice";
import { proposalListReducer } from "./proposal/proposal-slice";
import { contractListReducer } from "./contract/contract-slice";
import { organizationListReducer } from "./organization/organizationSlice";
import { notificationListReducer } from "./notifications/notificationsSlice";
import { orcamentoAprovadoListReducer } from "./budgetAprovado/bugetAprovadoSlice";
import { userorganizationListReducer } from "./userOrganization/user-organization--slice";
import { userPermissionStateReducer } from "./user-permission/user-permission-slice";
import { surchargefeesListReducer } from "./surcharge-fee/surcharge-fee";
import { discountfeesListReducer } from "./discount-fee/discount-fee";
import { workerListReducer } from "./worker/worker-slice";
import { attachmentStateReducer } from "./attachment/attachment-slice";
import { goalStateReducer } from "./goal/goal-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    session: authReducer,
    userList: userListReducer,
    textList: textListReducer,
    ownerList: ownerListReducer,
    imageList: imageListReducer,
    goalState: goalStateReducer,
    venueList: venueListReducer,
    guestState: guestListReducer,
    clauseList: clauseListReducer,
    workerState: workerListReducer,
    optionState: optionStateReducer,
    daveEventList: dateEventReducer,
    expenseList: expenseListReducer,
    contactList: contactListReducer,
    serviceList: serviceListReducer,
    documentList: documentListReducer,
    contractList: contractListReducer,
    proposalList: proposalListReducer,
    questionList: questionListReducer,
    scheduleList: scheduleListReducer,
    attachmentState: attachmentStateReducer,
    notificationList: notificationListReducer,
    organizationList: organizationListReducer,
    discountfeesState: discountfeesListReducer,
    surchargefeesState: surchargefeesListReducer,
    userPermittionState: userPermissionStateReducer,
    userOrganizationList: userorganizationListReducer,
    orcamentosAprovadoList: orcamentoAprovadoListReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
