import { RootState } from "@store/index";
import { format } from "date-fns";
import React from "react";
import { formatCurrency } from "react-native-format-currency";
import { useSelector } from "react-redux";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { Pagamento } from "type";
import PagamentoList from "./pagamentoList";

export default function PagamentoInfo() {
  const { orcamento } = useSelector((state: RootState) => state.orcamentosById);

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
            Total:
          </StyledText>
          <StyledText className="text-custom-white font-semibold text-md">
            {formattedNumber(orcamento?.total)}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-row gap-x-2">
          <StyledText className="text-custom-white font-semibold text-md">
            Pago:
          </StyledText>
          <StyledText className=" font-semibold text-md text-green-500">
            {formattedNumber(orcamento?.valorPago)}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-row gap-x-2">
          <StyledText className="text-custom-white font-semibold text-md">
            Deve:
          </StyledText>
          <StyledText className="text-red-500 font-semibold text-md">
            {formattedNumber(orcamento?.total - orcamento?.valorPago)}
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );
}
