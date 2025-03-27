import moment from "moment";
import { format, isValid, parseISO } from "date-fns";
import { ClauseType, ClientType, OwnerType, ProposalType } from "type";
import { clientVariables, ownerVariables, paymentInfoVariables, proposalVariables, venueVariables } from "const/contract-variables";
import { Venue } from "@store/venue/venueSlice";
import extenso from "extenso"

export interface GenerateNaturalPersonContract {
    contractInformation: {
        title?: string,
        clauses: ClauseType[]
    },
    venue: Venue;
    owner: OwnerType;
    client: ClientType;
    proposal: ProposalType;
    paymentInfo: {
        dueDate: number;
        signalAmount: number;
        numberPayments: number;
        paymentValue: number
    }
}

export function generateNaturalPersonContractHTML(
    data: GenerateNaturalPersonContract
) {
    const { contractInformation } = data;
    const dataHoje = new Date();

    function toRoman(num) {
        const romanNumerals = [
            ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
            ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
            ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]
        ];

        let roman = "";

        for (const [letter, value] of romanNumerals) {
            while (num >= value) {
                roman += letter;
                num -= value as number;
            }
        }

        return roman;
    }

    function createVariablesMap(data: GenerateNaturalPersonContract) {
        const allVariables = [...venueVariables, ...ownerVariables, ...clientVariables, ...proposalVariables, ...paymentInfoVariables];

        const variables: Record<string, string> = {};
   
        allVariables.forEach(({ key }) => {
            // Divide a chave "venue.cep" -> ["venue", "cep"]
            const path = key.split('.');

            // Percorre o objeto `data` para obter o valor real
            let value: any = data;
            for (const prop of path) {
                if (value && typeof value === 'object') {
                    value = value[prop];
                } else {
                    value = "";
                    break;
                }
            }

            if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                const parsedDate = parseISO(value);

                if (isValid(parsedDate)) {
                    const hasTime = parsedDate.getHours() !== 0 || parsedDate.getMinutes() !== 0;
                    variables[key] = hasTime
                        ? format(parsedDate, "dd/MM/yyyy 'às' HH:mm")
                        : format(parsedDate, "dd/MM/yyyy");
                } else {
                    variables[key] = value; // Se não for uma data válida, mantém a string original
                }
            } else if (path[1] === "totalAmount" || path[1] === "signalAmount" || path[1] === "paymentValue") {
                const formattedValue = Number(value).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                });

                const cleanValue = Number(value).toFixed(2); // Garante formato numérico correto
                const valueExtenso = extenso(cleanValue.replace(".", ","), { mode: "currency" });

                 variables[key] = `${formattedValue} (${valueExtenso})`;
            }  else {
                variables[key] = value?.toString() || "";
            }
        });
        return variables;
    }

    const variables = createVariablesMap(data);

    function replaceVariables(text: string, variables: Record<string, string>): string {
        return text.replace(/{{(.*?)}}/g, (_, key) => variables[key] || "").replace(/\n/g, "<br>");
    }

    const htmlContrato = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrato de Locação para Temporada</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            padding: 20px;
        }
        h1, h2, h3 {
            text-align: center;
        }
        .section {
            margin-bottom: 20px;
        }
        .clause-section {
            page-break-inside: avoid;
        }
        .section p {
            margin: 5px 0;
        }
        .clause-title {
            font-weight: bold;
        }
        .signatures {
            margin-top: 40px;
            text-align: center;
        }
        .signature-line {
            margin-top: 50px;
            border-top: 1px solid #000;
            width: 50%;
            margin-left: auto;
            margin-right: auto;
        }
        .annexes {
            margin-top: 40px;
        }
        .margin-top{
            margin-top: 100px;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <h1>${contractInformation.title}</h1>

     ${contractInformation.clauses.map((item: ClauseType, index: number) => `
        <div class="section clause-section">
            <p class="clause-title ">${`${toRoman(index + 1)}) ${item.title}`}</p>
            <p>${`${replaceVariables(item.text, variables)}`}</p>
        </div>
    `).join("")}

   <div class="section clause-section">
        <p class="clause-title">${`${toRoman(contractInformation.clauses.length + 1)}) DAS ASSINATURAS`}</p>
        <p>Por estarem acordadas, assinam o presente instrumento.</p>
        <div class="signatures">
            <p>São Paulo, ${format(dataHoje, "dd/MM/yyyy")}.</p>
            <div class="signature-line"></div>
            <p>Assinatura do(a) Locador(a)</p>
            <div class="signature-line"></div>
            <p>Assinatura do(a) Locatário(a)</p>
        </div>
    </div>
