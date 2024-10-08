import { styled } from "nativewind";
import React, { useEffect } from "react";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, FlatList } from "react-native";
import { fecthOrcamentosAprovados } from "@store/budgetAprovado/bugetAprovadoSlice";

import { BugdetType } from "type";
import { ListEmpty } from "@components/list/ListEmpty";    
import { BudgetItemFlatList } from "./budgetitemFlatList";
import { StyledText, StyledView } from "styledComponents";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<BugdetType>);

export const OrcamentoAprovadoFlatList = React.memo(() => {

  const dispatch: AppDispatch = useDispatch();
  const orcamentosAporvadoList = useSelector((state: RootState) => state.orcamentosAprovadoList);

  const month = new Date().getMonth() + 1;
  const queryParams = new URLSearchParams(); 

  useEffect(() => {
    queryParams.append('year', new Date().getFullYear().toString());
    queryParams.append('month', month.toString());
    dispatch(fecthOrcamentosAprovados({url: `${queryParams.toString()}`}));
  }, []);

  if (orcamentosAporvadoList.loading) {
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
        keyExtractor={(item: BugdetType) => item.id}
        data={orcamentosAporvadoList?.orcamentosAprovado}

        renderItem={({ item }: { item: BugdetType }) => {
          return <BudgetItemFlatList budget={item}  key={item.id} />;
        }}

        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="orcamento" />}

        windowSize={5}
        maxToRenderPerBatch={10}
        initialNumToRender={4} 
      />
    </>
  );
})
