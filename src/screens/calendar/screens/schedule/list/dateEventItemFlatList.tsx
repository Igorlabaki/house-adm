import moment from 'moment';
import 'moment/locale/pt-br';
import { useState } from 'react';
import { format } from "date-fns";

import { DateEventType } from 'type';
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { DateEventModalComponent } from '../../calendarSection/components/modal';
interface DateEventItemFlatListProps {
  dateEvent: DateEventType;
}
moment.locale('pt-br');
export function DateEventItemFlatList({
  dateEvent,
}: DateEventItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <StyledPressable onPress={() => setIsModalOpen(true)} className="bg-white mt-3 flex justify-center items-center py-3 rounded-md px-10 relative">
      <StyledView className={"flex justify-center items-center w-full"}>
        <StyledText>{dateEvent?.titulo}</StyledText>
        <StyledText className="text-[11px] font-semibold text-gray-600  ">{`( ${moment(dateEvent?.dataInicio).fromNow()})`}</StyledText>
      </StyledView>
      <StyledView className="flex flex-row justify-between items-center w-full mx-auto mt-5">
        <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
          <Ionicons name="people" size={20} color="black" />
          <StyledText className=" text-[11px]">
            {dateEvent?.orcamento?.convidados || 0}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
          <Ionicons name="calendar-outline" size={20} color="black" />
          <StyledText className=" text-[11px]">
            {format(dateEvent?.dataInicio, "dd/MM/yyyy")}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
          <Feather name="clock" size={20} color="black" />
          <StyledView className="flex-row">
            <StyledText className=" text-[11px]">
              {moment.utc(dateEvent?.dataInicio).format("HH:mm")}
            </StyledText>
            <StyledText className=" text-[11px]">/</StyledText>
            <StyledText className=" text-[11px]">
              {moment.utc(dateEvent?.dataFim).format("HH:mm")}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
      <DateEventModalComponent
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="UPDATE"
          dateEvent={dateEvent}
      />
    </StyledPressable>
  );
}
