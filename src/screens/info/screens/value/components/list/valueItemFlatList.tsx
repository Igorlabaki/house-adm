import { useState } from "react";
import { ValueModal } from "../valueModal";
import { ValueType } from "../../../../../../type";
import { Text, View, Pressable } from "react-native";
import { ValueForm } from "../form/valueForm";
import { formatCurrency } from "react-native-format-currency";

interface ItemFlatListProps {
  value: ValueType;
}

export default function ValueItemFlatList({ value }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Pressable onPress={() => setIsModalOpen(true)} className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative">
      <View className=" flex flex-row gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <View className="flex-row justify-start items-start gap-x-2">
          <Text className="text-[12px] text-white font-semibold">{value?.titulo}</Text>
        </View>
        <View className="flex-row justify-start items-start gap-x-2">
          <Text className="text-[12px] text-white font-semibold">{formatCurrency({ amount: value?.valor , code: "BRL" })[0]}</Text>
        </View>
      </View>
      <ValueModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        value={value}
      />
    </Pressable>
  );
}
