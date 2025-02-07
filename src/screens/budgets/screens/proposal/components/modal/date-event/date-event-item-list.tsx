import moment from "moment";
import { DateEventType } from "type";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { Venue } from "@store/venue/venueSlice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { useEffect } from "react";

interface DateEventItemListProps {
  index: number;
  dateEvent: DateEventType;
  dateSelected: DateEventType;
  setdateSelected: React.Dispatch<React.SetStateAction<DateEventType>>
}

export function DateEventItemList({ dateEvent,setdateSelected,dateSelected }: DateEventItemListProps) {

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);

  const types = [
    { display: "Visita", data: "VISIT" },
    { display: "Evento", data: "EVENT" },
    { display: "Outro", data: "OTHER" },
    { display: "Permuta", data: "BARTER" },
    { display: "Estadia", data: "OVERNIGHT" },
    { display: "Producao", data: "PRODUCTION" },
  ];

  return (
    <StyledPressable
      onPress={() => {
        if(dateSelected?.id === dateEvent?.id){
          setdateSelected(null)
        }else{
          setdateSelected(dateEvent)
        }
      }}
      delayLongPress={5000}
      key={dateEvent?.id}
      className={`
        flex flex-col items-start justify-start px-5 
        py-5 bg-[#313338] w-full rounded-md overflow-hidden 
        shadow-lg relative mt-2
        ${dateEvent?.id === dateSelected?.id && `border-[1px] border-white` }`
      }
    >
      <StyledView className="flex-row justify-between font-semibold items-center overflow-hidden w-full">
        <StyledView className="flex-row justify-start items-start">
          <StyledView className="flex-row items-start text-center">
            <StyledText className="text-[13px] text-white font-semibold">
              {
                types.find((item: { display: string; data: string }) => {
                  return item.data === dateEvent?.type;
                })?.display
              }
            </StyledText>
          </StyledView>
        </StyledView>
        {venue.pricingModel === "PER_DAY" && dateEvent.type === "OVERNIGHT"   ? (
          <StyledText className="text-[13px] text-white font-semibold">
            {dateEvent.startDate && dateEvent.endDate
              ? `${moment.utc(new Date(dateEvent.startDate)).format("DD/MM")} - ${moment.utc(new Date(dateEvent.endDate)).format("DD/MM")}`
              : "Data inválida"}
          </StyledText>
        ) : (
          <StyledText className="text-[13px] text-white font-semibold">
            {dateEvent.startDate
              ? moment.utc(new Date(dateEvent.startDate)).format("DD/MM/yyyy")
              : "Data inválida"}
          </StyledText>
        )}
      </StyledView>
    </StyledPressable>
  );
}
