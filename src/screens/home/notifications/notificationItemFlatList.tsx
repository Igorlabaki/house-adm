import { useEffect, useState } from "react";

import { NotificationType } from "type";

import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { BudgetInfoModal } from "screens/budgets/screens/pending/components/modal/info";
import { DateEventFormComponent } from "screens/calendar/screens/calendarSection/components/form/dateEventForm";
import { useDispatch, useSelector } from "react-redux";
import { fecthValues } from "@store/value/valuesSlice";
import { AppDispatch, RootState } from "@store/index";
interface ItemFlatListProps {
  notification: NotificationType;
}

export function NotificationItemFlatList({ notification }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StyledPressable
      onPress={() => {
        setIsModalOpen(true);
      }}
      className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <StyledView className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledText className="text-[12px] text-white ">
          {notification?.content}
        </StyledText>
      </StyledView>
      {isModalOpen && notification.type === "ORCAMENTO" && (
        <BudgetInfoModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          budget={notification?.orcamento}
        />
      )}
      {isModalOpen && notification.type === "EVENTO" && (
        <BudgetInfoModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          budget={notification?.orcamento}
        />
      )}
      {isModalOpen && notification.type === "VISITA" && (
        <BudgetInfoModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          budget={notification?.orcamento}
        />
      )}
    </StyledPressable>
  );
}
