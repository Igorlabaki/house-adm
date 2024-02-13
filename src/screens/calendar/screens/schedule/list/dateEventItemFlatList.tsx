import { format } from "date-fns";
import { View, Text,  } from "react-native";
import { DateEventType } from "../../../../../type";
import { Feather, Ionicons } from "@expo/vector-icons";
import moment from 'moment';
import 'moment/locale/pt-br';

interface DateEventItemFlatListProps {
  dateEvent: DateEventType;
}
moment.locale('pt-br');
export default function DateEventItemFlatList({
  dateEvent,
}: DateEventItemFlatListProps) {
  return (
    <View className="bg-white mt-3 flex justify-center items-center py-3 rounded-md">
      <Text>{dateEvent?.titulo}</Text>
      <Text className="text-[11px] font-semibold text-gray-600  ">{`(Em ${moment(dateEvent?.dataInicio).fromNow().split(" ")[1]} dias)`}</Text>
      <View className="flex flex-row justify-between items-center w-full px-10 mx-auto mt-5">
        <View className="flex flex-col justify-center items-center gap-y-1">
          <Ionicons name="people" size={20} color="black" />
          <Text className=" text-[11px]">
            {dateEvent?.orcamento?.convidados || 0}
          </Text>
        </View>
        <View className="flex flex-col justify-center items-center gap-y-1">
          <Ionicons name="calendar-outline" size={20} color="black" />
          <Text className=" text-[11px]">
            {format(dateEvent?.dataInicio, "dd/MM/yyyy")}
          </Text>
        </View>
        <View className="flex flex-col justify-center items-center gap-y-1">
          <Feather name="clock" size={20} color="black" />
          <View className="flex-row">
            <Text className=" text-[11px]">
              {format(dateEvent?.dataInicio, "HH:mm")}
            </Text>
            <Text className=" text-[11px]">/</Text>
            <Text className=" text-[11px]">
              {format(dateEvent?.dataFim, "HH:mm")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
