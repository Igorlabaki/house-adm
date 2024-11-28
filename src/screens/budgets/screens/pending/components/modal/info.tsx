import { useEffect, useState } from "react";
import { BudgetModal } from ".";
import { BugdetType } from "type";
import InfoSection from "./infoSection";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
} from "styledComponents";
import { MenuOrcamentoModal } from "@components/list/menuOrcamentoModal";
import { getOrcamentoByIdAsync } from "@store/budget/bugetSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { fetchOrcamentoById } from "@store/orcamento/orcamentoSlice";
interface BudgetModalProps {
  budget?: BugdetType;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BudgetInfoModal({
  isModalOpen,
  setIsModalOpen,
  budget,
}: BudgetModalProps) {
  const [editmodal, setEditmodal] = useState(false);
  const [optionModal, setOptionModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (budget?.id) {
      dispatch(fetchOrcamentoById(budget.id));
    }
  }, [budget?.id]);

  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => {
        setIsModalOpen(false);
      }}
      animationType="fade"
      className="bg-white"
    >
      <StyledScrollView
        className="flex-1 bg-gray-dark pt-10 relative pb-32"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <StyledPressable
          className="absolute top-0 right-5 z-50"
          onPress={() => {
            setOptionModal(true);
          }}
        >
          <Entypo name="menu" size={24} color="white" />
        </StyledPressable>
        <InfoSection />
      </StyledScrollView>
      {optionModal && (
        <MenuOrcamentoModal
          visible={optionModal}
          onCancel={() => setOptionModal(false)}
        />
      )}
    </StyledModal>
  );
}

{
  /* 



<StyledView>
                <StyledText
                  className={`${
                    budget.aprovadoCliente
                      ? "text-white font-semibold"
                      : "text-red-700 font-semibold"
                  }`}
                >
                  *
                  {budget.aprovadoCliente
                    ? " Orcamento aprovado pelo cliente"
                    : "Orcamento nao aprovado pelo cliente"}
                </StyledText>
              </StyledView>*/
}
