import React, { useEffect, useState } from "react";
import { StyledModal, StyledText, StyledView } from "styledComponents";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { DateEventType } from "type";
import AgendamentoList from "./agendamentoList";
import { DateEventModalComponent } from "screens/calendar/screens/calendarSection/components/modal";
import { DateEventFormComponent } from "screens/calendar/screens/calendarSection/components/form/dateEventForm";

interface AgendamentoModalProps {
  agendamentoModalIsOpen: boolean;
  setAgendamentoModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AgendamentoModal({
  agendamentoModalIsOpen,
  setAgendamentoModalIsOpen,
}: AgendamentoModalProps) {
  const { orcamento } = useSelector((state: RootState) => state.orcamentosById);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const [agendamentoSeleiconada, setAgendamentoSeleiconada] =
    useState<DateEventType>(null);

  useEffect(() => {
    agendamentoSeleiconada;
  }, [agendamentoSeleiconada]);

  return (
    <StyledModal
      animationType="fade"
      transparent={true}
      visible={agendamentoModalIsOpen}
      onRequestClose={() => setAgendamentoModalIsOpen(false)}
    >
      <StyledView className="bg-gray-dark h-full px-6 py-16">
        <StyledText className="text-white font-bold  w-full text-center">
          Data ja agendadas:
        </StyledText>
        <StyledView className="mt-5 flex flex-col">
          <AgendamentoList />
        </StyledView>
        <StyledView>
          <DateEventFormComponent
            budget={orcamento}
            setIsModalOpen={setAgendamentoModalIsOpen}
          />
        </StyledView>
      </StyledView>
    </StyledModal>
  );
}
