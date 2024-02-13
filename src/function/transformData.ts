import moment from 'moment';
import 'moment-timezone';

interface TransformDateParams {
  separador?: string;
  horarioFim: string;
  dataInicio: string;
  horarioInicio: string;
}

export function transformDate({
  dataInicio,
  horarioFim,
  horarioInicio,
  separador,
}: TransformDateParams) {
  const [yearInicio, monthInicio, dayInicio] = dataInicio.split(separador || '-');
  const [hourInicio, minutesInicio] = horarioInicio.split(':');
  const [hourFim, minutesFim] = horarioFim.split(':');

  const dataInicial = moment.utc(
    `${yearInicio}-${monthInicio}-${dayInicio} ${hourInicio}:${minutesInicio}`,
    'YYYY-MM-DD HH:mm',
  );

  console.log(dataInicial)
  const dataFim = moment.utc(
    `${yearInicio}-${monthInicio}-${dayInicio} ${hourFim}:${minutesFim}`,
    'YYYY-MM-DD HH:mm',
  );

  return {
    dataInicial: dataInicial.toISOString(),
    dataFim: dataFim.toISOString(),
  };
}
