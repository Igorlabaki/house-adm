import { gerarContratoHTMLParams, gerarContratoPessoaFisicaHTML } from "html/contrato-pessoa-fisica";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export async function sendContractPessoFisicaWhatsapp(values: gerarContratoHTMLParams) {
    const { infoPessoais, orcamento } = values;
    // Gerar o PDF
    let options = {
      fileName: `Contrato_Locacao-${infoPessoais.nomeCompleto}.pdf`,
      directory: "Documents",
    };

    try {
      // Gerar o PDF
      const { uri } = await Print.printToFileAsync({
        html: gerarContratoPessoaFisicaHTML({
          infoPessoais: {
            cpf: infoPessoais.cpf,
            nomeCompleto: infoPessoais.nomeCompleto,
            bairro: infoPessoais?.bairro,
            cep: infoPessoais?.cep,
            cidade: infoPessoais?.cidade,
            estado: infoPessoais?.estado,
            numero: infoPessoais?.numero,
            rua: infoPessoais?.rua,
            rg: infoPessoais?.rg,
          },
          orcamento: orcamento,
        }),
        base64: false,
      });

      console.log(`PDF gerado em: ${uri}`);

      // Salvar o PDF no diretório de documentos do dispositivo
      const destinationPath =
        FileSystem.documentDirectory + `${options?.fileName}`;
      await FileSystem.moveAsync({
        from: uri,
        to: destinationPath,
      });

      console.log(`PDF movido para: ${destinationPath}`);

      // Agora, vamos permitir que o usuário baixe ou compartilhe o PDF
      // Usando o expo-sharing para abrir o PDF e permitir o download
      await Sharing.shareAsync(destinationPath);

      return destinationPath; // Retorna o caminho onde o arquivo foi salvo
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      return null;
    }
  }

  /* import {
  gerarContratoHTMLParams,
  gerarContratoPessoaFisicaHTML,
} from "html/contrato-pessoa-fisica";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { SERVER_URL } from "@env";

export async function sendContractPessoFisicaWhatsapp(
  values: gerarContratoHTMLParams
) {
  const { infoPessoais, orcamento } = values;
  // Gerar o PDF
  let options = {
    fileName: `Contrato_Locacao-${infoPessoais.nomeCompleto}.pdf`,
    directory: "Documents",
  };

  try {
    // Gerar o PDF
    const { uri } = await Print.printToFileAsync({
      html: gerarContratoPessoaFisicaHTML({
        infoPessoais: {
          cpf: infoPessoais.cpf,
          nomeCompleto: infoPessoais.nomeCompleto,
          bairro: infoPessoais?.bairro,
          cep: infoPessoais?.cep,
          cidade: infoPessoais?.cidade,
          estado: infoPessoais?.estado,
          numero: infoPessoais?.numero,
          rua: infoPessoais?.rua,
          rg: infoPessoais?.rg,
        },
        orcamento: orcamento,
      }),
      base64: false,
    });

    console.log(`PDF gerado em: ${uri}`);

    const base64PDF = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await fetch(`${SERVER_URL}/email/contrato`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: orcamento.email, // Enviar o e-mail do cliente
        nome: infoPessoais.nomeCompleto, // Enviar o nome do cliente
        pdfBase64: base64PDF, // PDF em base64
      }),
    });
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    return null;
  }
}
 */