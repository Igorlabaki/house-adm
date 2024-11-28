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
import { TrafegoAnalize } from "./trafegoAnalize";
import Despesas from "./despesas";
import { ActivityIndicator, RefreshControl } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { fetchAnaliseData } from "function/fetchAnalise";

export interface DespesaEsporadica {
  descricao: string;
  total: number;
}

export interface DespesaRecorrente {
  descricao: string;
  mensal: number;
  anual: number;
}

export interface AnaliseDespesa {
  recorrentes: DespesaRecorrente[];
  esporadicos: DespesaEsporadica[];
  total: {
    mensal: number;
    anual: number;
    esporadico: number;
  };
}

interface MonthResponse {
  total: MonthCount[];
  aprovados: MonthCount[];
}
export interface VisitCountResponse {
  visitasQueViraramEvento: {
    qtd: number;
    porcentagem: number;
  };
  visitasQueNaoViraramEvento: {
    qtd: number;
    porcentagem: number;
  };
  total: number;
}
export interface TrafegoCount {
  todos: number;
  sortedSources: { name: string; value: number }[];
}

export function AnalysiScreen() {
  const [refreshpage, setRefreshpage] = useState<number>(0);
  const [data, setTrafegoCount] = useState<TrafegoCount | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [year, setYear] = useState<any>(new Date().getFullYear());
  const [dataMonth, setDataMonth] = useState<MonthResponse | null>(null);
  const [visitaData, setVisitaData] = useState<VisitCountResponse | null>(null);
  const [despesaAnalize, setDespesaAnalize] = useState<AnaliseDespesa | null>(
    null
  );

  const queryParams = new URLSearchParams();
  const visitaQueryParams = new URLSearchParams();

  useEffect(() => {
    setLoadingData(true);
    queryParams.append("year", year);

    visitaQueryParams.append("year", year);
    visitaQueryParams.append("tipo", "visita");

    fetchAnaliseData({
      queryParams: queryParams,
      setLoading: setLoadingData,
      visitaQueryParams: visitaQueryParams,
      setTrafegoCount: setTrafegoCount,
      setDataMonth: setDataMonth,
      setDespesaAnalise: setDespesaAnalize,
      setVisitaData: setVisitaData,
    });
  }, [year, refreshpage]);

  const totalReceita = dataMonth?.total?.find((item) =>
    item.month.includes("Total")
  );

  const totalAprovadoReceita = dataMonth?.aprovados?.find((item) =>
    item.month.includes("Total")
  );

  return (
    <StyledScrollView
      className="bg-gray-dark"
      refreshControl={
        <RefreshControl
          refreshing={loadingData}
          onRefresh={() =>
            fetchAnaliseData({
              queryParams: queryParams,
              setLoading: setLoadingData,
              visitaQueryParams: visitaQueryParams,
              setTrafegoCount: setTrafegoCount,
              setDataMonth: setDataMonth,
              setDespesaAnalise: setDespesaAnalize,
              setVisitaData: setVisitaData,
            })
          }
        />
      }
    >
      <StyledView className="flex px-5  flex-col h-full justify-center items-center w-full gap-y-2">
        <StyledView className="pt-10 flex flex-row justify-center items-center gap-x-4">
          <StyledPressable onPress={() => setYear((year) => year - 1)}>
            <AntDesign name="left" size={10} color="white" />
          </StyledPressable>
          <StyledText className="text-lg text-white  text-center">
            {year}
          </StyledText>
          <StyledPressable
            className="text-lg text-white  text-center"
            onPress={() => setYear((year) => year + 1)}
          >
            <AntDesign name="right" size={10} color="white" />
          </StyledPressable>
        </StyledView>
        {loadingData ? (
          <StyledView className="flex  justify-center items-center mt">
            <ActivityIndicator size="large" color="white" />
            <StyledText className="text-white">Loading</StyledText>
          </StyledView>
        ) : (
          <>
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
            <Despesas despesaAnalize={despesaAnalize} />
            <VisitaAnalize visitaNumber={visitaData} />
            <TrafegoAnalize trafegoNumber={data} />
          </>
        )}
      </StyledView>
    </StyledScrollView>
  );
}
