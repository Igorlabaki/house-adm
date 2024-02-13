import { useEffect } from "react";
import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { TextType, ValueType } from "../../../../../../type";
import { RootState } from "../../../../../../store";
import { useSelector, useDispatch } from "react-redux";
import { fecthTexts } from "../../../../../../store/text/textSlice";
import { ListEmpty } from "../../../../../../components/list/ListEmpty";
import { ItemSeparatorList } from "../../../../../../components/list/itemSeparatorList";
import TextItemFlatList from "./valueItemFlatList";
import { fecthValues } from "../../../../../../store/value/valuesSlice";

export function ValueFlatList() {
  const dispatch = useDispatch();
  const valueList = useSelector((state: RootState) => state.valueList);

  useEffect(() => {
    dispatch(fecthValues());
  }, []);

  if (valueList.loading) {
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
        keyExtractor={(item: ValueType) => item.id}
        data={valueList?.values}
        renderItem={({ item }: { item: ValueType }) => {
          return <TextItemFlatList value={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="value" />}
        className="flex-1"
      />
    </>
  );
}
