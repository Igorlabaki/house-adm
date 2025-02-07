import { format } from "date-fns";
import { PaymentType } from "type";
import { formatCurrency } from "react-native-format-currency";
import { StyledPressable, StyledText, StyledView } from "styledComponents";

interface PaymentItemListProps {
  index: number;
  payment: PaymentType;
  setSelectedPayment: React.Dispatch<React.SetStateAction<PaymentType>>;
}

export default function PaymentItemList({
  index,
  payment,
  setSelectedPayment
}: PaymentItemListProps) {
  return (
    <StyledPressable
      onPress={() => setSelectedPayment(payment)}
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
    </StyledPressable>
  );
}
