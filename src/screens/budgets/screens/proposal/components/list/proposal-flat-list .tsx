import { styled } from "nativewind";
import { ProposalType } from "type";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import React, { useCallback } from "react";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ProposalItemFlatList } from "./proposal-item-flat-list";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<ProposalType>);

export const ProposalFlatList = React.memo(() => {

  const proposalsList = useSelector((state: RootState) => state.proposalList);

  // Memoize the renderItem function
  const renderItem = useCallback(
    ({ item }: { item: ProposalType }) => {
      return <ProposalItemFlatList proposal={item} />;
    },
    [] 
  );

  // Memoize the ItemSeparatorComponent
  const renderItemSeparator = useCallback(() => {
    return <ItemSeparatorList />;
  }, []);

  // Memoize the ListEmptyComponent
  const renderListEmptyComponent = useCallback(() => {
    return <ListEmpty dataType="orcamento" />;
  }, []);

  if (proposalsList.loading) {
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
        windowSize={5}
        className="flex-1"
        initialNumToRender={4}
        renderItem={renderItem}
        maxToRenderPerBatch={10}
        removeClippedSubviews={false}
        data={proposalsList?.proposals}
        keyExtractor={(item: ProposalType) => item?.id} // Garante que a chave é única
        ItemSeparatorComponent={renderItemSeparator}
        ListEmptyComponent={renderListEmptyComponent}
      />
    </>
  );
});