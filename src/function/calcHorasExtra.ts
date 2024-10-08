export function calcHorasExtras(diaria: number) {
  if (diaria) {
    const valorHoraExtra = diaria / 7;
    return valorHoraExtra;
  }
  return 0;
}
