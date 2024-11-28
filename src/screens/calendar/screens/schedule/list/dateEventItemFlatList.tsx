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
    <StyledPressable onPress={() => setIsModalOpen(true)}  className="flex flex-col items-start justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative">
      <StyledView className={"flex justify-center items-center w-full"}>
        <StyledText className='text-[14px] text-white font-semibold'>{dateEvent?.titulo}</StyledText>
        <StyledText className="text-[13px] text-white font-semibold  ">{`( ${moment(dateEvent?.dataInicio).fromNow()})`}</StyledText>
      </StyledView>
      <StyledView className="flex flex-row justify-between items-center w-full mx-auto mt-5">
        <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
          <Ionicons name="people" size={20} color="white" />
          <StyledText className=" text-[13px] text-white font-semibold">
            {dateEvent?.orcamento?.convidados || 0}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
          <Ionicons name="calendar-outline" size={20} color="white" />
          <StyledText className=" text-[13px] text-white font-semibold">
            {format(dateEvent?.dataInicio, "dd/MM/yyyy")}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
          <Feather name="clock" size={20} color="white" />
          <StyledView className="flex-row">
            <StyledText className=" text-[13px] text-white font-semibold">
              {moment.utc(dateEvent?.dataInicio).format("HH:mm")}
            </StyledText>
            <StyledText className=" text-[13px] text-white font-semibold">/</StyledText>
            <StyledText className=" text-[13px] text-white font-semibold">
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
