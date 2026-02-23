import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(20, 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'
    ),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères'),
})

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(20, 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'
    ),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
