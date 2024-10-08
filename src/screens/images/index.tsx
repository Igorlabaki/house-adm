import { useState } from "react";
import { ImageModal } from "./components/modal";
import { ImageFlatList } from "./components/list/imageFlatList";

import { StyledPressable, StyledText, StyledView } from "styledComponents";

export function ImageScreen() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <StyledView className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
      <StyledPressable className="bg-gray-dark" onPress={() => setIsModalOpen(true)}>
        <StyledText className="text-custom-white font-semibold">New Image</StyledText>
      </StyledPressable>
      <ImageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="CREATE"
      />
      {/* <SearchFilterListComponent fectData={fecthImages} /> */}
      <ImageFlatList />
    </StyledView>
  );
}
