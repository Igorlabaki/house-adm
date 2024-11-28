import {
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledView,
} from "styledComponents";
import { captureAndShare } from "function/captureAnsShare";
import { SendModal } from "@components/list/sendModal";
import { orcamentoViaWhatsapp } from "function/orcamentoViaWhatsapp";
import ContratoFormModal from "../contratoForm";
import { orcamentoViaEmail } from "function/orcamentoViaEmail";
import { PagamentoFormComponent } from "../pagamento/pagamentoForm";
import { DateEventModalComponent } from "screens/calendar/screens/calendarSection/components/modal";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { BudgetForm } from "../../form/budgetForm";
import { BudgetModal } from "..";
import { Pagamento } from "type";
import { format } from "date-fns";
import { formatCurrency } from "react-native-format-currency";
import PagamentoInfo from "../pagamento/pagamentoInfo";
import PagamentoModal from "../pagamento";
import AgendamentoModal from "../agendamento";

interface OptionsComponentProps {
  onCancel: () => void;
}
export default function OptionsComponent({ onCancel }: OptionsComponentProps) {
  const [sendOrcamentoModal, setSendOrcamentoModal] = useState(false);
  const [contratoModalIsOpen, setContratoModalIsOpen] = useState(false);
  const [pagamentoModalIsOpen, setPagamentoModalIsOpen] = useState(false);
  const [orcamentoEditMode, setOrcamentoEditMode] = useState(false);
  const [calendarModalIsOpen, setCalendarModalIsOpen] = useState(false);

  const { orcamento } = useSelector((state: RootState) => state.orcamentosById);

  return (
    <StyledView className="w-full">
      <StyledPressable
        className="bg-gray-reg px-5  flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3"
        onPress={() => setOrcamentoEditMode(true)}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Editar orcamento
        </StyledText>
        <FontAwesome6 name="edit" size={18} color="white" />
      </StyledPressable>
      <StyledPressable
        className="bg-gray-reg px-5  flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3"
        onPress={() => captureAndShare(orcamento)}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Entrar em contato
        </StyledText>
        <Ionicons name="logo-whatsapp" size={20} color="white" />
      </StyledPressable>
      <StyledPressable
        className="bg-gray-reg  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center"
        onPress={() => setSendOrcamentoModal(true)}
      >
        <StyledText className="text-white font-bold text-start w-[130px] ">
          Enviar orcamento
        </StyledText>
        <FontAwesome6 name="money-check-dollar" size={18} color="white" />
      </StyledPressable>
      <StyledPressable
        className="bg-gray-reg   px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center"
        onPress={() => setContratoModalIsOpen(true)}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Enviar contrato
        </StyledText>
        <Ionicons name="document-text" size={20} color="white" />
      </StyledPressable>
      <StyledPressable
        className="bg-gray-reg  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center"
        onPress={() => setPagamentoModalIsOpen(true)}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Efetuar Pagamento
        </StyledText>
        <MaterialIcons name="attach-money" size={24} color="white" />
      </StyledPressable>
      <StyledPressable
        className="bg-gray-reg  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center"
        onPress={() => setCalendarModalIsOpen(true)}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Agendar Data
        </StyledText>
        <FontAwesome5 name="calendar-alt" size={18} color="white" />
      </StyledPressable>
      <StyledView className="w-full px-4">
        {pagamentoModalIsOpen && (
          <PagamentoModal
            pagamentoModalIsOpen={pagamentoModalIsOpen}
            setPagamentoModalIsOpen={setPagamentoModalIsOpen}
          />
        )}
      </StyledView>
      {sendOrcamentoModal && (
        <SendModal
          viaEmail={() => orcamentoViaEmail(orcamento)}
          viaWhatsapp={() => orcamentoViaWhatsapp(orcamento)}
          entity="orcamento"
          visible={sendOrcamentoModal}
          onCancel={() => setSendOrcamentoModal(false)}
        />
      )}
      {calendarModalIsOpen && (
       <AgendamentoModal   agendamentoModalIsOpen={calendarModalIsOpen} setAgendamentoModalIsOpen={setCalendarModalIsOpen}/>
      )}
      {contratoModalIsOpen && (
        <ContratoFormModal
          isModalOpen={contratoModalIsOpen}
          setIsModalOpen={setContratoModalIsOpen}
        />
      )}
      {orcamentoEditMode && (
        <BudgetModal
          isModalOpen={orcamentoEditMode}
          setIsEditModalOpen={setOrcamentoEditMode}
          type="UPDATE"
          setIsInfoModalOpen={onCancel}
        />
      )}
    </StyledView>
  );
}
