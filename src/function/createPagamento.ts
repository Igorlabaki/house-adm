import { SERVER_URL } from "@env";
import { FormikErrors } from "formik";
import Toast from "react-native-simple-toast";
import { date } from "zod";

interface CriarPagamentoParams {
  value: string;
  orcamentoId: string;
  dataPagamento: string;
}
export async function criarPagamento(
  {dataPagamento,orcamentoId,value}: CriarPagamentoParams
) {
    const [day, month, year] = dataPagamento.split("/").map(Number);
  try {
    const response = await fetch(`${SERVER_URL}/pagamento/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: Number(value.replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")),
        dataPagamento: new Date(year, month - 1, day),
        orcamentoId: orcamentoId
      }),
    });

    // Lê o corpo da resposta em JSON
    const data = await response.json();
    if (response.ok) {
      Toast.show("Pagamento efetuado com sucesso.", 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
    } else {
      console.log(data.error)
      Toast.show(data.error, 3000, {
        backgroundColor: "#FF9494",
        textColor: "white",
      });
    }
  } catch (error) {
    console.error("Erro na requisição:", error.message);
    Toast.show("Erro ao conectar com o servidor.", 3000, {
      backgroundColor: "#FF9494",
      textColor: "white",
    });
  }
}
