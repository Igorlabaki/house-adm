import { ContractType } from "type";
import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import ContractItemFlatList from "./item-flat-list";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<ContractType>);

export function ContractFlatList() {
  const contractList = useSelector((state: RootState) => state.contractList);

  if (contractList.loading) {
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
        keyExtractor={(item: ContractType) => item.id}
        data={contractList?.contracts}
        renderItem={({
          item,
          index,
        }: {
          item: ContractType;
          index: number;
        }) => {
          return (
            <ContractItemFlatList
              contract={item}
              key={item.id}
            />
          );
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="contrato" />}
        className="flex-1"
      />
    </>
  );
}
