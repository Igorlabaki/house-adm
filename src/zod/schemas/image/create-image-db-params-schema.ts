import { z } from "zod";

export const createImageDbRequestParams = z.object({
  file: z
    .instanceof(File, { message: "O arquivo é obrigatório." })
    .refine((file) => file.size > 0, {
      message: "O arquivo não pode estar vazio.",
    }),
  tag: z.string().min(1, "A tag é obrigatória."),
  venueId: z.string(), 
  position: z.string().optional(),
  description: z.string().optional(),
  responsiveMode: z.string().optional(),
});

export type CreateImageDbRequestParams = z.infer<typeof createImageDbRequestParams>;