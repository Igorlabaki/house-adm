import { RootState } from "@store/index";
import React from "react";
import { useSelector } from "react-redux";
import { StyledText, StyledView } from "styledComponents";
import { BugdetType } from "type";


export default function InfoPessoais() {

  const {orcamento} = useSelector((state: RootState) => state.orcamentosById);

  return (
    <StyledView className="flex justify-start items-center w-full mt-5">
      <StyledText className="md:text-[21px] w-full  text-[18px] text-center py-5  text-white font-semibold">
        Informacoes Pessoais
      </StyledText>
      <StyledView className="w-[70%] flex-row justify-between items-center mx-auto">
        <StyledText className="text-[13px] text-white  font-semibold">
          Nome :
        </StyledText>
        <StyledText className="text-[13px] text-white  font-semibold">
          {orcamento?.nome}
        </StyledText>
      </StyledView>
      <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
        <StyledText className="text-[13px] text-white  font-semibold">
          Email :
        </StyledText>
        <StyledText className="text-[13px] text-white  font-semibold">
          {orcamento?.email}
        </StyledText>
      </StyledView>
      <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
        <StyledText className="text-[13px] text-white  font-semibold">
          Whatsapp :
        </StyledText>
        <StyledText className="text-[13px] text-white  font-semibold">
          {orcamento?.telefone}
        </StyledText>
      </StyledView>
      <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
        <StyledText className="text-[13px] text-white  font-semibold">
          Ja conhece o espaco :
        </StyledText>
        <StyledText className="text-[13px] text-white  font-semibold">
          {orcamento?.conheceEspaco ? "Sim" : "Nao"}
        </StyledText>
      </StyledView>
      <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
        <StyledText className="text-[13px] text-white  font-semibold">
          Por onde nos conheceu :
        </StyledText>
        <StyledText className="text-[13px] text-white  font-semibold">
          {orcamento?.trafegoCanal}
        </StyledText>
      </StyledView>
    </StyledView>
  );
}
