import { ScheduleForm } from "./schedule-form";
import { Schedule } from "@store/schedule/schedule-slice";
import { StyledModal, StyledView } from "styledComponents";

interface ScheduleModalProps {
  schedule?: Schedule;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ScheduleModal({
  type,
  schedule,
  isModalOpen,
  setIsModalOpen,
}: ScheduleModalProps) {
  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      animationType="fade"
    >
      <StyledView className="bg-gray-dark h-full px-3">
        <ScheduleForm setIsModalOpen={setIsModalOpen} schedule={schedule} />
      </StyledView>
    </StyledModal>
  );
}
