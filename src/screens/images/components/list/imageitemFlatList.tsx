import { useState } from "react";

import { ImageModal } from "../modal";
import { ImageType } from "../../../../type";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
interface ItemFlatListProps {
  image: ImageType;
}

export  function ImageItemFlatList({ image }: ItemFlatListProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StyledPressable
      onPress={() => setIsModalOpen(true)}
      className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <StyledView className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-custom-gray">Position:</StyledText>
          <StyledText className="text-[12px] text-custom-gray">
            {image?.position}
          </StyledText>
        </StyledView>
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-custom-gray">Area:</StyledText>
          <StyledText className="text-[12px] text-custom-gray">{image?.area}</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-custom-gray">Tag:</StyledText>
          <StyledText className="text-[12px] text-custom-gray">{image?.tag}</StyledText>
        </StyledView>
        <StyledView className="flex-row  items-start gap-x-2 w-[90%] text-center">
          <StyledText className="text-[12px] text-custom-gray">Responsive Mode:</StyledText>
          <StyledText className="text-[12px] text-custom-gray">{image?.responsiveMode}</StyledText>
        </StyledView>
      </StyledView>
      <ImageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        image={image}
      />
    </StyledPressable>
  );
}
