import { useState, useEffect } from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { DateEventModalComponent } from "./components/modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { fecthDateEvents } from "../../../../store/dateEvent/dateEventSlice";
import { format } from "date-fns";
import { DateEventType } from "../../../../type";
import { Feather, Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export function CalendarSectionScreen() {
  const today = new Date();
  const [selected, setSelected] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const dataEventList = useSelector((state: RootState) => state.daveEventList);

  useEffect(() => {
    dispatch(fecthDateEvents());
  }, []);

  const dates = dataEventList.dateEvents.map((item: DateEventType) => {
    const evento = item?.tipo === "Evento";
    const visita = item?.tipo === "Visita";
    const outro = item?.tipo === "Outro";
    return {
      [item?.dataInicio.toString().split("T")[0]]: {
        selected: true,
        marked: true, // Adiciona o manipulador de eventos para a data
        selectedColor: evento ? "blue" : "#A9A9A9",
        dotColor: visita ? "#5dd55d" : outro ? "red" : null,
        dataEventId: [item?.id],
      },
    };
  });

  const markedDates = Object.assign({}, ...dates);

  const handleDatePress = (day: any) => {
    const selectedDate = day.dateString;

    setSelectedEvents(
      dataEventList.dateEvents.filter((item: DateEventType) => {
        return item?.dataInicio.toString().includes(selectedDate);
      })
    );
  };

  return (
    <ScrollView className="bg-gray-dark flex-1 flex flex-col h-full w-full">
      <View className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
        <Pressable
          className="bg-gray-dark"
          onPress={() => setIsModalOpen(true)}
        >
          <Text className="text-custom-white font-semibold">Nova Data</Text>
        </Pressable>
        <View className="rounded-md overflow-hidden flex justify-start min-w-[95%] mx-auto h-full   z-40 mt-5">
          <Calendar
            onDayPress={handleDatePress}
            markedDates={{
              ...markedDates,
            }}
            minDate={today.toDateString()}
          />
          <View className="mt-3 flex-col">
            <View className="flex-row">
              <View className="flex flex-row gap-x-2 mt-1 justify-center items-center">
                <View className="h-2 w-2 bg-blue-700 rounded-full " />
                <Text className="text-[12px] text-white">Evento</Text>
              </View>
              <View className="flex-row gap-x-2 mt-1 ml-2  justify-center items-center">
                <View className="h-2 w-2 bg-[#5dd55d] rounded-full" />
                <Text className="text-[12px] text-white">Visita</Text>
              </View>
              <View className="flex-row gap-x-2 mt-1  ml-2  justify-center items-center">
                <View className="h-2 w-2 bg-red-700 rounded-full " />
                <Text className="text-[12px] text-white">Outro</Text>
              </View>
            </View>
          </View>
          {selectedEvents && (
            <View className="mt-5">
              {selectedEvents.map((item: DateEventType) => {
                return (
                  <View
                    key={item.id}
                    className="bg-white mt-3 flex justify-center items-center py-3 rounded-md"
                  >
                    <Text>{item.titulo}</Text>
                    <View className="flex flex-row justify-between items-center w-[80%] mx-auto mt-5">
                      <View className="flex flex-col justify-center items-center gap-y-1">
                        <Ionicons name="people" size={20} color="black" />
                        <Text className=" text-[11px]">
                          {item?.orcamento?.convidados || 0}
                        </Text>
                      </View>
                      <View className="flex flex-col justify-center items-center gap-y-1">
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="black"
                        />
                        <Text className=" text-[11px]">
                          {format(item?.dataInicio, "dd/MM/yyyy")}
                        </Text>
                      </View>
                      <View className="flex flex-col justify-center items-center gap-y-1">
                        <Feather name="clock" size={20} color="black" />
                        <View className="flex-row">
                          <Text className=" text-[11px]">
                            {format(item?.dataInicio, "HH:mm")}
                          </Text>
                          <Text className=" text-[11px]">/</Text>
                          <Text className=" text-[11px]">
                            {format(item?.dataFim, "HH:mm")}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
        <DateEventModalComponent
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="CREATE"
        />
      </View>
    </ScrollView>
  );
}
