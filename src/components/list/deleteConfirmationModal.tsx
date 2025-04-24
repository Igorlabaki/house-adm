import React, { useState } from "react";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledView,
} from "styledComponents";

interface DeleteConfirmationProps {
  entity: string;
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal = ({entity,onCancel,onConfirm,visible}: DeleteConfirmationProps) => {
  return (
    <StyledModal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <StyledView className={"flex-1 justify-center items-center bg-black/80"}>
        <StyledView className={"w-4/5 bg-gray-900 rounded-lg p-6 items-center border-white border-[1px]"}>
          <StyledText className={"text-ms font-semibold text-custom-white text-center mb-8"}>
            Tem certeza que deseja deletar este {entity}?
          </StyledText>
          <StyledView className={"flex-row justify-around w-full "}>
            <StyledPressable
              className={"bg-gray-ligth py-2 px-10 rounded border-white border-[1px]"}
              onPress={() => onConfirm()}
            >
              <StyledText className={"text-white font-semibold text-center "}>
                Sim
              </StyledText>
            </StyledPressable>
            <StyledPressable
              className={"bg-gray-ligth py-2 px-10 rounded border-white border-[1px]"}
              onPress={onCancel}
            >
              <StyledText className={"text-white font-semibold text-center"}>
                Não
              </StyledText>
            </StyledPressable>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledModal>
  );
};
