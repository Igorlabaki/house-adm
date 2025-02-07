
import { StyledModal, StyledText, StyledView } from "styledComponents";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { ProposalType } from "type";
import { HistoryFlatList } from "./history-flat-list";

interface HistoryProps{
  isModalOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HistoryModal({setModalIsOpen,isModalOpen}:HistoryProps) {
  const  proposal : ProposalType = useSelector((state: RootState) => state.proposalList.proposal);
  
  return (
    <StyledModal
      animationType="fade"
      transparent={true}
      visible={isModalOpen}
      onRequestClose={() => setModalIsOpen(false)}
    >
      <StyledView className="bg-gray-dark h-full  py-16 px-3">
        <StyledText className="text-white font-bold  w-full text-center">
          Historico de atividades:
        </StyledText>
        <StyledView className="mt-5 flex flex-col">
            <HistoryFlatList />
        </StyledView>
      </StyledView>
    </StyledModal>
  );
}
