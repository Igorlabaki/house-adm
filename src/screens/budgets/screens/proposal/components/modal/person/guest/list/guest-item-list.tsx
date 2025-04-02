import { useState } from "react";
import { GuestType } from "type";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { Venue } from "@store/venue/venueSlice";
import { FontAwesome } from "@expo/vector-icons";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { GuestModal } from "../modal/guest-modal";

interface GuestItemListProps {
  guest: GuestType;
}

export function GuestItemList({ guest }: GuestItemListProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
 
  return (
    <StyledPressable
      onPress={() => {
        setIsModalOpen(true);
      }}
      delayLongPress={5000}
      key={guest?.id}
      className={`
        flex flex-col items-start justify-start px-5 
        py-5 bg-[#313338] w-full rounded-md overflow-hidden 
        shadow-lg relative
        ${guest?.attendance && "border-[2px] border-green-700"}
        `}
    >
      <StyledView className="flex-row justify-between font-semibold items-center overflow-hidden w-full">
        {guest.attendance && (
          <StyledView className="absolute top-1 right-1">
            <FontAwesome name="check" size={16} color="#15803d" />
          </StyledView>
        )}
        <StyledText className="text-[13px] text-white font-semibold">
          {guest.name}
        </StyledText>
      </StyledView>
      {
        isModalOpen &&
        <GuestModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="UPDATE"
          guest={guest}
        />
      }
    </StyledPressable>
  );
}
