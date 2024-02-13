import { useEffect } from "react";
import ImageItemFlatList from "./budgetitemFlatList";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../../store";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { BugdetType } from "../../../../../../type";
import { ListEmpty } from "../../../../../../components/list/ListEmpty";
import { ItemSeparatorList } from "../../../../../../components/list/itemSeparatorList";
import { fecthOrcamentos } from "../../../../../../store/budget/bugetSlice";
import BudgetItemFlatList from "./budgetitemFlatList";

export function BudgetFlatList() {
  const dispatch = useDispatch();
  const orcamentosList = useSelector((state: RootState) => state.orcamentosList);

  useEffect(() => {
    dispatch(fecthOrcamentos());
  }, []);

  if (orcamentosList.loading) {
    return (
      <View className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white">Loading</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        keyExtractor={(item: BugdetType) => item.id}
        data={orcamentosList?.orcamentos}
        renderItem={({ item }: { item: BugdetType }) => {
          return <BudgetItemFlatList budget={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="orcamento" />}
        className="flex-1"
      />
    </>
  );
}
