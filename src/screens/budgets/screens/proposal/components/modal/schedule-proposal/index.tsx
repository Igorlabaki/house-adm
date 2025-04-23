import React, { useState } from "react";
import { ScheduleList } from "./schedule-list";
import { ScheduleModal } from "./schedule-modal";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { shareLink } from "function/share-link";
import { ProposalType } from "type";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { Entypo } from "@expo/vector-icons";

export default function ScheduleProposalScreen() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { proposal } : {proposal: ProposalType} = useSelector((state: RootState) => state.proposalList);
  return (
    <StyledView className="w-full bg-gray-dark h-full pt-10">
      <StyledView className="flex flex-col justify-center items-start gap-y-4 w-full">
        <StyledView className="flex flex-row justify-between items-center gap-x-3 w-full">
        <StyledPressable
          onPress={() => setIsModalOpen(true)}
          className="
            justify-center items-center bg-green-800 active:scale-95
            rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] w-[40%] mb-2 border-[0.6px] border-white border-solid"
        >
          <StyledText className="text-white text-sm font-bold text-center">
          Nova atracao 
          </StyledText>
        </StyledPressable>
        <StyledPressable
          onPress={() =>
            shareLink({
              proposal,
              url: "programacao",
              listType: "programacao",
            })
          }
          className="
            justify-center items-center bg-blue-800 active:scale-95 flex flex-row gap-x-2
            rounded-md px-4  py-2 shadow-lg ml-[0.25px] w-[40%] mb-2 border-[0.6px] border-white border-solid"
        >
          <StyledText className="text-custom-white text-sm font-bold text-center">
            Enviar Link
          </StyledText>
          <Entypo name="share" size={16} color="#faebd7" />
        </StyledPressable>
      </StyledView>
        <ScheduleList />
      </StyledView>
      {isModalOpen && (
        <ScheduleModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="CREATE"
        />
      )}
    </StyledView>
  );
}
