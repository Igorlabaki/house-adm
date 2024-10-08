export function calcDiaria(
  tipo: string,
  month: string,
  convidados: number,
  ppessoaValue: number,
) {
  if (tipo === "Festa") {
    let result = 0;

    if(convidados < 25){

      if(month === "12"){

        return 3750
      }

      return 2500
    }else{
      if(month === "12"){
        const pessoasMais25 = convidados  * 150

        return pessoasMais25
      }

      const pessoasMais25 = convidados * 100

      return pessoasMais25
    }
  }

  if (tipo === "Filmagem") {
    if(convidados < 15){
      return 1500
    }else{
      const pessoasMais25 = (convidados - 15) * 50

      return 1500 + pessoasMais25
    }
  }

  return 0
}
