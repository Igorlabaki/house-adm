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
            theme={{
              backgroundColor: '#313338',  // Cor do fundo geral do calendário
              calendarBackground: '#313338',  // Cor do fundo do calendário
              textSectionTitleColor: '#ffffff',  // Cor do texto dos títulos de dias da semana (Dom, Seg, etc.)
              dayTextColor: '#ffffff',  // Cor do texto dos dias do mês
              todayTextColor: '#ffffff',  // Cor do texto do dia atual
              selectedDayTextColor: '#ffffff',  // Cor do texto do dia selecionado
              monthTextColor: '#ffffff',  // Cor do texto do mês
              arrowColor: '#ffffff',  // Cor das setas de navegação
              selectedDayBackgroundColor: 'blue',  // Cor do fundo do dia selecionado
              dotColor: '#ffffff',  // Cor dos marcadores de eventos
            }}
          />
          <StyledView className="mt-3 flex-col">
            <StyledView className="flex-row">
              <StyledView className="flex flex-row gap-x-2 mt-1 justify-center items-center">
                <StyledView className="h-3 w-3 bg-blue-700 rounded-full " />
                <StyledText className="text-[12px] text-white">Evento</StyledText>
              </StyledView>
              <StyledView className="flex-row gap-x-2 mt-1 ml-2  justify-center items-center">
                <StyledView className="h-3 w-3 bg-[#5dd55d] rounded-full" />
                <StyledText className="text-[12px] text-white">Visita</StyledText>
              </StyledView>
              <StyledView className="flex-row gap-x-2 mt-1  ml-2  justify-center items-center">
                <StyledView className="h-3 w-3 bg-red-700 rounded-full " />
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
                    className="flex flex-col items-start justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
                  >
                    <StyledText className='text-[14px] text-white font-semibold text-center w-full'>{item.titulo}</StyledText>
                    <StyledView className="flex flex-row items-center w-[100%] mx-auto mt-7">
                      <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
                        <Ionicons name="people" size={20} color="white" />
                        <StyledText className=" text-[13px] text-white font-semibold">
                          {item?.orcamento?.convidados || 0}
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="white"
                        />
                        <StyledText className=" text-[13px] text-white font-semibold">
                          {format(item?.dataInicio, "dd/MM/yyyy")}
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
                        <Feather name="clock" size={20} color="white" />
                        <StyledView className="flex-row">
                          <StyledText className=" text-[13px] text-white font-semibold">
                            {moment.utc(item?.dataInicio).format("HH:mm")}
                          </StyledText>
                          <StyledText className=" text-[13px] text-white font-semibold">/</StyledText>
                          <StyledText className=" text-[13px] text-white font-semibold">
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
