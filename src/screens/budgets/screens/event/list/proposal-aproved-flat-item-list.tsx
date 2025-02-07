import { styled } from "nativewind";
import { ProposalType } from "type";
import React, { useCallback, useEffect } from "react";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ProposalItemFlatList } from "./proposal-item-flat-list";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { fecthApprovedProposals } from "@store/proposal/proposal-slice";

export const StyledFlatList = styled(FlatList<ProposalType>);

export const ProposalAprovedList = React.memo(() => {

  const approvedProposalList = useSelector(
    (state: RootState) => state.proposalList.approvedproposals
  );

  const loading = useSelector(
    (state: RootState) => state.proposalList.loading
  );

  const renderItem = useCallback(({ item }: { item: ProposalType }) => {
    return <ProposalItemFlatList proposal={item} />;
  }, []);

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
        className="flex-1"
        windowSize={5}
        initialNumToRender={4}
        renderItem={renderItem}
        maxToRenderPerBatch={10}
        removeClippedSubviews={false}
        data={approvedProposalList}
        keyExtractor={(item: ProposalType) => item.id}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="orcamento" />}
      />
    </>
  );
});
