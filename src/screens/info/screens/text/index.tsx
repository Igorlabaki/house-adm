import { RootState } from "@store/index";
import { useEffect, useState } from "react";
import { Venue } from "@store/venue/venueSlice";
import { TextModal } from "./components/textModal";
import { fecthTexts } from "@store/text/textSlice";
import { useDispatch, useSelector } from "react-redux";
import { TextFlatList } from "./components/list/textFlatList";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";

export function TextScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryParams = new URLSearchParams();

  const venue : Venue = useSelector<RootState>(
    (state: RootState) => state.venueList.venue
  );

  return (
    <StyledView className="bg-gray-dark flex-1 pt-5 flex flex-col h-full w-full">
      <StyledPressable
        onPress={() => setIsModalOpen(true)}
        className="
                justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
                rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-3 border-[0.6px] border-white border-solid w-[50%]"
      >
        <StyledText className="text-white text-sm font-bold text-center">
          Novo Texto
        </StyledText>
      </StyledPressable>
      <TextModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="CREATE"
      />
      <SearchFilterListByQueryComponent entityId={venue.id} queryName="area"  entityName="venueId" fectData={fecthTexts} queryParams={queryParams} />
      <TextFlatList />
    </StyledView>
  );
}
