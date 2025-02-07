import { useState } from "react";
import { format } from "date-fns";
import { ExpenseModal } from "../modal";
import { ExpenseType } from "@store/expense/expenseSlice";
import { formatCurrency } from "react-native-format-currency";
import { StyledPressable, StyledText, StyledView } from "styledComponents";

interface ItemFlatListProps {
  expense: ExpenseType;
}

export function ExpenseItemFlatList({ expense }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StyledPressable
      onPress={() => setIsModalOpen(true)}
      className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <StyledView className=" flex flex-row   items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex-row justify-start items-start gap-x-2 w-[40%]">
          <StyledText className="text-[12px] text-white font-semibold">
            {expense?.name}
          </StyledText>
        </StyledView>
        {expense.type === "SPORADIC" && (
          <StyledView className="flex-row justify-start items-start gap-x-2">
            <StyledText className="text-[12px] text-white font-semibold">
              {format(expense?.paymentDate, "dd/MM/yyyy")}
            </StyledText>
          </StyledView>
        )}
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-white font-semibold">
            {formatCurrency({ amount: expense?.amount, code: "BRL" })[0]}
          </StyledText>
        </StyledView>
      </StyledView>
      <ExpenseModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        expense={expense}
      />
    </StyledPressable>
  );
}
