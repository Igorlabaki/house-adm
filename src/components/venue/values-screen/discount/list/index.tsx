import { SeasonalFeeType } from "type";
import { styled } from "nativewind";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { SeasonalFeeItemFlatList } from "./item-list";

export const StyledFlatList = styled(FlatList<SeasonalFeeType>);

export function SeasonalFeeFlatList() {
  const { loading, discountFees } = useSelector(
    (state: RootState) => state.discountfeesState
  );

  if (loading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="seasonalfee-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <>      
      <StyledFlatList
        removeClippedSubviews={false}
        keyExtractor={(item: SeasonalFeeType) => item.id}
        data={discountFees}
        renderItem={({ item }: { item: SeasonalFeeType }) => {
          return <SeasonalFeeItemFlatList seasonalFee={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="desconto por temporada" />}
        className="flex-1"
      />
    </>
  );
}
