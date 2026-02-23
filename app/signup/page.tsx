import { SignupForm } from '@/components/auth/SignupForm'

export const metadata = {
  title: 'Inscription | Store Gadjet',
  description: 'Créez votre compte Store Gadjet',
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4 relative">
      <SignupForm />
    </div>
  )
}
