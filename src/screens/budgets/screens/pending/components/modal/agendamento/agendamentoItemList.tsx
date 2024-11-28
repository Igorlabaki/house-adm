import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { AppDispatch, RootState } from "@store/index";
import { fetchNotificationsList } from "@store/notifications/notificationsSlice";
import { deleteDateOrcamentoByIdAsync, fetchOrcamentoById } from "@store/orcamento/orcamentoSlice";
import { format } from "date-fns";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { formatCurrency } from "react-native-format-currency";
import { useDispatch, useSelector } from "react-redux";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { DateEventType } from "type";

interface AgendamentoItemListProps {
  index: number;
  agendamento: DateEventType;
}

export default function AgendamentoItemList({
  agendamento,
}: AgendamentoItemListProps) {
  const { orcamento } = useSelector((state: RootState) => state.orcamentosById);
  const dispatch = useDispatch<AppDispatch>();

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  return (
    <StyledPressable
      onPress={() => setDeleteModalIsOpen(true)}
      delayLongPress={5000}
      key={agendamento?.id}
      className="flex flex-col items-start justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative mt-2"
    >
      <StyledView className="flex-row justify-between font-semibold items-center overflow-hidden w-full">
        <StyledView className="flex-row justify-start items-start">
          <StyledView className="flex-row items-start text-center">
            <StyledText className="text-[13px] text-white font-semibold">
              {agendamento?.tipo}
            </StyledText>
          </StyledView>
        </StyledView>
        <StyledText className="text-[13px] text-white font-semibold">
          {agendamento.dataInicio
            ?  moment.utc(new Date(agendamento.dataInicio)).format("dd/MM/yyyy")
            : "Data inválida"}
        </StyledText>
      </StyledView>
      {
        <DeleteConfirmationModal
          visible={deleteModalIsOpen}
          entity="agendamento"
          onCancel={() => setDeleteModalIsOpen(false)}
          onConfirm={() => {
            dispatch(deleteDateOrcamentoByIdAsync(agendamento?.id));
            dispatch(fetchOrcamentoById(orcamento?.id));
            dispatch(fetchNotificationsList());
          }}
        />
      }
    </StyledPressable>
  );
}
