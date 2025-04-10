import { z } from "zod";

export const createPdfDocumentSchema = z.object({
    title: z.string(),
    proposalId: z.string(),
    pdfUrl: z.string(),
});

export type CreatePdfDocumentSchema = z.infer<typeof createPdfDocumentSchema>;