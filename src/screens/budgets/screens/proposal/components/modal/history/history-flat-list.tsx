import { History } from "type";
import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ListEmpty } from "@components/list/ListEmpty";
import { ExpenseType } from "@store/expense/expenseSlice";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { HistoryItemFlatList } from "./hisotry-Item-flat-list";

export const StyledFlatList = styled(FlatList<History>);

export function HistoryFlatList() {
  const proposal  = useSelector((state: RootState) => state.proposalList.proposal);
  const loading  = useSelector((state: RootState) => state.proposalList.loading);
  const [expenseTipo, setExpenseTipo] = useState<boolean>(true);

  if (loading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="h-full flex w-full">
      <StyledFlatList
        removeClippedSubviews={false}
        keyExtractor={(item: History) => item.id}
        data={proposal?.histories}
        renderItem={({ item, index }: { item: History; index: number }) => {
          return <HistoryItemFlatList history={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="atividades" />}
        className="flex-1"
      />
    </StyledView>
  );
}
