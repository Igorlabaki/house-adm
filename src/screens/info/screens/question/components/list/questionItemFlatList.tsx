import { useState } from "react";

import { QuestionType } from "type";
import { QuenstionModalComponent } from "../questionModal";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
interface ItemFlatListProps {
  index: number;
  question: QuestionType;
}

export default function QuestionItemFlatList({ question, index }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <StyledPressable onPress={() => setIsModalOpen(true)} className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative">
      <StyledView className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex-row justify-start items-start  gap-x-1">
          <StyledText className="text-[11px] text-white font-semibold">{index})</StyledText>
          <StyledText className="text-[12px] text-white font-semibold">{question?.question}?</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-start items-start px-5">
          <StyledText className="text-[12px] text-white ">{question?.response.length > 100 ? `${question?.response.substring(0,100)}...` : question?.response}</StyledText>
        </StyledView>
      </StyledView>
      <QuenstionModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        question={question}
      />
    </StyledPressable>
  );
}
