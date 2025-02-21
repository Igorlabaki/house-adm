import { z } from "zod";

export const getTrafficCountVenueSchema = z.object({
    year: z.number(),
    venueId: z.string(),
    approved: z.boolean(),
});

export type GetTrafficCountVenueSchema = z.infer<typeof getTrafficCountVenueSchema>;