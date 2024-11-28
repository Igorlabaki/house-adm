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
    <StyledView className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
      <StyledPressable className="bg-gray-dark" onPress={() => setIsModalOpen(true)}>
        <StyledText className="text-custom-white font-semibold pb-5">Nova imagem</StyledText>
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
