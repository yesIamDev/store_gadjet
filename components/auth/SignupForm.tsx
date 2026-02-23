'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaUser, FaLock, FaSpinner, FaArrowRight, FaCheck } from 'react-icons/fa'
import { useAuthStore } from '@/store/authStore'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function SignupForm() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuthStore()
  const [localError, setLocalError] = useState<string | null>(null)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLocalError(null)
      clearError()
      await register({
        username: data.username,
        password: data.password,
      })
      toast.success('Inscription réussie')
      router.push('/')
      router.refresh()
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors de l\'inscription'
      setLocalError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const displayError = localError || error
  const password = form.watch('password')
  const confirmPassword = form.watch('confirmPassword')

  const passwordRequirements = [
    { label: 'Au moins 8 caractères', met: password?.length >= 8 },
    { label: 'Une majuscule', met: /[A-Z]/.test(password || '') },
    { label: 'Une minuscule', met: /[a-z]/.test(password || '') },
    { label: 'Un chiffre', met: /[0-9]/.test(password || '') },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-md mx-auto relative z-10"
    >
      <div className="rounded-lg border border-border/80 bg-background shadow-lg p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2 text-center"
        >
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Inscription
          </h1>
          <p className="text-sm text-muted-foreground">
            Créez un compte pour commencer à utiliser l'application
          </p>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {displayError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                {displayError}
              </motion.div>
            )}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Nom d'utilisateur
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="Choisissez un nom d'utilisateur"
                        className={cn(
                          'pl-11 h-12 rounded-lg border-border/80 bg-background',
                          'transition-all duration-200',
                          'focus:border-primary focus:ring-2 focus:ring-primary/20',
                          'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    3-20 caractères, lettres, chiffres et underscores uniquement
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Créez un mot de passe"
                        className={cn(
                          'pl-11 h-12 rounded-lg border-border/80 bg-background',
                          'transition-all duration-200',
                          'focus:border-primary focus:ring-2 focus:ring-primary/20',
                          'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  {password && (
                    <div className="space-y-1.5 pt-2">
                      {passwordRequirements.map((req, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            'flex items-center gap-2 text-xs',
                            req.met
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-muted-foreground'
                          )}
                        >
                          <FaCheck
                            className={cn(
                              'h-3 w-3',
                              req.met
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-muted-foreground opacity-30'
                            )}
                          />
                          {req.label}
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Confirmer le mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirmez votre mot de passe"
                        className={cn(
                          'pl-11 h-12 rounded-lg border-border/80 bg-background',
                          'transition-all duration-200',
                          confirmPassword &&
                            password &&
                            confirmPassword === password
                            ? 'border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                            : confirmPassword && confirmPassword !== password
                            ? 'border-destructive/50 focus:border-destructive focus:ring-2 focus:ring-destructive/20'
                            : 'focus:border-primary focus:ring-2 focus:ring-primary/20',
                          'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  {confirmPassword && password && confirmPassword === password && (
                    <FormDescription className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5">
                      <FaCheck className="h-3 w-3" />
                      Les mots de passe correspondent
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-2"
            >
              <Button
                type="submit"
                className="w-full h-12 rounded-lg font-medium text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  <>
                    Créer un compte
                    <FaArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>

            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Déjà un compte ?{' '}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  )
}
