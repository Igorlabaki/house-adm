import { format, isValid, parseISO } from "date-fns";
import { AttachmentType, ClauseType, ClientType, OwnerType, ProposalType } from "type";
import { clientVariables, ownerVariables, paymentInfoVariables, proposalVariables, venueVariables } from "const/contract-variables";
import { Venue } from "@store/venue/venueSlice";
import extenso from "extenso";

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

export function generateNaturalPersonContractHTML(data: GenerateNaturalPersonContract) {
    const { contractInformation,paymentInfo,venue } = data;
    const today = new Date();

    const toRoman = (num: number): string => {
        const romanNumerals = [
            ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
            ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
            ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]
        ];

        return romanNumerals.reduce((result, [letter, value]) => {
            while (num >= value) {
                result += letter;
                num -= value;
            }
            return result;
        }, "");
    };

    function renderAttachments(attachments: AttachmentType[]) {
        return attachments.map((attachment, index) => `
          <div style="page-break-before: always;">
            <h2 style="text-align: center; margin-top: 40px; margin-bottom: 20px; text-transform: uppercase;">${attachment.title}</h2>
            <p>${attachment.text.replace(/\n/g, "<br>")}</p>
          </div>
        `).join('');
      }
      const attachmentsHTML = renderAttachments(venue.attachments || []);
    const createVariablesMap = (data: GenerateNaturalPersonContract) => {
        const allVariables = [
            ...venueVariables,
            ...ownerVariables,
            ...clientVariables,
            ...proposalVariables,
            ...paymentInfoVariables
        ];

        return allVariables.reduce((acc, { key }) => {
            const value = key.split('.').reduce((obj, prop) =>
                (obj && typeof obj === 'object') ? obj[prop] : "", data);

            if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                const parsedDate = parseISO(value);
                acc[key] = isValid(parsedDate)
                    ? format(parsedDate,
                        parsedDate.getHours() !== 0 || parsedDate.getMinutes() !== 0
                            ? "dd/MM/yyyy 'às' HH:mm"
                            : "dd/MM/yyyy")
                    : value;
            }
            else if (["totalAmount", "signalAmount", "paymentValue"].includes(key.split('.')[1])) {
                const numericValue = Number(value);
                const formattedValue = numericValue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                });
                const valueExtenso = extenso(numericValue.toFixed(2).replace(".", ","), {
                    mode: "currency"
                });
                acc[key] = `${formattedValue} (${valueExtenso})`;
            }
            else {
                acc[key] = value?.toString() || "";
            }

            return acc;
        }, {} as Record<string, string>);
    };

    const variables = createVariablesMap(data);

    const processTextContent = (text: string): string => {
        // 1. Substitui variáveis
        let processed = text.replace(/{{(.*?)}}/g, (_, key) => variables[key] || "");

        // 2. Processamento profissional de texto
        return processed
            .split(/\n\s*\n/) // Divide por parágrafos
            .map(paragraph =>
                paragraph
                    .replace(/\n/g, ' ') // Remove quebras internas
                    .replace(/\s+/g, ' ') // Normaliza espaços
                    .trim()
            )
            .filter(paragraph => paragraph.length > 0)
            .map(paragraph =>
                `<p style="margin: 12px 0; text-align: justify; text-justify: inter-word;">
                    ${paragraph}
                </p>`
            )
            .join('');
    };

    const renderClauses = () => contractInformation.clauses.map((item, index) => `
        <div class="clause-section  clause-container" style="margin-bottom: 20px;">
            <p class="clause-title" style="font-weight: bold; margin-bottom: 8px;">
                ${toRoman(index + 1)}) ${item.title}
            </p>
            <div class="clause-content">${processTextContent(item.text)}</div>
        </div>
    `).join("");

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contractInformation.title || "Contrato de Locação"}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400;700&display=swap');
        
        body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            margin: 1.5cm;
            font-size: 12pt;
            color: #000000;
            text-align: justify;
        }
        
        h1 {
            text-align: center;
            font-size: 22pt;
            margin-bottom: 24px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 100px;
        }
        
        .clause-title {
            font-weight: bold;
            margin: 16px 0 8px 0;
            page-break-after: avoid;
        }
        
        .clause-content p {
            margin: 12px 0;
            line-height: 1.5;
            text-align: justify;
            text-justify: inter-word;
            word-spacing: -0.1em;
            hyphens: auto;
            -webkit-hyphens: auto;
            -ms-hyphens: auto;
            page-break-inside: avoid; /* Impede que a cláusula seja dividida */
            break-inside: avoid; /* Fallback para navegadores modernos */
            margin-bottom: 24px; /* Mantém o espaçamento entre cláusulas */
        }
        
        .signatures {
            margin-top: 48px;
            page-break-before: avoid;
        }
        
        .signature-line {
            width: 60%;
            margin: 24px auto 8px;
            border-top: 1px solid #000;
        }
        
        @media print {
            body {
                margin: 1.5cm;
            }
            .page-break {
                page-break-after: always;
            }
        }
    </style>
</head>
<body>
    <h1>${contractInformation.title || "CONTRATO DE LOCAÇÃO"}</h1>
    
    ${renderClauses()}

    <div class="signatures">
        <p>Por estarem acordadas, assinam o presente instrumento.</p>
        <p>São Paulo, ${format(today, "dd/MM/yyyy")}.</p>
        
        <div style="display: flex; justify-content: space-between; margin-top: 48px;">
            <div style="width: 45%; text-align: center;">
                <div class="signature-line"></div>
                <p>Locador(a)</p>
            </div>
            
            <div style="width: 45%; text-align: center;">
                <div class="signature-line"></div>
                <p>Locatário(a)</p>
            </div>
        </div>
    </div>
     ${attachmentsHTML}
</body>
</html>
    `;
}