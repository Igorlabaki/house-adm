import { useState } from "react";
import InfoSection from "./infoSection";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@store/proposal/proposal-slice";
import { MenuOrcamentoModal } from "@components/list/menuOrcamentoModal";
import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
  StyledView,
} from "styledComponents";

export function ProposaInfoScreen() {
  const [optionModal, setOptionModal] = useState(false);

  return (
    <StyledView
      className="bg-gray-dark h-full w-full"
    >
      <StyledScrollView
        className="flex-1 bg-gray-dark relative pb-32"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <StyledPressable
          className="absolute top-5 right-5 z-50"
          onPress={() => {
            setOptionModal(true);
          }}
        >
          <AntDesign name="setting" size={16} color="white" />
        </StyledPressable>
        <InfoSection />
      </StyledScrollView>
      <MenuOrcamentoModal
        visible={optionModal}
        onCancel={() => setOptionModal(false)}
      />
    </StyledView>
  );
}

{
  /* 



<StyledView>
                <StyledText
                  className={`${
                    proposal.aprovadoCliente
                      ? "text-white font-semibold"
                      : "text-red-700 font-semibold"
                  }`}
                >
                  *
                  {proposal.aprovadoCliente
                    ? " Orcamento aprovado pelo cliente"
                    : "Orcamento nao aprovado pelo cliente"}
                </StyledText>
              </StyledView>*/
}
