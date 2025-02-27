import { useState } from "react";

import { ImageModal } from "../modal";
import { ImageType } from "../../../../type";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { Image } from "react-native";
interface ItemFlatListProps {
  image: ImageType;
}

export  function ImageItemFlatList({ image }: ItemFlatListProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StyledPressable
      onPress={() => setIsModalOpen(true)}
      className="flex flex-row items-start  justify-center px-1 py-5 bg-[#313338] w-full rounded-lg overflow-hidden shadow-lg relative gap-x-3"
    >
      <StyledView className="overflow-hidden rounded-md">
      <Image
        source={{uri:image?.imageUrl}} // imagem local
        style={{ width: 150, height: 100 }}
        resizeMode="cover"
      />
      </StyledView>
      <StyledView className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto">
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-custom-gray">Tag:</StyledText>
          <StyledText className="text-[12px] text-custom-gray">{image?.tag}</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-custom-gray">Position:</StyledText>
          <StyledText className="text-[12px] text-custom-gray">
            {image?.position}
          </StyledText>
        </StyledView>
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-custom-gray">Descricao:</StyledText>
          <StyledText className="text-[12px] text-custom-gray">{image?.description}</StyledText>
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
