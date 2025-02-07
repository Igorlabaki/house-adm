import moment from "moment";
import { useState } from "react";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { Venue } from "@store/venue/venueSlice";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Schedule } from "@store/schedule/schedule-slice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { ScheduleModal } from "./schedule-modal";

interface ScheduleItemListProps {
  schedule: Schedule;
}

export function ScheduleItemList({ schedule }: ScheduleItemListProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);
  return (
    <StyledPressable
      onPress={() => setIsModalOpen(true)}
      className="flex flex-col items-start justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <StyledView className={"flex justify-center items-center w-full"}>
        <StyledText className="text-[14px] text-white font-semibold">
          {schedule?.name}
        </StyledText>
      </StyledView>
      <StyledView className="flex flex-row justify-between items-center w-full mx-auto mt-5">
        <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
          <Ionicons name="people" size={20} color="white" />
          <StyledText className=" text-[13px] text-white font-semibold">
            {schedule?.workerNumber || 0}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
          <Feather name="clock" size={20} color="white" />
          <StyledView className="flex-row">
            <StyledText className=" text-[13px] text-white font-semibold">
              {moment.utc(schedule?.startHour).format("HH:mm")}
            </StyledText>
            <StyledText className=" text-[13px] text-white font-semibold">
              /
            </StyledText>
            <StyledText className=" text-[13px] text-white font-semibold">
              {moment.utc(schedule?.endHour).format("HH:mm")}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
      <StyledText className=" text-[13px] text-white font-semibold w-full flwx justify-center text-center items-center pt-5">
        Descricao: {schedule?.description}
      </StyledText>
      {isModalOpen && (
        <ScheduleModal
          type="UPDATE"
          schedule={schedule}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </StyledPressable>
  );
}
