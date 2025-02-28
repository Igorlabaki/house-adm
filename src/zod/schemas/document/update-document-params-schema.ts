import { z } from "zod";

export const updateDocumentSchema = z.object({
    documentId: z.string(),
    data: z.object({
        title:  z.string().optional(),
        imageUrl:  z.string().optional(),
    }),
});

export type UpdateDocumentRequestParams = z.infer<typeof updateDocumentSchema>;