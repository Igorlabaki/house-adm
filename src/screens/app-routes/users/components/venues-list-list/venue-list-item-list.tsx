import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { UserOrganizationType } from "type";
import { StyledPressable, StyledText, StyledView } from "styledComponents";

import { useState } from "react";
import { Organization } from "@store/organization/organizationSlice";
import { Venue } from "@store/venue/venueSlice";
import UserOrganizationFormUpdateModalComponent from "../form/create";
import UserOrganizationFormCreateModalComponent from "../form/create";
import { User } from "@store/auth/authSlice";

interface VenueItemListProps {
  item: Venue;
  userorganization?: UserOrganizationType;
  setFormSection: React.Dispatch<
    React.SetStateAction<"USER" | "VENUE" | "NEW_USER" | "NEW_VENUE">
  >;
}

export function VenueListItemList({
  item,
  setFormSection,
}: VenueItemListProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handlePress = async () => {
    setIsModalOpen(true); // Navega para a seção de permissões
  };

  return (
    <StyledPressable
      onPress={() => handlePress()}
      className=" flex flex-col items-start justify-center 
      px-5 bg-white border-[1px] border-l-[3px] border-l-eventhub-primary border-y-gray-200 border-r-gray-200 shadow-lg rounded-md py-5
      overflow-hidden  relative w-full" 
      key={item?.id}
    >
      <StyledText className="text-custom-white text-md font-bold">
        {item?.name}
      </StyledText>
      {isModalOpen && (
        <UserOrganizationFormCreateModalComponent
        setFormSection={setFormSection}
          venueId={item.id}
          isModalOpen={isModalOpen}
          setMenuModalIsOpen={setIsModalOpen}
        />
      )}
    </StyledPressable>
  );
}

/* 
 */
