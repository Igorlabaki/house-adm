import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { BugdetType } from "../../../../../../type";
import { format } from "date-fns";
import { formatCurrency, getSupportedCurrencies } from "react-native-format-currency";
import BudgetInfoModal from "../modal/info";


interface ItemFlatListProps {
  budget: BugdetType;
}

export default function BudgetItemFlatList({ budget }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <Pressable
      onPress={() => setIsModalOpen(true)}
      className="flex flex-col items-start  justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <View className="flex-row justify-between font-semibold items-center overflow-hidden w-full ">
        <View className="flex-row justify-start items-start ">
          <Text className="text-[13px] text-white  font-semibold ">{budget?.nome}</Text>
        </View>
        <View className="flex-row justify-start items-start ">
          <Text className="text-[13px] text-white  font-semibold">{format(budget?.dataInicio, "dd/MM/yyyy")}</Text>
        </View>
        <View className="flex-row  items-start  text-center">
          <Text className="text-[13px] text-white  font-semibold">{formatCurrency({ amount: budget?.total, code: "BRL" })[0]}</Text>
        </View>
      </View>
      <BudgetInfoModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        budget={budget}
      />
    </Pressable>
  );
}
