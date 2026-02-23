import { z } from 'zod'
import { InvoiceStatus } from '@/lib/api/types'

export const invoiceItemSchema = z.object({
  nom: z
    .string()
    .min(1, 'Le nom de l\'article est requis')
    .max(255, 'Le nom ne peut pas dépasser 255 caractères'),
  description: z
    .string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional()
    .or(z.literal('')),
  prixUnitaire: z
    .number()
    .positive('Le prix unitaire doit être positif')
    .min(0.01, 'Le prix unitaire doit être supérieur à 0'),
  quantite: z
    .number()
    .int('La quantité doit être un nombre entier')
    .positive('La quantité doit être positive')
    .min(1, 'La quantité doit être supérieure à 0'),
})

export const createInvoiceSchema = z.object({
  numeroFacture: z
    .string()
    .min(1, 'Le numéro de facture est requis')
    .max(100, 'Le numéro de facture ne peut pas dépasser 100 caractères'),
  numeroBonLivraison: z
    .string()
    .max(100, 'Le numéro de bon de livraison ne peut pas dépasser 100 caractères')
    .optional()
    .or(z.literal('')),
  montantTotal: z
    .number()
    .positive('Le montant total doit être positif')
    .min(0.01, 'Le montant total doit être supérieur à 0')
    .optional(),
  status: z.nativeEnum(InvoiceStatus, {
    message: 'Le statut doit être NON_PAYE ou PAYE',
  }).optional(),
  stockMovementCode: z
    .string()
    .max(50, 'Le code ne peut pas dépasser 50 caractères')
    .optional()
    .or(z.literal('')),
  items: z
    .array(invoiceItemSchema)
    .optional(),
  clientId: z.string().uuid("L'ID du client doit être un UUID valide").optional(),
}).refine(
  (data) => {
    const hasMovementCode = data.stockMovementCode && data.stockMovementCode.trim().length > 0
    const hasItems = data.items && data.items.length > 0
    return hasMovementCode || hasItems
  },
  {
    message: 'Un code de mouvement de stock ou au moins un article libre est requis',
    path: ['stockMovementCode'],
  }
)

export const updateInvoiceSchema = z.object({
  numeroFacture: z
    .string()
    .min(1, 'Le numéro de facture est requis')
    .max(100, 'Le numéro de facture ne peut pas dépasser 100 caractères')
    .optional(),
  numeroBonLivraison: z
    .string()
    .max(100, 'Le numéro de bon de livraison ne peut pas dépasser 100 caractères')
    .optional()
    .or(z.literal('')),
  montantTotal: z
    .number()
    .positive('Le montant total doit être positif')
    .min(0.01, 'Le montant total doit être supérieur à 0')
    .optional(),
  status: z.nativeEnum(InvoiceStatus, {
    message: 'Le statut doit être NON_PAYE ou PAYE',
  }).optional(),
  stockMovementCode: z
    .string()
    .max(50, 'Le code ne peut pas dépasser 50 caractères')
    .optional()
    .or(z.literal('')),
  items: z
    .array(invoiceItemSchema)
    .optional(),
  clientId: z.string().uuid("L'ID du client doit être un UUID valide").optional(),
})

export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceFormData = z.infer<typeof updateInvoiceSchema>
