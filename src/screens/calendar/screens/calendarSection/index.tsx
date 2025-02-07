import moment from "moment";
import { format } from "date-fns";
import { DateEventType } from "type";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { Feather, Ionicons } from "@expo/vector-icons";
import { DateEventModalComponent } from "./components/modal";
import { Calendar as Calendario } from "react-native-calendars";
import { fecthDateEvents } from "@store/dateEvent/dateEventSlice";
import {
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledView,
} from "styledComponents";
import { Venue } from "@store/venue/venueSlice";

export function SectionScreen() {
  const today = new Date();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const dataEventList = useSelector((state: RootState) => state.daveEventList);
  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);
  const queryParams = new URLSearchParams();
  queryParams.append("venueId", venue.id);

  useEffect(() => {
    dispatch(fecthDateEvents(`${queryParams.toString()}`));
  }, []);

  const generateDateRange = (
    start: string,
    end: string,
    item: DateEventType
  ) => {
    let dates = {};
    let currentDate = moment(start);
    const endDate = moment(end);

    while (currentDate.isSameOrBefore(endDate, "day")) {
      const formattedDate = currentDate.format("YYYY-MM-DD");

      dates = {
        ...dates,
        [formattedDate]: {
          selected: true,
          marked: true, // Mantém o marcador para eventos
          color:
            item.type === "EVENT" || item.type === "OVERNIGHT"
              ? "#1d4ed8"
              : item.type === "VISIT"
              ? "#5dd55d"
              : "#A9A9A9",
          textColor: "white",
          startingDay: formattedDate === start, // Primeiro dia do intervalo
          endingDay: formattedDate === end, // Último dia do intervalo
        },
      };

      currentDate.add(1, "day");
    }

    return dates;
  };

  // Criando todas as marcações de eventos
  const markedDates = dataEventList.dateEvents.reduce((acc, item) => {
    return {
      ...acc,
      ...generateDateRange(item.startDate, item.endDate, item),
    };
  }, {});

  const handleDatePress = (day: any) => {
    const selectedDate = day.dateString;

    setSelectedEvents(
      dataEventList.dateEvents.filter((item: DateEventType) => {
        const start = moment(item.startDate).format("YYYY-MM-DD");
        const end = moment(item.endDate).format("YYYY-MM-DD");

        return moment(selectedDate).isBetween(start, end, null, "[]"); // Verifica se está dentro do intervalo (inclusivo)
      })
    );
  };

 

  return (
    <StyledScrollView className="bg-gray-dark flex-1 flex flex-col h-full w-full">

      <StyledView className="bg-gray-dark flex-1 pt-3 flex flex-col h-full w-full">
        <StyledPressable
          onPress={() => setIsModalOpen(true)}
          className="
                justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
                rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-3 border-[0.6px] border-white border-solid w-[50%]"
        >
          <StyledText className="text-white text-sm font-bold text-center">
            Nova Data
          </StyledText>
        </StyledPressable>
        <StyledView className="rounded-md overflow-hidden flex justify-start w-full mx-auto h-full   z-40 mt-3">
          <Calendario
            onDayPress={handleDatePress}
            markedDates={{
              ...markedDates,
            }}
            markingType="period"
            minDate={today.toDateString()}
            theme={{
              backgroundColor: "#313338", // Cor do fundo geral do calendário
              calendarBackground: "#313338", // Cor do fundo do calendário
              textSectionTitleColor: "#ffffff", // Cor do texto dos títulos de dias da semana (Dom, Seg, etc.)
              dayTextColor: "#ffffff", // Cor do texto dos dias do mês
              todayTextColor: "#ffffff", // Cor do texto do dia atual
              selectedDayTextColor: "#ffffff", // Cor do texto do dia selecionado
              monthTextColor: "#ffffff", // Cor do texto do mês
              arrowColor: "#ffffff", // Cor das setas de navegação
              selectedDayBackgroundColor: "blue", // Cor do fundo do dia selecionado

              dotColor: "#ffffff", // Cor dos marcadores de eventos
            }}
          />
          <StyledView className="mt-3 flex-col">
            <StyledView className="flex-row">
              <StyledView className="flex flex-row gap-x-2 mt-1 justify-center items-center">
                <StyledView className="h-3 w-3 bg-blue-700 rounded-full " />
                <StyledText className="text-[12px] text-white">
                  Evento
                </StyledText>
              </StyledView>
              <StyledView className="flex-row gap-x-2 mt-1 ml-2  justify-center items-center">
                <StyledView className="h-3 w-3 bg-[#5dd55d] rounded-full" />
                <StyledText className="text-[12px] text-white">
                  Visita
                </StyledText>
              </StyledView>
              <StyledView className="flex-row gap-x-2 mt-1  ml-2  justify-center items-center">
                <StyledView className="h-3 w-3 bg-red-700 rounded-full " />
                <StyledText className="text-[12px] text-white">
                  Outro
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
          {selectedEvents && (
            <StyledView className="my-5">
              {selectedEvents.map((item: DateEventType) => {
                 const startDate = item?.startDate
                 ? moment(item.startDate)
                 : null;
               const endDate = item?.endDate
                 ? moment(item.endDate)
                 : null;
             
               const sameDay =
                 startDate && endDate ? startDate.isSame(endDate, "day") : false;
                return (
                  <StyledView
                    key={item.id}
                    className="flex flex-col items-start justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
                  >
                    <StyledText className="text-[14px] text-white font-semibold text-center w-full">
                      {item.title}
                    </StyledText>
                    <StyledView className="flex flex-row items-center w-[100%] mx-auto mt-7">
                      <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
                        <Ionicons name="people" size={20} color="white" />
                        <StyledText className=" text-[13px] text-white font-semibold">
                          {item?.proposal?.guestNumber || 0}
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="white"
                        />
                        <StyledText className=" text-[13px] text-white font-semibold">
                          {sameDay ? (
                            <StyledText className="text-white text-[11px]">
                              {startDate && startDate.format("DD/MM/YYYY")}
                            </StyledText>
                          ) : (
                            <StyledView>
                              <StyledText className="text-white text-[11px]">
                                {startDate && startDate.format("DD/MM/YYYY")}
                              </StyledText>
                              <StyledText className="text-white text-[11px]">
                                {endDate && endDate.format("DD/MM/YYYY")}
                              </StyledText>
                            </StyledView>
                          )}
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
                        <Feather name="clock" size={20} color="white" />
                        <StyledView className="flex-row">
                          <StyledText className=" text-[13px] text-white font-semibold">
                            {moment.utc(item?.startDate).format("HH:mm")}
                          </StyledText>
                          <StyledText className=" text-[13px] text-white font-semibold">
                            /
                          </StyledText>
                          <StyledText className=" text-[13px] text-white font-semibold">
                            {moment.utc(item?.endDate).format("HH:mm")}
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
