import React from "react";
import { ProposalType } from "type";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { StyledText, StyledView } from "styledComponents";
import { formatCurrency } from "react-native-format-currency";

export function PaymentInfo() {
  const  proposal : ProposalType = useSelector((state: RootState) => state.proposalList.proposal);

  const formattedNumber = (valor: number) => {
    return valor
      ? formatCurrency({
          amount: Number(valor.toFixed(2)),
          code: "BRL",
        })[0]
      : "R$ 0,00";
  };
  
  return (
    <StyledView>
      <StyledView className="flex flex-row w-full justify-between items-center mt-10">
        <StyledView className="flex flex-row gap-x-2">
          <StyledText className="text-custom-white font-semibold text-md">
            Pago:
          </StyledText>
          <StyledText className=" font-semibold text-md text-green-500">
            {formattedNumber(proposal?.amountPaid)}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-row gap-x-2">
          <StyledText className="text-custom-white font-semibold text-md">
            Deve:
          </StyledText>
          <StyledText className="text-red-500 font-semibold text-md">
            {formattedNumber(proposal?.totalAmount - proposal?.amountPaid)}
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );
}
