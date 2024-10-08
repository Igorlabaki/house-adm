import { StyledText, StyledView } from "styledComponents";
import { MonthCount, OrcamentoPorMesList } from "./orcamentoPorMes";
import { formatCurrency } from "react-native-format-currency";
import { AnaliseDespesa } from ".";

interface EventoAnalizeProps {
  receitaTotal: MonthCount;
  eventoNumber: MonthCount[];
  despesaAnalize: AnaliseDespesa;
}

export function EventoAnalize({
  eventoNumber,
  receitaTotal,
  despesaAnalize,
}: EventoAnalizeProps) {
  return (
    <StyledView>
      <StyledView className="flex flex-col w-full gap-y-1">
        <StyledText className="text-custom-white font-semibold text-[15px] text-center pt-8 pb-4">
          Eventos
        </StyledText>
        <OrcamentoPorMesList
          list={eventoNumber}
          receitaTotal={receitaTotal?.total}
        />
      </StyledView>
      <StyledView className="flex justify-center items-center flex-col gap-x-2 gap-y-2 mt-3">
        <StyledView className="flex w-full justify-between flex-row px-5">
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            {receitaTotal?.count} eventos
          </StyledText>
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            p/ evento:{" "}
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
        <StyledView className="flex w-full justify-between flex-row px-5">
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            {(receitaTotal?.convidados / receitaTotal?.count).toFixed(0)}{" "}
            pessoas em media
          </StyledText>

          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            p/ pessoa:{" "}
            {
              formatCurrency({
                amount: Number(
                  (receitaTotal?.total / receitaTotal?.convidados).toFixed(2)
                ),
                code: "BRL",
              })[0]
            }{" "}
          </StyledText>
        </StyledView>
        <StyledView className="flex w-full justify-between flex-row px-5">
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            {`Receita Bruta : ${
              formatCurrency({
                amount: Number(receitaTotal?.total.toFixed(2)),
                code: "BRL",
              })[0]
            }`}
          </StyledText>
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            {`Despesa anual : ${
              formatCurrency({
                amount: Number(despesaAnalize?.total?.anual.toFixed(2)),
                code: "BRL",
              })[0]
            }`}
          </StyledText>
        </StyledView>
        <StyledText className="text-custom-white font-semibold text-[12px] text-center pt-3">
            {`Receita liquida : ${
              formatCurrency({
                amount: Number((receitaTotal?.total - despesaAnalize?.total?.anual).toFixed(2)),
                code: "BRL",
              })[0]
            }`}
          </StyledText>
      </StyledView>
    </StyledView>
  );
}

{
  /* <StyledView className="my-3 flex-col justify-center items-center">
            <StyledView className="flex-row flex-wrap gap-x-2 justify-center items-center">
              {filterColor?.map((item, index) => {
                return (
                  <StyledView
                    key={index}
                    className="flex flex-row gap-x-1 mt-1 justify-center items-center"
                  >
                    <View
                      style={{
                        backgroundColor: item.color,
                        width: 10,
                        height: 10,
                        borderRadius: 40,
                      }}
                    />
                    <StyledText className="text-[12px] text-white">
                      {item.nome}
                    </StyledText>
                  </StyledView>
                );
              })}
            </StyledView>
          </StyledView> */
}
