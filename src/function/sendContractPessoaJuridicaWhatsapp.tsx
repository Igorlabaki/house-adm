import { gerarContratoHTMLParams, gerarContratoPessoaFisicaHTML } from "html/generate-natural-person-contract";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { gerarContratoPessoaJuridicaHTML, gerarContratoPessoaJuridicaHTMLParams } from "html/contrato-pessoa-juridica";

export async function sendContractPessoaJuridicaWhatsapp(values: gerarContratoPessoaJuridicaHTMLParams) {
    const { infoPessoais, orcamento } = values;
    // Gerar o PDF
    let options = {
      fileName: `Contrato_Locacao-${infoPessoais.nomeEmpresaCompleto}.pdf`,
      directory: "Documents",
    };

    try {
      // Gerar o PDF
      const { uri } = await Print.printToFileAsync({
        html: gerarContratoPessoaJuridicaHTML({
          infoPessoais: {
            cnpj: infoPessoais?.cnpj,
            cpf: infoPessoais?.cpf,
            nomeEmpresaCompleto: infoPessoais.nomeEmpresaCompleto,
            nomeRepresentanteCompleto: infoPessoais.nomeRepresentanteCompleto,
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