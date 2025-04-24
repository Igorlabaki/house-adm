import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Ionicons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable } from "react-native";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledView,
} from "styledComponents";


interface SendProps {
  visible: boolean;
  entity: string;
  onCancel: () => void;
  viaWhatsapp: () => void;
  viaEmail: () => void;
}

export const SendModal = ({
  onCancel,
  entity,
  visible,
  viaEmail,
  viaWhatsapp,
}: SendProps) => {
  return (
    <StyledModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <StyledView className={"flex-1 justify-center items-center bg-black/80"}>
        <StyledView
          className={"w-4/5 bg-gray-dark rounded-lg p-6 items-center  relative"}
        >
          <StyledPressable className="absolute top-2 right-2" onPress={onCancel}>
            <Ionicons name="close" size={16} color="white" />
          </StyledPressable>
          <StyledText
            className={
              "text-ms font-semibold text-custom-white text-center mb-8"
            }
          >
            Por onde deseja enviar o {entity}?
          </StyledText>
          <StyledView className={"flex-row justify-around w-full"}>
            <FontAwesome5
              name="whatsapp"
              size={42}
              color="#22c55e"
              onPress={() => viaWhatsapp()}
            />

            <Entypo
              name="email"
              size={42}
              color="#c8a2c8"
              onPress={() => viaEmail()}
            />
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledModal>
  );
};
