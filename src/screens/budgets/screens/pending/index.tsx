import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import SearchFilterListComponent from "../../../../components/list/searchFilterList";
import { BudgetFlatList } from "./components/list/budgetFlatList";
import { fecthOrcamentos } from "../../../../store/budget/bugetSlice";
import { BudgetModal } from "./components/modal";

export function PendingScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <View className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
      <Pressable className="bg-gray-dark" onPress={() => setIsModalOpen(true)}>
        <Text className="text-custom-white font-semibold">Novo Orcamento</Text>
      </Pressable>
      <SearchFilterListComponent fectData={fecthOrcamentos} />
      <BudgetFlatList />
      <BudgetModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="CREATE"
      />
    </View>
  );
}
