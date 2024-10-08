import { ValueType } from "type";
import { calcExtras } from "./calcExtra";
import { calcDiaria } from "./calcDiaria";
import { transformDate } from "./transformData";
import { calcHorasExtras } from "./calcHorasExtra";
import { calcQtdHoraExtra } from "./calcQtdHoraExtra";
import { calcDuracaoFesta } from "./calcDuracaoFesta";

interface CalcTotalProps{
  data: {
    valor:string;
    titulo:string;
    limpeza: boolean;
    seguranca: boolean;
    convidados: number;
    dataInicio: string;
    horarioInicio: string;
    horarioFim: string;
    valueList: ValueType[];
    recepcionista: boolean;
  },
  separador?: string;
}

export function calcTotal({data: {valueList,limpeza,dataInicio,horarioInicio,horarioFim,seguranca,recepcionista,convidados},separador}: CalcTotalProps){
    const { dataFim, dataInicial } = transformDate({
        separador,
        dataInicio: dataInicio,
        horarioFim: horarioFim,
        horarioInicio: horarioInicio,
      });

      const final = new Date (dataFim.toDate())
      const inicial = new Date (dataInicial.toDate())  
    
      const duracaoFesta = calcDuracaoFesta(inicial, final);
    
      const dataExtra = valueList?.map((item: ValueType) => {
        return { titulo: item?.titulo, valor: item?.valor };
      });
    
      const extras = calcExtras(
        {
          limpeza:limpeza,
          recepcionista: recepcionista,
          seguranca: seguranca,
        },
        dataExtra.find((item: ValueType) => item?.titulo === "Limpeza")?.valor,
        dataExtra.find((item: ValueType) => item?.titulo === "Seguranca")
          ?.valor,
        dataExtra.find((item: ValueType) => item?.titulo === "Recepcionista")
          ?.valor
      );
    
      const [yearInicio, monthInicio, dayInicio] = dataInicio.split('-');
    
      const diaria = calcDiaria(
        "Festa",
        monthInicio,
        convidados,
        dataExtra.find((item: ValueType) => item.titulo === "Por Pessoa")?.valor
      );
    
      const qtdHorasExtras = calcQtdHoraExtra(duracaoFesta);
      const valorHoraExtra = calcHorasExtras(diaria);
      const total = diaria + extras + valorHoraExtra * qtdHorasExtras;

      return {
        total,
        final,
        diaria,
        inicial,
        qtdHorasExtras,
        valorHoraExtra,
      }
}
