import { z } from 'zod'

export const createPendingArticleSchema = z.object({
  articleId: z.string().uuid("L'ID de l'article doit être un UUID valide"),
  quantiteAttendue: z
    .number()
    .int('La quantité attendue doit être un nombre entier')
    .positive('La quantité attendue doit être positive')
    .min(1, 'La quantité attendue doit être supérieure à 0'),
  dateAttendue: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === '' || !isNaN(Date.parse(val)),
      { message: 'La date attendue doit être une date valide' }
    )
    .or(z.literal('')),
  note: z.string().max(1000, 'La note ne peut pas dépasser 1000 caractères').optional().or(z.literal('')),
})

export const updatePendingArticleSchema = z.object({
  articleId: z.string().uuid("L'ID de l'article doit être un UUID valide").optional(),
  quantiteAttendue: z
    .number()
    .int('La quantité attendue doit être un nombre entier')
    .positive('La quantité attendue doit être positive')
    .min(1, 'La quantité attendue doit être supérieure à 0')
    .optional(),
  dateAttendue: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === '' || !isNaN(Date.parse(val)),
      { message: 'La date attendue doit être une date valide' }
    )
    .or(z.literal('')),
  note: z.string().max(1000, 'La note ne peut pas dépasser 1000 caractères').optional().or(z.literal('')),
})

export const receivePendingArticleSchema = z.object({
  quantiteRecue: z
    .number()
    .int('La quantité reçue doit être un nombre entier')
    .positive('La quantité reçue doit être positive')
    .min(1, 'La quantité reçue doit être supérieure à 0'),
  emplacement: z.enum(['MAGASIN', 'DEPOT'], {
    message: "L'emplacement doit être MAGASIN ou DEPOT",
  }),
  motif: z.string().max(500, 'Le motif ne peut pas dépasser 500 caractères').optional().or(z.literal('')),
})

export type CreatePendingArticleFormData = z.infer<typeof createPendingArticleSchema>
export type UpdatePendingArticleFormData = z.infer<typeof updatePendingArticleSchema>
export type ReceivePendingArticleFormData = z.infer<typeof receivePendingArticleSchema>
