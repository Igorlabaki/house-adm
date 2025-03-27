import { z } from "zod";

export const updateProposalPerPersonRequestParamsSchema = z.object({
    proposalId: z.string(),
    data: z.object({
        completeClientName: z.string().optional(),
        venueId: z.string().optional(),
        endHour: z.string().optional(),
        endDay: z.string().optional(),
        startDay: z.string().optional(),
        whatsapp: z.string().optional(),
        startHour: z.string().optional(),
        guestNumber: z.string().optional(),
        description: z.string().optional(),
        knowsVenue: z.boolean().optional(),
        email: z.string().email().optional(),
        totalAmountInput: z.string().optional(),
        serviceIds: z.array(z.string()).optional(),
        type: z.enum(["EVENT" , "OTHER" , "BARTER" , "PRODUCTION"]).optional(), 
        trafficSource: z.enum(["AIRBNB" , "GOOGLE" , "INSTAGRAM" , "TIKTOK" , "OTHER" , "FRIEND" , "FACEBOOK"]).optional()
    })
});

export type UpdateProposalPerPersonRequestParamsSchema = z.infer<typeof updateProposalPerPersonRequestParamsSchema>;