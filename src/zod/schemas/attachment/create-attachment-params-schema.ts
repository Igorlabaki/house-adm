import { z } from "zod";

export const createAttachmentFormData = z.object({
    title: z.string(),
    text: z.string(),
    venueId: z.string(),
    organizationId: z.string(),
});

export type CreateAttachmentFormData = z.infer<typeof createAttachmentFormData>;