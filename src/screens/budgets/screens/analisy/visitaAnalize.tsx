import { View } from "react-native";
import { StyledText, StyledView } from "styledComponents";
import { ListEmpty } from "@components/list/ListEmpty";
import { VisitCountResponse } from ".";

interface VisitaAnalizeProps {
  visitaNumber: VisitCountResponse;
}

export function VisitaAnalize({ visitaNumber }: VisitaAnalizeProps) {
  return (
    <>
      <StyledText className="text-custom-white font-semibold text-[15px] text-center pt-8 pb-4">
        Visitas
      </StyledText>
      {visitaNumber?.total && visitaNumber?.total > 0 ? (
        <StyledView className="flex flex-col justify-center items-start flex-1 px-7 w-full">
          <StyledText className="text-custom-white text-[13px] text-center mb-5 flex justify-center items-center w-full">
            Porcentagem de Visitas que Viraram Eventos
          </StyledText>
          <View
            style={{
              height: 17,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#6b7280",
              borderRadius: 40,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${visitaNumber.visitasQueViraramEvento.porcentagem}%`,
                height: 17,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#009E73",
              }}
            >
              <StyledText className="text-custom-white font-semibold">
                {visitaNumber.visitasQueViraramEvento.porcentagem.toFixed(0)}%
              </StyledText>
            </View>
            <View
              style={{
                width: `${visitaNumber.visitasQueNaoViraramEvento.porcentagem}%`,
                height: 17,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#c56cf0",
              }}
            >
              <StyledText className="text-custom-white font-semibold">
                {visitaNumber.visitasQueNaoViraramEvento.porcentagem.toFixed(0)}%
              </StyledText>
            </View>
          </View>
          <StyledView className="flex justify-center items-center gap-x-4 mt-3 flex-row w-full">
            <StyledView className="flex flex-row gap-x-1 mt-1 justify-center items-center">
              <StyledView className="h-[11px] w-[11px] bg-[#009E73] rounded-full" />
              <StyledText className="text-custom-white font-semibold  text-[12px]">
                Sim
              </StyledText>
            </StyledView>
            <StyledView className="flex flex-row gap-x-1 mt-1 justify-center items-center">
              <StyledView className="h-[11px] w-[11px] bg-[#c56cf0] rounded-full" />
              <StyledText className="text-custom-white font-semibold  text-[12px]">
                Nao
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledView className="flex w-full justify-center items-center flex-row px-5 mt-5">
            <StyledText className="text-custom-white font-semibold text-[12px] text-center">
              {visitaNumber?.total && visitaNumber?.total} visitas
            </StyledText>
          </StyledView>
        </StyledView>
      ) : (
        <ListEmpty dataType="visita" />
      )}
    </>
  );
}
