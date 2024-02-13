import { useState } from "react";
import { ImageType } from "../../../../type";
import { Text, View, Pressable } from "react-native";
import { ImageModal } from "../modal";

interface ItemFlatListProps {
  image: ImageType;
}

export default function ImageItemFlatList({ image }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Pressable
      onPress={() => setIsModalOpen(true)}
      className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <View className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <View className="flex-row justify-start items-start gap-x-2">
          <Text className="text-[12px] text-custom-gray">Position:</Text>
          <Text className="text-[12px] text-custom-gray">
            {image?.position}
          </Text>
        </View>
        <View className="flex-row justify-start items-start gap-x-2">
          <Text className="text-[12px] text-custom-gray">Area:</Text>
          <Text className="text-[12px] text-custom-gray">{image?.area}</Text>
        </View>
        <View className="flex-row justify-start items-start gap-x-2">
          <Text className="text-[12px] text-custom-gray">Tag:</Text>
          <Text className="text-[12px] text-custom-gray">{image?.tag}</Text>
        </View>
        <View className="flex-row  items-start gap-x-2 w-[90%] text-center">
          <Text className="text-[12px] text-custom-gray">Responsive Mode:</Text>
          <Text className="text-[12px] text-custom-gray">{image?.responsiveMode}</Text>
        </View>
      </View>
      <ImageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        image={image}
      />
    </Pressable>
  );
}
