import { View } from "react-native";
import { DateEventType } from "type";

import { StyledText, StyledView } from "styledComponents";

interface VisitaAnalizeProps {
  visitaNumber: DateEventType[];
}

export function VisitaAnalize({ visitaNumber }: VisitaAnalizeProps) {
  let countAprovado = 0;
  let countNaoAprovado = 0;
  return (
    <>
      <StyledText className="text-custom-white font-semibold text-[15px] text-center pt-8 pb-4">
        Visitas
      </StyledText>
      <StyledView className="flex flex-col justify-center items-start flex-1 px-7 w-full">
        <StyledText className="text-custom-white text-[13px] text-center mb-5 flex justify-center items-center w-full">
          Porcentagem de Visitas que Viraram Eventos
        </StyledText>
        <StyledView className="w-full bg-gray-500 relative rounded-lg flex-row overflow-hidden justify-start items-center">
          {visitaNumber &&
            visitaNumber?.map((item, index) => {
              if (item.orcamento.aprovadoCliente) {
                countAprovado += 1;
              } else {
                countNaoAprovado += 1;
              }
              return (
                <>
                  {/* @ts-ignore */}
                  <View key={item.id} style={{
                      width: `${Math.ceil(
                        (1 / visitaNumber?.length) * 100
                      ).toFixed(0)}%`,
                      height: 17,
                      backgroundColor: item.orcamento.aprovadoCliente
                        ? "#009E73"
                        : "#c56cf0",
                    }}
                  />
                </>
              );
            })}
          {/* @ts-ignore */}
          <View style={{
              width: `${Math.ceil(
                (1 / visitaNumber?.length) * countAprovado * 100
              ).toFixed(0)}%`,
              height: 17,
              backgroundColor: "transparent",
              position: "absolute",
              left: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StyledText className="text-custom-white font-semibold text-[12px]">
              {Math.floor(
                (1 / visitaNumber?.length) * countAprovado * 100
              ).toFixed(0)}
              %
            </StyledText>
          </View>
           {/* @ts-ignore */}
          <View style={{
              width: `${Math.ceil(
                (1 / visitaNumber?.length) * countNaoAprovado * 100
              ).toFixed(0)}%`,
              height: 17,
              backgroundColor: "transparent",
              position: "absolute",
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StyledText className="text-custom-white font-semibold text-[12px]">
              {Math.floor(
                (1 / visitaNumber?.length) * countNaoAprovado * 100
              ).toFixed(0)}
              %
            </StyledText>
          </View>
        </StyledView>
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
            {visitaNumber?.length} visitas
          </StyledText>
          {/*    <StyledText className="text-custom-white font-semibold text-[12px] text-center">
              {((countAprovado / visitaNumber?.length) * 100).toFixed(0)}%
            </StyledText> */}
        </StyledView>
      </StyledView>
    </>
  );
}
