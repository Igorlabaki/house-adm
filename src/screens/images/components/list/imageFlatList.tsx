import { ImageType } from "type";
import { useEffect } from "react";
import { styled } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, FlatList } from "react-native";

import { AppDispatch, RootState } from "@store/index";
import { ListEmpty } from "@components/list/ListEmpty";
import { fecthImages } from "@store/image/imagesSlice";
import { ImageItemFlatList } from "./imageitemFlatList";
import { StyledText, StyledView } from "styledComponents";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<ImageType>);

export function ImageFlatList() {
  const dispatch = useDispatch<AppDispatch>();
  const textList = useSelector((state: RootState) => state.textList);

  useEffect(() => {
    dispatch(fecthImages());
  }, []);

  if (textList.loading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <>
      <StyledFlatList
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
