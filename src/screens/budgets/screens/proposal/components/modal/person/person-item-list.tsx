import { useState } from "react";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { PersonModal } from "./person-modal";
import { Venue } from "@store/venue/venueSlice";
import { Person } from "@store/person/person-slice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { FontAwesome } from "@expo/vector-icons";

interface PersonItemListProps {
  person: Person;
}

export function PersonItemList({ person }: PersonItemListProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);
  return (
    <StyledPressable
      onPress={() => {
        setIsModalOpen(true);
      }}
      delayLongPress={5000}
      key={person?.id}
      className={`
        flex flex-col items-start justify-start px-5 
        py-5 bg-[#313338] w-full rounded-md overflow-hidden 
        shadow-lg relative
        ${person?.attendance && "border-[2px] border-green-700"}
        `}
    >
      <StyledView className="flex-row justify-between font-semibold items-center overflow-hidden w-full">
        {person.attendance && (
          <StyledView className="absolute top-1 right-1">
            <FontAwesome name="check" size={16} color="#15803d" />
          </StyledView>
        )}
        <StyledText className="text-[13px] text-white font-semibold">
          {person.name}
        </StyledText>
      </StyledView>
      {
        isModalOpen &&
        <PersonModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="UPDATE"
          person={person}
        />
      }
    </StyledPressable>
  );
}
