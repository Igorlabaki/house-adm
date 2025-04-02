import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { Venue } from "@store/venue/venueSlice";
import { ProposalType, DateEventType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { DateEventFormComponent } from "../form/form-same-day-date-event";
import { deleteDateEventByIdAsync } from "@store/dateEvent/dateEventSlice";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { OverNigthDateEventFormComponent } from "../form/form-overnigth-date-event";
import { fecthApprovedProposals, fecthProposals, fetchProposalByIdAsync } from "@store/proposal/proposal-slice";
import { ScheduleEventFormComponent } from "../form/form-schedule-date-event";
interface DateEventModalProps {
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  dateEvent?: DateEventType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  proposal?: ProposalType;
}

export function DateEventModalComponent({
  dateEvent,
  proposal,
  isModalOpen,
  setIsModalOpen,
}: DateEventModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.daveEventList.error
  );

  const [modalVisible, setModalVisible] = useState(false);
  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);
  const handleDelete = () => {
    setModalVisible(true);
  };
  const queryProposalsParams = new URLSearchParams();
  const queryApprovedParams = new URLSearchParams();

  const confirmDelete = async () => {
    const response = await dispatch(deleteDateEventByIdAsync(dateEvent?.id));

    if (response.meta.requestStatus === "fulfilled") {
      Toast.show("Data deleteda com sucesso." as string, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
      await dispatch(fetchProposalByIdAsync(proposal?.id));
      if (response.payload.data.type === "EVENT" || response.payload.data.type === "OVERNIGHT") {
        queryProposalsParams.append("venueId", venue.id);
        queryApprovedParams.append("venueId", venue.id);
        queryApprovedParams.append("approved", "true");

        await dispatch(fecthProposals(`${queryProposalsParams.toString()}`))
        await dispatch(fecthApprovedProposals(`${queryApprovedParams.toString()}`))
      }
    }

    if (response.meta.requestStatus == "rejected") {
      Toast.show(response.payload as string, 3000, {
        backgroundColor: "#FF9494",
        textColor: "white",
      });
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      animationType="fade"
    >
      <StyledView className="flex-1 bg-gray-dark pt-10 px-3 relative">
        {dateEvent && (
          <StyledPressable
            onPress={() => handleDelete()}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
       <ScheduleEventFormComponent  dateSelected={dateEvent} setDeleteModalIsOpen={setModalVisible} setIsModalOpen={setIsModalOpen}/>
      </StyledView>
      <DeleteConfirmationModal
        entity="data"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
