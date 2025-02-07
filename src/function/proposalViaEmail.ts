import { SERVER_URL } from "@env";
import { ProposalType } from "type";
import Toast from "react-native-simple-toast";

export const proposalViaEmail = async ({ userId, username, clientEmail, clientName,proposalId }: { userId: string, username: string, clientName: string, clientEmail: string, proposalId: string }) => {
  console.log("Enviando e-mail de orçamento...");
  try {
    const response = await fetch(`${SERVER_URL}/email/proposal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        username,
        proposal: {
          clientName,
          clientEmail,
          proposalId,
        },
      }),
    });

    // Lê o corpo da resposta em JSON
    const data = await response.json();

    if (response.ok) {
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