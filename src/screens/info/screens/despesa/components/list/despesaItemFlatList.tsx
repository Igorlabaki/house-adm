import { useState } from "react";
import { formatCurrency } from "react-native-format-currency";

import { DespesaType } from "type";

import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { DespesaModal } from "../despesaModal";
import { format } from "date-fns";
interface ItemFlatListProps {
  despesa: DespesaType;
}

export function DespesaItemFlatList({ despesa }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StyledPressable
      onPress={() => setIsModalOpen(true)}
      className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <StyledView className=" flex flex-row gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex-row justify-start items-start gap-x-2 w-[40%]">
          <StyledText className="text-[12px] text-white font-semibold">
            {despesa?.descricao}
          </StyledText>
        </StyledView>
        {despesa.tipo === "Esporadico" && (
          <StyledView className="flex-row justify-start items-start gap-x-2">
            <StyledText className="text-[12px] text-white font-semibold">
              {format(despesa?.dataPagamento, "dd/MM/yyyy")}
            </StyledText>
          </StyledView>
        )}
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-white font-semibold">
            {formatCurrency({ amount: despesa?.valor, code: "BRL" })[0]}
          </StyledText>
        </StyledView>
      </StyledView>
      <DespesaModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        despesa={despesa}
      />
    </StyledPressable>
  );
}
