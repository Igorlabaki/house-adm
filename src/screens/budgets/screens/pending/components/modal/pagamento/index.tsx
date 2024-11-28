import React, { useEffect, useState } from "react";
import { StyledModal, StyledText, StyledView } from "styledComponents";
import PagamentoInfo from "./pagamentoInfo";
import { PagamentoFormComponent } from "./pagamentoForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { deletePagamentoOrcamentoByIdAsync } from "@store/orcamento/orcamentoSlice";
import { Pagamento } from "type";
import PagamentoList from "./pagamentoList";

interface PagamentoModalProps {
  pagamentoModalIsOpen: boolean;
  setPagamentoModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PagamentoModal({
  pagamentoModalIsOpen,
  setPagamentoModalIsOpen,
}: PagamentoModalProps) {
  const { orcamento } = useSelector((state: RootState) => state.orcamentosById);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const [pagamentoSeleiconada, setPagamentoSeleiconada] =
    useState<Pagamento>(null);

  useEffect(() => {
    pagamentoSeleiconada;
  }, [pagamentoSeleiconada]);

  return (
    <StyledModal
      animationType="fade"
      transparent={true}
      visible={pagamentoModalIsOpen}
      onRequestClose={() => setPagamentoModalIsOpen(false)}
    >
      <StyledView className="bg-gray-dark h-full px-6 py-16">
        <PagamentoInfo />
        <StyledView>
          <StyledText className="text-white font-bold  w-full text-center mt-8">
            Pagamentos ja realizados:
          </StyledText>
          <StyledView className="mt-5 flex flex-col">
            <PagamentoList setPagamentoSeleiconada={setPagamentoSeleiconada} />
          </StyledView>
        </StyledView>
        <PagamentoFormComponent
          orcamentoId={orcamento?.id}
          setPagamentoModalIsOpen={setPagamentoModalIsOpen}
          pagamentoSeleiconada={pagamentoSeleiconada}
        />
      </StyledView>
    </StyledModal>
  );
}
