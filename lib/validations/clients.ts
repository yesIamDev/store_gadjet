import { z } from 'zod'
import { ClientType } from '@/lib/api/types'

const baseClientSchema = z.object({
  type: z.nativeEnum(ClientType, {
    message: 'Le type doit être INDIVIDU ou ENTREPRISE',
  }),
  nom: z
    .string()
    .min(1, 'Le nom est requis')
    .max(255, 'Le nom ne peut pas dépasser 255 caractères'),
  telephone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .max(20, 'Le téléphone ne peut pas dépasser 20 caractères'),
  nomPersonneReference: z
    .string()
    .max(255, 'Le nom de la personne de référence ne peut pas dépasser 255 caractères')
    .optional()
    .or(z.literal('')),
})

export const createClientSchema = baseClientSchema.refine(
  (data) => {
    // Pour les entreprises, le nom de la personne de référence est requis
    if (data.type === 'ENTREPRISE') {
      return !!data.nomPersonneReference && data.nomPersonneReference.trim().length > 0
    }
    return true
  },
  {
    message: 'Le nom de la personne de référence est requis pour les entreprises',
    path: ['nomPersonneReference'],
  }
)

export const updateClientSchema = z
  .object({
    type: z.nativeEnum(ClientType, {
      message: 'Le type doit être INDIVIDU ou ENTREPRISE',
    }),
    nom: z
      .string()
      .min(1, 'Le nom est requis')
      .max(255, 'Le nom ne peut pas dépasser 255 caractères')
      .optional(),
    telephone: z
      .string()
      .min(1, 'Le numéro de téléphone est requis')
      .max(20, 'Le téléphone ne peut pas dépasser 20 caractères')
      .optional(),
    nomPersonneReference: z
      .string()
      .max(255, 'Le nom de la personne de référence ne peut pas dépasser 255 caractères')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      // Pour les entreprises, le nom de la personne de référence est requis si le type est ENTREPRISE
      if (data.type === 'ENTREPRISE') {
        return !!data.nomPersonneReference && data.nomPersonneReference.trim().length > 0
      }
      return true
    },
    {
      message: 'Le nom de la personne de référence est requis pour les entreprises',
      path: ['nomPersonneReference'],
    }
  )

export type CreateClientFormData = z.infer<typeof createClientSchema>
export type UpdateClientFormData = z.infer<typeof updateClientSchema>
