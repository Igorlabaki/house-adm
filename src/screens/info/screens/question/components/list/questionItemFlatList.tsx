import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { QuestionType } from "../../../../../../type";
import { QuenstionModalComponent } from "../questionModal";

interface ItemFlatListProps {
  index: number;
  question: QuestionType;
}

export default function QuestionItemFlatList({ question, index }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Pressable onPress={() => setIsModalOpen(true)} className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative">
      <View className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <View className="flex-row justify-start items-baseline  gap-x-1">
          <Text className="text-[11px] text-white font-semibold">{index})</Text>
          <Text className="text-[12px] text-white font-semibold">{question?.question}?</Text>
        </View>
        <View className="flex-row justify-start items-start px-5">
          <Text className="text-[12px] text-white font-semibold">{question?.response}</Text>
        </View>
      </View>
      <QuenstionModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        question={question}
      />
    </Pressable>
  );
}
