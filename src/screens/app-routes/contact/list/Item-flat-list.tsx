import { useState } from "react";
import { ContactType } from "type";
import { ContactModalComponent } from "../modal";
import { StyledPressable, StyledText, StyledView } from "styledComponents";

interface ItemFlatListProps {
  index: number;
  contact: ContactType;
}

export default function ContactItemFlatList({ contact, index }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <StyledPressable onPress={() => setIsModalOpen(true)} className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative">
      <StyledView className=" flex flex-row gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex-row justify-start items-start  gap-x-1">
          <StyledText className="text-[12px] text-white font-semibold">{contact?.name}</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-start items-start px-5">
          <StyledText className="text-[12px] text-white font-semibold">{contact.role}</StyledText>
        </StyledView>
      </StyledView>
      <ContactModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        contact={contact}
      />
    </StyledPressable>
  );
}
