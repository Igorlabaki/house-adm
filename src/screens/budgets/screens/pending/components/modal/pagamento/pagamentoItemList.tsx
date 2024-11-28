import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { AppDispatch, RootState } from "@store/index";
import {
  deletePagamentoOrcamentoByIdAsync,
  fetchOrcamentoById,
} from "@store/orcamento/orcamentoSlice";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { formatCurrency } from "react-native-format-currency";
import { useDispatch, useSelector } from "react-redux";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { Pagamento } from "type";

interface PagamentoItemListProps {
  index: number;
  pagamento: Pagamento;
  setPagamentoSeleiconada: React.Dispatch<React.SetStateAction<Pagamento>>;
}

export default function PagamentoItemList({
  index,
  pagamento,
  setPagamentoSeleiconada
}: PagamentoItemListProps) {
  const formattedNumber = (valor: number) => {
    return valor
      ? formatCurrency({
          amount: Number(valor.toFixed(2)),
          code: "BRL",
        })[0]
      : "R$ 0,00";
  };
  const { orcamento } = useSelector((state: RootState) => state.orcamentosById);
  const dispatch = useDispatch<AppDispatch>();

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  return (
    <StyledPressable
      onPress={() => setDeleteModalIsOpen(true)}
      delayLongPress={5000}
      key={pagamento?.id}
      className="flex flex-col items-start justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative mt-2"
    >
      <StyledView className="flex-row justify-between font-semibold items-center overflow-hidden w-full">
        <StyledView className="flex-row justify-start items-start">
          <StyledText className="text-[13px] text-white font-semibold">
            {pagamento.dataPagamento
              ? format(new Date(pagamento.dataPagamento), "dd/MM/yyyy")
              : "Data inválida"}
          </StyledText>
        </StyledView>
        <StyledView className="flex-row items-start text-center">
          <StyledText className="text-[13px] text-white font-semibold">
            {pagamento?.value
              ? formatCurrency({
                  amount: Number(Number(pagamento?.value).toFixed(2)),
                  code: "BRL",
                })[0]
              : "R$ 0,00"}
          </StyledText>
        </StyledView>
      </StyledView>
      {
        <DeleteConfirmationModal
          visible={deleteModalIsOpen}
          entity="pagamento"
          onCancel={() => setDeleteModalIsOpen(false)}
          onConfirm={() => {
            dispatch(deletePagamentoOrcamentoByIdAsync(pagamento?.id));
            dispatch(fetchOrcamentoById(orcamento?.id));
          }}
        />
      }
    </StyledPressable>
  );
}
