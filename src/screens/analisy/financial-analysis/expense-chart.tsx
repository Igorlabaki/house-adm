import { View } from "react-native";
import { StyledText, StyledView } from "styledComponents";
import { formatCurrency } from "react-native-format-currency";
import {
  ExpenseAnaliseType,
  ExpenseEsporadic,
  ExpenseRecurring,
} from "@store/expense/expenseSlice";

interface DespesasProps {
  expenseAnalise: {
    total: {
      monthly: number;
      annual: number;
      esporadic: number;
    };
    recurring: ExpenseRecurring[];
    esporadic: ExpenseEsporadic[];
  };
}

export default function ExpenseChartComponent({
  expenseAnalise,
}: DespesasProps) {
  return (
    <View>
      <StyledText className="text-custom-white font-semibold text-[15px] text-center pt-4 pb-4">
        Despesas Recorrentes
      </StyledText>
      <StyledView className="flex flex-col flex-wrap items-center justify-center py-2 gap-y-2 w-full">
        <StyledText className="text-custom-white text-[13px] text-center pb-2">
          Anual
        </StyledText>
        <StyledView className="flex flex-col gap-1">
          {expenseAnalise?.recurring?.map((source, index) => {
            const percentagem = `${(
              (source?.annual / expenseAnalise?.total.annual) *
              100
            )?.toFixed(0)}%`;
            return (
              <StyledView
                className="w-full flex flex-row justify-between items-center"
                key={index}
              >
                <StyledText className="text-custom-white font-semibold w-[20%] text-[12px]">
                  {source?.name}
                </StyledText>
                <StyledView className="flex justify-start items-start flex-1 flex-row">
                  <StyledView className="w-full bg-gray-500 rounded-lg flex-row overflow-hidden justify-start items-center">
                    {/* @ts-ignore */}
                    <View
                      style={{
                        width: percentagem,
                        height: 17,
                        backgroundColor: "#54a0ff",
                        overflow: "hidden",
                      }}
                    />
                    <StyledText className="text-custom-white font-semibold text-[12px] ml-3">
                      {
                        formatCurrency({
                          amount: Number(source?.annual?.toFixed(2)),
                          code: "BRL",
                        })[0]
                      }
                    </StyledText>
                  </StyledView>
                </StyledView>
                <StyledText className="text-custom-white text-right font-semibold flex justify-end items-center  text-[12px] w-[12%] mr-3">
                  {percentagem}
                </StyledText>
              </StyledView>
            );
          })}
          <StyledText className="text-custom-white font-semibold text-[12px] text-center pb-1 pt-2">
            {
              formatCurrency({
                amount: Number(expenseAnalise?.total.annual?.toFixed(2)),
                code: "BRL",
              })[0]
            }
          </StyledText>
        </StyledView>
        <StyledText className="text-custom-white text-[13px] text-center pb-2 pt-4">
          Mensal
        </StyledText>
        <StyledView className="flex flex-col gap-1">
          {expenseAnalise?.recurring?.map((source, index) => {
            const percentagem = `${(
              (source?.monthly / expenseAnalise?.total?.monthly) *
              100
            )?.toFixed(0)}%`;
            return (
              <StyledView
                className="w-full flex flex-row justify-between items-center"
                key={index}
              >
                <StyledText className="text-custom-white font-semibold w-[20%] text-[12px]">
                  {source?.name}
                </StyledText>
                <StyledView className="flex justify-start items-start flex-1 flex-row">
                  <StyledView className="w-full bg-gray-500 rounded-lg flex-row overflow-hidden justify-start items-center">
                    {/* @ts-ignore */}
                    <View
                      style={{
                        width: percentagem,
                        height: 17,
                        backgroundColor: "#54a0ff",
                        overflow: "hidden",
                      }}
                    />
                    <StyledText className="text-custom-white font-semibold text-[12px] ml-3">
                      {
                        formatCurrency({
                          amount: Number(source?.monthly?.toFixed(2)),
                          code: "BRL",
                        })[0]
                      }
                    </StyledText>
                  </StyledView>
                </StyledView>
                <StyledText className="text-custom-white text-right font-semibold flex justify-end items-center  text-[12px] w-[12%]  mr-3">
                  {percentagem}
                </StyledText>
              </StyledView>
            );
          })}
        </StyledView>
        <StyledText className="text-custom-white font-semibold text-[12px] text-center pb-1 pt-2">
          {
            formatCurrency({
              amount: Number(expenseAnalise?.total?.monthly?.toFixed(2)),
              code: "BRL",
            })[0]
          }
        </StyledText>
        <StyledText className="text-custom-white font-semibold text-[15px] text-center pt-4">
          Despesas esporadicas
        </StyledText>
        {expenseAnalise?.esporadic?.length > 0 ? (
          <StyledView className="flex flex-col flex-wrap items-center justify-center py-2 gap-y-2 w-full">
            <StyledText className="text-custom-white text-[13px] text-center">
              Anual
            </StyledText>
            <StyledView className="flex flex-col gap-1">
              {expenseAnalise?.esporadic?.map((source, index) => {
                const percentagem = `${(
                  (source?.total / expenseAnalise?.total?.esporadic) *
                  100
                ).toFixed(0)}%`;
                return (
                  <StyledView
                    className="w-full flex flex-row justify-between items-center"
                    key={index}
                  >
                    <StyledText className="text-custom-white font-semibold w-[20%] text-[12px]">
                      {source?.name}
                    </StyledText>
                    <StyledView className="flex justify-start items-start flex-1 flex-row">
                      <StyledView className="w-full bg-gray-500 rounded-lg flex-row overflow-hidden justify-start items-center">
                        {/* @ts-ignore */}
                        <View
                          style={{
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
                    <StyledText className="text-custom-white text-right font-semibold flex justify-end items-center  text-[12px] w-[12%] mr-3">
                      {percentagem}
                    </StyledText>
                  </StyledView>
                );
              })}
              <StyledText className="text-custom-white font-semibold text-[12px] text-center pb-1 pt-2">
                {
                  formatCurrency({
                    amount: Number(
                      expenseAnalise?.total?.esporadic?.toFixed(2)
                    ),
                    code: "BRL",
                  })[0]
                }
              </StyledText>
            </StyledView>
          </StyledView>
        ) : (
          <StyledView>
            <StyledText className="text-custom-gray">
              Nao despesas registradas
            </StyledText>
          </StyledView>
        )}
      </StyledView>
    </View>
  );
}
