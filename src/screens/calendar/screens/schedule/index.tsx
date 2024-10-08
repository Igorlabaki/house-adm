import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

import { EventDateFlatList } from "./list/dateEventFlatList";
import { fecthDateEvents } from "@store/dateEvent/dateEventSlice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SearchFilterListComponent } from "@components/list/searchFilterList";
import { DateEventModalComponent } from "../calendarSection/components/modal";

export function ScheduleScreen() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fecthDateEvents());
  }, []);

  return (
    <StyledView className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
      <StyledView className="flex flex-row justify-between items-center">
      <StyledPressable
          className="bg-gray-dark"
          onPress={() => setIsModalOpen(true)}
        >
          <StyledText className="text-custom-white font-semibold">Criar Data</StyledText>
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
