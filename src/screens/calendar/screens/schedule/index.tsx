import { useState } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import { DateEventModalComponent } from "../calendarSection/components/modal";
import { EventDateFlatList } from "./list/dateEventFlatList";
import SearchFilterListComponent from "../../../../components/list/searchFilterList";
import { fecthDateEvents } from "../../../../store/dateEvent/dateEventSlice";

export function ScheduleScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <View className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
      <Text className="text-custom-white font-semibold">Proximas Datas :</Text>
      <SearchFilterListComponent fectData={fecthDateEvents} />
      <EventDateFlatList />
    </View>
  );
}
