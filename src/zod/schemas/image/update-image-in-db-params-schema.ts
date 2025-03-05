import { z } from "zod";

export const updateImageRequestParams = z.object({
  file: z
    .instanceof(File, { message: "O arquivo é obrigatório." })
    .refine((file) => file.size > 0, {
      message: "O arquivo não pode estar vazio.",
    }).optional(),
  tag: z.string().min(1, "A tag é obrigatória."),
  imageId: z.string(),
  venueId: z.string(),
  imageUrl: z.string(),
  position: z.string().optional(),
  description: z.string().optional(),
  responsiveMode: z.string().optional(),
})

export type UpdateImageRequestParams = z.infer<typeof updateImageRequestParams>;