import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import OptionsComponent from "screens/budgets/screens/pending/components/modal/infoSection/options";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledView,
} from "styledComponents";
import { BugdetType } from "type";

interface DeleteConfirmationProps {
  visible: boolean;
  onCancel: () => void;
}

export const MenuOrcamentoModal = ({onCancel,visible}: DeleteConfirmationProps) => {
  return (
    <StyledModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <StyledView className={"flex-1 justify-center items-center bg-black/20"}>
        <StyledView className={"w-4/5 bg-gray-dark rounded-lg p-6 items-center"}>
        <StyledPressable className="absolute top-2 right-2" onPress={onCancel}>
            <Ionicons name="close" size={16} color="white" />
          </StyledPressable>
          <OptionsComponent onCancel={onCancel}/>
        </StyledView>
      </StyledView>
    </StyledModal>
  );
};
