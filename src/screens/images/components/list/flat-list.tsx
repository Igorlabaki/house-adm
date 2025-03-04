import { ImageType } from "type";
import { useEffect } from "react";
import { styled } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, FlatList } from "react-native";

import { AppDispatch, RootState } from "@store/index";
import { ListEmpty } from "@components/list/ListEmpty";
import { fecthImages } from "@store/image/imagesSlice";
import { ImageItemFlatList } from "./item-flat-list";
import { StyledText, StyledView } from "styledComponents";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { Venue } from "@store/venue/venueSlice";

export const StyledFlatList = styled(FlatList<ImageType>);

export function ImageFlatList() {
  const imageList = useSelector((state: RootState) => state.imageList);

  if (imageList.loading) {
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
        data={imageList?.images}
        renderItem={({ item }: { item: ImageType }) => {
          return <ImageItemFlatList image={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="imagem" />}
        className="flex-1"
      />
    </>
  );
}
