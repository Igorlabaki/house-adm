import { View } from "react-native";
import { filterColor } from "const/filterColor";
import { capitalize } from "function/capitalize";
import { StyledText, StyledView } from "styledComponents";

interface TrafegoAnalizeProps {
  trafficSource: {all: number, sortedSources:{ name: string; count: number }[]};
}

export function TrafficSourceAnalysisCOmponent({ trafficSource}: TrafegoAnalizeProps) {
  return (
    <>
      <StyledView className="flex flex-col gap-x-3 flex-wrap items-center justify-center gap-y-2 w-full pb-5">
        {trafficSource?.sortedSources.map((source, index) => {
          if(source.name === "all"){
            return
          }

          const percentagem = trafficSource?.all
            ? `${((source.count / trafficSource?.all) * 100).toFixed(0)}%`
            : "";

          return (
            <StyledView
              className="w-full flex flex-row justify-between items-center"
              key={index}
            >
              <StyledText className="text-custom-white font-semibold w-[20%] text-[12px] ml-2">
                {capitalize(source.name) === "Other" ? "Outros" : capitalize(source.name) === "Friend" ? "Amigos"  : capitalize(source.name)}:
              </StyledText>
              <StyledView className="flex justify-start items-start flex-1 flex-row">
                <StyledView className="w-full bg-gray-500 rounded-lg flex-row overflow-hidden justify-start items-center">
                  {/* @ts-ignore */}
                  <View style={{
                      width: percentagem,
                      height: 17,
                      backgroundColor: filterColor.find(
                        (item) => item.nome === capitalize(source.name)
                      )?.color,

                      overflow: "hidden",
                    }}
                  />
                  <StyledText className="text-custom-white font-semibold text-[12px] ml-3">
                    {source?.count}
                  </StyledText>
                </StyledView>
              </StyledView>
              <StyledText className="text-custom-white text-right font-semibold flex justify-end items-center  text-[12px] w-[12%] mr-1">
                {percentagem
                  ? percentagem
                  : "0%"}
              </StyledText>
            </StyledView>
          );
        })}
      </StyledView>
    </>
  );
}
