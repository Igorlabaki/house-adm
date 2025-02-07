import { ProposalType } from "type";
import { Linking } from "react-native";

export const captureAndShare = async (proposal: ProposalType) => {
    const message = `
    Olá ${proposal?.name},

    Vimos que você fez um orçamento conosco para sua festa e estamos muito felizes em saber que a nossa casa de eventos te chamou a atenção. ✨

    Aqui está o link para o seu orçamento:

    https://www.ar756.com/orcamento/byId/${proposal?.id}

    Para que você possa ter a certeza de que a AR756 é o local perfeito para realizar o seu grande dia, gostaríamos de te convidar para uma visita sem compromisso!

    Adoraríamos te mostrar pessoalmente todos os detalhes do nosso espaço, te apresentar as diversas opções de decoração e serviços que oferecemos, e te ajudar a visualizar como o seu evento dos sonhos se tornar realidade aqui.

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