import { useState } from "react";
import { ImageModal } from "./components/modal";
import { View,Text,Pressable } from "react-native";
import { ImageFlatList } from "./components/list/imageFlatList";
import SearchFilterListComponent from "../../components/list/searchFilterList";
import { fecthImages } from "../../store/image/imagesSlice";

export function ImageScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <View className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
      <Pressable className="bg-gray-dark" onPress={() => setIsModalOpen(true)}>
        <Text className="text-custom-white font-semibold">New Image</Text>
      </Pressable>
      <ImageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="CREATE"
      />
      <SearchFilterListComponent fectData={fecthImages} />
      <ImageFlatList />
    </View>
  );
}
