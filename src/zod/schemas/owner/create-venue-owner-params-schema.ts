import { z } from "zod";

export const createVenueOwnerFormSchema = z.object({
    cep: z.string(),
    pix: z.string(),
    cpf: z.string(),
    city: z.string(),
    state: z.string(),
    venueId:z.string(),
    street: z.string(),
    bankName: z.string(),
    bankAgency: z.string(),
    streetNumber: z.string(),
    completeName: z.string(),
    neighborhood: z.string(),
    rg: z.string().optional(),
    organizationId: z.string(),
    bankAccountNumber: z.string(),
    complement: z.string().optional(),
});

export type CreateVenueOwnerFormSchema = z.infer<typeof createVenueOwnerFormSchema>;

