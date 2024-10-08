import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { DateEventType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { DateEventFormComponent } from "../form/dateEventForm";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";
import { deleteDateEventByIdAsync } from "@store/dateEvent/dateEventSlice";
interface DateEventModalProps {
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  dateEvent?: DateEventType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DateEventModalComponent({
  dateEvent,
  isModalOpen,
  setIsModalOpen,
}: DateEventModalProps) {

  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.daveEventList.error
  );
  
  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      animationType="fade"
    >
      <StyledView className="flex-1 bg-gray-dark pt-10 relative">
        <StyledPressable
          className="absolute top-4 left-5"
          onPress={() => setIsModalOpen(false)}
        >
          <MaterialCommunityIcons
            name="arrow-left-thin"
            size={24}
            color="white"
          />
        </StyledPressable>
        {dateEvent && (
          <StyledPressable
            onPress={async () => {
              const deleteItem = await dispatch(
                deleteDateEventByIdAsync(dateEvent.id)
              );

              if (deleteItem.meta.requestStatus === "fulfilled") {
                Toast.show("Data deleteda com sucesso." as string, 3000, {
                  backgroundColor: "rgb(75,181,67)",
                  textColor: "white",
                });
              }

              if (deleteItem.meta.requestStatus == "rejected") {
                Toast.show(error as string, 3000, {
                  backgroundColor: "#FF9494",
                  textColor: "white",
                });
              }
            }}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        {dateEvent ? (
          <DateEventFormComponent dateEvent={dateEvent} />
        ) : (
          <DateEventFormComponent />
        )}
      </StyledView>
    </StyledModal>
  );
}
