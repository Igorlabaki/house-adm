import { useState } from "react";
import Toast from "react-native-simple-toast";
import { DateEvetList } from "./date-event-list";
import { DateEventType, ProposalType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import {
  fecthApprovedProposals,
  fecthProposals,
  fetchProposalByIdAsync,
} from "@store/proposal/proposal-slice";
import { deleteDateEventByIdAsync } from "@store/dateEvent/dateEventSlice";
import { StyledScrollView, StyledText, StyledView } from "styledComponents";
import { fetchNotificationsList } from "@store/notifications/notificationsSlice";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { DateEventFormComponent } from "screens/calendar/screens/calendarSection/components/form/form-same-day-date-event";
import { OverNigthDateEventFormComponent } from "screens/calendar/screens/calendarSection/components/form/form-overnigth-date-event";

export default function AgendamentoScreen() {
  const venue = useSelector((state: RootState) => state?.venueList.venue);
  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );

  const dispatch = useDispatch<AppDispatch>();

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [dateSelected, setdateSelected] = useState<DateEventType | null>(null);
  const queryProposalsParams = new URLSearchParams();
  const queryApprovedParams = new URLSearchParams();
  return (
    <StyledScrollView className="bg-gray-dark h-full">
      <StyledText className="text-white font-bold  w-full text-center">
        Data ja agendadas:
      </StyledText>
      <StyledView className="mt-5 flex flex-col">
        <DateEvetList
          setdateSelected={setdateSelected}
          dateSelected={dateSelected}
        />
      </StyledView>
      <StyledView>
        {venue.pricingModel === "PER_DAY" ? (
          <OverNigthDateEventFormComponent
            dateSelected={dateSelected}
            setDeleteModalIsOpen={setDeleteModalIsOpen}
          />
        ) : (
          <DateEventFormComponent
            dateSelected={dateSelected}
            setDeleteModalIsOpen={setDeleteModalIsOpen}
          />
        )}
      </StyledView>
      {
        <DeleteConfirmationModal
          visible={deleteModalIsOpen}
          entity="data"
          onCancel={() => setDeleteModalIsOpen(false)}
          onConfirm={async () => {
            const response = await dispatch(
              deleteDateEventByIdAsync(dateSelected?.id)
            );
            if (response.meta.requestStatus == "fulfilled") {
              dispatch(fetchProposalByIdAsync(proposal?.id));
              if (response.payload.data.type === "EVENT" || response.payload.data.type === "OVERNIGHT") {
                queryProposalsParams.append("venueId", venue.id);
                queryApprovedParams.append("venueId", venue.id);
                queryApprovedParams.append("approved", "true");

                await dispatch(fecthProposals(`${queryProposalsParams.toString()}`))
                await dispatch(fecthApprovedProposals(`${queryApprovedParams.toString()}`))
              }
              Toast.show(response?.payload?.message as string, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
              setdateSelected(null);
              setDeleteModalIsOpen(false);
            }
          }}
        />
      }
    </StyledScrollView>
  );
}
