import moment from "moment";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Calendar as Calendario } from "react-native-calendars";

import { DateEventType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { DateEventModalComponent } from "./components/modal";
import { fecthDateEvents } from "@store/dateEvent/dateEventSlice";
import { StyledPressable, StyledScrollView, StyledText, StyledView } from "styledComponents";

export function SectionScreen() {
  
  const today = new Date();
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
        selectedColor: evento ? "blue" : visita ? "#5dd55d" : "#A9A9A9",
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
    <StyledScrollView className="bg-gray-dark flex-1 flex flex-col h-full w-full">
      <StyledView className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
        <StyledPressable
          className="bg-gray-dark"
          onPress={() => setIsModalOpen(true)}
        >
          <StyledText className="text-custom-white font-semibold">Criar Data</StyledText>
        </StyledPressable>
        <StyledView className="rounded-md overflow-hidden flex justify-start min-w-[95%] mx-auto h-full   z-40 mt-5">
          <Calendario
            onDayPress={handleDatePress}
            markedDates={{
              ...markedDates,
            }}
            minDate={today.toDateString()}
          />
          <StyledView className="mt-3 flex-col">
            <StyledView className="flex-row">
              <StyledView className="flex flex-row gap-x-2 mt-1 justify-center items-center">
                <StyledView className="h-2 w-2 bg-blue-700 rounded-full " />
                <StyledText className="text-[12px] text-white">Evento</StyledText>
              </StyledView>
              <StyledView className="flex-row gap-x-2 mt-1 ml-2  justify-center items-center">
                <StyledView className="h-2 w-2 bg-[#5dd55d] rounded-full" />
                <StyledText className="text-[12px] text-white">Visita</StyledText>
              </StyledView>
              <StyledView className="flex-row gap-x-2 mt-1  ml-2  justify-center items-center">
                <StyledView className="h-2 w-2 bg-red-700 rounded-full " />
                <StyledText className="text-[12px] text-white">Outro</StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
          {selectedEvents && (
            <StyledView className="mt-5">
              {selectedEvents.map((item: DateEventType) => {
                return (
                  <StyledView
                    key={item.id}
                    className="bg-white mt-3 flex justify-center items-center py-3 rounded-md"
                  >
                    <StyledText>{item.titulo}</StyledText>
                    <StyledView className="flex flex-row justify-between items-center w-[80%] mx-auto mt-5">
                      <StyledView className="flex flex-col justify-center items-center gap-y-1">
                        <Ionicons name="people" size={20} color="black" />
                        <StyledText className=" text-[11px]">
                          {item?.orcamento?.convidados || 0}
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex flex-col justify-center items-center gap-y-1">
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="black"
                        />
                        <StyledText className=" text-[11px]">
                          {format(item?.dataInicio, "dd/MM/yyyy")}
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex flex-col justify-center items-center gap-y-1">
                        <Feather name="clock" size={20} color="black" />
                        <StyledView className="flex-row">
                          <StyledText className=" text-[11px]">
                            {moment.utc(item?.dataInicio).format("HH:mm")}
                          </StyledText>
                          <StyledText className=" text-[11px]">/</StyledText>
                          <StyledText className=" text-[11px]">
                            {moment.utc(item?.dataFim).format("HH:mm")}
                          </StyledText>
                        </StyledView>
                      </StyledView>
                    </StyledView>
                  </StyledView>
                );
              })}
            </StyledView>
          )}
        </StyledView>
      </StyledView>
      <DateEventModalComponent
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="CREATE"
      />
    </StyledScrollView>
  );
}
