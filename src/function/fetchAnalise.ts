import { MonthCount } from "screens/budgets/screens/analysis/orcamentoPorMes";

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
  total: number
}
export interface TrafegoCount {
  todos: number;
  sortedSources: { name: string; value: number }[];
}


interface fetchAnaliseDataProps {
  queryParams:URLSearchParams;
  visitaQueryParams:URLSearchParams;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDataMonth: React.Dispatch<React.SetStateAction<MonthResponse>>;
  setTrafegoCount: React.Dispatch<React.SetStateAction<TrafegoCount>>;
  setVisitaData: React.Dispatch<React.SetStateAction<VisitCountResponse>>;
  setDespesaAnalise: React.Dispatch<React.SetStateAction<AnaliseDespesa>>;
}

export const fetchAnaliseData = async ({setLoading,queryParams,visitaQueryParams,setDataMonth,setDespesaAnalise,setTrafegoCount,setVisitaData}:fetchAnaliseDataProps) => {
  try {
    const [
      visitaCountResponse,
      monthCountResponse,
      trafegoCountResponse,
      despesaCountResponse,
    ] = await Promise.all([
      fetch(
        `https://art56-server-v2.vercel.app/dateEvent/getVisitCount?${visitaQueryParams.toString()}`
      ),
      fetch(
        `https://art56-server-v2.vercel.app/orcamento/getMonthCount?${queryParams.toString()}`
      ),
      fetch(
        `https://art56-server-v2.vercel.app/orcamento/getTrafegoCount?${queryParams.toString()}`
      ),
      fetch(
        `https://art56-server-v2.vercel.app/despesa/getAnalize?${queryParams.toString()}`
      ),
    ]);

    const monthCount: MonthResponse = await monthCountResponse.json();
    const trafegoCount: TrafegoCount = await trafegoCountResponse.json();
    const despesaCount: AnaliseDespesa = await despesaCountResponse.json();
    const visitaCount: VisitCountResponse = await visitaCountResponse.json();

    setDataMonth(monthCount)
    setVisitaData(visitaCount)
    setTrafegoCount(trafegoCount)
    setDespesaAnalise(despesaCount)
    
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
  }finally{
    setLoading(false);
  }
};
