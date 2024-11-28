import { RootState } from "@store/index";
import React from "react";
import { formatCurrency } from "react-native-format-currency";
import { useSelector } from "react-redux";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { Pagamento } from "type";
import pagamentoItemList from "./pagamentoItemList";
import PagamentoItemList from "./pagamentoItemList";
interface PagamentoListProps{
  setPagamentoSeleiconada: React.Dispatch<React.SetStateAction<Pagamento>>
}
export default function PagamentoList({setPagamentoSeleiconada}:PagamentoListProps) {
  const { orcamento } = useSelector((state: RootState) => state.orcamentosById);

  return (
    <>
      {orcamento?.pagamentos?.map((pagamento: Pagamento, index = 0) => {
        return (
          <PagamentoItemList
          setPagamentoSeleiconada={setPagamentoSeleiconada}
            pagamento={pagamento}
            index={index}
            key={pagamento.id}
            
          />
        );
      })}
    </>
  );
}
