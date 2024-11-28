import { useState } from "react";
import { format } from "date-fns";
import { formatCurrency } from "react-native-format-currency";

import { BugdetType } from "type";
import { BudgetModal } from "../modal";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { BudgetInfoModal } from "../modal/info";

interface ItemFlatListProps {
  budget: BugdetType;
}

export function BudgetItemFlatList({ budget }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"CREATE" | "UPDATE" | "INFO">(
    "INFO"
  );

  // Função para abrir o modal
  const openModal = () => {
    setModalType("INFO"); // Definindo o tipo do modal, caso seja necessário
    setIsModalOpen(true);
  };

  // Formatação de dados
  const formattedDate = budget?.dataInicio
    ? format(new Date(budget.dataInicio), "dd/MM/yyyy")
    : "Data inválida";
  const formattedTotal = budget?.total
    ? formatCurrency({
        amount: Number(budget.total.toFixed(2)),
        code: "BRL",
      })[0]
    : "R$ 0,00";

  return (
    <>
      <StyledPressable
        onPress={openModal}
        className="flex flex-col items-start justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
      >
        <StyledView className="flex-row justify-between font-semibold items-center overflow-hidden w-full">
          <StyledView className="flex-row justify-start items-start min-w-[30%] max-w-[30%]">
            <StyledText className="text-[13px] text-white font-semibold">
              {budget?.nome || "Nome indisponível"}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-start items-start">
            <StyledText className="text-[13px] text-white font-semibold">
              {formattedDate}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row items-start text-center">
            <StyledText className="text-[13px] text-white font-semibold">
              {formattedTotal}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledPressable>
      {isModalOpen && (
        <BudgetInfoModal
          budget={budget}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
}
