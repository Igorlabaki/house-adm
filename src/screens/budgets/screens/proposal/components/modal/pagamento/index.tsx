import { PaymentInfo } from "./payment-info";
import { PaymentFlatList } from "./list/flat-list";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { useState } from "react";
import { PaymentModal } from "./modal";

export default function PagamentoScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <StyledView className="bg-gray-dark h-full">
      <StyledPressable
        onPress={() => setIsModalOpen(true)}
        className="
          justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
          rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-3 border-[0.6px] border-white border-solid w-[50%] mt-3
        "
      >
        <StyledText className="text-white text-sm font-bold text-center">
          Novo Pagamento
        </StyledText>
      </StyledPressable>
      <PaymentInfo />
      <PaymentFlatList />
      {isModalOpen && (
        <PaymentModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="CREATE"
        />
      )}
    </StyledView>
  );
}
