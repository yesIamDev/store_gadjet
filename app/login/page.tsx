import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Connexion | Store Gadjet',
  description: 'Connectez-vous à votre compte Store Gadjet',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4 relative">
      <LoginForm />
    </div>
  )
}
