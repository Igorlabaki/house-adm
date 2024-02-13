import { useEffect } from "react";
import { RootState } from "../../../../../store";
import { DateEventType } from "../../../../../type";
import { useDispatch, useSelector } from "react-redux";
import DateEventItemFlatList from "./dateEventItemFlatList";
import { ListEmpty } from "../../../../../components/list/ListEmpty";
import { View, ActivityIndicator, Text, FlatList, } from "react-native"
import { fecthDateEvents } from "../../../../../store/dateEvent/dateEventSlice";
import { ItemSeparatorList } from "../../../../../components/list/itemSeparatorList";

export function EventDateFlatList() {
  const dispatch = useDispatch();
  const dateEventList = useSelector((state: RootState) => state.daveEventList);

  useEffect(() => {
    dispatch(fecthDateEvents());
  }, []);

  if (dateEventList.loading) {
    return (
      <View className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white">Loading</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        keyExtractor={(item: DateEventType) => item.id}
        data={dateEventList?.dateEvents}
        renderItem={({ item }: { item: DateEventType }) => {
          return <DateEventItemFlatList dateEvent={item} key={item.id}/>;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="data" />}
        className="flex-1"
      />
    </>
  );
}