</body>
</html>
`;

    return htmlContrato;
}

/*     
  
    <div class="section margin-top">
        <p class="clause-title">I - O LOCADOR:</p>
        <p>Rafael Alberto Gonçalo, RG 6.556.401-7, CPF 017.160.788-06, Brasileiro, residente e domiciliado na Av. Alberto Ramos 756, São Paulo/SP, CEP 03222-00;</p>
    </div>

    <div class="section">
        <p class="clause-title">II - O(A) LOCATÁRIO(A):</p>
        <p><strong>${infoPessoais?.co}, ${infoPessoais?.rg ? `RG ${infoPessoais.rg
            },` : ""}  CPF ${infoPessoais.cpf
        }</strong>, residente e domiciliado na Rua <strong>${infoPessoais?.rua
        } ${infoPessoais?.numero} - ${infoPessoais?.bairro
        }, CEP ${infoPessoais?.cep} - ${infoPessoais?.cidade}/${infoPessoais?.estado
        }.</strong></p> 
    </div>

    <div class="section">
        <p class="clause-title">III - IMÓVEL LOCADO:</p>
        <p>Locação por temporada do pavimento térreo do imóvel, nomeado “AR 756”, localizado na Av. Alberto Ramos 756, Vila Prudente, São Paulo/SP, com as seguintes características:</p>
        <ul>
            <li>Salão,</li>
            <li>Ante Sala,</li>
            <li>Área externa,</li>
            <li>Galpão,</li>
            <li>Cozinha,</li>
            <li>Banheiros.</li>
        </ul>
    </div>

    <div class="section">
        <p class="clause-title">IV - MÓVEIS E UTENSÍLIOS:</p>
        <p>O imóvel possui os móveis e utensílios elencados no Anexo I deste contrato.</p>
    </div>
    <div class="page-break"></div>
    <div class="section margin-top">
        <p class="clause-title">V - DOS TERMOS DE USO DO ESPAÇO:</p>
        <p>O LOCADOR apresenta a(o) LOCATÁRIO(A) os termos de uso do espaço, no Anexo II, que fica fazendo parte integrante do presente contrato, comprometendo-se o(a) LOCATÁRIO(A) a observar por si e por seus convidados as respectivas normas, sob pena de rescisão contratual e multa no valor de R$1.000,00 (mil reais).</p>
        <p>É de responsabilidade exclusiva do(a) LOCATÁRIO(A) a condução do comportamento de seus convidados, bem como caberá a(o) mesmo(a) a exigência de que seja retirado o convidado que infringir regras de conduta.</p>
    </div>
    <div class="section">
        <p class="clause-title">VI - DO PERÍODO DA LOCAÇÃO:</p>
        <p>Os contratantes ajustam pelo presente instrumento particular a locação do imóvel supra descrito, para locação por temporada, pelo período de <strong>${format(
            orcamento?.dataInicio,
            "dd/MM/yyyy"
        )} das ${ moment.utc(orcamento?.dataInicio).format('HH:mm')} até às ${ moment.utc(orcamento?.dataFim).format('HH:mm')} do mesmo dia ${format(orcamento?.dataInicio, "dd/MM/yyyy")}.
        </strong></p>
    </div>

    <div class="section">
        <p class="clause-title">VII - DO NÚMERO DE HÓSPEDES:</p>
        <p>O presente contrato autoriza a entrada de, no máximo, <strong>${orcamento?.convidados
        } pessoas </strong> no imóvel, ainda que o imóvel tenha espaço para acomodar mais pessoas. A(O) LOCATÁRIO(A) tem a opção de aumentar o número máximo de pessoas mediante prévia autorização do locador, desde que o pedido seja feito e o pagamento correspondente seja efetuado com pelo menos 24 horas de antecedência à data da locação <strong>(${format(
            orcamento?.dataInicio,
            "dd/MM/yyyy"
        )})</strong>. Neste caso, será aplicada uma taxa adicional de R$150,00 por pessoa.</p>
        <p>Excedendo esse número <strong>(máximo de ${orcamento?.convidados
        } pessoas)</strong>, e não cumprido o prazo do parágrafo anterior, será cobrado um valor adicional de R$250,00 por pessoa. Em caso de não pagamento do valor adicional o locador pode exigir desocupação imediata do locatário sem direito a qualquer reembolso.</p>
    </div>

    <div class="section">
        <p class="clause-title">VIII - DO VALOR DA LOCAÇÃO:</p>
        <p>O valor total do aluguel para o período acima ficou ajustado em <strong>R$${orcamento.total.toLocaleString(
            "pt-BR",
            { minimumFractionDigits: 2 }
        )}</strong> , no período descrito na cláusula VI deste contrato.</p>
    </div>
<div class="page-break"></div>
    <div class="section margin-top">
        <p class="clause-title">IX - DO VALOR DA TAXA DE LIMPEZA:</p>
        <p>Será cobrada uma taxa única de limpeza de R$ 250 (duzentos e cinquenta reais) inclusa no valor total.</p>
    </div>

    <div class="section">
        <p class="clause-title">X - DO SINAL DE GARANTIA:</p>
        <p>O(a) Locatário(a) pagará como sinal o valor de <strong>R$${(
            orcamento.total / 2
        ).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
        })}</strong> , na data da assinatura do presente contrato, mediante depósito bancário na seguinte conta: PIX, CPF: 017.160.788-06.</p>
        <p>O valor do sinal pago antecipadamente será abatido do valor total da locação, e o saldo remanescente deverá ser pago até 72 horas antes do evento <strong>(${format(
            orcamento?.dataInicio,
            "dd/MM/yyyy"
        )})</strong>. É indispensável a transmissão do presente contrato devidamente preenchido e assinado pelo e-mail ar756sp@gmail.com, juntamente com o comprovante de depósito.</p>
    </div>

    <div class="section">
        <p class="clause-title">XI - DA PERDA DO SINAL DE GARANTIA NO CASO DE DESISTÊNCIA:</p>
        <p>No caso de desistência da locação, o(a) locatário(a) perderá a totalidade do sinal depositado.</p>
    </div>

    <div class="section">
        <p class="clause-title">XII - DA VISTORIA:</p>
        <p>O(a) Locatário(a) entrará no imóvel acompanhado do locador ou pessoa de sua confiança, e será feita vistoria do estado do imóvel e do mobiliário. Qualquer avaria detectada no momento da vistoria será anotada, à pedido do locatário, no presente contrato. No momento da saída do imóvel, nova vistoria será feita.</p>
    </div>

    <div class="section">
        <p class="clause-title">XIII - DA RESPONSABILIDADE:</p>
        <p>O Locador não se responsabiliza por objetos deixados no imóvel, bem como por furtos/roubos dos bens do locatário e outros danos causados por caso fortuito ou força maior que ocasionem danos.</p>
        <p>O Locador não é responsável por eventos que possam vir ocorrer no imóvel durante a locação, como por exemplo falta de água ou de energia elétrica, uma vez que a responsabilidade é da concessionária de serviço público.</p>
    </div>
    <div class="page-break"></div>
    <div class="section margin-top">
        <p class="clause-title">XIV- DA INEXISTÊNCIA DE DEVOLUÇÃO:</p>
        <p>No caso de encerramento da estadia em momento anterior ao previsto, por qualquer motivo, o locador não devolverá valores ao locatário.</p>
    </div>

    <div class="section">
        <p class="clause-title">XV- DO NÃO CUMPRIMENTO DAS CLÁUSULAS:</p>
        <p>O descumprimento de quaisquer das cláusulas e condições estabelecidas neste contrato, por qualquer das partes, implicará na rescisão imediata do presente contrato, sujeitando a parte infratora ao pagamento de multa de R$1.000,00 (mil reais) e ao ressarcimento das perdas e danos.</p>
    </div>
    <div class="section">
        <p class="clause-title">XVI- DA INTEGRAÇÃO DO CONTRATO:</p>
        <p>
            Faz parte integrante deste contrato todos os e-mails ou mensagens
            trocadas pelas partes antes da assinatura do mesmo (Ex:
            Whatsapp), as quais podem ser utilizadas como prova de cláusulas
            não contidas neste contrato, desde que haja prova de concordância
            da outra parte (ex: resposta com ciência).
        </p>
    </div>
    <div class="section">
        <p class="clause-title">XVII - DA PERMANÊNCIA DOS COLABORADORES:</p>
        <p>
            Os colaboradores contratados para a realização dos serviços
            durante a festa devem concluir suas atividades e se retirar
            imediatamente após a finalização do trabalho. A permanência
            dos colaboradores no evento além do período contratado será
            considerada como convite para a festa, resultando na cobrança
            de uma taxa de R$250,00 (duzentos e cinquenta reais) por
            pessoa.
        </p>
    </div>
    <div class="section">
        <p class="clause-title"> XVIII - DAS OBRIGAÇÕES FINAIS DO LOCATÁRIO:</p>
        <ul>
            <li>a) não ceder ou franquear o imóvel para outrem, sem o prévio e expresso consentimento do locador, mesmo que temporariamente;</li>
            <li>b) restituir o imóvel nas mesmas e perfeitas condições que lhe foi entregue: sem estragos, avarias ou danos, inclusive aos móveis e utensílios, guarnições e demais pertences;</li>
            <li>c) comunicar ao locador quaisquer ocorrências imprevistas havidas no imóvel e seus utensílios.</li>
        </ul>
    </div>
       <div class="page-break"></div>
    <div class="section margin-top">
        <p class="clause-title">XIV - FORO:</p>
        <p>As partes elegem o Foro da Comarca de São Paulo/SP, para dirimir quaisquer controvérsias oriundas do presente instrumento.</p>
    </div>
 
      <div class="section">
        <p class="clause-title">XX - DAS ASSINATURAS:</p>
        <p>Por estarem acordadas, assinam o presente instrumento.</p>
    </div>
    <div class="signatures">
        <p>São Paulo, ${format(dataHoje, "dd/MM/yyyy")}.</p>
        <div class="signature-line"></div>
        <p>Assinatura do(a) Locador(a)</p>
        <div class="signature-line"></div>
        <p>Assinatura do(a) Locatário(a)</p>
    </div>
 <div class="page-break"></div>
       <h2 class="margin-top">ANEXO I - MOBILIÁRIO</h2>
    <ul class="margin-top">
        <li>Um sofá 3 lugares em couro marrom, Natuzzi Editions modelo A492 em ótimo estado (Salão)</li>
        <li>Um sofá Shangai Franccino com 4 metros, em madeira com 4 almofadas brancas sem manchas em ótimo estado (Galpão)</li>
        <li>Um sofá Samarti Franccino com 3 metros em alumínio fundido e 6 almofadas em courino náutico sem manchas em ótimo estado (Galpão)</li>
        <li>Duas poltronas Samarti Franccino em alumínio fundido com 4 almofadas em courino náutico sem manchas em ótimo estado (Galpão)</li>
        <li>Um sofá Zurique Franccino redondo em alumínio tramado artesanalmente com fibra sintética, cinco almofadas e assento em tecido acrílico branco em ótimo estado (Galpão/ Externo)</li>
        <li>Um puffe Artefacto 1,40 x 1,40 em couro branco em ótimo estado (Galpão)</li>
        <li>Doze poltronas Havana Fundição Vesúvio em alumínio fundido, na cor preto, em ótimo estado (Galpão)</li>
        <li>Duas cadeiras Barcelona Franccino de alumínio e madeira em ótimo estado (Galpão)</li>
        <li>Quatro Ombrelones / Guarda Sóis quadrados, Sunbras, em alumínio na cor preto, com tecido olefin europeu na cor preto em ótimo estado (Área Externa)</li>
        <li>Um conjunto de mesa em alumínio com quatro cadeiras em alumínio e tela sling Greenhouse em ótimo estado (Área Externa)</li>
        <li>Conjunto de duas chaises / espreguiçadeiras Lazio Franccino em alumínio e tela sling em ótimo estado (Área Externa)</li>
        <li>Conjunto de duas chaises / espreguiçadeiras Lion Franccino em alumínio e tela sling em ótimo estado (Área Externa)</li>
        <li>Uma mesa Treviso Franccino em alumínio em ótimo estado (Galpão / Área Externa)</li>
    </ul>

    <div class="page-break"></div>

    <h2 class="margin-top">ANEXO II - TERMOS DE UTILIZAÇÃO DO ESPAÇO</h2>
    <ul class="margin-top">
        <li>O(A) Locatário(a) se responsabiliza pela reorganização do espaço conforme lhe foi entregue, limpeza e retirada de lixos após o término da confraternização.</li>
        <li>Cigarros só estão permitidos na área de fumantes.</li>
        <li>É expressamente proibido a utilização de garrafas, taças e/ou copos de vidro, durante o evento.</li>
        <li>É expressamente proibido o uso de artefatos pirotécnicos, inflamáveis e/ou quaisquer efeitos especiais, especialmente que contenham, Bolhas, Confetes, Espuma, Fumaça , Glitter, Pólvora, etc.</li>
        <li>Não é permitida a movimentação do mobiliário pesado sem expressa autorização, somente poderão ser movimentados mobiliários leves/ modulares (Tampos de mesas, Bases/Cavaletes, Cadeiras).</li>
        <li>É expressamente proibido qualquer tipo de práticas sexuais nas dependências do espaço.</li>
    </ul>

    <div class="page-break"></div>
  
  
   
  
  
  */
