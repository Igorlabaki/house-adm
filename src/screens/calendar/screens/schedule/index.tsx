import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

import { EventDateFlatList } from "./list/dateEventFlatList";
import { fecthDateEvents } from "@store/dateEvent/dateEventSlice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SearchFilterListComponent } from "@components/list/searchFilterList";
import { DateEventModalComponent } from "../calendarSection/components/modal";
import { Venue } from "@store/venue/venueSlice";
import { RootState } from "@store/index";

export function ScheduleScreen() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);
  const queryParams = new URLSearchParams();
  queryParams.append("venueId", venue.id);

  useEffect(() => {
    if(queryParams.has("venueId")){
      dispatch(fecthDateEvents(`${queryParams.toString()}`));
    }
  }, [venue.id]);

  return (
    <StyledView className="bg-gray-dark flex-1 py-3 flex flex-col h-full w-full">
      <StyledView className="flex flex-row justify-between items-center">
        <StyledPressable
          onPress={() => setIsModalOpen(true)}
          className="
                justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
                rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-3 border-[0.6px] border-white border-solid w-[50%]"
        >
          <StyledText className="text-white text-sm font-bold text-center">
            Nova Data
          </StyledText>
        </StyledPressable>
        <StyledPressable
          className="cursor-pointer flex"
          onPress={() => dispatch(fecthDateEvents())}
        >
          <FontAwesome name="refresh" size={16} color="white" />
        </StyledPressable>
      </StyledView>
      <SearchFilterListComponent fectData={fecthDateEvents} />
      <EventDateFlatList />
      <DateEventModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="CREATE"
      />
    </StyledView>
  );
}
