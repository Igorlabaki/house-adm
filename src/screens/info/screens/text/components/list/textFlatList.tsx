import { useEffect } from "react";
import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { TextType } from "../../../../../../type";
import { RootState } from "../../../../../../store";
import { useSelector, useDispatch } from "react-redux";
import { fecthTexts } from "../../../../../../store/text/textSlice";
import { ListEmpty } from "../../../../../../components/list/ListEmpty";
import { ItemSeparatorList } from "../../../../../../components/list/itemSeparatorList";
import TextItemFlatList from "./teXtitemFlatList";

export function TextFlatList() {
  const dispatch = useDispatch();
  const textList = useSelector((state: RootState) => state.textList);

  useEffect(() => {
    dispatch(fecthTexts());
  }, []);

  if (textList.loading) {
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
        keyExtractor={(item: TextType) => item.id}
        data={textList?.texts}
        renderItem={({ item }: { item: TextType }) => {
          return <TextItemFlatList text={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="text" />}
        className="flex-1"
      />
    </>
  );
}
