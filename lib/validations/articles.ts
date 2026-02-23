import { z } from 'zod'

export const createArticleSchema = z.object({
  nom: z
    .string()
    .min(1, 'Le nom de l\'article est requis')
    .max(255, 'Le nom ne peut pas dépasser 255 caractères'),
  description: z
    .string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional()
    .or(z.literal('')),
  quantiteMagasin: z
    .number()
    .int('La quantité au magasin doit être un nombre entier')
    .min(0, 'La quantité au magasin ne peut pas être négative'),
  quantiteDepot: z
    .number()
    .int('La quantité au dépôt doit être un nombre entier')
    .min(0, 'La quantité au dépôt ne peut pas être négative'),
  prixDeVente: z
    .number()
    .positive('Le prix de vente doit être positif')
    .min(0.01, 'Le prix de vente doit être supérieur à 0'),
})

export const updateArticleSchema = createArticleSchema.partial()

export type CreateArticleFormData = z.infer<typeof createArticleSchema>
export type UpdateArticleFormData = z.infer<typeof updateArticleSchema>
