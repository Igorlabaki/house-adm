import { useEffect } from "react";
import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator, FlatList } from "react-native";

import { ValueType } from "type";
import { fecthValues } from "@store/value/valuesSlice";
import { ListEmpty } from "@components/list/ListEmpty";
import { ValueItemFlatList } from "./valueItemFlatList";
import { StyledText, StyledView } from "styledComponents";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<ValueType>);

export function ValueFlatList() {
  const dispatch = useDispatch();
  const valueList = useSelector((state: RootState) => state.valueList);

  useEffect(() => {
    dispatch(fecthValues());
  }, []);

  if (valueList.loading) {
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
        keyExtractor={(item: ValueType) => item.id}
        data={valueList?.values}
        renderItem={({ item }: { item: ValueType }) => {
          return <ValueItemFlatList value={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="value" />}
        className="flex-1"
      />
    </>
  );
}
