import { styled } from "nativewind";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, FlatList } from "react-native";

import { BugdetType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { ListEmpty } from "@components/list/ListEmpty";
import { BudgetItemFlatList } from "./budgetitemFlatList";
import { StyledText, StyledView } from "styledComponents";
import { fecthOrcamentos } from "@store/budget/bugetSlice";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { fecthOrcamentosAprovados } from "@store/budgetAprovado/bugetAprovadoSlice";

export const StyledFlatList = styled(FlatList<BugdetType>);

export const OrcamentoAprovadoFlatListt = React.memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const month = new Date().getMonth() + 1;
  const queryParams = new URLSearchParams();
  const orcamentosList = useSelector(
    (state: RootState) => state.orcamentosAprovadoList
  );

  useEffect(() => {
    queryParams.append("year", new Date().getFullYear().toString());
    queryParams.append("month", month.toString());
    dispatch(fecthOrcamentosAprovados({ url: `${queryParams.toString()}` }));
  }, []);

  const renderItem = useCallback(({ item }: { item: BugdetType }) => {
    return <BudgetItemFlatList budget={item} />;
  }, []);

  if (orcamentosList.loading) {
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
        className="flex-1"
        renderItem={renderItem}
        removeClippedSubviews={false}
        data={orcamentosList?.orcamentosAprovado}
        keyExtractor={(item: BugdetType) => item.id}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="orcamento" />}
        windowSize={5}
        initialNumToRender={4}
        maxToRenderPerBatch={10}
      />
    </>
  );
});
