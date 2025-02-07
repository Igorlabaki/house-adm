import { filterColor } from "const/filterColor";
import { capitalize } from "function/capitalize";
import { StyledText, StyledView } from "styledComponents";
import { TrafegoCount } from ".";
import { useEffect, useState } from "react";
import { View } from "react-native";

interface TrafegoAnalizeProps {
  trafegoNumber: {todos: number, sortedSources:{ name: string; value: number }[]};
}

export function TrafegoAnalize({ trafegoNumber}: TrafegoAnalizeProps) {
  return (
    <>
      <StyledText className="text-custom-white font-semibold text-[15px] text-center pt-8 pb-4">
        Trafego Pago
      </StyledText>
      <StyledView className="flex flex-col gap-x-3 flex-wrap items-center justify-center py-3 gap-y-2 w-full">
        {trafegoNumber?.sortedSources.map((source, index) => {
          if (source.name === "todos") {
            return null;
          }
          const percentagem = trafegoNumber?.todos
            ? `${((source.value / trafegoNumber?.todos) * 100).toFixed(0)}%`
            : "";

          return (
            <StyledView
              className="w-full flex flex-row justify-between items-center"
              key={index}
            >
              <StyledText className="text-custom-white font-semibold w-[20%] text-[12px]">
                {capitalize(source.name)}:
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
                    {source?.value}
                  </StyledText>
                </StyledView>
              </StyledView>
              <StyledText className="text-custom-white text-right font-semibold flex justify-end items-center  text-[12px] w-[12%]">
                {percentagem}
              </StyledText>
            </StyledView>
          );
        })}
      </StyledView>
    </>
  );
}
