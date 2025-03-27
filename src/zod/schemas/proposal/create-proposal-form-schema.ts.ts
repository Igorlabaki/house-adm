import { z } from "zod";

export const createProposalFormSchema = z.object({
  completeClientName: z.string({
    required_error: 'Este campo é obrigatório!',
  }),
    date: z.string({
    required_error: 'Este campo é obrigatório!',
  }),
    venueId: z.string({
    required_error: 'Este campo é obrigatório!',
  }),
    endHour: z.string({
    required_error: 'Este campo é obrigatório!',
  }),
    whatsapp: z.string({
    required_error: 'Este campo é obrigatório!',
  }),
    startHour: z.string({
    required_error: 'Este campo é obrigatório!',
  }),
    guestNumber: z.string({
    required_error: 'Este campo é obrigatório!',
  }),
    description: z.string({
    required_error: 'Este campo é obrigatório!',
  }),
    knowsVenue: z.boolean({
        required_error: 'Este campo é obrigatório!',
      }),
    email: z.string({
        required_error: 'Este campo é obrigatório!',
      }).email(),
    serviceIds: z.array(z.string()).optional(),
    totalAmountInput: z.string().optional(),
    type: z.enum(["EVENT" , "OTHER" , "BARTER" , "PRODUCTION"]), 
    trafficSource: z.enum(["AIRBNB" , "GOOGLE" , "INSTAGRAM" , "TIKTOK" , "OTHER" , "FRIEND" , "FACEBOOK"])
});

export type CreateProposalFormSchema = z.infer<typeof createProposalFormSchema>;