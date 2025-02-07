import { useEffect } from "react";
import { styled } from "nativewind";
import { RootState } from "../../../../../store";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, FlatList } from "react-native";
import { DateEventType } from "type";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { DateEventItemFlatList } from "./dateEventItemFlatList";
import { fecthDateEvents } from "@store/dateEvent/dateEventSlice";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<DateEventType>);

export function EventDateFlatList() {
  const dispatch = useDispatch();
  const dateEventList = useSelector((state: RootState) => state.daveEventList);

  useEffect(() => {
    dispatch(fecthDateEvents());
  }, []);

  if (dateEventList.loading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <>
      <StyledText className="text-custom-white font-semibold pb-4">
        Proximas Datas :
      </StyledText>
      <StyledFlatList
        removeClippedSubviews={false}
        keyExtractor={(item: DateEventType) => item.id}
        data={dateEventList?.dateEvents}
        renderItem={({ item }: { item: DateEventType }) => {
          return <DateEventItemFlatList dateEvent={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="data" />}
        className="flex-1"
      />
    </>
  );
}
