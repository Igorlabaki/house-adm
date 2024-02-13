import { useState } from "react";
import { TextModal } from "../textModal";
import { TextType } from "../../../../../../type";
import { Text, View, Pressable } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

interface ItemFlatListProps {
  text: TextType;
}

export default function TextItemFlatList({ text }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Pressable onPress={() => setIsModalOpen(true)} className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative">
      <View className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <View className="flex-row justify-start items-start gap-x-2">
          <Text className="text-[12px] text-custom-gray">Position:</Text>
          <Text className="text-[12px] text-custom-gray">{text?.position}</Text>
        </View>
        <View className="flex-row justify-start items-start gap-x-2">
          <Text className="text-[12px] text-custom-gray">Area:</Text>
          <Text className="text-[12px] text-custom-gray">{text?.area}</Text>
        </View>
        {text?.titulo && (
          <View className="flex-row justify-start items-start gap-x-2">
            <Text className="text-[12px] text-custom-gray">Titulo:</Text>
            <Text className="text-[12px] text-custom-gray">{text?.titulo}</Text>
          </View>
        )}
        <View className="flex-row  items-start gap-x-2 w-[90%] text-center">
          <Text className="text-[12px] text-custom-gray">Texto:</Text>
          <Text className="text-[12px] text-custom-gray">{text?.text}</Text>
        </View>
      </View>
      <TextModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        text={text}
      />
    </Pressable>
  );
}
