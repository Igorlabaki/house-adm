import { useState } from "react";

import { AttachmentType } from "type";

import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { AttachmentModalComponent } from "../modal";
interface ItemFlatListProps {
  index: number;
  attachment: AttachmentType;
}

export default function AttachmentItemFlatList({ attachment, index }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <StyledPressable onPress={() => setIsModalOpen(true)} className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative">
      <StyledView className=" flex flex-row gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex-row justify-start items-start  gap-x-1">
          <StyledText className="text-[12px] text-white font-semibold">{attachment?.title}</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-start items-start px-3">
          <StyledText className="text-[13px] text-white ">{attachment?.venue?.name}</StyledText>
        </StyledView>
      </StyledView>
      <AttachmentModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        attachment={attachment}
      />
    </StyledPressable>
  );
}
