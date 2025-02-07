import moment from "moment";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { Venue } from "@store/venue/venueSlice";
import { ProposalService, ProposalType } from "type";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyledText, StyledView } from "styledComponents";
import { formatCurrency } from "react-native-format-currency";

export function InfoEventos() {
  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );

  const venue : Venue = useSelector(
    (state: RootState) => state.venueList.venue
  );

  const startDate = proposal?.startDate ? moment(proposal.startDate) : null;
  const endDate = proposal?.endDate ? moment(proposal.endDate) : null;
  
  // Check if both dates are valid and if they fall on the same day
  const sameDay = startDate && endDate ? startDate.isSame(endDate, 'day') : false;

  return (
    <StyledView className="flex justify-center items-center w-full mt-5">
      <StyledText className="md:text-[21px] w-full text-[18px] text-center py-5 text-white font-semibold">
        Informacoes do Evento
      </StyledText>
      <StyledView className="flex flex-row justify-between items-center w-[80%] mx-auto mt-5 relative">
        <StyledView className="flex flex-col justify-center items-center gap-y-1">
          <Ionicons name="people" size={20} color="white" />
          <StyledText className="text-white text-[11px]">
            {proposal?.guestNumber}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-col justify-center items-center gap-y-1 ml-10">
          <Ionicons name="calendar-outline" size={20} color="white" />
          {sameDay ? (
            <StyledText className="text-white text-[11px]">
              {startDate && startDate.format("DD/MM/YYYY")}
            </StyledText>
          ) : (
            <StyledText className="text-white text-[11px]">
              {startDate && startDate.format("DD/MM/YYYY")} ate{" "}
              {endDate && endDate.format("DD/MM/YYYY")}
            </StyledText>
          )}
        </StyledView>
        <StyledView className="flex flex-col justify-center items-center gap-y-1">
          <Feather name="clock" size={20} color="white" />
          <StyledView className="flex-row">
            <StyledText className="text-white text-[11px]">
              {startDate && moment.utc(startDate).format("HH:mm")}
            </StyledText>
            <StyledText className="text-white text-[11px]">/</StyledText>
            <StyledText className="text-white text-[11px]">
              {endDate && moment.utc(endDate).format("HH:mm")}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
      <StyledView className="w-[70%] mx-auto mt-10">
        <StyledView className="flex-row justify-between items-center">
          <StyledText className="text-[13px] text-white font-semibold">
            Valor Base
          </StyledText>
          <StyledText className="text-[13px] text-white font-semibold">
            {proposal &&
              formatCurrency({
                amount: Number(proposal?.basePrice?.toFixed(2)),
                code: "BRL",
              })[0]}
          </StyledText>
        </StyledView>
        <StyledView>
          {proposal?.extraHoursQty > 0 && sameDay && (
            <StyledView className="flex-row justify-between items-center mt-1">
              <StyledText className="text-[13px] text-white font-semibold">
                Hora Extra
              </StyledText>
              <StyledText className="text-[13px] text-white font-semibold">
                {formatCurrency({
                  amount: Number(
                    (proposal?.extraHoursQty * proposal?.extraHourPrice)?.toFixed(2)
                  ),
                  code: "BRL",
                })[0]}
              </StyledText>
            </StyledView>
          )}
        </StyledView>
        {proposal?.proposalServices?.length > 0 &&
          proposal.proposalServices?.map((item: ProposalService) => {
            return (
              <StyledView
                className="flex-row justify-between items-center mt-1"
                key={item.id}
              >
                <StyledText className="text-[13px] text-white font-semibold">
                  {item.service.name}
                </StyledText>
                <StyledText className="text-[13px] text-white font-semibold">
                  {proposal &&
                    formatCurrency({
                      amount: Number(item.service.price?.toFixed(2)),
                      code: "BRL",
                    })[0]}
                </StyledText>
              </StyledView>
            );
          })}
      </StyledView>
      <StyledView className="flex-row justify-center items-center gap-x-3 mt-5">
        <StyledText className="text-[13px] text-white font-semibold">
          Total:
        </StyledText>
        <StyledText className="text-[13px] text-white font-semibold">
          {proposal &&
            formatCurrency({
              amount: Number(proposal?.totalAmount?.toFixed(2)),
              code: "BRL",
            })[0]}
        </StyledText>
      </StyledView>
      <StyledView className="flex gap-y-2 mt-5 w-[70%]">
        <StyledText className="text-white font-semibold">
          Descricao :
        </StyledText>
        <StyledView className="bg-[#313338] px-2 py-1 rounded-md overflow-hidden">
          <StyledText className="text-white font-semibold">
            {proposal?.description}
          </StyledText>
        </StyledView>
      </StyledView>
      {sameDay ? (
        <StyledView className="mt-5 flex flex-col justify-center items-center w-[70%] mx-auto overflow-hidden">
          <StyledView className="flex-row justify-between w-full items-center">
            <StyledText className="text-[13px] text-white font-semibold">
              * Valor por pessoa{" "}
            </StyledText>
            <StyledText className="text-[13px] text-white font-semibold">
              {proposal &&
                formatCurrency({
                  amount: Number(
                    (
                      Number(proposal?.totalAmount?.toFixed(2)) /
                      proposal?.guestNumber
                    )?.toFixed(0)
                  ),
                  code: "BRL",
                })[0]}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between w-full items-center">
            <StyledText className="text-[13px] text-white font-semibold">
              * Valor da hora Extra{" "}
            </StyledText>
            <StyledText className="text-[13px] text-white font-semibold">
              {proposal &&
                formatCurrency({
                  amount: Number(proposal?.extraHourPrice?.toFixed(2)),
                  code: "BRL",
                })[0]}
            </StyledText>
          </StyledView>
        </StyledView>
      ) : (
        <StyledView className="mt-5 flex flex-col justify-center items-center w-[70%] mx-auto overflow-hidden">
          <StyledView className="flex-row justify-between w-full items-center">
            <StyledText className="text-[13px] text-white font-semibold">
              * Valor por dia{" "}
            </StyledText>
            <StyledText className="text-[13px] text-white font-semibold">
              {formatCurrency({
                amount: Number(venue?.pricePerDay?.toFixed(2)),
                code: "BRL",
              })[0]}
            </StyledText>
          </StyledView>
        </StyledView>
      )}
    </StyledView>
  );
}