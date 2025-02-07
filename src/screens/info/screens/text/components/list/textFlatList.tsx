import { TextType } from "type";
import { styled } from "nativewind";
import { TextItemFlatList } from "./teXtitemFlatList";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";

export const StyledFlatList = styled(FlatList<TextType>);

export function TextFlatList() {
  const {loading,texts}  = useSelector((state: RootState) => state.textList);
  if (loading) {
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
        removeClippedSubviews={false}
        keyExtractor={(item: TextType) => item.id}
        data={texts}
        renderItem={({ item }: { item: TextType }) => {
          return <TextItemFlatList text={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="texto" />}
        className="flex-1"
      />
    </>
  );
}
