import React, { useState } from "react";
import { PersonList } from "./person-list";
import { PersonModal } from "./person-modal";
import { StyledPressable, StyledText, StyledView } from "styledComponents";

export default function GuestScreen() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <StyledView className="w-full bg-gray-dark h-full pt-10">
      <StyledView className="flex flex-col justify-center items-start gap-y-4 w-full">
        <StyledPressable
          onPress={() => setIsModalOpen(true)}
          className="
            justify-center items-center bg-green-800 active:scale-95
            rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-2 w-[50%] border-[0.6px] border-white border-solid"
        >
          <StyledText className="text-white text-sm font-bold text-center">
            Novo Convidado
          </StyledText>
        </StyledPressable>
        <PersonList personType="GUEST" />
      </StyledView>
      {isModalOpen && (
        <PersonModal
          type="CREATE"
          personType="GUEST"
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </StyledView>
  );
}
