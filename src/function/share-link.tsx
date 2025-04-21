import { ProposalType } from "type";
import { Linking } from "react-native";

export const shareLink = async ({proposal, url, listType}:{proposal: ProposalType, url: string, listType: string}) => {
    const message = `
    Olá ${proposal?.completeClientName},

    Vimos que você fez um orçamento conosco para sua festa e estamos muito felizes em saber que a nossa casa de eventos te chamou a atenção. ✨

    Aqui está o link para envio de sua lista de ${listType}:

    https://www.ar756.com/orcamento/${url}/${proposal?.id}

    Ficamos à sua disposição para te ajudar a realizar o evento dos seus sonhos!

    Atenciosamente,
    Equipe AR756

    P.S.: Não deixe de conferir nossas redes sociais para se inspirar com fotos e vídeos de eventos realizados na AR756!

    *Links Úteis*:
    📷 Instagram: https://www.instagram.com/ar756_/
    🔗 Site: www.ar756.com
    📸 Galeria de Fotos: www.ar756.com/galeria
    ℹ️ Sobre Nós: www.ar756.com/regras
    ❓ Perguntas Frequentes: www.ar756.com/faq
    💰 Consulta de Preços: www.ar756.com/consultar
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