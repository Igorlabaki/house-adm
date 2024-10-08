import { useEffect } from "react";
import { styled } from "nativewind";
import { ActivityIndicator, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { TextType } from "type";
import { RootState } from "@store/index";
import { fecthTexts } from "@store/text/textSlice";
import { TextItemFlatList } from "./teXtitemFlatList";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<TextType>);

export function TextFlatList() {
  const dispatch = useDispatch();
  const textList = useSelector((state: RootState) => state.textList);

  useEffect(() => {
    dispatch(fecthTexts());
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
