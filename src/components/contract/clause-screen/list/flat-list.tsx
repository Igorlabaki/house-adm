import { ClauseType } from "type";
import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import ClauseItemFlatList from "./item-flat-list";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<ClauseType>);

export function ClauseFlatList() {
  const clauseList = useSelector((state: RootState) => state.clauseList);

  if (clauseList.loading) {
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
        keyExtractor={(item: ClauseType) => item.id}
        data={clauseList?.clauses}
        renderItem={({
          item,
          index,
        }: {
          item: ClauseType;
          index: number;
        }) => {
          return (
            <ClauseItemFlatList
              clause={item}
              key={item.id}
              index={index + 1}
            />
          );
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="clausula" />}
        className="flex-1"
      />
    </>
  );
}
