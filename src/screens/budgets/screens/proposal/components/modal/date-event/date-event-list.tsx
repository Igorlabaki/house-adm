import { useEffect } from "react";
import { DateEventType, ProposalType } from "type";
import { Venue } from "@store/venue/venueSlice";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { StyledText, StyledView } from "styledComponents";
import { DateEventItemList } from "./date-event-item-list";
import { fecthDateEvents } from "@store/dateEvent/dateEventSlice";

interface DateEventProps {
  dateSelected: DateEventType;
  setdateSelected: React.Dispatch<React.SetStateAction<DateEventType>>;
}

export function DateEvetList({
  setdateSelected,
  dateSelected,
}: DateEventProps) {
  const queryParams = new URLSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );

  useEffect(() => {
    queryParams.set("proposalId", proposal.id);
    dispatch(fecthDateEvents(`${queryParams.toString()}`));
  }, [proposal]);

  const dateEventList = useSelector(
    (state: RootState) => state.daveEventList.dateEvents
  );

  if (dateEventList?.length === 0) {
    return (
      <StyledView className="w-full justify-center items-center py-4">
        <StyledText className="text-[13px] text-white font-light">
          Nao ha nenhuma data agendada
        </StyledText>
      </StyledView>
    );
  }

  return (
    <>
      {dateEventList?.map((dateEvent: DateEventType, index = 0) => {
        return (
          <DateEventItemList
            index={index}
            key={dateEvent?.id}
            dateEvent={dateEvent}
            dateSelected={dateSelected}
            setdateSelected={setdateSelected}
          />
        );
      })}
    </>
  );
}
