import { formatCurrency } from "react-native-format-currency";
import { MonthCount, OrcamentoPorMesList } from "./orcamentoPorMes";
import { StyledText, StyledView } from "styledComponents";

interface OrcamentoAnalizeProps {
  receitaTotal: MonthCount;
  orcamentoNumber: MonthCount[];
  totalAprovadoReceita: MonthCount;
}

export function OrcamentoAnalize({
    receitaTotal,
    orcamentoNumber,
    totalAprovadoReceita,
}: OrcamentoAnalizeProps) {
  return (
    <StyledView>
      <StyledText className="text-custom-white font-semibold text-[15px] text-center pt-8 pb-4">
        Orcamentos
      </StyledText>
      <OrcamentoPorMesList
        list={orcamentoNumber}
        receitaTotal={receitaTotal?.total}
      />
      <StyledView className="w-full">
        <StyledView className="w-full flex flex-row justify-between items-center px-5">
          <StyledText className="text-custom-white font-semibold text-[12px] text-center pb-1 pt-2">
            {receitaTotal?.count} orcamentos
          </StyledText>
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            p/ orcamento:{" "}
            {
              formatCurrency({
                amount: Number(
                  (
                    Number(receitaTotal?.total.toFixed(2)) / receitaTotal?.count
                  ).toFixed(2)
                ),
                code: "BRL",
              })[0]
            }
          </StyledText>
        </StyledView>
        <StyledView className="w-full flex flex-row justify-between items-center px-5">
          <StyledText className="text-custom-white font-semibold text-[12px] text-center py-1">
            Taxa de conversao {Number((totalAprovadoReceita?.count / receitaTotal?.count) * 100).toFixed(1)}%
          </StyledText>
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            p/ pessoa:{" "}
            {
              formatCurrency({
                amount: Number(
                  (
                    Number(receitaTotal?.total.toFixed(2)) / receitaTotal?.convidados
                  ).toFixed(2)
                ),
                code: "BRL",
              })[0]
            }
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );
}
