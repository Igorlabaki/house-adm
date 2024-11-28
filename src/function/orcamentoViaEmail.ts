import { SERVER_URL } from "@env";
import { BugdetType } from "type";
import Toast from "react-native-simple-toast";

export const orcamentoViaEmail = async (budget?: BugdetType) => {
    console.log("Enviando e-mail de orçamento...");
    try {
      const response = await fetch(`${SERVER_URL}/email/orcamento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: budget?.email,
          nome: budget?.nome,
          orcamentoId: budget?.id,
        }),
      });
  
      // Lê o corpo da resposta em JSON
      const data = await response.json();
  
      if (response.ok) {
        console.log("Resposta do servidor:", data);
        Toast.show("Email enviado com sucesso.", 3000, {
          backgroundColor: "rgb(75,181,67)",
          textColor: "white",
        });
      } else {
        console.error("Erro no envio de e-mail:", data);
        Toast.show("Erro ao enviar o e-mail.", 3000, {
          backgroundColor: "#FF9494",
          textColor: "white",
        });
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      Toast.show("Erro ao conectar com o servidor.", 3000, {
        backgroundColor: "#FF9494",
        textColor: "white",
      });
    }
  };