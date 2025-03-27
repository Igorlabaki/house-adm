import { z } from "zod";

export const createUserOrganizationParamsSchema = z.object({
    userId: z.string(),
    organizationId: z.string(),
    venuesPermissions: z.array(
        z.object({
            role: z.string(),
            venueId: z.string(),
            permissions: z.array(
                z.string()
            ),
        })
    ),
});

export type CreateUserOrganizationParamsSchema = z.infer<typeof createUserOrganizationParamsSchema>;













