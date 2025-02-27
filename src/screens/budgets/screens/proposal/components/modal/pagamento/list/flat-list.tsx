import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { PaymentType, ProposalType } from "type";
import { ListEmpty } from "@components/list/ListEmpty";
import { PaymentItemFlatList } from "./item-flat-list";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<PaymentType>);

export function PaymentFlatList() {
  
  const loading : boolean = useSelector((state: RootState) => state.proposalList.loading);
  const proposal : ProposalType = useSelector((state: RootState) => state.proposalList.proposal);

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
        keyExtractor={(item: PaymentType) => item.id}
        data={proposal?.payments}
        renderItem={({ item }: { item: PaymentType }) => {
          return <PaymentItemFlatList payment={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="Pagamento" />}
        className="flex-1"
      />
    </>
  );
}
