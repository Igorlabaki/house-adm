import {
  GenerateNaturalPersonContract,
  generateNaturalPersonContractHTML
} from "html/generate-natural-person-contract";

import * as MailComposer from "expo-mail-composer";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";

export async function sendContractPessoFisicaEmail(
  values: GenerateNaturalPersonContract
) {
  const { contractInformation,client,owner,proposal,venue } = values;

  try {
    const nomeArquivo = `Contrato_AR756_${client.completeName}.pdf`;
    // Gerar o PDF
    const { uri } = await Print.printToFileAsync({
      html: generateNaturalPersonContractHTML({
        owner,
        venue,
        client,
        proposal,
        contractInformation
      }),
      base64: false,
    });

    const novoCaminho = FileSystem.documentDirectory + nomeArquivo;

    await FileSystem.moveAsync({
      from: uri,
      to: novoCaminho,
    });
    

    // Opções do e-mail com o URI do PDF como anexo
    const options = {
      subject: "Contrato AR756",
      recipients: [`${proposal?.email}`],
      body: `Olá, ${client?.completeName}!

        Esperamos que esteja bem. É com grande satisfação que enviamos o contrato para o seu evento na AR756. No documento em anexo, você encontrará todos os detalhes e condições acordados para o aluguel do nosso espaço.

        Pedimos que revise o contrato com atenção e, caso tenha alguma dúvida ou ajuste necessário, estamos à disposição para ajudar. Após a sua leitura, basta assinar e nos devolver uma cópia digitalizada para formalizarmos o acordo.

        Agradecemos por confiar em nosso espaço para o seu evento especial. Estamos animados para proporcionar uma experiência inesquecível!

        Atenciosamente,
        Equipe AR756
      `,
      isHTML: true,
      attachments: [novoCaminho], // Passar apenas o URI do arquivo como uma string
    };

    // Enviar o e-mail com anexo
    const result = await MailComposer.composeAsync(options);
    console.log("Resultado do envio de e-mail:", result);
  } catch (error) {
    console.error("Erro ao enviar o e-mail com o PDF", error);
  }
}
