export function calcHorasExtras(diaria: number) {
  if (diaria) {
    const valorHoraExtra = diaria / 8;
    return valorHoraExtra;
  }
  return 0;
}
