import { useState } from "react";
import { format } from "date-fns";
import { formatCurrency } from "react-native-format-currency";

import { BugdetType } from "type";
import { BudgetInfoModal } from "../modal/info";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { BudgetModal } from "../modal";
interface ItemFlatListProps {
  budget: BugdetType;
}

export function BudgetItemFlatList({ budget }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StyledPressable
      onPress={() => {
        setIsModalOpen(true);
      }}
      className="flex flex-col items-start  justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <StyledView className="flex-row justify-between font-semibold items-center overflow-hidden w-full ">
        <StyledView className="flex-row justify-start items-start min-w-[30%] max-w-[30%]">
          <StyledText className="text-[13px] text-white  font-semibold ">
            {budget?.nome}
          </StyledText>
        </StyledView>
        <StyledView className="flex-row justify-start items-start ">
          <StyledText className="text-[13px] text-white  font-semibold">
            {format(budget?.dataInicio, "dd/MM/yyyy")}
          </StyledText>
        </StyledView>
        <StyledView className="flex-row  items-start  text-center">
          <StyledText className="text-[13px] text-white  font-semibold">
            {
              formatCurrency({
                amount: Number(budget?.total.toFixed(2)),
                code: "BRL",
              })[0]
            }
          </StyledText>
        </StyledView>
      </StyledView>
      {isModalOpen && (
        <BudgetInfoModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          budget={budget}
        />
      )}
    </StyledPressable>
  );
}
