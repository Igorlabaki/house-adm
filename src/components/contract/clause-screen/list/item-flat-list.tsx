import { useState } from "react";

import { ClauseType } from "type";

import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { ClauseModalComponent } from "../modal";
interface ItemFlatListProps {
  index: number;
  clause: ClauseType;
}

export default function ClauseItemFlatList({ clause, index }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <StyledPressable onPress={() => setIsModalOpen(true)} className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative">
      <StyledView className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex-row justify-start items-start  gap-x-1">
          <StyledText className="text-[12px] text-white font-semibold">{clause?.title}</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-start items-start px-3">
          <StyledText className="text-[12px] text-white ">{clause?.text.length > 100 ? `${clause?.text.substring(0,100)}...` : clause?.text}</StyledText>
        </StyledView>
      </StyledView>
      <ClauseModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        clause={clause}
      />
    </StyledPressable>
  );
}
