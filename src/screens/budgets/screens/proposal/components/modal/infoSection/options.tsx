import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ProposalModal } from "..";
import { ProposalType } from "type";
import HistoryModal from "../history";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import ContratoFormModal from "../contratoForm";
import { SendModal } from "@components/list/sendModal";
import { useNavigation } from "@react-navigation/native";
import { captureAndShare } from "function/captureAnsShare";
import { proposalViaEmail } from "function/proposalViaEmail";
import { proposalViaWhatsapp } from "function/proposalViaWhatsapp";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { fecthContracts } from "@store/contract/contract-slice";
interface OptionsComponentProps {
  onCancel: () => void;
}

export default function OptionsComponent({ onCancel }: OptionsComponentProps) {
  const [proposalEditMode, setProposalEditMode] = useState(false);
  const [sendProposalModal, setSendProposalModal] = useState(false);
  const [historyModalIsOpen, setHistoryModalIsOpen] = useState(false);
  const [contratoModalIsOpen, setContratoModalIsOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.user.user);
  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );

  const organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );
  const contracts = useSelector(
    (state: RootState) => state.contractList.contract
  );

  const dispatch = useDispatch<AppDispatch>();
  const queryParams = new URLSearchParams();

  const navigation = useNavigation();

  useEffect(() => {
    queryParams.append("organizationId", organization?.id);
  }, [organization]);

  return (
    <StyledView className="w-full">
      <StyledPressable
        className="bg-gray-reg px-5  flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3"
        onPress={() => setProposalEditMode(true)}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Editar Orcamento
        </StyledText>
        <FontAwesome6 name="edit" size={18} color="white" />
      </StyledPressable>
      <StyledPressable
        className="bg-gray-reg px-5  flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3"
        onPress={() => setHistoryModalIsOpen(true)}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Ver Historico
        </StyledText>
        <FontAwesome name="history" size={18} color="white" />
      </StyledPressable>
      <StyledPressable
        className="bg-gray-reg px-5  flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3"
        onPress={() => captureAndShare(proposal)}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Entrar em contato
        </StyledText>
        <Ionicons name="logo-whatsapp" size={20} color="white" />
      </StyledPressable>
      <StyledPressable
        className="bg-gray-reg  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center"
        onPress={() => setSendProposalModal(true)}
      >
        <StyledText className="text-white font-bold text-start w-[130px] ">
          Enviar Orcamento
        </StyledText>
        <FontAwesome6 name="money-check-dollar" size={18} color="white" />
      </StyledPressable>
      <StyledPressable
        className="bg-gray-reg   px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center"
        onPress={async () => {
          await dispatch(fecthContracts(`${queryParams.toString()}`));
          setContratoModalIsOpen(true);
        }}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Enviar Contrato
        </StyledText>
        <Ionicons name="document-text" size={20} color="white" />
      </StyledPressable>
      <StyledPressable
        className="bg-gray-reg  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center"
        onPress={() => {
          onCancel();
          navigation.navigate("AgendamentoScreen");
        }}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Agendar Data
        </StyledText>
        <FontAwesome5 name="calendar-alt" size={18} color="white" />
      </StyledPressable>
      <StyledPressable
        disabled={proposal.approved ? false : true}
        className={`bg-gray-reg  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center first-letter 
          ${proposal.approved ? "opacity-100 " : "opacity-50"}
          `}
        onPress={() => {
          onCancel();
          navigation.navigate("PagamentoScreen");
        }}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Efetuar Pagamento
        </StyledText>
        <MaterialIcons name="attach-money" size={24} color="white" />
      </StyledPressable>
      <StyledPressable
        disabled={proposal.approved ? false : true}
        className={`bg-gray-reg  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center first-letter 
         ${proposal.approved ? "opacity-100 " : "opacity-50"}
         `}
        onPress={() => {
          onCancel();
          navigation.navigate("PersonListScreen");
        }}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Lista de Presenca
        </StyledText>
        <FontAwesome5 name="user-friends" size={15} color="white" />
      </StyledPressable>
      <StyledPressable
        disabled={proposal.approved ? false : true}
        className={`bg-gray-reg  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center first-letter 
          ${proposal.approved ? "opacity-100 " : "opacity-50"}
          `}
        onPress={() => {
          onCancel();
          navigation.navigate("ScheduleScreen");
        }}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Programacao
        </StyledText>
        <MaterialIcons name="schedule" size={24} color="white" />
      </StyledPressable>
      <StyledPressable
        disabled={proposal.approved ? false : true}
        className={`bg-gray-reg  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center first-letter 
          ${proposal.approved ? "opacity-100 " : "opacity-50"}
          `}
        onPress={() => {
          onCancel();
          navigation.navigate("DocumentScreen");
        }}
      >
        <StyledText className="text-white font-bold text-start w-[130px]">
          Documentos
        </StyledText>
        <Ionicons name="documents-outline" size={20} color="white" />
      </StyledPressable>
      {sendProposalModal && (
        <SendModal
          viaEmail={() =>
            proposalViaEmail({
              userId: user.id,
              username: user.username,
              proposalId: proposal.id,
              clientName: proposal.name,
              clientEmail: proposal.email,
            })
          }
          viaWhatsapp={() => proposalViaWhatsapp(proposal)}
          entity="proposal"
          visible={sendProposalModal}
          onCancel={() => setSendProposalModal(false)}
        />
      )}
      {historyModalIsOpen && (
        <HistoryModal
          isModalOpen={historyModalIsOpen}
          setModalIsOpen={setHistoryModalIsOpen}
        />
      )}
      {contratoModalIsOpen && (
        <ContratoFormModal
          isModalOpen={contratoModalIsOpen}
          setIsModalOpen={setContratoModalIsOpen}
        />
      )}
      {proposalEditMode && (
        <ProposalModal
          isModalOpen={proposalEditMode}
          setIsEditModalOpen={setProposalEditMode}
          type="UPDATE"
          setIsInfoModalOpen={onCancel}
        />
      )}
    </StyledView>
  );
}
