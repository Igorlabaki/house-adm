import { RootState } from "@store/index";
import React from "react";
import { useSelector } from "react-redux";
import { DateEventType } from "type";
import AgendamentoItemList from "./agendamentoItemList";
import { StyledText, StyledView } from "styledComponents";

export default function AgendamentoList() {
  const { orcamento } = useSelector((state: RootState) => state.orcamentosById);

  if (orcamento?.Data.length === 0) {
    return (
      <StyledView className="w-full justify-center items-center py-4">
        <StyledText  className="text-[13px] text-white font-light">Nao ha nenhuma data agendada</StyledText>
      </StyledView>
    );
  }

  return (
    <>
      {orcamento?.Data?.map((agendamento: DateEventType, index = 0) => {
        return (
          <AgendamentoItemList
            agendamento={agendamento}
            index={index}
            key={agendamento.id}
          />
        );
      })}
    </>
  );
}
