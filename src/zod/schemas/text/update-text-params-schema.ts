import { z } from "zod";

export const updateTextSchema = z.object({
    textId: z.string(),
    venueId: z.string(),
    data: z.object({
        area: z.string().optional(),
        text: z.string().optional(),
        title: z.string().optional(),
        position: z.number().optional(),
    }),
});

export type UpdateTextRequestParams = z.infer<typeof updateTextSchema>;