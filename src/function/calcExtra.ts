export function calcExtras(
  data: { limpeza: boolean; seguranca: boolean; recepcionista: boolean },
  limpezaValor: number,
  segurancaValor: number,
  recepcionistaValor: number,
) {
  let result = 0;
  if (data.limpeza) {
    result += limpezaValor;
  }
  if (data.seguranca) {
    result += segurancaValor;
  }
  if (data.recepcionista) {
    result += recepcionistaValor;
  }

  return result;
}
