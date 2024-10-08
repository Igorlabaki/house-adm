
import { useEffect, useState } from "react";
import {
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledView,
} from "styledComponents";

import { DateEventType } from "type";
import { MonthCount } from "./orcamentoPorMes";
import { OrcamentoAnalize } from "./orcamentoAnalize";
import { EventoAnalize } from "./eventoAnalize";
import { VisitaAnalize } from "./visitaAnalize";
import { TrafegoAnalize} from "./trafegoAnalize";
import Despesas from "./despesas";

export interface DespesaEsporadica  {
  descricao: string;
  total: number;
};

export interface DespesaRecorrente  {
  descricao: string;
  mensal: number;
  anual: number;
};

export interface AnaliseDespesa  {
  recorrentes: DespesaRecorrente[];
  esporadicos: DespesaEsporadica[];
  total: {
    mensal: number;
    anual: number;
    esporadico: number;
  };
};

interface MonthResponse {
  total: MonthCount[];
  aprovados: MonthCount[];
}
export interface TrafegoCount {
  todos: number,
  sortedSources:{ name: string; value: number }[]
} 

export function AnalysiScreen() {
  const [data, setData] = useState< TrafegoCount| null>(null);
  const [year, setYear] = useState<any>(new Date().getFullYear());
  const [dataMonth, setDataMonth] = useState<MonthResponse | null>(null);
  const [visitaData, setVisitaData] = useState<DateEventType[] | null>(null);
  const [despesaAnalize, setDespesaAnalize] = useState<AnaliseDespesa | null>(null);

  const queryParams = new URLSearchParams();

  useEffect(() => {
    queryParams.append("year", year);
    const fetchData = async () => {
      try {
        const [visitaCountResponse, monthCountResponse, trafegoCountResponse, despesaCountResponse] =
          await Promise.all([
            fetch(`https://art56-server-v2.vercel.app/dateEvent/list/visita`),
            fetch(
              `https://art56-server-v2.vercel.app/orcamento/getMonthCount?${queryParams.toString()}`
            ),
            fetch(
              `https://art56-server-v2.vercel.app/orcamento/getTrafegoCount?${queryParams.toString()}`
            ),
            fetch(
              `https://art56-server-v2.vercel.app/despesa/getAnalize`
            ),
          ]);

        const monthCount: MonthResponse = await monthCountResponse.json();
        const trafegoCount: TrafegoCount = await trafegoCountResponse.json();
        const visitaCount: DateEventType[] = await visitaCountResponse.json();
        const despesaCount : AnaliseDespesa = await despesaCountResponse.json();

        setData(trafegoCount);
        setDataMonth(monthCount);
        setVisitaData(visitaCount);
        setDespesaAnalize(despesaCount);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, [year]);

  const totalReceita = dataMonth?.total?.find((item) =>
    item.month.includes("Total")
  );
 
  const totalAprovadoReceita = dataMonth?.aprovados?.find((item) =>
    item.month.includes("Total")
  );

  return (
    <StyledScrollView className="bg-gray-dark ">
      <StyledView className="flex-1 px-5 flex flex-col h-full justify-center items-center w-full gap-y-4">
        <StyledView className="pt-4 flex flex-row justify-center items-center gap-x-4">
          <StyledPressable onPress={() => setYear((year) => year - 1)}>
            <StyledText className="text-[30px] text-white  text-center">
              -
            </StyledText>
          </StyledPressable>
          <StyledText className="text-lg text-white  text-center">
            {year}
          </StyledText>
          <StyledPressable
            className="text-lg text-white  text-center"
            onPress={() => setYear((year) => year + 1)}
          >
            <StyledText className="text-lg text-white  text-center">
              +
            </StyledText>
          </StyledPressable>
        </StyledView>
        <OrcamentoAnalize
          orcamentoNumber={dataMonth?.total}
          totalAprovadoReceita={totalAprovadoReceita}
          receitaTotal={totalReceita}
        />
        <EventoAnalize
          eventoNumber={dataMonth?.aprovados}
          receitaTotal={totalAprovadoReceita}
          despesaAnalize={despesaAnalize}
        />
        <Despesas despesaAnalize={despesaAnalize}/>
        <VisitaAnalize visitaNumber={visitaData} />
        <TrafegoAnalize trafegoNumber={data}/>
      </StyledView>
    </StyledScrollView>
  );
}
