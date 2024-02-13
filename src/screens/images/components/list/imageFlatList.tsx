import { useEffect } from "react";
import { ImageType } from "../../../../type";
import { RootState } from "../../../../store";
import ImageItemFlatList from "./imageitemFlatList";
import { useSelector, useDispatch } from "react-redux";
import { fecthImages } from "../../../../store/image/imagesSlice";
import { ListEmpty } from "../../../../components/list/ListEmpty";
import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { ItemSeparatorList } from "../../../../components/list/itemSeparatorList";

export function ImageFlatList() {
  const dispatch = useDispatch();
  const textList = useSelector((state: RootState) => state.textList);

  useEffect(() => {
    dispatch(fecthImages());
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
        keyExtractor={(item: ImageType) => item.id}
        data={textList?.texts}
        renderItem={({ item }: { item: ImageType }) => {
          return <ImageItemFlatList image={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="image" />}
        className="flex-1"
      />
    </>
  );
}
