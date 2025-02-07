import { History } from "type";
import { useState } from "react";
import { formatCurrency } from "react-native-format-currency";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import moment from "moment";

interface ItemFlatListProps {
  history: History;
}

export function HistoryItemFlatList({ history }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <StyledPressable
      onPress={() => setIsModalOpen(true)}
      className="
        flex flex-row flex-wrap items-start justify-start 
        px-3 py-5 bg-[#313338] w-full 
        rounded-md overflow-hidden shadow-lg relative
      "
    >
      <StyledText className="text-[12px] text-white font-semibold flex-shrink-0">
        {moment.utc(history?.createdAt).format("DD/MM/yyyy")}
      </StyledText>
      <StyledText className="mx-3 text-[12px] text-white font-semibold flex-shrink-0">
        -
      </StyledText>
      <StyledText className="text-[12px] text-white font-semibold flex-1">
        {history.action}
      </StyledText>
    </StyledPressable>
  );
}
