import moment from 'moment';
import 'moment-timezone';

interface TransformDateParams {
  separador?: string;
  horarioFim: string;
  dataInicio: string;
  horarioInicio: string;
}

export function transformDate({
  separador,
  dataInicio,
  horarioFim,
  horarioInicio,
}: TransformDateParams) {
  const [ dayInicio, monthInicio,yearInicio] = dataInicio.split(separador || '/');
  const [hourInicio, minutesInicio] = horarioInicio.split(':');
  const [hourFim, minutesFim] = horarioFim.split(':');
 
  const dataInicial = moment.utc(
    `${yearInicio}-${monthInicio}-${dayInicio} ${hourInicio}:${minutesInicio}`,
    'YYYY-MM-DD HH:mm',
  );

  const dataFim = moment.utc(
    `${yearInicio}-${monthInicio}-${dayInicio} ${hourFim}:${minutesFim}`,
    'YYYY-MM-DD HH:mm',
  );

  return {
    dataFim: dataFim,
    dataInicial: dataInicial,
  };
}
