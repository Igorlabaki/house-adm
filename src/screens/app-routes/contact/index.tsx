import React, { useState } from "react";
import { Venue } from "@store/venue/venueSlice";
import { ContactModalComponent } from "./modal";
import { ContactFlatList } from "./list/flat-list";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { fecthContacts } from "@store/contact/contact-slice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";

export default function ContactScreenComponent() {
  const queryParams = new URLSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);
  const editVenuePermission = venue.permissions.includes("EDIT_VENUE");
  return (
    <StyledView className="h-full w-full bg-gray-dark">
      {editVenuePermission && (
        <StyledPressable
          onPress={() => setIsModalOpen(true)}
          className="
                justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
                rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-5 border-[0.6px] border-white border-solid w-[50%]"
        >
          <StyledText className="text-white text-sm font-bold text-center">
            Novo Contato
          </StyledText>
        </StyledPressable>
      )}
      <SearchFilterListByQueryComponent
        entityId={venue.id}
        queryName="name"
        entityName="venueId"
        fectData={fecthContacts}
        queryParams={queryParams}
      />
      <ContactFlatList />
      <ContactModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="CREATE"
      />
    </StyledView>
  );
}
