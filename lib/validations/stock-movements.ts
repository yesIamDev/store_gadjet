import { z } from 'zod'
import { MovementType, LocationType } from '@/lib/api/types'

export const stockMovementItemSchema = z.object({
  articleId: z.string().uuid("L'ID de l'article doit être un UUID valide"),
  quantite: z
    .number()
    .int('La quantité doit être un nombre entier')
    .min(1, 'La quantité doit être supérieure à 0'),
  emplacement: z.nativeEnum(LocationType, {
    message: "L'emplacement doit être MAGASIN ou DEPOT",
  }),
})

export const createStockMovementSchema = z.object({
  type: z.nativeEnum(MovementType, {
    message: 'Le type doit être ENTREE ou SORTIE',
  }),
  items: z
    .array(stockMovementItemSchema)
    .min(1, 'Au moins un article est requis'),
  motif: z.string().max(255, 'Le motif ne peut pas dépasser 255 caractères').optional(),
})

export const updateStockMovementSchema = createStockMovementSchema.partial()

export type CreateStockMovementFormData = z.infer<
  typeof createStockMovementSchema
>
export type UpdateStockMovementFormData = z.infer<
  typeof updateStockMovementSchema
>
