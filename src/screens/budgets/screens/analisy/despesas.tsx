import { View } from "react-native";
import { AnaliseDespesa } from ".";
import { StyledText, StyledView } from "styledComponents";
import { formatCurrency } from "react-native-format-currency";
import { ListEmpty } from "@components/list/ListEmpty";

interface DespesasProps {
  despesaAnalize: AnaliseDespesa;
}

export default function Despesas({ despesaAnalize }: DespesasProps) {
  return (
    <View>
      <StyledText className="text-custom-white font-semibold text-[15px] text-center pt-8 pb-4">
        Despesas Recorrentes
      </StyledText>
      <StyledView className="flex flex-col gap-x-3 flex-wrap items-center justify-center py-2 gap-y-2 w-full">
        <StyledText className="text-custom-white text-[13px] text-center pb-2">
          Anual
        </StyledText>
        <StyledView className="flex flex-col gap-2">
          {despesaAnalize?.recorrentes?.map((source, index) => {
            const percentagem = `${(
              (source?.anual / despesaAnalize?.total?.anual) *
              100
            ).toFixed(0)}%`;
            return (
              <StyledView
                className="w-full flex flex-row justify-between items-center"
                key={index}
              >
                <StyledText className="text-custom-white font-semibold w-[20%] text-[12px]">
                  {source?.descricao}
                </StyledText>
                <StyledView className="flex justify-start items-start flex-1 flex-row">
                  <StyledView className="w-full bg-gray-500 rounded-lg flex-row overflow-hidden justify-start items-center">
                    {/* @ts-ignore */}
                    <View style={{
                        width: percentagem,
                        height: 17,
                        backgroundColor: "#54a0ff",
                        overflow: "hidden",
                      }}
                    />
                    <StyledText className="text-custom-white font-semibold text-[12px] ml-3">
                      {
                        formatCurrency({
                          amount: Number(source?.anual?.toFixed(2)),
                          code: "BRL",
                        })[0]
                      }
                    </StyledText>
                  </StyledView>
                </StyledView>
                <StyledText className="text-custom-white text-right font-semibold flex justify-end items-center  text-[12px] w-[12%]">
                  {percentagem}
                </StyledText>
              </StyledView>
            );
          })}
          <StyledText className="text-custom-white font-semibold text-[12px] text-center pb-1 pt-2">
            {
              formatCurrency({
                amount: Number(despesaAnalize?.total?.anual.toFixed(2)),
                code: "BRL",
              })[0]
            }
          </StyledText>
        </StyledView>
        <StyledText className="text-custom-white text-[13px] text-center pb-2 pt-4">
          Mensal
        </StyledText>
        {despesaAnalize?.recorrentes?.map((source, index) => {
          const percentagem = `${(
            (source?.mensal / despesaAnalize?.total?.mensal) *
            100
          ).toFixed(0)}%`;
          return (
            <StyledView
              className="w-full flex flex-row justify-between items-center"
              key={index}
            >
              <StyledText className="text-custom-white font-semibold w-[20%] text-[12px]">
                {source?.descricao}
              </StyledText>
              <StyledView className="flex justify-start items-start flex-1 flex-row">
                <StyledView className="w-full bg-gray-500 rounded-lg flex-row overflow-hidden justify-start items-center">
                  {/* @ts-ignore */}
                  <View style={{
                      width: percentagem,
                      height: 17,
                      backgroundColor: "#54a0ff",
                      overflow: "hidden",
                    }}
                  />
                  <StyledText className="text-custom-white font-semibold text-[12px] ml-3">
                    {
                      formatCurrency({
                        amount: Number(source?.mensal.toFixed(2)),
                        code: "BRL",
                      })[0]
                    }
                  </StyledText>
                </StyledView>
              </StyledView>
              <StyledText className="text-custom-white text-right font-semibold flex justify-end items-center  text-[12px] w-[12%]">
                {percentagem}
              </StyledText>
            </StyledView>
          );
        })}
        <StyledText className="text-custom-white font-semibold text-[12px] text-center pb-1 pt-2">
          {
            formatCurrency({
              amount: Number(despesaAnalize?.total?.mensal.toFixed(2)),
              code: "BRL",
            })[0]
          }
        </StyledText>
        <StyledText className="text-custom-white font-semibold text-[15px] text-center pt-8 pb-4">
          Despesas N/ Recorrentes
        </StyledText>
        {despesaAnalize?.esporadicos?.length > 0 ? (
          <StyledView className="flex flex-col gap-x-3 flex-wrap items-center justify-center py-2 gap-y-2 w-full">
            <StyledText className="text-custom-white text-[13px] text-center pb-2">
              Anual
            </StyledText>
            <StyledView className="flex flex-col gap-2">
              {despesaAnalize?.esporadicos?.map((source, index) => {
                const percentagem = `${(
                  (source?.total / despesaAnalize?.total?.esporadico) *
                  100
                ).toFixed(0)}%`;
                return (
                  <StyledView
                    className="w-full flex flex-row justify-between items-center"
                    key={index}
                  >
                    <StyledText className="text-custom-white font-semibold w-[20%] text-[12px]">
                      {source?.descricao}
                    </StyledText>
                    <StyledView className="flex justify-start items-start flex-1 flex-row">
                      <StyledView className="w-full bg-gray-500 rounded-lg flex-row overflow-hidden justify-start items-center">
                        {/* @ts-ignore */}
                        <View style={{
                            width: percentagem,
                            height: 17,
                            backgroundColor: "#54a0ff",
                            overflow: "hidden",
                          }}
                        />
                        <StyledText className="text-custom-white font-semibold text-[12px] ml-3">
                          {
                            formatCurrency({
                              amount: Number(source?.total?.toFixed(2)),
                              code: "BRL",
                            })[0]
                          }
                        </StyledText>
                      </StyledView>
                    </StyledView>
                    <StyledText className="text-custom-white text-right font-semibold flex justify-end items-center  text-[12px] w-[12%]">
                      {percentagem}
                    </StyledText>
                  </StyledView>
                );
              })}
              <StyledText className="text-custom-white font-semibold text-[12px] text-center pb-1 pt-2">
                {
                  formatCurrency({
                    amount: Number(
                      despesaAnalize?.total?.esporadico.toFixed(2)
                    ),
                    code: "BRL",
                  })[0]
                }
              </StyledText>
            </StyledView>
          </StyledView>
        ) : (
          <StyledView >
            <StyledText className="text-custom-gray">
              No register yet
            </StyledText>
          </StyledView>
        )}
      </StyledView>
    </View>
  );
}
