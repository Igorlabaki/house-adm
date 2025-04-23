import { ProposalType } from "type";
import { Linking } from "react-native";

export const shareLink = async ({proposal, url, listType}:{proposal: ProposalType, url: string, listType: string}) => {
    const message = `
    Aqui está o link para envio de sua lista de ${listType}:

    https://www.ar756.com/orcamento/${url}/${proposal?.id}
    `;
    const formattedNumber = `+55${proposal.whatsapp
      .replace("-", "")
      .replace(/[\s()]/g, "")}`; // Adiciona o código do Brasil

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send/?phone=${formattedNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    Linking.openURL(whatsappURL).catch((err) =>
      console.error("Erro ao abrir o WhatsApp:", err)
    );
  };