'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaUser, FaBuilding, FaPhone, FaUserTie } from 'react-icons/fa'
import {
  createClientSchema,
  updateClientSchema,
  type CreateClientFormData,
  type UpdateClientFormData,
} from '@/lib/validations/clients'
import type { Client, ClientType } from '@/lib/api/types'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ClientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client | null
  onSubmit: (data: CreateClientFormData | UpdateClientFormData) => Promise<void>
  isLoading?: boolean
}

export function ClientForm({
  open,
  onOpenChange,
  client,
  onSubmit,
  isLoading = false,
}: ClientFormProps) {
  const isEdit = !!client
  const schema = isEdit ? updateClientSchema : createClientSchema

  const form = useForm<CreateClientFormData | UpdateClientFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'INDIVIDU' as ClientType,
      nom: '',
      telephone: '',
      nomPersonneReference: '',
    },
  })

  const selectedType = form.watch('type')

  useEffect(() => {
    if (client) {
      form.reset({
        type: client.type,
        nom: client.nom,
        telephone: client.telephone || '',
        nomPersonneReference: client.nomPersonneReference || '',
      })
    } else {
      form.reset({
        type: 'INDIVIDU' as ClientType,
        nom: '',
        telephone: '',
        nomPersonneReference: '',
      })
    }
  }, [client, form, open])

  const handleSubmit = async (data: CreateClientFormData | UpdateClientFormData) => {
    try {
      // Nettoyer les champs vides
      const cleanedData = {
        ...data,
        telephone: data.telephone || undefined,
        nomPersonneReference: data.nomPersonneReference || undefined,
      }
      await onSubmit(cleanedData)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // L'erreur est gérée par le store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier le client' : 'Ajouter un client'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    {selectedType === 'INDIVIDU' ? (
                      <FaUser className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FaBuilding className="h-4 w-4 text-muted-foreground" />
                    )}
                    <FormLabel>
                      Type <span className="text-destructive">*</span>
                    </FormLabel>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INDIVIDU">Individu</SelectItem>
                      <SelectItem value="ENTREPRISE">Entreprise / ONG</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    {selectedType === 'ENTREPRISE' ? (
                      <FaBuilding className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FaUser className="h-4 w-4 text-muted-foreground" />
                    )}
                    <FormLabel>
                      {selectedType === 'ENTREPRISE' ? 'Nom de l\'organisation' : 'Nom complet'}{' '}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      placeholder={
                        selectedType === 'ENTREPRISE'
                          ? 'Nom de l\'organisation / ONG'
                          : 'Nom complet'
                      }
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType === 'ENTREPRISE' && (
              <FormField
                control={form.control}
                name="nomPersonneReference"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FaUserTie className="h-4 w-4 text-muted-foreground" />
                      <FormLabel>
                        Nom de la personne de référence{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Nom complet de la personne de référence"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FaPhone className="h-4 w-4 text-muted-foreground" />
                    <FormLabel>
                      {selectedType === 'ENTREPRISE'
                        ? 'Téléphone de la personne de référence'
                        : 'Téléphone'}{' '}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
