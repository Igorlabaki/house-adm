import { z } from "zod";

export const createProposalRequestParamsSchema = z.object({
    completeClientName: z.string(),
    date: z.string(),
    userId: z.string(),
    venueId: z.string(),
    endHour: z.string(),
    whatsapp: z.string(),
    startHour: z.string(),
    guestNumber: z.string(),
    description: z.string(),
    knowsVenue: z.boolean(),
    email: z.string().email(),
    totalAmountInput: z.string().optional(),
    serviceIds: z.array(z.string()).optional(),
    type: z.enum(["EVENT" , "OTHER" , "BARTER" , "PRODUCTION"]), 
    trafficSource: z.enum(["AIRBNB" , "GOOGLE" , "INSTAGRAM" , "TIKTOK" , "OTHER" , "FRIEND" , "FACEBOOK"])
});

export type CreateProposalRequestParamsSchema = z.infer<typeof createProposalRequestParamsSchema>;