import { z } from "zod";
import { createTextFormSchema } from "../schemas/createTextFormZodSchema";

export type CreateTextFormData = z.infer<typeof createTextFormSchema>;
