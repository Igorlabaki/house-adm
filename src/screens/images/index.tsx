import { useState } from "react";
import { ImageModal } from "./components/modal";
import { fecthImages } from "@store/image/imagesSlice";
import { ImageFlatList } from "./components/list/flat-list";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SearchFilterListComponent } from "@components/list/searchFilterList";
import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { Venue } from "@store/venue/venueSlice";

export function ImageScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);

  const queryParams = new URLSearchParams();
  queryParams.append("venueId", venue.id);

  return (
    <StyledView className="bg-gray-dark flex-1 pt-5 flex flex-col h-full w-full">
      <StyledPressable
        onPress={() => setIsModalOpen(true)}
        className="
                justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
                rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-3 border-[0.6px] border-white border-solid w-[50%]"
      >
        <StyledText className="text-white text-sm font-bold text-center">
          Nova Imagem
        </StyledText>
      </StyledPressable>
      <ImageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="CREATE"
      />
      <SearchFilterListByQueryComponent
        entityId={venue.id}
        queryName="description"
        entityName="venueId"
        fectData={fecthImages}
        queryParams={queryParams}
      />
      <ImageFlatList />
    </StyledView>
  );
}
