import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import ContratoPessoaFisicaForm from "../form/contratoPessoaFisicaForm";
import ContratoPessoaJuridicaForm from "../form/contratoPessoaJuridicaForm";
import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledView,
} from "styledComponents";

interface ContratoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContratoFormModal({
  isModalOpen,
  setIsModalOpen,
}: ContratoModalProps) {
  const [formType, setFormType] = useState<"Pessoa Juridica" | "Pessoa Fisica">(
    "Pessoa Fisica"
  );
  
  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => {
        setIsModalOpen(false);
      }}
      animationType="fade"
    >
      <StyledScrollView
        className="flex-1 bg-gray-dark pb-16 "
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <StyledView className="px-5 pt-10 ">
          <StyledText className="font-semibold text-custom-gray text-[14px]">
            Qual o tipo de contrato?
          </StyledText>
          <StyledView className="flex flex-row pt-3 gap-x-3">
            <StyledView className="flex flex-row flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
            <StyledPressable
                className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                onPress={() => {
                  setFormType("Pessoa Fisica");
                }}
              >
                <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                  {formType === "Pessoa Fisica" && (
                    <Entypo name="check" size={12} color="white" />
                  )}
                </StyledView>
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Pessoa Fisica
                </StyledText>
              </StyledPressable>
              <StyledPressable
                className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                onPress={() => {
                  setFormType("Pessoa Juridica");
                }}
              >
                <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                  {formType === "Pessoa Juridica" && (
                    <Entypo name="check" size={12} color="white" />
                  )}
                </StyledView>
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Pessoa Juridica
                </StyledText>
              </StyledPressable>
            </StyledView>
          </StyledView>
        </StyledView>
        {formType === "Pessoa Fisica" ? (
          <ContratoPessoaFisicaForm />
        ) : (
          <ContratoPessoaJuridicaForm  />
        )}
      </StyledScrollView>
    </StyledModal>
  );
}

/*  */
