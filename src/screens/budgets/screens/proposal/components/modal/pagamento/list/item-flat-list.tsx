import { useState } from "react";
import { format } from "date-fns";
import { PaymentType } from "type";
import { PaymentModal } from "../modal";
import { formatCurrency } from "react-native-format-currency";
import { StyledPressable, StyledText, StyledView } from "styledComponents";

interface ItemFlatListProps {
  payment: PaymentType;
}

export function PaymentItemFlatList({ payment }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <StyledPressable
      onPress={() => setIsModalOpen(true)}
      delayLongPress={5000}
      key={payment?.id}
      className="flex flex-col items-start justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative mt-2"
    >
      <StyledView className="flex-row justify-between font-semibold items-center overflow-hidden w-full">
        <StyledView className="flex-row justify-start items-start">
          <StyledText className="text-[13px] text-white font-semibold">
            {payment.paymentDate
              ? format(new Date(payment.paymentDate), "dd/MM/yyyy")
              : "Data inválida"}
          </StyledText>
        </StyledView>
        <StyledView className="flex-row items-start text-center">
          <StyledText className="text-[13px] text-white font-semibold">
            {payment?.amount
              ? formatCurrency({
                  amount: Number(payment?.amount.toFixed(2)),
                  code: "BRL",
                })[0]
              : "R$ 0,00"}
          </StyledText>
        </StyledView>
      </StyledView>
      {isModalOpen && (
        <PaymentModal
          type="UPDATE"
          payment={payment}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </StyledPressable>
  );
}
