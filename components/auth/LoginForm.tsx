'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaUser, FaLock, FaSpinner, FaArrowRight } from 'react-icons/fa'
import { useAuthStore } from '@/store/authStore'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [localError, setLocalError] = useState<string | null>(null)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLocalError(null)
      clearError()
      await login(data)
      toast.success('Connexion réussie')
      router.push('/')
      router.refresh()
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur de connexion'
      setLocalError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const displayError = localError || error

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
            Connexion
          </h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour accéder à votre compte
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
                        placeholder="Votre nom d'utilisateur"
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
                        placeholder="Votre mot de passe"
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
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <FaArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>

            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link
                  href="/signup"
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  )
}
