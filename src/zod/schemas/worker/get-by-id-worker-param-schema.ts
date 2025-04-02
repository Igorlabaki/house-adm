import { z } from "zod";

export const getbyidWorkerRequestParamSchema = z.object({
    personId: z.string(),
})

export type GetByIdWorkerRequestParamSchema = z.infer<typeof getbyidWorkerRequestParamSchema>;

