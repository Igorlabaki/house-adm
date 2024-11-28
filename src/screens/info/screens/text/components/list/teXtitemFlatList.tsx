import { useState } from "react";

import { TextType } from "type";
import { TextModal } from "../textModal";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
interface ItemFlatListProps {
  text: TextType;
}

export function TextItemFlatList({ text }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <StyledPressable onPress={() => setIsModalOpen(true)} className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative">
      <StyledView className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-white font-semibold w-[60px]">Position:</StyledText>
          <StyledText className="text-[12px] text-white ">{text?.position}</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-white font-semibold w-[60px]">Area:</StyledText>
          <StyledText className="text-[12px] text-white ">{text?.area}</StyledText>
        </StyledView>
        {text?.titulo && (
          <StyledView className="flex-row justify-start items-start gap-x-2">
            <StyledText className="text-[12px] text-white font-semibold w-[60px]">Titulo:</StyledText>
            <StyledText className="text-[12px] text-white ">{text?.titulo}</StyledText>
          </StyledView>
        )}
        <StyledView className="flex-row  items-start gap-x-2 w-[80%] text-center">
          <StyledText className="text-[12px] text-white font-semibold w-[60px] text-justify">Texto:</StyledText>
          <StyledText className="text-[12px] text-white">{text?.text.length > 100 ? `${text?.text.substring(0,100)}...` : text?.text}</StyledText>
        </StyledView>
      </StyledView>
      <TextModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        text={text}
      />
    </StyledPressable>
  );
}
