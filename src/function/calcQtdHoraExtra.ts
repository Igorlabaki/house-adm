export function calcQtdHoraExtra(mediaHoras: number, duracaoFesta: number) {
  const horasExtras = duracaoFesta > 7 ? duracaoFesta - 7 : 0;
  return horasExtras;
}
