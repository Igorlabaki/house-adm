import { useState } from "react";
import { formatCurrency } from "react-native-format-currency";

import { ValueType } from "type";
import { ValueModal } from "../valueModal";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
interface ItemFlatListProps {
  value: ValueType;
}

export function ValueItemFlatList({ value }: ItemFlatListProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StyledPressable onPress={() => setIsModalOpen(true)} className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative">
      <StyledView className=" flex flex-row gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-white font-semibold">{value?.titulo}</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-white font-semibold">{formatCurrency({ amount: value?.valor , code: "BRL" })[0]}</StyledText>
        </StyledView>
      </StyledView>
      <ValueModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        value={value}
      />
    </StyledPressable>
  );
}
