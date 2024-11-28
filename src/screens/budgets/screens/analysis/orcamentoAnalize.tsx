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
            {Number(receitaTotal?.total.toFixed(2)) / receitaTotal?.count
              ? formatCurrency({
                  amount: Number(
                    (
                      Number(receitaTotal?.total.toFixed(2)) /
                      receitaTotal?.count
                    ).toFixed(2)
                  ),
                  code: "BRL",
                })[0]
              : 0}
          </StyledText>
        </StyledView>
        <StyledView className="w-full flex flex-row justify-between items-center px-5">
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            {receitaTotal?.convidados / receitaTotal?.count
              ? (receitaTotal?.convidados / receitaTotal?.count).toFixed(0)
              : 0}{" "}
            pessoas em media
          </StyledText>
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            p/ pessoa:{" "}
            {receitaTotal?.total / receitaTotal?.convidados
              ? formatCurrency({
                  amount: Number(
                    (
                      Number(receitaTotal?.total.toFixed(2)) /
                      receitaTotal?.convidados
                    ).toFixed(2)
                  ),
                  code: "BRL",
                })[0]
              : 0}
          </StyledText>
        </StyledView>
        <StyledText className="text-custom-white font-semibold text-[12px] text-center py-5">
          Taxa de conversao{" "}
          {totalAprovadoReceita?.count / receitaTotal?.count
            ? Number(
                (totalAprovadoReceita?.count / receitaTotal?.count) * 100
              ).toFixed(1)
            : 0}
          %
        </StyledText>
      </StyledView>
    </StyledView>
  );
}
