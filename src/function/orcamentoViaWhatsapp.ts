import { BugdetType } from "type";
import { Linking } from "react-native";

export const orcamentoViaWhatsapp = async (budget: BugdetType) => {
    const message = `
    Olá ${budget?.nome},

    Aqui está o link para o seu orçamento:

    https://www.ar756.com/orcamento/byId/${budget?.id}

    Atenciosamente,
    Equipe AR756
    `;
    const formattedNumber = `+55${budget.telefone
      .replace("-", "")
      .replace(/[\s()]/g, "")}`; // Adiciona o código do Brasil

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send/?phone=${formattedNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    Linking.openURL(whatsappURL).catch((err) =>
      console.error("Erro ao abrir o WhatsApp:", err)
    );
  };