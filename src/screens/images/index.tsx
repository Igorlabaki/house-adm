import { useEffect, useState } from "react";
import { ImageModal } from "./components/modal";
import { ImageFlatList } from "./components/list/imageFlatList";

import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SearchFilterListComponent } from "@components/list/searchFilterList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/index";
import { fecthImages } from "@store/image/imagesSlice";

export function ImageScreen() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fecthImages());
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <SearchFilterListComponent fectData={fecthImages} />
      <ImageFlatList />
    </StyledView>
  );
}
