import { z } from "zod";

export const listDocumentRequestQuerySchema = z.object({
    venueId: z.string(),
    document: z.string().optional(),
})

export type ListDocumentRequestQuerySchema = z.infer<typeof listDocumentRequestQuerySchema>;

